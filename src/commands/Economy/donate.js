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
        .setName("donate")
        .setDescription("Donate currency to another user")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount you want to donate")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to donate to")
                .setRequired(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const userOption = options.getUser("user");
        const amount = options.getInteger("amount");
        if (config.economy.enabled === false) {
            return interaction.reply({
                content: "Economy commands are disabled in this server.",
                ephemeral: true,
            });
        }
        if (userOption.id === user.id) {
            return interaction.reply({ content: "You can't donate to yourself!", ephemeral: true });
        }
        const userData = await UserDatabase.findOne({
            "key.userId": user.id,
            "key.guildId": guild.id,
        });
        if (userData.economy.wallet < amount) {
            return interaction.reply({
                content: "You don't have enough currency to donate that amount!",
                ephemeral: true,
            });
        }
        await UserDatabase.findOneAndUpdate(
            { "key.userId": user.id, "key.guildId": guild.id },
            {
                $inc: {
                    "economy.wallet": -amount,
                },
            }
        );
        await UserDatabase.findOneAndUpdate(
            { "key.userId": userOption.id, "key.guildId": guild.id },
            {
                $inc: {
                    "economy.wallet": amount,
                },
            }
        );
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({
                name: `${user.tag} donated ${amount} ${config.economy.currency} ${config.economy.currencySymbol} to ${userOption.tag}`,
            });
        interaction.reply({ embeds: [embed] });
    },
};
