import { Command } from "../controller/command";
import Client from "../controller/client";
import Discord from "discord.js";

const MuteCommand = new Command({
  name: "mute",
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
    const time = parseFloat(args[2]?.toString());
    if (!time || isNaN(time))
      return msg.channel.send(
        "<:redx:674263474704220182> Please provide a time in __hours__!"
      );
    const reason = args.slice(3).join(" ");
    if (!reason)
      return msg.channel.send(
        "<:redx:674263474704220182> Please provide a reason!"
      );
    user.roles.add("608365682291376128");
    const timeDate = Date.now() + time * 3600000;
    client.db.collection("mutes").doc(user.id).set({
      ids: null,
      time: timeDate,
      reason: reason,
      mutedFor: time,
    });
    client.global.db.mutes[user.id] = {
      ids: null,
      time: timeDate,
      reason: reason,
      mutedFor: time,
    };
    client.db.collection("mutes").doc("users").set({
      ids: client.global.db.mutes["users"].ids,
    });
    client.global.db.mutes["users"].ids?.push(user.id);
    msg.channel.send(
      `<:green_check_mark:674265384777416705> Successfully muted ${user.user.tag} for ${time} hours with reason "${reason}"`
    );
  },
});

export default MuteCommand;
