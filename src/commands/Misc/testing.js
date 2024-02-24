const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

async function waitForMessage(channel, userId) {
    return new Promise((resolve, reject) => {
        const filter = (message) => message.author.id === userId;
        const collector = channel.createMessageCollector();
        console.log("Created message collector");
        collector.on("collect", async (message) => {
            console.log("Message collected.");
            if (message.author.id !== userId) {
                await collector.stop();
                console.log("Ended message collector");
                resolve(message.content);
            } else {
                console.log("Bot message");
            }
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
                reject(new Error("No message collected in time"));
            }
        });
    });
}
async function receiveAnswer(interaction, dmChannel, question, answers) {
    await dmChannel.send(question);
    console.log("Waiting for message");
    const message = await waitForMessage(dmChannel, interaction.user.id);
    console.log("Message received.");
    answers.push(message);
    console.log(message);
    console.log(answers);
}
async function askQuestions(interaction, questions) {
    const answers = [];
    const dmChannel = await interaction.user.createDM();
    for (let question of questions) {
        console.log(question);
        await receiveAnswer(interaction, dmChannel, question, answers);
    }
}

module.exports = {
    data: new SlashCommandBuilder().setName("test-dm").setDescription("test"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        let cooldown = 0;
        if (config.cooldowns.filter((c) => c.name === interaction.commandName).length > 0) {
            cooldown = config.cooldowns.find((c) => c.name === interaction.commandName).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
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
        return;
    },
};
