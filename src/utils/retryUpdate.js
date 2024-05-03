const UserDatabase = require("../models/userSchema");

const retryUpdate = async (updateQuery) => {
    const failedDocuments = await UserDatabase.find({
        "data.timeBasedStats.dailyMessages": { $ne: 0 },
    });
    if (failedDocuments.length > 0) {
        console.log(`${failedDocuments.length} documents failed to update. Retrying...`);
        for (const doc of failedDocuments) {
            await UserDatabase.updateOne({ _id: doc._id }, { $set: updateQuery });
        }
    }
    const checkFailedDocuments = await UserDatabase.find({
        "data.timeBasedStats.dailyMessages": { $ne: 0 },
    });
    if (checkFailedDocuments.length > 0) {
        return false;
    } else {
        return true;
    }
};

module.exports = retryUpdate;
