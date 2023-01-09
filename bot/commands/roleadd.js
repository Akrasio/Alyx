
const { MessageEmbed } = require("discord.js");
const { ownerID } = require("../config/owner.json")
const { SlashCommandBuilder, SlashCommandRoleOption, SlashCommandUserOption } = require('@discordjs/builders');
OPT1 = new SlashCommandRoleOption().setName("role").setDescription("Role to add user to").setRequired(true);
OPT2 = new SlashCommandUserOption().setName("member").setDescription("Member to add to role.").setRequired(true);


module.exports = {
  config:
new SlashCommandBuilder()
		.setName('roleadd')
    .addRoleOption(OPT1)
    .addUserOption(OPT2)
		.setDescription('Adds role to a user/member in the server'),
	  async execute(interaction) {
    if (!interaction.member.permissions.has(["MANAGE_ROLES"]) && !ownerID.includes(interaction.user.id)) return interaction.reply("You dont have permission to perform this command!")
    if (!interaction.guild.me.permissions.has(["MANAGE_ROLES"])) return interaction.reply("I don't have permission to perform this command. Please give me Manage Roles Permission!")
    let rMember = interaction.options.getMember('member')
    if (!rMember) return interaction.reply("Unable to find the mentioned user in this guild.")

    let role = interaction.options.getRole('role');
    if (!role) return interaction.reply("Please provide a role to add to said user.")
    if (interaction.guild.me.roles.highest.position < role.position) return interaction.reply(`I Can not add that role to anyone due to it being higher than my current highest role [\`${interaction.guild.me.roles.highest.name}\`]`)
    if (interaction.guild.members.cache.get(interaction.user.id).roles.highest.position < role.position && interaction.guild.ownerId !== interaction.user.id) return interaction.reply(`I Can not add that role to anyone for you due to it being higher than your current highest role [\`${interaction.guild.members.cache.get(interaction.user.id).roles.highest.name}\`]`)
    if (rMember.roles.cache.has(role.id)) {
      return interaction.reply(`${rMember.displayName}, already has the role!`)
    } else {
      await rMember.roles.add(role.id).catch(e => console.log(e.message))

	let roleADD = new MessageEmbed()
      .setColor(`#00FF00`)
      .setDescription(`Success ✅ | ${rMember.displayName} has been added to **${role.name}**`)
      interaction.reply({embeds: [roleADD]})
    }

  },
};
