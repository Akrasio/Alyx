const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('image')
            .setDescription('Fun image manipulation commands!')
            .addStringOption(opt =>
                opt.setName("type")
                    .setDescription("show settings or pick a setting to modify")
                    .addChoice("gay", "gay")
                    .addChoice("bisexual", "bisexual")
                    .addChoice("transgender", "transgender")
                    .addChoice("nonbinary", "nonbinary")
                    .addChoice("genderfluid", "genderfluid")
                    .addChoice("pansexual", "pansexual")
                    .addChoice("discordblue", "discordblue")
                    .addChoice("rip", "rip")
                    .addChoice("sepia", "sepia")
                    .addChoice("firsttime", "firsttime")
                    .addChoice("kimborder", "kimborder")
                    .addChoice("captcha", "captcha")
                    .addChoice("jokeoverhead", "jokeoverhead")
                    .addChoice("jail", "jail")
                    .addChoice("ad", "ad")
                    .addChoice("delete", "delete")
                    .setRequired(true))
            .addUserOption(opt =>
                opt.setName("member")
                    .setDescription("The user to get the avatar of and modify.")
                    .setRequired(true)),
    async execute(interaction) {
        let args = interaction.options.getString("type");
        const member = interaction.options.getMember('member');
        const IMGURL = `${process.env.ahniIMG}/${args}?image=${member.user.avatarURL({ format: "png", size: 4096 }).split("?size=4096")[0]}`;
        const embed = new MessageEmbed()
            .setTitle("**Here is your image for " + args + "**")
            .setTimestamp()
            .setURL(IMGURL)
            
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, format: "png" }) })
            .setImage(IMGURL);

        interaction.reply({ embeds: [embed] })
    }
}
