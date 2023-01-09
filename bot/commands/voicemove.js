const { ownerID } = require("../config/owner.json")
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandChannelOption } = require('@discordjs/builders');
OPT1 = new SlashCommandUserOption().setName("user").setDescription("The member to move").setRequired(true);
OPT2 = new SlashCommandChannelOption().setName("channel").setDescription("The VC to move the member to.").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('vcmove')
            .addUserOption(OPT1)
            .addChannelOption(OPT2)
            .setDescription('Moves a user to another vc.'),
    async execute(interaction) {
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("MOVE_MEMBERS") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have The Permissions To Ban Users! - [MOVE_MEMBERS]**");
        let member = interaction.options.getMember('user');

        if (!member) return interaction.reply("Unable to find the mentioned user in this guild.")
        if (modroles && member.roles.cache.has(modroles)) return interaction.reply("**You can not move another staff member!**");
        let channel = interaction.options.getChannel('channel')
        if (!channel.type === "GUILD_VOICE") return interaction.reply("Unable to locate the voice channel. Make sure to mention a voice channel not a text channel!")

        try {
            member.voice.setChannel(channel);
            interaction.reply("Success ✅ : Member Moved!")
        }
        catch (error) {
            console.log(error);
            interaction.reply("Oops! An unknown error occured. Please try again later.")
        }

    }
}
