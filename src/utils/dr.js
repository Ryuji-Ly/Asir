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

(async () => {
    const novels = await novelModel.find();
    const uniqueNovels = [];
    for (const novel of novels) {
        const isUnique = !uniqueNovels.some(
            (unique) => unique.title === novel.title && unique.author === novel.author
        );
        if (isUnique) {
            uniqueNovels.push(novel);
        } else {
            await novelModel.findByIdAndDelete(novel._id);
        }
    }
    console.log(uniqueNovels.length);
})();
