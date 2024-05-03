const { Interaction } = require("discord.js");
const UserDatabase = require("../models/userSchema");
const parseMilliseconds = require("parse-ms-2");

/**
 *
 * @param {Interaction} interaction
 */
const handleCooldowns = async (interaction, cooldown) => {
    let subname = "";
    try {
        subname = interaction.options.getSubcommand();
    } catch (error) {
        process.stdout.write("\r\x1b[K");
    }
    let value = interaction.commandName;
    if (subname !== "") value = `${interaction.commandName} ${subname}`;
    const name = `${value}`;
    //checking if cooldown exists
    let data = await UserDatabase.findOne({
        key: { guildId: interaction.guild.id, userId: interaction.user.id },
        "cooldowns.name": `${name}`,
    });
    if (!data) {
        data = await UserDatabase.findOne({
            key: { userId: interaction.user.id, guildId: interaction.guild.id },
        });
        const newCooldown = {
            name: name,
            value: 0,
        };
        data.cooldowns.push(newCooldown);
        await data.save();
    }
    const user = await UserDatabase.findOne({
        key: { userId: interaction.user.id, guildId: interaction.guildId },
    });
    const lastUsed = await user.cooldowns.find((c) => c.name === name).value;
    const timeLeft = cooldown - (Date.now() - lastUsed);
    if (interaction.user.id === "348902272534839296") return true;
    if (timeLeft > 0) {
        const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
        await interaction
            .reply({
                content: `:x: Please wait ${hours} hrs ${minutes} min ${seconds} sec before trying again. This command is available <t:${Math.floor(
                    (Date.now() + timeLeft) / 1000
                )}:R>`,
                ephemeral: true,
            })
            .catch(
                async (e) =>
                    await interaction
                        .editReply({
                            content: `:x: Please wait ${hours} hrs ${minutes} min ${seconds} sec before trying again. This command is available <t:${Math.floor(
                                (Date.now() + timeLeft) / 1000
                            )}:R>`,
                            ephemeral: true,
                        })
                        .catch((e) => {})
            );
        return false;
    } else {
        await UserDatabase.findOneAndUpdate(
            { key: { userId: interaction.user.id, guildId: interaction.guild.id } },
            { $set: { "cooldowns.$[x].value": Date.now() } },
            { arrayFilters: [{ "x.name": name }] }
        );
        return true;
    }
};

module.exports = handleCooldowns;
