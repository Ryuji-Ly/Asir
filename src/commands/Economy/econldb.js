const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const Big = require("big.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("economy-ldb")
        .setDescription("Show the richest users in the server."),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        if (config.economy.enabled === false)
            return interaction.reply({
                content: "Economy is disabled in this server.",
                ephemeral: true,
            });
        await interaction.deferReply();
        const users = await UserDatabase.find({ "key.guildId": guild.id });
        const sorted = users.sort(
            (a, b) => b.economy.wallet + b.economy.bank - (a.economy.wallet + a.economy.bank)
        );
        const currentRank = sorted.findIndex((data) => data.key.userId === user.id) + 1;
        const top = sorted.slice(0, 10);
        const embed = new EmbedBuilder()
            .setTitle(`Top 10 Richest Users`)
            .setColor("Purple")
            .setTimestamp()
            .setFooter({
                text: `You are rank ${currentRank}.`,
            })
            .setThumbnail(guild.iconURL());
        let desc = "";
        for (let i = 0; i < top.length; i++) {
            let { user } = await interaction.guild.members.fetch(top[i].key.userId);
            if (!user) return;
            let userWallet = top[i].economy.wallet;
            let userBank = top[i].economy.bank;
            let total = new Big(userWallet).plus(new Big(userBank));
            total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            desc += `**${i + 1}.** ${user}: \`Total ${total}\`\n`;
        }
        embed.setDescription(desc);
        await interaction.editReply({ embeds: [embed] });
        return;
    },
};
