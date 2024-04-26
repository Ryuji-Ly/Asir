const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const Userdatabase = require("../../models/userSchema");
var colors = require("colors");
const handleCooldowns = require("../../utils/handleCooldowns");
colors.enable();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option.setName("user").setDescription("The user you want to warn").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for warn")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason given";
        if (user.user.bot) return interaction.reply({ content: "This is a bot", ephemeral: true });
        if (user.user.id === interaction.user.id)
            return interaction.reply({ content: "You cannot warn yourself", ephemeral: true });
        if (user.permissions.has(PermissionFlagsBits.Administrator))
            return interaction.reply({
                content: "This user cannot be warned by you or me",
                ephemeral: true,
            });
        const data = await Userdatabase.findOne({
            key: { userId: user.id, guildId: interaction.guild.id },
        });
        if (data.data.warnings + 1 === config.moderation.warnLimit) {
            await user
                .timeout(
                    config.moderation.timeoutDuration,
                    "Automated timeout after reaching warn limit"
                )
                .catch((err) => {
                    return console.log(`[BOT] Error with automated timeout: ${err}`.red);
                });
            const newInfractionObject = {
                IssuerId: `${client.user.id}`,
                IssuerTag: "Asir",
                Reason: "Automated timeout",
                Date: Date.now(),
            };
            await Userdatabase.findOneAndUpdate(
                { key: { userId: user.id, guildId: interaction.guild.id } },
                {
                    $set: { "data.warnings": 0 },
                    $push: { "data.infractions": newInfractionObject },
                }
            );
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.displayName}`,
                    iconURL: interaction.guild.iconURL(),
                })
                .setColor("Red")
                .setDescription(
                    `${user} has been warned for: ${reason}. As they have surpassed the warn limit, they have been automatically timed out`
                )
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
            await interaction.reply({
                content: `Successfully warned ${user}, as they have surpassed the warn limit, they have been timed out automatically`,
                ephemeral: true,
            });
            await interaction.channel.send({ embeds: [embed] });
        } else {
            data.data.warnings += 1;
            await Userdatabase.findOneAndUpdate(
                { key: { userId: user.id, guildId: interaction.guild.id } },
                {
                    $set: { "data.warnings": data.data.warnings },
                }
            );
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.displayName}`,
                    iconURL: interaction.guild.iconURL(),
                })
                .setColor("Orange")
                .setDescription(
                    `${user} has been warned for: ${reason}. Their warning count is now at ${data.warnings}`
                );
            if (config.moderation.modLogs.warn) {
                if (config.channels.modLog !== "") {
                    const channel = interaction.guild.channels.cache.get(config.channels.modLog);
                    if (!channel) {
                        return;
                    }
                    await channel.send({ embeds: [embed] });
                }
            }
            await data.save();
            await interaction.reply({ content: `Successfully warned ${user}`, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] });
        }
        return;
    },
};
