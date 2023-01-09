const { AhniClient } = require("ahnidev");
const Discord = require("discord.js")
module.exports = async (client, guild) => {
    const u = await client.db.get(guild.guild.id + ".antijoin");
    const mrole = await client.db.get(guild.guild.id + ".muterole");
    const wch = await client.db.get(guild.guild.id + ".welcomeChn");
    const wsg = await client.db.get(guild.guild.id + ".welcomeMsg");
    if (guild.guild.channels.cache.get(wch) && wsg !== null){
        await guild.guild.channels.cache.get(wch).send({embeds: [ new Discord.MessageEmbed()
        .setTitle(`${guild.user.tag} ` +"has joined the server!")
        .setDescription(`${wsg.replace(/\|/gi,"\n")}`)
        .setColor("RANDOM")
        .setTimestamp(guild.user.createdAt)
        .setThumbnail(guild.user.displayAvatarURL({dynamic:true, size:4096, format:"png"}))
        .setFooter({text: "User ID: "+guild.user.id+" • Account created: "})
      ]})
    }
    if (u == "on") {
       await new client.LewdCaptcha.check(guild, 4, mrole, 5);
    };
    const status = await client.db.get(guild.guild.id + ".captcha_status")
    if (!guild.guild.me.permissions.has(["KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS"])) return;
    const botrole = await client.db.get(guild.guild.id + ".joinBotRole");
    const memberrole = await client.db.get(guild.guild.id + ".joinRole");
    if (memberrole !== null && status != "on"){
    if (!guild.user.bot){
    if (guild.guild.roles.cache.get(memberrole)){
        guild.roles.add(memberrole);
    }
    } else {
        if (guild.guild.roles.cache.get(botrole)){
            guild.roles.add(botrole);
        }
    }
    }
    if (status == "on") {
        const roles = await client.db.get(guild.guild.id + ".captcha_role");
        const channels = await client.db.get(guild.guild.id + ".captcha_channel");
        const channelz = await client.channels.cache.get(channels);
        const rolez = await guild.guild.roles.cache.get(roles).id;
        if (guild.user.bot) return;
        if (!rolez || !channelz) return console.log("oof no channel/role/!")
        return (await new AhniCaptcha(client, { sendToTextChannel: false, channelID: channelz.id, attempts: 3, caseSensitive: false }).present(guild, channelz, rolez));
    } else {
        return;
    }
}
// 884859459430678600
