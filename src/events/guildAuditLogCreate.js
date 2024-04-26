var colors = require(`colors`);
colors.enable();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildAuditLogEntryCreate",
    async execute(auditLogEntry, guild, client) {
        return;
    },
};
