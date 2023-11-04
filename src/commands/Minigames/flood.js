const { SlashCommandBuilder, Interaction, EmbedBuilder } = require("discord.js");
const { Flood } = require("discord-gamecord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flood")
        .setDescription("Play a game of flood")
        .setDMPermission(false),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply();
        const Game = new Flood({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: "Flood",
                color: "#9656ce",
            },
            difficulty: 13,
            timeoutTime: 1000 * 60 * 3,
            buttonStyle: "PRIMARY",
            emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
            winMessage: `You won! You took **{turns}** turns.`,
            loseMessage: "You lost! You took **{turns}** turns.",
            playerOnlyMessage: "Only {player} can use these buttons.",
        });
        Game.startGame();
        Game.on("gameOver", async (result) => {
            if (result.result === "win") {
                return;
            } else return;
        });
        return;
    },
};
