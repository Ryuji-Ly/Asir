const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const GroupModel = require("../../models/group");
const handleCooldowns = require("../../utils/handleCooldowns");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("minesweeper")
        .setDescription("Play a game of minesweeper")
        .addIntegerOption((option) =>
            option
                .setName("mines")
                .setDescription("The number of mines there are on the board")
                .setMinValue(1)
                .setMaxValue(23)
        )
        .addIntegerOption((option) =>
            option.setName("bet").setDescription("Place a bet").setMinValue(100).setMaxValue(2000)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        //constants + gameboard + cooldowns
        let mines = options.getInteger("mines");
        const bet = options.getInteger("bet");
        let cooldown = 0;
        if (
            config.commands.cooldowns.filter((c) => c.name === interaction.commandName).length > 0
        ) {
            cooldown = config.commands.cooldowns.find(
                (c) => c.name === interaction.commandName
            ).value;
        } else cooldown = config.commands.defaultMinigameCooldown;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        if (bet) {
            if (!config.economy.enabled)
                return interaction.reply({
                    content: "The economy system has been disabled, you cannot place bets",
                    ephemeral: true,
                });
        }
        await interaction.deferReply();
        const length = 5;
        if (!mines) mines = 5;
        let gameboard = [];
        //embed
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("Minesweeper")
            .setDescription("Click the buttons to reveal the blocks, avoid mines!")
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
        // initialize gameboard
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                gameboard[y * 5 + x] = false;
            }
        }
        //functions
        const plantMines = () => {
            for (let i = 0; i <= mines; i++) {
                const x = Math.floor(Math.random() * 5);
                const y = Math.floor(Math.random() * 5);
                const index = y * length + x;
                if (gameboard[index] === false) gameboard[index] = true;
                else i = i - 1;
            }
        };
        const getMinesAround = (x, y) => {
            let minesAround = 0;
            for (let row = -1; row < 2; row++) {
                for (let col = -1; col < 2; col++) {
                    const block = { x: x + col, y: y + row };
                    if (block.x < 0 || block.x >= 5 || block.y < 0 || block.y >= 5) continue;
                    if (row === 0 && col === 0) continue;
                    if (gameboard[block.y * length + block.x] === true) minesAround += 1;
                }
            }
            return minesAround;
        };
        const showFirstBlock = () => {
            const Blocks = [];
            for (let y = 0; y < length; y++) {
                for (let x = 0; x < length; x++) {
                    if (gameboard[y * length + x] === true) Blocks.push({ x, y });
                }
            }
            const emptyBlocks = Blocks.filter((b) => !getMinesAround(b.x, b.y));
            const blocks = emptyBlocks.length ? emptyBlocks : Blocks;
            const rBlock = blocks[Math.floor(Math.random() * blocks.length)];
            gameboard[rBlock.y * length + rBlock.x] = getMinesAround(rBlock.x, rBlock.y);
        };
        const getComponents = (showMines, found) => {
            const components = [];
            for (let y = 0; y < length; y++) {
                const row = new ActionRowBuilder();
                for (let x = 0; x < length; x++) {
                    const block = gameboard[y * 5 + x];
                    const isNumber = getNumEmoji(block || null);
                    const displayMine = block === true && showMines;
                    const style = displayMine ? (found ? 3 : 4) : isNumber || block === 0 ? 2 : 1;
                    const btn = new ButtonBuilder()
                        .setStyle(style)
                        .setCustomId("minesweeper_" + x + "_" + y);
                    if (displayMine || isNumber)
                        btn.setEmoji(displayMine ? (found ? "🚩" : "💣") : isNumber);
                    else btn.setLabel("\u200b");
                    row.addComponents(btn);
                }
                components.push(row);
            }
            return components;
        };
        const getNumEmoji = (number) => {
            const numEmoji = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
            return numEmoji[number];
        };
        const foundAllMines = () => {
            let found = true;
            for (let y = 0; y < length; y++) {
                for (let x = 0; x < length; x++) {
                    if (gameboard[y * length + x] === false) found = false;
                }
            }
            return found;
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
            for (let y = 0; y < length; y++) {
                for (let x = 0; x < length; x++) {
                    const index = y * length + x;
                    if (gameboard[index] !== true) gameboard[index] = getMinesAround(x, y);
                }
            }
            const string = result
                ? "You won the game! You successfully avoided all the mines."
                : "You lost the game! Beware of the mines next time!";
            let extra = config.economy.enabled
                ? `\n\nHint: The reward for the amount of ${config.economy.currency} ${config.economy.currencySymbol} you win is also affected by the number of mines`
                : "";
            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("Minesweeper")
                .setDescription(`${string} ${extra}`)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
            if (config.economy.enabled) {
                const data = await ProfileModel.findOne({ guildId: guild.id, userId: user.id });
                const group = await GroupModel.findOne({ groupMemberIds: user.id });
                let multi = data.multiplier;
                if (group) multi += group.groupMultiplier;
                if (result) {
                    let winnings = 0;
                    winnings += Math.round(config.economy.minigameReward);
                    if (bet) {
                        winnings += Math.round(bet);
                    }
                    if (config.economy.multiplier) winnings *= multi;
                    if (mines === 1) winnings = 0;
                    else if (mines < 5) winnings * 0.1;
                    else if (mines < 10) winnings * 2;
                    else winnings * 5;
                    data.balance += winnings;
                    await data.save();
                    let text = `You have won ${winnings} ${config.economy.currency} ${config.economy.currencySymbol}.`;
                    if (bet) text += " (Basic reward + bet).";
                    embed.setFooter({ text: text });
                } else {
                    if (bet) {
                        data.balance -= bet;
                        await data.save();
                        embed.setFooter({ text: `You have lost the bet` });
                    }
                }
            } else
                return interaction.editReply({ content: "Economy is disabled", ephemeral: true });
            return msg.edit({
                embeds: [embed],
                components: disableButtons(getComponents(true, result)),
            });
        };
        const handleButtons = (msg) => {
            const collector = msg.createMessageComponentCollector({ idle: 180000 });
            collector.on("collect", async (btn) => {
                await btn.deferUpdate().catch((e) => {});
                if (btn.user.id !== user.id) {
                    btn.followUp({ content: `Not your buttons.`, ephemeral: true });
                    return;
                }
                const x = parseInt(btn.customId.split("_")[1]);
                const y = parseInt(btn.customId.split("_")[2]);
                const index = y * length + x;
                if (gameboard[index] === true) return collector.stop();
                const mines = getMinesAround(x, y);
                gameboard[index] = mines;
                if (foundAllMines()) return collector.stop();
                return await msg.edit({ components: getComponents() });
            });

            collector.on("end", async (_, reason) => {
                if (reason === "user" || reason === "idle") return gameOver(msg, foundAllMines());
            });
        };
        //start game
        plantMines();
        showFirstBlock();
        const msg = await interaction.editReply({ embeds: [embed], components: getComponents() });
        handleButtons(msg);
        return;
    },
};
