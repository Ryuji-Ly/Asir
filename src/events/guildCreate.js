var colors = require("colors");
colors.enable();
const ServerConfig = require("../models/serverConfigs");

module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        const data = await ServerConfig.create({ guildId: guild.id });
        client.configs.set(guild.id, data);
        console.log(`[BOT] Joined ${guild.name}`.cyan);
    },
};
