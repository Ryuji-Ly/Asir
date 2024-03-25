const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purge the channel of messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount of messages to delete")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        let number = interaction.options.getInteger("amount");
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(`✅ Deleted ${number} messages`);
        await interaction.channel
            .bulkDelete(number)
            .then(async () => {
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            })
            .catch(async (error) => {
                return await interaction.reply({
                    content: "You can only bulk delete messages that are less than 14 days old.",
                    ephemeral: true,
                });
            });
        return;
    },
};
