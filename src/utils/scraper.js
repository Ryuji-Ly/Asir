const puppeteer = require("puppeteer");
const novelModel = require("../models/novels");
const mongoose = require("mongoose");
require("dotenv").config();
(async () => {
    await mongoose
        .connect(process.env.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("[DATABASE] Connected to the database!");
        })
        .catch((err) => {
            console.log(`[DATABASE] Error with connecting to database: ${err.stack}`);
        });
})();
const baseURL =
    "https://www.lightnovelcave.com/browse/genre-all-25060123/order-new/status-all?page=";
let totalPages = 1;
const novelsData = [];
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(baseURL, { waitUntil: "domcontentloaded" });
    totalPages = await page.evaluate(() => {
        const lastPage = parseInt(
            document
                .querySelector(".paging .pagination-container .pagination .PagedList-skipToLast a")
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
            console.log("Scraping novel:", novelURL);
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
                    .querySelector(".novel-body #info .summary .content p")
                    .textContent.trim()
                    .replace(/<br\s*\/?>/g, "\n");
                return summary;
            });
            NovelDetails.tags = await page.evaluate(() => {
                const tags = [];
                document.querySelectorAll(".tags .expand-wrapper .content li a").forEach((tag) => {
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
            await novelModel.findOneAndUpdate(
                { title: NovelDetails.title, author: NovelDetails.author },
                { $set: { url: NovelDetails.url } }
            );
            // const novel = new novelModel({
            //     title: NovelDetails.title,
            //     author: NovelDetails.author,
            //     rank: NovelDetails.rank,
            //     rating: NovelDetails.rating,
            //     numChapter: NovelDetails.numChapter,
            //     views: NovelDetails.views,
            //     bookmarks: NovelDetails.bookmarks,
            //     status: NovelDetails.status,
            //     categories: NovelDetails.categories,
            //     summary: NovelDetails.summary,
            //     tags: NovelDetails.tags,
            //     cover: NovelDetails.cover,
            //     url: NovelDetails.url,
            // });
            // await novel.save();
            console.log(NovelDetails);
            // Wait briefly before scraping the next novel (to be polite to the website)
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    await browser.close();
    console.log("Total novels scraped:", novelsData.length);
    const novels = await novelModel.find();
    console.log("Novels saved to database:", novels.length);
})();
