const { SlashCommandBuilder, Interaction, EmbedBuilder } = require("discord.js");
const guildConfiguration = require("../../models/guildConfiguration");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("All configure settings")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("start-setup")
                .setDescription("The first config you have to do to proceed")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const subcommand = options.getSubcommand();
        if (subcommand === "start-setup") {
            const data = await guildConfiguration.findOne({ guildId: guild.id });
            if (data) {
                return interaction.reply({
                    content: `You have already setup your configurations`,
                    ephemeral: true,
                });
            } else {
                guildConfiguration.create({
                    guildId: guild.id,
                });
                return interaction.reply(
                    `You have setup your configurations, you can now proceed with other server configurations`
                );
            }
        }
        return;
    },
};
