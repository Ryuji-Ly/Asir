const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");
const guildConfiguration = require("../../models/guildConfiguration");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("All configure settings")
        .setDMPermission(false)
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
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const subcommand = options.getSubcommand();
        const data = await guildConfiguration.findOne({ guildId: guild.id });
        if (subcommand === "welcome-channel-set") {
            const channel = options.getChannel("channel");
            if (data.welcomeChannelId === "") {
                data.welcomeChannelId = channel.id;
                await data.save();
                return interaction.reply(`You have set ${channel} as your welcome channel!`);
            } else {
                if (data.welcomeChannelId === channel.id)
                    return interaction.reply(
                        `${channel} is already configured as your welcome channel.`
                    );
                const previousChannel = data.welcomeChannelId;
                data.welcomeChannelId = channel.id;
                await data.save();
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
            await interaction.reply(`Removed ${channel} from suggestion channels.`);
            return;
        }
        if (subcommand === "report-channel-set") {
            const channel = options.getChannel("channel");
            if (data.reportChannelId === "") {
                data.reportChannelId = channel.id;
                await data.save();
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
            return interaction.reply(`You have removed your message reports channel.`);
        }
        return;
    },
};