var colors = require(`colors`);
const { WebhookClient, EmbedBuilder } = require("discord.js");
colors.enable();

module.exports = {
    name: "error",
    async execute(error, client) {
        const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `[BOT]` })
            .setDescription(`\`\`\`ansi\n[0;31m[BOT] ${error}\`\`\``);
        webhookClient.send({ embeds: [embed] }).catch((e) => {
            console.log(e);
        });
        console.log(`[BOT] ${error.stack}\n${new Date(Date.now())}`.red);
        return;
    },
};
