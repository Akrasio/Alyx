const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed, Message } = require("discord.js");
const messageCreate = require("../events/guild/messageCreate");
const NSFW_ENDPOINTS = ["ass", "assgif", "athighs", "bbw", "bdsm", "blow", "boobs", "feet", "furfuta", "furgif", "futa", "gifs", "hboobs", "hentai", "hfeet", "irlfemb", "jackopose", "latex", "milk", "pantsu", "sex", "slime", "thighs", "trap", "yuri"]
const OPT = new SlashCommandStringOption()
    .setName("category")
    .setRequired(true)
    .setDescription("Category");

for (const I of NSFW_ENDPOINTS) {
    OPT.addChoice(I, I)
}

module.exports = {
    sponsor: true,
    config: new SlashCommandBuilder()
        .setName("nsfw")
        .setDescription("Have some lewds")
        .addStringOption(opt => OPT),
    async execute(interaction) {
        if (!interaction.channel.nsfw && interaction.guild) return interaction.reply("You can not use this outside an NSFW channel!")
        const user = interaction.member || interaction.user;
        console.log(interaction.options._hoistedOptions[0].value)
        await interaction.client.lewds.nsfw(interaction.options._hoistedOptions[0].value).then(URL => {
            if (!URL) return interaction.reply("Oopsie our service is busy, guess you're gonna go dry...");
            const emb = new MessageEmbed()
                .setAuthor({
                    name: (user.displayName || user.username) + "'s " + interaction.options._hoistedOptions[0].value + " 😳",
                    iconURL: (user.user || user).displayAvatarURL({
                        size: 128,
                        format: "png",
                        dynamic: true
                    })
                })
                .setImage(URL.result)
                .setColor("RANDOM");
            return interaction.reply({ embeds: [emb], ephemeral: false, components: [
		   {
            		"type": 1,
            		"components": [{
					"type": 2,
					"label": "No Image? Click Here!",
					"style": 5,
					"url": `${URL.result.split(" ").join("%20")}`,
				}]
        		}]
              });
        })
    },
};
