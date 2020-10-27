import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const WarnCommand = new Command({
  name: "warn",
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
        "<:redx:674263474704220182> Insufficient permissions!"
      );
    if (!user)
      return msg.channel.send("<:redx:674263474704220182> User not found!");

    const message = client.global.db.warnings["users"].ids?.includes(user.id) ?
    new Discord.MessageEmbed()
      .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL())
      .setTitle(`Warnings for ${user.displayName}`)
      .setDescription(`This use has **${client.global.db.warnings[user.id].warnings}** warnings!`)
      .setColor(0xecff00)
      : "This user has no warnings!"
    msg.channel.send(message);
  },
});

export default WarnCommand;
