const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");
const novelModel = require("../../models/novels");
function numberToStringWithSuffix(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B";
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    } else {
        return num.toString();
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("novel")
        .setDescription("Get information on a novel, or show a random novel.")
        .addStringOption((option) =>
            option
                .setName("novel")
                .setDescription("The name of the novel you want to get information on.")
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
        if (novel) {
            const data = await novelModel.findOne({ title: novel });
            if (!data) {
                const embed = new EmbedBuilder()
                    .setTitle("Novel Not Found")
                    .setDescription(`The novel ${novel} was not found in the database.`)
                    .setColor("Red")
                    .setFooter({
                        text: `Requested by ${user.tag}`,
                        iconURL: user.displayAvatarURL(),
                    });
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
                            {
                                name: "Number of Chapters",
                                value: `${data.numChapter}`,
                                inline: true,
                            },
                            {
                                name: "Views",
                                value: `${numberToStringWithSuffix(data.views)}`,
                                inline: true,
                            },
                            {
                                name: "Bookmarks",
                                value: `${numberToStringWithSuffix(data.bookmarks)}`,
                                inline: true,
                            }
                        )
                        .setDescription(
                            `**Summary:** ${data.summary}\n**Categories:** ${data.categories.join(
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
                    }\n**Categories:** ${data.categories.join(", ")}\n**Tags:** ${data.tags.join(
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
                                {
                                    name: "Views",
                                    value: `${numberToStringWithSuffix(data.views)}`,
                                    inline: true,
                                },
                                {
                                    name: "Bookmarks",
                                    value: `${numberToStringWithSuffix(data.bookmarks)}`,
                                    inline: true,
                                }
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
        } else {
            const novels = await novelModel.find();
            const data = novels[Math.floor(Math.random() * novels.length)];
            try {
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
                        {
                            name: "Views",
                            value: `${numberToStringWithSuffix(data.views)}`,
                            inline: true,
                        },
                        {
                            name: "Bookmarks",
                            value: `${numberToStringWithSuffix(data.bookmarks)}`,
                            inline: true,
                        }
                    )
                    .setDescription(
                        `**Summary:** ${data.summary}\n**Categories:** ${data.categories.join(
                            ", "
                        )}\n**Tags:** ${data.tags.join(", ")}`
                    )
                    .setThumbnail(data.cover)
                    .setColor("Green")
                    .setFooter({
                        text: `Random novel requested by ${user.tag}`,
                        iconURL: user.displayAvatarURL(),
                    });
                await interaction.reply({ embeds: [embed] }).catch(() => {});
            } catch (error) {
                const description = `**Summary:** ${
                    data.summary
                }\n**Categories:** ${data.categories.join(", ")}\n**Tags:** ${data.tags.join(
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
                            {
                                name: "Views",
                                value: `${numberToStringWithSuffix(data.views)}`,
                                inline: true,
                            },
                            {
                                name: "Bookmarks",
                                value: `${numberToStringWithSuffix(data.bookmarks)}`,
                                inline: true,
                            }
                        )
                        .setDescription(chunks[i])
                        .setThumbnail(data.cover)
                        .setColor("Green")
                        .setFooter({
                            text: `Random novel requested by ${user.tag}`,
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
