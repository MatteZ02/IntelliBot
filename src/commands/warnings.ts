import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const WarningsCommand = new Command({
  name: "warnings",
  execute: async (
    msg: Discord.Message,
    args: Array<string>,
    client: Client
  ) => {
    const user = (await client.funcs.fetchMember(msg, args, false))
      ? await client.funcs.fetchMember(msg, args, false)
      : msg.member;
    if (
      user != msg.member &&
      !msg.member?.roles.cache.has(client.config.roles.admin) &&
      !msg.member?.roles.cache.has(client.config.roles.headmod) &&
      !msg.member?.roles.cache.has(client.config.roles.mod) &&
      !msg.member?.roles.cache.has(client.config.roles.supportTeam) &&
      !msg.member?.roles.cache.has(client.config.roles.trial)
    )
      return msg.channel.send(":x: Insufficient permissions!");
    if (typeof user === "string") return msg.channel.send(user);

    const message = client.global.db.warnings["users"].ids?.includes(
      user?.id as string
    )
      ? new Discord.MessageEmbed()
          .setAuthor(`${user?.user.tag}`, user?.user.displayAvatarURL())
          .setTitle(`Warnings for ${user?.displayName}`)
          .setDescription(
            `This user has **${
              client.global.db.warnings[user?.id as string].warnings.length
            }** warnings!\n${client.global.db.warnings[
              user?.id as string
            ].warnings
              .map(
                (warning) =>
                  `${
                    client.global.db.warnings[
                      user?.id as string
                    ].warnings.indexOf(warning) + 1
                  } - Reason: ${warning.reason} - Author: ${warning.author}`
              )
              .join("\n")}`
          )
          .setColor(0xecff00)
      : "This user has no warnings!";
    msg.channel.send(message);
  },
});

export default WarningsCommand;
