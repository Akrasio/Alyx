
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('disablemodlog')
            .setDescription('disables modlogging'),
async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

        try {
            let a = await interaction.client.db.get(`${interaction.guild.id}.modlogs`)

            if (!a) {
                return interaction.reply('**There Is No Modlog Channel Set To Disable!**')
            } else {
                let channel = interaction.guild.channels.cache.get(a)
                interaction.client.guilds.cache.get(interaction.guild.id).channels.cache.get(channel.id).send("**ModLog Channel Disabled!**")
                await interaction.client.db.delete(`${interaction.guild.id}.modlogs`)

                interaction.reply(`**Modlog Channel Has Been Successfully Disabled in \`${channel.name}\`**`)
            }
            return;
        } catch {
            return interaction.reply("**Error - `Missing Permissions or Channel Doesn't Exist`**")
        }
    }
}
