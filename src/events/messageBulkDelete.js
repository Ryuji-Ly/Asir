var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageDeleteBulk",
    async execute(messages, channel, client) {
        const config = await client.configs.get(channel.guild.id);
        if (config.messageLogChannelId !== "") {
            const logchannel = await channel.guild.channels.cache.get(config.messageLogChannelId);
            if (logchannel) {
                if (config.messageLogs[2].value) {
                    const array = [...messages.values()];
                    let string = "";
                    for (let i = 0; i < array.length; i++) {
                        const index = array.length - 1 - i;
                        if (array[index].author.bot) string += "[BOT] ";
                        const attachmentArray = [...array[index].attachments.values()];
                        if (attachmentArray.length === 0) {
                            string += `[${array[index].author.username}]: ${array[index].content}\n`;
                        } else {
                            let attachString = `[${array[index].author.username}]: ${array[index].content} `;
                            for (let i = 0; i < attachmentArray.length; i++) {
                                attachString += `${attachmentArray[i].name} - [View](${attachmentArray[i].url}) `;
                            }
                            string += `${attachString}\n`;
                        }
                    }
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(`${array.length} Messages Purged in ${channel}`)
                        .setFooter({ text: `${array.length} latest shown` })
                        .setTimestamp();
                    embed.setDescription(string);
                    await logchannel.send({ embeds: [embed] });
                }
            }
        }
        return;
    },
};
