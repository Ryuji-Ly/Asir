var colors = require(`colors`);
colors.enable();
const guildConfiguration = require(`../models/guildConfiguration`);
const ProfileModel = require(`../models/profileSchema`);
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildAuditLogEntryCreate",
    async execute(auditLogEntry, guild, client) {
        return;
    },
};
