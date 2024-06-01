const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("top-mentioned")
        .setDescription("See who you mentioned the most!")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to see the top mentioned users for.")
                .setRequired(false)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.deferReply();
        const targetUser = options.getUser("user") || user;
        const data = await UserDatabase.findOne({
            key: { userId: targetUser.id, guildId: guild.id },
        });
        if (!data) {
            return interaction.editReply("No data found for this user.");
        }
        const mentioned = data.data.mentions;
        if (!mentioned) {
            return interaction.editReply("No data found for this user.");
        }
        mentioned.sort((a, b) => b.count - a.count);
        const topMentioned = mentioned.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle(`Top users mentioned by ${targetUser.tag}`)
            .setColor("Random")
            .setDescription(`${topMentioned.map((m) => `<@${m.user}> - ${m.count}`).join("\n")}`)
            .setTimestamp()
            .setFooter({ text: "Requested by " + user.tag, iconURL: user.displayAvatarURL() });
        interaction.editReply({ embeds: [embed] });
        return;
    },
};
