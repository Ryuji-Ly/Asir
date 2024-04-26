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
        .setName("message-count")
        .setDescription(
            "Shows how many messages you have sent (excluding restricted/blacklisted channels)"
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const data = await UserDatabase.findOne({
            key: { userId: user.id, guildId: guild.id },
        }).select("-_id data");
        const color = interaction.member.displayHexColor;
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
            .setDescription(`You have ${data.data.messages} messages in ${guild.name}`)
            .setColor(`${color}`);
        interaction.reply({ embeds: [embed] });
        return;
    },
};
