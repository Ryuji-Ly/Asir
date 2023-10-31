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
                if (!channel) return console.log(`[GUILD] Could not find welcome channel`.red);
                channel.send(`${member.user.tag} has joined ${guild.name}!`);
            } catch (error) {
                console.log(`[GUILD] Error with new member joining: ${error}`.red);
            }
            return;
        } else {
            return;
        }
    },
};
