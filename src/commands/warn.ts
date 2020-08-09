import { Command } from "../controller/Command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const WarnCommand = new Command({
  name: "warn",
  execute: (msg: Discord.Message, args: Array<string>, client: Client) => {
    if (
      !msg.member?.roles.cache.has(client.config.roles.admin) &&
      !msg.member?.roles.cache.has(client.config.roles.devs) &&
      !msg.member?.roles.cache.has(client.config.roles.mod) &&
      !msg.member?.roles.cache.has(client.config.roles.supportTeam)
    )
      return msg.channel.send(
        "<:redx:674263474704220182> Insufficient permissions!"
      );
    const user =
      msg.mentions.members?.first() ||
      msg.guild?.members.cache.get(args[1]?.toString());
    if (!user)
      return msg.channel.send(
        "<:redx:674263474704220182> Please mention a member or provide an id!"
      );
    const reason = args.slice(2).join(" ");
    if (!reason)
      return msg.channel.send(
        "<:redx:674263474704220182> Please provide a reason!"
      );
    if (client.global.db.warnings["users"].ids?.includes(user.id)) {
      client.global.db.warnings[user.id].warnings++;
    } else {
      client.db.collection("warnings").doc(user.id).set({
        ids: null,
        warnings: 1,
      });
      client.global.db.warnings[user.id] = {
        ids: null,
        warnings: 1,
      };
      client.db.collection("mutes").doc("users").set({
        ids: client.global.db.warnings["users"].ids,
      });
      client.global.db.warnings["users"].ids?.push(user.id);
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL())
      .setTitle("An user was warned!")
      .setDescription(
        `${user.user.tag} was warned for ${reason}\nThis user has ${
          client.global.db.warnings[user.id].warnings
        } warnings!`
      )
      .setTimestamp()
      .setColor(0xecff00);
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    LogsChannel.send(embed);
    msg.channel.send(
      `<:green_check_mark:674265384777416705> Successfully warned ${
        user.user.tag
      } for "${reason}", This user has: ${
        client.global.db.warnings[user.id].warnings
      } warning(s)!`
    );
  },
});

export default WarnCommand;
