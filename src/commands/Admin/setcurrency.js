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
        .setName("set-currency")
        .setDescription("Set the balance of a user to a specified amount")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user whose balance you want to edit")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("What you want to set the user's balance to")
                .setRequired(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        if (user.id !== "348902272534839296") {
            return interaction.reply({
                content: "This command is only available for ryujily",
                ephemeral: true,
            });
        }
        const target = options.getUser("user");
        const amount = options.getInteger("amount");
        await UserDatabase.findOneAndUpdate(
            { key: { userId: target.id, guildId: guild.id } },
            { economy: { wallet: amount } }
        );
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(
                `You have set ${target}'s balance to ${amount} ${config.economy.currency} ${config.economy.currencySymbol}`
            );
        interaction.reply({ embeds: [embed] });
        return;
    },
};
