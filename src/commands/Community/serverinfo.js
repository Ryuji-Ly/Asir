const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Displays information about the server"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { guild } = interaction;
        const { members } = guild;
        const channelCount = (await guild.channels.fetch()).filter(
            (channel) => channel.type !== "GUILD_CATEGORY"
        ).size;
        const { name, ownerId, createdTimestamp, memberCount } = guild;
        const serverIcon =
            guild.iconURL() ||
            "https://cdn.discordapp.com/attachments/585913883143962624/1162741462170087555/MafuyuWhat.png?ex=653d0a5f&is=652a955f&hm=26f2e129c98a15250c416d4f30c6aa6485fd64034f433d5d399dc4004aa9d8ce&";
        const roles = guild.roles.cache.size;
        const emojis = guild.emojis.cache.size;
        const id = guild.id;
        let baseVerification = guild.verificationLevel;
        if (baseVerification == 0) baseVerification = "None";
        if (baseVerification == 1) baseVerification = "Low";
        if (baseVerification == 2) baseVerification = "Medium";
        if (baseVerification == 3) baseVerification = "High";
        if (baseVerification == 4) baseVerification = "Very High";
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setThumbnail(serverIcon)
            .setAuthor({ name: name, iconURL: serverIcon })
            .setFooter({ text: `Server ID: ${id} - Created by ryujily` })
            .setTimestamp()
            .addFields(
                { name: "Name", value: name, inline: false },
                {
                    name: "Date Created",
                    value: `<t:${parseInt(createdTimestamp / 1000)}:R> (hover for complete date)`,
                    inline: true,
                },
                {
                    name: "Server Owner",
                    value: `<@${ownerId}>`,
                    inline: true,
                },
                {
                    name: "Server Members",
                    value: `${memberCount}`,
                    inline: true,
                },
                {
                    name: "Role Count",
                    value: `${roles}`,
                    inline: true,
                },
                {
                    name: "Channel Count",
                    value: `${channelCount}`,
                    inline: true,
                },
                {
                    name: "Emoji Count",
                    value: `${emojis}`,
                    inline: true,
                },
                {
                    name: "Verification Level",
                    value: `${baseVerification}`,
                    inline: true,
                },
                {
                    name: "Server Boosts",
                    value: `${guild.premiumSubscriptionCount}`,
                    inline: true,
                }
            );
        await interaction.reply({ embeds: [embed] });
        return;
    },
};
