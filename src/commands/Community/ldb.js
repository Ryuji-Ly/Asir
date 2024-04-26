const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level-ldb")
        .setDescription("Displays the highest leveled people of the server"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        if (config.level.enabled) {
            await interaction.deferReply();
            const userData = await UserDatabase.findOne({
                key: { userId: user.id, guildId: guild.id },
            });
            let data = await UserDatabase.find({ "key.guildId": guild.id }).select(
                "-_id key level"
            );
            data.sort((a, b) => {
                if (a.level.level === b.level.level) {
                    return b.level.xp - a.level.xp;
                } else {
                    return b.level.level - a.level.level;
                }
            });
            const currentRank = data.findIndex((lvl) => lvl.key.userId === user.id) + 1;
            const top = data.slice(0, 10);
            const embed = new EmbedBuilder()
                .setTitle(`**Top 10 highest leveled users**`)
                .setColor("Purple")
                .setTimestamp()
                .setFooter({
                    text: `You are rank ${currentRank}. at level ${userData.level.level}`,
                })
                .setThumbnail(guild.iconURL());
            let desc = "";
            for (let i = 0; i < top.length; i++) {
                let { user } = await interaction.guild.members.fetch(top[i].key.userId);
                if (!user) return;
                let userLevel = top[i].level.level;
                desc += `**${i + 1}.** ${user}: **level** **${userLevel}**\n`;
            }
            embed.setDescription(desc);
            await interaction.editReply({ embeds: [embed] });
            return;
        } else {
            return interaction.reply({
                content: "The leveling system is disabled in this server",
                ephemeral: true,
            });
        }
    },
};
