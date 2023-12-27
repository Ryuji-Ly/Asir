const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const Messagecount = require("../../models/event");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event-message-count")
        .setDescription("Displays the current event message count")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        let data = await Messagecount.find({ guildId: guild.id });
        data.sort((a, b) => {
            if (a.messageCount === b.messageCount) {
                return a.userId - b.userId;
            } else {
                return b.messageCount - a.messageCount;
            }
        });
        const currentRank = data.findIndex((msg) => msg.userId === user.id) + 1;
        const userData = data[currentRank - 1];
        const top = data.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle(`**Top 10 Event Messages**`)
            .setColor("Purple")
            .setTimestamp()
            .setFooter({
                text: `You are rank ${currentRank}. with ${userData.messageCount} messages`,
            })
            .setThumbnail(guild.iconURL());
        let desc = "";
        for (let i = 0; i < top.length; i++) {
            const { user } = await interaction.guild.members.fetch(top[i].userId);
            if (!user) return;
            const messagecount = top[i].messageCount;
            desc += `**${i + 1}.** ${user}**: ${messagecount} messages**\n`;
        }
        embed.setDescription(desc);
        interaction.reply({ embeds: [embed] });
        return;
    },
};
