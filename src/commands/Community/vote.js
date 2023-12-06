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
                `If you are in the server **Lectorum Nexus**, by voting you will gain the role **Voter**.\nThe role allows you to send embed links and attachments in the general channel.\n\nIf this command is being used in a different server, there are currently no benefits however they will come soon.`
            );
        const button = new ButtonBuilder()
            .setLabel("Vote")
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
