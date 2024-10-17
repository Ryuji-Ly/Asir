const { Interaction, EmbedBuilder, WebhookClient } = require("discord.js");
const UserDatabase = require("../models/userSchema");
const parseMilliseconds = require("parse-ms-2");

/**
 *
 * @param {Interaction} interaction
 */
const handleCooldowns = async (interaction, cooldown) => {
    const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
    const embed = new EmbedBuilder()
        .setTitle(`[COOLDOWN HANDLER] - ${interaction.user.username} - ${interaction.commandName}`)
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
        // const result = await UserDatabase.findOneAndUpdate(
        //     {
        //         key: { userId: interaction.user.id, guildId: interaction.guild.id },
        //         "data.commands.name": name,
        //     },
        //     {
        //         $inc: { "data.commands.$.value": 1 },
        //     },
        //     {
        //         new: true,
        //         upsert: true,
        //     }
        // ).catch(() => {});
        // if (!result) {
        //     await UserDatabase.findOneAndUpdate(
        //         { key: { userId: interaction.user.id, guildId: interaction.guild.id } },
        //         {
        //             $push: { "data.commands": { name: name, value: 1 } },
        //         }
        //     );
        // }
        desc += `Updated command counter in ${Date.now() - start}ms\n`;
        let user = await UserDatabase.findOne({
            key: { userId: interaction.user.id, guildId: interaction.guild.id },
        });
        if (!user) {
            user = new UserDatabase({
                key: { userId: interaction.user.id, guildId: interaction.guild.id },
            });
        }
        if (cooldown > 0) {
            // Handle cooldowns
            desc += `Updating cooldown in ${Date.now() - start}ms\n`;
            let cooldownData = user.cooldowns.find((c) => c.name === name);
            if (!cooldownData) {
                cooldownData = { name: name, value: 0 };
                user.cooldowns.push(cooldownData);
            }
            const lastUsed = cooldownData.value;
            const timeLeft = cooldown - (Date.now() - lastUsed);
            if (interaction.user.id === "348902272534839296") {
                await user.save();
                return true;
            }
            if (timeLeft > 0) {
                const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
                await interaction
                    .reply({
                        content: `:x: Please wait ${hours} hrs ${minutes} min ${seconds} sec before trying again. This command is available <t:${Math.floor(
                            (Date.now() + timeLeft) / 1000
                        )}:R>`,
                        ephemeral: true,
                    })
                    .catch(async (e) => {
                        await interaction
                            .editReply({
                                content: `:x: Please wait ${hours} hrs ${minutes} min ${seconds} sec before trying again. This command is available <t:${Math.floor(
                                    (Date.now() + timeLeft) / 1000
                                )}:R>`,
                                ephemeral: true,
                            })
                            .catch((e) => {});
                    });
                return false;
            } else {
                const result = await UserDatabase.findOneAndUpdate(
                    {
                        key: { userId: interaction.user.id, guildId: interaction.guild.id },
                        "cooldowns.name": name,
                    },
                    {
                        $set: { "cooldowns.$.value": Date.now() },
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
                            $push: { cooldowns: { name: name, value: Date.now() } },
                        }
                    );
                }
            }
        }
        desc += `Update user data done in ${Date.now() - start}ms`;
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

module.exports = handleCooldowns;
