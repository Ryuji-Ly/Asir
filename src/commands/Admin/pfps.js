const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch");
const JSZIP = require("jszip");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-all-server-pfps")
        .setDescription("Get all the profile pictures of the server members in a zip file."),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        await interaction.deferReply();
        try {
            await guild.members.fetch();
            const zip = new JSZIP();
            const promises = [];
            let failed = 0;
            let failedUsers = [];
            guild.members.cache.forEach(async (member) => {
                const username = member.user.username;
                const isBot = member.user.bot;
                const avatarURL = member.user.displayAvatarURL({ format: "png", size: 256 });
                const promise = fetchAvatar(avatarURL)
                    .then((buffer) => {
                        const filename = isBot ? `BOT_${username}.png` : `${username}.png`;
                        zip.file(filename, buffer);
                    })
                    .catch((error) => {
                        console.error(`[BOT] Error fetching avatar for ${username}: ${error}`.red);
                        failed++;
                        failedUsers.push(username);
                    });
                promises.push(promise);
            });

            await Promise.all(promises);
            const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
            const zipFileName = `${guild.name}_avatars.zip`;
            const tempFilePath = `./${zipFileName}`;
            await fs.writeFileSync(tempFilePath, zipBuffer);
            let message = "";
            if (failed > 0) {
                message = `Here is the zip file with all the profile pictures of the server members.\nFailed to fetch ${failed} avatars. Failed users: ${failedUsers.join(
                    ", "
                )}`;
            } else {
                message = `Here is the zip file with all the profile pictures of the server members.`;
            }
            await interaction.editReply({
                content: message,
                files: [{ attachment: tempFilePath, name: zipFileName }],
            });

            await fs.unlinkSync(tempFilePath);
        } catch (error) {
            console.error(`[BOT] Error fetching avatars or sending zip file: ${error}`.red);
            await interaction.editReply({
                content: "There was an error fetching the profile pictures.",
            });
        }
        return;
    },
};

async function fetchAvatar(url, retries = 5, delay = 1000) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return await response.buffer();
    } catch (error) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchAvatar(url, retries - 1, delay * 2);
        } else {
            throw new Error(`Max retries exceeded for URL: ${url}`);
        }
    }
}
