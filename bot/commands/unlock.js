const Discord = require('discord.js');
const { Console } = require('console');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('unlocks the current channel if it was locked.'),    
        
        
    async execute(interaction) {
        let lockPermErr = new Discord.MessageEmbed()
            .setTitle("**User Permission Error!**")
            .setDescription("**Sorry, you don't have permissions to use this! ❌**")
        if (!interaction.channel.permissionsFor(interaction.member).has("ADMINISTRATOR")) return interaction.reply({ embeds: [lockPermErr] });

        let channel = interaction.channel;

        try {
            await channel.permissionOverwrites.create(interaction.client.user.id, {
                SEND_MESSAGES: null,
                ADD_REACTIONS: null
            });
            await channel.permissionOverwrites.create(interaction.guild.id, {
                SEND_MESSAGES: null,
                ADD_REACTIONS: null
            });
        } catch (e) {
            console.log(e);
        }
        const w = new Discord.MessageEmbed()
            .setTitle("Done | Channel unlocked!")
            .setColor("GREEN")
            .setThumbnail("https://cdn.discordapp.com/emojis/852577966533246976.png")
        interaction.reply({ embeds: [w] });
    }
}
