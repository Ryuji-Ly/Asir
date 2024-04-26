const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    AttachmentBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const canvacord = require("canvacord");
const UserDatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

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
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        if (config.level.enabled) {
            await interaction.deferReply();
            let target = options.getUser("user");
            if (!target) target = user;
            const targetObj = await guild.members.fetch(target.id);
            const data = await UserDatabase.findOne({
                key: { userId: target.id, guildId: guild.id },
            });
            let allLevels = await UserDatabase.find({ "key.guildId": guild.id }).select(
                "-_id key level"
            );
            allLevels.sort((a, b) => {
                if (a.level.level === b.level.level) {
                    return b.level.xp - a.level.xp;
                } else {
                    return b.level.level - a.level.level;
                }
            });
            const currentRank = allLevels.findIndex((lvl) => lvl.key.userId === target.id) + 1;
            let levelRequirement = 0;
            if (config.level.xpScaling === "constant") {
                levelRequirement = config.level.xpBaseRequirement;
            } else if (config.level.xpScaling === "multiply") {
                levelRequirement = data.level.level * config.level.xpBaseRequirement;
            } else if (config.level.xpScaling === "exponential") {
                levelRequirement = data.level.level ** 2 * config.level.xpBaseRequirement;
            }
            const rank = new canvacord.Rank()
                .setAvatar(target.displayAvatarURL({ size: 256 }))
                .setRank(currentRank)
                .setLevel(data.level.level)
                .setCurrentXP(data.level.xp)
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
