const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const ProfileModel = require("../../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");
const handleCooldowns = require("../../utils/handleCooldowns");
const cards = {
    C2: "<:2C:1192958731370102835>",
    C3: "<:3C:1192958816204095540>",
    C4: "<:4C:1192958911452549272>",
    C5: "<:5C:1192958970881654875>",
    C6: "<:6C:1192959093325971527>",
    C7: "<:7C:1192960134046040084>",
    C8: "<:8C:1192960272806203532>",
    C9: "<:9C:1192960369287766147>",
    C10: "<:10C:1192960383758127235>",
    CJ: "<:JC:1192962014830669868>",
    CQ: "<:QC:1192962028344713356>",
    CK: "<:KC:1192962460962009138>",
    CA: "<:AC:1192962536044253184>",
    H2: "<:2H:1192958783610175568>",
    H3: "<:3H:1192958846172409926>",
    H4: "<:4H:1192958942662369304>",
    H5: "<:5H:1192959033431298160>",
    H6: "<:6H:1192959121436188803>",
    H7: "<:7H:1192960189851254916>",
    H8: "<:8H:1192960279416406106>",
    H9: "<:9H:1192960376145465437>",
    H10: "<:10H:1192960538116894730>",
    HJ: "<:JH:1192962020329398353>",
    HQ: "<:QH:1192962035944788079>",
    HK: "<:KH:1192962466729164800>",
    HA: "<:AH:1192962544688701441>",
    D2: "<:2D:1192958746981310504>",
    D3: "<:3D:1192958831907569806>",
    D4: "<:4D:1192958925931282523>",
    D5: "<:5D:1192959016461152387>",
    D6: "<:6D:1192959109125914634>",
    D7: "<:7D:1192960146679279736>",
    D8: "<:8D:1192960275389894716>",
    D9: "<:9D:1192960373259763843>",
    D10: "<:10D:1192960387524595823>",
    DJ: "<:JD:1192962017573740775>",
    DQ: "<:QD:1192962032056668160>",
    DK: "<:KD:1192962464124510439>",
    DA: "<:AD:1192962540062396466>",
    S2: "<:2S:1192958797812076686>",
    S3: "<:3S:1192958881022877777>",
    S4: "<:4S:1192958955333374034>",
    S5: "<:5S:1192959066125914202>",
    S6: "<:6S:1192959133939400704>",
    S7: "<:7S:1192960204275470336>",
    S8: "<:8S:1192960283438743633>",
    S9: "<:9S:1192960380197146695>",
    S10: "<:10S:1192960541241643109>",
    SJ: "<:JS:1192962023500300300>",
    SQ: "<:QS:1192962171173355671>",
    SK: "<:KS:1192962470076223598> ",
    SA: "<:AS:1192962549080133653>",
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Play a game of Blackjack!"),
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
        interaction.reply({ content: "This command is still under development", ephemeral: true });
        return;
    },
};
