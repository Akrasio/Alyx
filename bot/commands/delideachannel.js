
const { OWNER_ID } = require("../config/config")
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
new SlashCommandBuilder()
		.setName('delideachannel')
		.setDescription('deletes the idea channel for the servers'),        
        
    async execute(interaction) {
        if (!interaction.guild.member.permissions.has([
            "MANAGE_CHANNELS",
            "MANAGE_MESSAGES",
            "MANAGE_ROLES"
        ]) && interaction.user.id !== OWNER_ID) return interaction.reply("You need the following permissions to use this:\n`MANAGE_CHANNELS`, `MANAGE_MESSAGES`, and `MANAGE_ROLES`")
        const dab = await interaction.client.db.get(interaction.guild.id + ".suggestchnl");
        const dabs = await interaction.client.db.get(interaction.guild.id + ".suggestrle");
        if (!dab) {
            interaction.reply("The idea channel doesnt exist anyways... lol.")
        }
        try {
            await interaction.client.db.delete(interaction.guild.id + ".suggestchnl");
            if (dabs) {
                await interaction.client.db.delete(interaction.guild.id + ".suggestrle")
            }
            interaction.reply("Disabled and deleted the ideas system for this server!")
        } catch (e) {
            console.log(e)
            return interaction.reply("**Something Went Wrong!**")
        }
    }
}
