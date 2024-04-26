const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const UserModel = require("../../models/userSchema");
let failedUsers = [];
let alreadyMigrated = [];
let successfulCreation = 0;

async function handleFailedUsers(userIds) {
    try {
        const failedUsers = [];

        // Iterate over each user ID in the provided list
        for (const userId of userIds) {
            try {
                // Retrieve the corresponding user document based on userId
                const user = await ProfileModel.findOne({ userId: userId });
                if (user) {
                    // Create a new user document in the UserModel collection
                    const newUser = await UserModel.create({
                        key: {
                            userId: user.userId,
                            guildId: user.guildId,
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
                        cooldowns: user.cooldowns || [],
                        data: {
                            commands: user.commandCounter || [],
                            messages: user.messageCounter || 0,
                            mentions: user.mentions || [],
                            mentioned: [],
                            warnings: user.warnings || 0,
                            infractions: user.infractions || [],
                            minigameStats: [],
                            gambleStats: [],
                            blacklistedCommands: user.blacklistedCommands || [],
                            customRoleCount: user.customRoleCount || 0,
                            shopStats: user.shopItems || [],
                            timeBasedStats: [],
                        },
                        multiplier: user.multiplier || 1,
                        itemEffects: user.itemEffects || [],
                    });

                    console.log(`Successfully created user ${userId} in UserModel.`);
                } else {
                    console.log(`Failed user ${userId} not found in ProfileModel.`);
                }
            } catch (error) {
                console.error(`Error handling failed user ${userId}:`, error);
            }
        }

        console.log(`${failedUsers.length} failed users processed successfully.`);
        return failedUsers;
    } catch (error) {
        console.error("Failed to handle failed users:", error);
        return [];
    }
}

const failedUserIds = [
    "744459563310514238",
    "474267802849509426",
    "305155007987056640",
    "1217043829555986483",
    "802166762816667659",
    "687374224867721330",
    "1220443113819082914",
    "1140973903099998363",
    "740493242730151948",
    "986699657705058374",
    "241207238830587904",
    "508104280088248330",
    "636526548895268885",
];

async function migrateData() {
    try {
        failedUsers = [];
        alreadyMigrated = [];
        const oldData = await ProfileModel.find();

        const promises = oldData.map(async (oldDoc) => {
            try {
                const existingUser = await UserModel.findOne({
                    key: { userId: oldDoc.userId, guildId: oldDoc.guildId },
                });
                if (existingUser) {
                    alreadyMigrated.push(oldDoc.userId);
                    return null;
                } else {
                    const transformedData = {
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

                    // Create the user document
                    const newUser = await UserModel.create(transformedData);
                    return newUser;
                }
            } catch (error) {
                console.error(`Error processing user ${oldDoc.userId}:`, error);
                failedUsers.push(oldDoc.userId);
                return null;
            }
        });

        // Wait for all document creation promises to resolve
        const createdUsers = await Promise.all(promises);

        // Filter out null values (skipped documents) and count successful creations
        const successfulCreations = createdUsers.filter((user) => user !== null).length;
        successfulCreation = successfulCreations || 0;

        console.log(`${successfulCreations} users successfully migrated.`);
        console.log(`${failedUsers.length} users failed to migrate.`);
        console.log(`${alreadyMigrated.length} users were already migrated.`);

        return true;
    } catch (error) {
        console.error("Data migration failed:", error);
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
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.deferReply(`Transferring data...`);
        const result = await migrateData();
        await handleFailedUsers(failedUserIds)
            .then((failedUsers) => {
                // Use the processed failedUsers array as needed
                console.log("Failed users:", failedUsers);
            })
            .catch((error) => {
                console.error("Failed to handle failed users:", error);
            });
        if (result) {
            await interaction.editReply(
                `Data has been transferred!\n\n${successfulCreation} users are successfully transfered\n\n${failedUsers.length} users failed to transfer data.\n\n${alreadyMigrated.length} users have already been migrated.`
            );
        } else {
            await interaction.editReply(
                `Data transfer failed!\n\n${successfulCreation} users are successfully transfered\n\n${failedUsers.length} users failed to transfer data.\n\n${alreadyMigrated.length} users have already been migrated.`
            );
        }
        return;
    },
};
