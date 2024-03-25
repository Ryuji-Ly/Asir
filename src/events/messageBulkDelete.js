var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
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
    } catch (error) {
        console.log(error);
        return null;
    }
};
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
async function createDeletedMessagesDescription(array) {
    let description = "";
    for (let i = array.length - 1; i >= 0; i--) {
        const message = array[i];
        let messageContent = `[${message.author.username}]: ${message.content}`;
        if (message.author.bot) {
            messageContent = `[BOT] ${messageContent}`;
        }
        if (message.content === "") messageContent = `${messageContent} sent an attachment(s)`;
        const attachmentArray = [...message.attachments.values()];
        const stickerArray = [...message.stickers.values()];
        if (stickerArray.length !== 0) {
            let string = "";
            for (let i = 0; i < stickerArray.length; i++) {
                string += `${stickerArray[i].name}`;
            }
            messageContent += `\nSticker: ${string}`;
        }
        if (attachmentArray.length !== 0) {
            for (let i = 0; i < attachmentArray.length; i++) {
                await uploadImage(attachmentArray[i].url).then(async (imageUrl) => {
                    if (imageUrl === null) {
                        console.log("[MESSAGE BULK DELETE] Could not upload image to imgur".red);
                        messageContent += `\n${attachmentArray[i].name} - [View](${attachmentArray[i].url})`;
                    } else {
                        messageContent += `\n${attachmentArray[i].name} - [View](${imageUrl})`;
                    }
                });
            }
        }
        description += messageContent + "\n";
    }
    return description;
}
async function sendEmbedWithChunks(logchannnel, chunks, channel, numberDeleted) {
    if (!chunks || chunks.length === 0) return;
    const totalChunks = chunks.length;
    const embeds = [];
    if (totalChunks === 1) {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`${numberDeleted} Messages Purged in ${channel}`)
            .setDescription(chunks.shift())
            .setFooter({ text: `${numberDeleted} latest shown` })
            .setTimestamp();
        embeds.push(embed);
    } else {
        const firstEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`${numberDeleted} Messages Purged in ${channel}`)
            .setDescription(chunks.shift())
            .setFooter({ text: `${numberDeleted} latest shown [1/${totalChunks}]` })
            .setTimestamp();
        embeds.push(firstEmbed);
    }
    let currentChunk = 1;

    for (const chunk of chunks) {
        const subsequentEmbed = new EmbedBuilder();
        subsequentEmbed.setTitle(null);
        subsequentEmbed.setDescription(chunk);
        subsequentEmbed.setFooter({
            text: `${numberDeleted} latest shown [${currentChunk + 1}/${totalChunks}]`,
        });
        subsequentEmbed.setColor("Red");
        subsequentEmbed.setTimestamp();
        currentChunk++;
        embeds.push(subsequentEmbed);
    }

    for (const embed of embeds) {
        await logchannnel.send({ embeds: [embed] });
    }
}

module.exports = {
    name: "messageDeleteBulk",
    async execute(messages, channel, client) {
        const config = await client.configs.get(channel.guild.id);
        if (config.messageLogChannelId !== "") {
            const logchannel = await channel.guild.channels.cache.get(config.messageLogChannelId);
            if (logchannel) {
                if (config.messageLogs[2].value) {
                    const array = [...messages.values()];
                    const description = await createDeletedMessagesDescription(array);
                    const chunks = chunkDescription(description);
                    await sendEmbedWithChunks(logchannel, chunks, channel, array.length);
                }
            } else console.log(`[MESSAGE BULK DELETE] Could not find message log channel`.red);
        }
        return;
    },
};
