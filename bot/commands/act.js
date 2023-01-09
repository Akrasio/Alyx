const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const ACTION_ENDPOINTS = ["baka", "cookie", "cuddle", "hug", "kiss", "pat", "slap", "smug"]
const OPT = new SlashCommandStringOption()
    .setName("action")
    .setRequired(true)
    .setDescription("Action to perform to another member.");

for (const I of ACTION_ENDPOINTS) {
    OPT.addChoice(I, I)
}
const OPT2 = new SlashCommandUserOption()
    .setName("member")
    .setRequired(true)
    .setDescription("Member to perform the action with.");

module.exports = {
    sponsor: true,
    config: new SlashCommandBuilder()
        .setName("action")
        .setDescription("Perform an action with another member.")
        .addStringOption(opt => OPT)
        .addUserOption(opt => OPT2),
    async execute(interaction) {
        const user = interaction.options.getMember("member");
        const acti = interaction.options.getString("action");
        const { body } = await superagent.get(
            `https://nekos.life/api/v2/img/${acti}`
        );
        if (!body) return interaction.reply("Oopsie our service is busy, guess you're gonna go dry...");
        const emb = new MessageEmbed()
            .setAuthor({
                name: interaction.user.tag + " performed " + acti + ` with ${user.user.tag}`,
                iconURL: (user.user || user).displayAvatarURL({
                    size: 128,
                    format: "png",
                    dynamic: true
                })
            })
            .setImage(body.url)
            
            .setColor("RANDOM");
        return interaction.reply({ embeds: [emb], ephemeral: false });
    },
};
