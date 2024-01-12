const { SlashCommandBuilder, Interaction, Client } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
    cooldown: 1000 * 60 * 60,
    lastUsed: [],
    data: new SlashCommandBuilder()
        .setName("cooldown")
        .setDescription("Test cooldowns using command properties"),
    /**
     *
     *
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const command = client.commands.get("cooldown");
        let lastUsed = command.lastUsed.find((c) => c.name === user.id);
        if (!lastUsed) {
            const newUsed = {
                name: user.id,
                value: 0,
            };
            lastUsed = newUsed;
            await command.lastUsed.push(newUsed);
        }
        const timeLeft = command.cooldown - (Date.now() - lastUsed.value);
        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            return await interaction.reply({
                content: `:x: Please wait ${hours} hrs ${minutes} min ${seconds} sec before trying again. This command is available <t:${Math.floor(
                    (Date.now() + timeLeft) / 1000
                )}:R>`,
                ephemeral: true,
            });
        }
        await interaction.reply({ content: "No cooldown", ephemeral: true });
        await command.lastUsed.find((c) => {
            if (c.name === user.id) {
                c.value = Date.now();
            }
        });
        return;
    },
};
