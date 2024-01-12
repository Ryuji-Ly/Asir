const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

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
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        if (user.id !== "348902272534839296") {
            return interaction.reply({
                content: "This command is only available for ryujily",
                ephemeral: true,
            });
        }
        const target = options.getUser("user");
        const amount = options.getInteger("amount");
        const data = await ProfileModel.findOne({ guildId: guild.id, userId: target.id });
        data.balance += amount;
        await data.save();
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(
                `You have changed ${target}'s balance to ${data.balance} ${config.currencyName}`
            );

        await interaction.reply({ embeds: [embed] });
        return;
    },
};
