const UserDatabase = require("./src/models/userSchema");
const mongoose = require("mongoose");
require("dotenv").config();

(async () => {
    await mongoose
        .connect(process.env.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("[DATABASE] Connected to the database!");
        })
        .catch((err) => {
            console.log(`[DATABASE] Error with connecting to database: ${err.stack}`);
        });
})();

const fix = async () => {
    const UserData = await UserDatabase.findOne({
        key: { userId: "348902272534839296", guildId: "1161001645698715698" },
    });
    console.log(UserData);
    const distinctUserGuildIds = await UserDatabase.find();
    const uniqueCombinations = new Set();
    distinctUserGuildIds.forEach((key) => {
        const { userId, guildId } = key.key;
        uniqueCombinations.add(`${userId}-${guildId}`);
    });
    for (const combination of uniqueCombinations) {
        const [userId, guildId] = combination.split("-");
        // Find the user document by userId and guildId
        const userDocument = await UserDatabase.findOne({
            "key.userId": userId,
            "key.guildId": guildId,
        });

        if (userDocument) {
            // Aggregate and sum values for each unique command
            const commandSummaries = userDocument.data.commands.reduce((summaryMap, command) => {
                const { name, value } = command;
                if (!summaryMap[name]) {
                    summaryMap[name] = 0;
                }
                summaryMap[name] += value;
                return summaryMap;
            }, {});
            // Prepare updated commands array
            const updatedCommands = Object.keys(commandSummaries).map((name) => ({
                name,
                value: commandSummaries[name],
            }));

            // Update the user document with consolidated command data
            await UserDatabase.findOneAndUpdate(
                { "key.userId": userId, "key.guildId": guildId },
                {
                    $set: {
                        "data.commands": updatedCommands,
                    },
                },
                { new: true }
            );

            console.log(
                `Commands consolidated and duplicates removed for user ${userId} in guild ${guildId}`
            );
        }
    }
};

// fix();
