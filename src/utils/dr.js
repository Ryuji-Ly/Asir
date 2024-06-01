const novelModel = require("../models/novels");
const tagModel = require("../models/tags");
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

(async () => {
    const novels = await novelModel.find();
    // const uniqueNovels = [];
    const uniqueCategories = [];
    const uniqueTags = [];
    for (const novel of novels) {
        // const categories = novel.categories;
        // const tags = novel.tags;
        // for (const category of categories) {
        //     if (!uniqueCategories.includes(category)) {
        //         uniqueCategories.push(category);
        //     }
        // }
        // for (const tag of tags) {
        //     if (!uniqueTags.includes(tag)) {
        //         uniqueTags.push(tag);
        //     }
        // }
        // if (isUnique) {
        //     uniqueNovels.push(novel);
        // } else {
        //     await novelModel.findByIdAndDelete(novel._id);
        // }
    }
    console.log(uniqueTags.length);
})();
