const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const guildConfiguration = require("../../models/guildConfiguration");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config1")
        .setDescription("Configuration settings 1")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        //currency name
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set-currency-name")
                .setDescription("Change the currency name")
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription("The name you want to set the currency as")
                        .setRequired(true)
                )
        )
        //welcome channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("welcome-channel-set")
                .setDescription("Set your welcome channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to add")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("welcome-channel-remove")
                .setDescription("Removes your welcome channel")
        )
        //suggestion channels
        .addSubcommand((subcommand) =>
            subcommand
                .setName("suggestions-add")
                .setDescription("Add a channel as suggerstions channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to add")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("suggestions-remove")
                .setDescription("Remove a channel as suggestions channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to remove")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        //report channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("report-channel-set")
                .setDescription("Set a channel as message reports channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to set")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("report-channel-remove")
                .setDescription("Removes the message reports channel")
        )
        //group category
        .addSubcommand((subcommand) =>
            subcommand
                .setName("group-category-set")
                .setDescription("Set the category where group channels will be created")
                .addChannelOption((option) =>
                    option
                        .setName("category")
                        .setDescription("The category you want to set")
                        .addChannelTypes(ChannelType.GuildCategory)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("group-category-remove").setDescription("Removes the group category")
        )
        //modlog channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("modlog-channel-set")
                .setDescription("Set a channel as moderation log channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to set")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("modlog-channel-remove")
                .setDescription("Removes the moderation log channel")
        )
        //member log channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("memberlog-channel-set")
                .setDescription("Set a channel as member log channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to set")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("memberlog-channel-remove")
                .setDescription("Removes the member log channel")
        )
        //message log channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("messagelog-channel-set")
                .setDescription("Set a channel as member log channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to set")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("messagelog-channel-remove")
                .setDescription("Removes the member log channel")
        )
        // voice log channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("voicelog-channel-set")
                .setDescription("Set a channel as voice log channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to set")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("voicelog-channel-remove")
                .setDescription("Removes the voice log channel")
        )
        //ticket channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("ticket-set")
                .setDescription("Setup a ticketing system")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to send the ticket message in")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("ticket-reset").setDescription("Removes the ticketing system")
        ) // level channel
        .addSubcommand((subcommand) =>
            subcommand
                .setName("level-channel-set")
                .setDescription("Set a channel as level channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to set")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("level-channel-remove").setDescription("Removes the level channel")
        )
        // ignored channels
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add-ignored-channel")
                .setDescription("Channels are ignored from logging, exp gain from activity")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to add to the ignored channels")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-ignored-channel")
                .setDescription("Removes a channel from the ignored channels")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel you want to remove from the ignored channels")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const subcommand = options.getSubcommand();
        const data = await guildConfiguration.findOne({ guildId: guild.id });
        if (subcommand === "set-currency-name") {
            if (config.Economy === false) {
                return interaction.reply({
                    content: "The economy function is disabled",
                    ephemeral: true,
                });
            }
            const name = options.getString("name");
            data.currencyName = name;
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have set the currency name to ${name}!`);
        }
        if (subcommand === "welcome-channel-set") {
            const channel = options.getChannel("channel");
            if (data.welcomeChannelId === "") {
                data.welcomeChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your welcome channel!`);
            } else {
                if (data.welcomeChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your welcome channel.`
                    );
                const previousChannel = data.welcomeChannelId;
                data.welcomeChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous welcome channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "welcome-channel-remove") {
            if (data.welcomeChannelId === "")
                return interaction.reply(`You do not have a welcome channel setup.`);
            data.welcomeChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your welcome channel.`);
        }
        if (subcommand === "suggestions-add") {
            const channel = options.getChannel("channel");
            if (data.suggestionChannelIds.includes(channel.id)) {
                await interaction.reply(`${channel} is already a suggestions channel.`);
                return;
            }
            data.suggestionChannelIds.push(channel.id);
            await data.save();
            await client.configs.set(guild.id, data);
            await interaction.reply(`Added ${channel} to suggestion channels.`);
            return;
        }
        if (subcommand === "suggestions-remove") {
            const channel = options.getChannel("channel");
            if (!data.suggestionChannelIds.includes(channel.id)) {
                await interaction.reply(`${channel} is not a suggestion channel.`);
                return;
            }
            data.suggestionChannelIds = data.suggestionChannelIds.filter((id) => id !== channel.id);
            await data.save();
            await client.configs.set(guild.id, data);
            await interaction.reply(`Removed ${channel} from suggestion channels.`);
            return;
        }
        if (subcommand === "report-channel-set") {
            const channel = options.getChannel("channel");
            if (data.reportChannelId === "") {
                data.reportChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have set ${channel} as your message reports channel!`
                );
            } else {
                if (data.reportChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your message reports channel.`
                    );
                const previousChannel = data.reportChannelId;
                data.reportChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous message reports channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "report-channel-remove") {
            if (data.reportChannelId === "")
                return interaction.reply(`You do not have a message reports channel setup.`);
            data.reportChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your message reports channel.`);
        }
        if (subcommand === "group-category-set") {
            if (config.Economy === false) {
                return interaction.reply({
                    content: "The economy function is disabled",
                    ephemeral: true,
                });
            }
            const channel = options.getChannel("category");
            if (data.groupCategoryId === "") {
                data.groupCategoryId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your group category!`);
            } else {
                if (data.groupCategoryId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your group category.`
                    );
                const previousChannel = data.groupCategoryId;
                const prevChannel = interaction.guild.channels.cache.find(
                    (channel) => channel.id === previousChannel
                );
                data.groupCategoryId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous group category #${prevChannel.name} with ${channel}.`
                );
            }
        }
        if (subcommand === "group-category-remove") {
            if (config.Economy === false) {
                return interaction.reply({
                    content: "The economy function is disabled",
                    ephemeral: true,
                });
            }
            if (data.groupCategoryId === "")
                return interaction.reply(`You do not have a group category setup.`);
            data.groupCategoryId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your group category.`);
        }
        if (subcommand === "modlog-channel-set") {
            const channel = options.getChannel("channel");
            if (data.modLogChannelId === "") {
                data.modLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have set ${channel} as your moderation logs channel!`
                );
            } else {
                if (data.modLogChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your moderation logs channel.`
                    );
                const previousChannel = data.modLogChannelId;
                data.modLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous moderation logs channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "modlog-channel-remove") {
            if (data.modLogChannelId === "")
                return interaction.reply(`You do not have a moderation logs channel setup.`);
            data.modLogChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your moderation logs channel.`);
        }
        if (subcommand === "memberlog-channel-set") {
            const channel = options.getChannel("channel");
            if (data.memberLogChannelId === "") {
                data.memberLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your member logs channel!`);
            } else {
                if (data.memberLogChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your member logs channel.`
                    );
                const previousChannel = data.memberLogChannelId;
                data.memberLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous member logs channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "memberlog-channel-remove") {
            if (data.memberLogChannelId === "")
                return interaction.reply(`You do not have a member logs channel setup.`);
            data.memberLogChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your member logs channel.`);
        }
        if (subcommand === "messagelog-channel-set") {
            const channel = options.getChannel("channel");
            if (data.messageLogChannelId === "") {
                data.messageLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your message logs channel!`);
            } else {
                if (data.messageLogChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your message logs channel.`
                    );
                const previousChannel = data.messageLogChannelId;
                data.messageLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous message logs channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "messagelog-channel-remove") {
            if (data.messageLogChannelId === "")
                return interaction.reply(`You do not have a message logs channel setup.`);
            data.messageLogChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your message logs channel.`);
        }
        if (subcommand === "voicelog-channel-set") {
            const channel = options.getChannel("channel");
            if (data.voiceLogChannelId === "") {
                data.voiceLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your voice logs channel!`);
            } else {
                if (data.voiceLogChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your voice logs channel.`
                    );
                const previousChannel = data.voiceLogChannelId;
                data.voiceLogChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous voice logs channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "voicelog-channel-remove") {
            if (data.voiceLogChannelId === "")
                return interaction.reply(`You do not have a voice logs channel setup.`);
            data.voiceLogChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your voice logs channel.`);
        }
        if (subcommand === "ticket-set") {
            const channel = options.getChannel("channel");
            if (data.ticketChannelId === "") {
                data.ticketChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your ticketing channel!`);
            } else {
                if (data.ticketChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your ticketing channel.`
                    );
                const previousChannel = data.ticketChannelId;
                data.ticketChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous ticketing channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "ticket-reset") {
            if (data.ticketChannelId === "")
                return interaction.reply(`You do not have a ticketing system setup.`);
            data.ticketChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your ticketing system.`);
        }
        if (subcommand === "level-channel-set") {
            if (config.Level === false) {
                return interaction.reply({
                    content: "The leveling function is disabled",
                    ephemeral: true,
                });
            }
            const channel = options.getChannel("channel");
            if (data.levelChannelId === "") {
                data.levelChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have set ${channel} as your level channel!`);
            } else {
                if (data.levelChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your level channel.`
                    );
                const previousChannel = data.levelChannelId;
                data.levelChannelId = channel.id;
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(
                    `You have replaced the previous level channel <#${previousChannel}> with ${channel}.`
                );
            }
        }
        if (subcommand === "level-channel-remove") {
            if (config.Level === false) {
                return interaction.reply({
                    content: "The leveling function is disabled",
                    ephemeral: true,
                });
            }
            if (data.levelChannelId === "")
                return interaction.reply(`You do not have a level channel setup.`);
            data.levelChannelId = "";
            await data.save();
            await client.configs.set(guild.id, data);
            return interaction.reply(`You have removed your level channel.`);
        }
        if (subcommand === "add-ignored-channel") {
            const channel = options.getChannel("channel");
            if (!data.ignoredChannelIds.includes(channel.id)) {
                data.ignoredChannelIds.push(channel.id);
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have added ${channel} to your ignored channels!`);
            } else {
                if (data.ignoredChannelIds.includes(channel.id))
                    return interaction.reply(`${channel} is already in the ignored channels.`);
            }
        }
        if (subcommand === "remove-ignored-channel") {
            const channel = options.getChannel("channel");
            if (data.ignoredChannelIds.includes(channel.id)) {
                const index = data.ignoredChannelIds.indexOf(channel.id);
                data.ignoredChannelIds.splice(index, 1);
                await data.save();
                await client.configs.set(guild.id, data);
                return interaction.reply(`You have removed ${channel} from the ignored channels.`);
            }
            return interaction.reply(`This channel is not among the ignored channels`);
        }
        interaction.reply({ content: "This command is still being programmed", ephemeral: true });
        return;
    },
};
