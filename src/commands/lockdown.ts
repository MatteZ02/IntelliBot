import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const LockdownCommand = new Command({
  name: "lockdown",
  execute: async (
    msg: Discord.Message,
    args: Array<String>,
    client: Client
  ) => {
    if (!msg.member) return;
    if (!(await client.funcs.checkPerms(client, msg.member, "admin")))
      return msg.channel.send(":x: Insufficient permissions!");
    const channel = msg.channel as Discord.TextChannel;
    if (channel.topic?.includes("lockdown")) {
      channel.edit({ topic: channel.topic.replace("<lockdown>", "") });
      channel.lockPermissions();
      channel.send(":white_check_mark: Lockdown lifted!");
    } else {
      channel.edit({ topic: channel.topic + "<lockdown>" });
      channel.overwritePermissions(
        [{ id: "583597555095437312", deny: ["SEND_MESSAGES"] }],
        "Lockdown"
      );
      channel.overwritePermissions([
        { id: "704681611035279371", deny: ["VIEW_CHANNEL"] },
      ]);
      channel.send(":white_check_mark: Lockdown set!");
    }
  },
});

export default LockdownCommand;
