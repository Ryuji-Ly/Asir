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
const fs = require("fs");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessageReactions,
    ],
});
const mongoose = require("mongoose");

client.commands = new Collection();

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
        console.log("✅ Connected to the database!");
    })
    .catch((err) => {
        console.log(err);
    });

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token);
})();
