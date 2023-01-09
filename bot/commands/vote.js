const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('vote')
            .setDescription('Shows the links to bot lists where you may vote.'),
    async execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setColor("#ff9900")
            .setTitle(`Here are my vote pages:`)
            .setThumbnail(interaction.client.user.avatarURL({ size: 2048 }))
            .addField("disforge.com", "[Here](https://disforge.com/bot/579-alyx)", true)
        return interaction.reply({ embeds: [embed] });
    },
};
