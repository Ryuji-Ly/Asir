const {
    Interaction,
    PermissionFlagsBits,
    WebhookClient,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ActionRowBuilder,
} = require("discord.js");
const ProfileModel = require("../models/profileSchema");
const whitelist = ["348902272534839296"];
const TicketModel = require("../models/ticket");
var colors = require("colors");
colors.enable();
const mapTypes = {
    plains: 0,
    lake: 1,
    mansion: 2,
    forest: 3,
    treasureChest: 4,
    cave: 5,
    tower: 6,
    portal: 7,
    healingFountain: 8,
    cartographerDesk: 9,
    enchantedGarden: 10,
};
const items = [
    { name: "Sword", value: 0 },
    { name: "Bow", value: 1 },
    { name: "Shield", value: 2 },
    { name: "Binoculors", value: 3 },
    { name: "Trap Disarm Kit", value: 4 },
    { name: "Medical Kit", value: 5 },
    { name: "Terrain Changer Orb", value: 6 },
    { name: "Terrain Destroyer Crystal", value: 7 },
    { name: "Terrain Swapper Amulet", value: 8 },
    { name: "Map", value: 9 },
    { name: "Divine Intervention Scroll", value: 10 },
    { name: "Serenity Pearl", value: 11 },
    { name: "Revenge Rune", value: 12 },
    { name: "Divine Shield", value: 13 },
    { name: "Lifesteal Dagger", value: 14 },
    { name: "Fate Shifter Amulet", value: 15 },
    { name: "Celestial Beacon", value: 16 },
    { name: "Phoenix Feather", value: 17 },
];

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {Interaction} interaction
     * @param {*} client
     * @returns
     */
    async execute(interaction, client) {
        if (!interaction.inGuild())
            return interaction.reply({
                content: "You cannot use commands outside of servers.",
                ephemeral: true,
            });
        const config = await client.configs.get(interaction.guild.id);
        const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
        // //Forever buttons
        // try {
        //     if (interaction.isButton()) {
        //         //
        //     }
        // } catch (error) {
        //     console.log(`[INTERACTION CREATE] Error with buttons ${error}`.red);
        // }
        // Ticket system
        try {
            if (interaction.isButton() && interaction.customId === "ticket-button") {
                const checkChannel = await interaction.guild.channels.cache.find(
                    (c) => c.name === `ticket-${interaction.user.id}`
                );
                if (checkChannel) {
                    return interaction.reply({
                        content: "You already have a ticket open",
                        ephemeral: true,
                    });
                }
                const data = await TicketModel.findOne({ guildId: interaction.guild.id });
                if (!data) {
                    return interaction.reply({
                        content: "Ticket system is not setup",
                        ephemeral: true,
                    });
                }
                const categoryId = data.categoryId;
                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`Ticket for ${interaction.user.username}`)
                    .setDescription(
                        `Please describe your issue or question in detail. Staff will be with you shortly.`
                    );
                const button = new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Close Ticket")
                    .setCustomId("close-ticket");
                const row = new ActionRowBuilder().setComponents(button);
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                        },
                        {
                            id: data.role,
                            allow: ["ViewChannel", "ManageChannels"],
                        },
                    ],
                });
                const msg = await channel.send({
                    content: `<@&${data.role}>`,
                    embeds: [embed],
                    components: [row],
                });
                await interaction.reply({
                    content: `Your ticket is now open in ${channel}`,
                    ephemeral: true,
                });
                const collector = msg.createMessageComponentCollector();
                collector.on("collect", async (i) => {
                    if (i.customId === "close-ticket") {
                        const userId = i.channel.name.split("-")[1];
                        await channel.delete();
                        const dmEmbed = new EmbedBuilder()
                            .setColor("Blue")
                            .setTitle("Ticket Closed")
                            .setTimestamp()
                            .setDescription(
                                "Thank you for contacting our staff team! If you need further assistance, please open another ticket."
                            );
                        const member = await interaction.guild.members.fetch(userId);
                        await member.send({ embeds: [dmEmbed] }).catch((err) => {
                            return;
                        });
                    }
                });
            }
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[INTERACTION CREATE]` })
                .setDescription(
                    `\`\`\`ansi\n[0;31m[INTERACTION CREATE] Error with ticket system ${error.stack}\`\`\``
                );
            webhookClient.send({ embeds: [embed] }).catch((e) => {
                console.log(`[INTERACTION CREATE] Webhook failed to send`.red);
            });
            console.log(`[INTERACTION CREATE] Error with ticket system ${error.stack}`.red);
        }
        //autocomplete options
        try {
            if (interaction.isAutocomplete()) {
                if (interaction.commandName === "blacklist-user-command") {
                    const array = [...client.commands.values()];
                    const focusedValue = interaction.options.getFocused();
                    const filterdChoises = array.filter((command) =>
                        command.data.name.toLowerCase().startsWith(focusedValue.toLowerCase())
                    );
                    const results = filterdChoises.map((choice) => {
                        return {
                            name: `${choice.data.name}`,
                            value: `${choice.data.name}`,
                        };
                    });
                    interaction.respond(results.slice(0, 25)).catch(() => {});
                    return;
                }
                if (interaction.commandName === "config2") {
                    const subcommand = interaction.options.getSubcommand();
                    if (subcommand === "commands") {
                        const excluded = ["config1", "config2"];
                        const array = [...client.commands.values()].filter(
                            (command) => !excluded.includes(command.data.name)
                        );
                        const focusedValue = interaction.options.getFocused();
                        const filterdChoises = array.filter((command) =>
                            command.data.name.toLowerCase().startsWith(focusedValue.toLowerCase())
                        );
                        const results = filterdChoises.map((choice) => {
                            return {
                                name: `${choice.data.name}`,
                                value: `${choice.data.name}`,
                            };
                        });
                        await interaction.respond(results.slice(0, 25)).catch(() => {});
                        return;
                    }
                }
                return;
            }
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[INTERACTION CREATE]` })
                .setDescription(
                    `\`\`\`ansi\n[0;31m[INTERACTION CREATE] Error with autocomplete options ${error.stack}\`\`\``
                );
            webhookClient.send({ embeds: [embed] }).catch((e) => {
                console.log(`[INTERACTION CREATE] Webhook failed to send`.red);
            });
            console.log(`[INTERACTION CREATE] Error with autocomplete options ${error.stack}`.red);
        }

        //execute all commands
        try {
            if (interaction.isChatInputCommand()) {
                if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                    if (config.restrictedChannelIds.includes(interaction.channel.id))
                        return interaction.reply({
                            content: "This channel has been restricted from all commands",
                            ephemeral: true,
                        });
                }
            }
            let data = await ProfileModel.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            });
            if (!data) {
                data = await ProfileModel.create({
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                });
            }
            if (!interaction.isCommand()) return;
            //checking if command is disabled
            if (config.disabledCommands.includes(interaction.commandName)) {
                return interaction.reply({
                    content: `This command has been disabled for this server`,
                    ephemeral: true,
                });
            }
            //checking if a user is blacklisted from commands
            if (config.blacklist.includes(interaction.user.id))
                return interaction.reply({
                    content: "You are blacklisted from all commands",
                    ephemeral: true,
                });
            //checking if a command is blacklisted for a user or not
            if (data.blacklistedCommands.includes(interaction.commandName))
                return interaction.reply({
                    content: "You are blacklisted from this command",
                    ephemeral: true,
                });
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            //check if user data exists
            const user = await ProfileModel.findOne({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
            if (!user) {
                const newUser = new ProfileModel({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                });
                await newUser.save();
            }
            //update commands counter
            try {
                let subname = "";
                try {
                    subname = interaction.options.getSubcommand();
                } catch (error) {
                    process.stdout.write("\r\x1b[K");
                }
                let value = interaction.commandName;
                if (subname !== "") value = `${interaction.commandName} ${subname}`;
                const name = `${value}`;
                const data = await ProfileModel.findOne({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    "commandCounter.name": `${name}`,
                });
                if (!data) {
                    const newCommand = await ProfileModel.findOne({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                    });
                    const newCommandCounter = {
                        name: `${name}`,
                        value: 0,
                    };
                    newCommand.commandCounter.push(newCommandCounter);
                    await newCommand.save();
                }
                await ProfileModel.findOneAndUpdate(
                    {
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                        "commandCounter.name": `${name}`,
                    },
                    {
                        $inc: { "commandCounter.$[x].value": 1 },
                    },
                    {
                        arrayFilters: [
                            {
                                "x.name": `${name}`,
                            },
                        ],
                    }
                );
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: `[INTERACTION CREATE]` })
                    .setDescription(
                        `\`\`\`ansi\n[0;31m[INTERACTION CREATE] error with updating command counter ${error.stack}\`\`\``
                    );
                webhookClient.send({ embeds: [embed] }).catch((e) => {
                    console.log(`[INTERACTION CREATE] Webhook failed to send`.red);
                });
                console.log("[INTERACTION CREATE] error with updating command counter".red);
            }
            //execute the command
            try {
                await command.execute(interaction, client);
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: `[INTERACTION CREATE]` })
                    .setDescription(
                        `\`\`\`ansi\n[0;31m[INTERACTION CREATE] ${error.stack}\n[INTERACTION CREATE] ${
                            interaction.user.username
                        } used ${interaction.commandName} in ${
                            interaction.channel.name
                        } at ${new Date(Date.now())}\`\`\``
                    );
                webhookClient.send({ embeds: [embed] }).catch((e) => {
                    console.log(`[INTERACTION CREATE] Webhook failed to send`.red);
                });
                console.log(
                    `[INTERACTION CREATE] ${error.stack}\n[INTERACTION CREATE] ${
                        interaction.user.username
                    } used ${interaction.commandName} in ${interaction.channel.name} at ${new Date(
                        Date.now()
                    )}`.red
                );
                return await interaction
                    .reply({
                        content: "There was an error while executing this command!",
                        ephemeral: true,
                    })
                    .catch((e) => {});
            }
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[INTERACTION CREATE]` })
                .setDescription(`\`\`\`ansi\n[0;31m[INTERACTION CREATE] ${error.stack}\`\`\``);
            webhookClient.send({ embeds: [embed] }).catch((e) => {
                console.log(`[INTERACTION CREATE] Webhook failed to send`.red);
            });
            console.log(`[INTERACTION CREATE] ${error.stack}\n${new Date(Date.now())}`.red);
        }
    },
};
