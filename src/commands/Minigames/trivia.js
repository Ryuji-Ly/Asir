const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const questions = [
    {
        category: "Novels",
        question: "Who is the author of the famous Japanese light novel 'Sword Art Online'?",
        correctAnswer: "Reki Kawahara",
        incorrectAnswers: ["NisiOisiN", "Yuu Kamiya", "Fujino Ōmori"],
    },
    {
        category: "Novels",
        question: "What is the pen name of the Chinese author known for 'The King's Avatar'?",
        correctAnswer: "Butterfly Blue",
        incorrectAnswers: ["Mo Xiang Tong Xiu", "Tang Jia San Shao", "I Eat Tomatoes"],
    },
    {
        category: "Novels",
        question: "Which Chinese web novel features the protagonist Wei Wuxian?",
        correctAnswer: "The Untamed (Mo Dao Zu Shi)",
        incorrectAnswers: ["The King's Avatar", "Nirvana in Fire", "Joy of Life"],
    },
    {
        category: "Novels",
        question:
            "Who wrote the Japanese light novel series 'Re:Zero - Starting Life in Another World'?",
        correctAnswer: "Tappei Nagatsuki",
        incorrectAnswers: ["Natsume Akatsuki", "Nisio Isin", "Hajime Isayama"],
    },
    {
        category: "Novels",
        question: "Who is the author of the Chinese web novel 'The Three-Body Problem'?",
        correctAnswer: "Liu Cixin",
        incorrectAnswers: ["Chen Qiufan", "Xia Jia", "Jiang Bo"],
    },
    {
        category: "Novels",
        question: "In the Chinese web novel 'Legend of Fei', who is the main female protagonist?",
        correctAnswer: "Zhou Fei",
        incorrectAnswers: ["Lin Xie", "Xie Yun", "Li Sheng"],
    },
    {
        category: "Novels",
        question:
            "Which Korean web novel follows the story of Eun Danoh, who realizes she is a character in a manhwa?",
        correctAnswer: "Extraordinary You",
        incorrectAnswers: ["Love Revolution", "My ID is Gangnam Beauty", "W - Two Worlds"],
    },
    {
        category: "Novels",
        question:
            "What is the title of the Japanese light novel series about a high school boy who gains the ability to 'Return by Death'?",
        correctAnswer: "Re:Zero - Starting Life in Another World",
        incorrectAnswers: ["No Game No Life", "Overlord", "The Rising of the Shield Hero"],
    },
    {
        category: "Novels",
        question: "Who is the author of the Chinese web novel 'I Shall Seal the Heavens'?",
        correctAnswer: "Er Gen",
        incorrectAnswers: ["Tang Jia San Shao", "Mo Xiang Tong Xiu", "I Eat Tomatoes"],
    },
    {
        category: "Novels",
        question: "In the Korean web novel 'Solo Leveling', what is the protagonist's name?",
        correctAnswer: "Sung Jin-Woo",
        incorrectAnswers: ["Kang Tae-Shin", "Lee Min-Ho", "Park Jin-Ho"],
    },
    {
        category: "Novels",
        question:
            "Which Chinese web novel follows the adventures of the protagonist, Xiao Yan, in the Alchemist's world?",
        correctAnswer: "Battle Through the Heavens",
        incorrectAnswers: ["Martial World", "Coiling Dragon", "Desolate Era"],
    },
    {
        category: "Novels",
        question: "Who is the author of the Japanese light novel series 'Spice and Wolf'?",
        correctAnswer: "Isuna Hasekura",
        incorrectAnswers: ["Nisio Isin", "Reki Kawahara", "Yuu Kamiya"],
    },
    {
        category: "Novels",
        question: "In the Chinese web novel 'A Will Eternal', what is the main character's name?",
        correctAnswer: "Bai Xiaochun",
        incorrectAnswers: ["Chen Fan", "Li Qiye", "Lin Ming"],
    },
    {
        category: "Novels",
        question:
            "In the Japanese light novel series 'No Game No Life', what is the name of the brother-sister duo who are the protagonists?",
        correctAnswer: "Sora and Shiro",
        incorrectAnswers: ["Hikigaya and Yukino", "Kirito and Asuna", "Rimuru and Shuna"],
    },
    {
        category: "Novels",
        question:
            "Who is the author of the Japanese light novel series 'The Irregular at Magic High School'?",
        correctAnswer: "Tsutomu Satou",
        incorrectAnswers: ["Reki Kawahara", "Nisio Isin", "Yuu Kamiya"],
    },
    {
        category: "Novels",
        question:
            "What is the name of the protagonist in the Chinese web novel 'The King's Avatar'?",
        correctAnswer: "Ye Xiu",
        incorrectAnswers: ["Su Muqiu", "Han Wenqing", "Chen Guo"],
    },
    {
        category: "Novels",
        question:
            "In 'Lord of the Mysteries', what is the name of the protagonist who transmigrates into a different world?",
        correctAnswer: "Zhou Mingrui",
        incorrectAnswers: ["Lumian Lee", "Gehrman Sparrow", "Klein Moretti"],
    },
    {
        category: "Novels",
        question:
            "In 'The Legendary Mechanic', what is the protagonist's alias as he becomes a legendary mechanic?",
        correctAnswer: "Black Star",
        incorrectAnswers: ["Leek Farmer", "Mechanic Emperor", "Black Phantom"],
    },
    {
        category: "Novels",
        question:
            "What do the readers of 'Shadow Slave' blame whenever something unlikely happens?",
        correctAnswer: "Fated",
        incorrectAnswers: ["Sunny", "Cassie", "Nightmare Spell"],
    },
    {
        category: "Novels",
        question: "What is the main strength of the protagonist of 'Mother of Learning'?",
        correctAnswer: "Mind Magic",
        incorrectAnswers: ["Combat Magic", "Divination", "Shaping skills"],
    },
    {
        category: "Technology",
        question: "Who is the largest tech company by market share?",
        correctAnswer: "Microsoft",
        incorrectAnswers: ["Apple", "Nvidia", "Google"],
    },
    {
        category: "History",
        question: "When did world war 2 end?",
        correctAnswer: "1945",
        incorrectAnswers: ["1939", "1944", "1918"],
    },
    {
        category: "Manga",
        question: "Who is the creator of the popular manga 'Naruto'?",
        correctAnswer: "Masashi Kishimoto",
        incorrectAnswers: ["Akira Toriyama", "Eiichiro Oda", "Hirohiko Araki"],
    },
    {
        category: "Anima",
        question: "Which anime series revolves around a boy who sells his soul to a demon?",
        correctAnswer: "Black Butler",
        incorrectAnswers: ["Demon Slayer", "Black Clover", "Bleach"],
    },
    {
        category: "Music",
        question: "Who's album sold the most?",
        correctAnswer: "Michael Jackson",
        incorrectAnswers: ["Pink Floyd", "AC/DC", "Backstreet Boys"],
    },
    {
        category: "Geography",
        question: "How many contenets are there?",
        correctAnswer: "7",
        incorrectAnswers: ["5", "4", "6"],
    },
    {
        category: "Sports",
        question: "Which team won the most world cups?",
        correctAnswer: "Brazil",
        incorrectAnswers: ["Germany", "France", "Argentina"],
    },
    {
        category: "Novels",
        question: 'Who is the author of "The beginning of the end"',
        correctAnswer: "TurtleMe",
        incorrectAnswers: ["Guilty3", "Adui", "Zogarth"],
    },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("trivia")
        .setDescription("Play a game of Trivia")
        .addStringOption((option) =>
            option
                .setName("category")
                .setDescription("What category you want the question to be.")
                .addChoices(
                    { name: "Any", value: "Any" },
                    { name: "Novels", value: "Novels" },
                    { name: "Manga", value: "Manga" },
                    { name: "Anime", value: "Anime" },
                    { name: "History", value: "History" },
                    { name: "Science", value: "Science" },
                    { name: "Music", value: "Music" },
                    { name: "Geography", value: "Geography" },
                    { name: "Sports", value: "Sports" },
                    { name: "Technology", value: "Technology" },
                    { name: "Food and Drink", value: "Food and Drink" },
                    { name: "Art and Culture", value: "Art and Culture" }
                )
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        let category = options.getString("category");
        if (!category) category = "Any";
        const getRandomQuestion = (questionsArray) => {
            const randomIndex = Math.floor(Math.random() * questionsArray.length);
            const randomQuestion = questionsArray[randomIndex];
            return randomQuestion;
        };
        await interaction.deferReply();
        let validQuestions = [];
        if (category === "Any") {
            validQuestions = questions;
        } else {
            validQuestions = questions.filter((question) => question.category === category);
        }
        if (validQuestions.length === 0) {
            const embed = new EmbedBuilder()
                .setDescription(`There are no questions for the category ${category} yet.`)
                .setColor("Purple");
            return interaction.editReply({ embeds: [embed] });
        }
        const randomQuestion = getRandomQuestion(validQuestions);
        const { question, correctAnswer, incorrectAnswers } = randomQuestion;
        const answers = [correctAnswer, ...incorrectAnswers];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        const correctAnswerIndex =
            shuffledAnswers.findIndex((answer) => answer === correctAnswer) + 1;
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setTitle(`Category: ${category}`)
            .setDescription(question)
            .setFooter({
                text: "Currently only 20 novel questions... Too tired to try and come up with more. I would appreciate it if others sent me some more from other categories.",
            })
            .setColor("Purple");
        const row = new ActionRowBuilder();
        shuffledAnswers.forEach((answer, index) => {
            embed.addFields({ name: `Option ${index + 1}`, value: `${answer}`, inline: true });
            const button = new ButtonBuilder()
                .setLabel(`Option ${index + 1}`)
                .setCustomId(`answer_${index + 1}`)
                .setStyle(ButtonStyle.Primary);
            row.addComponents(button);
        });
        const msg = await interaction.editReply({ embeds: [embed], components: [row] });
        const collector = msg.createMessageComponentCollector({ idle: 180000 });
        collector.on("collect", async (btn) => {
            await btn.deferUpdate().catch((e) => {});
            if (btn.user.id !== user.id) {
                btn.followUp({ content: `Not your buttons.`, ephemeral: true });
                return;
            }
            const answerIndex = btn.customId.split("_")[1];
            const isCorrect = `${answerIndex}` === `${correctAnswerIndex}`;
            row.components.forEach((component) => {
                component.setDisabled(true);
                if (component.data.custom_id === btn.customId) {
                    component.setStyle(isCorrect ? ButtonStyle.Success : ButtonStyle.Danger);
                } else {
                    component.setStyle(ButtonStyle.Secondary);
                }
            });
            msg.edit({ components: [row] });
            const embed = new EmbedBuilder()
                .setTitle(question)
                .setDescription(
                    isCorrect
                        ? "You have won! Congrats I guess, still need to program rewards into this though."
                        : "You have lost your dignity."
                )
                .setColor(isCorrect ? "Green" : "Red");
            await btn.editReply({ embeds: [embed] });
            return;
        });
        return;
    },
};
