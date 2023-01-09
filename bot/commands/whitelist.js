const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Add or delete members to this servers antiRaid whitelist!')
        .addStringOption(opt =>
            opt.setName("action")
                .setDescription("Choose to add or delete")
                .addChoice("add", "add")
                .addChoice("del", "del").setRequired(true))
        .addUserOption(opt => opt.setName("member").setDescription("Member to add or remove from whitelist!").setRequired(true)),
    async execute(interaction) {
        let client = interaction.client;
        try {
            if (interaction.options.getString("action") == "add") {
                if (interaction.user.id === interaction.guild.ownerID) {
                    let user = interaction.options.getMember("member");
                    if (!user) return interaction.reply(":x: | **Mention The User**")
                    let whitelist = await client.db.get(`${interaction.guild.id}.antiraid_whitelist`)
                    if (whitelist && whitelist.find(x => x.user == user.id)) {
                        return interaction.reply(":x: | **The User is already whitelisted**")
                    }
                  await client.db.push(`${interaction.guild.id}.antiraid_whitelist`, { user: user.id })
                    return interaction.reply(`**The user has been whitelisted!**`)
                } else {
                    return interaction.reply(":x: | **Only The owner of the Server can whitelist people**")
                }
            }
            if (interaction.options.getString("action") == remove) {
                if (interaction.user.id == interaction.guild.ownerId) {
                    let user = interaction.options.getMember("member")
                    if (!user) return interaction.channel.reply(":x: | **Mention The User**")
                    let whitelist = await client.db.get(`${interaction.guild.id}.antiraid_whitelist`)
                    if (whitelist) {
                        let omg = whitelist.find(x => x.user === user.id)
                        if (!omg) return interaction.channel.reply(":x: | **The user is not whitelisted!**")
                        let index = whitelist.indexOf(omg)
                        delete whitelist[index]
                        let fix = whitelist.filter(x => {
                            return x != null && x != ''
                        })
                      await client.db.set(`${interaction.guild.id}.antiraid_whitelist`, fix)
                        return interaction.channel.reply("**The user has been unwhitelisted!**")
                    } else {
                        return interaction.channel.reply(":x: | **The user is not whitelisted!**")
                    }
                } else {
                    return interaction.channel.reply(":x: | **Only The owner of the Server can unwhitelist people**")
                }
            }
        } catch (err) {
            console.log("||||| ERROR: " + err)
            return interaction.reply("An Error Occurred!");
        }
    },
};