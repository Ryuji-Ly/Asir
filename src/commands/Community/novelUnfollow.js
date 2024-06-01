const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unfollow-novel")
        .setDescription(
            "Stop getting updates when a new chapter is released for a novel. (Lectorum Nexus)"
        )
        .addStringOption((option) =>
            option
                .setName("novel")
                .setDescription("The name of the novel you want to unfollow.")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        if (guild.id !== "1161001645698715698")
            return interaction.reply("This command can only be used in Lectorum Nexus.");
        const novel = options.getString("novel");
        const hasRole = interaction.member.roles.cache.find((role) => role.name === novel);
        if (!hasRole) {
            const embed = new EmbedBuilder()
                .setTitle("Novel Not Followed")
                .setDescription(`You are not following ${novel}.`)
                .setColor("Red")
                .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            return;
        } else {
            await interaction.member.roles.remove(hasRole);
            const embed = new EmbedBuilder()
                .setTitle("Novel Unfollowed")
                .setDescription(`You are no longer following ${novel}.`)
                .setColor("Green")
                .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
        }
        return;
    },
};
