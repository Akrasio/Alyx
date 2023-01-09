const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
new SlashCommandBuilder()
		.setName('lockdown')
		.setDescription('locks the entire server down from speaking.'),
    async execute(interaction) {
        let lockPermErr = new Discord.MessageEmbed()
        .setTitle("**User Permission Error!**")
        .setDescription("**Sorry, you don't have permissions to use this! ❌**")
        if(!interaction.channel.permissionsFor(interaction.member).has("ADMINISTRATOR") ) return interaction.reply({ embeds: [lockPermErr]});

        const channels = interaction.guild.channels.cache.filter(ch => ch.type !== 'category');
        if (args[0] === 'on') {
            channels.forEach(channel => {
                channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                    SEND_MESSAGES: false
                })
            })
            let lockEmbed = new Discord.MessageEmbed()
                .setThumbnail(`https://tenor.com/view/miuna-yashiro-yashiro-miuna-miuna-yashiro-vtuber-gif-23027514`)
                .setDescription(`**\n\nDone! Server Fully Locked! 🔒**`)
                .setColor('#2F3136')
            return interaction.reply({embeds: [lockEmbed]});

        } else if (args[0] === 'off') {
            channels.forEach(channel => {
                channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                    SEND_MESSAGES: null
                })
            })
            let lockEmbed2 = new Discord.MessageEmbed()
                .setColor('#2F3136')    
                .setThumbnail(`https://tenor.com/view/milim-nava-milim-loli-demon-lord-demon-lord-loli-gif-21844278`)
                .setDescription(`**\n\nDone! Server Fully Unlocked! 🔓**`)
            return interaction.reply({embeds: [lockEmbed2]})
        }
    }
}
