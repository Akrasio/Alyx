const { MessageEmbed } = require('discord.js');
const CASES = require('../models/cases');
const SERVERS = require('../models/servers');
const moment = require('moment');
const fetch = require('node-fetch');
const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');
OPT1 = new SlashCommandUserOption().setName("user").setDescription("The member to clear warns for.").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('warnclear')
            .addUserOption(OPT1)
            .setDescription('Clears ALL warns of a user'),
    async execute(interaction) {
        let warnPermErr = new MessageEmbed()
            .setTitle("**User Permission Error!**")
            .setDescription("**Sorry, you don't have permissions to use this! ❌**")
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.channel.permissionsFor(interaction.member).has(['MANAGE_MESSAGES'])) return interaction.reply(warnPermErr);

        let member = interaction.options.getMember('user');
        if (!member) return interaction.reply("Please mention a valid member of this server");
        if (member.user.bot) return interaction.reply("Bots can not be warned!");

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "(No Reason Provided)";
        var myquery = { 
              userID: member.id,
              serverID: interaction.guild.id 
            };
        CASES.deleteMany(myquery).then(function(){ 
           console.log("Data deleted"); // Success 
        }).catch(function(error){ 
           console.log(error); // Failure 
       });
        let warnEmbed = new MessageEmbed()
            .setTitle("**__Warn clear Report__**")
            .setDescription(`**<@${member.id}> has been cleaned of all warns by <@${interaction.user.id}>**`)
            .addField(`**Action:**`, `\`warnclear\``)
            .addField(`**Moderator:**`, `${interaction.user}`)
        interaction.reply({ embeds: [warnEmbed] }).catch(err => console.log(err))
        member.send({ content: `You have been cleared of all warns by <${interaction.user.username}> for: ${reason}` })
            .catch(error => interaction.reply({ content: `Sorry ${interaction.user} I couldn't *dm* the warn because of : ${error}` }).catch(err => {
                return;
            }));
    }
}
