const mongoose = require("mongoose");

const Messagecount = new mongoose.Schema({
    guildId: {
        type: String,
        require: true,
    },
    categoryId: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
});

const model = mongoose.model("ticket", Messagecount);

module.exports = model;
