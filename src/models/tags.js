const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
});

const model = mongoose.model("tag", novelSchema);

module.exports = model;
