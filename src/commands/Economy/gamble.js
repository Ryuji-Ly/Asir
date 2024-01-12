const {
    SlashCommandBuilder,
    ButtonStyle,
    ActionRow,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");
const profileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gamble")
        .setDescription("Gamble with your gold")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("three-doors")
                .setDescription("Can 2.4x, 0.5x, or 0x your gold")
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("Choose the amount you want to bet")
                        .setMaxValue(50000)
                        .setMinValue(500)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("slots")
                .setDescription("Play a game of slots")
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("Choose the amount you want to bet")
                        .setMaxValue(50000)
                        .setMinValue(500)
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const { options, user, guild } = interaction;
        const config = await client.configs.get(guild.id);
        const gambleCommand = options.getSubcommand();
        const data = await profileModel.findOne({ userId: user.id, guildId: guild.id });
        const gambleEmbed = new EmbedBuilder().setColor(0x00aa6d);
        if (config.Economy === false)
            return interaction.reply({ content: "Economy is disabled", ephemeral: true });
        if (gambleCommand === "three-doors") {
            const amount = options.getInteger("amount");

            if (data.balance < amount) {
                await interaction.deferReply({ ephemeral: true });
                return await interaction.editReply(
                    `You don't have ${amount} ${config.currencyName} to gamble with`
                );
            }

            await interaction.deferReply();

            const Button1 = new ButtonBuilder()
                .setCustomId("one")
                .setLabel("Door 1")
                .setStyle(ButtonStyle.Primary);

            const Button2 = new ButtonBuilder()
                .setCustomId("two")
                .setLabel("Door 2")
                .setStyle(ButtonStyle.Primary);

            const Button3 = new ButtonBuilder()
                .setCustomId("three")
                .setLabel("Door 3")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(Button1, Button2, Button3);

            gambleEmbed
                .setTitle(`Playing three doors for ${amount} ${config.currencyName}`)
                .setFooter({
                    text: "Each door has 2.4x, 0.5x, or 0x the bet amount ",
                });

            await interaction.editReply({ embeds: [gambleEmbed], components: [row] });

            // gather message we just sent ^^
            const message = await interaction.fetchReply();

            const filter = (i) => i.user.id === interaction.user.id;

            const collector = message.createMessageComponentCollector({
                filter,
                time: 60000,
            });

            const double = "2.4x";
            const half = "LOSE HALF";
            const lose = "LOSE ALL";

            const getAmount = (label, gamble) => {
                let amount = -gamble;
                if (label === double) {
                    amount = gamble * 1.4;
                } else if (label === half) {
                    amount = -Math.round(gamble / 2);
                }
                return amount;
            };

            let choice = null;

            collector.on("collect", async (i) => {
                let options = [Button1, Button2, Button3];

                const randIdxDouble = Math.floor(Math.random() * 3);
                const doubleButton = options.splice(randIdxDouble, 1)[0];
                doubleButton.setLabel(double).setDisabled(true);

                const randomIdxHalf = Math.floor(Math.random() * 2);
                const halfButton = options.splice(randomIdxHalf, 1)[0];
                halfButton.setLabel(half).setDisabled(true);

                const zeroButton = options[0];
                zeroButton.setLabel(lose).setDisabled(true);

                Button1.setStyle(ButtonStyle.Secondary);
                Button2.setStyle(ButtonStyle.Secondary);
                Button3.setStyle(ButtonStyle.Secondary);

                if (i.customId === "one") choice = Button1;
                else if (i.customId === "two") choice = Button2;
                else if (i.customId === "three") choice = Button3;

                choice.setStyle(ButtonStyle.Success);

                const label = choice.data.label;
                const amtChange = getAmount(label, amount);
                data.balance += amtChange;
                await data.save();

                if (label === double) {
                    gambleEmbed
                        .setTitle("You just 2.4x'd your bet")
                        .setDescription(
                            `${user.username} gained ${amtChange} ${config.currencyName}`
                        );
                } else if (label === half) {
                    gambleEmbed
                        .setTitle("You just lost half your bet")
                        .setDescription(
                            `${user.username} lost ${-amtChange} ${config.currencyName}`
                        );
                } else if (label === lose) {
                    gambleEmbed
                        .setTitle("You just lost your entire bet")
                        .setDescription(
                            `${user.username} lost ${-amtChange} ${config.currencyName}`
                        );
                }
                gambleEmbed.setFooter({ text: `${user.username}'s new balance: ${data.balance}` });

                await i.update({ embeds: [gambleEmbed], components: [row] });
                collector.stop();
            });
        }

        if (gambleCommand === "slots") {
            const amount = options.getInteger("amount");
            if (data.balance < amount) {
                await interaction.deferReply({ ephemeral: true });
                return await interaction.editReply(
                    `You don't have ${amount} ${config.currencyName} to gamble with`
                );
            }

            await interaction.deferReply();

            // Create buttons for the slots game

            const ButtonSpin = new ButtonBuilder()
                .setCustomId("spin")
                .setLabel("Spin")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(ButtonSpin);

            gambleEmbed.setTitle(`Playing slots for ${amount} ${config.currencyName}`).setFooter({
                text: "Spin the slots and see if you win!",
            });

            await interaction.editReply({
                embeds: [gambleEmbed],
                components: [row],
            });

            // gather message we just sent
            const message = await interaction.fetchReply();

            const filter = (i) => i.user.id === interaction.user.id;

            const collector = message.createMessageComponentCollector({
                filter,
                time: 60000,
            });

            collector.on("collect", async (i) => {
                if (i.customId === "spin") {
                    // Add the slots game logic here
                    const symbols = ["🍒", "🍋", "🍊", "🍇", "🍉", "💰"];
                    const amount = interaction.options.getInteger("amount");

                    function spinSlots() {
                        const rows = [];
                        for (let i = 0; i < 3; i++) {
                            const row = [];
                            for (let j = 0; j < 3; j++) {
                                const randomValue = Math.random();
                                let randomSymbol;

                                // adjust the probabilities here
                                if (randomValue < 0.479142) {
                                    randomSymbol = "🍒"; // Probability of 0.479142 for 🍒
                                } else if (randomValue < 0.479142 + 0.271442) {
                                    randomSymbol = "🍋"; // Probability of 0.271442 for 🍋
                                } else if (randomValue < 0.479142 + 0.271442 + 0.170998) {
                                    randomSymbol = "🍊"; // Probability of 0.170998 for 🍊
                                } else if (
                                    randomValue <
                                    0.479142 + 0.271442 + 0.170998 + 0.0464159
                                ) {
                                    randomSymbol = "🍇"; // Probability of 0.0464159 for 🍇
                                } else if (
                                    randomValue <
                                    0.479142 + 0.271442 + 0.170998 + 0.0464159 + 0.0215443
                                ) {
                                    randomSymbol = "🍉"; // Probability of 0.0215443 for 🍉
                                } else {
                                    randomSymbol = "💰"; // Probability of 0.01 for 💰 (Money bag)
                                }

                                row.push(randomSymbol);
                            }
                            rows.push(row);
                        }
                        return rows;
                    }

                    function checkWinningCombination(rows) {
                        const middleRow = rows[1];
                        const uniqueSymbols = [...new Set(middleRow)];

                        if (uniqueSymbols.length === 1) {
                            const symbol = uniqueSymbols[0];
                            const payout = calculatePayout(symbol);
                            return { win: true, symbol, payout };
                        }

                        return { win: false, symbol: null, payout: 0 };
                    }

                    function calculatePayout(symbol) {
                        const payoutRates = {
                            "🍒": 4,
                            "🍋": 10,
                            "🍊": 20,
                            "🍇": 40,
                            "🍉": 60,
                            "💰": 100,
                        };

                        return payoutRates[symbol] || 0;
                    }

                    const slotsResult = spinSlots();
                    const { win, symbol, payout } = checkWinningCombination(slotsResult);

                    let winnings = 0;
                    if (win) {
                        winnings = amount * payout;
                    } else {
                        winnings = -amount;
                    }
                    data.balance += winnings;
                    await data.save();
                    const resultMessage = win
                        ? `You won ${winnings} ${config.currencyName} with ${symbol} combination!`
                        : "Sorry, you didn't win this time.";

                    gambleEmbed
                        .setTitle("Slots Result")
                        .setDescription(
                            `Slot Machine: \n${slotsResult
                                .map((row) => row.join(" "))
                                .join("\n")}\n\n${resultMessage}`
                        )
                        .setFooter({
                            text: `${user.username}'s new balance: ${data.balance} ${config.currencyName}`,
                        });

                    await i.update({ embeds: [gambleEmbed], components: [row] });
                }
            });
        }
    },
};
