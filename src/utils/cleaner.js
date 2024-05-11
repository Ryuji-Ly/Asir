const tagsMapping = [
    { censored: "S*laves", uncensored: "Slaves" },
    { censored: "F*llatio", uncensored: "Fellatio" },
    { censored: "First-time Interc**rse", uncensored: "First-time Intercourse" },
    { censored: "An*l", uncensored: "Anal" },
    { censored: "H*ndjob", uncensored: "Handjob" },
    { censored: "S*lave Protagonist", uncensored: "Slave Protagonist" },
    { censored: "S*xual Abuse", uncensored: "Sexual Abuse" },
    { censored: "C*nnilingus", uncensored: "Cunnilingus" },
    { censored: "S*xual Cultivation Technique", uncesored: "Sexual Cultivation Technique" },
    { censored: "S*x Friends", uncesored: "Sex Friends" },
    { censored: "Prostit**es", uncensored: "Prostitutes" },
    { censored: "M*strubation", uncensored: "Mastrubation" },
    { censored: "Outdoor Interc**rse", uncesored: "Outdoor Intercourse" },
    { censored: "S*x S*aves", uncensored: "Sex Slaves" },
    { censored: "Or*y", uncensored: "Orgy" },
    { censored: "F**anari", uncensored: "Futanari" },
];
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
    const updatedNovels = [];
    for (const novel of novels) {
        const tags = novel.tags;
        const containsCensoredTags = tags.some((tag) =>
            tagsMapping.some((mapping) => tag.includes(mapping.censored))
        );
        if (containsCensoredTags) {
            const updatedTags = tags.map((tag) => {
                const mapping = tagsMapping.find((mapping) => tag.includes(mapping.censored));
                return mapping ? tag.replace(mapping.censored, mapping.uncensored) : tag;
            });
            updatedNovels.push(novel.title);
            await novelModel.findByIdAndUpdate(novel._id, { tags: updatedTags });
        }
    }
    console.log(updatedNovels.length);
})();
