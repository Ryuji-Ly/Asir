const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const cards = {
    C2: "<:2C:1233809183447453789>",
    C3: "<:3C:1233809188812099635>",
    C4: "<:4C:1233809194293919795>",
    C5: "<:5C:1233809202326278287>",
    C6: "<:6C:1233809881476235295>",
    C7: "<:7C:1233809219266936914>",
    C8: "<:8C:1233809883950874764>",
    C9: "<:9C:1233809240800362556>",
    C10: "<:10C:1233809248966934548>",
    CJ: "<:JC:1233809898081620049>",
    CQ: "<:QC:1233810009062772758>",
    CK: "<:KC:1233810007058026689>",
    CA: "<:AC:1233809257405616180>",
    H2: "<:2H:1233809186182266880>",
    H3: "<:3H:1233809191542718515>",
    H4: "<:4H:1233809198521778326>",
    H5: "<:5H:1233809880314548266>",
    H6: "<:6H:1233809215769022545>",
    H7: "<:7H:1233809229517688935>",
    H8: "<:8H:1233809885473407046>",
    H9: "<:9H:1233809244030111906>",
    H10: "<:10H:1233809253882531880>",
    HJ: "<:JH:1233809899478319104>",
    HQ: "<:QH:1233810100863373374>",
    HK: "<:KH:1233809903252930621>",
    HA: "<:AH:1233809261239337051>",
    D2: "<:2D:1233809184726847632>",
    D3: "<:3D:1233809189864869939>",
    D4: "<:4D:1233809877714079835>",
    D5: "<:5D:1233809206084243496>",
    D6: "<:6D:1233809213369745578>",
    D7: "<:7D:1233809225944137789>",
    D8: "<:8D:1233809234425286819>",
    D9: "<:9D:1233809886811394118>",
    D10: "<:10D:1233809252401938493>",
    DJ: "<:JD:1233809268243959981>",
    DQ: "<:QD:1233810099391303700>",
    DK: "<:KD:1233809275428671608>",
    DA: "<:AD:1233810006131085444>",
    S2: "<:2S:1233809187293630536>",
    S3: "<:3S:1233809193056604180>",
    S4: "<:4S:1233809878875902065>",
    S5: "<:5S:1233809209510854806>",
    S6: "<:6S:1233809882713559080>",
    S7: "<:7S:1233809231048609903>",
    S8: "<:8S:1233809238808203325>",
    S9: "<:9S:1233810004369473588>",
    S10: "<:10S:1233809890078752911>",
    SJ: "<:JS:1233809271708188875>",
    SQ: "<:QS:1233810102755131455>",
    SK: "<:KS:1233809278897491999>",
    SA: "<:AS:1233809893560029184>",
    cardBack: "<:cardBack:1233809264217165876>",
};

class Blackjack {
    constructor(interaction, config) {
        this.interaction = interaction;
        this.config = config;
        this.deck = this.generateDeck();
        this.playerHand = [];
        this.dealerHand = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.gameOver = false;
        this.rounds = 0;
        this.doubleDowned = false;
    }
    generateDeck() {
        const suits = ["C", "H", "D", "S"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        const deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(`${suit}${rank}`);
            }
        }
        return deck;
    }
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    dealCard() {
        return this.deck.pop();
    }
    calculateScores() {
        this.playerScore = this.calculateHandScore(this.playerHand);
        this.dealerScore = this.calculateDealerHandScore();
    }
    calculateHandScore(hand) {
        let score = 0;
        let hasAce = false;
        for (const card of hand) {
            const rank = card.substring(1);
            if (rank === "A") {
                hasAce = true;
                score += 11;
            } else if (["K", "Q", "J"].includes(rank)) {
                score += 10;
            } else {
                score += parseInt(rank, 10);
            }
        }
        while (score > 21 && hasAce) {
            score -= 10;
            hasAce = false;
        }
        return score;
    }
    calculateDealerHandScore() {
        const dealerShownCard = this.dealerHand[0];
        return this.calculateHandScore([dealerShownCard]);
    }
    dealInitialCards() {
        this.playerHand.push(this.dealCard());
        this.dealerHand.push(this.dealCard());
        this.playerHand.push(this.dealCard());
        this.dealerHand.push(this.dealCard());
    }
    showDealerHand() {
        return `${cards[this.dealerHand[0]]} ${cards.cardBack}`;
    }
    showPlayerHand() {
        return this.playerHand.map((card) => cards[card]).join(" ");
    }
    hitPlayer() {
        this.playerHand.push(this.dealCard());
        this.calculateScores();
        if (this.playerScore > 21) {
            this.gameOver = true;
        }
    }
    standPlayer() {
        this.dealerScore = this.calculateHandScore(this.dealerHand);
        while (this.dealerScore < 17) {
            this.dealerHand.push(this.dealCard());
            this.dealerScore = this.calculateHandScore(this.dealerHand);
        }
        this.gameOver = true;
    }
    doubleDown() {
        this.doubleDowned = true;
        this.playerHand.push(this.dealCard());
        this.calculateScores();
        this.standPlayer();
    }
    async startGame() {
        this.shuffleDeck();
        this.dealInitialCards();
        this.calculateScores();
        if (this.playerScore === 21) {
            this.dealerScore = this.calculateHandScore(this.dealerHand);
            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setAuthor({
                    name: this.interaction.user.username,
                    iconURL: this.interaction.user.avatarURL(),
                })
                .setTitle("Blackjack")
                .addFields(
                    {
                        name: "Player Hand",
                        value: `${this.showPlayerHand()}\n\nValue: ${
                            this.playerScore === 21 ? "Blackjack" : this.playerScore
                        }`,
                        inline: true,
                    },
                    {
                        name: "Dealer Hand",
                        value: `${this.dealerHand.map((card) => cards[card]).join(" ")}\n\nValue: ${
                            this.dealerScore === 21 ? "Blackjack" : this.dealerScore
                        }`,
                        inline: true,
                    }
                );
            const hit = new ButtonBuilder()
                .setLabel("Hit")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("hit")
                .setDisabled(true);
            const stand = new ButtonBuilder()
                .setLabel("Stand")
                .setStyle(ButtonStyle.Success)
                .setCustomId("stand")
                .setDisabled(true);
            const doubleDown = new ButtonBuilder()
                .setLabel("Double Down")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("doubleDown")
                .setDisabled(true);
            const row = new ActionRowBuilder().addComponents(hit, stand, doubleDown);
            let desc = "";
            let bet = this.interaction.options.getString("bet");
            if (this.dealerScore === 21) {
                desc = `Result: Push`;
                embed.setColor("Orange");
                if (bet) {
                    desc += `, money back`;
                    const data = await UserDatabase.findOne({
                        key: {
                            userId: this.interaction.user.id,
                            guildId: this.interaction.guild.id,
                        },
                    });
                    if (data.data.minigameStats.find((x) => x.name === "blackjack") === undefined) {
                        const minigameStats = {
                            name: "blackjack",
                            wins: 0,
                            losses: 0,
                            pushes: 1,
                            currencyGain: 0,
                            currencyLoss: 0,
                        };
                        await UserDatabase.findOneAndUpdate(
                            {
                                key: {
                                    userId: this.interaction.user.id,
                                    guildId: this.interaction.guild.id,
                                },
                            },
                            {
                                $push: { "data.minigameStats": minigameStats },
                            }
                        );
                    } else {
                        const minigameStats = data.data.minigameStats.find(
                            (x) => x.name === "blackjack"
                        );
                        minigameStats.pushes++;
                        await UserDatabase.findOneAndUpdate(
                            {
                                key: {
                                    userId: this.interaction.user.id,
                                    guildId: this.interaction.guild.id,
                                },
                            },
                            {
                                $inc: { "economy.wallet": bet },
                                $set: { "data.minigameStats.$[x].name": data.data.minigameStats },
                            },
                            {
                                arrayFilters: [{ "x.name": "blackjack" }],
                            }
                        );
                    }
                }
            } else {
                desc = `Result: Natural Blackjack`;
                embed.setColor("Green");
                if (bet) {
                    const userData = await UserDatabase.findOne({
                        key: {
                            userId: this.interaction.user.id,
                            guildId: this.interaction.guild.id,
                        },
                    });

                    if (bet === "all") bet = userData.economy.wallet;
                    else bet = parseInt(bet);

                    const data = await UserDatabase.findOne({
                        key: {
                            userId: this.interaction.user.id,
                            guildId: this.interaction.guild.id,
                        },
                    });
                    if (data.data.minigameStats.find((x) => x.name === "blackjack") === undefined) {
                        const minigameStats = {
                            name: "blackjack",
                            wins: 1,
                            losses: 0,
                            pushes: 0,
                            currencyGain: bet,
                            currencyLoss: 0,
                        };
                        await UserDatabase.findOneAndUpdate(
                            {
                                key: {
                                    userId: this.interaction.user.id,
                                    guildId: this.interaction.guild.id,
                                },
                            },
                            {
                                $inc: { "economy.wallet": bet },
                                $push: { "data.minigameStats": minigameStats },
                            }
                        );
                    } else {
                        const minigameStats = data.data.minigameStats.find(
                            (x) => x.name === "blackjack"
                        );
                        minigameStats.wins++;
                        minigameStats.currencyGain += bet;
                        await UserDatabase.findOneAndUpdate(
                            {
                                key: {
                                    userId: this.interaction.user.id,
                                    guildId: this.interaction.guild.id,
                                },
                            },
                            {
                                $inc: { "economy.wallet": bet },
                                $set: { "data.minigameStats.$[x]": data.data.minigameStats },
                            },
                            {
                                arrayFilters: [{ "x.name": "blackjack" }],
                            }
                        );
                    }
                    desc += ` ${this.config.economy.currencySymbol}${bet}`;
                }
            }
            embed.setDescription(desc);
            await this.interaction.editReply({ embeds: [embed], components: [row] });
        } else {
            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setAuthor({
                    name: this.interaction.user.username,
                    iconURL: this.interaction.user.avatarURL(),
                })
                .setTitle("Blackjack")
                .addFields(
                    {
                        name: "Player Hand",
                        value: `${this.showPlayerHand()}\n\nValue: ${
                            this.playerScore === 21 ? "Blackjack" : this.playerScore
                        }`,
                        inline: true,
                    },
                    {
                        name: "Dealer Hand",
                        value: `${this.showDealerHand()}\n\nValue: ${
                            this.dealerScore === 21 ? "Blackjack" : this.dealerScore
                        }`,
                        inline: true,
                    }
                );
            const hit = new ButtonBuilder()
                .setLabel("Hit")
                .setStyle(ButtonStyle.Primary)
                .setCustomId("hit");
            const stand = new ButtonBuilder()
                .setLabel("Stand")
                .setStyle(ButtonStyle.Success)
                .setCustomId("stand");
            const doubleDown = new ButtonBuilder()
                .setLabel("Double Down")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("doubleDown");
            const row = new ActionRowBuilder().addComponents(hit, stand, doubleDown);
            const msg = await this.interaction.editReply({ embeds: [embed], components: [row] });
            this.handleButtons(msg);
        }
    }
    disableButtons(msg) {
        const hit = new ButtonBuilder()
            .setLabel("Hit")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("hit")
            .setDisabled(true);
        const stand = new ButtonBuilder()
            .setLabel("Stand")
            .setStyle(ButtonStyle.Success)
            .setCustomId("stand")
            .setDisabled(true);
        const doubleDown = new ButtonBuilder()
            .setLabel("Double Down")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("doubleDown")
            .setDisabled(true);
        const row = new ActionRowBuilder().addComponents(hit, stand, doubleDown);
        msg.edit({ components: [row] });
    }
    disableDoubleDown(msg) {
        const hit = new ButtonBuilder()
            .setLabel("Hit")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("hit");
        const stand = new ButtonBuilder()
            .setLabel("Stand")
            .setStyle(ButtonStyle.Success)
            .setCustomId("stand");
        const doubleDown = new ButtonBuilder()
            .setLabel("Double Down")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("doubleDown")
            .setDisabled(true);
        const row = new ActionRowBuilder().addComponents(hit, stand, doubleDown);
        msg.edit({ components: [row] });
    }
    handleButtons(msg) {
        const filter = (interaction) => {
            return interaction.user.id === this.interaction.user.id;
        };
        const collector = msg.createMessageComponentCollector({ filter, time: 1000 * 60 * 5 });
        collector.on("collect", async (interaction) => {
            await interaction.deferUpdate().catch((e) => {});
            this.disableDoubleDown(msg);
            if (interaction.customId === "hit") {
                this.hitPlayer();
            } else if (interaction.customId === "stand") {
                this.standPlayer();
            } else if (interaction.customId === "doubleDown") {
                this.doubleDown();
            }
            if (this.gameOver) {
                collector.stop();
                this.endGame(msg);
            } else {
                const embed = new EmbedBuilder()
                    .setColor("Purple")
                    .setAuthor({
                        name: this.interaction.user.username,
                        iconURL: this.interaction.user.avatarURL(),
                    })
                    .setTitle("Blackjack")
                    .addFields(
                        {
                            name: "Player Hand",
                            value: `${this.showPlayerHand()}\n\nValue: ${
                                this.playerScore === 21 ? "Blackjack" : this.playerScore
                            }`,
                            inline: true,
                        },
                        {
                            name: "Dealer Hand",
                            value: `${this.showDealerHand()}\n\nValue: ${
                                this.dealerScore === 21 ? "Blackjack" : this.dealerScore
                            }`,
                            inline: true,
                        }
                    );
                await msg.edit({ embeds: [embed] });
            }
        });
    }
    async endGame(msg) {
        this.dealerScore = this.calculateHandScore(this.dealerHand);
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setAuthor({
                name: this.interaction.user.username,
                iconURL: this.interaction.user.avatarURL(),
            })
            .setTitle("Blackjack")
            .addFields(
                {
                    name: "Player Hand",
                    value: `${this.showPlayerHand()}\n\nValue: ${
                        this.playerScore === 21 ? "Blackjack" : this.playerScore
                    }`,
                    inline: true,
                },
                {
                    name: "Dealer Hand",
                    value: `${this.dealerHand.map((card) => cards[card]).join(" ")}\n\nValue: ${
                        this.dealerScore === 21 ? "Blackjack" : this.dealerScore
                    }`,
                    inline: true,
                }
            );
        let desc = "";
        let bet = this.interaction.options.getString("bet");
        if (this.playerScore > 21) {
            desc = `Result: Bust`;
            embed.setColor("Red");
            if (bet) {
                const userData = await UserDatabase.findOne({
                    key: { userId: this.interaction.user.id, guildId: this.interaction.guild.id },
                });
                if (bet === "all") bet = userData.economy.wallet;
                else bet = parseInt(bet);
                if (this.doubleDowned) bet *= 2;
                let stats = userData.data.minigameStats.find((x) => x.name === "blackjack");
                if (stats === undefined) {
                    stats = {
                        name: "blackjack",
                        wins: 0,
                        losses: 0,
                        pushes: 0,
                        currencyGain: 0,
                        currencyLoss: 0,
                    };
                    stats.losses++;
                    stats.currencyLoss += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $push: { "data.minigameStats": stats },
                        }
                    );
                } else {
                    stats.losses++;
                    stats.currencyLoss += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $set: { "data.minigameStats.$[x]": stats },
                        },
                        { arrayFilters: [{ "x.name": "blackjack" }] }
                    );
                }
                desc += ` ${this.config.economy.currencySymbol}-${bet}`;
            }
        } else if (this.dealerScore > 21) {
            desc = `Result: Dealer bust`;
            embed.setColor("Green");
            if (bet) {
                const userData = await UserDatabase.findOne({
                    key: { userId: this.interaction.user.id, guildId: this.interaction.guild.id },
                });
                if (bet === "all") bet = userData.economy.wallet;
                else bet = parseInt(bet);
                if (this.doubleDowned) bet *= 2;
                let stats = userData.data.minigameStats.find((x) => x.name === "blackjack");
                if (stats === undefined) {
                    stats = {
                        name: "blackjack",
                        wins: 0,
                        losses: 0,
                        pushes: 0,
                        currencyGain: 0,
                        currencyLoss: 0,
                    };
                    stats.wins++;
                    stats.currencyGain += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $push: { "data.minigameStats": stats },
                        }
                    );
                } else {
                    stats.wins++;
                    stats.currencyGain += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $set: { "data.minigameStats.$[x]": stats },
                        },
                        { arrayFilters: [{ "x.name": "blackjack" }] }
                    );
                }
                desc += ` ${this.config.economy.currencySymbol}${bet}`;
            }
        } else if (this.playerScore > this.dealerScore) {
            desc = `Result: Win`;
            embed.setColor("Green");
            if (bet) {
                const userData = await UserDatabase.findOne({
                    key: { userId: this.interaction.user.id, guildId: this.interaction.guild.id },
                });
                if (bet === "all") bet = userData.economy.wallet;
                else bet = parseInt(bet);
                if (this.doubleDowned) bet *= 2;
                let stats = userData.data.minigameStats.find((x) => x.name === "blackjack");
                if (stats === undefined) {
                    stats = {
                        name: "blackjack",
                        wins: 0,
                        losses: 0,
                        pushes: 0,
                        currencyGain: 0,
                        currencyLoss: 0,
                    };
                    stats.wins++;
                    stats.currencyGain += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $push: { "data.minigameStats": stats },
                        }
                    );
                } else {
                    stats.wins++;
                    stats.currencyGain += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $set: { "data.minigameStats.$[x]": stats },
                        },
                        { arrayFilters: [{ "x.name": "blackjack" }] }
                    );
                }
                desc += ` ${this.config.economy.currencySymbol}${bet}`;
            }
        } else if (this.playerScore < this.dealerScore) {
            desc = `Result: Loss`;
            embed.setColor("Red");
            if (bet) {
                const userData = await UserDatabase.findOne({
                    key: { userId: this.interaction.user.id, guildId: this.interaction.guild.id },
                });
                if (bet === "all") bet = userData.economy.wallet;
                else bet = parseInt(bet);
                if (this.doubleDowned) bet *= 2;
                let stats = userData.data.minigameStats.find((x) => x.name === "blackjack");
                if (stats === undefined) {
                    stats = {
                        name: "blackjack",
                        wins: 0,
                        losses: 0,
                        pushes: 0,
                        currencyGain: 0,
                        currencyLoss: 0,
                    };
                    stats.losses++;
                    stats.currencyLoss += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $push: { "data.minigameStats": stats },
                        }
                    );
                } else {
                    stats.losses++;
                    stats.currencyLoss += bet;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $inc: { "economy.wallet": -bet },
                            $set: { "data.minigameStats.$[x]": stats },
                        },
                        { arrayFilters: [{ "x.name": "blackjack" }] }
                    );
                }
                desc += ` ${this.config.economy.currencySymbol}-${bet}`;
            }
        } else {
            desc = `Result: Push`;
            embed.setColor("Orange");
            if (bet) {
                desc += `, money back`;
                const userData = await UserDatabase.findOne({
                    key: { userId: this.interaction.user.id, guildId: this.interaction.guild.id },
                });
                let stats = userData.data.minigameStats.find((x) => x.name === "blackjack");
                if (stats === undefined) {
                    stats = {
                        name: "blackjack",
                        wins: 0,
                        losses: 0,
                        pushes: 0,
                        currencyGain: 0,
                        currencyLoss: 0,
                    };
                    stats.pushes++;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        {
                            $push: { "data.minigameStats": stats },
                        }
                    );
                } else {
                    stats.pushes++;
                    await UserDatabase.findOneAndUpdate(
                        {
                            key: {
                                userId: this.interaction.user.id,
                                guildId: this.interaction.guild.id,
                            },
                        },
                        { $set: { "data.minigameStats.$[x]": stats } },
                        { arrayFilters: [{ "x.name": "blackjack" }] }
                    );
                }
            }
        }
        embed.setDescription(desc);
        this.disableButtons(msg);
        msg.edit({ embeds: [embed] });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Play a game of blackjack!")
        .addStringOption((option) =>
            option
                .setName("bet")
                .setDescription(
                    "The amount of money you want to bet. Must be less than 100k, or all."
                )
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const bet = options.getString("bet");
        const userData = await UserDatabase.findOne({
            key: { userId: user.id, guildId: guild.id },
        });
        if (bet && config.economy.enabled === false) {
            return await interaction.reply({
                content: "Economy is disabled in this server!",
                ephemeral: true,
            });
        }
        if (bet) {
            const parsedBet = parseInt(bet, 10);
            if (
                bet === "all" ||
                (parsedBet > 0 && parsedBet <= userData.economy.wallet && parsedBet <= 100000)
            ) {
                await interaction.deferReply();
                const game = new Blackjack(interaction, config);
                game.startGame();
            } else {
                return await interaction.reply({
                    content:
                        "Please enter a valid positive number, 'all', or an amount within your wallet balance!",
                    ephemeral: true,
                });
            }
        } else {
            await interaction.deferReply();
            const game = new Blackjack(interaction, config);
            game.startGame();
        }
        return;
    },
};
