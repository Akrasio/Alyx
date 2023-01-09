const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, SlashCommandRoleOption } = require('@discordjs/builders');
OPT1 = new SlashCommandRoleOption().setName("role").setDescription("role").setRequired(true);

module.exports = {
    config:
	new SlashCommandBuilder()
		.setName('roleinfo')
        	.addRoleOption(OPT1)
		.setDescription('Shows stats of a role the server'),
    	async execute(interaction) {
        let role = interaction.options.getRole("role")
        if (!role) return interaction.reply("**Please Enter A Valid Role!**");
        const status = {
            false: "No",
            true: "Yes"
        }
        let roleembed = new MessageEmbed()
            .setColor("#2F3136")
            .setTitle(`Role Info: \`[  ${role.name}  ]\``)
            .setThumbnail(interaction.guild.iconURL())
            .addField("**ID**", ">"+`\` ${role.id}\``, true)
            .addField("**Name**", "> "+role.name, true)
            .addField("**Hex**", "> "+role.hexColor, true)
            .addField("**Members**", "> "+role.members.size, true)
            .addField("**Position**", "> "+role.position, true)
            .addField("**Mentionable**", "> "+status[role.mentionable], true)
            .setFooter({ text: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        interaction.reply({embeds: [roleembed]});
    }
}
