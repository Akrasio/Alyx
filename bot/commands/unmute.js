const { MessageEmbed } = require("discord.js")
const { ownerID } = require("../config/owner.json")
const CASES = require('../models/cases');
const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('@discordjs/builders');
OPT1 = new SlashCommandUserOption().setName("user").setDescription("The member to unmute").setRequired(true);
OPT2 = new SlashCommandStringOption().setName("reason").setDescription("The reason to unmute").setRequired(true);

module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('unmute').addUserOption(OPT1).addStringOption(OPT2)
            .setDescription('Unmutes a user in the server text chats.'),
    async execute(interaction) {
        const bot = interaction.client;
        let hasRole;
        let modroles = await interaction.client.db.get(`${interaction.guild.id}.modrole`)
        if (modroles) {
            hasRole = interaction.member.roles.cache.has(modroles);
        };
        if (!hasRole && !interaction.member.permissions.has("MANAGE_ROLES") && !ownerID.includes(interaction.user.id)) return interaction.reply("**You Dont Have The Permissions To Unmute Someone!**");
        let args = interaction.options.getMember('user');
        if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply("**I Don't Have Permissions To Unmute Someone!**")
        if (!args) return interaction.reply("**Please Enter A User!**")
        let mutee = interaction.options.getMember('user');
        if (!mutee) return interaction.reply("**Please Enter A Valid User!**");

        let reason = interaction.options.getString('reason')

        let muterole;
        let dbmute = await interaction.client.db.get(`${interaction.guild.id}.muterole`);
        let muteerole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === "muted")

        if (!interaction.guild.roles.cache.has(dbmute)) {
            muterole = muteerole
        } else {
            muterole = interaction.guild.roles.cache.get(dbmute)
        }

        if (!muterole) return interaction.reply("**There Is No Mute Role To Remove!**")
        if (!mutee.roles.cache.has(muterole.id)) return interaction.reply("**User is not Muted!**")
        try {
            await interaction.client.lewds.forced(bot, mutee);
            mutee.roles.remove(muterole.id)
            CASES.find({ serverID: interaction.guild.id }).sort([['descending']]).exec(async (err, res) => {
                let infractions = await new CASES({
                    userID: mutee.id,
                    reason: "UNMUTE: "+reason || "UNMUTE: " +"No Reason Given!",
                    action: 'Mute',
                    Moderator: interaction.user.id,
                    serverID: interaction.guild.id,
                    time: Date.now().toString().slice(0, 10),
                    case: res.length + 1
                })
                infractions.save();
            })
            await mutee.send(`**Hello, You Have Been Unmuted In ${interaction.guild.name} for ${reason || "No Reason"}**`).catch(() => null)
            interaction.reply(`I have umuted them!`)
            return;
        } catch (err) {
            await interaction.client.lewds.unmute.forced(bot, mutee);
            interaction.reply(`I have umuted them, but an error occurred!`)
            console.log(err);
        };
        const sembed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${mutee.user.username} was successfully unmuted.`)
        interaction.reply({ embeds: [sembed] });
    }
}
