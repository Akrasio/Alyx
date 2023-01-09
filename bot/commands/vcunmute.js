const { ownerID } = require("../config/owner.json")
const CASES = require('../models/cases');
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandUserOption().setName("user").setDescription("The member to vcmute").setRequired(true);
OPT2 = new SlashCommandStringOption().setName("reason").setDescription("The reason to vcmute").setRequired(true);

module.exports = {
        config:
                new SlashCommandBuilder()
                        .setName('vcunmute')
                        .addUserOption(OPT1)
                        .addStringOption(OPT2)
                        .setDescription('Toggles if one user can speak or not while in voice channels.'),
        async execute(interaction) {
                let hasRole;
                let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
                if (modroles) {
                        hasRole = interaction.member.roles.cache.has(modroles);
                };
                if (!hasRole && !interaction.member.permissions.has("MUTE_MEMBERS") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have The Permissions To mute Users! - [MUTE_MEMBERS]**");
                let member = interaction.options.getMember('user');
                if (!member) return interaction.reply("Unable to find the mentioned user in this guild.")

                let reason = interaction.options.getString('reason')
                if (!reason) reason = "No Reason Provided"
                if (!member.voice.channel) return interaction.reply("Provided user is not in a voice channel!");

                try {
                        member.voice.setMute(false, reason);
                        CASES.find({ serverID: interaction.guild.id }).sort([['descending']]).exec(async (err, res) => {
                                let infractions = await new CASES({
                                        userID: mutee.id,
                                        reason: "UNMUTE: " + reason || "UNMUTE: No Reason Given!",
                                        action: 'VoiceMute',
                                        Moderator: interaction.user.id,
                                        serverID: interaction.guild.id,
                                        time: Date.now().toString().slice(0, 10),
                                        case: res.length + 1
                                })
                                infractions.save();
                        })
                        interaction.reply("Success ✅ : Member VC Unmuted")
                }
                catch (error) {
                        console.log(error)
                        interaction.reply("Oops! An unknown error occured. Please try again later.")
                }

        }
}
