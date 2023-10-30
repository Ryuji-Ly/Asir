const { SlashCommandBuilder, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        interaction.reply({ content: "Pong!" });
        return;
    },
};
