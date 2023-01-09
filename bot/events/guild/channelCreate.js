const Discord = require("discord.js");
module.exports = async (client, channel) => {
    if (!channel.guild) return;
    if (!channel.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
    const log = await channel.guild.fetchAuditLogs({
        type: 'CHANNEL_CREATE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = await client.db.get(`${channel.guild.id}.antiraid_whitelist`)
    if (whitelist && whitelist.find(x => x.user === user.id)) {
        return;
    }
    let person = await client.db.get(`${channel.guild.id}.${user.id}_channelcreate`)
    let limit = await client.db.get(`${channel.guild.id}.antiraid_channelcreate`)
    if (limit === null) {
        return;
    }
    let logsID = await client.db.get(`${channel.guild.id}.antiraid_logs`)
    let logs = client.channels.cache.get(logsID)
    let punish = await client.db.get(`${channel.guild.id}.antiraid_punish`)
    if (person > limit - 1) {
        if (punish === "ban") {
            channel.guild.members.ban(user.id).then(hshshshs => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(channel.guild.name, channel.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the channel create limits")
                    .addField("Punishment", punish)
                    .addField("Banned", "Yes")
                    .setColor("GREEN")
                if (logs) {
                    return logs.send({ embeds: [embed] })
                }
            }).catch(err => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(channel.guild.name, channel.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the channel create limits")
                    .addField("Punishment", punish)
                    .addField("Banned", "No")
                    .setColor("#FF0000")
                if (logs) {
                    logs.send({ embeds: [embed] })
                }
            })
        } else if (punish === "kick") {
            channel.guild.members.cache.get(user.id).kick().then(jsisj => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(channel.guild.name, channel.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the channel create limits")
                    .addField("Punishment", punish)
                    .addField("kicked", "Yes")
                    .setColor("GREEN")
                if (logs) {
                    logs.send({ embeds: [embed] })
                }
            }).catch(err => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(channel.guild.name, channel.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the channel create limits")
                    .addField("Punishment", punish)
                    .addField("kicked", "No")
                    .setColor("#FF0000")
                if (logs) {
                    logs.send({ embeds: [embed] })
                }
            })
        } else if (punish === "demote") {
            channel.guild.members.cache.get(user.id).roles.cache.forEach(r => {
                if (r.name !== "@everyone") {
                    channel.guild.members.cache.get(user.id).roles.remove(r.id)
                }
            }).then(hrh => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(channel.guild.name, channel.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the channel create limits")
                    .addField("Punishment", punish)
                    .addField("demoted", "Yes")
                    .setColor("GREEN")
                if (logs) {
                    return logs.send({ embeds: [embed] })
                }
            }).catch(err => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(channel.guild.name, channel.guild.iconURL())
                    .setColor("#FF0000")
                    .addField("User", user.tag)
                    .addField("Case", "Tried to Raid | Breaking channel create limits")
                    .addField("Punishment", punish)
                    .addField("demoted", "No")
                if (logs) {
                    logs.send({ embeds: [embed] })
                }
            })
        }
    } else {
      await client.db.add(`${channel.guild.id}.${user.id}_channelcreate`, 1)
        setTimeout(async()=>{
           await client.db.subtract(`${channel.guild.id}.${user.id}_channelcreate`, 1)
        }, 10000)
        let pog = await client.db.get(`${channel.guild.id}.${user.id}_channelcreate`)
        let bruh = await client.db.get(`${channel.guild.id}.antiraid_channelcreate`)
        let embed = new Discord.MessageEmbed()
            .setTitle("**Anti-Raid**")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter(channel.guild.name, channel.guild.iconURL())
            .addField("User", user.tag)
            .addField("Case", "Creating channels...")
            .addField("Punishment", punish)
            .addField("Times", `${pog || 0}/${bruh || 0}`)
            .setColor("GREEN")
        if (logs) {
            logs.send({ embeds: [embed] })
        }
    }
}
