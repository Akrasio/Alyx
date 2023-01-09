
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
new SlashCommandBuilder()
		.setName('disablemuterole')
		.setDescription('Disables mute role.'),    
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

        try {
            let a = await interaction.client.db.get(`${interaction.guild.id}.muterole`)

            if (!a) {
                return interaction.reply("**There Is No Muterole Set To Disable!**")
            } else {
                let role = interaction.guild.roles.cache.get(a)
                await interaction.client.db.delete(`${interaction.guild.id}.muterole`)

                interaction.reply(`**\`${role.name}\` Has Been Successfully Disabled**`)
            }
            return;
        } catch {
            return interaction.reply("**Error - `Missing Permissions or Role Doesn't Exist`**")
        }
    }
}