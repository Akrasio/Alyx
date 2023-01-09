const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	config: new SlashCommandBuilder()
		.setName('idea')
		.addStringOption(option =>
            option.setName('suggestion')
                .setDescription("The idea you have and would like to suggest!").setRequired(true))
		.setDescription('sends an idea to the idea channel (if set)!'),
	async execute(interaction) {
    try {
		if (!interaction.guild) return;
		const dab = await interaction.client.db.get(interaction.guild.id + ".suggestchnl");
		const dabs = await interaction.client.db.get(interaction.guild.id + ".suggestrle");
		if (dab == null || !interaction.guild.channels.cache.get(dab)) return interaction.reply("The server staff has not set a designated poll channel!");
		let a = "<@&"+dabs+">";
		if (dabs == "none") a = "` `"
		let b = interaction.options.getString("suggestion")
		if (!Number(dabs)) a = " ";
		await interaction.guild.channels.cache.get(dab).send({ content: a, embeds: [new Discord.MessageEmbed().setColor("RANDOM").setTitle("New Poll:").setFooter(interaction.user.username+"#"+interaction.user.discriminator+" | ( "+interaction.user.id+" )").setDescription(b.replace("|", "\n"))]}).then(async (m) =>{
		  m.react("✔️");
		  m.react("✖️")
		  })
		  interaction.reply({ content: "Successfully sent your idea!", ephemeral: true})
	} catch (err){
		console.log("||||| ERROR: "+err)
		return interaction.reply("An Error Occurred!");
	}
},
};