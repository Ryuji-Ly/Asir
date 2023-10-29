const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
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
});

const model = mongoose.model("users", profileSchema);

module.exports = model;
