const { MessageEmbed } = require('discord.js')

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Set up welcome channel and a welcome message!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription("The message to welcome with.").setRequired(true))
       .addChannelOption(option =>
            option.setName('channel')
                .setDescription("The channel to set for welcomes.").setRequired(true))
       .addBooleanOption(option =>
            option.setName('action')
                .setDescription("True to add or false to Remove.").setRequired(true)),
        async execute(message, prem) {
                let client = message.client;
		if (!message.member.permissions.has('MANAGE_GUILD')) {
			return message.reply('You Do not have permission to change welcomes.')
		};
                let chan = message.options.getChannel("channel")
                let wsg = message.options.getString("message")
                let add = message.options.getBoolean("action")
                if (add == true){
                        await client.db.set(`${message.guild.id}.welcomeChn`, chan.id);
                 	await client.db.set(`${message.guild.id}.welcomeMsg`, `${wsg.toString()}`);
			return message.reply("Set XP Role for that level!");
		};
                if (add == false){
                 	await client.db.delete(`${message.guild.id}.welcomeChn`);
                 	await client.db.delete(`${message.guild.id}.welcomeMsg`);
			return message.reply("Removed Welcome Settings!");
		};
	}
}
