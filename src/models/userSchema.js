const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    key: {
        type: Object,
        default: { userId: String, guildId: String },
        require: true,
        unique: true,
    },
    economy: {
        type: Object,
        default: {
            wallet: 0,
            bank: 0,
            items: [],
        },
    },
    level: {
        type: Object,
        default: {
            level: 1,
            xp: 0,
        },
    },
    cooldowns: {
        type: Array,
        default: [],
    },
    data: {
        type: Object,
        default: {
            commands: [],
            messages: 0,
            mentions: [],
            mentioned: [],
            warnings: 0,
            infractions: [],
            minigameStats: [],
            gambleStats: [],
            blacklistedCommands: [],
            customRoleCount: 0,
            shopStats: [],
            timeBasedStats: [],
        },
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

const model = mongoose.model("database", profileSchema);

module.exports = model;
