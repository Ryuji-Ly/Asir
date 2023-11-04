var colors = require("colors");
colors.enable();
const guildConfiguration = require("../models/guildConfiguration");

module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        const data = await guildConfiguration.create({ guildId: guild.id });
        client.configs.set(guild.id, data);
        console.log(`[BOT] Joined ${guild.name}`.cyan);
    },
};
