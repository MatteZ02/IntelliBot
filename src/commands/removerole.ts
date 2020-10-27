import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const RemoveroleCommand = new Command({
  name: "removerole",
  execute: (msg: Discord.Message, args: Array<string>, client: Client) => {
    if (!msg.member?.roles.cache.has(client.config.roles.admin))
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
    if (!args[2])
      return msg.channel.send(
        ":x: Please provide a role name to search for!"
      );
    const role =
      msg.guild?.roles.cache.get(args[2]) ||
      msg.guild?.roles.cache.find(
        (role) => role.name.toLowerCase() === args[2].toLowerCase()
      );
    if (!role)
      return msg.channel.send(":x: Role not found!");
    if (!user.roles.cache.has(role.id))
      return msg.channel.send(
        `:x: ${user.user.tag} does not have the ${role.name} role!`
      );
    user.roles.remove(role);
    msg.channel.send(
      `:white_check_mark: Successfully removed role ${role.name} from ${user.user.tag}`
    );
  },
});

export default RemoveroleCommand;
