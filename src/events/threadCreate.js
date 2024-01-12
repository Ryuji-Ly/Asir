const {
    EmbedBuilder,
    ThreadChannel,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");

module.exports = {
    name: "threadCreate",
    /**
     *
     * @param {ThreadChannel} thread
     * @param {*} newlyCreated
     * @param {*} client
     * @returns
     */
    async execute(thread, newlyCreated, client) {
        if (thread.parentId === "1189669061286695033") {
            thread.messages.fetch({ limit: 1 }).then(async (messages) => {
                const message = messages.first();
                await message.pin();
            });
            const embed = new EmbedBuilder()
                .setTitle(`Welcome to help channels!`)
                .setDescription(
                    "Please make sure you describe your issue **thoroughly** and **clearly**. This will help us help you faster!\n\nGuidelines: Please provide us with the section of the code that is causing your issue, this can be done using codeblocks, https://sourceb.in/ or https://pastebin.com/\nIf you received an error, please include the entire error message as well."
                )
                .setColor("Blue")
                .setTimestamp();
            await thread.send({ embeds: [embed] });
            const collector = thread.createMessageCollector();
            let timeout;
            collector.on("collect", async (m) => {
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    const inactivityEmbed = new EmbedBuilder()
                        .setTitle("Need more help?")
                        .setDescription(
                            'This thread has been inactive for 12 hours\nStill need help? Use the "I need help!" button below to notify our helpers!'
                        )
                        .setTimestamp();
                    const helpButton = new ButtonBuilder()
                        .setCustomId("stillNeedHelp")
                        .setLabel("I need help!")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("⚠️");
                    const solvedButton = new ButtonBuilder()
                        .setCustomId("problemSolved")
                        .setLabel("Solved")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji("✔️");
                    const inactivityButtons = new ActionRowBuilder().addComponents(
                        helpButton,
                        solvedButton
                    );
                    const message = await m.channel.send({
                        content: `<@${thread.ownerId}>`,
                        embeds: [inactivityEmbed],
                        components: [inactivityButtons],
                    });
                    const collector = message.createMessageComponentCollector();
                    collector.on("collect", async (i) => {
                        if (i.user.id !== thread.ownerId) {
                            return i.reply({
                                content: "These can only be used by the original poster",
                                ephemeral: true,
                            });
                        }
                        if (i.customId === "stillNeedHelp") {
                            const helperRoleId = "1195122213301538826";
                            await i.channel.send(`<@&${helperRoleId}>`);
                        } else if (i.customId === "problemSolved") {
                            await thread.setLocked();
                            i.reply({
                                content: "The thread has been locked!",
                                ephemeral: true,
                            });
                            helpButton.setDisabled(true);
                            solvedButton.setDisabled(true);
                        }
                    });
                }, 1000 * 60 * 60 * 12);
            });
        }
        if (thread.parentId === "1194726695731740712") {
            thread.messages.fetch({ limit: 1 }).then(async (messages) => {
                const message = messages.first();
                await message.pin();
            });
        }
    },
};
