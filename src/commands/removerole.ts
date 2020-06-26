import { Command } from "../controller/command";
import Client from "../controller/client";
import Discord from "discord.js";

const RemoveroleCommand = new Command({
  name: "removerole",
  execute: (msg: Discord.Message, args: Array<string>, client: Client) => {
    if (
      !msg.member?.roles.cache.has(client.config.roles.admin) ||
      !msg.member?.roles.cache.has(client.config.roles.mod)
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
    const role = msg.guild?.roles.cache.get(
      args[2]
    ) ||
      msg.guild?.roles.cache.find(role => role.name.toLowerCase() === args[2].toLowerCase());
    if (!role)
      return msg.channel.send(
        "<:redx:674263474704220182> Please mention a member or provide an id!"
      );
      user.roles.remove(role);
      msg.channel.send(`<:green_check_mark:674265384777416705> Successfully removed role ${role.name} from ${user.user.tag}`);
  },
});

export default RemoveroleCommand;
