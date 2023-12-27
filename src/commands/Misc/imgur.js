const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const { ImgurClient } = require("imgur");
const ProfileModel = require("../../models/profileSchema");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("imgur")
        .setDescription("Upload an image to imgur")
        .addAttachmentOption((option) =>
            option.setName("file").setDescription("Must be an image file")
        )
        .addStringOption((option) =>
            option.setName("url").setDescription("Must be a valid image url")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        return interaction.reply({ content: "This is not working...", ephemeral: true });
        const imgur = new ImgurClient({
            clientId: process.env.client_id,
            clientSecret: process.env.client_secret,
        });
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const attach = options.getAttachment("file");
        const url = options.getString("url");
        if (url && attach)
            return await interaction.reply({
                content: "You can only use one of the options",
                ephemeral: true,
            });
        if (!url && !attach)
            return await interaction.reply({
                content: "You must use one of the options",
                ephemeral: true,
            });
        if (url) {
            const response = await imgur.upload({ image: url, type: "url" });
            console.log(response.data.type);
        }
        if (attach) {
            const url = attach.url;
            return interaction.reply("File");
        }
        return;
    },
};
