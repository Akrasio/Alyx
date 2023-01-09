const { MessageEmbed } = require("discord.js");
const CASES = require('../models/cases');
const SERVERS = require('../models/servers');
const moment = require('moment');
const fetch = require('node-fetch');
const { ownerID } = require("../config/owner.json");
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT2 = new SlashCommandUserOption().setName("user").setDescription("User").setRequired(true);
OPT1 = new SlashCommandStringOption().setName("reason").setDescription("Reason").setRequired(true);
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('kick')
            .addUserOption(OPT2)
            .addStringOption(OPT1)
            .setDescription('kicks a user/member from the server'),
    async execute(interaction) {
        try {
            let hasRole;
            let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
            if (modroles) {
                hasRole = interaction.member.roles.cache.has(modroles);
            };
            if (!hasRole && !interaction.member.permissions.has("KICK_MEMBERS") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**");
            if (!interaction.guild.me.permissions.has("KICK_MEMBERS")) return interaction.reply("**I Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**");
            var kickMember = interaction.options.getMember("user");
            if (!kickMember) return interaction.reply("**User Is Not In The Guild!**");
            if (modroles && kickMember.roles.cache.has(modroles)) return interaction.reply("**You can not punish another staff member!**");
            if (kickMember.id === interaction.member.id) return interaction.reply("**You Cannot Kick Yourself!**")
            if (!kickMember.kickable) return interaction.reply("**Cannot Kick This User!**")
            if (kickMember.user.bot) return interaction.reply("**Cannot Kick A Bot!**")

            var reason = interaction.options.getString("reason")
            try {
                const sembed2 = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`**You Have Been Kicked From ${interaction.guild.name} for - ${reason || "No Reason!"}**`)
                    .setFooter(interaction.guild.name, interaction.guild.iconURL())
                kickMember.send({ embeds: [sembed2] }).then(() =>
                    kickMember.kick()).catch(() => null);

                CASES.find({ serverID: interaction.guild.id }).sort([['descending']]).exec(async (err, res) => {
                    let infractions = await new CASES({
                        userID: kickMember.id,
                        reason: reason,
                        action: 'Kick',
                        Moderator: interaction.user.id,
                        serverID: interaction.guild.id,
                        time: Date.now().toString().slice(0, 10),
                        case: res.length + 1
                    })

                    infractions.save();
                })
            } catch {
                kickMember.kick(reason)
            }
            if (reason) {
                var sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${kickMember.username}** has been kicked for ${reason}`)
                interaction.reply({ embeds: [sembed] });
            } else {
                var sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${kickMember.username}** has been kicked`)
                interaction.reply({ embeds: [sembed2] });
            }
            let channel = await interaction.client.db.get(`${interaction.guild.id}.modlogs`)
            if (!channel) return;

            const embed = new MessageEmbed()
                .setAuthor(`${interaction.guild.name} Modlogs`, interaction.guild.iconURL())
                .setColor("#ff0000")
                .setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
                .setFooter(interaction.guild.name, interaction.guild.iconURL())
                .addField("**Moderation**", "kick")
                .addField("**User Kicked**", kickMember.username)
                .addField("**Kicked By**", interaction.user.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", interaction.createdAt.toLocaleString())
                .setTimestamp();

            var sChannel = interaction.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] })
        } catch (e) {
            return interaction.reply(`**${e.message}**`)
        }
    }
}
