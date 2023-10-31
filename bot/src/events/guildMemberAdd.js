var colors = require("colors");
colors.enable();
const guildConfiguration = require("../models/guildConfiguration");
const ProfileModel = require("../models/profileSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        const newUser = await ProfileModel.create({
            userId: member.user.id,
            guildId: member.guild.id,
        });
        await newUser.save();
        const guildconfig = await guildConfiguration.findOne({ guildId: member.guild.id });
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
                let end = "th";
                if (member.guild.memberCount % 10 === 1) end = "st";
                if (member.guild.memberCount % 10 === 2) end = "nd";
                if (member.guild.memberCount % 10 === 3) end = "rd";
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: member.user.tag,
                        iconURL: member.user.avatarURL(),
                    })
                    .setTitle(`Member joined`)
                    .setDescription(
                        `${member} has joined **${member.guild.name}** and is the ${
                            member.guild.memberCount
                        }${end} to join!\n\nAccount created <t:${parseInt(
                            member.user.createdAt / 1000
                        )}:R>`
                    )
                    .setColor("Green")
                    .setTimestamp();
                channel.send({ embeds: [embed] });
            } catch (error) {
                console.log(`[GUILD] Error with new member joining: ${error}`.red);
            }
            return;
        } else {
            return;
        }
    },
};
