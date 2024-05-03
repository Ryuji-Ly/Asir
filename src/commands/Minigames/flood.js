const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flood")
        .setDescription("Play a game of flood")
        .addIntegerOption((option) =>
            option
                .setName("length")
                .setDescription("Set the board length")
                .setMinValue(5)
                .setMaxValue(14)
        )
        .setDMPermission(false),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, user, guild } = interaction;
        await interaction.deferReply();
        const squares = ["🟥", "🟧", "🟩", "🟦", "🟪"];
        let length = options.getInteger("length");
        if (!length) length = 13;
        let gameBoard = [];
        let maxTurns = 0;
        let turns = 0;
        // initialize game board content
        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
                gameBoard[y * length + x] = squares[Math.floor(Math.random() * squares.length)];
            }
        }
        // functions
        const getBoardContent = () => {
            let board = "";
            for (let y = 0; y < length; y++) {
                for (let x = 0; x < length; x++) {
                    board += gameBoard[y * length + x];
                }
                board += "\n";
            }
            return board;
        };
        const disableButtons = (components) => {
            for (let x = 0; x < components.length; x++) {
                for (let y = 0; y < components[x].components.length; y++) {
                    components[x].components[y] = ButtonBuilder.from(components[x].components[y]);
                    components[x].components[y].setDisabled(true);
                }
            }
            return components;
        };
        const gameOver = async (msg, result) => {
            let resultMessage = result
                ? `You have won! You took **${turns}** turns.`
                : "You have lost your dignity, loosing a game of flood.";
            if (config.economy.enabled) {
                if (result) {
                    await UserDatabase.findOneAndUpdate(
                        { userId: user.id },
                        { $inc: { balance: config.economy.minigameReward } }
                    );
                    resultMessage += ` You have been awarded **${config.economy.minigameReward}** ${config.economy.currency} ${config.economy.currencySymbol}.`;
                }
            }
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle("Flood")
                .setDescription(getBoardContent())
                .addFields({ name: "Game Over", value: resultMessage })
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
            return msg.edit({ embeds: [embed], compontents: disableButtons(msg.components) });
        };
        const updateGame = async (selected, msg) => {
            if (selected === gameBoard[0]) return false;
            const firstBlock = gameBoard[0];
            const queue = [{ x: 0, y: 0 }];
            const visited = [];
            let state = true;
            turns += 1;
            // update game board
            while (queue.length > 0) {
                const block = queue.shift();
                if (!block || visited.some((v) => v.x === block.x && v.y === block.y)) continue;
                const index = block.y * length + block.x;
                visited.push(block);
                if (gameBoard[index] === firstBlock) {
                    gameBoard[index] = selected;
                    const up = { x: block.x, y: block.y - 1 };
                    if (!visited.some((v) => v.x === up.x && v.y === up.y) && up.y >= 0)
                        queue.push(up);
                    const down = { x: block.x, y: block.y + 1 };
                    if (!visited.some((v) => v.x === down.x && v.y === down.y) && down.y < length)
                        queue.push(down);
                    const left = { x: block.x - 1, y: block.y };
                    if (!visited.some((v) => v.x === left.x && v.y === left.y) && left.x >= 0)
                        queue.push(left);
                    const right = { x: block.x + 1, y: block.y };
                    if (
                        !visited.some((v) => v.x === right.x && v.y === right.y) &&
                        right.x < length
                    )
                        queue.push(right);
                }
            }
            // check if game over
            for (let y = 0; y < length; y++) {
                for (let x = 0; x < length; x++) {
                    if (gameBoard[y * length + x] !== selected) state = false;
                }
            }
            // send gameOver event if needed.
            if (turns >= maxTurns && !state) return void gameOver(msg, false);
            if (state) return void gameOver(msg, true);
            return true;
        };
        const initializeGame = async () => {
            maxTurns = Math.floor((25 * (length * 2)) / 26);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: user.tag,
                    iconURL: user.displayAvatarURL({ dynamic: true }),
                })
                .setColor("Blurple")
                .setTitle("Flood")
                .setDescription(getBoardContent())
                .addFields({ name: "Turns", value: `${turns}/${maxTurns}` })
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
            const btn1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji(squares[0])
                .setCustomId("flood_0");
            const btn2 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji(squares[1])
                .setCustomId("flood_1");
            const btn3 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji(squares[2])
                .setCustomId("flood_2");
            const btn4 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji(squares[3])
                .setCustomId("flood_3");
            const btn5 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setEmoji(squares[4])
                .setCustomId("flood_4");
            const row = new ActionRowBuilder().addComponents(btn1, btn2, btn3, btn4, btn5);
            const msg = await interaction.editReply({ embeds: [embed], components: [row] });
            const collector = msg.createMessageComponentCollector({ idle: 180000 });
            collector.on("collect", async (btn) => {
                await btn.deferUpdate().catch((e) => {});
                if (btn.user.id !== user.id) {
                    return btn.followUp({ content: "Not your buttons.", ephemeral: true });
                }
                const update = await updateGame(squares[btn.customId.split("_")[1]], msg);
                if (!update && update !== false) return collector.stop();
                if (update === false) return;
                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Flood")
                    .setDescription(getBoardContent())
                    .addFields({ name: "Turns", value: `${turns}/${maxTurns}` })
                    .setAuthor({
                        name: user.tag,
                        iconURL: user.displayAvatarURL({ dynamic: true }),
                    });
                return await msg.edit({ embeds: [embed], components: [row] });
            });
            collector.on("end", (_, reason) => {
                if (reason === "idle") return gameOver(msg, false);
            });
        };
        await initializeGame();
        return;
    },
};
