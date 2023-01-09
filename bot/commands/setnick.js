const { MessageEmbed } = require('discord.js');
const { ownerID } = require("../config/owner.json");

const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT2 = new SlashCommandUserOption().setName("user").setDescription("User").setRequired(true);
OPT1 = new SlashCommandStringOption().setName("newname").setDescription("New Nickname").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('nick')
            .setDescription('Sets a users nickname!')
            .addUserOption(OPT2)
            .addStringOption(OPT1),

    async execute(interaction) {
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles){
        hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("MANAGE_GUILD") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have Permissions To Change Nickname! - [MANAGE_GUILD]**");
        if (!interaction.guild.me.permissions.has("MANAGE_NICKNAMES")) return interaction.reply("**I Dont Have Permissions To Change Nickname! - [CHANGE_NICKNAME]**");
        let member = interaction.options.getMember('user')
        if (!member) return interaction.reply("**Please Enter A Username!**");

        if (member.roles.highest.comparePositionTo(interaction.guild.me.roles.highest) >= 0) return interaction.reply('**Cannot Set or Change Nickname Of This User!**')

        if (!interaction.options.getString('newname')) return interaction.reply("**Please Enter A Nickname or `$random`**");
        let nick = interaction.options.getString("newname").replace("$random", "uwu-ur-so-warm-" + Math.round(Math.random() * 999));
        try {
            member.setNickname(nick)
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`**Changed Nickname of ${member.displayName} to ${nick}**`)
            interaction.reply({ embeds: [embed] })
        } catch {
            return interaction.reply("**Missing Permissions - [CHANGE_NICKNAME]")
        }

        let channel = await interaction.client.db.get(`${interaction.guild.id}.modlogs`)
        if (!channel) return;

        const sembed = new MessageEmbed()
            .setAuthor(`${interaction.guild.name} Modlogs`, interaction.guild.iconURL())
            .setColor("#ff0000")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter(interaction.guild.name, interaction.guild.iconURL())
            .addField("**Moderation**", "setnick")
            .addField("**Nick Changed Of**", member.username)
            .addField("**Nick Changed By**", interaction.user.username)
            .addField("**Nick Changed To**", nick)
            .addField("**Date**", interaction.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = interaction.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send({ embeds: [sembed] })
    }
}
