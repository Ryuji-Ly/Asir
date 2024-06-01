var colors = require("colors");
colors.enable();
require("dotenv").config();
const { OpenAI } = require("openai");
const Userdatabase = require("../models/userSchema");
const GroupModel = require("../models/group");
const cooldownLevel = new Set();
const cooldownEconomy = new Set();
const { EmbedBuilder, Message, WebhookClient } = require("discord.js");
const openai = new OpenAI({ apiKey: process.env.openai_key });

const allowedChannels = [
    "1168986371092922418",
    "1161029339073232896",
    "1223934791846592585",
    "1161927571567562862",
    "1197517807676567652",
];
const endTriggers = [
    "stop",
    "end",
    "shut up",
    "terminate",
    "exit",
    "bye",
    "quit",
    "finish",
    "close",
    "goodbye",
    "done",
    "cancel",
    "abort",
    "cease",
    "halt",
    "desist",
    "conclude",
    "break off",
    "cut off",
    "discontinue",
    "drop",
    "give up",
    "knock off",
    "leave",
    "pack in",
    "suspend",
    "wind up",
    "wrap up",
    "call it a day",
    "call it a night",
    "call it quits",
    "cut it out",
    "knock it off",
    "pack it in",
    "pull the plug",
];
const allowedUserId = "348902272534839296";
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
function getMonthName(monthIndex) {
    const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ];
    return months[monthIndex];
}
function getWordAfterKeyword(str, keyword) {
    const regexPattern = new RegExp(`\\b${keyword}\\s+(\\w+)`, "i");
    const match = str.match(regexPattern);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}
function extractNumberFromString(str) {
    const regexPattern = /\d+/;
    const match = str.match(regexPattern);

    if (match) {
        return parseInt(match[0], 10);
    } else {
        return null;
    }
}

const activeConversations = new Set();

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
            if (message.channel.name.includes("spam")) return;
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const updateFields = {
                $inc: {
                    "data.messages": 1,
                    "data.timeBasedStats.dailyMessages": 1,
                    "data.timeBasedStats.weeklyMessages": 1,
                    "data.timeBasedStats.monthlyMessages": 1,
                    "data.timeBasedStats.yearlyMessages": 1,
                },
            };
            const exists = user.data.timeBasedStats.totalMessages.findIndex(
                (x) => x.year === currentYear
            );
            if (exists !== -1) {
                const monthName = getMonthName(currentMonth);
                updateFields.$inc[`data.timeBasedStats.totalMessages.${exists}.${monthName}`] = 1;
            } else {
                const stats = {
                    year: currentYear,
                    january: 0,
                    february: 0,
                    march: 0,
                    april: 0,
                    may: 0,
                    june: 0,
                    july: 0,
                    august: 0,
                    september: 0,
                    october: 0,
                    november: 0,
                    december: 0,
                };
                stats[getMonthName(currentMonth)] = 1;
                updateFields.$push = { "data.timeBasedStats.totalMessages": stats };
            }
            await Userdatabase.findOneAndUpdate(
                { "key.userId": message.author.id, "key.guildId": message.guild.id },
                updateFields
            );
        } catch (error) {
            const newUser = await Userdatabase.create({
                key: { userId: message.author.id, guildId: message.guild.id },
                "economy.wallet": config.economy.baseBalance,
                "data.messages": 1,
                "data.timeBasedStats.dailyMessages": 1,
                "data.timeBasedStats.weeklyMessages": 1,
                "data.timeBasedStats.monthlyMessages": 1,
                "data.timeBasedStats.yearlyMessages": 1,
                ["data.timeBasedStats.totalMessages"]: [
                    {
                        year: new Date().getFullYear(),
                        january: 0,
                        february: 0,
                        march: 0,
                        april: 0,
                        may: 0,
                        june: 0,
                        july: 0,
                        august: 0,
                        september: 0,
                        october: 0,
                        november: 0,
                        december: 0,
                    },
                ],
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
        if (message.mentions.users.size > 0) {
            await Promise.all(
                message.mentions.users.map(async (user) => {
                    const mentionedUser = await Userdatabase.findOne({
                        key: { userId: user.id, guildId: message.guild.id },
                    });

                    if (mentionedUser) {
                        const mentionIndex = mentionedUser.data.mentioned.findIndex(
                            (x) => x.user === message.author.id
                        );
                        if (mentionIndex !== -1) {
                            await Userdatabase.updateOne(
                                {
                                    key: { userId: user.id, guildId: message.guild.id },
                                    "data.mentioned.user": message.author.id,
                                },
                                { $inc: { "data.mentioned.$.count": 1 } }
                            );
                        } else {
                            const mentioned = { user: message.author.id, count: 1 };
                            await Userdatabase.updateOne(
                                {
                                    key: { userId: user.id, guildId: message.guild.id },
                                },
                                { $push: { "data.mentioned": mentioned } }
                            );
                        }
                    }

                    const data = await Userdatabase.findOne({
                        key: { userId: message.author.id, guildId: message.guild.id },
                    });

                    const mentionIndexAuthor = data.data.mentions.findIndex(
                        (x) => x.user === user.id
                    );
                    if (mentionIndexAuthor !== -1) {
                        await Userdatabase.updateOne(
                            {
                                key: { userId: message.author.id, guildId: message.guild.id },
                                "data.mentions.user": user.id,
                            },
                            { $inc: { "data.mentions.$.count": 1 } }
                        );
                    } else {
                        const mentioned = { user: user.id, count: 1 };
                        await Userdatabase.updateOne(
                            {
                                key: { userId: message.author.id, guildId: message.guild.id },
                            },
                            { $push: { "data.mentions": mentioned } }
                        );
                    }
                })
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
                if (!cooldownLevel.has(message.author.id)) {
                    const groupCategory = message.guild.channels.cache.get(config.groupCategoryId);
                    let groupChannels = [];
                    if (groupCategory)
                        groupChannels = groupCategory.children.cache.map((c) => c.id);
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
                        levelRequirement =
                            userdata.level.level ** 2 * config.level.xpBaseRequirement;
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
                            if (!channel) {
                                console.log(
                                    `[GUILD] Could not find level channel for ${message.guild.name}`
                                );
                                channel = message.channel;
                            }
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
        // chatbot logic
        // try {
        //     const { author, channel, content, mentions } = message;
        //     const channelId = channel.id;
        //     async function handleConversationStart(message) {
        //         const { channel } = message;
        //         try {
        //             channel.sendTyping(); // Send initial typing indicator
        //             const conversation = await getConversationHistory(message);
        //             const response = await openai.chat.completions.create({
        //                 model: "gpt-4",
        //                 messages: conversation,
        //             });

        //             await handleResponse(message, response);
        //         } catch (error) {
        //             console.error(`Error with ChatGPT: ${error}`);
        //             await message.reply("I'm sorry, I couldn't understand that.");
        //         }
        //     }
        //     async function handleConversationContinue(message) {
        //         const { channel } = message;

        //         try {
        //             channel.sendTyping(); // Send typing indicator
        //             const conversation = await getConversationHistory(message);
        //             const response = await openai.chat.completions.create({
        //                 model: "gpt-4",
        //                 messages: conversation,
        //             });

        //             await handleResponse(message, response);
        //         } catch (error) {
        //             console.error(`Error with ChatGPT: ${error}`);
        //             await message.reply("I'm sorry, I couldn't understand that.");
        //         }
        //     }
        //     async function getConversationHistory(message) {
        //         const { channel } = message;
        //         const prevMessages = await channel.messages.fetch({ limit: 10 });
        //         const conversation = [];

        //         prevMessages.reverse().forEach((msg) => {
        //             if (!msg.author.bot || msg.author.id === client.user.id) {
        //                 const role = msg.author.id === client.user.id ? "assistant" : "user";
        //                 const username = msg.author.username.replace(/[^a-zA-Z0-9_-]/g, ""); // Sanitize username
        //                 conversation.push({ role, name: username, content: msg.content });
        //             }
        //         });

        //         conversation.push({ role: "system", content: "Chat GPT is a friendly chatbot." });
        //         return conversation;
        //     }
        //     async function handleResponse(message, response) {
        //         const { channel } = message;

        //         if (response && response.choices.length > 0) {
        //             const responseMsg = response.choices[0].message.content;
        //             const chunkSizeLimit = 2000;
        //             for (let i = 0; i < responseMsg.length; i += chunkSizeLimit) {
        //                 const chunk = responseMsg.substring(i, i + chunkSizeLimit);
        //                 await message.reply(chunk);
        //             }
        //         } else {
        //             await message.reply("I'm sorry, I couldn't understand that.");
        //         }
        //     }
        //     if (
        //         author.bot ||
        //         (!allowedChannels.includes(channelId) &&
        //             !activeConversations.has(channel.id) &&
        //             author.id !== allowedUserId)
        //     )
        //         return;
        //     const isBotMentioned = mentions.has(client.user.id);
        //     const isChatTriggered = isBotMentioned;
        //     if (isChatTriggered) {
        //         if (!activeConversations.has(channelId)) {
        //             activeConversations.add(channelId); // Start conversation for this channel
        //             await handleConversationStart(message);
        //         } else {
        //             await handleConversationContinue(message);
        //         }
        //         if (endTriggers.some((trigger) => content.toLowerCase().includes(trigger))) {
        //             activeConversations.delete(channelId);
        //         }
        //     } else {
        //         if (endTriggers.some((trigger) => content.toLowerCase().includes(trigger))) {
        //             activeConversations.delete(channelId);
        //         }
        //     }
        // } catch (error) {
        //     console.error(`Error with ChatGPT: ${error}`);
        // }
        return;
    },
};
