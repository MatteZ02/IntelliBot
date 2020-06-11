import Discord from "discord.js";
import Client from "../../controller/client";

export default async (client: Client) => {
  const LogsChannel = client.channels.cache.get(
    client.config.logsChannel
  ) as Discord.TextChannel;

  client.on("guildMemberAdd", async (member) => {
    if (
      !member ||
      !member.user ||
      !LogsChannel ||
      !client.user ||
      member.user.bot
    )
      return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Joined`, member.user.displayAvatarURL())
      .setDescription(`${member}\n${member.user.tag}`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setColor(0x00ff17)
      .setFooter(`ID: ${member.id}`, client.user.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("guildMemberRemove", async (member) => {
    if (
      !member ||
      !member.user ||
      !LogsChannel ||
      !client.user ||
      member.user.bot
    )
      return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Left`, member.user.displayAvatarURL())
      .setDescription(`${member}\n${member.user.tag}\nbot: ${member.user.bot}`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${member.id}`, client.user.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("guildBanAdd", async (guild, user) => {
    let member = guild.members.cache.first();
    if (!member || !member.user || !LogsChannel || !client.user || user.bot)
      return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Banned`, user.displayAvatarURL())
      .setDescription(`${user}\n${user.tag}\nbot: ${user.bot}`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${user.id}`, client.user.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("guildBanRemove", async (guild, user) => {
    let member = guild.members.cache.first();
    if (!member || !member.user || !LogsChannel || !client.user || user.bot)
      return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Unbanned`, user.displayAvatarURL())
      .setDescription(`${user}\n${user.tag}\nbot: ${user.bot}`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xecff00)
      .setFooter(`ID: ${user.id}`, client.user.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (
      !oldMessage ||
      !oldMessage.author ||
      !LogsChannel ||
      !client.user ||
      !newMessage ||
      !newMessage.content ||
      !oldMessage.content
    )
      return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(
        `${oldMessage.author.tag}`,
        oldMessage.author.displayAvatarURL()
      )
      .setDescription(
        `Message Edited in ${oldMessage.channel}\n[Link to Message](${newMessage.url})`
      )
      .addField(`Before`, oldMessage.content)
      .addField(`After`, newMessage.content)
      .setTimestamp()
      .setColor(0xecff00)
      .setFooter(
        `User ID: ${oldMessage.author.id}`,
        client.user.displayAvatarURL()
      );
    return LogsChannel.send(embed);
  });
  client.on("messageDelete", async (message) => {
    if (!message || !message.author || !LogsChannel || !client.user) return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
      .setDescription(
        `Message Sent By ${message.author} deleted in ${message.channel}`
      )
      .addField(`Message:`, message.content || "Unknown (embed)")
      .setTimestamp()
      .setColor(0xecff00)
      .setFooter(
        `Author ID: ${message.author.id} | Message ID: ${message.id}`,
        client.user.displayAvatarURL()
      );
    return LogsChannel.send(embed);
  });
  client.on("roleCreate", async (role) => {
    if (!LogsChannel || !role || !client.user) return;
    let embed = new Discord.MessageEmbed()
      .setTitle(`Role Created: @${role.name}`)
      .setTimestamp()
      .setColor(0x23ff00)
      .setFooter(`ID: ${role.id}`, client.user.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("roleDelete", async (role) => {
    if (!LogsChannel || !role || !client.user) return;
    let embed = new Discord.MessageEmbed()
      .setTitle(`Role Deleted: @${role.name}`)
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${role.id}`, client.user.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("roleUpdate", async (oldRole, newRole) => {
    if (!LogsChannel || !client.user) return;
    if (oldRole.name === "@everyone") return;
    if (oldRole.position !== newRole.position) return;
    if (oldRole.name === newRole.name && oldRole.hexColor === newRole.hexColor)
      return;
    let embed = new Discord.MessageEmbed()
      .setDescription(`**Role Updated**`)
      .addField(`Before:`, oldRole.name)
      .addField(`After:`, newRole)
      .setTimestamp()
      .setColor(0xf3ff00)
      .setFooter(`ID: ${newRole.id}`, client.user.displayAvatarURL());
    if (oldRole.hexColor !== newRole.hexColor) {
      embed.addField(
        `Role Color Changed`,
        `${oldRole.hexColor} :arrow_right: ${newRole.hexColor}`
      );
    }
    return LogsChannel.send(embed);
  });
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (
      !newMember ||
      !oldMember ||
      !newMember.user ||
      !oldMember.user ||
      !client.user ||
      !LogsChannel
    )
      return;
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let role = oldMember.roles.cache
        .filter((r) => !newMember.roles.cache.has(r.id))
        .map((e) => e);
      let embed = new Discord.MessageEmbed()
        .setAuthor(`${newMember.user.tag}`, newMember.user.displayAvatarURL())
        .setDescription(
          `${newMember} was removed from the \`${role[0].name}\` role`
        )
        .setTimestamp()
        .setColor(0xff0000)
        .setFooter(`ID: ${newMember.id}`, client.user.displayAvatarURL());
      return LogsChannel.send(embed);
    } else if (newMember.roles.cache.size > oldMember.roles.cache.size) {
      let role = newMember.roles.cache
        .filter((r) => !oldMember.roles.cache.has(r.id))
        .map((e) => e);
      let embed = new Discord.MessageEmbed()
        .setAuthor(`${newMember.user.tag}`, newMember.user.displayAvatarURL())
        .setDescription(`${newMember} was given the \`${role[0].name}\` role`)
        .setTimestamp()
        .setColor(0x23ff00)
        .setFooter(`ID: ${newMember.id}`, client.user.displayAvatarURL());
      return LogsChannel.send(embed);
    }
    if (oldMember.nickname !== newMember.nickname) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(`${newMember.user.tag}`, newMember.user.displayAvatarURL())
        .setDescription(`${newMember} Nickname Changed!`)
        .addField(`Before:`, oldMember.nickname || "None")
        .addField(`After:`, newMember.nickname || "None")
        .setTimestamp()
        .setColor(0xff00e0)
        .setFooter(`ID: ${newMember.id}`, client.user.displayAvatarURL());
      return LogsChannel.send(embed);
    }
  });
};
