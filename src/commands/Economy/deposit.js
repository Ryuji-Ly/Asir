const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit your money into your bank")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount of money you want to deposit")
                .setMinValue(1)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const amount = options.getInteger("amount");
        if (config.economy.enabled === false)
            return interaction.reply({
                content: "Economy is disabled in this server",
                ephemeral: true,
            });
        if (amount) {
            const userData = await UserDatabase.findOne({
                key: { userId: user.id, guildId: guild.id },
            });
            if (userData.economy.wallet < amount) {
                return interaction.reply({
                    content: `You don't have enough ${config.economy.currency} ${config.economy.currencySymbol} to deposit`,
                    ephemeral: true,
                });
            }
            await UserDatabase.findOneAndUpdate(
                { key: { userId: user.id, guildId: guild.id } },
                {
                    $inc: { "economy.wallet": -amount, "economy.bank": amount },
                }
            );
            const number = new Big(amount);
            const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor("Green")
                .setDescription(
                    `Successfully deposited ${formatted} ${config.economy.currency} ${config.economy.currencySymbol} into your bank`
                )
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        } else {
            const userData = await UserDatabase.findOne({
                key: { userId: user.id, guildId: guild.id },
            });
            await UserDatabase.findOneAndUpdate(
                { key: { userId: user.id, guildId: guild.id } },
                {
                    $inc: {
                        "economy.bank": userData.economy.wallet,
                        "economy.wallet": -userData.economy.wallet,
                    },
                }
            );
            const number = new Big(userData.economy.wallet);
            const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor("Green")
                .setDescription(
                    `Successfully deposited ${formatted} ${config.economy.currency} ${config.economy.currencySymbol} into your bank`
                )
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }
        return;
    },
};
