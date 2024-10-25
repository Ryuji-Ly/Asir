const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
    Permissions,
    MessageManager,
    Embed,
    ActivityType,
    Collection,
    WebhookClient,
    IntentsBitField,
    DiscordAPIError,
} = require(`discord.js`);
const { ImgurClient } = require("imgur");
const ServerConfig = require("./models/serverConfigs");
const UserDatabase = require("./models/userSchema");
const retryUpdate = require("./utils/retryUpdate");
const { performance } = require("perf_hooks");
const puppeteer = require("puppeteer");
const parseMilliseconds = require("parse-ms-2");
const novelModel = require("./models/novels");
const fs = require("fs");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildModeration,
    ],
});
const mongoose = require("mongoose");
const webhookClient = new WebhookClient({ url: process.env.discordWebhook });
const lncWebhook = new WebhookClient({ url: process.env.lncWebhook });
const scraperWebhook = new WebhookClient({ url: process.env.scraperWebhook });
client.commands = new Collection();
client.configs = new Collection();

require("dotenv").config();

const functions = fs.readdirSync("./src/functions").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    await client.handleEvents(eventFiles, "./src/events");
    await client.handleCommands(commandFolders, "./src/commands");
    const start = performance.now();
    await mongoose
        .connect(process.env.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
        })
        .then(() => {
            const connectionTime = performance.now() - start;
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: `[DATABASE]` })
                .setDescription(
                    `\`\`\`ansi\n[0;32m[DATABASE] Connected to the database!\n\n[DATABASE] connected in ${connectionTime.toFixed(
                        2
                    )}ms\`\`\``
                );
            // webhookClient
            //     .send({ embeds: [embed] })
            //     .catch((e) => console.log(`[DATABASE] Webhook failed to send`.red));
            console.log("[DATABASE] Connected to the database!".green);
        })
        .catch((err) => {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[DATABASE]` })
                .setDescription(`\`\`\`ansi\n[0;31mError connecting to database:\n${err}\`\`\``);
            // webhookClient.send({ embeds: [embed] });
            console.log(`[DATABASE] Error with connecting to database: ${err.stack}`.red);
        });
    await client.login(process.env.token);
    client.guilds.cache.forEach(async (guild) => {
        let data = await ServerConfig.findOne({ guildId: guild.id });
        if (!data) {
            data = new ServerConfig({
                guildId: guild.id,
            });
            await data.save();
        }
        client.configs.set(guild.id, data);
    });
})();

const embed = new EmbedBuilder().setColor("Red").setAuthor({ name: `[BOT]` });
process.on("unhandledRejection", (reason, promise) => {
    if (reason instanceof DiscordAPIError && reason.code === 10062) return;
    let reasonString = reason instanceof Error ? reason.stack : String(reason);
    embed.setDescription(
        `\`\`\`ansi\n[0;31m[BOT] Unhandled Rejection at ${promise}\n[BOT] Unhandled Rejection reason:\n${reasonString}\`\`\``
    );
    webhookClient
        .send({ embeds: [embed] })
        .catch((e) => console.log(`[BOT] Webhook failed to send`.red));
    console.log(
        `[BOT] Unhandled Rejection at ${promise}\n[BOT] Unhandled Rejection reason: ${
            reason.stack
        }\n${new Date(Date.now())}`.red
    );
});

process.on("uncaughtException", (error, origin) => {
    let errorString = error instanceof Error ? error.stack : String(error);
    embed.setDescription(
        `\`\`\`ansi\n[0;31m[BOT] Uncaught Exception at ${origin}\n[BOT] Uncaught Exception error:\n${errorString}\`\`\``
    );
    webhookClient
        .send({ embeds: [embed] })
        .catch((e) => console.log(`[BOT] Webhook failed to send`.red));
    console.log(
        `[BOT] Uncaught Exception at ${origin}\n[BOT] Uncaught Exception error: ${
            error.stack
        }\n${new Date(Date.now())}`.red
    );
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
    let errorString = error instanceof Error ? error.stack : String(error);
    embed.setDescription(
        `\`\`\`ansi\n[0;31m[BOT] Uncaught Exception Monitor at ${origin}\n[BOT] Uncaught Exception Monitor error:\n${errorString}\`\`\``
    );
    webhookClient
        .send({ embeds: [embed] })
        .catch((e) => console.log(`[BOT] Webhook failed to send`.red));
    console.log(
        `[BOT] Uncaught Exception Monitor at ${origin}\n[BOT] Uncaught Exception Monitor error: ${
            error.stack
        }\n${new Date(Date.now())}`.red
    );
});

setInterval(async () => {
    try {
        const updateQuery = {};
        const now = new Date();
        let averageDailyMessages = 0;
        let averageWeeklyMessages = 0;
        let averageMonthlyMessages = 0;
        let averageYearlyMessages = 0;
        let shouldUpdate = false;
        if (now.getHours() >= 0 && now.getHours() < 1) {
            const totalUsersDaily = await UserDatabase.countDocuments({
                "data.timeBasedStats.dailyMessages": { $gt: 0 },
            });
            const totalDailyMessages = await UserDatabase.aggregate([
                { $match: { "data.timeBasedStats.dailyMessages": { $gt: 0 } } },
                {
                    $group: {
                        _id: null,
                        totalMessages: { $sum: "$data.timeBasedStats.dailyMessages" },
                    },
                },
            ]);
            averageDailyMessages = totalDailyMessages[0]?.totalMessages / totalUsersDaily || 0;
            updateQuery["data.timeBasedStats.dailyMessages"] = 0;
            shouldUpdate = true;
        }
        if (now.getDay() === 1 && now.getHours() >= 0 && now.getHours() < 1) {
            const totalUsersWeekly = await UserDatabase.countDocuments({
                "data.timeBasedStats.weeklyMessages": { $gt: 0 },
            });
            const totalWeeklyMessages = await UserDatabase.aggregate([
                { $match: { "data.timeBasedStats.weeklyMessages": { $gt: 0 } } },
                {
                    $group: {
                        _id: null,
                        totalMessages: { $sum: "$data.timeBasedStats.weeklyMessages" },
                    },
                },
            ]);
            averageWeeklyMessages = totalWeeklyMessages[0]?.totalMessages / totalUsersWeekly || 0;
            updateQuery["data.timeBasedStats.weeklyMessages"] = 0;
            shouldUpdate = true;
        }
        if (now.getDate() === 1 && now.getHours() >= 0 && now.getHours() < 1) {
            const totalUsersMonthly = await UserDatabase.countDocuments({
                "data.timeBasedStats.monthlyMessages": { $gt: 0 },
            });
            const totalMonthlyMessages = await UserDatabase.aggregate([
                { $match: { "data.timeBasedStats.monthlyMessages": { $gt: 0 } } },
                {
                    $group: {
                        _id: null,
                        totalMessages: { $sum: "$data.timeBasedStats.monthlyMessages" },
                    },
                },
            ]);
            averageMonthlyMessages =
                totalMonthlyMessages[0]?.totalMessages / totalUsersMonthly || 0;
            updateQuery["data.timeBasedStats.monthlyMessages"] = 0;
            shouldUpdate = true;
        }
        if (
            now.getMonth() === 0 &&
            now.getDate() === 1 &&
            now.getHours() >= 0 &&
            now.getHours() < 1
        ) {
            const totalUsersYearly = await UserDatabase.countDocuments({
                "data.timeBasedStats.yearlyMessages": { $gt: 0 },
            });
            const totalYearlyMessages = await UserDatabase.aggregate([
                { $match: { "data.timeBasedStats.yearlyMessages": { $gt: 0 } } },
                {
                    $group: {
                        _id: null,
                        totalMessages: { $sum: "$data.timeBasedStats.yearlyMessages" },
                    },
                },
            ]);
            averageYearlyMessages = totalYearlyMessages[0]?.totalMessages / totalUsersYearly || 0;
            updateQuery["data.timeBasedStats.yearlyMessages"] = 0;
            shouldUpdate = true;
        }
        if (shouldUpdate) {
            const result = await UserDatabase.updateMany({}, { $set: updateQuery });

            let messageDescription = `\`\`\`ansi\n[0;32m[BOT] Time based stats updated successfully.\n${result.modifiedCount} user data updated.`;
            if (averageDailyMessages) {
                messageDescription += `\nAverage daily messages per active user: ${averageDailyMessages.toFixed(
                    2
                )}`;
            }
            if (averageWeeklyMessages) {
                messageDescription += `\nAverage weekly messages per active user: ${averageWeeklyMessages.toFixed(
                    2
                )}`;
            }
            if (averageMonthlyMessages) {
                messageDescription += `\nAverage monthly messages per active user: ${averageMonthlyMessages.toFixed(
                    2
                )}`;
            }
            if (averageYearlyMessages) {
                messageDescription += `\nAverage yearly messages per active user: ${averageYearlyMessages.toFixed(
                    2
                )}`;
            }
            messageDescription += `\`\`\``;
            webhookClient.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `[BOT]` })
                        .setDescription(messageDescription),
                ],
            });
            const condition = { "data.timeBasedStats.dailyMessages": { $ne: 0 } };
            const success = await retryUpdate(UserDatabase, condition, updateQuery);
            if (success) {
                console.log("All documents updated successfully.");
            } else {
                console.log("Some documents could not be updated after retries.");
            }
        }
    } catch (error) {
        console.error("Error updating time based stats:", error);
    }
}, 1000 * 60 * 60); // Run every hour to check if it's time to update
