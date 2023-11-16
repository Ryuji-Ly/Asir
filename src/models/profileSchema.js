const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const profileSchema = new mongoose.Schema({
    dataId: {
        type: String,
        default: randomUUID,
    },
    userId: {
        type: String,
        require: true,
    },
    guildId: {
        type: String,
        require: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    cooldowns: {
        type: Array,
        default: [],
    },
    shopItems: {
        type: Array,
        default: [],
    },
    itemEffects: {
        type: Array,
        default: [],
    },
    customRoleCount: {
        type: Number,
        default: 0,
    },
    commandCounter: {
        type: Array,
        default: [],
    },
    messageCounter: {
        type: Number,
        default: 0,
    },
    blacklistedCommands: {
        type: Array,
        default: [],
    },
    warnings: {
        type: Number,
        default: 0,
    },
    infractions: {
        type: Array,
        default: [],
    },
});

const model = mongoose.model("userdatabase", profileSchema);

module.exports = model;
