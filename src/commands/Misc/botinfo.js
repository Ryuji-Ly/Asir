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
        .setName("bot-info")
        .setDescription("Displays information about this bot and it's creator"),
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
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setColor("Purple")
            .setTitle(
                `${client.user.username} is the latest of a long series of bots created by ryujily`
            )
            .setDescription(
                `**${client.user.username}** is programmed using discord.js v14 and uses the non-relational database MongoDB.\nIt is also the most ambitious bot as it is designed to be very flexible and do many things, logging, economy, leveling, minigames, moderation etc.\n\n**HS** is the very first discord bot ryujily has created. HS was programmed with the discord.py API, it was a very basic bot that could only respond according to a randomly selected response to a message containing specific words and misc commands such as hug, cry, angry etc.\nThis bot was hosted entirely on repl.it with another site sending pings to the repl every few minutes. The entire project was all done on the cloud.HS was programmed in 2018.\n\n**test** was programmed around a year later in 2019, like HS it was programmed in repl.it and with the discord.py API. It had no other function that ryujily testing some things with the discord.py API\n\n**EP** is the first discord bot programmed using the discord.js API although it was first programming with discord.py, ryujily switched over around halfway while programming.\nIt had various functions for moderation and misc, however due to the chaotic code from switching from python to javascript halfway through the code it was discarded rather quickly.\nThis bot was programmed in 2020 and named after one of the characters ryujily had designed.\n\n**Tenrai 0** is the "cleaned up" version of EP, similarly programmed in 2020 however due to inactivity in the server it was used in it was discontinued.\n\n**Tenrai** the direct successor of Tenrai 0 programmed in 2021 using discord.js. It inherited all the code of Tenrai 0 while getting several more commands, however it still remained fairly basic, only having about 20 commands. This bot was kept online using Heroku.\n\n**Newton**, this bot technically shouldn't be here however since test was also added it will also be in this list. Programmed with discord.js this was ryujily's attempt to program an advanced command handler.\n\n**Asir 1.0** was programmed using discord.js and was by far the most advanced with far more commands and moderation options. However compared to it's future versions it is incredibly basic. Asir was programmed at the end and beginning of 2021-2022.\n\n**TheSmolSerenity** was ryujily's first experiene programming a discord bot with slash commands it is also the first to actively use MongoDB with an economy system.\nThis particular bot was programmed in the later half of 2023 and discontinued a month after it's creation. This bot was kept online using Discloud.\n\n**Asir 2.0** was programmed just after TSS was discontinued and is currently still operational. It had approximately 50 commands some of which are removed and in the future probably even more, however in the near future it will be discontinued and replaced by Asir 3.0, which is this discord bot. This bot was kept online using Diva hosting and Discloud.`
            );
        interaction.reply({ embeds: [embed] });
        return;
    },
};
