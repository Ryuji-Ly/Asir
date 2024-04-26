var colors = require("colors");
colors.enable();
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client) {
        const config = await client.configs.get(oldMessage.guild.id);
        function chunkDescription(description) {
            const chunks = [];
            const maxChunkLength = 4000;
            let currentChunk = "";
            for (const line of description.split("\n")) {
                if (currentChunk.length + line.length > maxChunkLength) {
                    chunks.push(currentChunk);
                    currentChunk = "";
                }
                currentChunk += line + "\n";
            }
            if (currentChunk) {
                chunks.push(currentChunk);
            }

            return chunks;
        }
        async function sendChunkedEmbeds(channel, embed, description) {
            const descriptionChunks = chunkDescription(description);
            const firstEmbed = new EmbedBuilder(embed);
            firstEmbed.setDescription(descriptionChunks.shift());
            await channel.send({ embeds: [firstEmbed] });
            for (const chunk of descriptionChunks) {
                const subsequentEmbed = new EmbedBuilder(embed);
                subsequentEmbed.setTitle(null);
                subsequentEmbed.setDescription(chunk);
                await channel.send({ embeds: [subsequentEmbed] });
            }
        }
        if (oldMessage.author.bot) return;
        if (config.channels.messageLog !== "") {
            const channel = await oldMessage.guild.channels.cache.get(config.channels.messageLog);
            if (channel) {
                if (config.moderation.messageLogs.edited) {
                    if (oldMessage.content === newMessage.content) return;
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: oldMessage.author.username,
                            iconURL: oldMessage.author.avatarURL(),
                        })
                        .setColor("Purple")
                        .setTitle(`Message Edited in ${oldMessage.channel}`)
                        .setDescription(`Initial description`)
                        .setFooter({ text: `ID: ${oldMessage.author.id}` })
                        .setTimestamp();
                    const string = `Message ID: ${oldMessage.id}\nMessage Link: [Click me](https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id})\n\n**Before**: ${oldMessage.content}\n**+After**: ${newMessage.content}`;
                    await sendChunkedEmbeds(channel, embed, string);
                }
            } else console.log(`[MESSAGE UPDATE] Could not find message log channel`.red);
        }
        return;
    },
};
