const { Schema, model } = require("mongoose");

const guildConfigurationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    modRoleid: {
        type: String,
        default: "",
    },
    welcomeChannelId: {
        type: String,
        default: "",
    },
    suggestionChannelIds: {
        type: [String],
        default: [],
    },
    ignoredStealUserIds: {
        type: Array,
        default: [],
    },
    eventEffects: {
        type: Array,
        default: [],
    },
    rankRoles: {
        type: Array,
        default: [],
    },
    groupCategoryId: {
        type: String,
        default: "",
    },
    introductionChannelId: {
        type: String,
        default: "",
    },
    introductionRoleId: {
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
    ticketSubject: {
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
    minigameChannelIds: {
        type: Array,
        default: [],
    },
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
    customRoleLimit: {
        type: Number,
        default: 5,
    },
    slotsTotal: {
        type: Number,
        default: 0,
    },
    xpBaseRequirement: {
        type: Number,
        default: 100,
    },
    blacklist: {
        type: Array,
        default: [],
    },
});

module.exports = model("guildConfiguration", guildConfigurationSchema);
