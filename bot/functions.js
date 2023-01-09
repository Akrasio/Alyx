const { Client, Message, MessageEmbed, Collection } = require('discord.js');

/** 
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */


module.exports.escapeRegex = escapeRegex;
module.exports.onCoolDown = onCoolDown;
module.exports.setStatus = setStatus;
module.exports.setTimeStatus = setTimeStatus;

async function setStatus(client, { text: text, status: status }) {
    client.user.setPresence({status: status, activities:[{name: `${text}`}]})
};
async function setTimeStatus(client) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let state = "";
    if (0 <= hours && hours <= 5) state = "dnd";
    if (6 <= hours && hours <= 12) state = "idle";
    if (13 <= hours && hours <= 21) state = "online";
    if (22 <= hours && hours <= 23) state = "dnd";
    return setStatus(client, { text: `${hours <= 9 ? "0" + hours : hours}:${minutes <= 9 ? "0" + minutes : minutes}` + `EST || /${client.commands.random().config.name}`, status: state })
};

function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed);
    }
}

let abc = async function fetchUser(id) {
    await client.users.fetch(id).then(u => {
        return u.id
    })
}
/**
 * 
 * @param {*} message A DiscordMessage, with the client, information
 * @param {*} command The Command with the command.name
 * @returns BOOLEAN
 */
function onCoolDown(message, command) {
    if (!message || !message.client) throw "No Message with a valid DiscordClient granted as First Parameter";
    if (!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
    const client = message.client;
    if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
        client.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now(); //get the current time
    const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
    const cooldownAmount = (command.cooldown) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
    if (timestamps.has(message.author.id)) { //if the user is on cooldown
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
        if (now < expirationTime) { //if he is still on cooldonw
            const timeLeft = (expirationTime - now) / 1000; //get the lefttime
            //return true
            return timeLeft
        }
        else {
            //if he is not on cooldown, set it to the cooldown
            timestamps.set(message.author.id, now);
            //set a timeout function with the cooldown, so it gets deleted later on again
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            //return false aka not on cooldown
            return false;
        }
    }
    else {
        //if he is not on cooldown, set it to the cooldown
        timestamps.set(message.author.id, now);
        //set a timeout function with the cooldown, so it gets deleted later on again
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        //return false aka not on cooldown
        return false;
    }
}
