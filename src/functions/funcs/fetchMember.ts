import Discord from "discord.js";

export default async function (
  msg: Discord.Message,
  args: Array<string>,
  check: boolean
) {
  if (!args[1]) return ":x: Please mention a member or provide an id!";
  const member =
    msg.mentions.members?.first() || (await msg.guild?.members.fetch(args[1]));
  if (
    (member?.roles.highest.position || 0) >=
      (msg.member?.roles.highest.position || 0) &&
    check
  )
    return ":x: This persons highest role is higher or equal to yours!";
  return member;
}
