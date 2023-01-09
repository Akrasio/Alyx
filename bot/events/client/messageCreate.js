const { MessageEmbed } = require("discord.js")
module.exports = async (client, msg) => {
    if (msg.author.bot || !msg.guild) return;
	if (msg.mentions.members.size == 1 && msg.mentions.members.first().id == client.user.id){
		if (msg.content.toLowerCase().match(/(?:http)|(?:www)|(?:g)+(oo|00|0o|o0)+(k)|(?:r)+(a|4)+(?:p)+(e|3|i|1)|(?:c)+(oo|00|0o|o0)+(?:n)|(?:p)+(e|3|33|ee|3e|e3)+(?:d)+(?:o|0)|(?:gay)|(?:n)+(1g|ig|lg|og|0g)+(?:g)|(?:f)(a|4)+(g)|(?:discord)|(?:ch)+(1|i|l)+(?:nk)|(?:racist)|(?:negr)/gm)) return msg.reply("<@398018466856304640> has programmed me to ignore this from people, you fucking bozo!")
		if ((await client.db.get(msg.guild.id+".chatBot")) != null && (await client.db.get(msg.guild.id+".chatBot")) == true){
		const cont = msg.content.replace(`<@${client.user.id}>`, "").replace(`<@!${client.user.id}>`, "");
		if (cont.length <= 3) return console.log("Hmmm");
		client.lewds.chat(cont.toString(), msg.author.id).then(res =>{
		msg.channel.sendTyping();
		setTimeout(()=>{
			return msg.reply(res)
		}, 10000)
		}).catch(err =>{
			console.log("ERROR: ==== "+err.message)
			return msg.reply("An unexpected error occured!")
		})
		}
	};
    let check = await client.db.get(`${msg.author.id}.afk`);
    if (msg.mentions.members.size == 1) {
        let ponged = msg.mentions.members.first()
        if ((await client.db.get(`${ponged.id}.afk`)) != null) {
            let reason = await client.db.get(`${ponged.id}.afk`);
            msg.reply({
                embeds: [new MessageEmbed().setDescription(`${ponged} has been afk since <t:${reason.split("_")[0]}:R> \nReason: ${reason.split("_").slice(1).join(" ")}`).setColor("YELLOW").setThumbnail(ponged.user.displayAvatarURL({ dynamic: true }))], allowedMentions: {
                    parse: []
                }
            }).then(m =>
                setTimeout(() => {
                    m.delete()
                }, 5000)
            )
        } else {
            const pinges = await client.db.get(msg.guild.id + ".pingReacts_" + ponged.id)
		if (pinges != null) {
	        let mote = await msg.guild.emojis.cache.get(pinges) || pinges[0]
		if (mote){
		msg.react(mote?.id)
            	}
            return;
        };
    }
}
    if (check != null) {
        const { PREFIX } = require('../../config/config')
        const prefixes = await client.db.get(`${msg.guild.id}.prefix`) || PREFIX;
        if (msg.content.toLowerCase().match(prefixes + "noafk")) return;
        await client.db.delete(`${msg.author.id}.afk`)
        msg.reply({
            content: "Welcome back! I have removed your AFK Status now that you have returned!", allowedMentions: {
                parse: []
            }
        }).then(m => {
            setTimeout(() => {
                m.delete()
            }, 6000)
        })
    };
    let l = [];        // redHeart 2764
    const emojiRegex = /(\ufe0f|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gm
    let eng = await client.db.get(msg.guild.id + ".englishOnly");
    if (eng !== null && eng == true) {
        if (msg.content.replaceAll(/\n/gs, " ").toString().match(/(?:[^!-°])/g) != null) {
            await msg.content.replaceAll(emojiRegex, " ").match(/(?:[^!-°])/g).forEach(async ret => {
                if (ret !== " " && ret !== "\n" && !emojiRegex.test(ret)) {
                    return l.push(ret)
                }
            })
            if (msg.content && l.length >= 1) return msg.delete();
        }
    }
}
