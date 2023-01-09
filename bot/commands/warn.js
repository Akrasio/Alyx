const { MessageEmbed } = require('discord.js');
const CASES = require('../models/cases');
const SERVERS = require('../models/servers');
const moment = require('moment');
const fetch = require('node-fetch');
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandUserOption().setName("user").setDescription("The member to warn").setRequired(true);
OPT2 = new SlashCommandStringOption().setName("reason").setDescription("The reason to warn").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('warn')
            .addUserOption(OPT1)
            .addStringOption(OPT2)
            .setDescription('Warn a user for a given reason.'),



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
        if (modroles && member.roles.cache.has(modroles)) return interaction.reply("**You can not punish another staff member!**");
        if (member.bot) return interaction.reply("Bots can not be warned!");
        let reason = interaction.options.getString('reason');
        CASES.find({
            serverID: interaction.guild.id
        }).sort([
            ['descending']
        ]).exec((err, res) => {
            let cases1 = new CASES({
                userID: member.id,
                reason: reason,
                action: "Warn",
                Moderator: interaction.user.id,
                serverID: interaction.guild.id,
                time: Date.now().toString().slice(0,10),
                case: res.length + 1
            })

            cases1.save()

        let warnEmbed = new MessageEmbed()
            .setTitle("**__Warn Report #" + Number(res.length + 1))
            .setDescription(`**<@${member.id}> has been warned by <@${interaction.user.id}>**`)
            .addField(`**Reason:**`, `\`${reason}\``)
            .addField("Time:", (new Date().toLocaleString('en-US', { timeZone: 'UTC' })))
            .addField(`**Action:**`, `\`Warn\``)
            .addField(`**Moderator:**`, `${interaction.user}`)
        interaction.reply({ embeds: [warnEmbed] })
        member.send({ content: `You have been warned by <${interaction.user.username}> for: ${reason}` })
            .catch(error => interaction.reply({ content: `Sorry ${interaction.user} I couldn't *dm* the warn because of : ${error}` }).catch(err => {
                return;
            }));
        })
    }
}
