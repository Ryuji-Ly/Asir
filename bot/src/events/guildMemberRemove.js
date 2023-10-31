var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const guildConfiguration = require("../models/guildConfiguration");

module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        await ProfileModel.deleteMany({ guildId: member.guild.id, userId: member.id });
        const guildconfig = await guildConfiguration.findOne({ guildId: member.guild.id });
        if (guildconfig.welcomeChannelId !== "") {
            const guild = member.guild;
            try {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === guildconfig.welcomeChannelId
                );
                if (!channel) return console.log(`[GUILD] Could not find welcome channel`.red);
                channel.send(`${member.user.tag} has left ${guild.name}!`);
            } catch (error) {
                console.log(`[GUILD] Error with new member leaving: ${error}`.red);
            }
            return;
        } else {
            return;
        }
    },
};
