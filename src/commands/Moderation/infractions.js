const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");

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
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const target = options.getUser("user");
        await interaction.deferReply();
        if (target) {
            if (target.bot)
                return interaction.editReply({ content: "This is a bot", ephemeral: true });
            const data = await UserDatabase.findOne({
                key: { userId: target.id, guildId: guild.id },
            });
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Displaying infractions of ${target.username}`,
                    iconURL: target.displayAvatarURL(),
                })
                .setFooter({ text: `Current infraction count: ${data.data.infractions.length}` })
                .setColor("Blurple")
                .setTimestamp();
            if (data.data.infractions.length === 0) {
                embed.setDescription(`This user has no infractions!`);
            } else {
                embed.setDescription(
                    `${data.data.infractions
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
            const alldata = await UserDatabase.find({ "key.guildId": guild.id }).select(
                "-_id key data"
            );
            const data = alldata.filter(
                (user) => user.data.warnings !== 0 || user.data.infractions.length !== 0
            );
            let string = "";
            for (let i = 0; i < data.length; i++) {
                string += `<@${data[i].key.userId}> has **${data[i].data.warnings} warnings and ${data[i].data.infractions.length} infractions.**\n`;
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
