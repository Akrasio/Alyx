const { ownerID } = require('../config/owner.json')
const { SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } = require('@discordjs/builders');
OPT2 = new SlashCommandStringOption().setName("type").setDescription("Type | number").setRequired(true);
OPT1 = new SlashCommandUserOption().setName("user").setDescription("User").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('purge')
            .addStringOption(OPT2)
            .addUserOption(OPT1)
            .setDescription('Cleans up messages!'),
    async execute(interaction) {
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("MANAGE_MESSAGES") && !ownerID.includes(interaction.user.id)) return interaction.reply("You Don't Have Sufficient Permissions!- [MANAGE_MESSAGES]");
        if (interaction.options.getString("type") == "b") {
            return interaction.channel.messages.fetch({
                limit: 100,
            }).then(async (messages) => {
                let messagez = messages.filter(ms => ms.author.bot)
                let messagezz = messages.filter(m => new RegExp(`(^[\!\#\$\%\^\&\*\_\+\/\?\.\>\\\;\~])`, "g").test(m.content));
                await interaction.channel.bulkDelete(messagez, true).catch(error => console.log(error.stack));
                await interaction.channel.bulkDelete(messagezz, true).catch(error => console.log(error.stack));
                return interaction.reply("Deletion of messages successful.")
            })
        }
        if (interaction.options.getString("type") == "u") {
            return interaction.channel.messages.fetch({
                limit: 100,
            }).then(async (messages) => {
                const user = interaction.options.getUser("user");
                if (!user) return interaction.reply("You did not provide a valid user!");
                let messagez = messages.filter(m => m.author.id === user.id);
                await interaction.channel.bulkDelete(messagez, true).catch(error => console.log(error.stack));
                return interaction.reply("Deletion of messages successful.")
            })
        }
        if (interaction.options.getString("type") != "u" && interaction.options.getString("type") != "b" && !Number(interaction.options.getString("type"))) {
            return interaction.reply('**Please Supply A Valid Amount To Delete Messages, `u <user>` to clear up to 100 of a users messages or `b` to clear bots!**');
        }
        if (interaction.options.getString("type") > 100)
            return interaction.reply("**Please Supply A Number Less Than 100!**");

        if (interaction.options.getString("type") < 2)
            return interaction.reply("**Please Supply A Number More Than 2!**");
        interaction.channel.bulkDelete(Number(interaction.options.getString("type")), true)
            .then(messages => { return interaction.reply(`**Succesfully deleted \`${messages.size}/${interaction.options.getString("type")}\` messages**`) })
    }

}
