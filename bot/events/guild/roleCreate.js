const Discord = require("discord.js");
module.exports = async (client, role) => {
    if (!role.guild) return;
    if (role.managed === true) return;
    if (!role.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
    const log = await role.guild.fetchAuditLogs({
        type: 'ROLE_CREATE'
    }).then(audit => audit.entries.first())
    const user = log.executor
    if (user.id === client.user.id) return;
    let whitelist = await client.db.get(`${role.guild.id}.antiraid_whitelist`)
    if (whitelist && whitelist.find(x => x.user === user.id)) {
        return;
    }
    let person = await client.db.get(`${role.guild.id}.${user.id}_rolecreate`)
    let limit = await client.db.get(`${role.guild.id}.antiraid_rolecreate`)
    if (limit === null) {
        return;
    }
    let logsID = await client.db.get(`${role.guild.id}.antiraid_logs`)
    let punish = await client.db.get(`${role.guild.id}.antiraid_punish`)
    let logs = client.channels.cache.get(logsID)
    if (person > limit - 1) {
        if (punish === "ban") {
            role.guild.members.ban(user.id).then(bruhmoment => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(role.guild.name, role.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the role create limits")
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
                    .setFooter(role.guild.name, role.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the role create limits")
                    .addField("Punishment", punish)
                    .addField("Banned", "No")
                    .setColor("#FF0000")
                if (logs) {
                    return logs.send({ embeds: [embed] })
                }
            })
        } else if (punish === "kick") {
            role.guild.members.cache.get(user.id).kick().then(bruhlol => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(role.guild.name, role.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the role create limits")
                    .addField("Punishment", punish)
                    .addField("kicked", "Yes")
                    .setColor("GREEN")
                if (logs) {
                    return logs.send({ embeds: [embed] })
                }
            }).catch(err => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(role.guild.name, role.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the role create limits")
                    .addField("Punishment", punish)
                    .addField("kicked", "No")
                    .setColor("#FF0000")
                if (logs) {
                    return logs.send({ embeds: [embed] })
                }
            })
        } else if (punish === "demote") {
            role.guild.members.cache.get(user.id).roles.cache.forEach(r => {
                if (r.name !== "@everyone") {
                    role.guild.members.cache.get(user.id).roles.remove(r.id)
                }
            }).then(bruhlolxd => {
                let embed = new Discord.MessageEmbed()
                    .setTitle("**Anti-Raid**")
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setFooter(role.guild.name, role.guild.iconURL())
                    .addField("User", user.tag)
                    .addField("Case", "Tried To Raid | breaking the role create limits")
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
                    .setFooter(role.guild.name, role.guild.iconURL())
                    .setColor("#FF0000")
                    .addField("User", user.tag)
                    .addField("Case", "Tried to Raid | Breaking role create limits")
                    .addField("Punishment", punish)
                    .addField("demoted", "No")
                if (logs) {
                    return logs.send({ embeds: [embed] })
                }
            })
        }
    } else {
      await client.db.add(`${role.guild.id}.${user.id}_rolecreate`, 1)
      setTimeout(async()=>{
           await client.db.subtract(`${role.guild.id}.${user.id}_rolecreate`, 1)
        }, 10000)
        let pog = await client.db.get(`${role.guild.id}.${user.id}_rolecreate`)
        let embed = new Discord.MessageEmbed()
            .setTitle("**Anti-Raid**")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter(role.guild.name, role.guild.iconURL())
            .addField("User", user.tag)
            .addField("Case", "Creating Roles...")
            .addField("Punishment", punish)
            .addField("Times", `${pog || 0}/${limit || 0}`)
            .setColor("GREEN")
        if (logs) {
            logs.send({ embeds: [embed] })
        }
    }
}
