const { MessageEmbed } = require('discord.js');
const CASES = require('../models/cases');
const SERVERS = require('../models/servers');
const moment = require('moment');
const fetch = require('node-fetch');
const { ownerID } = require("../config/owner.json")
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT2 = new SlashCommandUserOption().setName("user").setDescription("User to ban").setRequired(true);
OPT1 = new SlashCommandStringOption().setName("reason").setDescription("Reason to ban").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('ban')
            .addUserOption(OPT2)
            .addStringOption(OPT1)
            .setDescription('Bans a user/member from the server'),
    async execute(interaction) {
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };

        try {
            if (!hasRole && !interaction.member.permissions.has("BAN_MEMBERS") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
            if (!interaction.guild.me.permissions.has("BAN_MEMBERS")) return interaction.reply("**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");

            let banMember = interaction.options.getMember('user');
            if (!banMember) return interaction.reply("**User Is Not In The Guild**");
            if (modroles && banMember.roles?.cache.has(modroles)) return interaction.reply("**You can not ban another staff member!**");
            if (banMember === interaction.user) return interaction.reply("**You Cannot Ban Yourself**")
            var reason = interaction.options.getString('reason');
            if (!banMember.bannable) return interaction.reply("**Cant Kick That User**");
            try {
                await banMember.send(`**Hello, You Have Been Banned From ${interaction.guild.name} for - ${reason || "No Reason"}**`).catch(() => null)
                await interaction.guild.members.ban(banMember, { days: 7, reason: reason })
                CASES.find({ serverID: interaction.guild.id }).sort([['descending']]).exec(async (err, res) => {
                    let infractions = await new CASES({
                        userID: banMember.id,
                        reason: reason,
                        action: 'Ban',
                        Moderator: interaction.user.id,
                        serverID: interaction.guild.id,
                        time: Date.now().toString().slice(0, 10),
                        case: res.length + 1
                    })
                    infractions.save();
                })
            } catch {
               return interaction.reply("**Cant ban that user**");
            }
            
            if (reason) {
                var sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${banMember.user.username}** has been banned for ${reason}`)
               await interaction.reply({ embeds: [sembed] })
            } else {
                var sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${banMember.user.username}** has been banned`)
                await interaction.reply({ embeds: [sembed2] })
            }
            let channel = await interaction.client.db.get(`${interaction.guild.id}.modlogs`)
            if (!channel) return;
            const embed = new MessageEmbed()
                .setAuthor(`${interaction.guild.name} Modlogs`, interaction.guild.iconURL())
                .setColor("#ff0000")
                .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
                .setFooter(interaction.guild.name, interaction.guild.iconURL())
                .addField("**Moderation**", "Ban")
                .addField("**Username**", `${banMember.user.username}`)
                .addField("**ID**", `${banMember.id}`)
                .addField("**Banned By**", `${interaction.user.username}`)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", `${interaction.createdAt.toLocaleString()}`)
                .setTimestamp();
            var sChannel = interaction.guild.channels.cache.get(channel)
            if (!sChannel) return;
           return sChannel.send({ embeds: [embed] })
        } catch (e) {
            return interaction.channel.send(`**${e.message}**`)
        }
    }
}
