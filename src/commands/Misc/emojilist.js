const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("emoji-list").setDescription("List the server emojis"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const chunkArray = async (array, size) => {
            let chunks = [];
            for (let i = 0; i < array.length; i += size) {
                const chunk = array.slice(i, i + size);
                chunks.push(chunk);
            }
            return chunks;
        };
        const send = async (chunked) => {
            var intResponse = 0;
            await chunked.forEach(async (emoji) => {
                if (intResponse == 1) {
                    embed.setDescription(emoji.join(" ")).setTitle(" ");
                    await interaction.channel.send({ embeds: [embed] });
                } else {
                    intResponse = 1;
                    const total = cache.size;
                    const animated = cache.filter((emoji) => emoji.animated).size;
                    embed
                        .setTitle(
                            `${total - animated} Regular, ${animated} Animated, ${total} Total`
                        )
                        .setDescription(emoji.join(" "));
                    await interaction.reply({ embeds: [embed] });
                }
            });
        };
        var emojis = [];
        var cache = await guild.emojis.cache;
        await cache.forEach(async (emoji) => {
            if (emoji.animated) {
                emojis.push(`<a:${emoji.name}:${emoji.id}>`);
            } else {
                emojis.push(`<:${emoji.name}:${emoji.id}>`);
            }
        });
        var chunked = await chunkArray(emojis, 50);
        const embed = new EmbedBuilder().setColor("Purple");
        var redo;
        await chunked.forEach(async (chunk) => {
            if (chunk.join(" ").length > 4000) redo = true;
            else redo = false;
        });
        if (redo) {
            var newChunk = await chunkArray(20);
            send(newChunk);
        } else {
            send(chunked);
        }
        return;
    },
};
