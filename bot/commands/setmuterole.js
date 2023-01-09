const { OWNER_ID } = require("../config/config");
const { SlashCommandBuilder, SlashCommandRoleOption } = require('@discordjs/builders');
const OPT1 = new SlashCommandRoleOption().setName("role").setDescription("Role").setRequired(true);
module.exports = {
  config:
new SlashCommandBuilder()
		.setName('muterole')
    .addRoleOption(OPT1)
		.setDescription('sets the servers muted role'),
    async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR") && interaction.user.id !== OWNER_ID)
      return interaction.reply(
        "**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**"
      );
    if (!interaction.options.getRole("role")) {
      let b = await interaction.client.db.get(`${interaction.guild.id}.muterole`);
      let roleName = interaction.guild.roles.cache.get(b);
      if (interaction.guild.roles.cache.has(b)) {
        return interaction.reply(
          `**Muterole Set In This Server Is \`${roleName.name}\`!**`
        );
      } else
        return interaction.reply(
          "**Please Enter A Role Name or ID To Set!**"
        );
    }

    let role = interaction.options.getRole("role");

    if (!role)
      return interaction.reply("**Please Enter A Valid Role Name or ID!**");

    try {
      let a = await interaction.client.db.get(`${interaction.guild.id}.muterole`);

      if (role.id === a) {
        return interaction.reply(
          "**This Role is Already Set As Muterole!**"
        );
      } else {
        await interaction.client.db.set(`${interaction.guild.id}.muterole`, role.id);

        interaction.reply(
          `**\`${role.name}\` Has Been Set Successfully As Muterole!**`
        );
      }
    } catch (e) {
      return interaction.reply(
        "**Error - `Missing Permissions or Role Doesn't Exist!`**",
        `\n${e.message}`
      );
    }
  }
};
