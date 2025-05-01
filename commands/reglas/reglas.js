const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', (message) => {
    if (message.content.toLowerCase() === 'reglas') {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Reglas del servidor')
            .setDescription('Aquí están las reglas del servidor:')
            .addFields(
                { name: '1. Respeto', value: 'Debes ser respetuoso con todos los miembros del servidor.' },
                { name: '2. No spam', value: 'Evita hacer spam en los canales.' },
                { name: '3. No contenido NSFW', value: 'No está permitido compartir contenido NSFW.' },
                { name: '4. Seguir las indicaciones del staff', value: 'Debes seguir las indicaciones de los moderadores y administradores.' }
            )
            .setFooter({ text: '¡Disfruta del servidor!' });

        message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
