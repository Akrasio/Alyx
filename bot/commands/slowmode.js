const { SlashCommandBuilder, SlashCommandNumberOption } = require('@discordjs/builders');
OPT2 = new SlashCommandNumberOption().setName("seconds").setDescription("Seconds").setRequired(true);

module.exports = {
  config:
    new SlashCommandBuilder()
      .setName('slow')
      .addNumberOption(OPT2)
      .setDescription('Sets the channels slow mode (in seconds)'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(["MANAGE_CHANNELS", "MANAGE_MESSAGES"])) return interaction.reply("You need `MANAGE CHANNEL` and `MANAGE MESSAGES` to do this!")
    interaction.channel.setRateLimitPerUser(interaction.options.getNumber("seconds"));
    interaction.reply(
      `Set the slowmode of this channel to **${interaction.options.getNumber("seconds")}**`
    );
  },
};