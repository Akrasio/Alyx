
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
    config: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Show or modify server antiraid settings!')
        .addStringOption(opt =>
            opt.setName("options")
                .setDescription("show settings or pick a setting to modify")
                .addChoice("show", "show")
                .addChoice("logs", "logs")
                .addChoice("botrole", "botrole")
                .addChoice("modrole", "modrole")
                .addChoice("memberrole", "memberrole")
                .addChoice("punishment", "punishment")
                .addChoice("lvl", "lvl")
                .addChoice("channelcreatelimit", "channelcreatelimit")
                .addChoice("channeldeletelimit", "channeldeletelimit")
                .addChoice("rolecreatelimit", "rolecreatelimit")
                .addChoice("roledeletelimit", "roledeletelimit")
                .addChoice("banlimit", "banlimit")
                .addChoice("kicklimit", "kicklimit")
                .setRequired(true))
        .addChannelOption(opt =>
            opt.setName("channel")
                .setDescription("Channel to set for logs"))
        .addBooleanOption(opt =>
            opt.setName("boolean")
                .setDescription("True is on, false is off."))
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("Amount to limit to."))
        .addStringOption(opt =>
            opt.setName("punishment")
                .setDescription("Select a punishment to give when user passed limits")
                .addChoice("demote", "demote")
                .addChoice("kick", "kick")
                .addChoice("ban", "ban"))
        .addRoleOption(opt =>
            opt.setName("role")
                .setDescription("Role to set for modrole or memberrole.")),
    async execute(interaction, prem) {
        let client = interaction.client;

        try {
            if (!interaction.memberPermissions.has(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES"]) && interaction.user.id !== process.env.ADMIN_USERS) return interaction.reply("You lack the proper permissons to do this!")
            let ops = [
                'channelCreateLimit',
                'channelDeleteLimit',
                'roleCreateLimit',
                'roleDeleteLimit',
                'banLimit',
                'kickLimit',
                'logs',
                'show',
                'punishment'
            ];
            let disabled = ":x: Disabled"
            let enabled = ":white_check_mark: Enabled"
            let args = interaction.options.getString("options");
            let argZ = interaction.options.getInteger("amount");
            let lvlB = interaction.options.getBoolean("boolean")
            let argX = interaction.options.getString("punishment")
            let booP = interaction.options.getString("set")
            let bruh = new Discord.MessageEmbed()
                .setTitle('**Anti-Raid | Config**')
                .setDescription(`
    **The Options are listed below:**
    config ${ops.join("\n config ")}
    `)
                .setColor("#FF0000")
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setFooter(interaction.guild.name, interaction.guild.iconURL())
            if (!args) return interaction.reply({ embeds: [bruh] });
            switch (args) {
                case "show":
                    let rcl = await client.db.get(`${interaction.guild.id}.antiraid_rolecreate`)
                    let rdl = await client.db.get(`${interaction.guild.id}.antiraid_roledelete`)
                    let ccl = await client.db.get(`${interaction.guild.id}.antiraid_channelcreate`)
                    let cdl = await client.db.get(`${interaction.guild.id}.antiraid_channeldelete`)
                    let bl = await client.db.get(`${interaction.guild.id}.antiraid_banlimit`)
                    let kl = await client.db.get(`${interaction.guild.id}.antiraid_kicklimit`)
                    let quot = await client.db.get(`${interaction.guild.id}.antiraid_quote`)
                    let logs = await client.db.get(`${interaction.guild.id}.antiraid_logs`)
                    let lvlC = await client.db.get(`${interaction.guild.id}.levels`)
                    let punish = await client.db.get(`${interaction.guild.id}.antiraid_punish`)
                    let modroles = await client.db.get(`${interaction.guild.id}.modrole`)
                    let mbrroles = await client.db.get(`${interaction.guild.id}.joinRole`)
                    let botroles = await client.db.get(`${interaction.guild.id}.joinBotRole`)
                    let mlogs = await client.db.get(`${interaction.guild.id}.modlogs`)
                    let clogs = await client.db.get(`${interaction.guild.id}.clogs`)
                    if (rcl === null) rcl = disabled
                    if (rdl === null) rdl = disabled
                    if (ccl === null) ccl = disabled
                    if (lvlC !== true) lvlC = disabled
                    if (cdl === null) cdl = disabled
                    if (bl === null) bl = disabled
                    if (quot !== null && quot == "true") quot = enabled
                    if (quot === null || quot == "false") quot = disabled
                    if (kl === null) kl = disabled
                    if (logs === null) logs = disabled
                    if (logs !== null && logs !== disabled) {
                        logs = client.channels.cache.get(logs)
                        if (!logs) logs = disabled
                    }
                    if (mlogs === null) mlogs = disabled
                    if (mlogs !== null && mlogs !== disabled) {
                        mlogs = client.channels.cache.get(mlogs)
                        if (!mlogs) mlogs = disabled
                    }
                    if (clogs === null) clogs = disabled
                    if (clogs !== null && clogs !== disabled) {
                        clogs = client.channels.cache.get(clogs)
                        if (!clogs) clogs = disabled
                    }
                    if (modroles === null) modroles = disabled
                    if (modroles !== null && modroles !== disabled) {
                        modroles = interaction.guild.roles.cache.get(modroles)
                        if (!modroles) modroles = disabled
                    }
                    if (mbrroles === null) mbrroles = disabled
                    if (mbrroles !== null && mbrroles !== disabled) {
                        mbrroles = interaction.guild.roles.cache.get(mbrroles)
                        if (!mbrroles) mbrroles = disabled
                    }
                    if (botroles === null) botroles = disabled
                    if (botroles !== null && botroles !== disabled) {
                        botroles = interaction.guild.roles.cache.get(botroles)
                        if (!botroles) botroles = disabled
                    }
                    let show = new Discord.MessageEmbed()
                        .setTitle("**Anti-Raid | Config**")
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter(interaction.guild.name, interaction.guild.iconURL())
                        .addField("Channel Create Limit", `${ccl || disabled}`, true)
                        .addField("Channel Delete Limit", `${cdl || disabled}`, true)
                        .addField("Role Create Limit", `${rcl || disabled}`, true)
                        .addField("Role Delete Limit", `${rdl || disabled}`, true)
                        .addField("Ban Limits", `${bl || disabled}`, true)
                        .addField("Kick Limits", `${kl || disabled}`, true)
                        .addField("Level System*", `${lvlC || disabled}`, true)
                        .addField("AntiRaid Logs", logs.toString() || disabled, true)
                        .addField("Message Logs", clogs.toString() || disabled, true)
                        .addField("Moderation Logs", mlogs.toString() || disabled, true)
                        .addField("Punishment", punish || disabled, true)
                        .addField("Member (Join Role)", `${mbrroles || disabled}`, true)
                        .addField("Bots (Join Role)*", `${botroles || disabled}`, true)
                        .addField("Mod Role", `${modroles || disabled}`, true)
                        .setColor("GREEN");
                        if (prem.guild !== true) show.addField("* = Premium", "Get premium for the server and unlock more features!");
                        interaction.reply({ embeds: [show] })
                    break;
                case "channelcreatelimit":
                    if (!argZ) return interaction.reply(":x: | **Provide The limit**")
                    if (isNaN(argZ)) return interaction.reply(":x: | **The limit has to be a number**")
                    if (Number(argZ) < 1) return interaction.reply(":x: | **The limit cannot be zero or negative number**")
                  await client.db.set(`${interaction.guild.id}.antiraid_channelcreate`, Number(argZ))
                    interaction.reply("**The channel Create limit has been set to " + Number(argZ) + "**")
                    break;
                case "channeldeletelimit":
                    if (!argZ) return interaction.reply(":x: | **Provide The limit**")
                    if (isNaN(argZ)) return interaction.reply(":x: | **The limit has to be a number**")
                    if (Number(argZ) < 1) return interaction.reply(":x: | **The limit cannot be zero or negative number**")
                  await client.db.set(`${interaction.guild.id}.antiraid_channeldelete`, Number(argZ))
                    interaction.reply("**The channel Delete limit has been set to " + Number(argZ) + "**")
                    break;
                case "rolecreatelimit":
                    if (!argZ) return interaction.reply(":x: | **Provide The limit**")
                    if (isNaN(argZ)) return interaction.reply(":x: | **The limit has to be a number**")
                    if (Number(argZ) < 1) return interaction.reply(":x: | **The limit cannot be zero or negative number**")
                  await client.db.set(`${interaction.guild.id}.antiraid_rolecreate`, Number(argZ))
                    interaction.reply("**The role Create limit has been set to " + Number(argZ) + "**")
                    break;
                case "roledeletelimit":
                    if (!argZ) return interaction.reply(":x: | **Provide The limit**")
                    if (isNaN(argZ)) return interaction.reply(":x: | **The limit has to be a number**")
                    if (Number(argZ) < 1) return interaction.reply(":x: | **The limit cannot be zero or negative number**")
                  await client.db.set(`${interaction.guild.id}.antiraid_roledelete`, Number(argZ))
                    interaction.reply("**The role Delete limit has been set to " + Number(argZ) + "**")
                    break;
                case "lvl":
                   if (prem.guild !== true) return interaction.reply("This is a premium only feature! Join My support server for more info!");
                   if (!lvlB) return interaction.reply("Please provide the boolean option as true or false")
                   await client.db.set(`${interaction.guild.id}.levels`, lvlB)
                    interaction.reply("**The level system has been set to " + lvlB + "**")
                    break;
                case "banlimit":
                    if (!argZ) return interaction.reply(":x: | **Provide The limit**")
                    if (isNaN(argZ)) return interaction.reply(":x: | **The limit has to be a number**")
                    if (Number(argZ) < 1) return interaction.reply(":x: | **The limit cannot be zero or negative number**")
                  await client.db.set(`${interaction.guild.id}.antiraid_banlimit`, Number(argZ))
                    interaction.reply("**The ban limit has been set to " + Number(argZ) + "**")
                    break;
                case "kicklimit":
                    if (!argZ) return interaction.reply(":x: | **Provide The limit**")
                    if (isNaN(argZ)) return interaction.reply(":x: | **The limit has to be a number**")
                    if (Number(argZ) < 1) return interaction.reply(":x: | **The limit cannot be zero or negative number**")
                  await client.db.set(`${interaction.guild.id}.antiraid_kicklimit`, Number(argZ))
                    interaction.reply("**The kick limit has been set to " + Number(argZ) + "**")
                    break;
                case "punishment":
                    if (!argX) return interaction.reply(":x: | **Provide The punishment**")
                  await client.db.set(`${interaction.guild.id}.antiraid_punish`, argX.toLowerCase())
                    interaction.reply("**The punishment has been set to " + argX + "**")
                    break;
                case "quote":
                    if (prem.guild !== true) return interaction.reply("This is a premium only feature! Join My support server for more info!");
                    if (!booP) return interaction.reply(":x: | **Provide True or False with the set option**")
                  await client.db.set(`${interaction.guild.id}.antiraid_quote`, booP.toLowerCase())
                    interaction.reply("**The quote system has been set to " + booP.replace("false", disabled) + "**")
                    break;
                case "logs":
                    let channel = interaction.options.getChannel("channel")
                    if (!channel) return interaction.reply(":x: | **Mention The channel**")
                    if (channel.guild.id !== interaction.guild.id) return interaction.reply(":x: | **That channel is not from this server**")
                    await channel.send("**Anti Raid logs Channel**")
                    await client.db.set(`${interaction.guild.id}.antiraid_logs`, channel.id)
                    interaction.reply("**The logs channel has been set to " + channel + "**")
                    break;
                case "modrole":
                    let modrole = interaction.options.getRole("role");
                    if (!modrole) return interaction.reply(":x: | **There was no modrole given!**")
                    if (!interaction.guild.roles.cache.get(modrole.id)) return interaction.reply(":x: | **There was no role found!**");
                    if (modrole && Number(argZ)) {
                        await client.db.delete(interaction.guild.id + ".modrole")
                        interaction.reply(`**Deleted the configured modrole due to a number value being passed.\nOnly use the role argument to set this!`)
                        return;
                    }
                    await client.db.set(`${interaction.guild.id}.modrole`, modrole.id)
                    interaction.reply("**The moderator role has been set to " + modrole.name + "**")
                    break;
                case "memberrole":
                    let mbrole = interaction.options.getRole("role");
                    if (!mbrole) return interaction.reply(":x: | **There was no member role given!**")
                    if (!interaction.guild.roles.cache.get(mbrole.id)) return interaction.reply(":x: | **There was no role found!**");
                    if (mbrole && Number(argZ)) {
                        await client.db.delete(interaction.guild.id + ".joinRole")
                        interaction.reply(`**Deleted the configured member role due to a number value being passed.\nOnly use the role argument to set this!`)
                        return;
                    }
                    await client.db.set(`${interaction.guild.id}.joinRole`, mbrole.id)
                    interaction.reply("**The Member role has been set to " + mbrole.name + "**")
                    break;
                case "botrole":
                    if (prem.guild !== true) return interaction.reply("This is a premium only feature! Join My support server for more info!");
                    let brolez = interaction.options.getRole("role");
                    if (!brolez) return interaction.reply(":x: | **There was no bot role given!**")
                    if (!interaction.guild.roles.cache.get(brolez.id)) return interaction.reply(":x: | **There was no role found!**");
                    if (brolez && Number(argZ)) {
                        await client.db.delete(interaction.guild.id + ".joinBotRole")
                        interaction.reply(`**Deleted the configured bot role due to a number value being passed.\nOnly use the role argument to set this!`)
                        return;
                    }
                    await client.db.set(`${interaction.guild.id}.joinBotRole`, brolez.id)
                    interaction.reply("**The Bot role has been set to " + `\`${brolez.name} \``+ "**")
                    break;
            }
        } catch (err) {
            console.log("||||| ERROR: " + err)
            return interaction.reply("An Error Occurred!");
        }
    },
};
