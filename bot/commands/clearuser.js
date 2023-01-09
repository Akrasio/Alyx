const { MessageEmbed } = require('discord.js');
const CASES = require('../models/cases');
const SERVERS = require('../models/servers');
const moment = require('moment');
const fetch = require('node-fetch');
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config: new SlashCommandBuilder()
        .setName('clearuser')
        .setDescription('Clears a member!')
        .addUserOption(option =>
            option.setName('member')
                .setDescription("The member to clear!")),
    async execute(interaction) {
        let client = interaction.client;

        try {
            if (!interaction.memberPermissions.has("ADMINISTRATOR")) return interaction.reply("You lack enough permission to do this! | Administrator only!");
            let user = interaction.options.getMember("member") || interaction.user.id;
            if (user.roles.highest.position >= interaction.member.roles.highest.position) return message.channel.send({ embeds: [InvalidPerms] })
            CASES.find({
                serverID: interaction.guild.id,
                action: "Warn",
                userID: user.id
            }, async (err, res) => {

                res.forEach(async (warns) => {
                    warns.deleteOne();
                })

                let SuccessMsg = new MessageEmbed()
                    .setTitle('✅ Action: Reset Warns!')

                    .setDescription(`Successfully reset warnings for ${user.user.tag}`)
                    .setTimestamp()
                interaction.reply({ embeds: [SuccessMsg] });
                let logChan = await interaction.client.db.get(`${interaction.guild.id}.modlogs`);
                if (logChan) {

                    let LogMessage = new MessageEmbed()
                        .setTitle('✅ Action: Reset Warns!')
                        .setDescription(`Successfully reset warnings for ${userToFetch.user.tag}`)
                        .addField('Moderator', `${message.author.tag}`, true)
                        .setTimestamp()
                    return logChan.send({ embeds: [LogMessage] });
                }
            })
        }
        catch (err) {
            console.log(err)
        }
    }
}
