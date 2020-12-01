import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";
import ms from "ms";

const TempbanCommand = new Command({
  name: "tempban",
  execute: async (
    msg: Discord.Message,
    args: Array<string>,
    client: Client
  ) => {
    if (!msg.member) return;
    if (!(await client.funcs.checkPerms(client, msg.member, "mod")))
      return msg.channel.send(":x: Insufficient permissions!");
    const user = await client.funcs.fetchMember(msg, args, true);
    if (typeof user === "string") return msg.channel.send(user);
    const time = ms(args[2]);
    if (!time || isNaN(time))
      return msg.channel.send(":x: Please provide a time to mute for!");
    const reason = args.slice(3).join(" ");
    if (!reason) return msg.channel.send(":x: Please provide a reason!");
    if (!user?.bannable)
      return msg.channel.send(":x: I cannot ban this person!");
    if (
      user?.roles.highest.position! >= msg.member.roles.highest.position &&
      msg.member.id !== msg.guild?.owner?.id
    )
      return msg.channel.send(":x: You cannot ban this person!");
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    client.global.db.bans[user.id] = { ids: null, expire: time + Date.now() };
    client.global.db.bans["users"].ids?.push(user.id);
    client.db
      .collection("bans")
      .doc(user.id)
      .set({ expire: time + Date.now() });
    user?.ban({ reason: reason, days: 1 });

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
      `:white_check_mark: Successfully tempbanned ${
        user.user.tag
      } for ${ms(time, { long: true })}`
    );
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member tempbanned`, user.user.displayAvatarURL())
      .setDescription(
        `${user}\n${user.user.tag}\nBanned for ${ms(time, { long: true })}`
      )
      .setThumbnail(user.user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    LogsChannel.send(embed);
  },
});

export default TempbanCommand;
