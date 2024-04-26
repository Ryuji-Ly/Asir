const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    Interaction,
    EmbedBuilder,
} = require("discord.js");
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Report Message")
        .setDMPermission(false)
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
        const guildconfig = await client.configs.get(interaction.guild.id);
        if (guildconfig.channels.report === "")
            return interaction.reply({
                content:
                    "The Report Message function has not been configured yet, please ask the server owner to configure the report channel",
                ephemeral: true,
            });
        const channel = interaction.guild.channels.cache.find(
            (channel) => channel.id === guildconfig.channels.report
        );
        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
            })
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
        await channel.send({ embeds: [embed] });
        interaction.reply({
            content: `You have reported the message`,
            ephemeral: true,
        });
        return;
    },
};
