const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");
const { startTyping } = require("../../utils/typing");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bomb")
        .setDescription('Drop a "bomb"')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("The channel you to drop a bomb in")
                .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) => option.setName("name").setDescription("The name of the bomb")),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        if (user.id !== "348902272534839296")
            return interaction.reply({
                content: "This is a ryujily only command",
                ephemeral: true,
            });
        interaction.reply({ content: "Bomb has been planted", ephemeral: true });
        let channel = options.getChannel("channel");
        if (!channel) channel = interaction.channel;
        const string = options.getString("name");
        startTyping(channel);
        if (string) {
            setTimeout(() => {
                channel.send(string);
            }, 7000);
        }
        return;
    },
};
