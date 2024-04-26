var colors = require("colors");
colors.enable();

module.exports = {
    name: "guildDelete",
    async execute(guild, client) {
        // await guildConfiguration.deleteMany({ guildId: guild.id });
        // await Group.deleteMany({ guildId: guild.id });
        // await Introductions.deleteMany({ guildId: guild.id });
        // await ProfileModel.deleteMany({ guildId: guild.id });
        // await Suggestion.deleteMany({ guildId: guild.id });
        console.log(`[BOT] Left ${guild.name}`.cyan);
    },
};
