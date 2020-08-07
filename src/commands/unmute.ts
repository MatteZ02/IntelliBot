import { Command } from "../controller/Command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const UnmuteCommand = new Command({
  name: "unmute",
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
    const user =
      msg.mentions.members?.first() ||
      msg.guild?.members.cache.get(args[1]?.toString());
    if (!user)
      return msg.channel.send(
        "<:redx:674263474704220182> Please mention a member or provide an id!"
      );
    user.roles.remove("608365682291376128");
    const index = client.global.db.mutes.users.ids?.indexOf(user.id);
    client.global.db.mutes.users.ids?.splice(index!, 1);
    delete client.global.db.mutes[user.id];
    client.db.collection("mutes").doc(user.id).delete();
    msg.channel.send(
      `<:green_check_mark:674265384777416705> Successfully unmuted ${user.user.tag}!`
    );
  },
});

export default UnmuteCommand;
