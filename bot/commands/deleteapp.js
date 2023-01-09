const { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } = require('@discordjs/builders');
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('deleteapp')
            .setDescription('Allows you delete all forms in the current server!'),
    async execute(interaction, prem) {
        if (prem.user != true && prem.guild !== true) return interaction.reply(`This is a premium only command!\nJoin my support server for more info!`);
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("You must have `ADMINISTRATOR` permissions to do this!");
        if (!interaction.client.db.get(interaction.guild.id+".apps_log")) return interaction.reply("There is no form log set up! Please make sure one has been set up before making forms.");
        await interaction.client.db.delete(interaction.guild.id + ".apps")
        interaction.reply("Deleted all applications.")
    }
}
