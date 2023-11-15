const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option.setName("user").setDescription("The user you want to warn").setRequired(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const config = await client.configs.get(interaction.guild.id);
        const user = interaction.options.getMember("user");
        if (user.bot) return interaction.reply({ content: "This is a bot", ephemeral: true });
        if (user.id === interaction.user.id)
            return interaction.reply({ content: "You cannot warn yourself", ephemeral: true });
        if (!user.moderatable)
            return interaction.reply({
                content: "This user cannot be warned by you or me",
                ephemeral: true,
            });
        const data = await ProfileModel.findOne({ guildId: interaction.guild.id, userId: user.id });
        return;
    },
};
