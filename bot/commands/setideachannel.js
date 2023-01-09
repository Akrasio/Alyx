
const { OWNER_ID } = require("../config/config")
const { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandRoleOption } = require('@discordjs/builders');
OPT1 = new SlashCommandChannelOption().setName("channel").setDescription("Channel").setRequired(true);
OPT2 = new SlashCommandRoleOption().setName("role").setDescription("Role").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('setideachannel').addChannelOption(OPT1)
            .addRoleOption(OPT2)
            .setDescription('sets the idea channel for the server'),
    async execute(interaction) {
        if (!interaction.member.permissions.has([
            "MANAGE_CHANNELS",
            "MANAGE_MESSAGES",
            "MANAGE_ROLES"
        ])) return interaction.reply("You need the following permissions to use this:\n`MANAGE_CHANNELS`, `MANAGE_MESSAGES`, and `MANAGE_ROLES`");
        const a = interaction.options.getChannel("channel")
        const b = interaction.options.getRole("role")
        try {
            if (!a || !b) return interaction.reply("That was not a valid channel!");
            if (!interaction.guild.channels.cache.get(a.id).permissionsFor(interaction.client.user.id).has(['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'VIEW_CHANNEL'])) {
                return interaction.reply("**Error - `Missing Permissions Or Channel Is Not A Text Channel!`**");
            } else if (!interaction.client.guilds.cache.get(interaction.guild.id).channels.cache.get(a.id)) {
                return interaction.reply("The provided channel can not be found!");
            }
            if (b.id) {
                await interaction.client.db.set(interaction.guild.id + ".suggestchnl", a.id);
                await interaction.client.db.set(interaction.guild.id + ".suggestrle", b.id);
                interaction.reply("✅ Done!")
                return;
            } else {
                await interaction.client.db.set(interaction.guild.id + ".suggestchnl", a.id);
                await interaction.client.db.set(interaction.guild.id + ".suggestrle", "none");
                interaction.reply("✅ Done!")
                return;
            }
        } catch (e) {
            console.log(e)
            return interaction.reply("**Something Went Wrong!**")
        }
    }
}
