import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const UnmuteCommand = new Command({
  name: "unmute",
  execute: async (
    msg: Discord.Message,
    args: Array<string>,
    client: Client
  ) => {
    if (!msg.member) return;
    if (!(await client.funcs.checkPerms(client, msg.member, "support")))
      return msg.channel.send(":x: Insufficient permissions!");
    const user = await client.funcs.fetchMember(msg, args, false);
    if (typeof user === "string") return msg.channel.send(user);
    const index = client.global.db.mutes["users"].ids?.indexOf(user.id);
    client.global.db.mutes["users"].ids?.splice(index!, 1);
    delete client.global.db.mutes[user.id];
    client.db.collection("mutes").doc(user.id).delete();
    user.roles.remove(client.config.roles.muted);
    msg.channel.send(
      `:white_check_mark: Successfully unmuted ${user.user.tag}!`
    );
  },
});

export default UnmuteCommand;
