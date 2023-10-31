const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const guildConfiguration = require("../../models/guildConfiguration");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklisted users are blocked from using all commands")
        .addSubcommand((addSubcommand) =>
            addSubcommand
                .setName("add")
                .setDescription("Adds a user to the blacklist")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to blacklist")
                        .setRequired(true)
                )
        )
        .addSubcommand((addSubcommand) =>
            addSubcommand
                .setName("remove")
                .setDescription("Removes a user from the blacklist")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want remove from the blacklist")
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser("user");
        if (user.bot) return interaction.reply({ content: "This is a bot", ephemeral: true });
        const data = await guildConfiguration.findOne({ guildId: interaction.guild.id });
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === "add") {
            if (user.id === interaction.user.id) {
                return interaction.reply({
                    content: "You cannot blacklist yourself",
                    ephemeral: true,
                });
            }
            if (user.id === interaction.guild.ownerId) {
                return interaction.reply({
                    content: "You cannot blacklist the owner",
                    ephemeral: true,
                });
            }
            if (data.blacklist.includes(user.id)) {
                return interaction.reply({
                    content: "This user is already in the blacklist",
                    ephemeral: true,
                });
            }
            data.blacklist.push(user.id);
            await data.save();
            let blacklisted = "";
            for (let i = 0; i < data.blacklist.length; i++) {
                blacklisted += `<@${data.blacklist[i]}>`;
            }
            const embed = new EmbedBuilder()
                .setTitle(`${user.username} has been blacklisted from all commands`)
                .setColor("Blurple")
                .setDescription(`This servers blacklisted members are: ${blacklisted}`);
            await interaction.reply({ embeds: [embed] });
            return;
        }
        if (subcommand === "remove") {
            if (!data.blacklist.includes(user.id)) {
                return interaction.reply({
                    content: "This user is not blacklisted",
                    ephemeral: true,
                });
            }
            const index = data.blacklist.indexOf(user.id);
            data.blacklist.splice(index, 1);
            await data.save();
            let blacklisted = "";
            for (let i = 0; i < data.blacklist.length; i++) {
                blacklisted += `<@${data.blacklist[i]}>`;
            }
            const embed = new EmbedBuilder()
                .setTitle(`${user.username} has been removed from the blacklist`)
                .setColor("Blurple")
                .setDescription(`This servers blacklisted members are: ${blacklisted}`);
            await interaction.reply({ embeds: [embed] });
            return;
        }
    },
};
