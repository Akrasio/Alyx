
const Discord = require('discord.js');
module.exports = async (bot, message) => {
    if (!message.guild?.id) return;
        if (!message.author || message.author.bot) return;
        let prefix;
        let prefixLog = prefix;
        let dLogs = await bot.db.get(`${message.guild.id}.modlogs`);
        let fetched = await bot.db.get(`${message.guild.id}.clogs`);

        if (fetched === null) {
            prefix = message.guild.channels.cache.get(dLogs)
        } else {
            prefix = message.guild.channels.cache.get(fetched);
        }
        if (message.channel.type === "dm") return;
        const image = message.attachments.first()
        if (!prefix && !prefixLog) return;
        if (!prefix || prefix && !prefix.permissionsFor(bot.user.id).has('SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'VIEW_CHANNEL')) { return console.log("Not Permitted")};
        if (image) {
            let x = 0;
            const embed = new Discord.MessageEmbed()
            embed
                .setColor("RED")
                .setTitle("Image Deleted")
                .setThumbnail(message.author.avatarURL({ dynamic: true }))
                .setAuthor(message.author.username + " | " + message.author.id, message.author.avatarURL({ dynamic: true }), message.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(`Message Content:\n${message.content || "No message"}`)
                .setImage(message.attachments.first().url.replace("cdn", "media").replace("com", "net"))
                .setTimestamp()
                .setFooter("Message ID: " + message.id, message.guild.iconURL({ dynamic: true }));
            message.attachments.forEach(i => {
                x++;
                embed.addField(`Attachment: ${x}`, `[Image URL](${i.url.replace("cdn", "media").replace("com", "net")})`, true)
            })
            prefix.send({ embeds: [embed] })
        } else {
            const embed = new Discord.MessageEmbed()
            embed
                .setColor("RED")
                .setTitle("Message Deleted")
                .setThumbnail(message.author.avatarURL({ dynamic: true }))
                .setAuthor(message.author.username + " | " + message.author.id, message.author.avatarURL({ dynamic: true }), message.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(`Message Content:\n${message.content || "No message"}`)
                .setTimestamp()
                .setFooter("Message ID: " + message.id, message.guild.iconURL({ dynamic: true }))
            prefix.send({ embeds: [embed] })
        }
}
