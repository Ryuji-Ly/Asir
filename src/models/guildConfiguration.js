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
    logChannelId: {
        type: String,
        default: "",
    },
    ticketChannelId: {
        type: String,
        default: "",
    },
    ticketSubject: {
        type: String,
        default: "",
    },
    slotsTotal: {
        type: Number,
        default: 0,
    },
});

module.exports = model("guildConfiguration", guildConfigurationSchema);
