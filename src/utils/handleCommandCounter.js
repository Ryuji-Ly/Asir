const { Interaction, EmbedBuilder, WebhookClient } = require("discord.js");
const UserDatabase = require("../models/userSchema");

/**
 *
 * @param {Interaction} interaction
 */
const commandCounter = async (interaction) => {
    const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
    const embed = new EmbedBuilder()
        .setTitle(`[COMMAND COUNTER] - ${interaction.user.username} - ${interaction.commandName}`)
        .setColor("Purple");
    let desc = "";
    const start = Date.now();
    let subname = "";
    try {
        subname = interaction.options.getSubcommand();
    } catch (error) {
        subname = "";
    }
    let value = interaction.commandName;
    if (subname !== "") value = `${interaction.commandName} ${subname}`;
    const name = `${value}`;
    try {
        const result = await UserDatabase.findOneAndUpdate(
            {
                key: { userId: interaction.user.id, guildId: interaction.guild.id },
                "data.commands.name": name,
            },
            {
                $inc: { "data.commands.$.value": 1 },
            },
            {
                new: true,
                upsert: true,
            }
        ).catch(() => {});
        if (!result) {
            await UserDatabase.findOneAndUpdate(
                { key: { userId: interaction.user.id, guildId: interaction.guild.id } },
                {
                    $push: { "data.commands": { name: name, value: 1 } },
                }
            );
        }
        desc += `Updated command counter in ${Date.now() - start}ms\n`;
        if (Date.now() - start > 3000) {
            webhookClient.send({
                embeds: [embed.setDescription(desc)],
            });
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = commandCounter;
