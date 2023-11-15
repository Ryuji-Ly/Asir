var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        const config = await client.configs.get(message.guild.id);
        if (config.ignoredChannelIds.includes(message.channel.id)) return;
        //check if user data exists
        const user = await ProfileModel.findOne({
            userId: message.author.id,
            guildId: message.guild.id,
        });
        try {
            user.messageCounter += 1;
            await user.save();
        } catch (error) {
            console.log(`[MESSAGE CREATE] Error updating message counter`.red);
        }
        if (!user) {
            const newUser = new ProfileModel({
                userId: message.author.id,
                guildId: message.guild.id,
            });
            await newUser.save();
        }
        return;
    },
};
