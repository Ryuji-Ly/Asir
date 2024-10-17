const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Roll a die!")
        .addIntegerOption((option) =>
            option
                .setName("faces")
                .setDescription("The number of faces you want the dice to have")
                .setMinValue(4)
                .setMaxValue(20)
        )
        .addBooleanOption((option) =>
            option
                .setName("hidden")
                .setDescription("Whether you want the result to be hidden or not")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const face = options.getInteger("faces") || 6;
        const hidden = options.getBoolean("hidden") || false;
        const num = Math.floor(Math.random() * face) + 1;
        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`${user.username} has rolled a d${face}!`)
            .setDescription(`:game_die: Rolling... :game_die:`);
        if (hidden === true) embed.setFooter({ text: "The results will be hidden." });
        await interaction.reply({ embeds: [embed] }).then((m) => {
            setTimeout(() => {
                const nums = [8, 11, 18, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
                let desc = `:game_die: You have rolled a ${num}! :game_die:`;
                if (nums.includes(num)) desc = `:game_die: You have rolled an ${num}! :game_die:`;
                embed.setDescription(desc);
                if (hidden === true) {
                    m.interaction.followUp({ embeds: [embed], ephemeral: true });
                    m.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Blurple")
                                .setTitle(`${user.username} has rolled a d${face}!`)
                                .setDescription(`:game_die: The results are hidden. :game_die:`)
                                .setFooter({ text: "The results are hidden." }),
                        ],
                    });
                } else m.edit({ embeds: [embed] });
            }, 1000);
        });
        return;
    },
};
