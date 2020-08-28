import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const PurgeComamnd = new Command({
  name: "purge",
  execute: (msg: Discord.Message, args: Array<String>, client: Client) => {
    if (!msg.member?.roles.cache.has(client.config.roles.admin))
      return msg.channel.send(
        "<:redx:674263474704220182> Insufficient permissions!"
      );
    const oldChannel = msg.channel as Discord.TextChannel;
    oldChannel.clone();
    oldChannel.delete();
  },
});

export default PurgeComamnd;
