const { Interaction } = require("discord.js");
const ProfileModel = require("../models/profileSchema");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        //execute all commands
        if (!interaction.isCommand()) return;
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
                console.log("No subcommand for command counter, no problems here");
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
            console.log("error with updating command counter");
        }
        //execute the command
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
