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
