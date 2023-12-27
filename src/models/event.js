const mongoose = require("mongoose");

const Messagecount = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    guildId: {
        type: String,
        require: true,
    },
    messageCount: {
        type: Number,
        default: 0,
    },
});

const model = mongoose.model("Event_MessageCount", Messagecount);

module.exports = model;
