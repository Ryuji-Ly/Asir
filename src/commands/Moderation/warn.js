const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
var colors = require("colors");
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
    async execute(interaction, client) {
        const config = await client.configs.get(interaction.guild.id);
        const user = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason given";
        if (user.user.bot) return interaction.reply({ content: "This is a bot", ephemeral: true });
        if (user.user.id === interaction.user.id)
            return interaction.reply({ content: "You cannot warn yourself", ephemeral: true });
        if (!user.moderatable)
            return interaction.reply({
                content: "This user cannot be warned by you or me",
                ephemeral: true,
            });
        const data = await ProfileModel.findOne({ guildId: interaction.guild.id, userId: user.id });
        if (data.warnings === config.warnLimit) {
            data.warnings = 0;
            await user
                .timeout(config.timeoutDuration, "Automated timeout after surpassing warn limit")
                .catch((err) => {
                    return console.log(`[BOT] Error with automated timeout: ${err}`.red);
                });
            const newInfractionObject = {
                IssuerId: "Asir",
                IssuerTag: "Asir",
                Reason: "Automated timeout",
                Date: Date.now(),
            };
            data.infractions.push(newInfractionObject);
            await data.save();
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.displayName}`,
                    iconURL: interaction.guild.iconURL(),
                })
                .setColor("Red")
                .setDescription(
                    `${user} has been warned for: ${reason}. As they have surpassed the warn limit, they have been automatically timed out`
                );
            if (config.modLogChannelId !== "") {
                const channel = interaction.guild.channels.cache.get(config.modLogChannelId);
                if (!channel) {
                    return;
                }
                await channel.send({ embeds: [embed] });
            }
            await interaction.reply({
                content: `Successfully warned ${user}, as they have surpassed the warn limit, they have been timed out automatically`,
                ephemeral: true,
            });
            await interaction.channel.send({ embeds: [embed] });
        } else {
            data.warnings += 1;
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.displayName}`,
                    iconURL: interaction.guild.iconURL(),
                })
                .setColor("Orange")
                .setDescription(
                    `${user} has been warned for: ${reason}. Their warning count is now at ${data.warnings}`
                );
            if (config.modLogChannelId !== "") {
                const channel = interaction.guild.channels.cache.get(config.modLogChannelId);
                if (!channel) {
                    return;
                }
                await channel.send({ embeds: [embed] });
            }
            await data.save();
            await interaction.reply({ content: `Successfully warned ${user}`, ephemeral: true });
            await interaction.channel.send({ embeds: [embed] });
        }
        return;
    },
};
