const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("configure-commands")
        .setDescription(
            "Configure the commands for your server. (Too many subcommands in configure...)"
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("disable")
                .setDescription("Disable a command")
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command to disable")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("enable")
                .setDescription("Enable a command")
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command to enable")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add-blacklisted-user")
                .setDescription("Blacklisted users are blocked from using all commands")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to blacklist")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-blacklisted-user")
                .setDescription("Removes a user from the blacklist")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want remove from the blacklist")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("blacklist-user-command")
                .setDescription("Disables/enables a command for a user")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user from who you want to disable/enable a command")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command you want to disable/enable for the user")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add-blacklisted-channel")
                .setDescription("Specified commands cannot be used in these channels")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to restrict commands")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command you want to disable")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove-blacklisted-channel")
                .setDescription("Remove a restricted command from a channel")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to remove the command from")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command you want to enable")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("cooldown")
                .setDescription("Set or change the cooldown of a command")
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("The command you want to change the cooldown of")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("seconds")
                        .setDescription("How many seconds the cooldown should be")
                        .setMinValue(0)
                        .setMaxValue(59)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("minutes")
                        .setDescription("How many minutes the cooldown should be")
                        .setMinValue(0)
                        .setMaxValue(59)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("hours")
                        .setDescription("How many hours the cooldown should be")
                        .setMinValue(0)
                        .setMaxValue(23)
                )
                .addIntegerOption((option) =>
                    option
                        .setName("days")
                        .setDescription("How many days the cooldown should be")
                        .setMinValue(0)
                        .setMaxValue(365)
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
        if (subcommand === "disable") {
            const command = options.getString("command");
            return;
        }
        if (subcommand === "enable") {
            const command = options.getString("command");
            return;
        }
        if (subcommand === "add-blacklisted-user") {
            const user = options.getUser("user");
            return;
        }
        if (subcommand === "remove-blacklisted-user") {
            const user = options.getUser("user");
            return;
        }
        if (subcommand === "blacklist-user-command") {
            const user = options.getUser("user");
            const command = options.getString("command");
            return;
        }
        if (subcommand === "add-blacklisted-channel") {
            const channel = options.getChannel("channel");
            const command = options.getString("command");
            return;
        }
        if (subcommand === "remove-blacklisted-channel") {
            const channel = options.getChannel("channel");
            const command = options.getString("command");
            return;
        }
        if (subcommand === "cooldown") {
            const command = options.getString("command");
            const seconds = options.getInteger("seconds");
            const minutes = options.getInteger("minutes");
            const hours = options.getInteger("hours");
            const days = options.getInteger("days");

            return;
        }
        return;
    },
};
