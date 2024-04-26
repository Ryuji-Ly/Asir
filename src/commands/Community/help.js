const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
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
async function sendEmbedWithChunks(channel, chunks) {
    if (!chunks || chunks.length === 0) return;
    const totalChunks = chunks.length;
    const embeds = [];
    if (totalChunks === 1) {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`Overview of commands`)
            .setDescription(chunks.shift())
            .setTimestamp();
        embeds.push(embed);
    } else {
        const firstEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`Overview of commands`)
            .setDescription(chunks.shift())
            .setFooter({ text: `[1/${totalChunks}]` })
            .setTimestamp();
        embeds.push(firstEmbed);
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
        await channel.send({ embeds: [embed] });
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Gives every command and their descriptions."),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.reply({
            content: "Here are all the commands and their descriptions:",
            ephemeral: true,
        });
        const commands = await client.commands.map((command) => {
            return {
                name: command.data.name,
                description: command.data.description,
            };
        });
        const desc = commands.map((command) => {
            return `\`${command.name}\` - ${command.description}`;
        });
        const chunks = chunkDescription(desc.join("\n"));
        await sendEmbedWithChunks(interaction.channel, chunks);
        return;
    },
};
