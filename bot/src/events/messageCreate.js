var colors = require("colors");
colors.enable();
const guildConfiguration = require("../models/guildConfiguration");
const ProfileModel = require("../models/profileSchema");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        return;
    },
};
