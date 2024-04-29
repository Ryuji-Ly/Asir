var colors = require("colors");
colors.enable();
const UserDatabase = require("../models/userSchema");
const parseMilliseconds = require("parse-ms-2");
const { EmbedBuilder, GuildMember, Client } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     *
     * @param {GuildMember} member
     * @param {Client} client
     * @returns
     */
    async execute(member, client) {
        if (member.bot) return;
        await UserDatabase.deleteMany({
            key: { userId: member.user.id, guildId: member.guild.id },
        });
        const config = await client.configs.get(member.guild.id);
        if (!config) return;
        if (config.channels.welcome !== "") {
            const guild = member.guild;
            try {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === config.channels.welcome
                );
                if (!channel)
                    return console.log(
                        `[GUILD] Could not find welcome channel for ${member.guild.name}`.red
                    );
                const duration = Date.now() - member.joinedAt;
                const { days, hours, minutes, seconds } = parseMilliseconds(duration);
                const memberRoles = member.roles.cache
                    .filter((r) => r.id !== member.guild.id)
                    .map((r) => r)
                    .join(" ");
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: member.user.tag,
                        iconURL: member.user.avatarURL(),
                    })
                    .setTitle(`Member left`)
                    .setDescription(
                        `${member} has left **${member.guild.name}.**\n\nUser joined ${days} days ${hours} hours ${minutes} minutes and ${seconds} seconds ago.\n${memberRoles}`
                    )
                    .setColor("DarkGrey")
                    .setTimestamp();
                channel.send({ embeds: [embed] });
            } catch (error) {
                console.log(`[GUILD] Error with new member leaving: ${error}`.red);
            }
            return;
        } else {
            return;
        }
    },
};
