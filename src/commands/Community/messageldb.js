const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message-count-ldb")
        .setDescription("Displays the top 10 users with the most messages"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.deferReply();
        const userData = await UserDatabase.findOne({
            key: { userId: user.id, guildId: guild.id },
        });
        let data = await UserDatabase.find({ "key.guildId": guild.id }).select("-_id key data");
        data.sort((a, b) => {
            if (a.data.messages === b.data.messages) {
                return a.key.userId - b.key.userId;
            } else {
                return b.data.messages - a.data.messages;
            }
        });
        const currentRank = data.findIndex((msg) => msg.key.userId === user.id) + 1;
        const top = data.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle(`**Top 10 most active users**`)
            .setColor("Purple")
            .setTimestamp()
            .setFooter({
                text: `You are rank ${currentRank}. with ${userData.data.messages} messages`,
            })
            .setThumbnail(guild.iconURL());
        let desc = "";
        for (let i = 0; i < top.length; i++) {
            const { user } = await interaction.guild.members.fetch(top[i].key.userId);
            if (!user) return;
            const messagecount = top[i].data.messages;
            desc += `**${i + 1}.** ${user}**: ${messagecount} messages**\n`;
        }
        embed.setDescription(desc);
        interaction.editReply({ embeds: [embed] });
        return;
    },
};
