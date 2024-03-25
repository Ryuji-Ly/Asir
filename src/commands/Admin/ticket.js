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
const handleCooldowns = require("../../utils/handleCooldowns");
const TicketModel = require("../../models/ticket");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Setup or disable ticket system")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("setup")
                .setDescription("Setup ticket system")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("Channel to send ticket messages")
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
            subcommand.setName("disable").setDescription("Disable ticket system")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        let cooldown = 0;
        if (config.cooldowns.filter((c) => c.name === interaction.commandName).length > 0) {
            cooldown = config.cooldowns.find((c) => c.name === interaction.commandName).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        const subcommand = options.getSubcommand();
        const channel = options.getChannel("channel");
        const category = options.getChannel("category");
        const role = options.getRole("role");
        if (subcommand === "setup") {
            const ticket = await TicketModel.findOne({
                guildId: guild.id,
            });
            if (ticket) {
                return interaction.reply({
                    content: "Ticket system already setup",
                    ephemeral: true,
                });
            }
            const newTicket = await TicketModel.create({
                guildId: guild.id,
                categoryId: category.id,
                role: role.id,
            });
            await newTicket.save();
            const embed = new EmbedBuilder()
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
            await channel.send({ embeds: [embed], components: [row] });
            return interaction.reply({
                content: `Ticket system setup successfully in ${channel}, tickets will be created in ${category}.\n${role} will get pinged for new tickets and can manage them.`,
                ephemeral: true,
            });
        }
        if (subcommand === "disable") {
            const ticket = await TicketModel.findOne({
                guildId: guild.id,
            });
            if (!ticket) {
                return interaction.reply({
                    content: "Ticket system not setup",
                    ephemeral: true,
                });
            }
            await TicketModel.findOneAndDelete({
                guildId: guild.id,
            });
            return interaction.reply({
                content: "Ticket system disabled",
                ephemeral: true,
            });
        }
        return;
    },
};
