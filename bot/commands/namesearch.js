const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandStringOption().setName("params").setDescription("Params").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('namesearch')
            .addStringOption(OPT1)
            .setDescription('Searches the server for a nickname/username.'),
    async execute(interaction) {
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("MANAGE_NICKNAMES")) return interaction.reply("You must have `MANAGE_NICKNAMES` permission to use this!");
        let role = interaction.options.getString("params")
        if (role.length < 1 || role.length > 10) return interaction.reply("**Either the name was too long to search or too few arguemnts were passed!**");
        let membersWithName = await interaction.guild.members.fetch().then(lol => {
            return interaction.guild.members.cache.filter(member => {
               if (member.displayName.match(role)){
                   return member;
               }
            }).map(member => {
                return member.user.tag + "|" + member.user.id;
            })
        })
        console.log(membersWithName.length || 0);
        if (membersWithName.length > 200) return interaction.reply('**List Is Too Long!**')
        let roleEmbed = new MessageEmbed()
            .setColor("#2F3136")
            .setThumbnail(interaction.guild.iconURL())
            .setTitle(`Users With That name`)
            .setDescription("```"+(membersWithName.join("\n")|| "No one found!")+"```");
        interaction.reply({ embeds: [roleEmbed] }).catch(err=>{
            interaction.reply(err.message)
        })
    }
}
