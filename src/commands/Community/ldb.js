const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level-ldb")
        .setDescription("Displays the highest leveled people of the server"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        let cooldown = 0;
        if (
            config.commands.cooldowns.filter((c) => c.name === interaction.commandName).length > 0
        ) {
            cooldown = config.commands.cooldowns.find(
                (c) => c.name === interaction.commandName
            ).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        if (config.level.enabled) {
            await interaction.deferReply();
            const userData = await ProfileModel.findOne({ guildId: guild.id, userId: user.id });
            let data = await ProfileModel.find({ guildId: guild.id }).select(
                "-_id userId xp level"
            );
            data.sort((a, b) => {
                if (a.level === b.level) {
                    return a.xp - a.xp;
                } else {
                    return b.level - a.level;
                }
            });
            const currentRank = data.findIndex((lvl) => lvl.userId === user.id) + 1;
            const top = data.slice(0, 10);
            const embed = new EmbedBuilder()
                .setTitle(`**Top 10 highest leveled users**`)
                .setColor("Purple")
                .setTimestamp()
                .setFooter({
                    text: `You are rank ${currentRank}. at level ${userData.level}`,
                })
                .setThumbnail(guild.iconURL());
            let desc = "";
            for (let i = 0; i < top.length; i++) {
                let { user } = await interaction.guild.members.fetch(top[i].userId);
                if (!user) return;
                let userLevel = top[i].level;
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
