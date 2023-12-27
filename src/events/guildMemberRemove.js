var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const guildConfiguration = require("../models/guildConfiguration");
const parseMilliseconds = require("parse-ms-2");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        if (member.bot) return;
        //await ProfileModel.deleteMany({ guildId: member.guild.id, userId: member.id });
        const guildconfig = await client.configs.get(member.guild.id);
        if (!guildconfig) return;
        if (guildconfig.welcomeChannelId !== "") {
            const guild = member.guild;
            try {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === guildconfig.welcomeChannelId
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
