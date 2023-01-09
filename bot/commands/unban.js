const { MessageEmbed } = require("discord.js")
const { ownerID } = require("../config/owner.json")
const CASES = require('../models/cases');
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandStringOption().setName("username").setDescription("Username of the one to unban").setRequired(true);
OPT2 = new SlashCommandStringOption().setName("reason").setDescription("reason").setRequired(true);


module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('unban')
            .addStringOption(OPT1)
            .addStringOption(OPT2)
            .setDescription('Unbans a user that was banned before.'),
    async execute(interaction) {

        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("BAN_MEMBERS") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have The Permissions To Unban Someone! - [BAN_MEMBERS]**")
        let bannedMemberInfo = await interaction.guild.bans.fetch()
        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username === interaction.options.getString("username") || b.user.id === interaction.options.getString("username"));
        if (!bannedMember) return interaction.reply("**Please Provide A Valid Username, Tag Or ID Or The User Is Not Banned!**")

        let reason = interaction.options.getString("reason")

        if (!interaction.guild.me.permissions.has("BAN_MEMBERS")) return interaction.reply("**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**")
        try {
            if (reason) {
                interaction.guild.members.unban(bannedMember.user.id, reason)
                CASES.find({ serverID: interaction.guild.id }).sort([['descending']]).exec(async (err, res) => {
                    let infractions = await new CASES({
                        userID: bannedMember.id,
                        reason: "UNBAN: "+ reason || "UNBAN: "+"No Reason Given!",
                        action: 'Ban',
                        Moderator: interaction.user.id,
                        serverID: interaction.guild.id,
                        time: Date.now().toString().slice(0, 10),
                        case: res.length + 1
                    })
                    infractions.save();
                })
                var sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${bannedMember.user.tag} has been unbanned for ${reason}**`)
                interaction.reply({ embeds: [sembed] })
            } else {
                interaction.guild.members.unban(bannedMember.user.id, reason)
                var sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**${bannedMember.user.tag} has been unbanned**`)
                interaction.reply({ embeds: [sembed2] })
            }
        } catch {

        }

        let channel = await interaction.client.db.get(`${interaction.guild.id}.modlogs`)
        if (!channel) return;

        let embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
            .setAuthor({ name: `${interaction.guild.name} Modlogs`, iconURL: interaction.guild.iconURL() })
            .addField("**Moderation**", "unban")
            .addField("**Unbanned**", `${bannedMember.user.username}`)
            .addField("**ID**", `${bannedMember.user.id}`)
            .addField("**Moderator**", interaction.user.username)
            .addField("**Reason**", `${reason}` || "**No Reason**")
            .addField("**Date**", interaction.createdAt.toLocaleString())
            .setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setTimestamp();

        var sChannel = interaction.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send({ embeds: [embed] })
    }
}
