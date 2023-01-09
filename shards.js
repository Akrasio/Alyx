/*
    The following code goes into it's own file, and you run this file
    instead of your main bot file.
*/
require("dotenv").config();
// Include discord.js ShardingManager
const { ShardingManager, Client, WebhookClient, MessageEmbed } = require("discord.js");
// Create your ShardingManager instance
const manager = new ShardingManager("./bot/index.js", {
    // for ShardingManager options see:
    // https://discord.js.org/#/docs/main/stable/class/ShardingManager
    totalShards: Number(process.env.SHARDS) || 'auto',
    token: process.env.TOKEN
});
// Emitted when a shard is created
manager.on("shardCreate", (shard) => {
    console.log(`ShardBot ${shard.id} launched`)
    const ShardEmbed = new MessageEmbed()
    .setDescription(`Shard has been created and connected!`)
    .setColor("GREEN");
});
// Spawn your shards
manager.spawn()
    .then(shards => {
        shards.forEach(shard => {
            shard.on('message', message => {
                console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result} -|- ${message.message}`);
            });
            shard.on("disconnect", ()=>{
                const ShardEmbed = new MessageEmbed()
                    .setDescription(`Shard has been Disconnected!`)
                    .setColor("RED");
            })
            shard.on("ready", ()=>{
                const ShardEmbed = new MessageEmbed()
                    .setDescription(`Shard is now Ready!`)
                    .setColor("GREEN");
            })
            shard.on("reconnecting", ()=>{
                const ShardEmbed = new MessageEmbed()
                    .setDescription(`Shard is Reconnecting!`)
                    .setColor("YELLOW");
            })
            shard.on("death", ()=>{
                const ShardEmbed = new MessageEmbed()
                    .setDescription(`Shard has died... rip.`)
                    .setColor("RED");
            })
        });
    })
    .catch(console.error);
