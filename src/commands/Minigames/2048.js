const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const Userdatabase = require("../../models/userSchema");

module.exports = {
    data: new SlashCommandBuilder().setName("2048").setDescription("Play a game of 2048"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.deferReply();
        //constants and variables
        const emojis = { up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" };
        let gameBoard = [];
        let mergedPos = [];
        let score = 0;
        const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        const winChars = "bcdefghijklmnopqrstuvwxyz";
        //initialize gameboard
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                gameBoard[y * 4 + x] = 0;
            }
        }
        //functions
        const getBoardImage = async () => {
            const url =
                "https://api.gamecord.xyz/2048?board=" + gameBoard.map((c) => chars[c]).join("");
            return await new AttachmentBuilder(url, { name: "2048.png" });
        };
        const move = (pos, direction) => {
            if (direction === "up") return { x: pos.x, y: pos.y - 1 };
            else if (direction === "down") return { x: pos.x, y: pos.y + 1 };
            else if (direction === "left") return { x: pos.x - 1, y: pos.y };
            else if (direction === "right") return { x: pos.x + 1, y: pos.y };
            else return pos;
        };
        const oppDirection = (direction) => {
            if (direction === "up") return "down";
            else if (direction === "down") return "up";
            else if (direction === "left") return "right";
            else if (direction === "right") return "left";
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
        const placeRandomTile = () => {
            let tilePos = { x: 0, y: 0 };
            do {
                tilePos = { x: parseInt(Math.random() * 4), y: parseInt(Math.random() * 4) };
            } while (gameBoard[tilePos.y * 4 + tilePos.x] != 0);
            gameBoard[tilePos.y * 4 + tilePos.x] = Math.random() > 0.8 ? 2 : 1;
        };
        const isInsideBlock = (pos) => {
            return pos.x >= 0 && pos.y >= 0 && pos.x < 4 && pos.y < 4;
        };
        const shift = (pos, dir) => {
            let moved = false;
            const movingTile = gameBoard[pos.y * 4 + pos.x];
            if (movingTile === 0) return false;
            let set = false;
            let moveTo = pos;
            while (!set) {
                moveTo = move(moveTo, dir);
                const moveToTile = gameBoard[moveTo.y * 4 + moveTo.x];
                if (
                    !isInsideBlock(moveTo) ||
                    (moveToTile !== 0 && moveToTile !== movingTile) ||
                    !!mergedPos.find((p) => p.x === moveTo.x && p.y === moveTo.y)
                ) {
                    const moveBack = move(moveTo, oppDirection(dir));
                    if (!(moveBack.x === pos.x && moveBack.y === pos.y)) {
                        gameBoard[pos.y * 4 + pos.x] = 0;
                        gameBoard[moveBack.y * 4 + moveBack.x] = movingTile;
                        moved = true;
                    }
                    set = true;
                } else if (moveToTile === movingTile) {
                    moved = true;
                    gameBoard[moveTo.y * 4 + moveTo.x] += 1;
                    score += Math.floor(Math.pow(gameBoard[moveTo.y * 4 + moveTo.x], 2));
                    gameBoard[pos.y * 4 + pos.x] = 0;
                    set = true;
                }
            }
            return moved;
        };
        const shiftVertical = (dir) => {
            let moved = false;
            for (let x = 0; x < 4; x++) {
                if (dir === "up") {
                    for (let y = 1; y < 4; y++) moved = shift({ x, y }, "up") || moved;
                } else {
                    for (let y = 2; y >= 0; y--) moved = shift({ x, y }, "down") || moved;
                }
            }
            return moved;
        };
        const shiftHorizontal = (dir) => {
            let moved = false;
            for (let y = 0; y < 4; y++) {
                if (dir === "left") {
                    for (let x = 1; x < 4; x++) moved = shift({ x, y }, "left") || moved;
                } else {
                    for (let x = 2; x >= 0; x--) moved = shift({ x, y }, "right") || moved;
                }
            }
            return moved;
        };
        const isGameOver = () => {
            let boardFull = true;
            let numMoves = 0;
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (gameBoard[y * 4 + x] === 0) boardFull = false;
                    const posNum = gameBoard[y * 4 + x];
                    ["down", "left", "right", "up"].forEach((dir) => {
                        const newPos = move({ x, y }, dir);
                        if (
                            isInsideBlock(newPos) &&
                            (gameBoard[newPos.y * 4 + newPos.x] === 0 ||
                                gameBoard[newPos.y * 4 + newPos.x] === posNum)
                        )
                            numMoves++;
                    });
                }
            }
            return boardFull && numMoves === 0;
        };
        const gameOver = async (msg, result) => {
            let multi = 0.2;
            if (result === true) multi = 5;
            const winnings = Math.floor(score * multi);
            await data.save();
            await Userdatabase.findOneAndUpdate(
                { key: { userId: user.id, guildId: guild.id } },
                { $inc: { "economy.wallet": winnings } }
            );
            let string = "";
            if (result === true)
                string = `Congratulations! You have won ${winnings} ${config.economy.currency} ${config.economy.currencySymbol} !`;
            else
                string = `You have lost... You still win ${winnings} ${config.economy.currency} ${config.economy.currencySymbol} though.`;
            const embed = new EmbedBuilder()
                .setTitle("2048")
                .setColor("Purple")
                .setImage("attachment://2048.png")
                .setDescription(string)
                .addFields(
                    { name: "Total Score", value: score.toString() },
                    { name: "Result", value: `${result === true ? "Win." : "Lose."}` }
                )
                .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
            return msg.edit({
                embeds: [embed],
                components: disableButtons(msg.components),
                files: [await getBoardImage()],
                attachments: [],
            });
        };
        const handleButtons = async (msg) => {
            const collector = msg.createMessageComponentCollector({ idle: 1000 * 60 * 3 });
            collector.on("collect", async (btn) => {
                await btn.deferUpdate().catch((e) => {});
                if (btn.user.id !== user.id) {
                    btn.followUp({ content: "Not your buttons", ephemeral: true });
                    return;
                }
                let moved = false;
                mergedPos = [];
                const direction = btn.customId.split("_")[1];
                if (direction === "up" || direction === "down") moved = shiftVertical(direction);
                if (direction === "left" || direction === "right")
                    moved = shiftHorizontal(direction);
                if (moved) placeRandomTile();
                if (isGameOver()) return collector.stop();
                const embed = new EmbedBuilder()
                    .setTitle("2048")
                    .setColor("Purple")
                    .setImage("attachment://2048.png")
                    .addFields({ name: "Current Score", value: score.toString() })
                    .setFooter({
                        text: user.tag,
                        iconURL: user.displayAvatarURL({ dynamic: true }),
                    });
                return msg.edit({
                    embeds: [embed],
                    files: [await getBoardImage()],
                    attachments: [],
                });
            });
            collector.on("end", (_, reason) => {
                if (reason === "idle" || reason === "user") {
                    const boardString = [...gameBoard].some((char) => winChars.includes(char));
                    return gameOver(msg, boardString);
                }
            });
        };
        const startGame = async () => {
            placeRandomTile();
            placeRandomTile();
            const embed = new EmbedBuilder()
                .setTitle("2048")
                .setColor("Purple")
                .setImage("attachment://2048.png")
                .addFields({ name: "Current Score", value: score.toString() })
                .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
            const up = new ButtonBuilder()
                .setEmoji(emojis.up)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("2048_up");
            const down = new ButtonBuilder()
                .setEmoji(emojis.down)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("2048_down");
            const left = new ButtonBuilder()
                .setEmoji(emojis.left)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("2048_left");
            const right = new ButtonBuilder()
                .setEmoji(emojis.right)
                .setStyle(ButtonStyle.Primary)
                .setCustomId("2048_right");
            const row = new ActionRowBuilder().addComponents(up, down, left, right);
            const msg = await interaction.editReply({
                embeds: [embed],
                components: [row],
                files: [await getBoardImage()],
                attachments: [],
            });
            return handleButtons(msg);
        };
        //start game
        startGame();
        return;
    },
};
