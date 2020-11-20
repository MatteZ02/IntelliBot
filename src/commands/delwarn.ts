import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const DelwarnCommand = new Command({
  name: "delwarn",
  execute: async (
    msg: Discord.Message,
    args: Array<string>,
    client: Client
  ) => {
    if (
      !msg.member?.roles.cache.has(client.config.roles.admin) &&
      !msg.member?.roles.cache.has(client.config.roles.headmod) &&
      !msg.member?.roles.cache.has(client.config.roles.mod) &&
      !msg.member?.roles.cache.has(client.config.roles.supportTeam) &&
      !msg.member?.roles.cache.has(client.config.roles.trial)
    )
      return msg.channel.send(":x: Insufficient permissions!");
    const user = await client.funcs.fetchMember(msg, args, true);
    if (typeof user === "string") return msg.channel.send(user);
    if (!client.global.db.warnings["users"].ids?.includes(user.id))
      return msg.channel.send(":x: That user has no warnings!");

    client.global.db.warnings[user.id].warnings.splice(
      parseInt(args[2]) - 1,
      1
    );

    if (client.global.db.warnings[user.id].warnings.length == 0) {
      const index = client.global.db.warnings["users"].ids?.indexOf(user.id);
      client.global.db.warnings["users"].ids?.splice(index!, 1);
      delete client.global.db.warnings[user.id];
      client.db.collection("warnings").doc(user.id).delete();
    }

    msg.channel.send(
      `:white_check_mark: Removed warning ${args[2]} from ${user.user.tag}!`
    );
  },
});

export default DelwarnCommand;
