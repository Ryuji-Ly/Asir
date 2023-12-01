const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message-count")
        .setDescription("Shows how many messages you have sent (excluding ignored channels)"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const data = await ProfileModel.findOne({ guildId: guild.id, userId: user.id }).select(
            "-_id messageCounter"
        );
        const color = interaction.member.displayHexColor;
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
            .setDescription(`You have ${data.messageCounter} messages in ${guild.name}`)
            .setColor(`${color}`);
        interaction.reply({ embeds: [embed] });
        return;
    },
};
