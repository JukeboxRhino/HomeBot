require('dotenv').config();
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { userMention } = require('@discordjs/builders');

// Set up client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// Set up command collection
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// Read files and set commands
commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
});

client.once('ready', () => {
  console.log('Ready!');
});

const tracking = {};

// Command stuff
client.on('interactionCreate', async(interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command', ephemeral: true });
  }
});

// Button stuff
client.on('interactionCreate', async(interaction) => {
  if (!interaction.isButton()) {
    return;
  }
  if (interaction.customId === 'home') {
    const messageId = interaction.message.id;
    if (!tracking[messageId]) {
      tracking[messageId] = [];
    }
    if (!tracking[messageId].includes(interaction.user.id)) {
      tracking[messageId].push(interaction.user.id);
    }
    try {
      await interaction.update({
        content: `${tracking[messageId].map(userMention).join(',')} ${tracking[messageId].length > 1 ? 'are' : 'is'} home`
      });
    } catch (error) {
      console.error(error);
      // Try to send message instead
      client.channels.cache.get(interaction.message.channelId).send(`${userMention(interaction.user.id)} is home`);

    }
  }
});

client.login(process.env.BOT_TOKEN);
