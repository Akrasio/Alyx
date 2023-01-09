const ms = require('ms');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('giveaway')
            .setDescription('Manage serverwide giveaways!')
            .addStringOption(opt =>
                opt.setName("action")
                    .setDescription("show settings or pick a setting to modify")
                    .addChoice("start", "start")
                    .addChoice("end", "end")
                    .addChoice("reroll", "reroll")
                    .addChoice("edit", "edit")
                    .addChoice("pause", "pause")
                    .addChoice("resume", "resume")
                    .setRequired(true))
            .addStringOption(opt =>
                opt.setName("message_id")
                    .setDescription("The ongoing or ended giveaways message id"))
            .addStringOption(opt =>
                opt.setName("duration")
                    .setDescription("The new giveaways time (1h, 30m, 1h20s, etc.) "))
            .addIntegerOption(opt =>
                opt.setName("winners")
                    .setDescription("The new giveaways amount of possible winners."))
            .addStringOption(opt =>
                opt.setName("prize")
                    .setDescription("The new giveaways prize for winning.")),
    async execute(interaction, prem) {
        if (prem.user != true && prem.guild !== true) return interaction.reply(`This is a premium only command!\n[ ${prem} ]`);
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("MANAGE_MESSAGES", "MENTION_EVERYONE")) return interaction.reply("You are not allowed to do this.")
        let args = interaction.options.getString("action");
        const duration = interaction.options.getString('duration');
        const winnerCount = interaction.options.getInteger('winners');
        const messageId = interaction.options.getString('message_id');
        const prize = interaction.options.getString('prize');

        const giveaway =
            interaction.client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === interaction.options.getString('prize')) ||
            interaction.client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'));
        let bruh = new MessageEmbed()
            .setTitle('**Giveaway Options:**')
            .setDescription(`
**The Options are listed below:**
\`start\`, \`end\`, \`reroll\`, \`edit\`, \`pause\`, \`resume\`
`)
            .setColor("#FF0000")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter(interaction.guild.name, interaction.guild.iconURL());

        if (!args) return interaction.reply({ embeds: [bruh] });
        switch (args) {
            case "start":
                interaction.client.giveawaysManager.start(interaction.channel, {
                    duration: ms(duration),
                    winnerCount,
                    prize
                }).then((gData) => {
                    return interaction.reply('Success! Giveaway started!');
                }).catch((err) => {
                    return interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
                });
                break;
            case "end":
                if (!giveaway) return interaction.reply('Unable to find a giveaway for `' + messageId + '`.');

                interaction.client.giveawaysManager.end(messageId).then(() => {
                    return interaction.reply('Success! Giveaway ended!');
                }).catch((err) => {
                    return interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
                });
                break;
            case "reroll":
                if (!giveaway) return interaction.reply('Unable to find a giveaway for `' + messageId + '`.');
                interaction.client.giveawaysManager.reroll(messageId).then(() => {
                    return interaction.reply('Success! Giveaway rerolled!');
                }).catch((err) => {
                    return interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
                });
                break;
            case "edit":
                if (!giveaway) return interaction.reply('Unable to find a giveaway for `' + messageId + '`.');

                interaction.client.giveawaysManager.edit(messageId, {
                    addTime: 5000,
                    newWinnerCount: 3,
                    newPrize: 'New Prize!'
                }).then(() => {
                    return interaction.reply('Success! Giveaway updated!');
                }).catch((err) => {
                    return interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
                });
                break;
            case "pause":
                if (!giveaway) return interaction.reply('Unable to find a giveaway for `' + messageId + '`.');

                interaction.client.giveawaysManager.pause(messageId).then(() => {
                    return interaction.reply('Success! Giveaway paused!');
                }).catch((err) => {
                    return interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
                });
                break;
            case "resume":
                if (!giveaway) return interaction.reply('Unable to find a giveaway for `' + messageId + '`.');

                interaction.client.giveawaysManager.unpause(messageId).then(() => {
                    return interaction.reply('Success! Giveaway unpaused!');
                }).catch((err) => {
                    return interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
                });
                break;
        }
    }
}
