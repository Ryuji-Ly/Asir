const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    Client,
} = require("discord.js");
const handleCooldowns = require("../../utils/handleCooldowns");

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
     * @param {Client} client
     */
    async execute(interaction, client) {
        const config = await client.configs.get(interaction.guild.id);
        let cooldown = 0;
        if (
            config.commands.cooldowns.filter((c) => c.name === interaction.commandName).length > 0
        ) {
            cooldown = config.commands.cooldowns.find(
                (c) => c.name === interaction.commandName
            ).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
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
