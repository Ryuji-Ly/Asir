const { Schema, model } = require("mongoose");

const shopItemsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        default: [],
    },
});

module.exports = model("ShopItems", shopItemsSchema);
