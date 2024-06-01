const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const TagModel = require("../../models/tags");
const NovelModel = require("../../models/novels");
const Big = require("big.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("filter-novel")
        .setDescription("Filter novels based on genre and tags.")
        .addStringOption((option) =>
            option
                .setName("genre")
                .setDescription("The genre of the novel.")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption((option) =>
            option
                .setName("tags")
                .setDescription('The tags of the novel. Split with ", " (100 char limit).')
                .setAutocomplete(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const genre = options.getString("genre");
        const tags = options.getString("tags");
        if (tags) {
            const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
            const tagsData = await TagModel.findOne({ name: "LNC" });
            let tagList = [];
            for (let i = 0; i < tagArray.length; i++) {
                tagArray[i] = tagArray[i].toLowerCase();
                const tag = tagsData.tags.find((t) => t.toLowerCase() === tagArray[i]);
                tagList.push(tag);
            }
            const novels = await NovelModel.find({ categories: genre, tags: { $all: tagList } });
            if (novels.length < 1) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("No novels found with that genre and tags."),
                    ],
                });
            }
            const sortedNovels = novels.sort((a, b) => {
                return a.rank - b.rank;
            });
            const top = sortedNovels.slice(0, 15);
            let description = "";
            for (let i = 0; i < top.length; i++) {
                description += `**${i + 1}.** [${top[i].title}](${top[i].url}) by ${
                    top[i].author
                } - Rank ${top[i].rank}\n`;
            }
            const embed = new EmbedBuilder()
                .setTitle(`Top 15 novels with genre ${genre} and tags ${tags}`)
                .setColor("Random")
                .setDescription(description)
                .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL() });
            return interaction.reply({ embeds: [embed] });
        } else {
            const novels = await NovelModel.find({ categories: genre });
            if (novels.length < 1) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("No novels found with that genre."),
                    ],
                });
            }
            const sortedNovels = novels.sort((a, b) => {
                return a.rank - b.rank;
            });
            const top = sortedNovels.slice(0, 15);
            let description = "";
            for (let i = 0; i < top.length; i++) {
                description += `**${i + 1}.** [${top[i].title}](${top[i].url}) by ${
                    top[i].author
                } - Rank ${top[i].rank}\n`;
            }
            const embed = new EmbedBuilder()
                .setTitle(`Top 15 novels with genre ${genre}`)
                .setColor("Random")
                .setDescription(description)
                .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL() });
            return interaction.reply({ embeds: [embed] });
        }
    },
};
