const { MessageEmbed } = require('discord.js');
const CASES = require('../models/cases');
const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');
OPT1 = new SlashCommandUserOption().setName("user").setDescription("The member to vcmute").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('check')
            .addUserOption(OPT1)
            .setDescription('Checks the warnings of a user if they have been warned.'),
    async execute(interaction) {
        let warnPermErr = new MessageEmbed()
            .setTitle("**User Permission Error!**")
            .setDescription("**Sorry, you don't have permissions to use this! ❌**")
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.channel.permissionsFor(interaction.member).has(['MANAGE_MESSAGES'])) return interaction.reply({ embeds: [warnPermErr] });

        let userses = interaction.options.getMember('user');
        if (!userses) return interaction.reply("Please mention a valid member of this server");
        CASES.find({
            serverID: interaction.guild.id,
            userID: userses.user.id
        }, (err, res) => {

            let embed2 = new MessageEmbed()
                .setTitle(`📃 ${userses.user.username}` + " Infractions!")
                .setAuthor(`${userses.user.username}`, userses.user.displayAvatarURL({ dynamic: true }))
            if (!res) {
                embed2.addField("Infractions", "User has No infractions!", true);
                embed2.setFooter("Total Infractions: 0");
                return message.channel.send({ embeds: [embed2] });
            } else {
                const banss = res.filter(a => a.action == "Ban").map(b => `**CASE**: ${b.case}\n**Reason**: ${b.reason}\n**Moderator**: <@${b.Moderator}>\n**Time**: <t:${b.time}>`)
                const warns = res.filter(a => a.action == "Warn").map(b => `**CASE**: ${b.case}\n**Reason**: ${b.reason}\n**Moderator**: <@${b.Moderator}>\n**Time**: <t:${b.time}>`)
                const sbans = res.filter(a => a.action == "SoftBan").map(b => `**CASE**: ${b.case}\n**Reason**: ${b.reason}\n**Moderator**: <@${b.Moderator}>\n**Time**: <t:${b.time}>`)
                const mutes = res.filter(a => a.action == "Mute").map(b => `**CASE**: ${b.case}\n**Reason**: ${b.reason}\n**Moderator**: <@${b.Moderator}>\n**Time**: <t:${b.time}>`)
                const vMute = res.filter(a => a.action == "VoiceMute").map(b => `**CASE**: ${b.case}\n**Reason**: ${b.reason}\n**Moderator**: <@${b.Moderator}>\n**Time**: <t:${b.time}>`)
                warns.forEach(warn => {
                    embed2.addField("Warning: ", `${warn}`, true)
                });
                sbans.forEach(warn => {
                    embed2.addField("Soft Ban: ", `${warn}`, true)
                });
                mutes.forEach(warn => {
                    embed2.addField("Mute:", `${warn}`, true)
                });
                vMute.forEach(warn => {
                    embed2.addField("Voice Mute:", `${warn}`, true)
                });
                banss.forEach(warn => {
                    embed2.addField("Ban:", `${warn}`, true)
                });
                embed2.setFooter(`Total Infractions: ${res.length}`);
                if (embed2.fields.length >= 26) embed2 = embed2.fields.slice(0, 25)
                return interaction.reply({ embeds: [embed2] })
            }
        })
    }
}
