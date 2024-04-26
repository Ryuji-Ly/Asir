const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const { default: axios } = require("axios");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("steal-emoji")
        .setDescription("STEAL, PLUNDER, PILLAGE, LOOT... emojis!")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
        .addStringOption((option) =>
            option.setName("emoji").setDescription("The emoji you want to steal").setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Hide your crimes by renaming the loot")
                .setRequired(true)
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;
        const config = await client.configs.get(guild.id);
        let cooldown = 0;
        if (
            config.commands.cooldowns.filter((c) => c.name === interaction.commandName).length > 0
        ) {
            cooldown = config.commands.cooldowns.find(
                (c) => c.name === interaction.commandName
            ).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        let emoji = options.getString("emoji")?.trim();
        const name = options.getString("name");
        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];
            const type = await axios
                .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                .then((image) => {
                    if (image) return "gif";
                    else return "png";
                })
                .catch((err) => {
                    return "png";
                });
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }
        if (!emoji.startsWith("http")) {
            return await interaction.reply({
                content:
                    'You cannot steal default emojis or the selected "emoji" is not really an emoji',
                ephemeral: true,
            });
        }
        if (!emoji.startsWith("https")) {
            return await interaction.reply({
                content: "You cannot steal default emojis",
                ephemeral: true,
            });
        }
        await guild.emojis
            .create({ attachment: `${emoji}`, name: `${name}` })
            .then((emoji) => {
                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`Added ${emoji} with the name **${name}**`);
                return interaction.reply({ embeds: [embed] });
            })
            .catch((err) => {
                interaction.reply({
                    content:
                        "You cannot add this emoji because you have reached your server emoji limit",
                    ephemeral: true,
                });
            });
        return;
    },
};
