const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infractions")
        .setDescription(
            "Displays the infractions of a member, if none selected, all current infractions"
        )
        .addUserOption((option) =>
            option.setName("user").setDescription("The user whose infraction you want to check")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const target = options.getUser("user");
        await interaction.deferReply();
        if (target) {
            if (target.bot)
                return interaction.editReply({ content: "This is a bot", ephemeral: true });
            const data = await ProfileModel.findOne({ guildId: guild.id, userId: target.id });
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Displaying infractions of ${target.username}`,
                    iconURL: target.displayAvatarURL(),
                })
                .setFooter({ text: `Current infraction count: ${data.infractions.length}` })
                .setColor("Blurple")
                .setTimestamp();
            if (data.infractions.length === 0) {
                embed.setDescription(`This user has no infractions!`);
            } else {
                embed.setDescription(
                    `${data.infractions
                        .map(
                            (i) =>
                                `Issued by: <@${i.IssuerId}>. Reason: ${
                                    i.Reason
                                }.\nDate: ${new Date(i.Date).toLocaleDateString()}`
                        )
                        .join("\n\n")}`
                );
            }
            await interaction.editReply({ embeds: [embed] });
        } else {
            const alldata = await ProfileModel.find({ guildId: guild.id }).select(
                "-_id userId warnings infractions"
            );
            const data = alldata.filter(
                (user) => user.warnings !== 0 || user.infractions.length !== 0
            );
            let string = "";
            for (let i = 0; i < data.length; i++) {
                string += `<@${data[i].userId}> has **${data[i].warnings} warnings and ${data[i].infractions.length} infractions.**\n`;
            }
            if (string === "") string = "This server has no warnings or infractions";
            const embed = new EmbedBuilder()
                .setTitle(`${guild.name}'s infractions`)
                .setColor("Blurple")
                .setTimestamp()
                .setDescription(`${string}`);
            await interaction.editReply({ embeds: [embed] });
        }
        return;
    },
};
