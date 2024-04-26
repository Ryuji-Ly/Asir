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
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
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
        const target = options.getUser("user");
        if (target.bot) return interaction.reply({ content: "This is a bot", ephemeral: true });
        // const data = await ProfileModel.findOne({ userId: target.id, guildId: guild.id });
        const data = await UserDatabase.findOne({ key: { userId: target.id, guildId: guild.id } });
        if (data.data.infractions.length === 0)
            return interaction.reply({ content: "This user has no infractions", ephemeral: true });
        data.data.infractions = [];
        await data.save();
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor("Green")
            .setDescription(`You have cleaned ${target}'s infractions.`);
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
