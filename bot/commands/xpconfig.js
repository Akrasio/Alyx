
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
    config: new SlashCommandBuilder()
        .setName('xpconfig')
        .setDescription('Show or modify server level settings!')
        .addStringOption(opt =>
            opt.setName("options")
                .setDescription("show settings or pick a setting to modify")
                .addChoice("show", "show")
                .addChoice("alerts", "alerts")
                .addChoice("rankbg", "rankbg")
                .addChoice("bonusrole", "bonusrole")
                .addChoice("lvl", "lvl")
                .setRequired(true))
        .addChannelOption(opt =>
            opt.setName("alerts")
                .setDescription("Channel to set for alerts"))
        .addBooleanOption(opt =>
            opt.setName("lvl")
                .setDescription("True is on, false is off."))
        .addStringOption(opt =>
            opt.setName("rankbg")
                .setDescription("The server-wide rank background image."))
        .addRoleOption(opt =>
            opt.setName("bonusrole")
                .setDescription("Role to set for bonus XP.")),
    async execute(interaction, prem) {
        let client = interaction.client;
        let args = interaction.options.getString("options");
        try {
            if (!interaction.memberPermissions.has(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES"]) && interaction.member.id !== "398018466856304640") return interaction.reply("You lack the proper permissons to do this!")
            let disabled = ":x: Disabled";
            let enabled = ":white_check_mark: Enabled";            
            switch (args) {
                case "show":
                    let logs = await client.db.get(`${interaction.guild.id}.levelChannel`)
                    let lvlC = await client.db.get(`${interaction.guild.id}.levels`)
                    let banner = await client.db.get(`${interaction.guild.id}.bannerURL`)
                    let botroles = await client.db.get(`${interaction.guild.id}.xpBonus`)
                    if (lvlC !== true) lvlC = disabled
                    if (botroles === null) botroles = disabled
                    if (botroles !== null && botroles !== disabled) {
                        botroles = interaction.guild.roles.cache.get(botroles)
                        if (!botroles) botroles = disabled
                    }
                    let show = new Discord.MessageEmbed()
                        .setTitle("**Level System | Config**")
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter(interaction.guild.name, interaction.guild.iconURL())
                        .addField("Level System*", `${lvlC || disabled}`, true)
                        .addField("Bonus XP*", `${botroles || disabled}`, true)
                        .addField("Alert Channel*", `${"<#"+logs+">" || disabled}`, true)
                        .addField("Rank Background", `${"[Enabled]("+banner+")" || disabled}`, true)
                        .setColor("GREEN");
                        if (banner !== null && banner !== undefined) show.setImage(String(banner));
                        if (prem.guild !== true) show.addField("* = Premium", "Get premium for the server and unlock more features!");
                        interaction.reply({ embeds: [show] })
                    break;
                case "rankbg":
                    if (!interaction.options.getString("rankbg")) return interaction.reply("Please Provide the rankbg option and value!")
                    if (!interaction.options.getString("rankbg").startsWith("https://") && !interaction.options.getString("rankbg").endsWith(".png")) return interaction.reply("The background must be a PNG Image Url!");
                    await client.db.set(`${interaction.guild.id}.bannerURL`, interaction.options.getString("rankbg"))
                    interaction.reply("Successfully set!")
                break;
                case "alerts":
                if (!interaction.options.getChannel("alerts")) return interaction.reply("Please Provide the alerts option and a channel!")
                    await client.db.set(`${interaction.guild.id}.levelChannel`, interaction.options.getChannel("alerts"))
                    interaction.reply("Successfully set!")
                break;
                case "bonusrole":
                    if (!interaction.options.getChannel("bonusrole")) return interaction.reply("Please Provide the bonusrole option and a role!")
                    await client.db.set(`${interaction.guild.id}.xpBonus`, interaction.options.getRole("bonusrole"))
                    interaction.reply("Successfully set!")
                break;
                case "lvl":
                   if (prem.guild !== true) return interaction.reply("This is a premium only feature! Join My support server for more info!");
                   if (!interaction.options.getBoolean("lvl")) return interaction.reply("Please Provide the lvl option!")
                   let lvlB = interaction.options.getBoolean("lvl");
                   if (!lvlB) return interaction.reply("Please provide the boolean option as true or false")
                   await client.db.set(`${interaction.guild.id}.levels`, lvlB)
                    interaction.reply("**The level system has been set to " + lvlB + "**")
                    break;
            }
        } catch (err) {
            console.log("||||| ERROR: " + err)
            return interaction.reply("An Error Occurred!");
        }
    },
};
