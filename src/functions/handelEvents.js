var colors = require("colors");
colors.enable();

module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        console.log(`[BOT] Loaded ${eventFiles.length} event listeners.`.blue);
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    };
};
