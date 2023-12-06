const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Displays information about a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user whose information you want to see")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const target = options.getUser("user") || user;
        const member = await guild.members.fetch(target.id);
        const icon = target.displayAvatarURL();
        const tag = target.username;
        const data = await ProfileModel.findOne({ guildId: guild.id, userId: target.id });
        const color = interaction.member.displayHexColor;
        const embed = new EmbedBuilder()
            .setAuthor({ name: tag, iconURL: icon })
            .setFooter({ text: `User ID: ${target.id}` })
            .setColor(`${color}`);

        if (config.Level) {
            embed.addFields({
                name: `Level`,
                value: `${data.level}`,
                inline: true,
            });
        }
        if (config.Economy) {
            embed.addFields(
                {
                    name: `Balance`,
                    value: `${data.balance}`,
                    inline: true,
                },
                {
                    name: "Multiplier",
                    value: `${data.multiplier}`,
                    inline: true,
                }
            );
        }
        embed.addFields({ name: `Message count`, value: `${data.messageCounter}`, inline: true });
        let count = 0;
        for (let i = 0; i < data.commandCounter.length; i++) {
            count += data.commandCounter[i].value;
        }
        embed.addFields(
            { name: "Command count", value: `${count}`, inline: true },
            {
                name: "Warnings & infractions",
                value: `${data.warnings} warnings. ${data.infractions.length} infractions.`,
            }
        );
        embed.addFields(
            {
                name: `Roles`,
                value: `${member.roles.cache
                    .filter((r) => r.id !== guild.id)
                    .map((r) => r)
                    .join(" ")}`,
                inline: false,
            },
            {
                name: `Joined Server`,
                value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
                inline: true,
            },
            {
                name: "Joined Discord",
                value: `<t:${parseInt(target.createdAt / 1000)}:R>`,
                inline: true,
            }
        );
        await interaction.reply({
            embeds: [embed],
        });
        return;
    },
};
