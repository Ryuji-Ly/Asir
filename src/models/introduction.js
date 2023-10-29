const { Schema, model } = require("mongoose");

const introSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    hobbies: {
        type: String,
        default: "",
    },
    animeWatched: {
        type: String,
        default: "",
    },
    mangaRead: {
        type: String,
        default: "",
    },
    novelRead: {
        type: String,
        default: "",
    },
    subOrDub: {
        type: String,
        default: "",
    },
    favGenre: {
        type: String,
        default: "",
    },
    favAnime: {
        type: String,
        default: "",
    },
    favManga: {
        type: String,
        default: "",
    },
    favNovel: {
        type: String,
        default: "",
    },
    imgLink: {
        type: String,
        default: "",
    },
});

module.exports = model("introduction", introSchema);
