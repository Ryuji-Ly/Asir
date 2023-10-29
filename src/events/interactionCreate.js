const { Interaction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        //execute all commands
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        //command.data.name
        if (!command) return;
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
