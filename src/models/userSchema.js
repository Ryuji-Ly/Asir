const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    key: {
        type: Object,
        default: { userId: String, guildId: String },
        require: true,
        unique: true,
        index: true,
    },
    economy: {
        type: Object,
        default: {
            wallet: 0,
            bank: 0,
            items: [],
        },
        index: true,
    },
    level: {
        type: Object,
        default: {
            level: 1,
            xp: 0,
        },
        index: true,
    },
    cooldowns: {
        type: Array,
        default: [],
        index: true,
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
            timeBasedStats: {
                dailyMessages: 0,
                weeklyMessages: 0,
                monthlyMessages: 0,
                yearlyMessages: 0,
                totalMessages: [],
            },
        },
        index: true,
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
