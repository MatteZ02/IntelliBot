import Discord from "discord.js";
import Client from "../../controller/Client";

export default async function messageHandler(
  msg: Discord.Message,
  client: Client
) {
  const args = msg.content.slice(client.config.prefix.length).split(" ");
  if (!msg.guild || !msg.member) return;
  if (
    msg.member.id === "607266889537945605" &&
    !client.config.channelWhitelist.includes(msg.channel.id)
  ) {
    msg.delete();
    const warnMsg = await msg.channel.send(
      "Bot commands are not allowed in this channel!"
    );
    setTimeout(() => {
      warnMsg.delete();
    }, 5000);
  }
  if (msg.content.startsWith("+check")) {
    const warnMsg = await msg.channel.send(
      "Bot commands are not allowed in this channel!"
    );
    setTimeout(() => {
      warnMsg.delete();
    }, 5000);
  }
}
