const { OWNER_ID } = require("../config/config");
const { SlashCommandBuilder, SlashCommandChannelOption } = require('@discordjs/builders');
OPT1 = new SlashCommandChannelOption().setName("channel").setDescription("Channel").setRequired(true);

module.exports = {
  config:
new SlashCommandBuilder()
		.setName('setmsglogchannel')
    .addChannelOption(OPT1)
		.setDescription('Sets the servers message logs'),
    async execute(interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR") && interaction.user.id !== OWNER_ID) return interaction.reply("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")
    if (!interaction.options.getChannel("channel")) {
      let b = await interaction.client.db.get(`${interaction.guild.id}.clogs`);
      let channelName = interaction.options.getChannel("channel")
      if (interaction.guild.channels.cache.has(b)) {
        return interaction.reply(
          `**Message Log Channel Set In This Server Is \`${channelName.name}\`!**`
        );
      } else {
        return interaction.reply(
          "**Please Enter A Channel Name or ID To Set!**"
        );
      }
    } let channel = interaction.options.getChannel("channel")

    if (!channel || channel.type != 'GUILD_TEXT') return interaction.reply("**Please Enter A Valid Text Channel!**");
    try {
      let a = await interaction.client.db.get(`${interaction.guild.id}.clogs`)
      if (channel.id === a) {
        return interaction.reply("**This Channel is Already Set As Message Log Channel!**")
      } else {
        if (!interaction.client.guilds.cache.get(interaction.guild.id).channels.cache.get(channel.id).permissionsFor(interaction.client.user.id).has(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'VIEW_CHANNEL'])) {
          return interaction.reply("**Error - `Missing Permissions Or Channel Is Not A Text Channel!`**");
        }
        interaction.client.guilds.cache.get(interaction.guild.id).channels.cache.get(channel.id).send("**Message Log Channel Set!**")
        await interaction.client.db.set(`${interaction.guild.id}.clogs`, channel.id);
        interaction.reply(`**Message Log Channel Has Been Set Successfully in \`${channel.name}\`!**`)
      }
    } catch (err) {
      console.log(err)
      return interaction.reply("**Error - `Missing Permissions Or Channel Is Not A Text Channel!`**");
    }
  }
}
