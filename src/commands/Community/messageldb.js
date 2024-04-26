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
        .setName("message-count-ldb")
        .setDescription("Displays the top 10 users with the most messages"),
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
        await interaction.deferReply();
        const userData = await ProfileModel.findOne({ guildId: guild.id, userId: user.id });
        let data = await ProfileModel.find({ guildId: guild.id }).select(
            "-_id userId messageCounter"
        );
        data.sort((a, b) => {
            if (a.messageCounter === b.messageCounter) {
                return a.userId - b.userId;
            } else {
                return b.messageCounter - a.messageCounter;
            }
        });
        const currentRank = data.findIndex((msg) => msg.userId === user.id) + 1;
        const top = data.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle(`**Top 10 most active users**`)
            .setColor("Purple")
            .setTimestamp()
            .setFooter({
                text: `You are rank ${currentRank}. with ${userData.messageCounter} messages`,
            })
            .setThumbnail(guild.iconURL());
        let desc = "";
        for (let i = 0; i < top.length; i++) {
            const { user } = await interaction.guild.members.fetch(top[i].userId);
            if (!user) return;
            const messagecount = top[i].messageCounter;
            desc += `**${i + 1}.** ${user}**: ${messagecount} messages**\n`;
        }
        embed.setDescription(desc);
        interaction.editReply({ embeds: [embed] });
        return;
    },
};
