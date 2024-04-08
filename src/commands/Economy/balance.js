const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

const command = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Displays your current balance"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        await interaction.deferReply();
        const config = await client.configs.get(guild.id);
        if (!config.Economy)
            return interaction.reply({ content: "Economy is disabled", ephemeral: true });
        let cooldown = 0;
        if (config.cooldowns.filter((c) => c.name === interaction.commandName).length > 0) {
            cooldown = config.cooldowns.find((c) => c.name === interaction.commandName).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        const data = await ProfileModel.findOne({ userId: user.id, guildId: guild.id });
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor(interaction.member.displayHexColor)
            .setDescription(`You're current balance is ${data.balance} ${config.currencyName}`);
        await interaction.editReply({ embeds: [embed] });
        return;
    },
};
module.exports = command;
