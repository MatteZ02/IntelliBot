import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const PurgeComamnd = new Command({
  name: "purge",
  execute: async (msg: Discord.Message, args: Array<String>, client: Client) => {
    if (!msg.member?.roles.cache.has(client.config.roles.admin))
      return msg.channel.send(
        ":x: Insufficient permissions!"
      );
    const oldChannel = msg.channel as Discord.TextChannel;
    const newChannel = await oldChannel.clone();
    oldChannel.delete();
    newChannel.send(":white_check_mark: Channel purged!");
  },
});

export default PurgeComamnd;
