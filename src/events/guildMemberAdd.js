var colors = require("colors");
colors.enable();
const UserDatabase = require("../models/userSchema");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        if (member.user.bot) return;
        else {
            const config = await client.configs.get(member.guild.id);
            const newUser = await UserDatabase.create({
                key: { userId: member.user.id, guildId: member.guild.id },
                "economy.wallet": config.economy.baseBalance,
            });
            await newUser.save();
            if (config.channels.welcome !== "") {
                const guild = member.guild;
                try {
                    const channel = guild.channels.cache.find(
                        (channel) => channel.id === config.channels.welcome
                    );
                    if (!channel)
                        return console.log(
                            `[GUILD] Could not find welcome channel for ${member.guild.name}`.red
                        );
                    let end = "th";
                    if (member.guild.memberCount % 10 === 1) end = "st";
                    if (member.guild.memberCount % 10 === 2) end = "nd";
                    if (member.guild.memberCount % 10 === 3) end = "rd";
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: member.user.tag,
                            iconURL: member.user.avatarURL(),
                        })
                        .setTitle(`Member joined`)
                        .setDescription(
                            `${member} has joined **${member.guild.name}** and is the ${
                                member.guild.memberCount
                            }${end} to join!\n\nAccount created <t:${parseInt(
                                member.user.createdAt / 1000
                            )}:R>`
                        )
                        .setColor("Green")
                        .setTimestamp();
                    channel.send({ embeds: [embed] });
                } catch (error) {
                    console.log(`[GUILD] Error with new member joining: ${error}`.red);
                }
                return;
            } else {
                return;
            }
        }
    },
};
