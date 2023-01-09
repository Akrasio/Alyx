const canvacord = require('canvacord')
const { MessageAttachment } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = { 
config: new SlashCommandBuilder() 
.setName('rank') 
.setDescription('Checks a members level!') 
.addUserOption(option => option.setName('member') 
.setDescription("The member to check!")), 
        async execute(message) { 
        let client = message.client;
        let member = message.options.getMember("member") || message.member;
        if (member.bot) member = message.author;
        var level = await client.db.get(`${message.guild.id}_xp.${member.id}_level`) || 0;
        let xp = await client.db.get(`${message.guild.id}_xp.${member.id}_xp`) || 0
        var xpNeeded = level * 1000
        var rank = 0;
        let data = await client.db.all({ filter: i => (i.ID.startsWith(`${message.guild.id}_xptotal`)) });
        let ever = await data[0]?.data;
        let banner = await client.db.get(message.guild.id+".bannerURL");
        let banner2 = await client.db.get(member.user.id+".bannerURL");
        const evers = new Map(Object.entries(ever || 0)) || {}
        let every = [...evers]?.sort((a, b) => b - a)
        rank = await every?.sort((a, b) => b[1] - a[1]).map(es => es[0]).indexOf(`${member.id}`) + 1;
        var image = new canvacord.Rank()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setCustomStatusColor("PURPLE")
            .setCurrentXP(xp)
            .setRequiredXP(xpNeeded)
            .setLevel(level)
            .setLevelColor("BLUE")
            .setBackground("IMAGE", (banner ? String(banner) : (banner2 ? String(banner2) : client.user.avatarURL({ size: 4096 }))))
            .setRank(rank || 0)
            .setAvatar(member.displayAvatarURL({ format: 'png' }))
            .setRankColor('PURPLE')
        image.build().then(data => {
            const rankImage = new MessageAttachment(data, 'Rank.png')
            message.reply({ files: [rankImage] })
        })
    }
}
