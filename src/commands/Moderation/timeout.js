const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const ms = require("ms");
var colors = require("colors");
colors.enable();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Time a user out for a specified duration(5s-28d)")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option.setName("user").setDescription("The target user for timeout.").setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("duration")
                .setDescription("The duration of the timeout.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for timeout.").setMaxLength(512)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply();
        const { options, guild, member } = interaction;
        const config = await client.configs.get(guild.id);
        const target = options.getMember("user");
        const duration = options.getString("duration");
        const reason = options.getString("reason") || "No reason given.";
        const targetUserRolePosition = target.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
        const owner = guild.ownerId;
        const errorsArray = [];

        //error handling
        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not timeout member due to" })
            .setColor("Red");

        if (!target)
            return interaction.editReply({
                embeds: [
                    errorsEmbed.setDescription(
                        "The target member has most likely left the server."
                    ),
                ],
                ephemeral: true,
            });
        if (target.user.bot) errorsArray.push("Selected target is a bot.");
        if (target.id === owner) errorsArray.push("Target is the server owner.");
        if (!ms(duration) || ms(duration) > ms("28d"))
            errorsArray.push("Time provided is invalid or over the 28 day limit.");
        if (targetUserRolePosition >= botRolePosition)
            errorsArray.push("Selected target has a higher or same role position than me.");
        if (requestUserRolePosition <= targetUserRolePosition)
            errorsArray.push("Selected target has a higher or same role position than you.");

        if (errorsArray.length) {
            return interaction.editReply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true,
            });
        }

        await target.timeout(ms(duration), reason).catch((err) => {
            interaction.editReply({
                embeds: [
                    errorsEmbed.setDescription(
                        "Could not timeout user due to an uncommon discord error I didn't know was possible."
                    ),
                ],
            });
            return console.log(`[BOT] Error occured in timeout ${err}`.red);
        });

        const newInfractionObject = {
            IssuerId: member.id,
            IssuerTag: member.user.tag,
            Reason: reason,
            Date: Date.now(),
        };
        const data = await ProfileModel.findOne({ guildId: guild.id, userId: target.id });
        data.infractions.push(newInfractionObject);
        await data.save();
        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Timeout issued", iconURL: guild.iconURL() })
            .setColor("Red")
            .setDescription(
                [
                    `${target} was issued a timeout for **${ms(ms(duration), {
                        long: true,
                    })}** by ${member}`,
                    `Bringing their infractions total to **${data.infractions.length} points**`,
                    `\nReason: ${reason}`,
                ].join("\n")
            );
        if (config.modLogs[1].value) {
            if (config.modLogChannelId !== "") {
                const channel = interaction.guild.channels.cache.get(config.modLogChannelId);
                if (!channel) {
                    return;
                }
                const logEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: `Timeout issued`,
                        iconURL: guild.iconURL(),
                    })
                    .setColor("Blurple")
                    .setTitle(`A member has been timed out!`)
                    .setDescription(
                        `**Issued by:** ${member}\n**Member:** ${target}\n**Duration:** ${ms(
                            ms(duration),
                            { long: true }
                        )}\n**Reason:** ${reason}\n**Total infractions:** ${
                            data.infractions.length
                        }`
                    )
                    .setTimestamp();
                await channel.send({ embeds: [logEmbed] });
            }
        }
        await interaction.editReply({ embeds: [successEmbed] });
        return;
    },
};
