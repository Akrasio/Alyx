    const Discord = require("discord.js");
    const { SlashCommandBuilder } = require('@discordjs/builders');
    module.exports = {
        config: new SlashCommandBuilder()
        .setName('whitelisted')
        .setDescription('List all of this servers antiRaid whitelisted members!'),
        async execute(interaction) {
            let client = interaction.client;
        try {
            let bruh = []
            let embed = new Discord.MessageEmbed()
                .setTitle("**The list of whitelisted users**")
                .setFooter(interaction.guild.name, interaction.guild.iconURL())
                .setThumbnail(interaction.guild.iconURL())
            let whitelisted = await client.db.get(`${interaction.guild.id}.antiraid_whitelist`)
            if (whitelisted && whitelisted.length) {
                whitelisted.forEach(x => {
                    bruh.push(`<@${x.user}>`)
                })
                embed.addField('**Users**', `${bruh.join("\n")}`)
                embed.setColor("GREEN")
            } else {
                embed.setDescription(":x: | **No whitelisted Users Found**")
                embed.setColor("#FF0000")
            }
            interaction.reply({ embeds: [embed] })
        } catch (err){
            console.log("||||| ERROR: "+err)
            return interaction.reply("An Error Occurred!");
        }
    },
    };