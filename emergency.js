const UserModel = require("./src/models/userSchema");
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

async function clearAllCooldowns() {
    try {
        const result = await UserModel.updateMany({}, { $set: { cooldowns: [] } });
        console.log(`${result.modifiedCount} documents updated.`);

        console.log("User cooldowns cleared.");
    } catch (error) {
        console.error("Error updating users:", error);
    }
}
async function resetCommandCounter() {
    try {
        const result = await UserModel.updateMany(
            { "key.userId": "348902272534839296" },
            { $set: { "data.commands": [] } }
        );
        console.log(`${result.modifiedCount} documents updated.`);

        console.log("User command counters reset.");
    } catch (error) {
        console.error("Error updating users:", error);
    }
}
async function removeDuplicateCommandCounters() {
    const users = await UserModel.find();

    for (const user of users) {
        const commandCounters = user.data.commands;
        const commandMap = {};

        // Merge duplicates by summing their values
        for (const command of commandCounters) {
            if (commandMap[command.name]) {
                commandMap[command.name] += command.value;
            } else {
                commandMap[command.name] = command.value;
            }
        }
        // Create a new array of unique command counters
        const uniqueCommands = Object.keys(commandMap).map((name) => ({
            name,
            value: commandMap[name],
        }));

        // Update the user's document with the deduplicated command counters
        await UserModel.updateOne({ _id: user._id }, { "data.commands": uniqueCommands });
    }
    console.log("Duplicate command counters merged successfully.");
}

async function resetTsukiMinigameStats() {
    try {
        const result = await UserModel.updateMany(
            { "key.userId": "1228411912169980115" },
            { $set: { "data.minigameStats": [] } }
        );
        console.log("User minigame stats reset.");
    } catch (error) {
        console.error("Error updating users:", error);
    }
}

async function resetMentions() {
    try {
        const result = await UserModel.updateMany({}, { $set: { "data.mentioned": [] } });
        console.log(`${result.modifiedCount} documents updated.`);

        console.log("User mentions cleared.");
    } catch (error) {
        console.error("Error updating users:", error);
    }
}

// Call the function to update users with default timeBasedStats
// clearAllCooldowns();
// resetCommandCounter();
// removeDuplicateCommandCounters();
// resetTsukiMinigameStats();
resetMentions();
