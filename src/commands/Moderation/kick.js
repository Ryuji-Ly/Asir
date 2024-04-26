const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the server")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) =>
            option.setName("user").setDescription("The user you want to kick").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for the kick")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const target = options.getUser("user");
        let reason = options.getString("reason");
        if (!reason) reason = "No reason given";
        const member = await guild.members.fetch(target.id);
        if (target.id === user.id)
            return await interaction.reply({
                content: "You can't kick yourself.",
                ephemeral: true,
            });
        if (!member)
            return await interaction.reply({ content: "The user is no longer within the server" });
        if (!member.kickable)
            return await interaction.reply({
                content: "I cannot kick this user because they have roles above me or you",
            });
        if (target.id === guild.ownerId)
            return await interaction.reply({
                content: "This is the server owner",
                ephemeral: true,
            });
        const dmEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`✅ You have been kicked from **${guild.name}** | ${reason}`);
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(`✅ ${target.tag} has been **kicked** | ${reason}`);
        await member.send({ embeds: [dmEmbed] }).catch((err) => {
            return;
        });
        await member.kick({ reason: reason }).catch((err) => {
            interaction.reply({
                content: "There was an error kicking this member",
                ephemeral: true,
            });
            return;
        });
        if (config.moderation.modLogs.kick) {
            const channel = await guild.channels.cache.get(config.channels.modLog);
            if (channel) {
                const logEmbed = new EmbedBuilder()
                    .setAuthor({ name: "Member Kicked", iconURL: guild.iconURL() })
                    .setColor("Purple")
                    .setDescription("A member has been kicked")
                    .addFields(
                        { name: "Issuer", value: user },
                        { name: "Member", value: target.tag },
                        { name: "Reason", value: reason }
                    )
                    .setTimestamp();
                channel.send({ embeds: [logEmbed] });
            }
        }
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
