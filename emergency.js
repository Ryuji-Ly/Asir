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

async function updateUsersWithDefaultTimeBasedStats() {
    try {
        // Find users where data.timeBasedStats is an empty array
        const usersToUpdate = await UserModel.find();

        if (usersToUpdate.length === 0) {
            console.log("No users found with empty timeBasedStats.");
            return;
        }

        // Update each user to set data.timeBasedStats to the new default structure
        await Promise.all(
            usersToUpdate.map(async (user) => {
                await UserModel.findByIdAndUpdate(user._id, {
                    "data.timeBasedStats": {
                        dailyMessages: 0,
                        weeklyMessages: 0,
                        monthlyMessages: 0,
                        yearlyMessages: 0,
                        totalMessages: [],
                    },
                });
            })
        );

        console.log("Users updated with default timeBasedStats successfully.");
    } catch (error) {
        console.error("Error updating users:", error);
    }
}

// Call the function to update users with default timeBasedStats
updateUsersWithDefaultTimeBasedStats();
