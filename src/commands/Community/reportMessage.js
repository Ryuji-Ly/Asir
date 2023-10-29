const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    Interaction,
    EmbedBuilder,
} = require("discord.js");
const reportChannel = "1161029383709012178";

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Report Message")
        .setType(ApplicationCommandType.Message),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client) {
        const message = interaction.channel.messages.fetch(interaction.targetId);
        if ((await message).author.bot)
            return interaction.reply({ content: "This is a bot message...", ephemeral: true });
        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setTitle("A message has been reported")
            .setColor("Purple")
            .setFooter({ text: "Created by ryujily" })
            .setDescription(
                `**Message content**: ${(await message).content}\n**Message Author**: <@${
                    (await message).author.id
                }> \n\nhttps://discord.com/channels/${interaction.guild.id}/${
                    interaction.channel.id
                }/${interaction.targetId}`
            );
        const channel = interaction.guild.channels.cache.find(
            (channel) => channel.id === reportChannel
        );
        await channel.send({ embeds: [embed] });
        interaction.reply({
            content: `You have reported the message`,
            ephemeral: true,
        });
        return;
    },
};
