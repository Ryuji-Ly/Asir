const {
    Interaction,
    PermissionFlagsBits,
    WebhookClient,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    ActionRowBuilder,
    DiscordAPIError,
} = require("discord.js");
const UserDatabase = require("../models/userSchema");
const novelModel = require("../models/novels");
const tagModel = require("../models/tags");
var colors = require("colors");
const handleCooldowns = require("../utils/handleCooldowns");
const commandCounter = require("../utils/handleCommandCounter");
colors.enable();
const categories = [
    "Fantasy",
    "Adventure",
    "Action",
    "Comedy",
    "Horror",
    "Mature",
    "Supernatural",
    "Mystery",
    "Romance",
    "Video Games",
    "Tragedy",
    "Slice of Life",
    "Historical",
    "Adult",
    "Sci-fi",
    "Harem",
    "School Life",
    "Drama",
    "Seinen",
    "Wuxia",
    "Shounen",
    "Magical Realism",
    "Psychological",
    "Yuri",
    "Xuanhuan",
    "Smut",
    "Yaoi",
    "Xianxia",
    "Martial Arts",
    "Shoujo Ai",
    "Ecchi",
    "Eastern Fantasy",
    "Mecha",
    "Gender Bender",
    "Josei",
    "Shoujo",
    "Shounen Ai",
    "Fantasy Romance",
    "Sports",
    "Contemporary Romance",
    "Lolicon",
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
        const botMember = await interaction.guild.members.fetch(client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.Administrator)) return;
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
                if (config.channels.ticket.length === 0) {
                    return interaction.reply({
                        content: "Ticket system is disabled",
                        ephemeral: true,
                    });
                }
                const categoryId = config.channels.ticket[1].value;
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
                            id: config.channels.ticket[2].value,
                            allow: ["ViewChannel", "ManageChannels"],
                        },
                    ],
                });
                const msg = await channel.send({
                    content: `<@&${config.channels.ticket[2].value}>`,
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
                if (interaction.commandName === "follow-novel") {
                    const array = await novelModel.find();
                    const focusedValue = interaction.options.getFocused();
                    const filterdChoises = array.filter(
                        (novel) =>
                            novel.title.toLowerCase().includes(focusedValue.toLowerCase()) &&
                            novel.title.length <= 100
                    );
                    const results = filterdChoises.map((choice) => {
                        return {
                            name: `${choice.title}`,
                            value: `${choice.title}`,
                        };
                    });
                    await interaction.respond(results.slice(0, 25)).catch(() => {});
                    return;
                }
                if (interaction.commandName === "unfollow-novel") {
                    const array = await novelModel.find();
                    const focusedValue = interaction.options.getFocused();
                    const filterdChoises = array.filter(
                        (novel) =>
                            novel.title.toLowerCase().includes(focusedValue.toLowerCase()) &&
                            novel.title.length <= 100
                    );
                    const results = filterdChoises.map((choice) => {
                        return {
                            name: `${choice.title}`,
                            value: `${choice.title}`,
                        };
                    });
                    await interaction.respond(results.slice(0, 25)).catch(() => {});
                    return;
                }
                if (interaction.commandName === "novel") {
                    const array = await novelModel.find();
                    const focusedValue = interaction.options.getFocused();
                    const filterdChoises = array.filter(
                        (novel) =>
                            novel.title.toLowerCase().includes(focusedValue.toLowerCase()) &&
                            novel.title.length <= 100
                    );
                    const results = filterdChoises.map((choice) => {
                        return {
                            name: `${choice.title}`,
                            value: `${choice.title}`,
                        };
                    });
                    await interaction.respond(results.slice(0, 25)).catch(() => {});
                    return;
                }
                if (interaction.commandName === "filter-novel") {
                    const focusedOption = interaction.options.getFocused(true);
                    if (focusedOption.name === "genre") {
                        const filteredChoices = categories.filter((category) =>
                            category.toLowerCase().startsWith(focusedOption.value.toLowerCase())
                        );
                        const results = filteredChoices.map((choice) => {
                            return {
                                name: `${choice}`,
                                value: `${choice}`,
                            };
                        });
                        await interaction.respond(results.slice(0, 25)).catch(() => {});
                    }
                    if (focusedOption.name === "tags") {
                        const tags = await tagModel.findOne({ name: "LNC" });
                        const array = focusedOption.value.split(",").map((tag) => tag.trim());
                        const focusedValue = array.pop();
                        const previousTags = array.join(", ");
                        const previousTagsArray = previousTags.split(",").map((tag) => tag.trim());
                        const filteredChoices = tags.tags.filter((tag) => {
                            const lowerCaseTag = tag.toLowerCase();
                            const lowerCaseFocusedValue = focusedValue.toLowerCase();
                            return (
                                lowerCaseTag.startsWith(lowerCaseFocusedValue) &&
                                !previousTagsArray.includes(tag)
                            );
                        });
                        const results = filteredChoices.map((choice) => {
                            if (
                                previousTags === "" ||
                                previousTags === undefined ||
                                previousTags === null
                            ) {
                                return {
                                    name: `${choice}`,
                                    value: `${choice}`,
                                };
                            } else {
                                return {
                                    name: `${previousTags}, ${choice}`,
                                    value: `${previousTags}, ${choice}`,
                                };
                            }
                        });
                        await interaction.respond(results.slice(0, 25)).catch(() => {});
                    }
                }
                // if (interaction.commandName === "blacklist-user-command") {
                //     const array = [...client.commands.values()];
                //     const focusedValue = interaction.options.getFocused();
                //     const filterdChoises = array.filter((command) =>
                //         command.data.name.toLowerCase().startsWith(focusedValue.toLowerCase())
                //     );
                //     const results = filterdChoises.map((choice) => {
                //         return {
                //             name: `${choice.data.name}`,
                //             value: `${choice.data.name}`,
                //         };
                //     });
                //     interaction.respond(results.slice(0, 25)).catch(() => {});
                //     return;
                // }
                // if (interaction.commandName === "config2") {
                //     const subcommand = interaction.options.getSubcommand();
                //     if (subcommand === "commands") {
                //         const excluded = ["config1", "config2"];
                //         const array = [...client.commands.values()].filter(
                //             (command) => !excluded.includes(command.data.name)
                //         );
                //         const focusedValue = interaction.options.getFocused();
                //         const filterdChoises = array.filter((command) =>
                //             command.data.name.toLowerCase().startsWith(focusedValue.toLowerCase())
                //         );
                //         const results = filterdChoises.map((choice) => {
                //             return {
                //                 name: `${choice.data.name}`,
                //                 value: `${choice.data.name}`,
                //             };
                //         });
                //         await interaction.respond(results.slice(0, 25)).catch(() => {});
                //         return;
                //     }
                // }
                // return;
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
                if (
                    !interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers) &&
                    !interaction.member.id === "348902272534839296"
                ) {
                    if (config.channels.restricted.includes(interaction.channel.id))
                        return interaction.reply({
                            content: "This channel has been restricted from all commands",
                            ephemeral: true,
                        });
                    if (config.channels.blacklisted.includes(interaction.channel.id))
                        return interaction.reply({
                            content: "This channel has been blacklisted from all commands",
                            ephemeral: true,
                        });
                }
            }
            if (!interaction.isCommand()) return;
            //checking if command is disabled
            if (config.commands.disabled.includes(interaction.commandName)) {
                return interaction.reply({
                    content: `This command has been disabled for this server`,
                    ephemeral: true,
                });
            }
            //checking if a user is blacklisted from commands
            if (config.commands.blacklistedUsers.includes(interaction.user.id))
                return interaction.reply({
                    content: "You are blacklisted from all commands",
                    ephemeral: true,
                });
            // //checking if a command is blacklisted for a user or not
            // if (data.blacklistedCommands.includes(interaction.commandName))
            //     return interaction.reply({
            //         content: "You are blacklisted from this command",
            //         ephemeral: true,
            //     });
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            if (
                interaction.commandName === "2048" ||
                interaction.commandName === "blackjack" ||
                interaction.commandName === "flood" ||
                interaction.commandName === "minesweeper" ||
                interaction.commandName === "trivia"
            ) {
                if (config.channels.minigame.length !== 0) {
                    if (!config.channels.minigame.includes(interaction.channel.id)) {
                        return interaction.reply({
                            content: `This command can only be used in minigame channels\n${config.channels.minigame
                                .map((c) => `<#${c}>`)
                                .join(", ")}`,
                            ephemeral: true,
                        });
                    }
                }
            }
            //check for cooldowns
            try {
                let cooldown = 0;
                if (
                    config.commands.cooldowns.filter((c) => c.name === interaction.commandName)
                        .length > 0
                ) {
                    cooldown = config.commands.cooldowns.find(
                        (c) => c.name === interaction.commandName
                    ).value;
                } else cooldown = 0;
                if (
                    interaction.commandName === "gamble" ||
                    interaction.commandName === "2048" ||
                    interaction.commandName === "blackjack" ||
                    interaction.commandName === "flood" ||
                    interaction.commandName === "minesweeper" ||
                    interaction.commandName === "trivia"
                )
                    cooldown = config.commands.defaultMinigameCooldown;
                if (interaction.commandName === "daily") cooldown = 1000 * 60 * 60 * 24;
                const cd = await handleCooldowns(interaction, cooldown);
                if (cd === false) return;
            } catch (error) {
                console.log(`[INTERACTION CREATE] Error with cooldowns ${error.stack}`.red);
            }
            //execute the command
            try {
                await command.execute(interaction, client, config);
                await commandCounter(interaction);
            } catch (error) {
                if (error.code === 10062 && error instanceof DiscordAPIError) return;
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
            if (error.code === 10062 && error instanceof DiscordAPIError) return;
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
