const canvacord = require('canvacord')
const { MessageAttachment, MessageEmbed } = require('discord.js')

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
       config: new SlashCommandBuilder()
       .setName('toplevels')
       .setDescription('Shows xp the leaderboard.'),
       async execute(message) { 
       let client = message.client;
        var rank = 0;
        let data = await client.db.all({ filter: i => i.ID.toLowerCase().startsWith(`${message.guild.id}_xptotal`), limit: 5 });
        let ever = await data[0]?.data;
        const evers = new Map(Object.entries(ever || 0)) || {}
        let every = [...evers]?.sort((a, b) => b - a)
        let i = 1;
        let test = '';

        const stink = await every?.sort((a, b) => b[1] - a[1]);
        let rank1 = stink.map(async es => {
            if (!Number(es[0])) return;
            const level = await client.db.get(`${message.guild.id}_xp.${es[0]}_level`) || 0;
            return `${i++}: <@!${es[0]}> \n > Level: ${level}`
        })?.slice(0, 5);
        rank = await Promise.all(rank1)
        var image = new MessageEmbed()
            .setAuthor({ name: message.guild.name + " Leaderboard", iconURL: message.guild.iconURL({ size: 4096, dynamic: true, format: "png" }) })
            .setTimestamp()
            .setDescription(rank?.join("\n") || "Nothing here!")
            .setColor("YELLOW");
        message.reply({ embeds: [image] })
    }
}

