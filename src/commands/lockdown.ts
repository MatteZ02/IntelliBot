import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const LockdownCommand = new Command({
  name: "lockdown",
  execute: (msg: Discord.Message, args: Array<String>, client: Client) => {
    if (!msg.member?.roles.cache.has(client.config.roles.admin))
      return msg.channel.send(
        "<:redx:674263474704220182> Insufficient permissions!"
      );
    const channel = msg.channel as Discord.TextChannel;
    if (channel.topic?.includes("lockdown")) {
      channel.edit({ topic: channel.topic.replace("<lockdown>", "") });
      channel.lockPermissions();
      channel.send("<:green_check_mark:674265384777416705> Lockdown lifted!");
    } else {
      channel.edit({ topic: channel.topic + "<lockdown>" });
      channel.overwritePermissions(
        [{ id: "583597555095437312", deny: ["SEND_MESSAGES"] }],
        "Lockdown"
      );
      channel.overwritePermissions([
        { id: "704681611035279371", deny: ["VIEW_CHANNEL"] },
      ]);
      channel.send("<:green_check_mark:674265384777416705> Lockdown set!");
    }
  },
});

export default LockdownCommand;
