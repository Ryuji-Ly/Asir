const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const TwoZeroFourEight = require("discord-gamecord/src/2048");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote for Lectorum Nexus on top.gg"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setTitle(`Vote`)
            .setColor(interaction.member.displayHexColor)
            .setDescription(
                "top.gg has discontinued server listing as of 2/5/2024. Voting has hence been disabled and the command will be removed soon."
            );
        const button = new ButtonBuilder()
            .setLabel("Vote")
            .setDisabled(true)
            .setStyle(ButtonStyle.Link)
            .setURL("https://top.gg/servers/1161001645698715698/vote");
        const join = new ButtonBuilder()
            .setLabel("Join Lectorum Nexus")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/m34makwc2M");
        const row = new ActionRowBuilder();
        if (guild.id !== "1161001645698715698") {
            row.addComponents(join);
        }
        row.addComponents(button);
        await interaction.reply({ embeds: [embed], components: [row] });
        return;
    },
};
