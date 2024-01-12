const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const questions = [
    {
        category: "Entertainment",
        question:
            "Question: Which reality TV series do you associate with the quote: 'The tribe has spoken'?",
        correctAnswer: "Survivor",
        incorrectAnswers: ["Outlast", "Surviving Paradise", "The Law of the Jungle"],
    },
    {
        category: "Entertainment",
        question: "From what country is Twilight-star Robert Pattinson?",
        correctAnswer: "England",
        incorrectAnswers: ["Scotland", "USA", "Ireland"],
    },
    {
        category: "Entertainment",
        question:
            "Actor Jean Reno was born in Morocco but moved to another country at age 17. Where did he move?",
        correctAnswer: "France",
        incorrectAnswers: ["Spain", "USA", "England"],
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
                .addChoices()
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        interaction.reply({ content: "This command is still being programmed", ephemeral: true });
        return;
    },
};
