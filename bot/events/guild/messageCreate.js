const { MessageEmbed } = require("discord.js");
const { PREFIX } = require("../../config/config");
const Discord = require("discord.js")

module.exports = async (client, msg, sql) => {
    if (!msg.author) return;
    if (!msg.guild) return;
    if (!Number(await client.db?.ping())) return;
    if (msg.author.bot) return;
    
    var regex =
        /\b(?:https:\/\/|http:\/\/|www\.|)\S+\.(?:com|ai|art|biz|cloud|club|co|click|design|dev|digital|fun|gg|gift|health|info|io|is|live|me|net|ml|ru|pl|tk|nl|online|org|shop|site|space|store|studio|tech|us|website|xyz)\b/i;
   var regx = /(?:media.discordapp.net)|(?:tenor.com)|(?:giphy.com)/i
   var messagecontent = msg.content;
    // set current time for use down the road
    const now = new Date();
    const unixTime = Math.floor(Date.now() / 1000);

    let staffrole = await client.db.get(msg.guild.id + ".modrole");
    let channe = await client.db.get(`${msg.guild.id}.modlogs`)
    let logchannels = msg.guild.channels.cache.get(channe);

    //check if message contains url
    if (messagecontent.match(regex)) {
       let a = await msg.client.db.get(msg.guild.id + ".linkMod");
        if (!staffrole || !logchannels) return;
        if (a == "1"){
        if (messagecontent.match(regx)){
         } else {
           if (msg.member.roles.cache.has(staffrole)) return;
              return msg.delete()
          }}
        let urltoscan = msg.content.match(regex)[0];
        // convert url to domain    
        var pointtosliceat = 0;
        if (urltoscan.startsWith('https://')) {
            var pointtosliceat = 8;
        }
        if (urltoscan.startsWith(`http://`)) {
            var pointtosliceat = 7;
        }
        if (urltoscan.startsWith(`https://www.`)) {
            var pointtosliceat = 12;
        }
        if (urltoscan.startsWith(`www.`)) {
            var pointtosliceat = 4;
        }
        let domaintoscan = urltoscan.slice(pointtosliceat);
        await console.log(`URL found! Domain: ${domaintoscan}`);
        if (a == "1" && domaintoscan.toLowerCase() !== "tenor.com" && domaintoscan.toLowerCase() !== "giphy.com" && domaintoscan.toLowerCase() !== "discordapp.net") return console.log(`URL found! Domain: ${domaintoscan}`);
        let fetch = require("node-fetch");
        let scanresult = await fetch(`https://api.phisherman.gg/v1/domains/${domaintoscan}`, {
            headers: {
                'Content-Type': `application/json`,
            },
            method: "get"
        }).then(res => res.text()).then(
            text => {
                return text;
            }
        )
        console.log(scanresult)
        // get info about the guild
        let guildinfo = msg.guild;
        // check if link is sussy
        if (scanresult == 'true') {
            console.log(
                `sussy link found in ${guildinfo.name} (${msg.guildId})`
            );
            // delete the sus url
            try {
                msg.delete()
            } catch (error) {
                console.error(`Could not delete the message, error detected: ${error}`);
                return msg.channel.send({ content: `A message was detected with a suspicious URL that could not be deleted. This is probably caused by another bot that already deleted the message.` });
            }
            try {
                if (msg.guild.me.permissions.has("MODERATE_MEMBERS")) {
                    await msg.member.timeout(86400000, `Suspicious URL send in server`)
                }
            } catch (error) {
                logchannels.send({
                    content: `Missing permissions to apply a timeout to <@${msg.author.id}>`,
                });
            }
            await msg.channel.send({
                embeds: [
                    {
                        type: 'rich',
                        title: `Suspicious link spotted`,
                        description: `Hi <@${msg.author.id}>,\nIt seems that the url you send links to a website with suspicious activity. If you believe this was an error, please reach out to one of our staff members.\n\nTo prevent further harm to other members of ${guildinfo.name}, we have muted you. Other actions might be taken by the staff team.`,
                        color: 0xcc2936,
                    },
                ],
            });

            let messagecontentwithoutURL = messagecontent.replace(
                urltoscan,
                `\`${urltoscan}\``
            );
            return logchannels.send({
                content: `<@&${staffrole}>. Suspicious link sent by: <@${msg.author.id}>`,
                tts: false,
                allowed_mentions: {
                    replied_user: false,
                    parse: [],
                },
                embeds: [
                    {
                        type: 'rich',
                        title: `Suspicious link spotted!`,
                        description: '',
                        color: 0x00ffff,
                        fields: [
                            {
                                name: `Author`,
                                value: `<@${msg.author.id}> (ID: \`${msg.author.id}\`)`,
                                inline: true,
                            },
                            {
                                name: `Channel`,
                                value: `<#${msg.channel.id}>`,
                                inline: true,
                            },
                            {
                                name: `Suspicious domain`,
                                value: `\`${urltoscan}\``,
                                inline: true,
                            },
                            {
                                name: `Message`,
                                value: `${messagecontentwithoutURL}`,
                                inline: true,
                            },
                            {
                                name: `Date and time`,
                                value: `<t:${unixTime}:f> (<t:${unixTime}:R>)`,
                                inline: true,
                            },
                            {
                                name: `Please report the url if it is a phishing website`,
                                value: `https://phish.report/${urltoscan}`,
                                inline: false,
                            },
                        ],
                        footer: {
                            text: `Be aware that clicking the suspicious URL might cause harm to your account and/or your computer.`,
                            icon_url: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/1200px-Antu_dialog-warning.svg.png`,
                            proxy_icon_url: `https://phish.report/${urltoscan}`,
                        },
                    },
                ],
            });
        } else {
            console.log(`URL was not deemed suspicious`);
        }
    };
}
