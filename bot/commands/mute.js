const { MessageEmbed } = require("discord.js");
const { ownerID } = require("../config/owner.json")
const ms = require('ms');
const CASES = require('../models/cases');
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT3 = new SlashCommandStringOption().setName("time").setDescription("time").setRequired(true);
OPT2 = new SlashCommandUserOption().setName("user").setDescription("User").setRequired(true);
OPT1 = new SlashCommandStringOption().setName("reason").setDescription("reason").setRequired(true);
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('mute')
            .addStringOption(OPT1)
            .addUserOption(OPT2)
            .addStringOption(OPT3)
            .setDescription('Mutes a user in the server.'),
    async execute(interaction) {
        try {
            let hasRole;
            let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
            if (modroles) {
                hasRole = interaction.member.roles.cache.has(modroles);
            };
            if (!hasRole && !interaction.member.permissions.has("MANAGE_ROLES") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have Permmissions To Mute Someone! - [MANAGE_ROLES]**");
            if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply("**I Don't Have Permissions To Mute Someone! - [MANAGE_ROLES]**")
            var mutee = interaction.options.getMember('user')
            let reason = interaction.options.getString('reason')
            if (mutee === interaction.member) return interaction.reply("**You Cannot Mute Yourself!**")
            if (mutee.roles.highest.comparePositionTo(interaction.guild.me.roles.highest) >= 0) return interaction.reply('**Cannot Mute This User!**')
            if (mutee.user.bot) return interaction.reply("**You cannot use the bot to mute bots!**");
            let muterole;
            let dbmute = await interaction.client.db.get(`${interaction.guild.id}.muterole`);
            let muteerole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "muted")

            if (!interaction.guild.roles.cache.has(dbmute)) {
                muterole = muteerole
                if (muterole) {
                    await interaction.client.db.set(`${interaction.guild.id}.muterole`, muterole.id);
                }
            } else {
                muterole = interaction.guild.roles.cache.get(dbmute)
            }

            if (!muterole) {
                try {
                    muterole = await interaction.guild.roles.create({
                        name: "Muted",
                        color: "#514f48",
                        permissions: []
                    })
                    interaction.guild.channels.cache.forEach(async (channel) => {
                        if (channel.permissionsFor(interaction.client.user.id).has([`MANAGE_CHANNELS`]))
                            await channel.permissionOverwrites.create(muterole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                SPEAK: false,
                                CONNECT: false,
                            })
                    })
                    await interaction.client.db.set(`${interaction.guild.id}.muterole`, muterole.id);
                } catch (e) {
                    console.log(e);
                }
            };
            let time = interaction.options.getString("time") || "30m";
            if (mutee.roles.cache.has(muterole.id)) return interaction.reply("**User Is Already Muted!**");
            if (modroles && mutee.roles.cache.has(modroles)) return interaction.reply("**You can not punish another staff member!**");
            interaction.client.lewds.mute(mutee, time, reason);
            CASES.find({ serverID: interaction.guild.id }).sort([['descending']]).exec(async (err, res) => {
                let infractions = await new CASES({
                    userID: mutee.id,
                    reason: reason,
                    action: 'Mute',
                    Moderator: interaction.user.id,
                    serverID: interaction.guild.id,
                    duration: time,
                    time: Date.now().toString().slice(0, 10),
                    case: res.length + 1
                })
                infractions.save();
            })
            try {
                if (mutee.roles.has(interaction.guild.roles.premiumSubscriberRole)) {
                    mutee.roles.set([muterole.id, interaction.guild.roles.premiumSubscriberRole.id]).then(() => {
                        mutee.send(`**Hello, You Have Been Muted In ${interaction.guild.name} for - ${reason || "No Reason"}**`).catch(() => null)
                    })
                } else {
                    mutee.roles.set([muterole.id]).then(() => {
                        mutee.send(`**Hello, You Have Been Muted In ${interaction.guild.name} for - ${reason || "No Reason"}**`).catch(() => null)
                    })
                }
            } catch {
                if (mutee.bot) {
                    mutee.roles.add(muterole.id);
                } else if (!mutee.bot) {
                    mutee.roles.add(muterole.id);
                }
            }
            if (reason) {
                const sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                    .setDescription(`${mutee.user.username} was successfully muted for ${ms(ms(time), { long: true })} | ${reason}`)
                interaction.reply({ embeds: [sembed] });
            } else {
                const sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`${mutee.user.username} was successfully muted`)
                interaction.reply({ embeds: [sembed2] });
            }

            let channel = await interaction.client.db.get(`${interaction.guild.id}.modlogs`)
            if (!channel) return;
            let embed = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(`${interaction.guild.name} Modlogs`, interaction.guild.iconURL())
                .addField("**Moderation**", "Mute")
                .addField("**Duration**", ms(ms(time), { long: true }))
                .addField("**Mutee**", mutee.user.username)
                .addField("**Moderator**", interaction.user.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", interaction.createdAt.toLocaleString())
                .setFooter(interaction.member.displayName, interaction.user.displayAvatarURL())
                .setTimestamp()
            var sChannel = interaction.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] })
        } catch (err) {
            return console.log(err);
        }
    }
}
