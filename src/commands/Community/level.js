const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    AttachmentBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const canvacord = require("canvacord");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Displays your level")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user whose level you want to see")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        if (config.Level) {
            await interaction.deferReply();
            let target = options.getUser("user");
            if (!target) target = user;
            const targetObj = await guild.members.fetch(target.id);
            const data = await ProfileModel.findOne({ userId: target.id, guildId: guild.id });
            let allLevels = await ProfileModel.find({ guildId: guild.id }).select(
                "-_id userId level xp"
            );
            allLevels.sort((a, b) => {
                if (a.level === b.level) {
                    return b.xp - a.xp;
                } else {
                    return b.level - a.level;
                }
            });
            const currentRank = allLevels.findIndex((lvl) => lvl.userId === target.id) + 1;
            let levelRequirement = 0;
            if (config.xpScaling === "constant") {
                levelRequirement = config.xpBaseRequirement;
            } else if (config.xpScaling === "multiply") {
                levelRequirement = data.level * config.xpBaseRequirement;
            } else if (config.xpScaling === "exponential") {
                levelRequirement = data.level ** 2 * config.xpBaseRequirement;
            }
            const rank = new canvacord.Rank()
                .setAvatar(target.displayAvatarURL({ size: 256 }))
                .setRank(currentRank)
                .setLevel(data.level)
                .setCurrentXP(data.xp)
                .setRequiredXP(levelRequirement)
                .setProgressBar("#FFC300", "COLOR")
                .setUsername(target.displayName)
                .setStatus(targetObj.presence ? targetObj.presence.status : "offline");
            const img = await rank.build();
            const attachment = new AttachmentBuilder(img);
            await interaction.editReply({ files: [attachment] });
        } else {
            await interaction.reply({
                content: "The leveling function is disabled in this server",
                ephemeral: true,
            });
        }
        return;
    },
};
