var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage, client) {
        const config = await client.configs.get(oldMessage.guild.id);
        if (oldMessage.author.bot) return;
        if (config.messageLogChannelId !== "") {
            const channel = await oldMessage.guild.channels.cache.get(config.messageLogChannelId);
            if (channel) {
                if (config.messageLogs[1].value) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: oldMessage.author.username,
                            iconURL: oldMessage.author.avatarURL(),
                        })
                        .setColor("Purple")
                        .setTitle(`Message Edited in ${oldMessage.channel}`)
                        .setDescription(
                            `Message ID: ${oldMessage.id}\nMessage Link: [Click me](https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id})`
                        )
                        .setFooter({ text: `ID: ${oldMessage.author.id}` })
                        .setTimestamp();
                    embed.addFields(
                        { name: "Before", value: `${oldMessage.content}` },
                        { name: "After", value: `${newMessage.content}` }
                    );
                    await channel.send({ embeds: [embed] });
                }
            }
        }
        return;
    },
};
