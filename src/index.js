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
            webhookClient
                .send({ embeds: [embed] })
                .catch((e) => console.log(`[DATABASE] Webhook failed to send`.red));
            console.log("[DATABASE] Connected to the database!".green);
        })
        .catch((err) => {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `[DATABASE]` })
                .setDescription(`\`\`\`ansi\n[0;31mError connecting to database:\n${err}\`\`\``);
            webhookClient.send({ embeds: [embed] });
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
        if (now.getHours() >= 0 && now.getHours() < 1) {
            updateQuery["data.timeBasedStats.dailyMessages"] = 0;
        }
        if (now.getDay() === 1 && now.getHours() >= 0 && now.getHours() < 1) {
            updateQuery["data.timeBasedStats.weeklyMessages"] = 0;
        }
        if (now.getDate() === 1 && now.getHours() >= 0 && now.getHours() < 1) {
            updateQuery["data.timeBasedStats.monthlyMessages"] = 0;
        }
        if (
            now.getMonth() === 0 &&
            now.getDate() === 1 &&
            now.getHours() >= 0 &&
            now.getHours() < 1
        ) {
            updateQuery["data.timeBasedStats.yearlyMessages"] = 0;
        }
        try {
            if (Object.keys(updateQuery).length === 0) return;
            const result = await UserDatabase.updateMany({}, { $set: updateQuery });
            console.log(`${result.modifiedCount} documents updated.`);
            webhookClient.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `[BOT]` })
                        .setDescription(
                            `\`\`\`ansi\n[0;32m[BOT] Time based stats updated successfully.\n${result.modifiedCount} user data updated. (Depending on the date, this number can mean daily active users, weekly active users, monthly active users or yearly active users)\`\`\``
                        ),
                ],
            });
            const condition = { "data.timeBasedStats.dailyMessages": { $ne: 0 } };
            const success = await retryUpdate(UserDatabase, condition, updateQuery);
            if (success) {
                console.log("All documents updated successfully.");
            } else {
                console.log("Some documents could not be updated after retries.");
            }
        } catch (error) {
            console.error("Error updating documents:", error);
        }
    } catch (error) {
        console.error("Error updating time based stats:", error);
    }
}, 1000 * 60 * 60);
