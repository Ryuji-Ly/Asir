const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const GroupModel = require("../../models/group");
const parseMilliseconds = require("parse-ms-2");
const Big = require("big.js");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder().setName("daily").setDescription("Claim your dailies!"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const data = await UserDatabase.findOne({ key: { userId: user.id, guildId: guild.id } });
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
            Math.random() * (config.economy.dailyMax - config.economy.dailyMin + 1) +
                config.economy.dailyMin
        );
        let final;
        if (config.economy.multiplier) final = randomAmount * multi;
        else final = randomAmount;
        await UserDatabase.findOneAndUpdate(
            { key: { userId: user.id, guildId: guild.id } },
            { $inc: { "economy.wallet": final } }
        );
        const number = new Big(final);
        const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const embed = new EmbedBuilder()
            .setAuthor({
                name: user.username,
                iconURL: user.avatarURL(),
            })
            .setColor(interaction.member.displayHexColor)
            .setDescription(
                `You have claimed ${formatted} ${config.economy.currency} ${config.economy.currencySymbol}!`
            );
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
