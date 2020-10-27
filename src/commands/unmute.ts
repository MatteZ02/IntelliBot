import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const UnmuteCommand = new Command({
  name: "unmute",
  execute: (msg: Discord.Message, args: Array<String>, client: Client) => {
    if (
      !msg.member?.roles.cache.has(client.config.roles.admin) &&
      !msg.member?.roles.cache.has(client.config.roles.headmod) &&
      !msg.member?.roles.cache.has(client.config.roles.mod) &&
      !msg.member?.roles.cache.has(client.config.roles.supportTeam) &&
      !msg.member?.roles.cache.has(client.config.roles.trial)
    )
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
    user.roles.remove("608365682291376128");
    const index = client.global.db.mutes.users.ids?.indexOf(user.id);
    client.global.db.mutes.users.ids?.splice(index!, 1);
    delete client.global.db.mutes[user.id];
    client.db.collection("mutes").doc(user.id).delete();
    msg.channel.send(
      `:white_check_mark: Successfully unmuted ${user.user.tag}!`
    );
  },
});

export default UnmuteCommand;
