const { Interaction, PermissionFlagsBits } = require("discord.js");
const ProfileModel = require("../models/profileSchema");
const whitelist = ["348902272534839296"];
var colors = require("colors");
colors.enable();

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {Interaction} interaction
     * @param {*} client
     * @returns
     */
    async execute(interaction, client) {
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
                return;
            }
        } catch (error) {
            console.log(`[INTERACTION CREATE] Error with autocomplete options ${error}`.red);
        }

        //execute all commands
        try {
            const config = await client.configs.get(interaction.guild.id);
            if (interaction.isChatInputCommand()) {
                if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                    if (config.restrictedChannelIds.includes(interaction.channel.id))
                        return interaction.reply({
                            content: "This channel has been restricted from all commands",
                            ephemeral: true,
                        });
                }
            }
            const data = await ProfileModel.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id,
            });
            if (!interaction.isCommand()) return;
            if (config.blacklist.includes(interaction.user.id))
                return interaction.reply({
                    content: "You are blacklisted from all commands",
                    ephemeral: true,
                });
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
                console.log("[INTERACTION CREATE] error with updating command counter".red);
            }
            //execute the command
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log(
                    `[INTERACTION CREATE] ${error}\n[BOT] ${interaction.user.username} used ${
                        interaction.commandName
                    } at ${new Date(Date.now())}`.red
                );
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        } catch (error) {
            return;
        }
    },
};
