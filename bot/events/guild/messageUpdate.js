
const Discord = require('discord.js');
const { PREFIX } = require('../../config/config');
module.exports = async (bot, oldMessage, newMessage) => {
    if (oldMessage.author == null || newMessage.author == null) return;
    if (!oldMessage.guild) return;
    if (oldMessage.author.bot) return;
    let prefix;
    let dLogs = await bot.db.get(`${newMessage.guild.id}.modlogs`);
    let fetched = await bot.db.get(`${newMessage.guild.id}.clogs`);
    if (newMessage.content.match(/(?:https:)/g)) return;
    if (fetched !== null) {
        prefix = newMessage.guild.channels.cache.get(fetched)
    } else {
        prefix = newMessage.guild.channels.cache.get(dLogs);
    }
    try {
        if (oldMessage.channel.type === "dm") return;
        const image = oldMessage.attachments.first()
        if (!prefix && !prefix) return;
        if (!prefix || prefix && !prefix.permissionsFor(bot.user.id).has(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'VIEW_CHANNEL'])) { return };
        if (oldMessage.author.bot) return;
        if (newMessage.author.bot) return;
        if (image) {
            const embed = new Discord.MessageEmbed()
            let x = 0;
            embed
                .setColor("YELLOW")
                .setTitle("Message Edited < With Image >")
                .setThumbnail(newMessage.author.avatarURL({ dynamic: true }))
                .setAuthor(oldMessage.author.username + " | " + oldMessage.author.id, oldMessage.author.avatarURL({ dynamic: true }), oldMessage.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(`**Old Message Content[:pencil:](${newMessage.url}):**\n${oldMessage.content || "No message"}`)
                .addField(`**New Message Content:**`, `${newMessage.content || "No message"}`, true)
                .setTimestamp()
                .setFooter("Click the Pencil emote to jump to message! | Message ID: " + newMessage.id)
                .setImage(oldMessage.attachments.first().url.replace("cdn", "media").replace("com", "net"));
            oldMessage.attachments.forEach(i => {
                x++
                embed.addField(`Attachment: ${x}`, `[Image URL](${i.url.replace("cdn", "media").replace("com", "net")})`, true)
            })
            prefix.send({ embeds: [embed] })
        } else {
            const embed = new Discord.MessageEmbed()
            embed
                .setColor("YELLOW")
                .setTitle("Message Edited")
                .setThumbnail(newMessage.author.avatarURL({ dynamic: true }))
                .setAuthor(oldMessage.author.username + " | " + oldMessage.author.id, oldMessage.author.avatarURL({ dynamic: true }), oldMessage.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(`**Old Message Content[:pencil:](${newMessage.url}):** ${oldMessage.content || "No message"}`)
                .addField(`**New Message Content:**`, `${newMessage.content || "No message"}`, true)
                .setTimestamp()
                .setFooter("Click the Pencil emote to jump to message! | Message ID: " + newMessage.id, oldMessage.guild.iconURL({ dynamic: true }))
            prefix.send({ embeds: [embed] })
        }
       } catch (err){
            console.log(err)
        }
}
