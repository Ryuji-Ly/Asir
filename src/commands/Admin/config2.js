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
        .setName("config-2")
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
        return interaction.reply({
            content: "This command is still being programmed",
            ephemeral: true,
        });
    },
};
