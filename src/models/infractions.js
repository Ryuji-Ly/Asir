const { model, Schema } = require("mongoose");

module.exports = model(
    "Infractions",
    new Schema({
        userId: String,
        guildId: String,
        infractions: Array,
    })
);
