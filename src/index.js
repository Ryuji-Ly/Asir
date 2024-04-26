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
} = require(`discord.js`);
const { ImgurClient } = require("imgur");
const ServerConfig = require("./models/serverConfigs");
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
    await mongoose
        .connect(process.env.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: `[DATABASE]` })
                .setDescription(`\`\`\`ansi\n[0;32m[DATABASE] Connected to the database!\`\`\``);
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
