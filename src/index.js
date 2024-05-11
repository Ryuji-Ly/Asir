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
        if (now.getDay() === 1) {
            updateQuery["data.timeBasedStats.weeklyMessages"] = 0;
        }
        if (now.getDate() === 1) {
            updateQuery["data.timeBasedStats.monthlyMessages"] = 0;
        }
        if (now.getMonth() === 0 && now.getDate() === 1) {
            updateQuery["data.timeBasedStats.yearlyMessages"] = 0;
        }
        try {
            if (Object.keys(updateQuery).length === 0) return;
            const result = await UserDatabase.updateMany({}, { $set: updateQuery });
            console.log(`${result.modifiedCount} documents updated.`);
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
setInterval(async () => {
    try {
        const now = new Date();
        const baseURL =
            "https://www.lightnovelcave.com/browse/genre-all-25060123/order-new/status-all?page=";
        let totalPages = 1;
        const novelsData = [];
        const updatedNovels = [];
        (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(baseURL, { waitUntil: "domcontentloaded" });
            totalPages = await page.evaluate(() => {
                const lastPage = parseInt(
                    document
                        .querySelector(
                            ".paging .pagination-container .pagination .PagedList-skipToLast a"
                        )
                        .getAttribute("href")
                        .split("=")
                        .pop()
                );
                return lastPage;
            });
            console.log("Total pages to scrape:", totalPages);
            for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                const url = `${baseURL}${pageNumber}`;
                await page.goto(url, { waitUntil: "domcontentloaded" });
                const novelLinks = await page.evaluate(() => {
                    const novelItems = document.querySelectorAll(".novel-list .novel-item");
                    const links = [];
                    novelItems.forEach((item) => {
                        const novelURL = item.querySelector(".cover-wrap a").getAttribute("href");
                        links.push(novelURL);
                    });
                    return links;
                });
                for (const novelLink of novelLinks) {
                    const novelURL = `https://www.lightnovelcave.com${novelLink}`;
                    await page.goto(novelURL, { waitUntil: "domcontentloaded" });
                    const NovelDetails = {};
                    NovelDetails.title = await page.evaluate(() => {
                        const title = document.querySelector(".novel-title").textContent.trim();
                        return title;
                    });
                    NovelDetails.author = await page.evaluate(() => {
                        const author = document
                            .querySelector('.author span[itemprop="author"]')
                            .textContent.trim();
                        return author;
                    });
                    NovelDetails.rank = await page.evaluate(() => {
                        const rank = parseInt(
                            document
                                .querySelector(".rating .rank strong")
                                .textContent.trim()
                                .replace(/\D/g, ""),
                            10
                        );
                        return rank;
                    });
                    NovelDetails.rating = await page.evaluate(() => {
                        const rating = parseFloat(
                            document.querySelector(".rating .rating-star strong").textContent.trim()
                        );
                        return rating;
                    });
                    NovelDetails.numChapter = await page.evaluate(() => {
                        const numChapter = parseInt(
                            document
                                .querySelector(".header-stats span:nth-child(1) strong")
                                .textContent.trim()
                                .replace(/\D/g, "")
                        );
                        return numChapter;
                    });
                    NovelDetails.views = await page.evaluate(() => {
                        const views = parseInt(
                            document
                                .querySelector(".header-stats span:nth-child(2) strong")
                                .textContent.trim()
                                .replace(/\D/g, "")
                        );
                        return views;
                    });
                    NovelDetails.bookmarks = await page.evaluate(() => {
                        const bookmarks = parseInt(
                            document
                                .querySelector(".header-stats span:nth-child(3) strong")
                                .textContent.trim()
                                .replace(/\D/g, "")
                        );
                        return bookmarks;
                    });
                    NovelDetails.status = await page.evaluate(() => {
                        const status = document.querySelector(".header-stats strong.ongoing")
                            ? "Ongoing"
                            : "Completed";
                        return status;
                    });
                    NovelDetails.categories = await page.evaluate(() => {
                        const categories = [];
                        document.querySelectorAll(".categories ul li a").forEach((category) => {
                            categories.push(category.textContent.trim());
                        });
                        return categories;
                    });
                    NovelDetails.summary = await page.evaluate(() => {
                        const summary = document
                            .querySelector(".novel-body #info .summary .content")
                            .textContent.trim()
                            .replace("Show More", "")
                            .replace(/<br\s*\/?>/g, "\n");
                        return summary;
                    });
                    NovelDetails.tags = await page.evaluate(() => {
                        const tags = [];
                        document
                            .querySelectorAll(".tags .expand-wrapper .content li a")
                            .forEach((tag) => {
                                tags.push(tag.textContent.trim());
                            });
                        return tags;
                    });
                    NovelDetails.cover = await page.evaluate(() => {
                        const cover = document.querySelector(".cover img").getAttribute("src");
                        return cover;
                    });
                    NovelDetails.url = novelURL;
                    novelsData.push(NovelDetails);
                    const data = await novelModel.findOne({
                        title: NovelDetails.title,
                        author: NovelDetails.author,
                    });
                    if (!data) {
                        const novel = new novelModel({
                            title: NovelDetails.title,
                            author: NovelDetails.author,
                            rank: NovelDetails.rank,
                            rating: NovelDetails.rating,
                            numChapter: NovelDetails.numChapter,
                            views: NovelDetails.views,
                            bookmarks: NovelDetails.bookmarks,
                            status: NovelDetails.status,
                            categories: NovelDetails.categories,
                            summary: NovelDetails.summary,
                            tags: NovelDetails.tags,
                            cover: NovelDetails.cover,
                            url: NovelDetails.url,
                        });
                        await novel.save();
                        lncWebhook.send({
                            content: `<@&1169622706573029537>`,
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setAuthor({ name: `[LNC]` })
                                    .setDescription(
                                        `\`\`\`ansi\n[0;32m[LNC] New novel added to the database:\n${novel.title} by ${novel.author}\`\`\``
                                    )
                                    .setThumbnail(novel.cover),
                            ],
                        });
                    } else {
                        updatedNovels.push(NovelDetails);
                        let update = false;
                        let chapterUpdate = false;
                        if (
                            data.rank !== NovelDetails.rank ||
                            data.rating !== NovelDetails.rating ||
                            data.numChapter !== NovelDetails.numChapter ||
                            data.views !== NovelDetails.views ||
                            data.bookmarks !== NovelDetails.bookmarks ||
                            data.status !== NovelDetails.status ||
                            data.categories !== NovelDetails.categories ||
                            data.summary !== NovelDetails.summary ||
                            data.tags !== NovelDetails.tags ||
                            data.cover !== NovelDetails.cover ||
                            data.url !== NovelDetails.url
                        ) {
                            update = true;
                        }
                        if (data.numChapter !== NovelDetails.numChapter) {
                            chapterUpdate = true;
                        }
                        if (update) {
                            await novelModel.findByIdAndUpdate(data._id, {
                                rank: NovelDetails.rank,
                                rating: NovelDetails.rating,
                                numChapter: NovelDetails.numChapter,
                                views: NovelDetails.views,
                                bookmarks: NovelDetails.bookmarks,
                                status: NovelDetails.status,
                                categories: NovelDetails.categories,
                                summary: NovelDetails.summary,
                                tags: NovelDetails.tags,
                                cover: NovelDetails.cover,
                                url: NovelDetails.url,
                            });
                        }
                        if (chapterUpdate) {
                            client.guilds.cache.forEach(async (guild) => {
                                if (guild.id !== "1161001645698715698") return;
                                const role = guild.roles.cache.find(
                                    (role) => role.name === data.title
                                );
                                if (role) {
                                    if (NovelDetails.numChapter > data.numChapter) {
                                        const embed = new EmbedBuilder()
                                            .setTitle({ text: "Chapter update", url: data.url })
                                            .setDescription(
                                                `A new chapter has been added to ${data.title} by ${data.author}.`
                                            )
                                            .setColor("Green")
                                            .setThumbnail(data.cover);
                                        lncWebhook.send({
                                            content: `<@&${role.id}>`,
                                            embeds: [embed],
                                        });
                                    }
                                }
                            });
                        }
                    }
                    // Wait briefly before scraping the next novel (to be polite to the website)
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }
            }
            await browser.close();
            console.log("Total novels scraped:", novelsData.length);
            console.log("Total novels updated:", updatedNovels.length);
            const novels = await novelModel.find();
            console.log("Novels saved to database:", novels.length);
            const end = new Date();
            const time = end - now;
            const { hours, minutes, seconds } = parseMilliseconds(time);
            console.log(
                `Time taken to scrape ${novelsData.length} novels: ${hours}h ${minutes}m ${seconds}s`
            );
        })();
    } catch (error) {
        console.error("Error scraping Light Novel Cave:", error);
    }
}, 1000 * 60 * 30);
