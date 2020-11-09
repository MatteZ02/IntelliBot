import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const MuteCommand = new Command({
  name: "mute",
  execute: async (
    msg: Discord.Message,
    args: Array<String>,
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
    const time = parseFloat(args[2]?.toString());
    if (!time || isNaN(time))
      return msg.channel.send(":x: Please provide a time in __hours__!");
    const reason = args.slice(3).join(" ");
    if (!reason) return msg.channel.send(":x: Please provide a reason!");
    user.roles.add(client.config.roles.muted);
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
      `:white_check_mark: Successfully muted ${user.user.tag} for ${time} hours with reason "${reason}"`
    );
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.user?.tag}`, user.user?.displayAvatarURL())
      .setDescription(
        `${user} was muted!\nReason: ${
          client.global.db.mutes[user.id].reason
        }\nTime: ${client.global.db.mutes[user.id].mutedFor}`
      )
      .setTimestamp()
      .setColor("#4F545C")
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    LogsChannel.send(embed);
  },
});

export default MuteCommand;
