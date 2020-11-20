import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";
import ms from "ms";

const MuteCommand = new Command({
  name: "mute",
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
    const time = ms(args[2]);
    if (!time || isNaN(time))
      return msg.channel.send(":x: Please provide a time to mute for!");
    const reason = args.slice(3).join(" ");
    if (!reason) return msg.channel.send(":x: Please provide a reason!");
    user.roles.add(client.config.roles.muted);
    const timeDate = Date.now() + time;
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

    // warn the user
    if (client.global.db.warnings["users"].ids?.includes(user.id)) {
      client.global.db.warnings[user.id].warnings.push({
        reason: reason,
        author: msg.author.tag,
        timestamp: Date.now(),
      });
    } else {
      client.db
        .collection("warnings")
        .doc(user.id)
        .set({
          ids: null,
          warnings: [
            {
              reason: reason,
              author: msg.author.tag,
              timestamp: Date.now(),
            },
          ],
        });
      client.global.db.warnings[user.id] = {
        ids: null,
        warnings: [
          {
            reason: reason,
            author: msg.author.tag,
            timestamp: Date.now(),
          },
        ],
      };
      client.db.collection("mutes").doc("users").set({
        ids: client.global.db.warnings["users"].ids,
      });
      client.global.db.warnings["users"].ids?.push(user.id);
    }

    msg.channel.send(
      `:white_check_mark: Successfully muted ${user.user.tag} for ${ms(time, {
        long: true,
      })} with reason "${reason}"`
    );
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.user?.tag}`, user.user?.displayAvatarURL())
      .setDescription(
        `${user} was muted!\nReason: ${
          client.global.db.mutes[user.id].reason
        }\nTime: ${ms(client.global.db.mutes[user.id].mutedFor, {
          long: true,
        })}`
      )
      .setTimestamp()
      .setColor("#4F545C")
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    LogsChannel.send(embed);
  },
});

export default MuteCommand;
