var colors = require("colors");
colors.enable();
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
async function checkImage(url) {
    const res = await fetch(url);
    const buff = await res.blob();

    return buff.type.startsWith("image/");
}
const uploadImage = async (url) => {
    try {
        const response = await axios.post(
            "https://api.imgur.com/3/image",
            {
                image: url,
                type: "URL",
            },
            {
                headers: {
                    Authorization: `Client-ID ${process.env.client_id}`,
                },
            }
        );
        const imageUrl = response.data.data.link;
        return imageUrl;
    } catch {
        return null;
    }
};

module.exports = {
    name: "messageDelete",
    async execute(message, client) {
        const config = await client.configs.get(message.guild.id);
        if (message.author.bot) return;
        if (config.channels.messageLog !== "") {
            const channel = await message.guild.channels.cache.get(config.channels.messageLog);
            if (channel) {
                if (config.moderation.messageLogs.deleted) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.avatarURL(),
                        })
                        .setColor("Red")
                        .setTitle(`Message deleted in ${message.channel}`)
                        .setDescription(
                            `Message ID: ${message.id}\nMessage Content: ${message.content}`
                        )
                        .setFooter({ text: `ID: ${message.author.id}` })
                        .setTimestamp();
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
                            if (checkImage(attachmentArray[i].url)) {
                                await uploadImage(attachmentArray[i].url).then(async (imageUrl) => {
                                    if (imageUrl === null) {
                                        string += `${attachmentArray[i].name} - [View](${attachmentArray[i].url})\n`;
                                    } else {
                                        string += `${attachmentArray[i].name} - [View](${imageUrl})\n`;
                                    }
                                });
                            } else {
                                string += `${attachmentArray[i].name} - [View](${attachmentArray[i].url})\n`;
                            }
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
                    await channel.send({ embeds: [embed] }).catch((err) => {
                        return;
                    });
                    return;
                }
            } else console.log(`[MESSAGE DELETE] Could not find message log channel`.red);
        }
        return;
    },
};
