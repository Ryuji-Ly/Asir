const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");
const guildConfiguration = require("../../models/guildConfiguration");
function attachIsImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config2")
        .setDescription("Configuration settings 2")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        // restricted channels
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add-restricted-channel")
                .setDescription("Commands cannot be used in restricted channels")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to add to the restricted channels")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-restricted-channel")
                .setDescription("Removes a channel from the restricted channels")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "The channel you want to remove from the restricted channels"
                        )
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        // minigame channels
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add-minigame-channel")
                .setDescription("Minigame commands can only be used in minigame channels")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to add to the minigame channels")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-minigame-channel")
                .setDescription("Removes a channel from the minigame channels")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to remove from the minigame channels")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        //warn limit, timeout duration, logs
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-warn-limit")
                .setDescription(
                    "Sets a warn limit, if the limit is reached the offender will be timeouted automatically"
                )
                .addIntegerOption((option) =>
                    option
                        .setName("limit")
                        .setDescription("The warn limit, minium 2, maximum 10")
                        .setMinValue(2)
                        .setMaxValue(10)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-timeout-duration")
                .setDescription("Default automated timeout duration")
                .addIntegerOption((option) =>
                    option
                        .setName("minutes")
                        .setDescription("How many minutes from now")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(59)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("hours")
                        .setDescription("How many hours from now")
                        .setRequired(false)
                        .setMinValue(0)
                        .setMaxValue(23)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-mod-logs")
                .setDescription("Configure which moderation actions are logged")
                .addBooleanOption((option) =>
                    option
                        .setName("warn")
                        .setDescription("Enable/disable logging warns automated and manual")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("timeout")
                        .setDescription("Enable/disable logging timeouts")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("kick")
                        .setDescription("Enable/disable logging kicks")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("ban")
                        .setDescription("Enable/disable logging bans")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-member-logs")
                .setDescription("Configure which member events are logged")
                .addBooleanOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Enable/disable logging role updates")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("name")
                        .setDescription("Enable/disable logging name changes")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("avatar")
                        .setDescription("Enable/disable logging avatar changes")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-voice-logs")
                .setDescription("Configure which voice events are logged")
                .addBooleanOption((option) =>
                    option
                        .setName("join")
                        .setDescription("Enable/disable logging voice channel joins")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("move")
                        .setDescription("Enable/disable logging moving between voice channels")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("leave")
                        .setDescription("Enable/disable logging voice channel leaves")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-message-logs")
                .setDescription("Configure which message events are logged")
                .addBooleanOption((option) =>
                    option
                        .setName("deleted")
                        .setDescription("Enable/disable logging deleted messages")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("edited")
                        .setDescription("Enable/disable logging edited messages")
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName("purged")
                        .setDescription("Enable/disable logging purged messages")
                        .setRequired(true)
                )
        )
        //toggle level and economy
        .addSubcommand((subcommand) =>
            subcommand
                .setName("level")
                .setDescription("Enable/disable the leveling function")
                .addBooleanOption((option) =>
                    option.setName("toggle").setDescription("Enable/Disable").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("economy")
                .setDescription("Enable/disable the economy function")
                .addBooleanOption((option) =>
                    option.setName("toggle").setDescription("Enable/Disable").setRequired(true)
                )
        )
        //blacklisted words
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add-blacklisted-word")
                .setDescription(
                    "Messages containing blacklisted words will be deleted and the user warned"
                )
                .addStringOption((option) =>
                    option
                        .setName("word")
                        .setDescription("The word you want to add to the blacklisted words")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-blacklisted-word")
                .setDescription(
                    "Messages containing blacklisted words will be deleted and the user warned"
                )
                .addStringOption((option) =>
                    option
                        .setName("word")
                        .setDescription("The word you want to remove from blacklisted words")
                        .setRequired(true)
                )
        )
        //set limites
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-limits")
                .setDescription("Set member & multiplier limits as well as custom role limits")
                .addIntegerOption((option) =>
                    option
                        .setName("member-multiplier")
                        .setDescription("Set's the maximum member multiplier")
                        .setMinValue(2)
                        .setMaxValue(100)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("group-multiplier")
                        .setDescription("Set's the maximum group multiplier")
                        .setMinValue(2)
                        .setMaxValue(100)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("custom-role")
                        .setDescription("Set's the maximum amount of custom roles a user can have")
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        )
        //activity gains
        .addSubcommand((subcommand) =>
            subcommand
                .setName("activity-gains")
                .setDescription("Configure all level and economy gain from activity")
                .addIntegerOption((option) =>
                    option
                        .setName("exp-min")
                        .setDescription("Minimum exp gained per message")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("exp-max")
                        .setDescription("Maximum exp gained per message")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName(`currency`)
                        .setDescription("Currency gained per message")
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        //basic economy
        .addSubcommand((subcommand) =>
            subcommand
                .setName("basic-economy")
                .setDescription("Configure daily amounts, coin flip reward, minigame basic reward")
                .addIntegerOption((option) =>
                    option
                        .setName("daily-min")
                        .setDescription("Minimum amount you can get from daily")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("daily-max")
                        .setDescription("Maximum amount you can get from daily")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("coinflip")
                        .setDescription("Base reward for coinflip")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("minigame")
                        .setDescription("Base reward for minigames")
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        //basic costs
        .addSubcommand((subcommand) =>
            subcommand
                .setName("basic-costs")
                .setDescription("Configure group & user costs")
                .addIntegerOption((option) =>
                    option
                        .setName("group-create")
                        .setDescription("Cost to create a group")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("group-multiplier")
                        .setDescription("Cost to increase group multiplier")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("group-expand")
                        .setDescription("Cost to expand a group")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("user-multiplier")
                        .setDescription("Cost to increase user multiplier")
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("custom-role")
                        .setDescription("Cost to buy a custom role")
                        .setRequired(true)
                )
        )
        //level configurations
        .addSubcommand((subcommand) =>
            subcommand
                .setName("levels")
                .setDescription("Configure level function")
                .addIntegerOption((option) =>
                    option
                        .setName("requirement")
                        .setDescription("Experience requirement for levels")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("group-channel-bonus")
                        .setDescription("Additional group channel bonus multiplier")
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("scaling")
                        .setDescription("Experience scaling type")
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "Constant, exp requirement remains the same",
                                value: "constant",
                            },
                            {
                                name: "Multiply, exp requirement is multiplied by current level",
                                value: "multiply",
                            },
                            {
                                name: "Exponential, exp requirement is multiplied by current level squared",
                                value: "exponential",
                            }
                        )
                )
        )
        //ranks
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-rank")
                .setDescription("Adds level + role to a rank, optional img")
                .addIntegerOption((option) =>
                    option
                        .setName("level")
                        .setDescription("At which level a user gains this rank")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role a user gets when achieving the rank")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName("img").setDescription("Provide a valid img url link")
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-rank")
                .setDescription("Removes a rank")
                .addIntegerOption((option) =>
                    option
                        .setName("level")
                        .setDescription("The level of the rank you want to remove")
                        .setRequired(true)
                )
        )
        //enable disable commands
        .addSubcommand((subcommand) =>
            subcommand
                .setName("commands")
                .setDescription("Disable/enable commands for the entire server")
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command to disable/enable")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        return interaction.reply({ content: "This command is being fixed.", ephemeral: true });
        const subcommand = options.getSubcommand();
        const data = await guildConfiguration.findOne({ guildId: guild.id });
        if (subcommand === "add-restricted-channel") {
            const channel = options.getChannel("channel");
            if (!data.restrictedChannelIds.includes(channel.id)) {
                data.restrictedChannelIds.push(channel.id);
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have added ${channel} to your restricted channels!`);
            } else {
                if (data.restrictedChannelIds.includes(channel.id))
                    return interaction.reply(`${channel} is already in the restricted channels.`);
            }
        }
        if (subcommand === "remove-restricted-channel") {
            const channel = options.getChannel("channel");
            if (data.restrictedChannelIds.includes(channel.id)) {
                const index = data.restrictedChannelIds.indexOf(channel.id);
                data.restrictedChannelIds.splice(index, 1);
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have removed ${channel} from the restricted channels.`
                );
            }
            return interaction.reply(`This channel is not among the restricted channels`);
        }
        if (subcommand === "add-minigame-channel") {
            const channel = options.getChannel("channel");
            if (!data.minigameChannelIds.includes(channel.id)) {
                data.minigameChannelIds.push(channel.id);
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have added ${channel} to your minigame channels!`);
            } else {
                if (data.minigameChannelIds.includes(channel.id))
                    return interaction.reply(`${channel} is already in the minigame channels.`);
            }
        }
        if (subcommand === "remove-minigame-channel") {
            const channel = options.getChannel("channel");
            if (data.minigameChannelIds.includes(channel.id)) {
                const index = data.minigameChannelIds.indexOf(channel.id);
                data.minigameChannelIds.splice(index, 1);
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have removed ${channel} from the minigame channels.`);
            }
            return interaction.reply(`This channel is not among the minigame channels`);
        }
        if (subcommand === "set-warn-limit") {
            const limit = options.getInteger("limit");
            data.warnLimit = limit;
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(`You have updated the warn limit to ${limit}`);
            return;
        }
        if (subcommand === "set-timeout-duration") {
            const minutes = options.getInteger("minutes") || 0;
            const hours = options.getInteger("hours") || 0;
            if (minutes + hours === 0)
                return interaction.reply({
                    content: "Please set a value higher than 1 minute",
                    ephemeral: true,
                });
            const time = hours * 1000 * 60 * 60 + minutes * 100 * 60;
            data.timeoutDuration = time;
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(
                `You have updated the default timeout duration to ${hours} hours ${minutes} minutes.`
            );
            return;
        }
        if (subcommand === "set-mod-logs") {
            const warn = options.getBoolean("warn");
            const timeout = options.getBoolean("timeout");
            const kick = options.getBoolean("kick");
            const ban = options.getBoolean("ban");
            data.modLogs[0] = { name: "warn", value: warn };
            data.modLogs[1] = { name: "timeout", value: timeout };
            data.modLogs[2] = { name: "kick", value: kick };
            data.modLogs[3] = { name: "ban", value: ban };
            await data.save();
            await client.configs.set(guild.id, data);
            let string = "";
            if (warn) string += "✅ warn\n";
            else string += "❌ warn\n";
            if (timeout) string += "✅ timeout\n";
            else string += "❌ timeout\n";
            if (kick) string += "✅ kick\n";
            else string += "❌ kick\n";
            if (ban) string += "✅ ban\n";
            else string += "❌ ban\n";
            interaction.reply(`You have configured moderation logs to:\n${string}`);
            return;
        }
        if (subcommand === "set-member-logs") {
            const role = options.getBoolean("role");
            const name = options.getBoolean("name");
            const avatar = options.getBoolean("avatar");
            data.memberLogs[0] = { name: "role", value: role };
            data.memberLogs[1] = { name: "name", value: name };
            data.memberLogs[2] = { name: "avatar", value: avatar };
            await data.save();
            await client.configs.set(guild.id, data);
            let string = "";
            if (role) string += "✅ role updates\n";
            else string += "❌ role updates\n";
            if (name) string += "✅ name changes\n";
            else string += "❌ name changes\n";
            if (avatar) string += "✅ avatar changes\n";
            else string += "❌ avatar changes\n";
            interaction.reply(`You have configured member logs to:\n${string}`);
            return;
        }
        if (subcommand === "set-voice-logs") {
            const join = options.getBoolean("join");
            const move = options.getBoolean("move");
            const leave = options.getBoolean("leave");
            data.voiceLogs[0] = { name: "join", value: join };
            data.voiceLogs[1] = { name: "move", value: move };
            data.voiceLogs[2] = { name: "leave", value: leave };
            await data.save();
            await client.configs.set(guild.id, data);
            let string = "";
            if (join) string += "✅ voice channel joins\n";
            else string += "❌ voice channel joins\n";
            if (move) string += "✅ movement between voice channels\n";
            else string += "❌ movement between voice channels\n";
            if (leave) string += "✅ voice channel leaves\n";
            else string += "❌ voice channel leaves\n";
            interaction.reply(`You have configured voice logs to:\n${string}`);
            return;
        }
        if (subcommand === "set-message-logs") {
            const deleted = options.getBoolean("deleted");
            const edited = options.getBoolean("edited");
            const purged = options.getBoolean("purged");
            data.messageLogs[0] = { name: "deleted", value: deleted };
            data.messageLogs[1] = { name: "edited", value: edited };
            data.messageLogs[2] = { name: "purged", value: purged };
            await data.save();
            await client.configs.set(guild.id, data);
            let string = "";
            if (deleted) string += "✅ deleted messages\n";
            else string += "❌ deleted messages\n";
            if (edited) string += "✅ edited messages\n";
            else string += "❌ edited messages\n";
            if (purged) string += "✅ purged messages\n";
            else string += "❌ purged messages\n";
            interaction.reply(`You have configured message logs to:\n${string}`);
            return;
        }
        if (subcommand === "level") {
            const toggle = options.getBoolean("toggle");
            data.Level = toggle;
            await data.save();
            await client.configs.set(guild.id, data);
            if (toggle) interaction.reply("You have enabled the leveling function!");
            else interaction.reply("You have disabled the leveling function.");
            return;
        }
        if (subcommand === "economy") {
            const toggle = options.getBoolean("toggle");
            data.Economy = toggle;
            await data.save();
            await client.configs.set(guild.id, data);
            if (toggle) interaction.reply("You have enabled the economy function!");
            else interaction.reply("You have disabled the economy function.");
            return;
        }
        if (subcommand === "add-blacklisted-word") {
            const word = options.getString("word").toLowerCase();
            if (word.includes(" "))
                return interaction.reply({ content: "This word contains spaces", ephemeral: true });
            if (data.blacklistedWords.includes(word))
                return interaction.reply({
                    content: "This word is already blacklisted",
                    ephemeral: true,
                });
            data.blacklistedWords.push(word);
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(
                `You have added ${word} to the blacklisted words, the current blacklisted words are: **${data.blacklistedWords.join(
                    " "
                )}**`
            );
            return;
        }
        if (subcommand === "remove-blacklisted-word") {
            const word = options.getString("word").toLowerCase();
            if (!data.blacklistedWords.includes(word))
                return interaction.reply({
                    content: "This word is not blacklisted",
                    ephemeral: true,
                });
            const index = data.blacklistedWords.indexOf(word);
            data.blacklistedWords.splice(index, 1);
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(`You have removed ${word} from the blacklisted words`);
            return;
        }
        if (subcommand === "set-limits") {
            if (!data.Economy)
                return interaction.reply({
                    content: "Economy function is disabled",
                    ephemeral: true,
                });
            const member = options.getInteger("member-multiplier");
            const group = options.getInteger("group-multiplier");
            const custom = options.getInteger("custom-role");
            data.memberMultiLimit = member;
            data.groupMultiLimit = group;
            data.customRoleLimit = custom;
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(
                `You have set limits:\nUser Multiplier: ${member}\nGroup Multiplier: ${group}\nCustom Roles: ${custom}`
            );
            return;
        }
        if (subcommand === "activity-gains") {
            if (!data.Level && !data.Economy)
                return interaction.reply({
                    content: `One or both of levels or economy is disabled`,
                    ephemeral: true,
                });
            const xpmin = options.getInteger("exp-min");
            const xpmax = options.getInteger("exp-max");
            const currency = options.getInteger("currency");
            if (xpmin > xpmax)
                return interaction.reply({
                    content: "The minimum exp gain is bigger than the maximum exp gain",
                    ephemeral: true,
                });
            data.randomXpMin = xpmin;
            data.randomXpMax = xpmax;
            data.randomCurrency = currency;
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(
                `You have set the experience gain to ${xpmin} - ${xpmax} and currency gain to ${currency} for every message sent, with a cooldown of 1 minute before a user gains exp from activity again`
            );
            return;
        }
        if (subcommand === "basic-economy") {
            if (!data.Economy)
                return interaction.reply({
                    content: `Economy function is disabled`,
                    ephemeral: true,
                });
            const dailymin = options.getInteger("daily-min");
            const dailymax = options.getInteger("daily-max");
            const coinflip = options.getInteger("coinflip");
            const minigame = options.getInteger("minigame");
            if (dailymin > dailymax)
                return interaction.reply({
                    content: `Daily minumum is larger than daily maximum`,
                    ephemeral: true,
                });
            data.dailyMin = dailymin;
            data.dailyMax = dailymax;
            data.coinflipReward = coinflip;
            data.minigameReward = minigame;
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(
                `You have set daily values to ${dailymin} - ${dailymax}, coinflip reward to ${coinflip} ${data.currencyName}, minigame reward to ${minigame} ${data.currencyName}`
            );
            return;
        }
        if (subcommand === "basic-costs") {
            if (!data.Economy)
                return interaction.reply({
                    content: `Economy function is disabled`,
                    ephemeral: true,
                });
            const groupc = options.getInteger("group-create");
            const groupm = options.getInteger("group-multiplier");
            const groupe = options.getInteger("group-expand");
            const userm = options.getInteger("user-multiplier");
            const customr = options.getInteger("custom-role");
            data.groupCost = groupc;
            data.groupMultiBaseCost = groupm;
            data.groupExpandBaseCost = groupe;
            data.multiplierBaseCost = userm;
            data.customRoleCost = customr;
            await data.save();
            await client.configs.set(guild.id, data);
            interaction.reply(
                `You have configured basic costs:\nGroup Create: ${groupc}\nGroup Multiplier: ${groupm}\nGroup Expand: ${groupe}\n User Multiplier: ${userm}\nCustom Role: ${customr}`
            );
            return;
        }
        if (subcommand === "levels") {
            if (!data.Level)
                return interaction.reply({
                    content: `Economy function is disabled`,
                    ephemeral: true,
                });
            const requirement = options.getInteger("requirement");
            const scaling = options.getString("scaling");
            const groupbonus = options.getInteger("group-channel-bonus");
            data.xpBaseRequirement = requirement;
            data.xpScaling = scaling;
            data.groupChannelMulti = groupbonus;
            await data.save();
            await client.configs.set(guild.id, data);
            await interaction.reply(
                `Base Experience Requirement is now **${requirement}**\nExperience Scaling type is now **${scaling}**\nGroup Channel Bonus Multiplier is now **${groupbonus}**`
            );
            return;
        }
        if (subcommand === "set-rank") {
            const level = options.getInteger("level");
            const role = options.getRole("role");
            const img = options.getString("img") || "";
            for (let i = 0; i < data.rankRoles.length; i++) {
                if (level === data.rankRoles[i].level)
                    return await interaction.reply({
                        content: "This level already has a rank",
                        ephemeral: true,
                    });
            }
            for (let i = 0; i < data.rankRoles.length; i++) {
                if (role.id === data.rankRoles[i].role)
                    return await interaction.reply({
                        content: "This role already has a rank",
                        ephemeral: true,
                    });
            }
            let image = "";
            if (img !== "") {
                if (attachIsImage(img)) {
                    image = img;
                } else {
                    return await interaction.reply({
                        content:
                            "This img is invalid (The link must end with jpg/png/webp etc...)\n*Extra hint: If you are using imgur links, you can simply add a .jpg or .png after your url*",
                        ephemeral: true,
                    });
                }
            }
            if (image !== "") {
                image +=
                    "\n*Please note that the image checker is currently extremely basic, if discord did not load the link in this message please remove the rank and try with another url*";
            }
            const newRank = { level: level, role: role.id, img: img };
            data.rankRoles.push(newRank);
            await data.save();
            await client.configs.set(guild.id, data);
            return await interaction.reply(
                `You have set up a rank for level ${level}, the corresponding role is ${role}\n${image}`
            );
        }
        if (subcommand === "remove-rank") {
            const level = options.getInteger("level");
            for (let i = 0; i < data.rankRoles.length; i++) {
                if (level === data.rankRoles[i].level) {
                    data.rankRoles.splice(i, 1);
                    await data.save();
                    await client.configs.set(guild.id, data);
                    return await interaction.reply({
                        content: `You have removed the rank corresponding with the level ${level}`,
                    });
                }
            }
            return await interaction.reply({
                content: `A rank with level ${level} does not exist`,
                ephemeral: true,
            });
        }
        if (subcommand === "commands") {
            const command = options.getString("command");
            if (data.disabledCommands.includes(command)) {
                const index = data.disabledCommands.indexOf(command);
                data.disabledCommands.splice(index, 1);
                await data.save();
                await client.configs.set(guild.id, data);
                await interaction.reply(`You have enabled **${command}** for the entire server`);
                return;
            } else {
                data.disabledCommands.push(command);
                await data.save();
                await client.configs.set(guild.id, data);
                await interaction.reply(`You have disabled **${command}** for the entire server`);
            }
            return;
        }
        interaction.reply({ content: "This command is still being programmed", ephemeral: true });
        return;
    },
};
