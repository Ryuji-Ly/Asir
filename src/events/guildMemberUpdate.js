var colors = require(`colors`);
colors.enable();
const guildConfiguration = require(`../models/guildConfiguration`);
const ProfileModel = require(`../models/profileSchema`);
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberUpdate",
    async execute(oldMember, newMember, client) {
        if (oldMember.user.bot) return;
        const config = await client.configs.get(oldMember.guild.id);
        if (config.memberLogChannelId !== "") {
            const channel = await oldMember.guild.channels.cache.get(config.memberLogChannelId);
            if (channel) {
                const prevRoleCount = await oldMember._roles.length;
                const newRoleCount = await newMember._roles.length;
                const prevAvatar = `https://cdn.discordapp.com/guilds/${oldMember.guild.id}/users/${oldMember.user.id}/avatars/${oldMember.avatar}.webp`;
                const newAvatar = `https://cdn.discordapp.com/guilds/${oldMember.guild.id}/users/${oldMember.user.id}/avatars/${newMember.avatar}.webp`;
                const prevUsername = await oldMember.user.username;
                const newUsername = await newMember.user.username;
                const prevGlobalname = await oldMember.user.globalName;
                const newGlobalname = await newMember.user.globalName;
                const prevNickname = await oldMember.nickname;
                const newNickname = await newMember.nickname;
                const member = oldMember;
                if (config.memberLogs[0].value) {
                    if (prevRoleCount < newRoleCount) {
                        const roleIds = newMember._roles.filter(
                            (role) => !oldMember._roles.includes(role)
                        );
                        let roles = [];
                        await roleIds.forEach((role) => {
                            roles.push(oldMember.guild.roles.cache.get(role));
                        });
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Role added`)
                            .setDescription(`${roles}`)
                            .setFooter({ text: `ID: ${member.user.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                    }
                    if (prevRoleCount > newRoleCount) {
                        const roleIds = oldMember._roles.filter(
                            (role) => !newMember._roles.includes(role)
                        );
                        let roles = [];
                        await roleIds.forEach((role) => {
                            roles.push(oldMember.guild.roles.cache.get(role));
                        });
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Role removed`)
                            .setDescription(`${roles}`)
                            .setFooter({ text: `ID: ${member.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                    }
                    if (prevRoleCount === newRoleCount) {
                        const addedRoleIds = newMember._roles.filter(
                            (role) => !oldMember._roles.includes(role)
                        );
                        const removedRoleIds = oldMember._roles.filter(
                            (role) => !newMember._roles.includes(role)
                        );
                        if (addedRoleIds.length === 0 && removedRoleIds.length === 0) {
                            //
                        } else {
                            let addedRoles = [];
                            let removedRoles = [];
                            await addedRoleIds.forEach((role) => {
                                addedRoles.push(oldMember.guild.roles.cache.get(role));
                            });
                            await removedRoleIds.forEach((role) => {
                                removedRoles.push(oldMember.guild.roles.cache.get(role));
                            });
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Role updated`)
                                .setDescription(
                                    `**Added:** ${addedRoles}\n**Removed:** ${removedRoles}`
                                )
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                    }
                }
                if (config.memberLogs[1].value) {
                    if (prevUsername !== newUsername) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Username changed`)
                            .setDescription(
                                `**Before:** ${prevUsername}\n**+After:** ${newUsername}`
                            )
                            .setFooter({ text: `ID: ${member.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                    }
                    if (prevGlobalname !== newGlobalname) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: member.user.username,
                                iconURL: member.user.avatarURL(),
                            })
                            .setColor("Purple")
                            .setTitle(`Global name changed`)
                            .setDescription(
                                `**Before:** ${prevGlobalname}\n**+After:** ${newGlobalname}`
                            )
                            .setFooter({ text: `ID: ${member.id}` })
                            .setTimestamp();
                        await channel.send({ embeds: [embed] });
                    }
                    if (prevNickname !== newNickname) {
                        if (prevNickname === null) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Nickname added`)
                                .setDescription(`**New nickname:** ${newNickname}`)
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                        if (newNickname === null) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Nickname removed`)
                                .setDescription(`**Previous nickname:** ${prevNickname}`)
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                        if (prevNickname !== null && newNickname !== null) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Nickname changed`)
                                .setDescription(
                                    `**Previous nickname:** ${prevNickname}\n**New nickname:** ${newNickname}`
                                )
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                    }
                }
                if (config.memberLogs[2].value) {
                    if (prevAvatar !== newAvatar) {
                        if (oldMember.avatar === null) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Server avatar added`)
                                .setDescription(`${member}`)
                                .setThumbnail(newAvatar)
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                        if (newMember.avatar === null) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Server avatar removed`)
                                .setDescription(`${member}`)
                                .setThumbnail(member.user.avatarURL())
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                        if (oldMember.avatar !== null && newMember.avatar !== null) {
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: member.user.username,
                                    iconURL: member.user.avatarURL(),
                                })
                                .setColor("Purple")
                                .setTitle(`Server avatar updated`)
                                .setDescription(
                                    `**Before:** [View](${prevAvatar})\n**+After:** [View](${newAvatar})`
                                )
                                .setThumbnail(newAvatar)
                                .setFooter({ text: `ID: ${member.id}` })
                                .setTimestamp();
                            await channel.send({ embeds: [embed] });
                        }
                    }
                }
            } else console.log(`[MEMBER UPDATE] Could not find member log channel`.red);
        }
        return;
    },
};
