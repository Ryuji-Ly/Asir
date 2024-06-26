const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infractions-clean")
        .setDescription("Remove all infractions from a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user whose infraction you want to clean")
                .setRequired(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const target = options.getUser("user");
        if (target.bot) return interaction.reply({ content: "This is a bot", ephemeral: true });
        // const data = await ProfileModel.findOne({ userId: target.id, guildId: guild.id });
        const data = await UserDatabase.findOne({ key: { userId: target.id, guildId: guild.id } });
        if (data.data.infractions.length === 0)
            return interaction.reply({ content: "This user has no infractions", ephemeral: true });
        await UserDatabase.updateOne(
            { key: { userId: target.id, guildId: guild.id } },
            { $set: { "data.infractions": [] } }
        );
        await data.save();
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor("Green")
            .setDescription(`You have cleaned ${target}'s infractions.`);
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
