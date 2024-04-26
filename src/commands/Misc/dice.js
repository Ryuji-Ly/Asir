const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const handleCooldowns = require("../../utils/handleCooldowns");

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
                if (hidden === true) m.interaction.followUp({ embeds: [embed], ephemeral: true });
                else m.edit({ embeds: [embed] });
            }, 1000);
        });
        return;
    },
};
