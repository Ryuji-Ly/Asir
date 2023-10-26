const { SlashCommandBuilder, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
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
