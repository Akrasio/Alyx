const { MessageEmbed } = require("discord.js");
const { ownerID } = require("../config/owner.json");
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandRoleOption } = require('@discordjs/builders');
OPT2 = new SlashCommandUserOption().setName("member").setDescription("member").setRequired(true);
OPT1 = new SlashCommandRoleOption().setName("role").setDescription("role").setRequired(true);

module.exports = {
    config: new SlashCommandBuilder()
		.setName('rolerm')
    		.addRoleOption(OPT1)
		.addUserOption(OPT2)
		.setDescription('Remove a role from a member.'),
	async execute(interaction) {
    if(!interaction.member.permissions.has(["MANAGE_ROLES"]) && !ownerID.includes(interaction.user.id)) return interaction.reply("You dont have permission to perform this command!")
    if(!interaction.guild.me.permissions.has(["MANAGE_ROLES"])) return interaction.reply("I don't have permission to perform this command. Please give me Manage Roles Permission!")
    let rMember = interaction.options.getMember("member")
    if(!rMember) return interaction.reply("Please provide a member to remove a role from.");
    let role = interaction.options.getRole("role")
    if(!role) return interaction.reply("Please provide a role to remove from said member.");
    if (interaction.guild.me.roles.highest.position < role.position) return interaction.reply(`I Can not remove that role to anyone due to it being higher than my current highest role [\`${interaction.guild.me.roles.highest.name}\`]`)
    if (interaction.guild.members.cache.get(interaction.user.id).roles.highest.position < role.position && interaction.guild.ownerId !== interaction.user.id) return interaction.reply(`I Can not remove that role from anyone for you due to it being higher than your current highest role [\`${interaction.guild.members.cache.get(interaction.user.id).roles.highest.name}\`]`)
    if(!rMember.roles.cache.has(role.id)) {
      let rolDEL_err = new MessageEmbed()
      .setColor(`#FF0000`)
      .setDescription(`Error ❌ | ${rMember.displayName}, Does not have this role!`);

      return interaction.reply({embeds: [rolDEL_err]})
    } else {

      await rMember.roles.remove(role.id).catch(e => console.log(e.message))
      let rolDEL = new MessageEmbed()
      .setColor(`#00FF00`)
      .setDescription(`Success ✅ | ${rMember} has been removed from **${role.name}**`)

      interaction.reply({embeds: [rolDEL]})
    }

  },
};
