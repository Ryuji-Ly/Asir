var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageDelete",
    async execute(message, client) {
        const config = await client.configs.get(message.guild.id);
        if (message.author.bot) return;
        if (config.messageLogChannelId !== "") {
            const channel = await message.guild.channels.cache.get(config.messageLogChannelId);
            if (channel) {
                if (config.messageLogs[0].value) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.avatarURL(),
                        })
                        .setColor("Red")
                        .setTitle(`Message deleted in ${message.channel}`)
                        .setDescription(`Message ID: ${message.id}`)
                        .setFooter({ text: `ID: ${message.author.id}` })
                        .setTimestamp();
                    if (message.content !== "") {
                        embed.addFields({ name: "Message Content", value: `${message.content}` });
                    }
                    const stickerArray = [...message.stickers.values()];
                    const attachmentArray = [...message.attachments.values()];
                    if (stickerArray.length !== 0) {
                        let string = "";
                        for (let i = 0; i < stickerArray.length; i++) {
                            string += `${stickerArray[i].name}\n`;
                        }
                        embed.addFields({
                            name: "Message Stickers",
                            value: `${string}`,
                        });
                    }
                    if (attachmentArray.length !== 0) {
                        let string = "";
                        for (let i = 0; i < attachmentArray.length; i++) {
                            string += `${attachmentArray[i].name} - [View](${attachmentArray[i].url})\n`;
                        }
                        embed
                            .addFields({
                                name: "Message Attachments",
                                value: `${string}`,
                            })
                            .setFooter({
                                text: `ID: ${message.author.id}`,
                            });
                    }
                    await channel.send({ embeds: [embed] });
                    return;
                }
            } else console.log(`[MESSAGE DELETE] Could not find message log channel`.red);
        }
        return;
    },
};
