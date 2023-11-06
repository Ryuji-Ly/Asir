const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
    Permissions,
    MessageManager,
    Embed,
    Collection,
} = require(`discord.js`);
const GuildConfig = require("./models/guildConfiguration");
const fs = require("fs");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
    ],
});
const mongoose = require("mongoose");
var colors = require("colors");
colors.enable();

client.commands = new Collection();
client.configs = new Collection();

require("dotenv").config();

const functions = fs.readdirSync("./src/functions").filter((file) => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

mongoose
    .connect(process.env.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("[DATABASE] Connected to the database!".green);
    })
    .catch((err) => {
        console.log(`[DATABASE] Error with connecting to database: ${err}`);
    });

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    await client.handleEvents(eventFiles, "./src/events");
    await client.handleCommands(commandFolders, "./src/commands");
    await client.login(process.env.token);
    client.guilds.cache.forEach(async (guild) => {
        const data = await GuildConfig.findOne({ guildId: guild.id });
        client.configs.set(guild.id, data);
    });
})();
