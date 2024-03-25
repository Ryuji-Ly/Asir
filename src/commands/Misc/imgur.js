const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    WebhookClient,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");
const axios = require("axios");
async function checkImage(url) {
    const res = await fetch(url);
    const buff = await res.blob();

    return buff.type.startsWith("image/");
}
var colors = require("colors");
colors.enable();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("imgur")
        .setDescription("Upload an image to imgur!")
        .addStringOption((option) => option.setName("url").setDescription("URL of the image"))
        .addAttachmentOption((option) =>
            option.setName("attachment").setDescription("Attachment of the image")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const url = options.getString("url");
        const attachment = options.getAttachment("attachment");
        let cooldown = 0;
        if (config.cooldowns.filter((c) => c.name === interaction.commandName).length > 0) {
            cooldown = config.cooldowns.find((c) => c.name === interaction.commandName).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        if (!url && !attachment) {
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Please provide a URL or an attachment")
                .setColor("Red");
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        if (url && attachment) {
            const embed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Please provide only a URL or an attachment")
                .setColor("Red");
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
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
        if (url) {
            if (await checkImage(url)) {
                const embed = new EmbedBuilder().setDescription("Uploading...").setColor("Green");
                await interaction.reply({ embeds: [embed] });
                await uploadImage(url).then(async (imageUrl) => {
                    if (imageUrl === null) {
                        const embed = new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("Error uploading image")
                            .setColor("Red");
                        await interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    embed.setDescription(`Upload successful!`).setImage(imageUrl);
                    await interaction.editReply({ embeds: [embed] });
                });
                return;
            } else {
                const embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("URL is not an image")
                    .setColor("Red");
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        }
        if (attachment) {
            if (attachment.contentType.startsWith("image/")) {
                const embed = new EmbedBuilder().setDescription("Uploading...").setColor("Green");
                await interaction.reply({ embeds: [embed] });
                await uploadImage(attachment.url).then(async (imageUrl) => {
                    if (imageUrl === null) {
                        const embed = new EmbedBuilder()
                            .setTitle("Error")
                            .setDescription("Error uploading image")
                            .setColor("Red");
                        await interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    embed.setDescription(`Upload successful!`).setImage(imageUrl);
                    await interaction.editReply({ embeds: [embed] });
                });
                return;
            } else {
                const embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setDescription("Attachment is not an image")
                    .setColor("Red");
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        }
        return;
    },
};
