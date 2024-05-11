const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");
const novelModel = require("../../models/novels");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("novel")
        .setDescription("Get information on a novel")
        .addStringOption((option) =>
            option
                .setName("novel")
                .setDescription("The name of the novel you want to get information on.")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const novel = options.getString("novel");
        const data = await novelModel.findOne({ title: novel });
        if (!data) {
            const embed = new EmbedBuilder()
                .setTitle("Novel Not Found")
                .setDescription(`The novel ${novel} was not found in the database.`)
                .setColor("Red")
                .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL() });
            await interaction.reply({ embeds: [embed] });
            return;
        } else {
            try {
                const embed = new EmbedBuilder()
                    .setTitle(`${data.title} by ${data.author}`)
                    .setURL(data.url)
                    .addFields(
                        { name: "Rank", value: `${data.rank}`, inline: true },
                        { name: "Rating", value: `${data.rating}`, inline: true },
                        { name: "Status", value: data.status, inline: true },
                        { name: "Number of Chapters", value: `${data.numChapter}`, inline: true },
                        { name: "Views", value: `${data.views}`, inline: true },
                        { name: "Bookmarks", value: `${data.bookmarks}`, inline: true }
                    )
                    .setDescription(
                        `**Summary:** ${data.summary}\n\n**Categories:** ${data.categories.join(
                            ", "
                        )}\n**Tags:** ${data.tags.join(", ")}`
                    )
                    .setThumbnail(data.cover)
                    .setColor("Green")
                    .setFooter({
                        text: `Requested by ${user.tag}`,
                        iconURL: user.displayAvatarURL(),
                    });
                await interaction.reply({ embeds: [embed] }).catch(() => {});
            } catch (error) {
                const description = `**Summary:** ${
                    data.summary
                }\n\n**Categories:** ${data.categories.join(", ")}\n**Tags:** ${data.tags.join(
                    ", "
                )}`;
                const chunks = description.match(/[\s\S]{1,4000}/g);
                for (let i = 0; i < chunks.length; i++) {
                    const embed = new EmbedBuilder()
                        .setTitle(`${data.title} by ${data.author}`)
                        .setURL(data.url)
                        .addFields(
                            { name: "Rank", value: `${data.rank}`, inline: true },
                            { name: "Rating", value: `${data.rating}`, inline: true },
                            { name: "Status", value: data.status, inline: true },
                            {
                                name: "Number of Chapters",
                                value: `${data.numChapter}`,
                                inline: true,
                            },
                            { name: "Views", value: `${data.views}`, inline: true },
                            { name: "Bookmarks", value: `${data.bookmarks}`, inline: true }
                        )
                        .setDescription(chunks[i])
                        .setThumbnail(data.cover)
                        .setColor("Green")
                        .setFooter({
                            text: `Requested by ${user.tag}`,
                            iconURL: user.displayAvatarURL(),
                        });
                    if (i !== chunks.length - 1) {
                        embed.setThumbnail(null);
                        embed.setTitle(null);
                        embed.setFields([]);
                    }
                    await interaction.reply({ embeds: [embed] }).catch(async () => {
                        await interaction.followUp({ embeds: [embed] });
                    });
                }
                return;
            }
        }
        return;
    },
};
