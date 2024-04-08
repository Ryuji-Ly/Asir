const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const GuildConfig = require("../../models/guildConfiguration");
const ServerConfig = require("../../models/serverConfigs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("configure")
        .setDescription("Change all the configurations for the bot")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommandGroup((group) =>
            group
                .setName("channels")
                .setDescription("Setup and configure channels for the bot")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-welcome")
                        .setDescription("Setup the welcome channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send welcome messages")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-welcome")
                        .setDescription("Disable the welcome channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("suggestions-add")
                        .setDescription("Add a suggestions channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to add")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("suggestions-remove")
                        .setDescription("Remove a suggestions channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to remove")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-report")
                        .setDescription(
                            "Set the report channel, reported messages will be sent here."
                        )
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send reports")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-report")
                        .setDescription("Disable the report channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-moderation-logs")
                        .setDescription("Set the moderation logs channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send moderation logs")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-moderation-logs")
                        .setDescription("Disable the moderation logs channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-member-logs")
                        .setDescription("Set the member logs channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send member logs")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-member-logs")
                        .setDescription("Disable the member logs channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-message-logs")
                        .setDescription("Set the message logs channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send join logs")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-message-logs")
                        .setDescription("Disable the message logs channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-voice-logs")
                        .setDescription("Set the join logs channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send join logs")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-voice-logs")
                        .setDescription("Disable the voice logs channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-ticket")
                        .setDescription("Setup the ticket channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send the ticket message in")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                        .addChannelOption((option) =>
                            option
                                .setName("category")
                                .setDescription("Category to create ticket channels")
                                .addChannelTypes(ChannelType.GuildCategory)
                                .setRequired(true)
                        )
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("Staff role to access and manage tickets")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName("disable-ticket").setDescription("Disable the ticket system")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-level")
                        .setDescription(
                            "Set the level up channel, level up messages are sent here."
                        )
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to send level up messages")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("disable-level")
                        .setDescription("Disable the level up channel")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("add-restricted")
                        .setDescription("Commands cannot be used in these channels")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to restrict commands")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("remove-restricted")
                        .setDescription("Remove a restricted channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to remove from restricted")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("add-blacklisted")
                        .setDescription(
                            "Blacklisted channels do not gain any xp, currency and cannot use commands."
                        )
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to blacklist")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("remove-blacklisted")
                        .setDescription("Remove a blacklisted channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to remove from blacklisted")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("add-minigame")
                        .setDescription(
                            "If there are any channels added, all minigames will be disabled except for the added channels."
                        )
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to add to minigames")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("remove-minigame")
                        .setDescription("Remove a minigame channel")
                        .addChannelOption((option) =>
                            option
                                .setName("channel")
                                .setDescription("The channel to remove from minigames")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName("moderation")
                .setDescription("Setup and configure moderation and log settings")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-warn-limit")
                        .setDescription(
                            "Set the warn limit, if a user reaches this limit they will be timed out."
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("limit")
                                .setDescription("The warn limit")
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
                                .setDescription("How many minutes")
                                .setRequired(true)
                                .setMinValue(0)
                                .setMaxValue(59)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("hours")
                                .setDescription("How many hours")
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
                                .setDescription(
                                    "Enable/disable logging moving between voice channels"
                                )
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
                                .setDescription(
                                    "The word you want to remove from blacklisted words"
                                )
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName("level")
                .setDescription("Setup and configure level settings")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("toggle")
                        .setDescription("Enable/Disable the leveling system")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("experience-gain")
                        .setDescription(
                            "Set the minimum and maximum experience gain per message per time"
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("min")
                                .setDescription("The minimum experience gain")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("max")
                                .setDescription("The maximum experience gain")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("time")
                                .setDescription("The time in seconds between experience gain")
                                .setMinValue(1)
                                .setMaxValue(60)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("experience-requirement")
                        .setDescription("The base experience required to level up")
                        .addIntegerOption((option) =>
                            option
                                .setName("base")
                                .setDescription("The base experience required to level up")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("experience-scaling")
                        .setDescription("Choose the scaling type")
                        .addStringOption((option) =>
                            option
                                .setName("types")
                                .setDescription("The scaling types")
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
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-rank")
                        .setDescription(
                            "Add ranks for specific levels, images are optional, can also reward roles."
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("level")
                                .setDescription("At which level a user gains this rank")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("rank-up-message")
                                .setDescription(
                                    "The message to send when a user ranks up. Use {user}, {rank} and {level} as placeholders."
                                )
                                .setRequired(true)
                        )
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("The role a user gets when achieving the rank")
                        )
                        .addStringOption((option) =>
                            option.setName("img-url").setDescription("Provide a valid img url link")
                        )
                        .addAttachmentOption((option) =>
                            option
                                .setName("img-attachment")
                                .setDescription("Provide a valid img attachment")
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("remove-rank")
                        .setDescription("Remove a rank")
                        .addIntegerOption((option) =>
                            option
                                .setName("level")
                                .setDescription("The level of the rank you want to remove")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("toggle-multiplier")
                        .setDescription(
                            "Enable/Disable the multiplier system for leveling. (Multiplier must be enabled in economy)"
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("set-level-message")
                        .setDescription("Set the level up message")
                        .addStringOption((option) =>
                            option
                                .setName("message")
                                .setDescription("The message to send when a user levels up")
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName("economy")
                .setDescription("Setup and configure economy settings")
                .addSubcommand((subcommand) =>
                    subcommand.setName("toggle").setDescription("Enable/Disable the economy system")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("currency-name")
                        .setDescription("Change the name of the currency")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("The name of the currency")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("currency-symbol")
                        .setDescription("Change the symbol of the currency")
                        .addStringOption((option) =>
                            option
                                .setName("symbol")
                                .setDescription("The symbol of the currency")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("currency-gain")
                        .setDescription(
                            "Change the minimum and maximum currency gain per message per time"
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("min")
                                .setDescription("The minimum currency gain")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("max")
                                .setDescription("The maximum currency gain")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("time")
                                .setDescription("The time in seconds between currency gain")
                                .setMinValue(1)
                                .setMaxValue(60)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("starting-balance")
                        .setDescription("Set the starting balance for new users")
                        .addIntegerOption((option) =>
                            option
                                .setName("amount")
                                .setDescription("The starting balance for new users")
                                .setMinValue(0)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("daily-reward")
                        .setDescription("Set the daily reward amount, can set min and max.")
                        .addIntegerOption((option) =>
                            option
                                .setName("min")
                                .setDescription("The daily reward amount")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("max")
                                .setDescription("The daily reward amount")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("coinflip")
                        .setDescription("Set the base reward for coinflip")
                        .addIntegerOption((option) =>
                            option
                                .setName("amount")
                                .setDescription("The base reward for coinflip")
                                .setMinValue(0)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("minigame")
                        .setDescription("Set the base reward for minigames")
                        .addIntegerOption((option) =>
                            option
                                .setName("amount")
                                .setDescription("The base reward for minigames")
                                .setMinValue(0)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("toggle-multiplier")
                        .setDescription("Enable/Disable the multiplier system for currency.")
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("configure-multiplier")
                        .setDescription("All configuration settings for the multiplier")
                        .addIntegerOption((option) =>
                            option
                                .setName("base-cost")
                                .setDescription("The base cost to buy the multiplier")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addNumberOption((option) =>
                            option
                                .setName("multiplier-increase")
                                .setDescription("The increase in multiplier per purchase")
                                .setRequired(true)
                                .setMinValue(0.1)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("cost-scaling")
                                .setDescription("The cost scaling for the multiplier")
                                .setRequired(true)
                                .addChoices(
                                    {
                                        name: "Constant, cost remains the same",
                                        value: "constant",
                                    },
                                    {
                                        name: "Multiply, cost is multiplied by current multiplier",
                                        value: "multiply",
                                    },
                                    {
                                        name: "Exponential, cost is multiplied by current multiplier squared",
                                        value: "exponential",
                                    }
                                )
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("max-multiplier")
                                .setDescription("The highest multiplier a user can have")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("toggle-custom-roles")
                        .setDescription("Enable/Disable custom roles")
                        .addBooleanOption((option) =>
                            option
                                .setName("toggle")
                                .setDescription("Enable/disable custom roles")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("configure-custom-roles")
                        .setDescription("Configure custom role settings")
                        .addIntegerOption((option) =>
                            option
                                .setName("cost")
                                .setDescription("The cost of the custom role")
                                .setMinValue(0)
                                .setRequired(true)
                        )
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("The role to create custom roles under")
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("limit")
                                .setDescription(
                                    "The maximum amount of custom roles a user can have"
                                )
                                .setMinValue(1)
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("add-shop-role")
                        .setDescription("Configure custom roles for users to buy")
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("The role you want to add")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("description")
                                .setDescription("The description of the role")
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("cost")
                                .setDescription("The cost of the role")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("add-shop-item")
                        .setDescription("Add an item to the shop")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("The name of the item")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("description")
                                .setDescription("The description of the item")
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("price")
                                .setDescription("The price of the item")
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option.setName("img-url").setDescription("Provide a valid img url link")
                        )
                        .addAttachmentOption((option) =>
                            option
                                .setName("img-attachment")
                                .setDescription("Provide a valid img attachment")
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("remove-shop-item")
                        .setDescription("Remove an item from the shop")
                        .addStringOption((option) =>
                            option
                                .setName("name")
                                .setDescription("The name of the item")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("remove-shop-role")
                        .setDescription("Remove a role from the shop")
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("The role you want to remove")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("toggle-groups")
                        .setDescription("Enable/Disable the group system")
                        .addBooleanOption((option) =>
                            option
                                .setName("toggle")
                                .setDescription("Enable/disable groups")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("configure-groups")
                        .setDescription("Groups must be enabled. Configure the group settings")
                        .addStringOption((option) =>
                            option
                                .setName("group-name")
                                .setDescription(
                                    'What groups are called, e.g: "Clans", "Teams", "Factions", etc.'
                                )
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("base-cost")
                                .setDescription("The cost of the group")
                                .setMinValue(0)
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("base-user-limit")
                                .setDescription("The base user limit of the group")
                                .setMinValue(2)
                                .setRequired(true)
                        )
                        .addBooleanOption((option) =>
                            option
                                .setName("toggle-group-multiplier")
                                .setDescription("Enable/Disable the multiplier system for groups.")
                                .setRequired(true)
                        )
                        .addIntegerOption((option) =>
                            option
                                .setName("base-multiplier-cost")
                                .setDescription("The base cost to buy the multiplier")
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addNumberOption((option) =>
                            option
                                .setName("multiplier-increase")
                                .setDescription("The increase in multiplier per purchase")
                                .setRequired(true)
                                .setMinValue(0.1)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("cost-scaling")
                                .setDescription("The cost scaling for all group-related purchases")
                                .setRequired(true)
                                .addChoices(
                                    {
                                        name: "Constant, cost remains the same",
                                        value: "constant",
                                    },
                                    {
                                        name: "Multiply, cost is multiplied by current number of purchaces/multiplier",
                                        value: "multiply",
                                    },
                                    {
                                        name: "Exponential, cost is multiplied by current number of purchases/multiplier squared",
                                        value: "exponential",
                                    }
                                )
                        )
                        .addChannelOption((option) =>
                            option
                                .setName("category")
                                .setDescription("The category to create group channels in")
                                .addChannelTypes(ChannelType.GuildCategory)
                                .setRequired(true)
                        )
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("The role to create group roles under")
                                .setRequired(true)
                        )
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
        const subcommandGroup = options.getSubcommandGroup();
        const subcommand = options.getSubcommand();
        const configData = await ServerConfig.findOne({ guildId: guild.id });
        await interaction.deferReply();
        const filter = { guildId: guild.id };
        if (subcommandGroup === "channels") {
            if (subcommand === "set-welcome") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "welcome" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Welcome Channel Set")
                        .setDescription(`Welcome channel set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the welcome channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "disable-welcome") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "welcome" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Welcome Channel Disabled")
                        .setDescription("Welcome channel has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while disabling the welcome channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "suggestions-add") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $push: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "suggestions" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Suggestions Channel added")
                        .setDescription(`Added ${channel} to suggestions channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while adding the suggestions channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
                return;
            }
            if (subcommand === "suggestions-remove") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $pull: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "suggestions" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Suggestions Channel removed")
                        .setDescription(`Removed ${channel} from suggestions channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while removing the suggestions channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-report") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "report" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Report Channel Set")
                        .setDescription(`Report channel set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the report channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "disable-report") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "report" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Report Channel Disabled")
                        .setDescription("Report channel has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while disabling the report channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-moderation-logs") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "modLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Moderation Logs Channel Set")
                        .setDescription(`Moderation logs channel set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(
                            "An error occurred while setting the moderation logs channel"
                        )
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "disable-moderation-logs") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "modLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Moderation Logs Channel Disabled")
                        .setDescription("Moderation logs channel has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(
                            "An error occurred while disabling the moderation logs channel"
                        )
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
                return;
            }
            if (subcommand === "set-member-logs") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "memberLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Member Logs Channel Set")
                        .setDescription(`Member logs channel set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the member logs channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "disable-member-logs") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "memberLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Member Logs Channel Disabled")
                        .setDescription("Member logs channel has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while disabling the member logs channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
                return;
            }
            if (subcommand === "set-message-logs") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "messageLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Message Logs Channel Set")
                        .setDescription(`Message logs channel set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the message logs channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
                return;
            }
            if (subcommand === "disable-message-logs") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "messageLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Message Logs Channel Disabled")
                        .setDescription("Message logs channel has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(
                            "An error occurred while disabling the message logs channel"
                        )
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
                return;
            }
            if (subcommand === "set-voice-logs") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "voiceLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Voice Logs Channel Set")
                        .setDescription(`Voice logs channel set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the voice logs channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
                return;
            }
            if (subcommand === "disable-voice-logs") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "voiceLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Voice Logs Channel Disabled")
                        .setDescription("Voice logs channel has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while disabling the voice logs channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-ticket") {
                const channel = options.getChannel("channel");
                const category = options.getChannel("category");
                const role = options.getRole("role");
                const array = [
                    { name: "channel", value: channel.id },
                    { name: "category", value: category.id },
                    { name: "role", value: role.id },
                ];
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": array } },
                    { arrayFilters: [{ "elem.name": "ticket" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Ticket System Set")
                        .setDescription(`Ticket system set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    const ticketEmbed = new EmbedBuilder()
                        .setTitle("Ticket System")
                        .setDescription(
                            `Click the button to create a ticket!\nGeneral support for suggestions, questions, reports, etc. Please open a **ticket** with the button below!`
                        )
                        .setColor("Purple");
                    const button = new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId("ticket-button")
                        .setLabel("Create Ticket")
                        .setEmoji("<:MafuyuWhat:1162493558180298893>");
                    const row = new ActionRowBuilder().setComponents(button);
                    await channel.send({ embeds: [ticketEmbed], components: [row] });
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the ticket system")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "disable-ticket") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": [] } },
                    { arrayFilters: [{ "elem.name": "ticket" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Ticket System Disabled")
                        .setDescription("Ticket system has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while disabling the ticket system")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-level") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "level" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Level System Set")
                        .setDescription(`Level system set to ${channel}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the level system")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "disable-level") {
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "channels.$[elem].value": "" } },
                    { arrayFilters: [{ "elem.name": "level" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Level System Disabled")
                        .setDescription("Level system has been disabled")
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while disabling the level system")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "add-restricted") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $push: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "restricted" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Restricted Channel added")
                        .setDescription(`Added ${channel} to restricted channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while adding the restricted channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "remove-restricted") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $pull: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "restricted" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Restricted Channel removed")
                        .setDescription(`Removed ${channel} from restricted channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while removing the restricted channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "add-blacklisted") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $push: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "blacklisted" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Blacklisted Channel added")
                        .setDescription(`Added ${channel} to blacklisted channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while adding the blacklisted channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "remove-blacklisted") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $pull: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "blacklisted" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Blacklisted Channel removed")
                        .setDescription(`Removed ${channel} from blacklisted channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while removing the blacklisted channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "add-minigame") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $push: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "minigame" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Minigame Channel added")
                        .setDescription(`Added ${channel} to minigame channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while adding the minigame channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "remove-minigame") {
                const channel = options.getChannel("channel");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $pull: { "channels.$[elem].value": channel.id } },
                    { arrayFilters: [{ "elem.name": "minigame" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Minigame Channel removed")
                        .setDescription(`Removed ${channel} from minigame channels`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while removing the minigame channel")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
        }
        if (subcommandGroup === "moderation") {
            if (subcommand === "set-warn-limit") {
                const limit = options.getInteger("limit");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "moderation.$[elem].value": limit } },
                    { arrayFilters: [{ "elem.name": "warnLimit" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Warn Limit Set")
                        .setDescription(`Warn limit set to ${limit}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the warn limit")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-timeout-duration") {
                const minutes = options.getInteger("minutes");
                const hours = options.getInteger("hours");
                const convertedMiliseconds = minutes * 60000 + hours * 3600000;
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "moderation.$[elem].value": convertedMiliseconds } },
                    { arrayFilters: [{ "elem.name": "timeoutDuration" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Timeout Duration Set")
                        .setDescription(
                            `Timeout duration set to ${hours} hours and ${minutes} minutes`
                        )
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the timeout duration")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-mod-logs") {
                const warn = options.getBoolean("warn");
                const timeout = options.getBoolean("timeout");
                const kick = options.getBoolean("kick");
                const ban = options.getBoolean("ban");
                const array = [
                    { name: "warn", value: warn },
                    { name: "timeout", value: timeout },
                    { name: "kick", value: kick },
                    { name: "ban", value: ban },
                ];
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "moderation.$[elem].value": array } },
                    { arrayFilters: [{ "elem.name": "modLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Moderation Logs Set")
                        .setDescription(`Moderation logs set to ${array}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the moderation logs")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-member-logs") {
                const role = options.getBoolean("role");
                const name = options.getBoolean("name");
                const avatar = options.getBoolean("avatar");
                const array = [
                    { name: "role", value: role },
                    { name: "name", value: name },
                    { name: "avatar", value: avatar },
                ];
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "moderation.$[elem].value": array } },
                    { arrayFilters: [{ "elem.name": "memberLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Member Logs Set")
                        .setDescription(`Member logs set to ${array}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the member logs")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-message-logs") {
                const deleted = options.getBoolean("deleted");
                const edited = options.getBoolean("edited");
                const purged = options.getBoolean("purged");
                const array = [
                    { name: "deleted", value: deleted },
                    { name: "edited", value: edited },
                    { name: "purged", value: purged },
                ];
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "moderation.$[elem].value": array } },
                    { arrayFilters: [{ "elem.name": "messageLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Message Logs Set")
                        .setDescription(`Message logs set to ${array}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the message logs")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-voice-logs") {
                const join = options.getBoolean("join");
                const move = options.getBoolean("move");
                const leave = options.getBoolean("leave");
                const array = [
                    { name: "join", value: join },
                    { name: "move", value: move },
                    { name: "leave", value: leave },
                ];
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "moderation.$[elem].value": array } },
                    { arrayFilters: [{ "elem.name": "voiceLog" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Voice Logs Set")
                        .setDescription(`Voice logs set to ${array}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the voice logs")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "add-blacklisted-word") {
                const word = options.getString("word");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $push: { "moderation.$[elem].value": word } },
                    { arrayFilters: [{ "elem.name": "blacklistedWords" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Blacklisted Word Added")
                        .setDescription(`Added ${word} to blacklisted words`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while adding the blacklisted word")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "remove-blacklisted-word") {
                const word = options.getString("word");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $pull: { "moderation.$[elem].value": word } },
                    { arrayFilters: [{ "elem.name": "blacklistedWords" }], new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Blacklisted Word Removed")
                        .setDescription(`Removed ${word} from blacklisted words`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while removing the blacklisted word")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
        }
        if (subcommandGroup === "level") {
            if (subcommand === "toggle") {
                const toggle = options.getBoolean("toggle");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "level.0.enabled": toggle } },
                    { new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Level System Toggled")
                        .setDescription(`Level system has been toggled to ${toggle}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while toggling the level system")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "experience-gain") {
                const min = options.getInteger("min");
                const max = options.getInteger("max");
                const time = options.getInteger("time");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    {
                        $set: {
                            "level.1.xpGainMin": min,
                            "level.2.xpGainMax": max,
                            "level.3.xpGainTime": time,
                        },
                    },
                    { new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Experience Gain Set")
                        .setDescription(
                            `Experience gain set to min: ${min}, max: ${max}, time: ${time}`
                        )
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the experience gain")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "experience-requirement") {
                const base = options.getInteger("base");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "level.4.xpBaseRequirement": base } },
                    { new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Experience Requirement Set")
                        .setDescription(`Experience requirement set to ${base}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(
                            "An error occurred while setting the experience requirement"
                        )
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "experience-scaling") {
                const types = options.getString("types");
                const update = await ServerConfig.findOneAndUpdate(
                    filter,
                    { $set: { "level.5.xpScaling": types } },
                    { new: true }
                );
                if (update) {
                    const embed = new EmbedBuilder()
                        .setTitle("Experience Scaling Set")
                        .setDescription(`Experience scaling set to ${types}`)
                        .setColor("Green")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("An error occurred while setting the experience scaling")
                        .setColor("Red")
                        .setTimestamp();
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            if (subcommand === "set-rank") {
                const level = options.getInteger("level");
                const rankUpMessage = options.getString("rank-up-message");
                const role = options.getRole("role");
                const imgURL = options.getString("img-url");
                const imgAttachment = options.getAttachment("img-attachment");
                return;
            }
            if (subcommand === "remove-rank") {
                const level = options.getInteger("level");
                return;
            }
            if (subcommand === "toggle-multiplier") {
                const toggle = options.getBoolean("toggle");
                return;
            }
            if (subcommand === "set-level-message") {
                const message = options.getString("message");
                return;
            }
        }
        if (subcommandGroup === "economy") {
            if (subcommand === "toggle") {
                const toggle = options.getBoolean("toggle");
                return;
            }
            if (subcommand === "currency-name") {
                const name = options.getString("name");
                return;
            }
            if (subcommand === "currency-symbol") {
                const symbol = options.getString("symbol");
                return;
            }
            if (subcommand === "currency-gain") {
                const min = options.getInteger("min");
                const max = options.getInteger("max");
                const time = options.getInteger("time");
                return;
            }
            if (subcommand === "starting-balance") {
                const amount = options.getInteger("amount");
                return;
            }
            if (subcommand === "daily-reward") {
                const min = options.getInteger("min");
                const max = options.getInteger("max");
                return;
            }
            if (subcommand === "coinflip") {
                const amount = options.getInteger("amount");
                return;
            }
            if (subcommand === "minigame") {
                const amount = options.getInteger("amount");
                return;
            }
            if (subcommand === "toggle-multiplier") {
                const toggle = options.getBoolean("toggle");
                return;
            }
            if (subcommand === "configure-multiplier") {
                const baseCost = options.getInteger("base-cost");
                const multiplierIncrease = options.getNumber("multiplier-increase");
                const costScaling = options.getString("cost-scaling");
                const maxMultiplier = options.getInteger("max-multiplier");
                return;
            }
            if (subcommand === "toggle-custom-roles") {
                const toggle = options.getBoolean("toggle");
                return;
            }
            if (subcommand === "configure-custom-roles") {
                const cost = options.getInteger("cost");
                const role = options.getRole("role");
                const limit = options.getInteger("limit");
                return;
            }
            if (subcommand === "add-shop-role") {
                const role = options.getRole("role");
                const description = options.getString("description");
                const cost = options.getInteger("cost");
                return;
            }
            if (subcommand === "add-shop-item") {
                const name = options.getString("name");
                const description = options.getString("description");
                const price = options.getInteger("price");
                const imgURL = options.getString("img-url");
                const imgAttachment = options.getAttachment("img-attachment");
                return;
            }
            if (subcommand === "remove-shop-item") {
                const name = options.getString("name");
                return;
            }
            if (subcommand === "remove-shop-role") {
                const role = options.getRole("role");
                return;
            }
            if (subcommand === "toggle-groups") {
                const toggle = options.getBoolean("toggle");
                return;
            }
            if (subcommand === "configure-groups") {
                const groupName = options.getString("group-name");
                const baseCost = options.getInteger("base-cost");
                const baseUserLimit = options.getInteger("base-user-limit");
                const toggleGroupMultiplier = options.getBoolean("toggle-group-multiplier");
                const baseMultiplierCost = options.getInteger("base-multiplier-cost");
                const multiplierIncrease = options.getNumber("multiplier-increase");
                const costScaling = options.getString("cost-scaling");
                const category = options.getChannel("category");
                const role = options.getRole("role");
                return;
            }
        }

        return;
    },
};
