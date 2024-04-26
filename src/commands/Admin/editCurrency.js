const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit-currency")
        .setDescription("Edit currency from a user")
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
                .setDescription("The amount you want to add/remove from the user's balance")
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
        const data = await UserDatabase.findOneAndUpdate(
            {
                key: { userId: target.id, guildId: guild.id },
            },
            {
                $inc: { "economy.wallet": amount },
            },
            { new: true }
        );
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(
                `You have changed ${target}'s balance to ${data.economy.wallet} ${config.economy.currency} ${config.economy.currencySymbol}`
            );
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
