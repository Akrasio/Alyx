const fs = require('fs');
const { Manager } = require('erela.js')
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const { setTimeStatus, onCoolDown, setStatus } = require("./functions.js");
const { spotify, clientsettings, lewdsAPI } = require('../bot/config/config.json');
const mongo = require("mongoose");
require("dotenv").config()
const talkedRecently = new Set();
const client = new Client({
	fetchAllMembers: true,
	intents: ["GUILD_MESSAGES", "GUILD_MEMBERS", "GUILDS", "GUILD_BANS","GUILD_MESSAGE_REACTIONS"],
 	partials: ["MESSAGE", "USER", "CHANNEL"],
	allowedMentions: {
		parse: []
	},
	ws: {
		properties: {
			$browser: "Discord iOS"
		}
	}
});
const { AhniCaptcha } = require("ahnidev");
const { Database } = require("quickmongo");
client.db = new Database(require("./config/config.json").mongodbURL);
client.commands = new Collection();
client.snipes = new Collection();
client.cooldowns = new Collection();
client.AhniCaptcha = new AhniCaptcha(client)
const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));
const discordModals = require('discord-modals');
discordModals(client);
const { AhniClient } = require("ahnidev");
const lewds = new AhniClient({ KEY: lewdsAPI, url: "http://127.0.0.1:2005"});
client.lewds = lewds;
lewds.connectToMongoDB(require("./config/config.json").mongodbURL);
lewds.timed(client);
const cron = require("node-cron")
client.on("timedUnmute", async (user, guild) => {
        if (client.user == null || !client.uptime) return;
	user.send("You've been unmuted in " + user.guild.name);
	console.log(user)
	let embed = new Discord.MessageEmbed()
		.setColor("GREEN")
		.addField("**Moderation**", "unmute")
		.setAuthor({ name: `${user.guild.name} Modlogs`, iconURL: `https://cdn.discordapp.com/icons/${user.guild.id}/${user.guild.icon}.png?size=4096` })
		.setThumbnail(`https://cdn.discordapp.com/icons/${user.id}/${user.avatar}.png?size=4096`)
		.addField("**Unmuted**", (user.user || user).username)
		.addField("**Moderator**", client.user.username)
		.setFooter("userID: " + (user.user || user).id)
		.setTimestamp();
	let channel = await client.db.get(`${user.guild.id}.modlogs`);
	if (!channel || channel == null) return;
	await user.guild.channels.cache.get(channel).send({ embeds: [embed] });
});
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.config.name, command);
}
client.snipes = new Collection()
client.commandz = new Discord.Collection();
client.setTimeStatus = setTimeStatus;
client.setStatus = setStatus;
const load = dirs => {
	const events = fs.readdirSync(`./bot/events/${dirs}/`).filter(d => d.endsWith('.js'));
	for (let file of events) {
		const evt = require(`./events/${dirs}/${file}`);
		let eName = file.split('.')[0];
		client.on(eName, evt.bind(null, client));
	};
};
["client", "guild"].forEach(x => load(x))
client.db.once('ready', () => client.giveawaysManager._init());
client.on("messageCreate", async(message)=>{
    if (!Number(await client.db?.ping())) return;
    const lbs = await client.db.get(message.guild.id+".levels");
    if (lbs !== true) return;
    if (talkedRecently.has(message.author.id)) {
        return;
    } else {
        await xp(message)
        talkedRecently.add(message.author.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 60000)
    };

})
client.on("voiceStateUpdate", async (oldUser, newUser) => {
    if (!oldUser.guild || !newUser.guild) return;
    if (!Number(await client.db?.ping())) return;
    const isBot = oldUser.guild.members.cache.get((oldUser || newUser).id)
    if (!oldUser.member.voice.channelId && !newUser.channelID) return;
    if (oldUser.member.voice.mute || newUser.member.voice.mute) return;
    if (oldUser.member.voice.deaf || newUser.member.voice.deaf) return;
    if (oldUser.member.voice && newUser.member.voice) {
        if (isBot.user.bot) return;
        setInterval(async () => {
            if (isBot.user.bot) return;
            if (!oldUser.member || !newUser.member) return;
            if (!oldUser.guild || !newUser.guild) return;
            if (!oldUser.member.voice.channelId && !newUser.member.voice.channelId) return;
            if (oldUser.member.voice.deaf || newUser.member.voice.deaf) return;
            if (oldUser.member.voice.mute || newUser.member.voice.mute) return;
            await xp(oldUser)
        }, 120000);
    }
})

// Requires Manager from discord-giveaways
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
        reaction: '🎉'
    }
});

client.giveawaysManager = manager;
client.on("ready", async()=>{
	await mongo.connect(process.env.MongoDB, { 
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

})
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.user.bot) return;
	if (!interaction.guild) return interaction.reply({ content: "My commands may only work in Servers!", ephemeral: true })
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
        const prem = {
               user: (await client.db.get(interaction.user.id+".premium")) || false,
               guild: (await client.db.get(interaction.guild.id+".premium")) || false
        };
	try {
		console.log(" ")
		console.log(`
			------------------------------------------------------------
			User: ${interaction.user.username}[${interaction.user.id}]
			ChannelId:      [  ${interaction.channel.id}  ]
                        isPremiumGuild:      [  ${prem.guild} ]
                        isPremiumUser:       [  ${prem.user}  ]
			Command: ${interaction.commandName}[${interaction.commandId}
			------------------------------------------------------------
		`)
		console.log(" ")
		await command.execute(interaction, prem);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).catch(err => {
			return console.log(err)
		})
	}
});
async function xp(message) {
    if ((message.author || message.member).bot) return;
    const lbs = await client.db.get(message.guild.id+".levels");
    if (lbs !== true) return;
    const randomNumber = Math.floor(Math.random() * 10) + 15
    await client.db.add(`${message.guild.id}_xp.${(message.author || message).id}_xp`, randomNumber)
    await client.db.add(`${message.guild.id}_xptotal.${(message.author || message).id}`, randomNumber)
    var level = await client.db.get(`${message.guild.id}_xp.${(message.author || message).id}_level`) || 0
    var xp = await client.db.get(`${message.guild.id}_xp.${(message.author || message).id}_xp`)
    var xpChannel = await client.db.get(`${message.guild.id}_xp.announceChannel`)
    var xpNeeded = level * 1000
    if (xpNeeded < xp) {
        var newLevel = await client.db.add(`${message.guild.id}_xp.${(message.author || message).id}_level`, 1)
        var xpRole = await client.db.get(`${message.guild.id}_roles.${Number(level + 1)}`);
        await client.db.subtract(`${message.guild.id}_xp.${(message.author || message).id}_xp`, xpNeeded)
        if (xpRole !== null) {
            if (message.guild.roles.cache.get(xpRole)) {
                await (message.member || message).roles.add(message.guild.roles.cache.get(xpRole));
            }
        }
        if (message.author) {
            if (message.guild.channels.cache.get(xpChannel) && message.guild.channels.cache.get(xpChannel).permissionsFor(client.user.id).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                return message.guild.channels.cache.get(xpChannel).send(`Congrats ${message.author.tag}, you have leveled up to Level ${level + 1}`)
            }
            if (message.channel && message.channel.permissionsFor(client.user.id).has(["SEND_MESSAGES", "EMBED_LINKS"])) {
                message.channel.send(`Congrats ${message.author.tag}, you have leveled up to Level ${level + 1}`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 10000)
                })
            }
        }
    }
}

process.on("uncaughtException", (err) => {
	return console.log(err)
})
process.on("unhandledRejection", (err) => {
	return console.log(err)
})
client.on("error", err => {
	console.log(err)
})
client.login(process.env.TOKEN);

module.exports = client;
