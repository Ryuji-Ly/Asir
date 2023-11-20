var colors = require(`colors`);
colors.enable();
const guildConfiguration = require(`../models/guildConfiguration`);
const ProfileModel = require(`../models/profileSchema`);
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState, newState, client) {
        const config = await client.configs.get(oldState.guild.id);
        if (config.voiceLogChannelId !== "") {
            const channel = await oldState.guild.channels.cache.get(config.voiceLogChannelId);
            if (channel) {
                const memberId = oldState.id;
                const member = oldState.guild.members.cache.get(memberId);
                const prevChannelId = oldState.channelId;
                const newChannelId = newState.channelId;
                if (config.voiceLogs[0].value) {
                    if (prevChannelId === null) {
                        const newchannel = oldState.guild.channels.cache.get(newChannelId);
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Member joined Voice Channel`)
                            .setDescription(`${member} joined ${newchannel}`)
                            .setFooter({ text: `ID: ${member.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                        return;
                    }
                }
                if (config.voiceLogs[1].value) {
                    if (prevChannelId !== null && newChannelId !== null) {
                        const prevchannel = oldState.guild.channels.cache.get(prevChannelId);
                        const newchannel = oldState.guild.channels.cache.get(newChannelId);
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Member moved Voice Channels`)
                            .setDescription(`${member} moved from ${prevchannel} to ${newchannel}`)
                            .setFooter({ text: `ID: ${member.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                        return;
                    }
                }
                if (config.voiceLogs[2].value) {
                    if (newChannelId === null) {
                        const prevchannel = oldState.guild.channels.cache.get(prevChannelId);
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Member left Voice Channel`)
                            .setDescription(`${member} left ${prevchannel}`)
                            .setFooter({ text: `ID: ${member.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                        return;
                    }
                }
            } else console.log(`[VOICE STATE UPDATE] Could not find voice log channel`.red);
        }
        return;
    },
};
