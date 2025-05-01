const { EmbedBuilder, SlashCommandBuilder, InteractionType } = require('discord.js');

const embed = new EmbedBuilder()
  .setColor(0x38c8e8)
  .setTitle('Servidor de Minecraft')
  .addFields(
    { name: 'Dirección IP', value: 'mc.sandycraft.xyz', inline: true },
    { name: 'Versión', value: '1.20.4', inline: true },
    { name: 'Jugadores conectados', value: '0', inline: true },
    { name: 'Descripción', value: '¡Bienvenido a SandyCraft!' },
  )
  .setTimestamp()
  .setFooter({ text: 'Servidor creado por Midominio' });

module.exports = {
data: new SlashCommandBuilder()
  .setName('ip')
  .setDescription('Muestra la información del servidor de Minecraft (fijo)'),
  async execute(interaction) {
    await interaction.reply({ embeds: [embed] })
  }
  } 




