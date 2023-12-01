var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const GroupModel = require("../models/group");
const cooldown = new Set();
const { EmbedBuilder } = require("discord.js");
function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        const config = await client.configs.get(message.guild.id);
        const chance = Math.floor(Math.random() * 1000000000001);
        if (chance < 1) {
            message.reply({ content: `<:MafuyuWhat:1162493558180298893>`, ephemeral: true });
        }
        if (config.ignoredChannelIds.includes(message.channel.id)) return;
        //check if user data exists and get the user data
        const user = await ProfileModel.findOne({
            userId: message.author.id,
            guildId: message.guild.id,
        });
        // update message counter
        try {
            user.messageCounter += 1;
            await user.save();
        } catch (error) {
            console.log(`[MESSAGE CREATE] No user data found to update message counter`.red);
        }
        //if no user, create new user
        if (!user) {
            const newUser = new ProfileModel({
                userId: message.author.id,
                guildId: message.guild.id,
            });
            return await newUser.save();
        }
        // leveling logic
        try {
            //checks if leveling is enabled
            if (config.Level) {
                // checks if cooldown exists
                if (cooldown.has(message.author.id)) return;
                // all the amount for xp given logic
                const userdata = await ProfileModel.findOne({
                    guildId: message.guild.id,
                    userId: message.author.id,
                });
                const groupCategory = message.guild.channels.cache.get(config.groupCategoryId);
                let groupChannels = [];
                if (groupCategory) groupChannels = groupCategory.children.cache.map((c) => c.id);
                let groupbonus = 0;
                let groupmulti = 0;
                const group = await GroupModel.findOne({ groupMemberIds: message.author.id });
                if (group) groupmulti = group.groupMultiplier;
                if (groupChannels.includes(message.channel.id))
                    groupbonus = config.groupChannelMulti;
                const xpToGive = getRandomXp(config.randomXpMin, config.randomXpMax);
                const finalMulti = userdata.multiplier + groupbonus + groupmulti;
                const finalXp = xpToGive * finalMulti;
                userdata.xp += finalXp;
                // all the increase level or not logic
                let levelRequirement = 0;
                if (config.xpScaling === "constant") {
                    levelRequirement = config.xpBaseRequirement;
                } else if (config.xpScaling === "multiply") {
                    levelRequirement = userdata.level * config.xpBaseRequirement;
                } else if (config.xpScaling === "exponential") {
                    levelRequirement = userdata.level ** 2 * config.xpBaseRequirement;
                }
                // (still have to do the ranks)
                if (userdata.xp > levelRequirement) {
                    userdata.xp = userdata.xp - levelRequirement;
                    userdata.level += 1;
                    if (config.levelChannelId !== "") {
                        const channel = message.guild.channels.cache.find(
                            (c) => c.id === config.levelChannelId
                        );
                        if (!channel) {
                            return console.log(
                                `[GUILD] Could not find level channel for ${message.guild.name}`
                            );
                        }
                        const embed = new EmbedBuilder()
                            .setColor(message.member.displayHexColor)
                            .setDescription(
                                `${message.member} has leveled up to ${userdata.level}`
                            );
                        channel.send({ embeds: [embed] });
                    }
                }
                // checks if economy system is enabled and if yes, adds currency as well
                if (config.Economy) {
                    userdata.balance += config.randomCurrency;
                }
                await userdata.save();
                cooldown.add(message.author.id);
                setTimeout(() => {
                    cooldown.delete(message.author.id);
                }, 60 * 1000);
            }
        } catch (error) {
            console.log(`[MESSAGE CREATE] Error updating levels ${error}`.red);
        }
        return;
    },
};
