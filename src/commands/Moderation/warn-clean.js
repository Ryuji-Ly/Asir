const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge-warns")
        .setDescription("Removes all warnings for a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
        let cooldown = 0;
        if (
            config.commands.cooldowns.filter((c) => c.name === interaction.commandName).length > 0
        ) {
            cooldown = config.commands.cooldowns.find(
                (c) => c.name === interaction.commandName
            ).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        const user = interaction.options.getMember("user");
        const data = await ProfileModel.findOne({ guildId: interaction.guild.id, userId: user.id });
        data.warnings = 0;
        await data.save();
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.displayName}`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor("Green")
            .setDescription(`${user}'s warnings has been purged`)
            .setTimestamp();
        if (config.modLogs[0].value) {
            if (config.modLogChannelId !== "") {
                const channel = interaction.guild.channels.cache.get(config.modLogChannelId);
                if (!channel) {
                    return;
                }
                await channel.send({ embeds: [embed] });
            }
        }
        interaction.reply({ embeds: [embed] });
        return;
    },
};
