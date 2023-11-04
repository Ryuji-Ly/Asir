var colors = require("colors");
colors.enable();
const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        const status = await client.user.setPresence({
            status: "idle",
            activities: [
                {
                    type: ActivityType.Custom,
                    name: "customstatus",
                    state: "Being developed...",
                },
            ],
        });
        console.log(`[BOT] Ready! ${client.user.tag} is online!`.green);
    },
};
