const mongoose = require("mongoose");

const guildConfigurationSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    // Channel ids
    welcomeChannelId: {
        type: String,
        default: "",
    },
    suggestionChannelIds: {
        type: Array,
        default: [],
    },
    ignoredStealUserIds: {
        type: Array,
        default: [],
    },
    groupCategoryId: {
        type: String,
        default: "",
    },
    reportChannelId: {
        type: String,
        default: "",
    },
    modLogChannelId: {
        type: String,
        default: "",
    },
    memberLogChannelId: {
        type: String,
        default: "",
    },
    messageLogChannelId: {
        type: String,
        default: "",
    },
    voiceLogChannelId: {
        type: String,
        default: "",
    },
    ticketChannelId: {
        type: String,
        default: "",
    },
    levelChannelId: {
        type: String,
        default: "",
    },
    ignoredChannelIds: {
        type: Array,
        default: [],
    },
    restrictedChannelIds: {
        type: Array,
        default: [],
    },
    disabledCommands: {
        type: Array,
        default: [],
    },
    minigameChannelIds: {
        type: Array,
        default: [],
    },
    // other server settings
    warnLimit: {
        type: Number,
        default: 3,
    },
    timeoutDuration: {
        type: Number,
        default: 1000 * 60 * 60,
    },
    messageLogs: {
        type: Array,
        default: [
            { name: "deleted", value: true },
            { name: "edited", value: true },
            { name: "purged", value: true },
        ],
    },
    modLogs: {
        type: Array,
        default: [
            { name: "warn", value: true },
            { name: "timeout", value: true },
            { name: "kick", value: true },
            { name: "ban", value: true },
        ],
    },
    memberLogs: {
        type: Array,
        default: [
            { name: "role", value: true },
            { name: "name", value: true },
            { name: "avatar", value: true },
        ],
    },
    voiceLogs: {
        type: Array,
        default: [
            { name: "join", value: true },
            { name: "move", value: true },
            { name: "leave", value: true },
        ],
    },
    rankRoles: {
        type: Array,
        default: [],
    },
    introQuestions: {
        type: Array,
        default: [],
    },
    ticketSubject: {
        type: String,
        default: "",
    },
    blacklistedWords: {
        type: Array,
        default: [],
    },
    Level: {
        type: Boolean,
        default: true,
    },
    Economy: {
        type: Boolean,
        default: true,
    },
    // Economy stuff
    currencyName: {
        type: String,
        default: "Causality coins",
    },
    memberMultiLimit: {
        type: Number,
        default: 5,
    },
    groupMultiLimit: {
        type: Number,
        default: 5,
    },
    randomXpMin: {
        type: Number,
        default: 1,
    },
    randomXpMax: {
        type: Number,
        default: 20,
    },
    randomCurrency: {
        type: Number,
        default: 5,
    },
    dailyMin: {
        type: Number,
        default: 50,
    },
    dailyMax: {
        type: Number,
        default: 1000,
    },
    coinflipReward: {
        type: Number,
        default: 100,
    },
    minigameReward: {
        type: Number,
        default: 500,
    },
    groupCost: {
        type: Number,
        default: 10000,
    },
    groupMultiBaseCost: {
        type: Number,
        default: 50000,
    },
    groupExpandBaseCost: {
        type: Number,
        default: 100000,
    },
    groupChannelMulti: {
        type: Number,
        default: 3,
    },
    multiplierBaseCost: {
        type: Number,
        default: 10000,
    },
    customRole: {
        type: Boolean,
        default: true,
    },
    customRoleCost: {
        type: Number,
        default: 20000,
    },
    customRoleLimit: {
        type: Number,
        default: 5,
    },
    shopItems: {
        type: Array,
        default: [],
    },
    slotsTotal: {
        type: Number,
        default: 0,
    },
    // leveling
    xpBaseRequirement: {
        type: Number,
        default: 100,
    },
    xpScaling: {
        type: String,
        default: "multiply",
    },
    blacklist: {
        type: Array,
        default: [],
    },
});

const model = mongoose.model("guildConfiguration", guildConfigurationSchema);

module.exports = model;
