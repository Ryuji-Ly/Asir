const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const Userdatabase = require("../../models/userSchema");
const Big = require("big.js");
const command = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Displays your current balance"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.deferReply();
        const data = await Userdatabase.findOne({ key: { userId: user.id, guildId: guild.id } });
        const wallet = new Big(data.economy.wallet);
        const bank = new Big(data.economy.bank);
        const formattedWallet = wallet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const formattedBank = bank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor(interaction.member.displayHexColor)
            .setDescription(
                `You're current wallet balance is ${formattedWallet} ${config.economy.currency} ${config.economy.currencySymbol}!\nYou're current bank balance is ${formattedBank} ${config.economy.currency} ${config.economy.currencySymbol}!`
            );
        await interaction.editReply({ embeds: [embed] });
        return;
    },
};
module.exports = command;
