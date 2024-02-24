const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

async function askQuestions(interaction, questions) {
    const answers = [];
    const dmChannel = await interaction.user.createDM();
    for (let i = 0; i < questions.length; i++) {
        await dmChannel.send(questions[i]);
        try {
            const filter = (response) => response.author.id === interaction.user.id;
            // Wait for the next message from the user
            const collected = await dmChannel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ["time"],
            });
            const response = collected.first().content;
            answers.push(response);
        } catch (error) {
            dmChannel.send(
                "You didn't reply in time. Please try the command again if you wish to complete it."
            );
            return; // Exit if the user doesn't respond in time
        }
    }

    // Send an embed with all the questions and answers
    sendEmbed(interaction.user, questions, answers);
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("askme")
        .setDescription("Starts a series of 10 random questions."),
    async execute(interaction) {
        await interaction.reply({
            content: "Starting the question series! Please check your DMs.",
            ephemeral: true,
        });
        const questions = [
            "What's your favorite color?",
            "What's your hobby?",
            "What's the last book you read?",
            "Who's your favorite artist?",
            "What's your dream job?",
            "If you could visit any country, which would it be?",
            "What's your favorite movie?",
            "What's a skill you'd like to learn?",
            "What's your favorite food?",
            "If you could have any pet, what would it be?",
        ];

        askQuestions(interaction, questions);
    },
};
