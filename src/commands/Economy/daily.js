const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const GroupModel = require("../../models/group");
const parseMilliseconds = require("parse-ms-2");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder().setName("daily").setDescription("Claim your dailies!"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        if (config.Economy === false)
            return interaction.reply({ content: "Economy is disabled", ephemeral: true });
        let cooldown = 0;
        if (config.cooldowns.filter((c) => c.name === interaction.commandName).length > 0) {
            cooldown = config.cooldowns.find((c) => c.name === interaction.commandName).value;
        } else cooldown = 1000 * 60 * 60 * 24;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        await interaction.deferReply();
        const data = await ProfileModel.findOne({ guildId: guild.id, userId: user.id });
        const usermultiplier = data.multiplier;
        const groupdata = await GroupModel.findOne({
            groupMemberIds: interaction.user.id,
        });
        let groupmultiplier = 1;
        if (groupdata) {
            groupmultiplier = groupdata.groupMultiplier;
        }
        const multi = usermultiplier + groupmultiplier;
        const randomAmount = Math.floor(
            (Math.random() * (config.dailyMax - config.dailyMin + 1) + config.dailyMin) * multi
        );
        await ProfileModel.findOneAndUpdate(
            { guildId: guild.id, userId: user.id },
            { $inc: { balance: randomAmount } }
        );
        const embed = new EmbedBuilder()
            .setAuthor({
                name: user.username,
                iconURL: user.avatarURL(),
            })
            .setColor(interaction.member.displayHexColor)
            .setDescription(`You have claimed ${randomAmount} ${config.currencyName}!`);
        await interaction.editReply({ embeds: [embed] });
        return;
    },
};