const { ownerID } = require("../config/owner.json")
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandBooleanOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT2 = new SlashCommandBooleanOption().setName("status").setDescription("Deafen or undeafened?").setRequired(true);
OPT1 = new SlashCommandUserOption().setName("user").setDescription("User").setRequired(true);
OPT3 = new SlashCommandStringOption().setName("reason").setDescription("reason to Deafen or undeafen.").setRequired(true);

module.exports = {
        config: new SlashCommandBuilder()
                .setName('deafen')
                .addUserOption(OPT1)
                .addBooleanOption(OPT2)
                .setDescription('Deafen/undeafen a member in a vc channel!'),

        async execute(interaction) {
                let hasRole;
                let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
                if (modroles) {
                        hasRole = interaction.member.roles.cache.has(modroles);
                };
                if (!hasRole && !interaction.member.permissions.has("DEAFEN_MEMBERS") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have The Permissions To Deafen Users! - [DEAFEN_MEMBERS]**");
                let member = interaction.options.getUser()
                let reason = interaction.options.getString("reason")
                if (!reason) reason = "No Reason Provided"
                if (modroles && member.roles.cache.has(modroles)) return interaction.reply("**You can not punish another staff member!**");
                if (!member.voice.channel) return interaction.reply("Provided user is not in a voice channel!");

                try {
                        if (interaction.options.getBoolean("status") == true) {
                                if (member.voice.deafened) return interaction.reply("They aren't even deafened!")
                                member.voice.setDeaf(true, reason);
                                interaction.reply("Success ✅ : Member Deafened")
                        } else {
                                if (!member.voice.deafened) return interaction.reply("They aren't even deafened!")
                                member.voice.setDeaf(false, reason);
                                interaction.reply("Success ✅ : Member undeafened")
                        }
                } catch (error) {
                        console.log(error)
                        interaction.reply("Oops! An unknown error occured. Please try again later.")
                }

        }
}
