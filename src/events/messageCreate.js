var colors = require("colors");
colors.enable();
const ProfileModel = require("../models/profileSchema");
const GroupModel = require("../models/group");
const cooldown = new Set();
const { EmbedBuilder, Message } = require("discord.js");
function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function removeRole(config, message) {
    for (let i = 0; i < config.rankRoles.length; i++) {
        const roleId = config.rankRoles[i].role;
        const role = message.guild.roles.cache.get(roleId);
        await message.member.roles.remove(role);
    }
}

module.exports = {
    name: "messageCreate",
    /**
     *
     * @param {Message} message
     * @param {*} client
     * @returns
     */
    async execute(message, client) {
        if (message.author.bot) return;
        const config = await client.configs.get(message.guild.id);
        const chance = Math.floor(Math.random() * 1000000000001);
        if (chance < 1) {
            message.reply(`<:MafuyuWhat:1162493558180298893>`);
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
            const newUser = await ProfileModel.create({
                guildId: message.guild.id,
                userId: message.author.id,
            });
            newUser.messageCounter = 1;
            await newUser.save();
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
                let groupbonus = 1;
                let groupmulti = 0;
                const group = await GroupModel.findOne({ groupMemberIds: message.author.id });
                if (group) groupmulti = group.groupMultiplier;
                if (groupChannels.includes(message.channel.id))
                    groupbonus = config.groupChannelMulti;
                const xpToGive = getRandomXp(config.randomXpMin, config.randomXpMax);
                const finalXp = Math.floor(xpToGive * groupbonus);
                userdata.xp += xpToGive;
                // all the increase level or not logic
                let levelRequirement = 0;
                if (config.xpScaling === "constant") {
                    levelRequirement = config.xpBaseRequirement;
                } else if (config.xpScaling === "multiply") {
                    levelRequirement = userdata.level * config.xpBaseRequirement;
                } else if (config.xpScaling === "exponential") {
                    levelRequirement = userdata.level ** 2 * config.xpBaseRequirement;
                }
                // if user has to be leveled up
                if (userdata.xp > levelRequirement) {
                    userdata.xp = userdata.xp - levelRequirement;
                    userdata.level += 1;
                    try {
                        // get level up channel
                        let channel;
                        if (config.levelChannelId === "") channel = message.channel;
                        else
                            channel = message.guild.channels.cache.find(
                                (c) => c.id === config.levelChannelId
                            );
                        if (!channel)
                            return console.log(
                                `[GUILD] Could not find level channel for ${message.guild.name}`
                            );
                        // create level up embed
                        const embed = new EmbedBuilder()
                            .setColor(message.member.displayHexColor)
                            .setDescription(
                                `${message.member} has leveled up to ${userdata.level}`
                            );
                        // check if any rank roles are configured
                        if (config.rankRoles.length !== 0) {
                            for (let i = 0; i < config.rankRoles.length; i++) {
                                // check if one of the rank roles are matched
                                if (config.rankRoles[i].level === userdata.level) {
                                    const roleId = config.rankRoles[i].role;
                                    const role = message.guild.roles.cache.get(roleId);
                                    if (i !== 0) {
                                        await removeRole(config, message);
                                    }
                                    await message.member.roles.add(role);
                                    embed
                                        .setAuthor({
                                            name: message.author.username,
                                            iconURL: message.author.avatarURL(),
                                        })
                                        .setColor(role.hexColor)
                                        .setTitle(
                                            `Congratulations ${message.author.username}, you are now level ${userdata.level} and have become ${role.name}!`
                                        )
                                        .setDescription(null);
                                    if (config.rankRoles[i].img !== "") {
                                        embed.setImage(config.rankRoles[i].img);
                                    }
                                    await userdata.save();
                                    return await channel.send({
                                        content: `${message.author}`,
                                        embeds: [embed],
                                    });
                                }
                            }
                            // if no rank levels are matched, send normal embed
                            channel.send({ embeds: [embed] });
                        } else {
                            // if no ranks are configured, just send level up message
                            channel.send({ embeds: [embed] });
                        }
                    } catch (error) {
                        console.log(
                            `[MESSAGE CREATE] Error sending level embed ${error.stack}`.red
                        );
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
