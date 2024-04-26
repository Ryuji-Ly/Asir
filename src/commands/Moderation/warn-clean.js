const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

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
    async execute(interaction, client, config) {
        const user = interaction.options.getMember("user");
        await UserDatabase.findOneAndUpdate(
            { key: { userId: user.id, guildId: interaction.guild.id } },
            {
                $set: { "data.warnings": 0 },
            }
        );
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.displayName}`,
                iconURL: interaction.guild.iconURL(),
            })
            .setColor("Green")
            .setDescription(`${user}'s warnings has been purged`)
            .setTimestamp();
        if (config.moderation.modLogs.warn) {
            if (config.channels.modLog !== "") {
                const channel = interaction.guild.channels.cache.get(config.channels.modLog);
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
