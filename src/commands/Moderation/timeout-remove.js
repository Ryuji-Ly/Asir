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
        .setName("timeout-remove")
        .setDescription("Removes timeout from a member")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option.setName("user").setDescription("The target user").setRequired(true)
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
        const reason = options.getString("reason") || "No reason given.";
        const targetUserRolePosition = target.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
        const owner = guild.ownerId;
        const errorsArray = [];

        //error handling
        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not remove timeout from member due to" })
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
        if (
            target.communicationDisabledUntilTimestamp === null ||
            target.communicationDisabledUntilTimestamp < Date.now()
        )
            errorsArray.push("Selected target is not timed out");
        if (target.user.bot) errorsArray.push("Selected target is a bot.");
        if (target.id === owner) errorsArray.push("Target is the server owner.");
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

        await target.timeout(null, reason).catch((err) => {
            interaction.editReply({
                embeds: [
                    errorsEmbed.setDescription(
                        "Could not untimeout user due to an uncommon discord error I didn't know was possible."
                    ),
                ],
            });
            return console.log(`[BOT] Error occured in timeout ${err}`.red);
        });

        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Timeout removed", iconURL: guild.iconURL() })
            .setColor("Blurple")
            .setDescription(
                [`${target}'s timeout was removed by ${member}`, `\nReason: ${reason}`].join("\n")
            );
        if (config.modLogs[1].value) {
            if (config.modLogChannelId !== "") {
                const channel = interaction.guild.channels.cache.get(config.modLogChannelId);
                if (!channel) {
                    return;
                }
                const logEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: `Timeout removed`,
                        iconURL: guild.iconURL(),
                    })
                    .setColor("Blurple")
                    .setTitle(`A member's timeout has been removed!`)
                    .setDescription(
                        `**Issuer**: ${member}\n**Member**: ${target}\n**Reason**: ${reason}`
                    )
                    .setTimestamp();
                await channel.send({ embeds: [logEmbed] });
            }
        }
        await interaction.editReply({ embeds: [successEmbed] });
        return;
    },
};
