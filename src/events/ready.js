const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await client.user.setPresence({ status: "idle" });
        const status = [
            {
                type: ActivityType.Custom,
                name: "customstatus",
                state: "Being developed...",
            },
            {
                type: ActivityType.Watching,
                name: `${client.guilds.cache.size} servers`,
                state: `${client.guilds.cache.size} servers`,
            },
            {
                type: ActivityType.Watching,
                name: `${client.users.cache.size} users`,
                state: `${client.users.cache.size} users`,
            },
            {
                type: ActivityType.Listening,
                name: `your unreasonable demands...`,
                state: `Listening to your unreasonable demands...`,
            },
        ];
        setInterval(async () => {
            client.user.setActivity(status[Math.floor(Math.random() * status.length)]);
        }, 1000 * 60);
        // let month = Date.now();
        // const months = 30 * 24 * 60 * 60 * 1000;
        // month = month + months;
        // month = month / 1000;
        // console.log(month);
        console.log(`[BOT] Ready! ${client.user.tag} is online!`.green);
    },
};
