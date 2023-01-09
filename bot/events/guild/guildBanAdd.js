const Discord = require("discord.js");
module.exports = async (client, guild, membero) => {
  if (!guild || !guild.members) return;
  let botMe = guild.members.cache.get(client.user.id);
  if (!botMe.permissions.has("VIEW_AUDIT_LOG")) return;
  
  let member = guild.members.cache.get(membero.id)
  const log = await member.guild
    .fetchAuditLogs({
      type: "MEMBER_BAN"
    })
    .then(audit => audit.entries.first());
  const user = log.executor;
  if (user.id === client.user.id) return;
  let whitelist = await client.db.get(`${member.guild.id}.antiraid_whitelist`)
  if (whitelist && whitelist.find(x => x.user === user.id)) {
    return;
  }
  let person = await client.db.get(`${member.guild.id}.${user.id}_banlimit`)
  let limit = await client.db.get(`${member.guild.id}.antiraid_banlimit`)
  if (limit === null) {
    return;
  }
  let logsID = await client.db.get(`${member.guild.id}.antiraid_logs`)
  let logs = client.channels.cache.get(logsID)
  let punish = await client.db.get(`${member.guild.id}.antiraid_punish`)
  if (person > limit - 1) {
    if (punish === "ban") {
      member.guild.members.ban(user.id).then(lolxdbruh => {
        let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name, member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("Banned", "Yes")
          .setColor("GREEN")
        if (logs) {
          logs.send({ embeds: [embed] })
        }
      }).catch(err => {
        let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name, member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("Banned", "No")
          .setColor("#FF0000")
        if (logs) {
          logs.send({ embeds: [embed] })
        }
      })
    } else if (punish === "kick") {
      member.guild.members.cache.get(user.id).kick().then(lolxdok => {
        let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name, member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
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
          .setFooter(member.guild.name, member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("kicked", "No")
          .setColor("#FF0000")
        if (logs) {
          logs.send({ embeds: [embed] })
        }
      })
    } else if (punish === "demote") {
      member.guild.members.cache.get(user.id).roles.cache.forEach(r => {
        if (r.name !== "@everyone") {
          member.guild.members.cache.get(user.id).roles.remove(r.id)
        }
      }).then(ok => {
        let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name, member.guild.iconURL())
          .addField("User", user.tag)
          .addField("Case", "Tried To Raid | breaking the ban limits")
          .addField("Punishment", punish)
          .addField("demoted", "Yes")
          .setColor("GREEN")
        if (logs) {
          logs.send({ embeds: [embed] })
        }
      }).catch(err => {
        let embed = new Discord.MessageEmbed()
          .setTitle("**Anti-Raid**")
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setFooter(member.guild.name, member.guild.iconURL())
          .setColor("#FF0000")
          .addField("User", user.tag)
          .addField("Case", "Tried to Raid | Breaking ban limits")
          .addField("Punishment", punish)
          .addField("demoted", "No")
        if (logs) {
          logs.send({ embeds: [embed] })
        }
      })
    }
  } else {
  await client.db.add(`${member.guild.id}.${user.id}_banlimit`, 1)
   setTimeout(async()=>{
           await client.db.subtract(`${channel.guild.id}.${user.id}_banlimit`, 1)
   }, 10000)
    let pog = await client.db.get(`${member.guild.id}.${user.id}_banlimit`)
    let bruh = await client.db.get(`${member.guild.id}.antiraid_banlimit`)
    let embed = new Discord.MessageEmbed()
      .setTitle("**Anti-Raid**")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter(member.guild.name, member.guild.iconURL())
      .addField("User", user.tag)
      .addField("Case", "banning members...")
      .addField("Punishment", punish)
      .addField("Times", `${pog || 0}/${bruh || 0}`)
      .setColor("GREEN")
    if (logs) {
      logs.send({ embeds: [embed] })
    }
  }
}
