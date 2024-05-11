const { author } = require("canvacord");
const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    numChapter: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        required: true,
    },
    bookmarks: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

const model = mongoose.model("novel", novelSchema);

module.exports = model;
