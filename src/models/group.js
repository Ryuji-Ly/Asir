const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    groupName: {
        type: String,
        required: true,
    },
    groupDescription: {
        type: String,
        default: "",
    },
    groupImg: {
        type: String,
        default: "",
    },
    groupLeaderId: {
        type: String,
        required: true,
    },
    groupMemberIds: {
        type: Array,
        default: [],
    },
    groupMemberLimit: {
        type: Number,
        default: 5,
    },
    groupMultiplier: {
        type: Number,
        default: 1.2,
    },
    groupBalance: {
        type: Number,
        default: 0,
    },
    groupRoleId: {
        type: String,
        default: 0,
    },
    groupChannelId: {
        type: String,
        default: 0,
    },
    groupTotalCosts: {
        type: Number,
        default: 50000,
    },
});

const model = mongoose.model("group", groupSchema);

module.exports = model;
