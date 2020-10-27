import Discord from "discord.js";
import Client from "../../controller/BaseClient";

export default async (client: Client) => {
  const LogsChannel = client.channels.cache.get(
    client.config.logsChannel
  ) as Discord.TextChannel;
  if (!LogsChannel) return console.log("No logs channel found. Logs disabled.");

  client.on("guildMemberAdd", async (member) => {
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Joined`, member.user?.displayAvatarURL())
      .setDescription(`${member}\n${member.user?.tag}`)
      .setThumbnail(member.user?.displayAvatarURL() as string)
      .setTimestamp()
      .setColor(0x00ff17)
      .setFooter(`ID: ${member.id}`, client.user?.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("guildMemberRemove", async (member) => {
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Left`, member.user?.displayAvatarURL())
      .setDescription(
        `${member}\n${member.user?.tag}\nbot: ${member.user?.bot}`
      )
      .setThumbnail(member.user?.displayAvatarURL() as string)
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${member.id}`, client.user?.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("guildBanAdd", async (guild, user) => {
    const ban = await guild.fetchBan(user as Discord.UserResolvable);
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Banned`, user.displayAvatarURL())
      .setDescription(
        `${user}\n${user.tag}\nbot: ${user.bot}\nReason: ${ban.reason}`
      )
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("guildBanRemove", async (guild, user) => {
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member Unbanned`, user.displayAvatarURL())
      .setDescription(`${user}\n${user.tag}\nbot: ${user.bot}`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xecff00)
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    return LogsChannel.send(embed);
  });
  client.on("messageDelete", async (message) => {
    if (message.author?.bot) return;
    let embed = new Discord.MessageEmbed()
      .setAuthor(`${message.author?.tag}`, message.author?.displayAvatarURL())
      .setDescription(
        `Message Sent By ${message.author} deleted in ${message.channel}`
      )
      .addField(`Message:`, message.content || "Unknown (embed)")
      .setTimestamp()
      .setColor(0xecff00)
      .setFooter(
        `Author ID: ${message.author?.id} | Message ID: ${message.id}`,
        client.user?.displayAvatarURL()
      );
    return LogsChannel.send(embed);
  });
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      let role = oldMember.roles.cache
        .filter((r) => !newMember.roles.cache.has(r.id))
        .map((e) => e);
      let embed;
      if (role[0].id === client.config.roles.muted) {
        if (client.global.db.mutes["users"].ids?.includes(newMember.id))
          return newMember.roles.add(client.config.roles.muted);
        embed = new Discord.MessageEmbed()
          .setAuthor(
            `${newMember.user?.tag}`,
            newMember.user?.displayAvatarURL()
          )
          .setDescription(`${newMember} was unmuted!`)
          .setTimestamp()
          .setColor("#4F545C")
          .setFooter(`ID: ${newMember.id}`, client.user?.displayAvatarURL());
        return LogsChannel.send(embed);
      } else {
        embed = new Discord.MessageEmbed()
          .setAuthor(
            `${newMember.user?.tag}`,
            newMember.user?.displayAvatarURL()
          )
          .setDescription(
            `${newMember} was removed from the \`${role[0].name}\` role`
          )
          .setTimestamp()
          .setColor(0xff0000)
          .setFooter(`ID: ${newMember.id}`, client.user?.displayAvatarURL());
        return LogsChannel.send(embed);
      }
    } else if (newMember.roles.cache.size > oldMember.roles.cache.size) {
      let role = newMember.roles.cache
        .filter((r) => !oldMember.roles.cache.has(r.id))
        .map((e) => e);
      let embed;
      if (role[0].id === client.config.roles.muted) {
        embed = new Discord.MessageEmbed()
          .setAuthor(
            `${newMember.user?.tag}`,
            newMember.user?.displayAvatarURL()
          )
          .setDescription(
            `${newMember} was muted!\nReason: ${
              client.global.db.mutes[newMember.id].reason
            }\nTime: ${client.global.db.mutes[newMember.id].mutedFor}`
          )
          .setTimestamp()
          .setColor("#4F545C")
          .setFooter(`ID: ${newMember.id}`, client.user?.displayAvatarURL());
        return LogsChannel.send(embed);
      } else
        embed = new Discord.MessageEmbed()
          .setAuthor(
            `${newMember.user?.tag}`,
            newMember.user?.displayAvatarURL()
          )
          .setDescription(`${newMember} was given the \`${role[0].name}\` role`)
          .setTimestamp()
          .setColor(0x23ff00)
          .setFooter(`ID: ${newMember.id}`, client.user?.displayAvatarURL());
      return LogsChannel.send(embed);
    }
    if (oldMember.nickname !== newMember.nickname) {
      let embed = new Discord.MessageEmbed()
        .setAuthor(`${newMember.user?.tag}`, newMember.user?.displayAvatarURL())
        .setDescription(`${newMember} Nickname Changed!`)
        .addField(`Before:`, oldMember.nickname || "None")
        .addField(`After:`, newMember.nickname || "None")
        .setTimestamp()
        .setColor(0xff00e0)
        .setFooter(`ID: ${newMember.id}`, client.user?.displayAvatarURL());
      return LogsChannel.send(embed);
    }
  });
};
