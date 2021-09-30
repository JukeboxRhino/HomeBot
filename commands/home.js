const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('home')
    .setDescription('Waits for people to get home'),
  async execute(interaction) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('home')
          .setLabel('I\'m Home')
          .setStyle('PRIMARY')
      );

    await interaction.reply({
      content: 'Please click when you get home!',
      components: [row]
    });
  }
};
