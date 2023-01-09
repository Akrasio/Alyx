const Discord = require("discord.js")
const moment = require('moment');

const status = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline/Invisible"
};
const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('whois')
            .addUserOption(OPT1)
            .setDescription('Checks the public discord account information for a user.'),
    async execute(interaction) {
        var permissions = [];
        var acknowledgements = 'None';
        var bbadges = [];
        let whoisPermErr = new Discord.MessageEmbed()
            .setTitle("**User Permission Error!**")
            .setDescription("**Sorry, you don't have permissions to use this! ❌**")

        if (!interaction.channel.permissionsFor(interaction.user).has("MANAGE_MESSAGES")) return interaction.reply({embeds: [whoisPermErr]})

        const member = interaction.options.getMember('user');
        // -------------------------------------------------------
        const isPrem = await interaction.client.db.get("premium_status." + member.id);
        const { OWNER_ID } = require('../config/config');
        if (isPrem) {
            bbadges.push(":moneybag:");
        }
        if (member.id == OWNER_ID) {
            bbadges.push(":tools:");
        }
        let z = Number(isPrem / 1000)

        const embed = new Discord.MessageEmbed()
            .setDescription(`<@${member.id}>`)
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setColor('#2F3136')
            .setFooter(`ID: ${member.id}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .addField('__Joined at:__ ', `${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField('__Created On__', member.user.createdAt.toLocaleString(), true)
            .addField(`\n__Roles [${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `\`${roles.name}\``).length}]__`, `${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(roles => `<@&${roles.id}>`).join(" **|** ") || "No Roles"}`, true)
            .addField("\n__Bot Badges:__ ", `${bbadges.join(` | `) || "None"}`, true);
        if (isPrem) {
            embed.addField("\n__Premium until:__ ", `${"<t:" + Math.round(z) + ">" || "Expired?"}`, true);
        }
        interaction.reply({ embeds: [embed] });
    }
}
