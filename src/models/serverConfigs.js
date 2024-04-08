const mongoose = require("mongoose");

const serverConfigSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    channels: {
        type: Array,
        default: [
            { name: "welcome", value: "" },
            { name: "suggestions", value: [] },
            { name: "report", value: "" },
            { name: "modLog", value: "" },
            { name: "memberLog", value: "" },
            { name: "messageLog", value: "" },
            { name: "voiceLog", value: "" },
            { name: "ticket", value: [] },
            { name: "level", value: "" },
            { name: "restricted", value: [] },
            { name: "blacklisted", value: [] },
            { name: "minigame", value: [] },
        ],
    },
    moderation: {
        type: Array,
        default: [
            { name: "warnLimit", value: 3 },
            { name: "timeoutDuration", value: 1000 * 60 * 60 },
            {
                name: "modLogs",
                value: [
                    { name: "warn", value: true },
                    { name: "timeout", value: true },
                    { name: "kick", value: true },
                    { name: "ban", value: true },
                ],
            },
            {
                name: "memberLogs",
                value: [
                    { name: "role", value: true },
                    { name: "name", value: true },
                    { name: "avatar", value: true },
                ],
            },
            {
                name: "messageLogs",
                value: [
                    { name: "deleted", value: true },
                    { name: "edited", value: true },
                    { name: "purged", value: true },
                ],
            },
            {
                name: "voiceLogs",
                value: [
                    { name: "join", value: true },
                    { name: "move", value: true },
                    { name: "leave", value: true },
                ],
            },
            { name: "blacklistedWords", value: [] },
        ],
    },
    level: {
        type: Array,
        default: [
            { enabled: true },
            { xpGainMin: 1 },
            { xpGainMax: 20 },
            { xpGainTime: 1000 * 60 },
            { xpBaseRequirement: 100 },
            { xpScaling: "multiply" },
            { ranks: [] },
            { multiplier: true },
            { levelMessage: "{user} has leveled up to {level}" },
        ],
    },
    economy: {
        type: Array,
        default: [
            { enabled: true },
            { currency: "Karma coins" },
            { currencySymbol: "🪷" },
            { currencyGainMin: 5 },
            { currencyGainMax: 5 },
            { currencyGainTime: 1000 * 60 },
            { baseBalance: 100 },
            { dailyMin: 50 },
            { dailyMax: 100 },
            { coinflipReward: 100 },
            { minigameReward: 500 },
            { multiplier: true },
            { multiplierBaseCost: 10000 },
            { multiplierUncrement: 0.2 },
            { multiplierCostScaling: "multiply" },
            { multiplierMax: 5 },
            { customRoles: true },
            { customRoleCost: 20000 },
            { customRolePosition: "" },
            { customRoleLimit: 5 },
            { shopRoles: [] },
            { shopItems: [] },
            { groups: false },
            { group: "Group" },
            { groupBaseCost: 10000 },
            { groupBaseUsers: 5 },
            { groupMultiplier: true },
            { groupMultiplierBaseCost: 50000 },
            { groupMultiplierIncrement: 0.2 },
            { groupCostScaling: "multiply" },
            { groupCategory: "" },
            { groupRolePosition: "" },
        ],
    },
    commands: {
        type: Array,
        default: [
            { disabled: [] },
            { blacklistedUsers: [] },
            { blacklistedUserCommands: [] },
            { blacklistedChannelCommands: [] },
            { cooldowns: [] },
            { defaultMinigameCooldown: 1000 * 60 * 3 },
        ],
    },
    data: {
        type: Array,
        default: [{ slotsTotal: 0 }, { slotsCurrent: 0 }, { totalSpent: 0 }, { muted: [] }],
    },
});

const model = mongoose.model("serverConfigs", serverConfigSchema);

module.exports = model;
