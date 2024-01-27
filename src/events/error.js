var colors = require(`colors`);
colors.enable();

module.exports = {
    name: "error",
    async execute(error, client) {
        console.log(`[BOT] ${error.stack}\n${new Date(Date.now())}`.red);
        return;
    },
};
