const {
    EmbedBuilder,
    WebhookClient,
    Client,
    GatewayIntentBits,
    ActivityType,
    DiscordAPIError,
    PermissionFlagsBits,
} = require("discord.js");
const novelModel = require("./models/novels");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
require("dotenv").config();
const parseMilliseconds = require("parse-ms-2");
const lncWebhook = new WebhookClient({ url: process.env.lncWebhook });
const scraperWebhook = new WebhookClient({ url: process.env.scraperWebhook });
const scraperLog = new WebhookClient({
    url: "https://discord.com/api/webhooks/1276592791312662538/c1XntKB3P-vGaU5xiZZwlQF5rJ8UbvtYMmnpSfo7aY5RqkDCHCvSUTvz5UUYL-G7PUsH",
});
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
        GatewayIntentBits.GuildMessageReactions,
    ],
});

(async () => {
    await mongoose
        .connect(process.env.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("[DATABASE] Connected to the database!");
            scraperWebhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `[DATABASE]` })
                        .setDescription(`\`\`\`ansi\n[0;32m[DATABASE] Connected to the database!\`\`\``),
                ],
            });
        })
        .catch((err) => {
            console.log("[DATABASE] Failed to connect to the database!");
            scraperLog.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: `[DATABASE]` })
                        .setDescription(
                            `\`\`\`ansi\n[0;31m[DATABASE] Error connecting to the database!\`\`\``
                        ),
                ],
            });
        });
    await client.login(process.env.scraperToken);
    client.user.setPresence({ status: "invisible" });
    client.user.setActivity({
        type: ActivityType.Custom,
        name: "customstatus",
        state: "Scraper has died",
    });
})();

client.on("ready", async (client) => {
    console.log(`[BOT] Logged in as ${client.user.tag}`);
    const guild = client.guilds.cache.get("1161001645698715698");
    if (!guild) return console.log(`[BOT] Guild not found`);
    console.log(`[BOT] Found guild: ${guild.name}`);
    // const userId = "344224110231945216";
    // guild.members
    //     .fetch(userId)
    //     .then((member) => {
    //         if (member) {
    //             member.ban({ reason: "N/A" }).catch(console.error);
    //         } else {
    //             console.log(`[BOT] Member not found`);
    //         }
    //     })
    //     .catch(console.error);
    // const roles = await guild.roles.fetch();
    // console.log(roles.size);
    // const novels = await novelModel.find({});
    // const novelTitles = novels.map((novel) => novel.title);
    // let roleCount = 0;
    // roles.forEach(async (role) => {
    //     if (novelTitles.includes(role.name)) {
    //         role.delete()
    //             .then((deletedRole) => console.log(`Deleted role: ${deletedRole.name}`))
    //             .catch((err) => console.error(`Failed to delete role: ${role.name}`, err));
    //         roleCount++;
    //     }
    // });
});
