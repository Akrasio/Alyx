const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'resetuser',
    description: 'Reset a users level in this server.',
    usage: '',
    category: "Leveling",
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You Do not have permission to reset XP.')
        };
        let pong = [];
        const ping = message.mentions?.users.forEach(mention => {
            if (mention.id == client.user.id) return;
            return pong.push(mention)
        });
        let member = pong[0];
        if (!member) member = Number(args[0]);
        if (!member) return message.reply("Proper arguments: `@mentionUser` or `userId`");
        if (member.bot) return message.reply("Proper arguments: `@mentionUser` or `userId`");
        await client.db.delete(`${message.guild.id}_xp.${member.id || args[0]}_xp`);
        await client.db.delete(`${message.guild.id}_xptotal.${member.id || args[0]}`);
        return message.reply("Wiped the users level!\nNote: This does not remove given level roles if any were set up!");
    }
}
