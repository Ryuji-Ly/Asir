var colors = require("colors");
colors.enable();
const guildConfiguration = require("../models/guildConfiguration");
const Group = require("../models/group");
const Infractions = require("../models/infractions");
const Introductions = require("../models/introduction");
const ProfileModel = require("../models/profileSchema");
const Suggestion = require("../models/suggestion");

module.exports = {
    name: "guildDelete",
    async execute(guild, client) {
        // await guildConfiguration.deleteMany({ guildId: guild.id });
        // await Group.deleteMany({ guildId: guild.id });
        // await Infractions.deleteMany({ guildId: guild.id });
        // await Introductions.deleteMany({ guildId: guild.id });
        // await ProfileModel.deleteMany({ guildId: guild.id });
        // await Suggestion.deleteMany({ guildId: guild.id });
        console.log(`[BOT] Left ${guild.name}`.cyan);
    },
};
