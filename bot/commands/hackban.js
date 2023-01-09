const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } = require('@discordjs/builders');
OPT1 = new SlashCommandStringOption().setName("reason").setDescription("Reason to hackban").setRequired(true);
OPT2 = new SlashCommandStringOption().setName("user").setDescription("UserID to hackban").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('hban')
            .addStringOption(OPT1)
            .addStringOption(OPT2)
            .setDescription('forcefully bans a user not in the server.'),
    async execute(interaction) {
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply("You are not allowed to do this.")
        const target = interaction.options.getString("user");
        if (isNaN(target)) return interaction.reply(`Please specify an ID`);
        if (modroles && target.roles?.cache.has(modroles)) return interaction.reply("**You can not punish another staff member!**");
        const reason = interaction.options.getString("reason")
        try {
            interaction.guild.members.ban(target, { days: 7, reason: reason.length < 1 ? 'No reason supplied.' : reason });
            const embed2 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription("**They were successfully banned. User was not notified!**");
            await interaction.reply({embeds:[embed2]});
            const channel = await interaction.client.db.get(`${interaction.guild.id}.modlogs`);
            if (!channel) return;
            const embed = new MessageEmbed()
                .setAuthor(`${interaction.guild.name} Modlogs`, interaction.guild.iconURL())
                .setColor("#ff0000")
                .setFooter(interaction.guild.name, interaction.guild.iconURL())
                .addField("**Moderation**", "ban")
                .addField("**ID**", `${target}`)
                .addField("**Banned By**", interaction.user.username)
                .addField("**Reason**", `${reason || "**No Reason**"}`)
                .addField("**Date**", interaction.createdAt.toLocaleString())
                .setTimestamp();
            var sChannel = interaction.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send({ embeds: [embed] })
        } catch (error) { console.log(error) }
    }
}
