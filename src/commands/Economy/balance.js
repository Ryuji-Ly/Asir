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
        .setDescription("Displays your current balance")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to check the balance of")
                .setRequired(false)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const userOption = options.getUser("user");
        let target = userOption ? userOption : user;
        await interaction.deferReply();
        const data = await Userdatabase.findOne({
            key: { userId: target.id, guildId: guild.id },
        });
        const wallet = new Big(data.economy.wallet);
        const bank = new Big(data.economy.bank);
        const formattedWallet = wallet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const formattedBank = bank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const embed = new EmbedBuilder()
            .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
            .setColor(interaction.member.displayHexColor)
            .setDescription(
                `You're current wallet balance is ${formattedWallet} ${config.economy.currency} ${config.economy.currencySymbol}!\nYou're current bank balance is ${formattedBank} ${config.economy.currency} ${config.economy.currencySymbol}!`
            );
        await interaction.editReply({ embeds: [embed] });
        return;
    },
};
module.exports = command;
