const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const handleCooldowns = require("../../utils/handleCooldowns");
function chunkDescription(description) {
    const chunks = [];
    const maxChunkLength = 4000;
    let currentChunk = "";
    for (const line of description.split("\n")) {
        if (currentChunk.length + line.length > maxChunkLength) {
            chunks.push(currentChunk);
            currentChunk = "";
        }
        currentChunk += line + "\n";
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
}
async function sendEmbedWithChunks(interaction, chunks) {
    if (!chunks || chunks.length === 0) return;
    const totalChunks = chunks.length;
    const embeds = [];
    if (totalChunks === 1) {
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle(`All Configurations`)
            .setDescription(chunks.shift())
            .setTimestamp();
        embeds.push(embed);
    } else {
        const firstEmbed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle(`All Configurations`)
            .setDescription(chunks.shift())
            .setFooter({ text: `[1/${totalChunks}]` })
            .setTimestamp();
        embeds.push(firstEmbed);
    }
    let currentChunk = 1;

    for (const chunk of chunks) {
        const subsequentEmbed = new EmbedBuilder();
        subsequentEmbed.setTitle(null);
        subsequentEmbed.setDescription(chunk);
        subsequentEmbed.setFooter({
            text: `[${currentChunk + 1}/${totalChunks}]`,
        });
        subsequentEmbed.setColor("Green");
        subsequentEmbed.setTimestamp();
        currentChunk++;
        embeds.push(subsequentEmbed);
    }

    for (const embed of embeds) {
        await interaction.channel.send({ embeds: [embed] });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("configs")
        .setDescription("Displays the server's configurations"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        let cooldown = 0;
        if (
            config.commands.cooldowns.filter((c) => c.name === interaction.commandName).length > 0
        ) {
            cooldown = config.commands.cooldowns.find(
                (c) => c.name === interaction.commandName
            ).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        let desc = "";
        try {
            desc += `**Channels**\n`;
            if (config.channels.welcome !== "") {
                desc += `Welcome: <#${config.channels.welcome}>\n`;
            } else {
                desc += `Welcome: N/A\n`;
            }
            if (config.channels.level !== "") {
                desc += `Level: <#${config.channels.level}>\n`;
            } else {
                desc += `Level: N/A\n`;
            }
            if (config.channels.report !== "") {
                desc += `Report: <#${config.channels.report}>\n`;
            } else {
                desc += `Report: N/A\n`;
            }
            if (config.channels.ticket.length !== 0) {
                desc += `Ticket: <#${config.channels.ticket[0].value}>. Created in: <#${config.channels.ticket[1].value}>. Pings: <@&${config.channels.ticket[2].value}>\n`;
            } else {
                desc += `Ticket: N/A\n`;
            }
            if (config.channels.modLog !== "") {
                desc += `Mod Log: <#${config.channels.modLog}>\n`;
            } else {
                desc += `Mod Log: N/A\n`;
            }
            if (config.channels.memberLog !== "") {
                desc += `Member Log: <#${config.channels.memberLog}>\n`;
            } else {
                desc += `Member Log: N/A\n`;
            }
            if (config.channels.messageLog !== "") {
                desc += `Message Log: <#${config.channels.messageLog}>\n`;
            } else {
                desc += `Message Log: N/A\n`;
            }
            if (config.channels.voiceLog !== "") {
                desc += `Voice Log: <#${config.channels.voiceLog}>\n`;
            } else {
                desc += `Voice Log: N/A\n`;
            }
            if (config.channels.restricted.length !== 0) {
                desc += `Restricted: ${config.channels.restricted
                    .map((channel) => `<#${channel}>`)
                    .join(", ")}\n`;
            } else {
                desc += `Restricted: N/A\n`;
            }
            if (config.channels.blacklisted.length !== 0) {
                desc += `Blacklisted: ${config.channels.blacklisted
                    .map((channel) => `<#${channel}>`)
                    .join(", ")}\n`;
            } else {
                desc += `Blacklisted: N/A\n`;
            }
            if (config.channels.minigame.length !== 0) {
                desc += `Minigame: ${config.channels.minigame
                    .map((channel) => `<#${channel}>`)
                    .join(", ")}\n`;
            } else {
                desc += `Minigame: N/A\n`;
            }
            desc += `\n**Moderation**\n`;
            desc += `Warn Limit: ${config.moderation.warnLimit}\n`;
            const { minutes, hours } = parseMilliseconds(config.moderation.timeoutDuration);
            desc += `Timeout Duration: ${hours} hours and ${minutes} minutes\n`;
            desc += `Mod Logs: Warn: ${config.moderation.modLogs.warn ? "✅" : "❌"}, Timeout: ${
                config.moderation.modLogs.timeout ? "✅" : "❌"
            }, Kick: ${config.moderation.modLogs.kick ? "✅" : "❌"}, Ban: ${
                config.moderation.modLogs.ban ? "✅" : "❌"
            }\n`;
            desc += `Member Logs: Role: ${config.moderation.memberLogs.role ? "✅" : "❌"}, Name: ${
                config.moderation.memberLogs.name ? "✅" : "❌"
            }, Avatar: ${config.moderation.memberLogs.avatar ? "✅" : "❌"}\n`;
            desc += `Message Logs: Deleted: ${
                config.moderation.messageLogs.deleted ? "✅" : "❌"
            }, Edited: ${config.moderation.messageLogs.edited ? "✅" : "❌"}, Purged: ${
                config.moderation.messageLogs.purged ? "✅" : "❌"
            }\n`;
            desc += `Voice Logs: Join: ${config.moderation.voiceLogs.join ? "✅" : "❌"}, Move: ${
                config.moderation.voiceLogs.move ? "✅" : "❌"
            }, Leave: ${config.moderation.voiceLogs.leave ? "✅" : "❌"}\n`;
            if (config.moderation.blacklistedWords.length !== 0) {
                desc += `Blacklisted Words: ${config.moderation.blacklistedWords.join(", ")}\n`;
            } else {
                desc += `Blacklisted Words: N/A\n`;
            }
            desc += `\n**Level**\n`;
            desc += `Enabled: ${config.level.enabled ? "✅" : "❌"}\n`;
            if (config.level.enabled) {
                desc += `XP Gain Min: ${config.level.xpGainMin}\n`;
                desc += `XP Gain Max: ${config.level.xpGainMax}\n`;
                const {
                    seconds: xpGainTimeSeconds,
                    minutes: xpGainTimeMinutes,
                    hours: xpGainTimeHours,
                } = parseMilliseconds(config.level.xpGainTime);
                desc += `XP Gain Time: ${xpGainTimeHours} hours, ${xpGainTimeMinutes} minutes, and ${xpGainTimeSeconds} seconds\n`;
                desc += `Base XP Requirement: ${config.level.xpBaseRequirement}\n`;
                desc += `XP Scaling type: ${config.level.xpScaling}\n`;
                desc += `Level Up Message: ${config.level.levelMessage}\n`;
                desc += `Multiplier: ${config.level.multiplier ? "✅" : "❌"}\n`;
                if (config.level.restricted.length !== 0) {
                    desc += `Restricted: ${config.level.restricted
                        .map((c) => `<#${c}>`)
                        .join(", ")}\n`;
                } else {
                    desc += `Restricted: N/A\n`;
                }
                if (config.level.ranks.length !== 0) {
                    desc += `Ranks: ${config.level.ranks
                        .map((r) => `${r.level} - <@&${r.role}> - ${r.rankUpMessage}`)
                        .join("\n")}\n`;
                } else {
                    desc += `Ranks: N/A\n`;
                }
            }
            desc += `\n**Economy**\n`;
            desc += `Enabled: ${config.economy.enabled ? "✅" : "❌"}\n`;
            if (config.economy.enabled) {
                desc += `Currency: ${config.economy.currency} ${config.economy.currencySymbol}\n`;
                desc += `Starting Balance: ${config.economy.baseBalance}\n`;
                desc += `Currency Gain Min: ${config.economy.currencyGainMin}\n`;
                desc += `Currency Gain Max: ${config.economy.currencyGainMax}\n`;
                const {
                    seconds: currencyGainTimeSeconds,
                    minutes: currencyGainTimeMinutes,
                    hours: currencyGainTimeHours,
                } = parseMilliseconds(config.economy.currencyGainTime);
                desc += `Currency Gain Time: ${currencyGainTimeHours} hours, ${currencyGainTimeMinutes} minutes, and ${currencyGainTimeSeconds} seconds\n`;
                desc += `Daily Min: ${config.economy.dailyMin}\n`;
                desc += `Daily Max: ${config.economy.dailyMax}\n`;
                desc += `Coin Flip Reward: ${config.economy.coinflipReward}\n`;
                desc += `Minigame Reward: ${config.economy.minigameReward}\n`;
                desc += `Multiplier: ${config.economy.multiplier ? "✅" : "❌"}\n`;
                if (config.economy.multiplier) {
                    desc += `Multiplier Base Cost: ${config.economy.multiplierBaseCost}\n`;
                    desc += `Multiplier Increment: ${config.economy.multiplierIncrement}\n`;
                    desc += `Multiplier Cost Scaling: ${config.economy.multiplierCostScaling}\n`;
                    desc += `Multiplier Max: ${config.economy.multiplierMax}\n`;
                }
                desc += `Custom Roles: ${config.economy.customRoles ? "✅" : "❌"}\n`;
                if (config.economy.customRoles) {
                    desc += `Custom Role Cost: ${config.economy.customRoleCost}\n`;
                    if (config.economy.customRolePosition !== "") {
                        desc += `Custom Role Position: <@&${config.economy.customRolePosition}>\n`;
                    }
                    desc += `Custom Role Max: ${config.economy.customRoleLimit}\n`;
                }
                if (config.economy.shopRoles.length !== 0) {
                    desc += `Shop Roles: ${config.economy.shopRoles
                        .map((role) => `<@&${role}>`)
                        .join(", ")}\n`;
                } else {
                    desc += `Shop Roles: N/A\n`;
                }
                if (config.economy.shopItems.length !== 0) {
                    desc += `Shop Items: ${config.economy.shopItems
                        .map((item) => `${item.name} - ${item.price}`)
                        .join(", ")}\n`;
                } else {
                    desc += `Shop Items: N/A\n`;
                }
                desc += `Groups: ${config.economy.groups ? "✅" : "❌"}\n`;
                if (config.economy.groups) {
                    desc += `Group Name: ${config.economy.group}\n`;
                    desc += `Group Base Cost: ${config.economy.groupBaseCost}\n`;
                    desc += `Group Base Users: ${config.economy.groupBaseUsers}\n`;
                    desc += `Group Cost Scaling: ${config.economy.groupCostScaling}\n`;
                    desc += `Group Category: <#${config.economy.groupCategory}>\n`;
                    if (config.economy.groupRolePosition !== "") {
                        desc += `Group Role Position: <@&${config.economy.groupRolePosition}>\n`;
                    }
                    desc += `Group Multiplier: ${config.economy.groupMultiplier ? "✅" : "❌"}\n`;
                    if (config.economy.groupMultiplier) {
                        desc += `Group Multiplier Base Cost: ${config.economy.groupMultiplierBaseCost}\n`;
                        desc += `Group Multiplier Increment: ${config.economy.groupMultiplierIncrement}\n`;
                    }
                }
                if (config.economy.restricted.length !== 0) {
                    desc += `Restricted: ${config.economy.restricted
                        .map((c) => `<#${c}>`)
                        .join(", ")}\n`;
                } else {
                    desc += `Restricted: N/A\n`;
                }
                desc += `\n**Commands**\n`;
                if (config.commands.disabled.length !== 0) {
                    desc += `Disabled: ${config.commands.disabled.join(", ")}\n`;
                } else {
                    desc += `Disabled: N/A\n`;
                }
                if (config.commands.blacklistedUsers.length !== 0) {
                    desc += `Blacklisted Users: ${config.commands.blacklistedUsers
                        .map((u) => `<@${u}>`)
                        .join(", ")}\n`;
                } else {
                    desc += `Blacklisted Users: N/A\n`;
                }
                if (config.commands.blacklistedUserCommands.length !== 0) {
                    desc += `Blacklisted User Commands: ${config.commands.blacklistedUserCommands
                        .map((u) => `<@${u.user}> - ${u.commands.join(", ")}`)
                        .join(", ")}\n`;
                } else {
                    desc += `Blacklisted User Commands: N/A\n`;
                }
                if (config.commands.blacklistedChannelCommands.length !== 0) {
                    desc += `Blacklisted Channel Commands: ${config.commands.blacklistedChannels
                        .map((c) => `<#${c.channel}> - ${c.commands.join(", ")}`)
                        .join(", ")}\n`;
                } else {
                    desc += `Blacklisted Channels Commands: N/A\n`;
                }
                if (config.commands.cooldowns.length !== 0) {
                    desc += `Custom Cooldowns: ${config.commands.cooldowns
                        .map((c) => `${c.command} - ${c.cooldown}`)
                        .join(", ")}\n`;
                } else {
                    desc += `Cooldowns: N/A\n`;
                }
                desc += `Default Minigame Cooldown: ${config.commands.defaultMinigameCooldown}\n`;
            }
        } catch (error) {
            console.log("Error creating configs description");
        }
        await interaction.reply({
            content: "Here are all the configurations for this server:",
            ephemeral: true,
        });
        const chunks = chunkDescription(desc);
        await sendEmbedWithChunks(interaction, chunks);
    },
};
