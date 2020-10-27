import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const BanCommand = new Command({
  name: "ban",
  execute: (msg: Discord.Message, args: Array<String>, client: Client) => {
    if (
      !msg.member?.roles.cache.has(client.config.roles.admin) &&
      !msg.member?.roles.cache.has(client.config.roles.headmod) &&
      !msg.member?.roles.cache.has(client.config.roles.mod)
    )
      return msg.channel.send(
        ":x: Insufficient permissions!"
      );
    const user =
      msg.mentions.members?.first() ||
      msg.guild?.members.cache.get(args[1]?.toString());
    if (!user)
      return msg.channel.send(
        ":x: Please mention a member or provide an id!"
      );
    const reason = args.slice(2).join(" ");
    if (!reason)
      return msg.channel.send(
        ":x: Please provide a reason!"
      );
    if (!user?.bannable)
      return msg.channel.send(
        ":x: I cannot ban this person!"
      );
    if (
      user?.roles.highest.position! >= msg.member.roles.highest.position &&
      msg.member.id !== msg.guild?.owner?.id
    )
      return msg.channel.send(
        ":x: You cannot ban this person!"
      );
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    user?.ban({ reason: reason, days: 1 });
    msg.channel.send(
      `:white_check_mark: Successfully banned ${user.user.tag} for ${reason}`
    );
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member banned`, user.user.displayAvatarURL())
      .setDescription(`${user}\n${user.user.tag}`)
      .setThumbnail(user.user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    LogsChannel.send(embed);
  },
});

export default BanCommand;
