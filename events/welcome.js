const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(`Nuevo miembro unido: ${member.user.tag}`);

    const canal = member.guild.channels.cache.get("1367323271825064047");

    if (!canal) {
      console.error("❌ Canal de bienvenida no encontrado.");
      return;
    }

    let invitadoPor = "Unknown";
    try {
      const invites = await member.guild.invites.fetch();
      const invite = invites.find(i => i.uses > 0 && i.inviter);
      if (invite && invite.inviter) {
        invitadoPor = invite.inviter.tag;
      }
    } catch (error) {
      console.error("No se pudo obtener el invitador:", error);
    }

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

    const embed = new EmbedBuilder()
      .setColor(0x38c8e8)
      .setTitle("🎉 Bienvenido(a) a CubeRaze Network 🎉")
      .setDescription(
        `¡Hola <@${member.id}>! Te damos una cálida bienvenida al servidor de Discord. Esperamos que la pases muy bien aquí.\n\n` +
        `> ⭐ \`|\` Invitado por: **${invitadoPor}**\n` +
        `> ⭐ \`|\` Miembros totales: **${member.guild.memberCount}**\n\n` +
        `Nuestro servidor de **Minecraft** cuenta con una gran variedad de modalidades clásicas:\n\n` +
        `> **\`SURVIVAL\`** \`|\` **\`BOXPVP\`** \`|\` **\`SKYBLOCK\`** \`|\` **\`¿...?\`**\n\n` +
        `**Recuerda leer las <#1367324781795344394> del servidor, para evitar inconvenientes a futuro.**\n\n` +
        `> 🌐 \`|\` IP: **mc.sandycraft.xyz**\n` +
        `> ⭐ \`|\` COMPATIBILIDAD: **1.8-1.20**\n` +
        `> 🛒 \`|\` WEB: tienda.sandycraft.net\n\n` +
        `**SandyCraft** se fundó el **10** de **Agosto** del **2024** por unos amantes del **Minecraft**.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `${fechaFormateada}` })
      .setTimestamp();

    try {
      await canal.send({ embeds: [embed] });
    } catch (error) {
      console.error(`No se pudo enviar el mensaje a ${member.user.tag}:`, error);
    }
  },
};
