import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const KickCommand = new Command({
  name: "kick",
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
    const reason = args.slice(2).join(" ");
    if (!reason) return msg.channel.send(":x: Please provide a reason!");
    if (!user?.kickable)
      return msg.channel.send(":x: I cannot kick this person!");
    if (
      user?.roles.highest.position! >= msg.member.roles.highest.position &&
      msg.member.id !== msg.guild?.owner?.id
    )
      return msg.channel.send(":x: You cannot kick this person!");
    const LogsChannel = client.channels.cache.get(
      client.config.logsChannel
    ) as Discord.TextChannel;
    user?.kick(reason);

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
      `:white_check_mark: Successfully kicked ${user.user.tag} for ${reason}`
    );
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Member kicked`, user.user.displayAvatarURL())
      .setDescription(`${user}\n${user.user.tag}`)
      .setThumbnail(user.user.displayAvatarURL())
      .setTimestamp()
      .setColor(0xff0000)
      .setFooter(`ID: ${user.id}`, client.user?.displayAvatarURL());
    LogsChannel.send(embed);
  },
});

export default KickCommand;
