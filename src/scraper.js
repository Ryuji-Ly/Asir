const {
    EmbedBuilder,
    WebhookClient,
    Client,
    GatewayIntentBits,
    ActivityType,
    DiscordAPIError,
} = require("discord.js");
const novelModel = require("./models/novels");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
require("dotenv").config();
const parseMilliseconds = require("parse-ms-2");
const lncWebhook = new WebhookClient({ url: process.env.lncWebhook });
const scraperWebhook = new WebhookClient({ url: process.env.scraperWebhook });
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
            scraperWebhook.send({
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
    client.user.setActivity({
        type: ActivityType.Custom,
        name: "customstatus",
        state: "Scraping...",
    });

    try {
        const now = new Date();
        const baseURL =
            "https://www.lightnovelcave.com/browse/genre-all-25060123/order-popular/status-all?page=";
        let totalPages = 1;
        const novelsData = [];
        const updatedNovels = [];
        const updatedChapterNovels = [];
        (async () => {
            const browser = await puppeteer.launch({
                headless: true,
            });
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
            scraperWebhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `[LNC]` })
                        .setDescription(
                            `\`\`\`ansi\n[0;32m[LNC] Starting to scrape ${totalPages} pages...\`\`\``
                        ),
                ],
            });
            for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                const url = `${baseURL}${pageNumber}`;
                const maxRetries = 3;
                let retries = 0;
                while (retries < maxRetries) {
                    try {
                        await page.goto(url, {
                            waitUntil: "domcontentloaded",
                        });
                        break;
                    } catch (error) {
                        retries++;
                        scraperWebhook.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setAuthor({ name: `[LNC]` })
                                    .setDescription(
                                        `\`\`\`ansi\n[0;31m[LNC] Timeout error. Retrying page ${pageNumber}...\`\`\``
                                    ),
                            ],
                        });
                    }
                }
                const novelLinks = await page.evaluate(() => {
                    const novelItems = document.querySelectorAll(".novel-list .novel-item");
                    const links = [];
                    novelItems.forEach((item) => {
                        const novelURL = item.querySelector(".cover-wrap a").getAttribute("href");
                        links.push(novelURL);
                    });
                    return links;
                });
                const novelTitles = await page.evaluate(() => {
                    const novelItems = document.querySelectorAll(".novel-list .novel-item");
                    const titles = [];
                    novelItems.forEach((item) => {
                        const title = item.querySelector(".cover-wrap a").getAttribute("title");
                        titles.push(title);
                    });
                    return titles;
                });
                scraperWebhook.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `[LNC]` })
                            .setDescription(
                                `\`\`\`ansi\n[0;32m[LNC] Scraping page ${pageNumber} of ${totalPages}...\nNovels:\n${novelTitles.join(
                                    "\n"
                                )}\`\`\``
                            ),
                    ],
                });
                for (const novelLink of novelLinks) {
                    const novelURL = `https://www.lightnovelcave.com${novelLink}`;
                    const maxRetries = 3;
                    let retries = 0;
                    while (retries < maxRetries) {
                        try {
                            await page.goto(novelURL, {
                                waitUntil: "domcontentloaded",
                            });
                            break;
                        } catch (error) {
                            retries++;
                            scraperWebhook.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setAuthor({ name: `[LNC]` })
                                        .setDescription(
                                            `\`\`\`ansi\n[0;31m[LNC] Timeout error. Retrying page ${pageNumber}...\`\`\``
                                        ),
                                ],
                            });
                        }
                    }
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
                        const stringToNumber = (str) => {
                            const regex = /^(\d+(\.\d+)?)([BMK])$/;
                            const match = str.match(regex);
                            if (!match) {
                                return parseInt(str, 10);
                            }
                            const numericPart = parseFloat(match[1]);
                            const suffix = match[3];
                            switch (suffix) {
                                case "B":
                                    return numericPart * 1000000000;
                                case "M":
                                    return numericPart * 1000000;
                                case "K":
                                    return numericPart * 1000;
                                default:
                                    return parseInt(str, 10);
                            }
                        };
                        const views = stringToNumber(
                            document
                                .querySelector(".header-stats span:nth-child(2) strong")
                                .textContent.trim()
                        );
                        return views;
                    });
                    NovelDetails.bookmarks = await page.evaluate(() => {
                        const stringToNumber = (str) => {
                            const regex = /^(\d+(\.\d+)?)([BMK])$/;
                            const match = str.match(regex);
                            if (!match) {
                                return parseInt(str, 10);
                            }
                            const numericPart = parseFloat(match[1]);
                            const suffix = match[3];
                            switch (suffix) {
                                case "B":
                                    return numericPart * 1000000000;
                                case "M":
                                    return numericPart * 1000000;
                                case "K":
                                    return numericPart * 1000;
                                default:
                                    return parseInt(str, 10);
                            }
                        };
                        const bookmarks = stringToNumber(
                            document
                                .querySelector(".header-stats span:nth-child(3) strong")
                                .textContent.trim()
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
                        let update = false;
                        let chapterUpdate = false;
                        if (
                            !(
                                data.rank === NovelDetails.rank &&
                                data.rating === NovelDetails.rating &&
                                data.numChapter === NovelDetails.numChapter &&
                                data.views === NovelDetails.views &&
                                data.bookmarks === NovelDetails.bookmarks &&
                                data.status === NovelDetails.status &&
                                data.categories === NovelDetails.categories &&
                                data.summary === NovelDetails.summary &&
                                data.tags === NovelDetails.tags &&
                                data.cover === NovelDetails.cover &&
                                data.url === NovelDetails.url
                            )
                        ) {
                            update = true;
                            updatedNovels.push(NovelDetails);
                        }
                        if (data.numChapter !== NovelDetails.numChapter) {
                            chapterUpdate = true;
                            updatedChapterNovels.push(NovelDetails);
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
                                            .setTitle("New Chapter")
                                            .setURL(data.url)
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
            const end = new Date();
            const time = end - now;
            const { hours, minutes, seconds } = parseMilliseconds(time);
            scraperWebhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({ name: `[LNC]` })
                        .setDescription(
                            `\`\`\`ansi\n[0;34m[LNC] Finished scraping ${totalPages} pages.\n[LNC] Total novels scraped: ${novelsData.length}\n[LNC] Total novel with updated data: ${updatedNovels.length}\n[LNC] Total novels with updated chapters: ${updatedChapterNovels.length}\n[LNC] Time taken: ${hours}h ${minutes}m ${seconds}s\`\`\``
                        ),
                ],
            });
        })();
    } catch (error) {
        console.error("Error scraping Light Novel Cave:", error);
        scraperWebhook.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: `[LNC]` })
                    .setDescription(
                        `\`\`\`ansi\n[0;31m[LNC] Error scraping Light Novel Cave:\n${error}\`\`\``
                    ),
            ],
        });
    }
})();

setInterval(async () => {
    try {
        const now = new Date();
        const baseURL =
            "https://www.lightnovelcave.com/browse/genre-all-25060123/order-popular/status-all?page=";
        let totalPages = 1;
        const novelsData = [];
        const updatedNovels = [];
        const updatedChapterNovels = [];
        (async () => {
            const browser = await puppeteer.launch({
                headless: true,
            });
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
            scraperWebhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({ name: `[LNC]` })
                        .setDescription(
                            `\`\`\`ansi\n[0;32m[LNC] Starting to scrape ${totalPages} pages...\`\`\``
                        ),
                ],
            });
            for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
                const url = `${baseURL}${pageNumber}`;
                const maxRetries = 3;
                let retries = 0;
                while (retries < maxRetries) {
                    try {
                        await page.goto(url, {
                            waitUntil: "domcontentloaded",
                        });
                        break;
                    } catch (error) {
                        retries++;
                        scraperWebhook.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setAuthor({ name: `[LNC]` })
                                    .setDescription(
                                        `\`\`\`ansi\n[0;31m[LNC] Timeout error. Retrying page ${pageNumber}...\`\`\``
                                    ),
                            ],
                        });
                    }
                }
                const novelLinks = await page.evaluate(() => {
                    const novelItems = document.querySelectorAll(".novel-list .novel-item");
                    const links = [];
                    novelItems.forEach((item) => {
                        const novelURL = item.querySelector(".cover-wrap a").getAttribute("href");
                        links.push(novelURL);
                    });
                    return links;
                });
                const novelTitles = await page.evaluate(() => {
                    const novelItems = document.querySelectorAll(".novel-list .novel-item");
                    const titles = [];
                    novelItems.forEach((item) => {
                        const title = item.querySelector(".cover-wrap a").getAttribute("title");
                        titles.push(title);
                    });
                    return titles;
                });
                scraperWebhook.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `[LNC]` })
                            .setDescription(
                                `\`\`\`ansi\n[0;32m[LNC] Scraping page ${pageNumber} of ${totalPages}...\nNovels:\n${novelTitles.join(
                                    "\n"
                                )}\`\`\``
                            ),
                    ],
                });
                for (const novelLink of novelLinks) {
                    const novelURL = `https://www.lightnovelcave.com${novelLink}`;
                    const maxRetries = 3;
                    let retries = 0;
                    while (retries < maxRetries) {
                        try {
                            await page.goto(novelURL, {
                                waitUntil: "domcontentloaded",
                            });
                            break;
                        } catch (error) {
                            retries++;
                            scraperWebhook.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Red")
                                        .setAuthor({ name: `[LNC]` })
                                        .setDescription(
                                            `\`\`\`ansi\n[0;31m[LNC] Timeout error. Retrying page ${pageNumber}...\`\`\``
                                        ),
                                ],
                            });
                        }
                    }
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
                        const stringToNumber = (str) => {
                            const regex = /^(\d+(\.\d+)?)([BMK])$/;
                            const match = str.match(regex);
                            if (!match) {
                                return parseInt(str, 10);
                            }
                            const numericPart = parseFloat(match[1]);
                            const suffix = match[3];
                            switch (suffix) {
                                case "B":
                                    return numericPart * 1000000000;
                                case "M":
                                    return numericPart * 1000000;
                                case "K":
                                    return numericPart * 1000;
                                default:
                                    return parseInt(str, 10);
                            }
                        };
                        const views = stringToNumber(
                            document
                                .querySelector(".header-stats span:nth-child(2) strong")
                                .textContent.trim()
                        );
                        return views;
                    });
                    NovelDetails.bookmarks = await page.evaluate(() => {
                        const stringToNumber = (str) => {
                            const regex = /^(\d+(\.\d+)?)([BMK])$/;
                            const match = str.match(regex);
                            if (!match) {
                                return parseInt(str, 10);
                            }
                            const numericPart = parseFloat(match[1]);
                            const suffix = match[3];
                            switch (suffix) {
                                case "B":
                                    return numericPart * 1000000000;
                                case "M":
                                    return numericPart * 1000000;
                                case "K":
                                    return numericPart * 1000;
                                default:
                                    return parseInt(str, 10);
                            }
                        };
                        const bookmarks = stringToNumber(
                            document
                                .querySelector(".header-stats span:nth-child(3) strong")
                                .textContent.trim()
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
                        let update = false;
                        let chapterUpdate = false;
                        if (
                            !(
                                data.rank === NovelDetails.rank &&
                                data.rating === NovelDetails.rating &&
                                data.numChapter === NovelDetails.numChapter &&
                                data.views === NovelDetails.views &&
                                data.bookmarks === NovelDetails.bookmarks &&
                                data.status === NovelDetails.status &&
                                data.categories === NovelDetails.categories &&
                                data.summary === NovelDetails.summary &&
                                data.tags === NovelDetails.tags &&
                                data.cover === NovelDetails.cover &&
                                data.url === NovelDetails.url
                            )
                        ) {
                            update = true;
                            updatedNovels.push(NovelDetails);
                        }
                        if (data.numChapter !== NovelDetails.numChapter) {
                            chapterUpdate = true;
                            updatedChapterNovels.push(NovelDetails);
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
                                            .setTitle("New Chapter")
                                            .setURL(data.url)
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
            const end = new Date();
            const time = end - now;
            const { hours, minutes, seconds } = parseMilliseconds(time);
            scraperWebhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({ name: `[LNC]` })
                        .setDescription(
                            `\`\`\`ansi\n[0;34m[LNC] Finished scraping ${totalPages} pages.\n[LNC] Total novels scraped: ${novelsData.length}\n[LNC] Total novel with updated data: ${updatedNovels.length}\n[LNC] Total novels with updated chapters: ${updatedChapterNovels.length}\n[LNC] Time taken: ${hours}h ${minutes}m ${seconds}s\`\`\``
                        ),
                ],
            });
        })();
    } catch (error) {
        console.error("Error scraping Light Novel Cave:", error);
    }
}, 1000 * 60 * 60);

const embed = new EmbedBuilder().setColor("Red").setAuthor({ name: `[SCRAPER]` });
process.on("unhandledRejection", (reason, promise) => {
    if (reason instanceof DiscordAPIError && reason.code === 10062) return;
    let reasonString = reason instanceof Error ? reason.stack : String(reason);
    embed.setDescription(
        `\`\`\`ansi\n[0;31m[SCRAPER] Unhandled Rejection at ${promise}\n[BOT] Unhandled Rejection reason:\n${reasonString}\`\`\``
    );
    scraperWebhook
        .send({ embeds: [embed] })
        .catch((e) => console.log(`[BOT] Webhook failed to send`));
    console.log(
        `[BOT] Unhandled Rejection at ${promise}\n[BOT] Unhandled Rejection reason: ${
            reason.stack
        }\n${new Date(Date.now())}`
    );
});

process.on("uncaughtException", (error, origin) => {
    let errorString = error instanceof Error ? error.stack : String(error);
    embed.setDescription(
        `\`\`\`ansi\n[0;31m[SCRAPER] Uncaught Exception at ${origin}\n[BOT] Uncaught Exception error:\n${errorString}\`\`\``
    );
    scraperWebhook
        .send({ embeds: [embed] })
        .catch((e) => console.log(`[BOT] Webhook failed to send`));
    console.log(
        `[BOT] Uncaught Exception at ${origin}\n[BOT] Uncaught Exception error: ${
            error.stack
        }\n${new Date(Date.now())}`
    );
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
    let errorString = error instanceof Error ? error.stack : String(error);
    embed.setDescription(
        `\`\`\`ansi\n[0;31m[SCRAPER] Uncaught Exception Monitor at ${origin}\n[BOT] Uncaught Exception Monitor error:\n${errorString}\`\`\``
    );
    scraperWebhook
        .send({ embeds: [embed] })
        .catch((e) => console.log(`[BOT] Webhook failed to send`));
    console.log(
        `[BOT] Uncaught Exception Monitor at ${origin}\n[BOT] Uncaught Exception Monitor error: ${
            error.stack
        }\n${new Date(Date.now())}`
    );
});
