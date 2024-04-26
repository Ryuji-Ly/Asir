const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const Userdatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");
const cards = {
    C2: "<:2C:1192958731370102835>",
    C3: "<:3C:1192958816204095540>",
    C4: "<:4C:1192958911452549272>",
    C5: "<:5C:1192958970881654875>",
    C6: "<:6C:1192959093325971527>",
    C7: "<:7C:1192960134046040084>",
    C8: "<:8C:1192960272806203532>",
    C9: "<:9C:1192960369287766147>",
    C10: "<:10C:1192960383758127235>",
    CJ: "<:JC:1192962014830669868>",
    CQ: "<:QC:1192962028344713356>",
    CK: "<:KC:1192962460962009138>",
    CA: "<:AC:1192962536044253184>",
    H2: "<:2H:1192958783610175568>",
    H3: "<:3H:1192958846172409926>",
    H4: "<:4H:1192958942662369304>",
    H5: "<:5H:1192959033431298160>",
    H6: "<:6H:1192959121436188803>",
    H7: "<:7H:1192960189851254916>",
    H8: "<:8H:1192960279416406106>",
    H9: "<:9H:1192960376145465437>",
    H10: "<:10H:1192960538116894730>",
    HJ: "<:JH:1192962020329398353>",
    HQ: "<:QH:1192962035944788079>",
    HK: "<:KH:1192962466729164800>",
    HA: "<:AH:1192962544688701441>",
    D2: "<:2D:1192958746981310504>",
    D3: "<:3D:1192958831907569806>",
    D4: "<:4D:1192958925931282523>",
    D5: "<:5D:1192959016461152387>",
    D6: "<:6D:1192959109125914634>",
    D7: "<:7D:1192960146679279736>",
    D8: "<:8D:1192960275389894716>",
    D9: "<:9D:1192960373259763843>",
    D10: "<:10D:1192960387524595823>",
    DJ: "<:JD:1192962017573740775>",
    DQ: "<:QD:1192962032056668160>",
    DK: "<:KD:1192962464124510439>",
    DA: "<:AD:1192962540062396466>",
    S2: "<:2S:1192958797812076686>",
    S3: "<:3S:1192958881022877777>",
    S4: "<:4S:1192958955333374034>",
    S5: "<:5S:1192959066125914202>",
    S6: "<:6S:1192959133939400704>",
    S7: "<:7S:1192960204275470336>",
    S8: "<:8S:1192960283438743633>",
    S9: "<:9S:1192960380197146695>",
    S10: "<:10S:1192960541241643109>",
    SJ: "<:JS:1192962023500300300>",
    SQ: "<:QS:1192962171173355671>",
    SK: "<:KS:1192962470076223598> ",
    SA: "<:AS:1192962549080133653>",
};

class BlackjackGame {
    constructor(interaction, client) {
        this.interaction = interaction;
        this.client = client;
        this.deck = this.generateDeck();
        this.playerHand = [];
        this.dealerHand = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.gameOver = false;
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
    async startGame() {
        this.shuffleDeck();
        this.playerHand = [this.dealCard(), this.dealCard()];
        this.dealerHand = [this.dealCard(), this.dealCard()];
        this.calculateScores();
        const playerHandString = this.playerHand.map((card) => cards[card]).join(" ");
        const dealerHandString = this.dealerHand.map((card) => cards[card]).join(" ");
        let desc = `**Your Hand:** ${playerHandString}\n**Dealer's Hand:** ${dealerHandString}`;
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("Blackjack")
            .addFields(
                { name: "Your Score:", value: `${this.playerScore}`, inline: true },
                { name: "Dealer's Score:", value: `${this.dealerScore}`, inline: true }
            );
        const hitButton = new ButtonBuilder()
            .setCustomId("blackjack_hit")
            .setLabel("Hit")
            .setStyle(ButtonStyle.Primary);
        const standButton = new ButtonBuilder()
            .setCustomId("blackjack_stand")
            .setLabel("Stand")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(hitButton, standButton);
        embed.setDescription(desc);
        const msg = await this.interaction.editReply({ embeds: [embed], components: [row] });
        this.handleButtons(msg);
    }
    calculateScores() {
        this.playerScore = this.calculateHandScore(this.playerHand);
        this.dealerScore = this.calculateHandScore(this.dealerHand);
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
        // Adjust for Aces
        while (score > 21 && hasAce) {
            score -= 10;
            hasAce = false;
        }
        return score;
    }
    async hit(msg) {
        if (this.gameOver) return;
        const card = this.dealCard();
        this.playerHand.push(card);
        this.calculateScores();
        if (this.playerScore > 21) {
            await this.endGame(msg);
        } else {
            await this.sendGameEmbed(msg);
        }
    }
    async stand(msg) {
        if (this.gameOver) return;
        while (this.dealerScore < 17) {
            this.dealerHand.push(this.dealCard());
            this.calculateScores();
        }
        await this.endGame(msg);
    }
    async endGame(msg) {
        this.gameOver = true;
        await this.sendGameEmbed(msg);
    }
    handleButtons(msg) {
        const collector = msg.createMessageComponentCollector({ idle: 1000 * 60 * 5 });
        collector.on("collect", async (btn) => {
            await btn.deferUpdate().catch((e) => {});
            if (btn.user.id !== this.interaction.user.id) {
                btn.followUp({ content: `Not your buttons.`, ephemeral: true });
                return;
            }
            if (btn.customId.split("_")[1] === "hit") {
                await this.hit(msg);
            } else if (btn.customId.split("_")[1] === "stand") {
                await this.stand(msg);
            }
        });
    }
    async sendGameEmbed(msg) {
        const playerHandString = this.playerHand.map((card) => cards[card]).join(" ");
        const dealerHandString = this.dealerHand.map((card) => cards[card]).join(" ");
        let desc = `**Your Hand:** ${playerHandString}\n**Dealer's Hand:** ${dealerHandString}`;
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("Blackjack")
            .addFields(
                { name: "Your Score:", value: `${this.playerScore}`, inline: true },
                { name: "Dealer's Score:", value: `${this.dealerScore}`, inline: true }
            );
        if (this.gameOver) {
            desc += `\n\nGame Over! ${this.determineWinner()}`;
            const config = await this.client.configs.get(this.interaction.guild.id);
            if (config.economy.enabled) {
                const bet = this.interaction.options.getInteger("bet");
                let change = 0;
                if (bet) {
                    if (
                        this.determineWinner() === "Dealer busted! You win." ||
                        this.determineWinner() === "You win!"
                    ) {
                        await Userdatabase.findOneAndUpdate(
                            {
                                key: {
                                    userId: this.interaction.user.id,
                                    guildId: this.interaction.guild.id,
                                },
                            },
                            { $inc: { "economy.wallet": bet * 2 } }
                        );
                        change = bet * 2;
                    } else if (this.determineWinner() === "It's a tie!") {
                    } else {
                        data.economy.wallet -= bet;
                        change = -bet;
                        await data.save();
                    }
                }
                embed.setFooter({
                    text: `You gambled and got ${change} ${config.economy.currency} ${config.economy.currencySymbol}`,
                });
            }
        }
        embed.setDescription(desc);
        msg.edit({ embeds: [embed] });
    }
    determineWinner() {
        if (this.playerScore > 21) {
            return "You busted! Dealer wins.";
        } else if (this.dealerScore > 21) {
            return "Dealer busted! You win.";
        } else if (this.playerScore > this.dealerScore) {
            return "You win!";
        } else if (this.playerScore < this.dealerScore) {
            return "Dealer wins.";
        } else {
            return "It's a tie!";
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Play a game of Blackjack!")
        .addIntegerOption((option) =>
            option
                .setName("bet")
                .setDescription("Make a bet, if you win, you get double your gamble")
                .setMinValue(100)
                .setMaxValue(10000)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const bet = options.getInteger("bet");
        if (bet && !config.economy.enabled)
            return interaction.reply({ content: "Economy is disabled", ephemeral: true });
        const data = await Userdatabase.findOne({ key: { userId: user.id, guildId: guild.id } });
        if (data.economy.wallet < bet)
            return interaction.reply({
                content: `You do not have enough ${config.economy.currency} ${config.economy.currencySymbol}`,
                ephemeral: true,
            });
        await interaction.deferReply();
        const blackjack = new BlackjackGame(interaction, client);
        blackjack.startGame();
        return;
    },
};
