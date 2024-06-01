const { SlashCommandBuilder, Interaction, EmbedBuilder, Client } = require("discord.js");
const mongoose = require("mongoose");
const UserDatabase = require("../../models/userSchema");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    /**
     *
     *
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, config) {
        let circles = {
            good: "<:good:1187430882592702464>",
            okay: "<:mid:1187430913160777859>",
            bad: "<:low:1187430927853441064>",
        };
        await interaction.deferReply();
        const pinging = await interaction.editReply({ content: "*Pinging...*" });
        const ws = interaction.client.ws.ping;
        const msgEdit = Date.now() - pinging.createdTimestamp;
        const days = Math.floor(interaction.client.uptime / 86400000);
        const hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        const minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        const seconds = Math.floor(interaction.client.uptime / 1000) % 60;
        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

        // Measure database ping
        const dbStart = Date.now();
        try {
            await UserDatabase.findOne({}); // Simple query to measure database latency
            const dbPing = Date.now() - dbStart;
            const dbEmoji =
                dbPing <= 100 ? circles.good : dbPing <= 200 ? circles.okay : circles.bad;

            const embed = new EmbedBuilder()
                .setThumbnail(client.user.displayAvatarURL())
                .setColor("Blurple")
                .setTimestamp()
                .setFooter({ text: "Pinged at" })
                .addFields(
                    {
                        name: "Websocket",
                        value: `${wsEmoji} \`${ws}ms\``,
                    },
                    {
                        name: "API Latency",
                        value: `${msgEmoji} \`${msgEdit}ms\``,
                    },
                    {
                        name: "Database Latency",
                        value: `${dbEmoji} \`${dbPing}ms\``,
                    },
                    {
                        name: `${client.user.username} Uptime`,
                        value: `:clock10: \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``,
                    }
                );
            await pinging.edit({ embeds: [embed], content: "Pong!" });
        } catch (error) {
            console.error("Database ping error:", error);
            await pinging.edit({ content: "Error pinging the database." });
        }
        return;
    },
};
