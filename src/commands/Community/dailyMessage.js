const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily-messages")
        .setDescription("Show a leaderboard of the daily most active users in the server"),
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
            if (a.data.timeBasedStats.dailyMessages === b.data.timeBasedStats.dailyMessages) {
                return a.key.userId - b.key.userId;
            } else {
                return b.data.timeBasedStats.dailyMessages - a.data.timeBasedStats.dailyMessages;
            }
        });
        const currentRank = data.findIndex((msg) => msg.key.userId === user.id) + 1;
        const top = data.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle(`**Top 10 daily active users**`)
            .setColor("Purple")
            .setTimestamp()
            .setFooter({
                text: `You are rank ${currentRank}. with ${new Big(
                    userData.data.timeBasedStats.dailyMessages
                )
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} messages`,
            })
            .setThumbnail(guild.iconURL());
        let desc = "";
        for (let i = 0; i < top.length; i++) {
            const { user } = await interaction.guild.members.fetch(top[i].key.userId);
            if (!user) return;
            const messagecount = new Big(top[i].data.timeBasedStats.dailyMessages)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            desc += `**${i + 1}.** ${user}**: ${messagecount} messages**\n`;
        }
        embed.setDescription(desc);
        interaction.editReply({ embeds: [embed] });
        return;
    },
};
