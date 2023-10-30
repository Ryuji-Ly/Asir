var colors = require("colors");
colors.enable();
const guildConfiguration = require("../models/guildConfiguration");

module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        await guildConfiguration.create({ guildId: guild.id });
        console.log(`[BOT] Joined ${guild.name}`.cyan);
    },
};
