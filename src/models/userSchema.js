const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    key: {
        type: Object,
        default: { userId: String, guildId: String },
        require: true,
        unique: true,
    },
    economy: {
        type: Array,
        default: [
            { name: "wallet", value: 0 },
            { name: "bank", value: 0 },
            { name: "items", value: [] },
        ],
    },
    level: {
        type: Array,
        default: [
            { name: "level", value: 1 },
            { name: "xp", value: 0 },
        ],
    },
    cooldowns: {
        type: Array,
        default: [],
    },
    data: {
        type: Array,
        default: [
            { name: "commands", value: [] },
            { name: "messages", value: 0 },
            { name: "mentions", value: [] },
            { name: "mentioned", value: [] },
            { name: "warnings", value: 0 },
            { name: "infractions", value: [] },
            { name: "minigameStats", value: [] },
            { name: "gambleStats", value: [] },
            { name: "blacklistedCommands", value: [] },
            { name: "customRoleCount", value: 0 },
            { name: "shopStats", value: [] },
            { name: "timeBasedStats", value: [] },
        ],
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    itemEffects: {
        type: Array,
        default: [],
    },
});

const model = mongoose.model("user", profileSchema);

module.exports = model;
