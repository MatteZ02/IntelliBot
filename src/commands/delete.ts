import { Command } from "../controller/Command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const DeleteCommand = new Command({
  name: "delete",
  execute: (msg: Discord.Message, args: Array<String>, client: Client) => {
    if (
      !msg.member?.roles.cache.has(client.config.roles.admin) ||
      !msg.member?.roles.cache.has(client.config.roles.mod) ||
      !msg.member?.roles.cache.has(client.config.roles.devs) ||
      !msg.member?.roles.cache.has(client.config.roles.supportTeam)
    )
      return msg.channel.send(
        "<:redx:674263474704220182> Insufficient permissions!"
      );
    if (!args[1])
      return msg.channel.send(
        "<:redx:674263474704220182> Please provide a number to indicate the amount of messages to delete!"
      );
    const amount = parseInt(args[1].toString()) + 1;
    if (isNaN(amount))
      return msg.channel.send(
        "<:redx:674263474704220182> Please enter a valid __number__!"
      );
    msg.channel
      .bulkDelete(amount, true)
      .then((messages) =>
        msg.channel
          .send(
            `<:green_check_mark:674265384777416705> Successfully deleted ${messages.size} messages!`
          )
          .then((message) => message.delete({ timeout: 5000 }))
      );
  },
});

export default DeleteCommand;
