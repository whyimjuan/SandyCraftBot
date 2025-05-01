const { Client, GatewayIntentBits, Partials, EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers, // Necesario para escuchar cambios de roles
  ],
  partials: [Partials.Channel],
});

const encuestaFilePath = path.join(__dirname, 'encuestas.json');

let usuariosQueRespondieron = {};
try {
  const data = fs.readFileSync(encuestaFilePath, 'utf-8');
  usuariosQueRespondieron = JSON.parse(data);
} catch (err) {
  console.log("No se pudo cargar el archivo de encuestas, se creará uno nuevo.");
}

const questions = [
  "¿Cuál es tu nombre?",
  "¿Cuál es tu edad?",
  "¿De dónde eres?",
  "¿Qué juegos te gustan jugar más?",
  "¿Cómo supiste de SandyCraft?",
  "¿Qué esperas encontrar en nuestra comunidad?",
  "¿Tienes alguna experiencia previa en comunidades similares?"
];

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot listo como ${client.user.tag}`);
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  // Verificar si el rol "verificado" fue añadido
  const verifiedRole = newMember.guild.roles.cache.get("1367331602715119737");
  if (!verifiedRole) return;

  if (!oldMember.roles.cache.has(verifiedRole.id) && newMember.roles.cache.has(verifiedRole.id)) {
    // El usuario ha obtenido el rol "verificado"
    const userId = newMember.id;

    if (usuariosQueRespondieron[userId]) {
      console.log(`${newMember.user.tag} ya completó la encuesta.`);
      return;
    }

    try {
      const dmChannel = await newMember.user.createDM();

      const welcomeEmbed = new EmbedBuilder()
        .setColor(0x38c8e8)
        .setDescription(
          `👋 Bienvenido/a a nuestra comunidad, nos alegra muchísimo tenerte por aquí.\n\nAquí encontrarás jugadores geniales, eventos increíbles y un ambiente donde todos pueden disfrutar de **SandyCraft** al máximo.\n\nAntes de comenzar tu experiencia con nosotros, nos gustaría conocerte un poquito mejor para darte la mejor bienvenida posible 💚\n\nPor favor, responde estas preguntas a continuación 👇`
        );

      await dmChannel.send({ embeds: [welcomeEmbed] });

      await new Promise(resolve => setTimeout(resolve, 5000));

      const responses = [];

      for (let i = 0; i < questions.length; i++) {
        const embed = new EmbedBuilder()
          .setColor(0x38c8e8)
          .setTitle(`Pregunta ${i + 1}`)
          .setDescription(questions[i]);

        await dmChannel.send({ embeds: [embed] });

        const collected = await dmChannel.awaitMessages({
          filter: m => m.author.id === userId,
          max: 1,
          time: 2 * 60 * 1000,
          errors: ['time']
        });

        const answer = collected.first().content;
        responses.push({ question: questions[i], answer });
      }

      const thanksEmbed = new EmbedBuilder()
        .setColor(0x38c8e8)
        .setDescription("✅ ¡Gracias por responder a la encuesta! Te damos la bienvenida nuevamente a SandyCraft 🩵");

      await dmChannel.send({ embeds: [thanksEmbed] });

      usuariosQueRespondieron[userId] = true;

      fs.writeFileSync(encuestaFilePath, JSON.stringify(usuariosQueRespondieron, null, 2));

      const logChannel = await client.channels.fetch("1367565472203276450");
      if (logChannel && logChannel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setTitle(`📋 Encuesta respondida por ${newMember.user.tag}`)
          .setThumbnail(newMember.user.displayAvatarURL())
          .setColor(0x38c8e8)
          .setTimestamp();

        responses.forEach((resp, index) => {
          embed.addFields({
            name: `❓ ${resp.question}`,
            value: `💬 ${resp.answer}`,
          });
        });

        await logChannel.send({ embeds: [embed] });
      }

    } catch (err) {
      console.error("❌ Error al enviar DM o registrar respuestas:", err);
    }
  }
});

client.login(process.env.TOKEN);
