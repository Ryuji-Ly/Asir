const { model, Schema } = require("mongoose");

module.exports = model(
    "Infractions",
    new Schema({
        UserId: String,
        Guild: String,
        Infractions: Array,
    })
);
