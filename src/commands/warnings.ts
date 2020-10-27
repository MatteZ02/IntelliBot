import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const WarningsCommand = new Command({
  name: "warnings",
  execute: (msg: Discord.Message, args: Array<string>, client: Client) => {
    const user = msg.mentions.members?.first() ? msg.mentions.members?.first() : msg.member;
    if (
    user != msg.member &&
    !msg.member?.roles.cache.has(client.config.roles.admin) &&
    !msg.member?.roles.cache.has(client.config.roles.headmod) &&
    !msg.member?.roles.cache.has(client.config.roles.mod) &&
    !msg.member?.roles.cache.has(client.config.roles.supportTeam) &&
    !msg.member?.roles.cache.has(client.config.roles.trial)
    )
      return msg.channel.send(
        ":x: Insufficient permissions!"
      );
    if (!user)
      return msg.channel.send(":x: User not found!");

    const message = client.global.db.warnings["users"].ids?.includes(user.id) ?
    new Discord.MessageEmbed()
      .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL())
      .setTitle(`Warnings for ${user.displayName}`)
      .setDescription(`This user has **${client.global.db.warnings[user.id].warnings}** warnings!`)
      .setColor(0xecff00)
      : "This user has no warnings!"
    msg.channel.send(message);
  },
});

export default WarningsCommand;
