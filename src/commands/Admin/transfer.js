const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const mongoose = require("mongoose");
const ProfileModel = require("../../models/profileSchema");
const UserModel = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

async function migrateData() {
    try {
        const oldData = await ProfileModel.find();

        const newData = await oldData.map((oldDoc) => {
            return {
                key: {
                    userId: oldDoc.userId,
                    guildId: oldDoc.guildId,
                },
                economy: {
                    wallet: 100,
                    bank: 0,
                    items: [],
                },
                level: {
                    level: 1,
                    xp: 0,
                },
                cooldowns: oldDoc.cooldowns || [],
                data: {
                    commands: oldDoc.commandCounter || [],
                    messages: oldDoc.messageCounter || 0,
                    mentions: oldDoc.mentions || [],
                    mentioned: [],
                    warnings: oldDoc.warnings || 0,
                    infractions: oldDoc.infractions || [],
                    minigameStats: [],
                    gambleStats: [],
                    blacklistedCommands: oldDoc.blacklistedCommands || [],
                    customRoleCount: oldDoc.customRoleCount || 0,
                    shopStats: oldDoc.shopItems || [],
                    timeBasedStats: [],
                },
                multiplier: oldDoc.multiplier || 1,
                itemEffects: oldDoc.itemEffects || [],
            };
        });
        await UserModel.insertMany(newData);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer all data")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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
        await interaction.deferReply(`Transferring data...`);
        const result = await migrateData();
        if (result) {
            await interaction.editReply("Data has been transferred!");
        } else {
            await interaction.editReply("Data transfer failed!");
        }
        return;
    },
};
