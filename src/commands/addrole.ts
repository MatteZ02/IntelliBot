import Command from "../controller/Command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const AddroleCommand = new Command({
  name: "addrole",
  execute: (msg: Discord.Message, args: Array<string>, client: Client) => {
    if (!msg.member?.roles.cache.has(client.config.roles.admin))
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
    if (!args[2])
      return msg.channel.send(
        "<:redx:674263474704220182> Please provide a role name to search for!"
      );
    const role =
      msg.guild?.roles.cache.get(args[2]) ||
      msg.guild?.roles.cache.find(
        (role) => role.name.toLowerCase() === args[2].toLowerCase()
      );
    if (!role)
      return msg.channel.send("<:redx:674263474704220182> Role not found!");
    if (user.roles.cache.has(role.id))
      return msg.channel.send(
        `<:redx:674263474704220182> ${user.user.tag} already has the ${role.name} role!`
      );
    user.roles.add(role);
    msg.channel.send(
      `<:green_check_mark:674265384777416705> Successfully given role ${role.name} to ${user.user.tag}`
    );
  },
});

export default AddroleCommand;
