const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const UserDatabase = require("../../models/userSchema");
const handleCooldowns = require("../../utils/handleCooldowns");
const Big = require("big.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Displays information about a user")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user whose information you want to see")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        const target = options.getUser("user") || user;
        const member = await guild.members.fetch(target.id);
        const icon = target.displayAvatarURL();
        const tag = target.username;
        await interaction.deferReply();
        const data = await UserDatabase.findOne({ key: { userId: target.id, guildId: guild.id } });
        const color = member.displayHexColor;
        const embed = new EmbedBuilder()
            .setAuthor({ name: tag, iconURL: icon })
            .setFooter({ text: `User ID: ${target.id}` })
            .setColor(`${color}`);

        if (config.level.enabled) {
            embed.addFields({
                name: `Level`,
                value: `${data.level.level}`,
                inline: true,
            });
        }
        if (config.economy.enabled) {
            let wallet = new Big(data.economy.wallet);
            let bank = new Big(data.economy.bank);
            wallet = wallet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            bank = bank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            embed.addFields(
                {
                    name: `Wallet`,
                    value: `${wallet} ${config.economy.currencySymbol}`,
                    inline: true,
                },
                {
                    name: `Bank`,
                    value: `${bank} ${config.economy.currencySymbol}`,
                    inline: true,
                }
            );
        }
        embed.addFields({
            name: `Message count`,
            value: `${new Big(data.data.messages)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
            inline: true,
        });
        embed.addFields({
            name: `Daily, weekly, monthly, yearly messages`,
            value: `Daily messages: ${new Big(data.data.timeBasedStats.dailyMessages)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nWeekly messages: ${new Big(
                data.data.timeBasedStats.weeklyMessages
            )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nMonthly messsages: ${new Big(
                data.data.timeBasedStats.monthlyMessages
            )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\nYearly messages: ${new Big(
                data.data.timeBasedStats.yearlyMessages
            )
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
            inline: true,
        });
        let count = 0;
        for (let i = 0; i < data.data.commands.length; i++) {
            count += data.data.commands[i].value;
        }
        embed.addFields(
            {
                name: "Command count",
                value: `${new Big(count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
                inline: true,
            },
            {
                name: "Warnings & infractions",
                value: `${data.data.warnings} warnings. ${data.data.infractions.length} infractions.`,
            }
        );
        embed.addFields(
            {
                name: `Roles`,
                value: `${
                    member.roles.cache
                        .filter((r) => r.id !== guild.id)
                        .map((r) => r)
                        .join(" ") || "No roles"
                }`,
                inline: false,
            },
            {
                name: `Joined Server`,
                value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
                inline: true,
            },
            {
                name: "Joined Discord",
                value: `<t:${parseInt(target.createdAt / 1000)}:R>`,
                inline: true,
            }
        );
        await interaction.editReply({
            embeds: [embed],
        });
        return;
    },
};
