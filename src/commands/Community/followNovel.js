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
        .setName("follow-novel")
        .setDescription("Get updates when a new chapter is released for a novel. (Lectorum Nexus)")
        .addStringOption((option) =>
            option
                .setName("novel")
                .setDescription("The name of the novel you want to follow.")
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
        const novel = options.getString("novel");
        let role = guild.roles.cache.find((role) => role.name === novel);
        if (!role) {
            const notifRolePos = guild.roles.cache.find(
                (role) => role.id === "1165360917370908692"
            ).position;
            role = await guild.roles.create({
                name: novel,
                position: notifRolePos,
            });
            await interaction.member.roles.add(role);
        } else {
            await interaction.member.roles.add(role);
        }
        const embed = new EmbedBuilder()
            .setTitle("Novel Followed")
            .setDescription(
                `You are now following ${novel}. You will be notified when a new chapter is released with the role ${role}.`
            )
            .setColor("Green")
            .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
