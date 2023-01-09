const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, SlashCommandRoleOption } = require('@discordjs/builders');
OPT1 = new SlashCommandRoleOption().setName("role").setDescription("Role").setRequired(true);

module.exports = {
    config:
	new SlashCommandBuilder()
		.setName('rolemi')
	        .addRoleOption(OPT1)
		.setDescription('Shows who is in a given role.'),
        async execute(interaction) {
        let role = interaction.options.getRole("role")

        if (!role) return interaction.reply("**Please Enter A Valid Role!**");
        let membersWithRole = await interaction.guild.members.fetch().then(member =>{
        return interaction.guild.roles.cache.get(role.id).members.map(m=> m.user.tag);
        })
        if (membersWithRole.length > 100) return interaction.reply('**List Is Too Long!**')

        let roleEmbed = new MessageEmbed()
            .setColor("#2F3136")
            .setThumbnail(interaction.guild.iconURL())
            .setTitle(`Users With The ${role.name} Role!`)
            .setDescription("```"+(membersWithRole.join("\n") || "No one found!")+"```");
        interaction.reply({embeds: [roleEmbed]}).catch(err=>{
            interaction.reply(err.message)
        })
    }
}
