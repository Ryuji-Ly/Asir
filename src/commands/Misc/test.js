const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    Embed,
    ButtonBuilder,
    ButtonStyle,
    ActionRow,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testing")
        .setDescription("Testing button amount limits"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        const embed = new EmbedBuilder()
            .setDescription("Testing the limit of how many buttons can be added on a message")
            .setColor("Purple");
        const button1 = new ButtonBuilder()
            .setCustomId("one")
            .setStyle(ButtonStyle.Primary)
            .setLabel("\u200b");
        const button2 = new ButtonBuilder()
            .setCustomId("two")
            .setStyle(ButtonStyle.Primary)
            .setLabel("\u200b");
        const button3 = new ButtonBuilder()
            .setCustomId("three")
            .setStyle(ButtonStyle.Primary)
            .setLabel("\u200b");
        const button4 = new ButtonBuilder()
            .setCustomId("four")
            .setStyle(ButtonStyle.Primary)
            .setLabel("\u200b");
        const button5 = new ButtonBuilder()
            .setCustomId("five")
            .setStyle(ButtonStyle.Primary)
            .setLabel("\u200b");
        const menu = new StringSelectMenuBuilder()
            .setCustomId("test_menu")
            .setPlaceholder("Select")
            .addOptions({ label: "A", value: "a" }, { label: "B", value: "b" });
        const row1 = new ActionRowBuilder().addComponents(button1);
        const row2 = new ActionRowBuilder().addComponents(button2);
        const row3 = new ActionRowBuilder().addComponents(button3);
        const row4 = new ActionRowBuilder().addComponents(button4);
        const row5 = new ActionRowBuilder().addComponents(button5);
        const row6 = new ActionRowBuilder().addComponents(menu);
        const msg = await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3, row4, row6],
            ephemeral: true,
        });
        const collector = msg.createMessageComponentCollector();
        collector.on("collect", async (i) => {
            const m = await i.reply({ components: [row5], ephemeral: true });
            const message = await interaction.channel.messages.fetch(m.interaction.message.id);
            console.log(message);
        });
        return;
    },
};
