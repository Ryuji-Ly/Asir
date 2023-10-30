const { model, Schema } = require("mongoose");

module.exports = model(
    "CommandsCounter",
    new Schema({
        userId: String,
        guildId: String,
        Counter: Array,
    })
);
