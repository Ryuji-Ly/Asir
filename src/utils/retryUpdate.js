const retryUpdate = async (Model, condition, updateQuery, maxRetries = 3) => {
    let success = false;
    let retries = 0;
    while (!success && retries < maxRetries) {
        const failedDocuments = await Model.find(condition);

        if (failedDocuments.length > 0) {
            console.log(`${failedDocuments.length} documents failed to update. Retrying...`);
            for (const doc of failedDocuments) {
                await Model.findOneAndUpdate({ _id: doc._id }, { $set: updateQuery });
            }
            retries++;
        } else {
            success = true;
        }
    }
    if (!success) {
        console.log(`Retry limit (${maxRetries}) reached. Some documents could not be updated.`);
    }
    return success;
};

module.exports = retryUpdate;
