var colors = require("colors");
colors.enable();
const UserDatabase = require("../models/userSchema");
const parseMilliseconds = require("parse-ms-2");
const { EmbedBuilder, GuildMember, Client, WebhookClient } = require("discord.js");
const MAX_EMBED_DESCRIPTION_LENGTH = 4000; // Discord's max character limit for an embed's description

module.exports = {
    name: "guildMemberRemove",
    /**
     *
     * @param {GuildMember} member
     * @param {Client} client
     * @returns
     */
    async execute(member, client) {
        if (member.bot) return;
        async function sendEmbed(webhookClient, member, data) {
            const jsonData = JSON.stringify(data, null, 2);
            const embedAuthor = `${member.user.tag} has left ${member.guild.name}`;
            if (jsonData.length <= MAX_EMBED_DESCRIPTION_LENGTH - 10) {
                const fullMessageWithCodeBlock = `\`\`\`json\n${jsonData}\n\`\`\``;
                try {
                    await webhookClient.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(embedAuthor)
                                .setDescription(fullMessageWithCodeBlock)
                                .setColor("Red")
                                .setTimestamp(),
                        ],
                    });
                } catch (error) {
                    console.error("Failed to send embed:", error);
                }
            } else {
                // Chunk the JSON message without code blocks first, then wrap each chunk with the code block.
                const chunks = chunkString(jsonData, MAX_EMBED_DESCRIPTION_LENGTH - 10); // Leave room for code block syntax.
                for (const chunk of chunks) {
                    const chunkWithCodeBlock = `\`\`\`json\n${chunk}\n\`\`\``; // Wrap each chunk with code block
                    try {
                        await webhookClient.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(embedAuthor)
                                    .setDescription(chunkWithCodeBlock)
                                    .setColor("Red")
                                    .setTimestamp(),
                            ],
                        });
                    } catch (error) {
                        console.error("Failed to send chunked embed:", error);
                    }
                }
            }
        }

        function chunkString(str, size) {
            const numChunks = Math.ceil(str.length / size);
            const chunks = new Array(numChunks);
            for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
                chunks[i] = str.substr(o, size);
            }
            return chunks;
        }
        const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
        const data = await UserDatabase.findOne({
            key: { userId: member.user.id, guildId: member.guild.id },
        });
        if (data) {
            await sendEmbed(webhookClient, member, data);
        }
        await UserDatabase.deleteMany({
            key: { userId: member.user.id, guildId: member.guild.id },
        });
        const config = await client.configs.get(member.guild.id);
        if (!config) return;
        if (config.channels.welcome !== "") {
            const guild = member.guild;
            try {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === config.channels.welcome
                );
                if (!channel)
                    return console.log(
                        `[GUILD] Could not find welcome channel for ${member.guild.name}`.red
                    );
                const duration = Date.now() - member.joinedAt;
                const { days, hours, minutes, seconds } = parseMilliseconds(duration);
                const memberRoles = member.roles.cache
                    .filter((r) => r.id !== member.guild.id)
                    .map((r) => r)
                    .join(" ");
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: member.user.tag,
                        iconURL: member.user.avatarURL(),
                    })
                    .setTitle(`Member left`)
                    .setDescription(
                        `${member} has left **${member.guild.name}.**\n\nUser joined ${days} days ${hours} hours ${minutes} minutes and ${seconds} seconds ago.\n${memberRoles}`
                    )
                    .setColor("DarkGrey")
                    .setTimestamp();
                channel.send({ embeds: [embed] });
            } catch (error) {
                console.log(`[GUILD] Error with new member leaving: ${error}`.red);
            }
            return;
        } else {
            return;
        }
    },
};
