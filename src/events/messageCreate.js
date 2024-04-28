var colors = require("colors");
colors.enable();
const Userdatabase = require("../models/userSchema");
const GroupModel = require("../models/group");
const cooldownLevel = new Set();
const cooldownEconomy = new Set();
const { EmbedBuilder, Message, WebhookClient } = require("discord.js");
function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function removeRole(config, message) {
    for (let i = 0; i < config.level.ranks.length; i++) {
        const roleId = config.level.ranks[i].role;
        const role = await message.guild.roles.cache.get(roleId);
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
        const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
        const chance = Math.floor(Math.random() * 1000000000001);
        if (chance < 1) {
            message.reply(`<:MafuyuWhat:1162493558180298893>`);
        }
        //check if user data exists and get the user data
        const user = await Userdatabase.findOne({
            key: { userId: message.author.id, guildId: message.guild.id },
        });
        // update message counter
        try {
            await Userdatabase.findOneAndUpdate(
                { key: { userId: message.author.id, guildId: message.guild.id } },
                { $inc: { "data.messages": 1 } }
            );
        } catch (error) {
            const newUser = await Userdatabase.create({
                key: { userId: message.author.id, guildId: message.guild.id },
                "economy.wallet": config.economy.baseBalance,
            });
            newUser.data.messages = 1;
            await newUser.save();
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[MESSAGE CREATE]` })
                .setDescription(
                    `\`\`\`ansi\n[0;31m[MESSAGE CREATE] Missing user data found for ${message.author.username} in ${message.guild.name}, unable to update message counter. New user data created.\`\`\``
                );
            webhookClient
                .send({ embeds: [embed] })
                .catch((e) => console.log(`[MESSAGE CREATE] Webhook failed to send`.red));
            console.log(
                `[MESSAGE CREATE] No user data found to update message counter. ${message.author.username}`
                    .red
            );
        }
        //if no user, create new user
        if (!user) {
            const newUser = new Userdatabase({
                key: { userId: message.author.id, guildId: message.guild.id },
                "economy.wallet": config.economy.startingBalance,
            });
            return await newUser.save();
        }
        if (config.channels.blacklisted.includes(message.channel.id)) return;
        // leveling logic
        try {
            // all the amount for xp given logic
            const userdata = await Userdatabase.findOne({
                key: { userId: message.author.id, guildId: message.guild.id },
            });
            // checks if economy system is enabled and if yes, adds currency as well
            if (config.economy.enabled) {
                const currencyToGive = getRandomXp(
                    config.economy.currencyGainMin,
                    config.economy.currencyGainMax
                );
                let finalCurrency;
                if (config.economy.multiplier) finalCurrency = currencyToGive * userdata.multiplier;
                else finalCurrency = currencyToGive;
                await Userdatabase.findOneAndUpdate(
                    { key: { userId: message.author.id, guildId: message.guild.id } },
                    { $inc: { "economy.wallet": finalCurrency } }
                );
                cooldownEconomy.add(message.author.id);
                setTimeout(() => {
                    cooldownEconomy.delete(message.author.id);
                }, config.economy.currencyGainTime);
            }
            //checks if leveling is enabled
            if (config.level.enabled) {
                // checks if cooldown exists
                if (cooldownLevel.has(message.author.id)) return;
                const groupCategory = message.guild.channels.cache.get(config.groupCategoryId);
                let groupChannels = [];
                if (groupCategory) groupChannels = groupCategory.children.cache.map((c) => c.id);
                let groupbonus = 1;
                let groupmulti = 0;
                const group = await GroupModel.findOne({ groupMemberIds: message.author.id });
                if (group) groupmulti = group.groupMultiplier;
                if (groupChannels.includes(message.channel.id))
                    groupbonus = config.groupChannelMulti;
                const xpToGive = getRandomXp(config.level.xpGainMin, config.level.xpGainMax);
                let finalXp;
                if (config.level.multiplier) finalXp = xpToGive * userdata.multiplier;
                else finalXp = xpToGive;
                userdata.level.xp += finalXp;
                await Userdatabase.findOneAndUpdate(
                    { key: { userId: message.author.id, guildId: message.guild.id } },
                    { $set: { "level.xp": userdata.level.xp } }
                );
                // all the increase level or not logic
                let levelRequirement = 0;
                if (config.level.xpScaling === "constant") {
                    levelRequirement = config.level.level.xpBaseRequirement;
                } else if (config.level.xpScaling === "multiply") {
                    levelRequirement = userdata.level.level * config.level.xpBaseRequirement;
                } else if (config.level.xpScaling === "exponential") {
                    levelRequirement = userdata.level.level ** 2 * config.level.xpBaseRequirement;
                }
                // if user has to be leveled up
                if (userdata.level.xp > levelRequirement) {
                    userdata.level.xp = userdata.level.xp - levelRequirement;
                    userdata.level.level += 1;
                    await Userdatabase.findOneAndUpdate(
                        { key: { userId: message.author.id, guildId: message.guild.id } },
                        {
                            $set: {
                                "level.xp": userdata.level.xp,
                                "level.level": userdata.level.level,
                            },
                        }
                    );
                    try {
                        // get level up channel
                        let channel;
                        if (config.channels.level === "") channel = message.channel;
                        else
                            channel = message.guild.channels.cache.find(
                                (c) => c.id === config.channels.level
                            );
                        if (!channel)
                            return console.log(
                                `[GUILD] Could not find level channel for ${message.guild.name}`
                            );
                        // create level up embed
                        const levelMessage = config.level.levelMessage
                            .replace("{user}", message.member)
                            .replace("{level}", userdata.level.level);
                        const embed = new EmbedBuilder()
                            .setColor(message.member.displayHexColor)
                            .setDescription(levelMessage);
                        // check if any rank roles are configured
                        if (config.level.ranks.length !== 0) {
                            for (let i = 0; i < config.level.ranks.length; i++) {
                                // check if one of the rank roles are matched
                                if (config.level.ranks[i].level === userdata.level.level) {
                                    const roleId = config.level.ranks[i].role;
                                    const role = message.guild.roles.cache.get(roleId);
                                    const rankMessage = config.level.ranks[i].rankUpMessage
                                        .replace("{user}", message.member.user.username)
                                        .replace("{level}", userdata.level.level)
                                        .replace("{rank}", role.name);
                                    embed
                                        .setAuthor({
                                            name: message.author.username,
                                            iconURL: message.author.avatarURL(),
                                        })
                                        .setColor(role.hexColor)
                                        .setTitle(rankMessage)
                                        .setDescription(null);
                                    if (config.level.ranks[i].image !== "") {
                                        embed.setImage(config.level.ranks[i].image);
                                    }
                                    await userdata.save();
                                    await channel.send({
                                        content: `${message.author}`,
                                        embeds: [embed],
                                    });
                                    await removeRole(config, message);
                                    await message.member.roles.add(role);
                                    return;
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
                cooldownLevel.add(message.author.id);
                setTimeout(() => {
                    cooldownLevel.delete(message.author.id);
                }, config.level.xpGainTime);
            }
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[MESSAGE CREATE]` })
                .setDescription(
                    `\`\`\`ansi\n[0;31m[MESSAGE CREATE] Error updating levels for ${message.author.username} in ${message.guild.name}:\`\`\`\n \`\`\`ansi\n[0;31m${error}\`\`\``
                );
            webhookClient
                .send({ embeds: [embed] })
                .catch((e) => console.log(`[MESSAGE CREATE] Webhook failed to send`.red));
            console.log(`[MESSAGE CREATE] Error updating levels ${error}`.red);
        }
        return;
    },
};
