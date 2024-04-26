const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const UserDatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge-all-infractions")
        .setDescription(
            "Server owner only. Removes ALL infractions and warnings of the entire server."
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
        if (user.id !== guild.ownerId)
            return interaction.reply({
                content: "You must be the server owner to use this command.",
                ephemeral: true,
            });
        await interaction.deferReply();
        const confirmationEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor("Red")
            .setDescription(
                `Are you sure you want to purge **ALL** *infractions* and **ALL** *warnings* in this server?`
            );
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("confirm").setLabel("Yes").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("cancel").setLabel("No").setStyle(ButtonStyle.Success)
        );
        const msg = await interaction.editReply({ embeds: [confirmationEmbed], components: [row] });
        const filter = (i) => i.user.id === user.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
        collector.on("collect", async (i) => {
            if (i.customId === "confirm") {
                await i.update({
                    content: "Purging infractions and warnings...",
                    embeds: [],
                    components: [],
                });
                const data = await ProfileModel.find({
                    key: { guildId: guild.id },
                    "data.infractions": { $exists: true, $ne: [] },
                    "data.warnings": { $gt: 0 },
                });
                if (data.length === 0)
                    return interaction.editReply({
                        content: "No infractions to remove.",
                        embeds: [],
                        ephemeral: true,
                    });
                let failedUsers = [];
                for (const d of data) {
                    d.infractions = [];
                    d.warnings = 0;
                    try {
                        await d.save();
                    } catch (error) {
                        console.error(`[BOT] Error updating profile ${d.userId}\n${error}`);
                        failedUsers.push(d.userId);
                    }
                }
                const embed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setColor("Green")
                    .setDescription(
                        `You have purged **ALL** infractions and warnings in this server.`
                    );
                await i.editReply({ content: "", embeds: [embed], components: [] });
                if (failedUsers.length > 0) {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                        .setColor("Red")
                        .setDescription(
                            `Failed to remove infractions and warnings for the following users:\n${failedUsers
                                .map((u) => `<@${u}>`)
                                .join(", ")}`
                        );
                    await i.followUp({ content: "", embeds: [embed], components: [] });
                }
            } else {
                await i.update({ content: "Purge cancelled.", components: [] });
            }
        });

        return;
    },
};
