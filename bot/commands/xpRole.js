const { MessageEmbed } = require('discord.js')

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config: new SlashCommandBuilder()
        .setName('xprole')
        .setDescription('adds an xp role reward!')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription("The role to set.").setRequired(true))
       .addNumberOption(option =>
            option.setName('level')
                .setDescription("The level to set for role.").setRequired(true))
       .addBooleanOption(option =>
            option.setName('action')
                .setDescription("True to add or false to Remove.").setRequired(true)),
        async execute(interaction, prem) {
         let message = interaction;
         if (prem.user != true && prem.guild !== true) return interaction.reply(`This is a premium only command!\nJoin my support server for more info!`);
        let client = message.client;
		if (!message.member.permissions.has('ADMINISTRATOR')) {
			return message.reply('You Do not have permission to change XP Roles.')
		};
                let level = Number(message.options.getNumber("level"))
		let role = message.options.getRole("role")
                let add = message.options.getBoolean("action")
                var xpRole = await client.db.get(`${message.guild.id}_roles.${Number(level)}`);
                if (add == true){
                 if (xpRole == role.id) return message.reply("There is already a role set up for that level!");      
                        await client.db.set(`${message.guild.id}_roles.${Number(level)}`, role.id);
			return message.reply("Set XP Role for that level!");
		};
                if (add == false){
                     if (xpRole != role.id) return message.reply("There is not already a role set up for that level!");
                 	await client.db.delete(`${message.guild.id}_roles.${Number(level)}`, role.id);
			return message.reply("Removed XP Role for that level!");
		};
	}
}
