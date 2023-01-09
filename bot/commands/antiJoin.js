const { OWNER_ID } = require("../config/config");
const { SlashCommandBuilder, SlashCommandBooleanOption } = require('@discordjs/builders');
OPT = new SlashCommandBooleanOption().setName("status").setDescription("Status")
module.exports = {
    config:
        new SlashCommandBuilder()
            .setName('antijoin')
            .setDescription('Sets AntiJoin on/off')
            .addBooleanOption(OPT),
    async execute(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR") && interaction.user.id !== OWNER_ID)
            return interaction.reply(
                "**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**"
            );
        if (interaction.options.getBoolean("status")) {
            await interaction.client.db.set(interaction.guild.id + ".antijoin", "on")
            interaction.reply("Turned anti join on! Now all new joins will be kicked until this is disabled.");
            return;
        }
        if (interaction.options.getBoolean("status") == false) {
            await interaction.client.db.set(`${interaction.guild.id}.antijoin`, "off");
            interaction.reply("Anti-join has been disabled.");
        }

    }
};
