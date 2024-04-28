const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
function chunkDescription(description) {
    const chunks = [];
    const maxChunkLength = 4000;
    let currentChunk = "";
    for (const line of description.split("\n")) {
        if (currentChunk.length + line.length > maxChunkLength) {
            chunks.push(currentChunk);
            currentChunk = "";
        }
        currentChunk += line + "\n";
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
}
async function sendEmbedWithChunks(interaction, chunks) {
    if (!chunks || chunks.length === 0) return;
    const totalChunks = chunks.length;
    const embeds = [];
    if (totalChunks === 1) {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${interaction.user.username}'s overview of commands`)
            .setDescription(chunks.shift())
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    } else {
        const firstEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`${interaction.user.username}'s overview of commands`)
            .setDescription(chunks.shift())
            .setFooter({ text: `[1/${totalChunks}]` })
            .setTimestamp();
        await interaction.editReply({ content: null, embeds: [firstEmbed] });
    }
    let currentChunk = 1;

    for (const chunk of chunks) {
        const subsequentEmbed = new EmbedBuilder();
        subsequentEmbed.setTitle(null);
        subsequentEmbed.setDescription(chunk);
        subsequentEmbed.setFooter({
            text: `[${currentChunk + 1}/${totalChunks}]`,
        });
        subsequentEmbed.setColor("Green");
        subsequentEmbed.setTimestamp();
        currentChunk++;
        embeds.push(subsequentEmbed);
    }

    for (const embed of embeds) {
        await interaction.channel.send({ embeds: [embed] });
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("commands")
        .setDescription("Show all the commands you have used."),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.reply({
            content: "Sending all the commands you have used...",
        });
        const userData = await UserDatabase.findOne({
            "key.userId": user.id,
            "key.guildId": guild.id,
        });
        let description = "";
        description = userData.data.commands
            .map((command) => {
                return `**${command.name}**: ${command.value}`;
            })
            .join("\n");
        const chunks = chunkDescription(description);
        await sendEmbedWithChunks(interaction, chunks);
        return;
    },
};
