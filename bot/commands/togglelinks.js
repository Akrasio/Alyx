const { OWNER_ID } = require("../config/config");

const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
new SlashCommandBuilder()
		.setName('antilink')
		.setDescription('Toggles deletion of all links in the server (Besides Giphy/tenor and Mods)'),    
async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")  && interaction.user.id !== OWNER_ID) return interaction.reply("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")
        if (!interaction.guild.me.permissions.has("MANAGE_MESSAGES")) return interaction.reply(
            '**I Do Not Have The Required Permissions! - [MANAGE_MESSAGES]**'
        )
        try {
            let a = await interaction.client.db.get(interaction.guild.id + ".linkMod");
            if (!a) {
                await interaction.client.db.set(interaction.guild.id + ".linkMod", "1");
                interaction.reply("Turned on AntiLink for all channels! [`MANAGE_MESSAGES` bypasses this!]")
            } else {
                let channel = interaction.guild.channels.cache.get(a)
                await interaction.client.db.delete(`${interaction.guild.id}.linkMod`)

                interaction.reply(`**AntiLink Has Been Successfully Disabled**`)
            }
            return;
        } catch {
            return interaction.reply("oops an error occurred!")
        }
    }
}