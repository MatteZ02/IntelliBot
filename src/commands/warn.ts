import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const WarnCommand = new Command({
  name: "warn",
  execute: async (
    msg: Discord.Message,
    args: Array<string>,
    client: Client
  ) => {
    if (!msg.member) return;
    if (!(await client.funcs.checkPerms(client, msg.member, "helper")))
      return msg.channel.send(":x: Insufficient permissions!");
    const user = await client.funcs.fetchMember(msg, args, true);
    if (typeof user === "string") return msg.channel.send(user);
    const reason = args.slice(2).join(" ");
    if (!reason) return msg.channel.send(":x: Please provide a reason!");
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
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${user.user.tag}`, user.user.displayAvatarURL())
      .setTitle("An user was warned!")
      .setDescription(
        `${user.user.tag} was warned for ${reason}\nThis user has ${
          client.global.db.warnings[user.id].warnings.length
        } warnings!`
      )
      .setTimestamp()
      .setColor(0xecff00);
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    LogsChannel.send(embed);
    msg.channel.send(
      `:white_check_mark: Successfully warned ${
        user.user.tag
      } for "${reason}", This user has: ${
        client.global.db.warnings[user.id].warnings.length
      } warning(s)!`
    );
  },
});

export default WarnCommand;
