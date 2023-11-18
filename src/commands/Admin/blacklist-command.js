const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
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
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const target = options.getUser("user");
        const command = options.getString("command");
        if (target.id === user.id)
            return interaction.reply({
                content: `You cannot blacklist commands for yourself`,
                ephemeral: true,
            });
        if (target.bot) return interaction.reply({ content: `This is a bot`, ephemeral: true });
        const data = await ProfileModel.findOne({ guildId: guild.id, userId: target.id });
        if (data.blacklistedCommands.includes(command)) {
            const index = data.blacklistedCommands.indexOf(command);
            data.blacklistedCommands.splice(index, 1);
            await data.save();
            return interaction.reply({
                content: `You have enabled **${command}** and all it's subcommands for ${target}`,
            });
        } else {
            data.blacklistedCommands.push(command);
            await data.save();
            return interaction.reply({
                content: `You have disabled **${command}** and all it's subcommands for ${target}`,
            });
        }
    },
};
