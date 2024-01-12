const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

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
        const embed1 = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })
            .setTitle(`Displaying configurations of ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .setColor("Blurple");
        const embed2 = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })
            .setThumbnail(guild.iconURL())
            .setTitle(`Displaying configurations of ${guild.name}`)
            .setColor("Blurple");
        //add fields welc, suggest, group, level, ticket, report, ignored, restrict, minigame, modlog, memberlog, voicelog, messagelog
        if (config.welcomeChannelId === "") {
            embed1.addFields({ name: "Welcome Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.welcomeChannelId
            );
            embed1.addFields({ name: `Welcome Channel`, value: `${channel}`, inline: true });
        }
        if (config.suggestionChannelIds.length === 0) {
            embed1.addFields({ name: "Suggestion Channels", value: `N/A`, inline: true });
        } else {
            let string = [];
            for (let i = 0; i < config.suggestionChannelIds.length; i++) {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === config.suggestionChannelIds[i]
                );
                string.push(channel);
            }
            embed1.addFields({
                name: `Suggestion Channels`,
                value: `${string}`,
                inline: true,
            });
        }
        if (config.groupCategoryId === "") {
            embed1.addFields({ name: "Group Category", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.groupCategoryId
            );
            embed1.addFields({ name: `Group Category`, value: `${channel}`, inline: true });
        }
        if (config.levelChannelId === "") {
            embed1.addFields({ name: "Level Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.levelChannelId
            );
            embed1.addFields({ name: `Level Channel`, value: `${channel}`, inline: true });
        }
        if (config.ticketChannelId === "") {
            embed1.addFields({ name: "Ticket Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.ticketChannelId
            );
            embed1.addFields({ name: `Ticket Channel`, value: `${channel}`, inline: true });
        }
        if (config.reportChannelId === "") {
            embed1.addFields({ name: "Message Reports Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.reportChannelId
            );
            embed1.addFields({
                name: `Message Reports Channel`,
                value: `${channel}`,
                inline: true,
            });
        }
        if (config.ignoredChannelIds.length === 0) {
            embed1.addFields({ name: "Ignored Channels", value: `N/A`, inline: true });
        } else {
            let string = [];
            for (let i = 0; i < config.ignoredChannelIds.length; i++) {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === config.ignoredChannelIds[i]
                );
                string.push(channel);
            }
            embed1.addFields({
                name: `Ignored Channels`,
                value: `${string}`,
                inline: true,
            });
        }
        if (config.restrictedChannelIds.length === 0) {
            embed1.addFields({ name: "Restricted Channels", value: `N/A`, inline: true });
        } else {
            let string = [];
            for (let i = 0; i < config.restrictedChannelIds.length; i++) {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === config.restrictedChannelIds[i]
                );
                string.push(channel);
            }
            embed1.addFields({
                name: `Restricted Channels`,
                value: `${string}`,
                inline: true,
            });
        }
        if (config.minigameChannelIds.length === 0) {
            embed1.addFields({ name: "Minigame Channels", value: `N/A`, inline: true });
        } else {
            let string = [];
            for (let i = 0; i < config.minigameChannelIds.length; i++) {
                const channel = guild.channels.cache.find(
                    (channel) => channel.id === config.minigameChannelIds[i]
                );
                string.push(channel);
            }
            embed1.addFields({
                name: `Minigame Channels`,
                value: `${string}`,
                inline: true,
            });
        }
        if (config.modLogChannelId === "") {
            embed1.addFields({ name: "Moderation Log Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.modLogChannelId
            );
            embed1.addFields({
                name: `Moderation Log Channel`,
                value: `${channel}`,
                inline: true,
            });
        }
        if (config.messageLogChannelId === "") {
            embed1.addFields({ name: "Message Log Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.messageLogChannelId
            );
            embed1.addFields({
                name: `Message Log Channel`,
                value: `${channel}`,
                inline: true,
            });
        }
        if (config.memberLogChannelId === "") {
            embed1.addFields({ name: "Member Log Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.memberLogChannelId
            );
            embed1.addFields({
                name: `Member Log Channel`,
                value: `${channel}`,
                inline: true,
            });
        }
        if (config.voiceLogChannelId === "") {
            embed1.addFields({ name: "Voice Log Channel", value: `N/A`, inline: true });
        } else {
            const channel = guild.channels.cache.find(
                (channel) => channel.id === config.voiceLogChannelId
            );
            embed1.addFields({
                name: `Voice Log Channel`,
                value: `${channel}`,
                inline: true,
            });
        }
        const { hours, minutes } = parseMilliseconds(config.timeoutDuration);
        let modlogstring = "";
        let memberlogstring = "";
        let messagelogstring = "";
        let voicelogstring = "";
        for (let i = 0; i < config.modLogs.length; i++) {
            let emoji;
            if (config.modLogs[i].value === true) emoji = "✅";
            if (config.modLogs[i].value === false) emoji = "❌";
            modlogstring += `${emoji} ${config.modLogs[i].name}\n`;
        }
        for (let i = 0; i < config.memberLogs.length; i++) {
            let emoji;
            if (config.memberLogs[i].value === true) emoji = "✅";
            if (config.memberLogs[i].value === false) emoji = "❌";
            memberlogstring += `${emoji} ${config.memberLogs[i].name}\n`;
        }
        for (let i = 0; i < config.messageLogs.length; i++) {
            let emoji;
            if (config.messageLogs[i].value === true) emoji = "✅";
            if (config.messageLogs[i].value === false) emoji = "❌";
            messagelogstring += `${emoji} ${config.messageLogs[i].name}\n`;
        }
        for (let i = 0; i < config.voiceLogs.length; i++) {
            let emoji;
            if (config.voiceLogs[i].value === true) emoji = "✅";
            if (config.voiceLogs[i].value === false) emoji = "❌";
            voicelogstring += `${emoji} ${config.voiceLogs[i].name}\n`;
        }
        let disabledString;
        if (config.disabledCommands.length === 0) disabledString = "N/A";
        else disabledString = config.disabledCommands.join(", ");
        embed1.addFields(
            {
                name: `Warn limit before auto timeout`,
                value: `${config.warnLimit}`,
                inline: true,
            },
            {
                name: `Auto moderation timeout duration`,
                value: `${hours} hours ${minutes} minutes`,
                inline: true,
            },
            {
                name: `Moderation logs`,
                value: `${modlogstring}`,
                inline: true,
            },
            {
                name: `Member logs`,
                value: `${memberlogstring}`,
                inline: true,
            },
            {
                name: `Message logs`,
                value: `${messagelogstring}`,
                inline: true,
            },
            {
                name: `Voice logs`,
                value: `${voicelogstring}`,
                inline: true,
            },
            {
                name: `Disabled commands`,
                value: `${disabledString}`,
                inline: true,
            }
        );
        let customrolestring = "";
        if (config.customRole === false) customrolestring = "❌";
        else customrolestring = "✅";
        let levelstring = "";
        if (config.Level === false)
            levelstring = "Leveling function is disabled, all level related configs do not apply";
        else levelstring = "Leveling function is enabled";
        let economystring = "";
        if (config.Economy === false)
            economystring =
                "Economy function is disabled, all economy related configs do not apply";
        else economystring = "Economy function is enabled";
        embed2.addFields(
            {
                name: `Currency Name`,
                value: `${config.currencyName}`,
                inline: true,
            },
            {
                name: "Level",
                value: `${levelstring}`,
                inline: true,
            },
            {
                name: "Economy",
                value: `${economystring}`,
                inline: true,
            },
            {
                name: `Experience gain from Activity`,
                value: `${config.randomXpMin} - ${config.randomXpMax}`,
                inline: true,
            },
            {
                name: `${config.currencyName} gain from Activity`,
                value: `${config.randomCurrency}`,
                inline: true,
            },
            {
                name: `Base Experience Requirement`,
                value: `${config.xpBaseRequirement}`,
                inline: true,
            },
            {
                name: `Experience Scaling type`,
                value: `${config.xpScaling}`,
                inline: true,
            },
            {
                name: `Daily amount`,
                value: `${config.dailyMin} - ${config.dailyMax}`,
                inline: true,
            },
            {
                name: `Coin flip reward`,
                value: `${config.coinflipReward}`,
                inline: true,
            },
            {
                name: `Minigame basic reward`,
                value: `${config.minigameReward}`,
                inline: true,
            },
            {
                name: `Custom Role Enabled/Disabled`,
                value: `${customrolestring}`,
                inline: true,
            },
            {
                name: `Group costs`,
                value: `Create: ${config.groupCost}\nMultiplier: ${config.groupMultiBaseCost}\nExpand: ${config.groupExpandBaseCost}`,
                inline: true,
            },
            {
                name: `User costs`,
                value: `Multiplier: ${config.multiplierBaseCost}\nCustom Role: ${config.customRoleCost}`,
                inline: true,
            },
            {
                name: `Limits`,
                value: `Custom Roles: ${config.customRoleLimit}\nUser Multiplier: ${config.memberMultiLimit}\nGroup Multiplier: ${config.groupMultiLimit}`,
                inline: true,
            }
        );
        return interaction.reply({ embeds: [embed1, embed2] });
    },
};
