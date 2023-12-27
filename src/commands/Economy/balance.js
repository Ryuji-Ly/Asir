const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
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
        const config = await client.configs.get(guild.id);
        if (!config.Level) return;
        const data = await ProfileModel.findOne({ userId: user.id, guildId: guild.id });
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor(interaction.member.displayHexColor)
            .setDescription(`You're current balance is ${data.balance} ${config.currencyName}`);
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
