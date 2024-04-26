const {
    SlashCommandBuilder,
    Interaction,
    EmbedBuilder,
    PermissionFlagsBits,
    AttachmentBuilder,
} = require("discord.js");
const handleCooldowns = require("../../utils/handleCooldowns");
const petPetGif = require("pet-pet-gif");
async function checkImage(url) {
    const res = await fetch(url);
    const buff = await res.blob();

    return buff.type.startsWith("image/");
}
function isJpgImage(url) {
    var extension = url.split(".").pop().toLowerCase();
    return extension === "jpg" || extension === "jpeg";
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pet")
        .setDescription("Create a pet gif for a fellow guild member!")
        .addUserOption((option) =>
            option.setName("user").setDescription("The user you want to pet")
        )
        .addStringOption((option) =>
            option
                .setName("url")
                .setDescription("Make a pet gif with an image url! (NEEDS TO BE JPG)")
        )
        .addAttachmentOption((option) =>
            option.setName("file").setDescription("Make a gif with an image file, must be jpg")
        ),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        let avatar;
        let userAv;
        const userA = options.getUser("user");
        if (userA) {
            userAv = userA.displayAvatarURL({ extension: "jpg", forceStatic: true });
        }
        const urlAv = options.getString("url");
        const fileAv = options.getAttachment("file");
        //checking all the avs
        if (userAv && !urlAv && !fileAv) {
            avatar = userAv;
        } else if (!userAv && urlAv && !fileAv) {
            if (checkImage(urlAv)) {
                if (isJpgImage(urlAv)) {
                    avatar = urlAv;
                } else {
                    return interaction.reply({
                        content: "The url provided is not a jpg image.",
                        ephemeral: true,
                    });
                }
            } else {
                return interaction.reply({
                    content: "The url you provided was not a valid image url",
                    ephemeral: true,
                });
            }
        } else if (!userAv && !urlAv && fileAv) {
            if ((fileAv.type = "IMAGE")) {
                if (isJpgImage(fileAv.name)) avatar = fileAv.url;
                else
                    return interaction.reply({
                        content: "Incorrect file type was submitted",
                        ephemeral: true,
                    });
            } else {
                return interaction.reply({
                    content: "The file provided is invalid",
                    ephemeral: true,
                });
            }
        } else {
            return interaction.reply({
                content: "You must use one of the options",
                ephemeral: true,
            });
        }
        const animatedGif = await petPetGif(avatar);
        const gif = new AttachmentBuilder(animatedGif, { name: "pet.gif" });
        await interaction.reply({ files: [gif] });
        return;
    },
};
