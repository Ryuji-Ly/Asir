const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("secret-message")
        .setDescription("Send a message that only the person you select can read!")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user who can see the secret message")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("The message you want to keep a secret from the others.")
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
        if (config.cooldowns.filter((c) => c.name === interaction.commandName).length > 0) {
            cooldown = config.cooldowns.find((c) => c.name === interaction.commandName).value;
        } else cooldown = 0;
        const cd = await handleCooldowns(interaction, cooldown);
        if (cd === false) return;
        const target = options.getUser("user");
        const secret = options.getString("message");
        if (target.id === user.id) {
            await interaction.reply({
                content: `You have sent a secret message to ${target} with the contents: ${secret}`,
                ephemeral: true,
            });
            const message = await interaction.channel.send(
                `${user} just tried to send a secret message to themselves!\n\nThe secret message was: ${secret}`
            );
            setTimeout(() => {
                message.delete();
            }, 1000 * 30);
        }
        const embed = new EmbedBuilder()
            .setDescription(`${user} sent a secret message to ${target}`)
            .setColor("Purple");
        const button = new ButtonBuilder()
            .setCustomId("secretMessage")
            .setEmoji("✉️")
            .setLabel("Secret Message")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder().addComponents(button);
        interaction.reply({
            content: `You have sent a secret message to ${target} with the contents: ${secret}`,
            ephemeral: true,
        });
        const message = await interaction.channel.send({
            content: `${target}`,
            embeds: [embed],
            components: [row],
        });
        const collector = message.createMessageComponentCollector();
        collector.on("collect", async (i) => {
            const embed = new EmbedBuilder()
                .setTitle(`Secret message from ${user.username}`)
                .setColor("Purple")
                .setDescription(`${secret}`);
            if (i.user.id === target.id) {
                await i.reply({ embeds: [embed], ephemeral: true });
            } else if (i.user.id === user.id) {
                await i.reply({ embeds: [embed], ephemeral: true });
            } else {
                return await i.reply({
                    content: "Ew. Look here, someone wanted to see the secrets of others.",
                    ephemeral: true,
                });
            }
        });
        return;
    },
};
