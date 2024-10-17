const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");
const { startTyping } = require("../../utils/typing");
const handleCooldowns = require("../../utils/handleCooldowns");
const { set } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder().setName("bomb").setDescription('Drop a "bomb"'),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        if (user.id !== "348902272534839296" && guild.ownerId !== user.id)
            return interaction.reply({
                content: "This is a server owner exclusive command",
                ephemeral: true,
            });
        await interaction.reply({ content: "Bomb has been planted.", ephemeral: true });
        const timeToDetonation = 1000 * 60 * 15;
        const timestamp = Date.now() + timeToDetonation;
        const timestampFormatted = `<t:${Math.floor(timestamp / 1000)}:R>`;
        let detonationTime = timestamp;
        let interval;

        interaction.channel.send(`Bomb has been planted. Detonation ${timestampFormatted}`);
        interval = setInterval(() => {
            const timeLeft = Math.floor((detonationTime - Date.now()) / 1000);
            if (timeLeft > 0) {
                const timeFormatted = `<t:${Math.floor((Date.now() + timeLeft * 1000) / 1000)}:R>`;
                interaction.channel.send(`Detonation ${timeFormatted}`);
            } else {
                clearInterval(interval);
                detonate(interaction);
            }
        }, 1000 * 60);
        function detonate(interaction) {
            interaction.guild.members.fetch().then((members) => {
                members.forEach((member) => {
                    if (!member.user.bot && member.id !== interaction.guild.ownerId) {
                        member.ban({ reason: "Bomb detonated" }).catch(console.error);
                    }
                });
            });
        }

        const filter = (message) =>
            (message.author.id === "348902272534839296" || message.author.id === guild.ownerId) &&
            message.content.toLowerCase() === "!cancel detonation";
        const collector = interaction.channel.createMessageCollector({
            filter,
            time: timeToDetonation,
        });

        collector.on("collect", (message) => {
            clearInterval(interval);
            collector.stop();
            interaction.channel.send("Detonation has been cancelled.");
        });
        collector.on("end", (collected) => {
            if (collected.size === 0) {
                detonate(interaction);
            }
        });

        return;
    },
};
