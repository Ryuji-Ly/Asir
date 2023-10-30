const {
    Interaction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} = require("discord.js");

/**
 *
 * @param {Interaction} interaction
 * @param {*} pages
 * @param {*} time
 */
async function buttonPages(interaction, pages, time = 60000) {
    //errors
    if (!interaction) throw new Error("Please provide an interaction argument");
    if (!pages) throw new Error("Please provide a page argument");
    if (!Array.isArray(pages)) throw new Error("Pages bust be an array");

    if (typeof time !== "number") throw new Error("Time must be a number");
    if (parseInt(time) < 30000)
        throw new Error("Time must be greater than 30 seconds");
    await interaction.deferReply().catch((err) => {
        return;
    });
    //no buttons if there is only one page
    if (pages.length === 1) {
        const page = await interaction.editReply({
            embed: pages,
            components: [],
            fetchReply: true,
        });
        return page;
    }

    //adding buttons
    const prev = new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true);
    const home = new ButtonBuilder()
        .setCustomId("home")
        .setEmoji("🏠")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true);
    const next = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary);

    const buttonRow = new ActionRowBuilder().addComponents(prev, home, next);
    let index = 0;

    const currentPage = await interaction.editReply({
        embeds: [pages[index]],
        components: [buttonRow],
        fetchReply: true,
    });

    //creating the collector
    const collector = await currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time,
    });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id)
            return i.reply({
                content: "You can't use these buttons",
                ephemeral: true,
            });

        await i.deferUpdate();

        if (i.customId === "prev") {
            if (index > 0) index--;
        } else if (i.customId === "home") {
            index = 0;
        } else if (i.customId === "next") {
            if (index < pages.length - 1) index++;
        }

        if (index === 0) prev.setDisabled(true);
        else prev.setDisabled(false);
        if (index === 0) home.setDisabled(true);
        else home.setDisabled(false);
        if (index === 0) next.setDisabled(false);
        if (index === pages.length - 1) next.setDisabled(true);

        await currentPage.edit({
            embeds: [pages[index]],
            components: [buttonRow],
        });

        collector.resetTimer();
    });
    //ending the collector
    collector.on("end", async (i) => {
        await currentPage.edit({
            embeds: [pages[index]],
            components: [],
        });
    });
    return await currentPage;
}

module.exports = buttonPages;
