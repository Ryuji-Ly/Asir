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
                .setName("set-welcome-channel")
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
        if (subcommand === "set-welcome-channel") {
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
        return;
    },
};
