import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord, { Collection, Snowflake, Message } from "discord.js";

const DeleteCommand = new Command({
  name: "delete",
  execute: async (
    msg: Discord.Message,
    args: Array<String>,
    client: Client
  ) => {
    if (!msg.member) return;
    if (!(await client.funcs.checkPerms(client, msg.member, "support")))
      return msg.channel.send(":x: Insufficient permissions!");
    if (!args[1])
      return msg.channel.send(
        ":x: Please provide a number to indicate the amount of messages to delete!"
      );
    const amount = parseInt(args[1].toString()) + 1;
    if (isNaN(amount))
      return msg.channel.send(":x: Please enter a valid __number__!");
    const channel = msg.channel as Discord.TextChannel;
    channel
      .bulkDelete(amount, true)
      .then((messages: Collection<Snowflake, Message>) =>
        msg.channel
          .send(
            `:white_check_mark: Successfully deleted ${messages.size} messages!`
          )
          .then((message) => message.delete({ timeout: 5000 }))
      );
  },
});

export default DeleteCommand;
