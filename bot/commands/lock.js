const Discord = require('discord.js');
const { Console } = require('console');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
new SlashCommandBuilder()
		.setName('lock')
		.setDescription('locks the current message channel.'),
    async execute(interaction) {
        let lockPermErr = new Discord.MessageEmbed()
        .setTitle("**User Permission Error!**")
        .setDescription("**Sorry, you don't have permissions to use this! ❌**")
        if(!interaction.channel.permissionsFor(interaction.member).has("ADMINISTRATOR")) return interaction.reply({ embeds: [lockPermErr]});
        let channel = interaction.channel;

        try {
		const w = new Discord.MessageEmbed()
		.setTitle("Done | Channel locked!")
        	.setColor("RED")
		.setThumbnail("https://cdn.discordapp.com/emojis/669727729767415808.png")
        	await interaction.reply({embeds: [w]});

		await channel.permissionOverwrites.create(interaction.client.user.id, {
                    SEND_MESSAGES: true,
		            ADD_REACTIONS: true
            });
		channel.permissionOverwrites.create(interaction.guild.id, {
                    SEND_MESSAGES: false,
		            ADD_REACTIONS: false
            });
        } catch (e) {
            console.log(e);
        }
    }
}
