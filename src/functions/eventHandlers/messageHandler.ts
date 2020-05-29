import Discord from "discord.js";
import Client from "../../controller/client";
import DiscordWebhook, { Webhook } from "discord-webhook-ts";

export default async function messageHandler(
  msg: Discord.Message,
  client: Client
) {
  const args = msg.content.slice(client.config.prefix.length).split(" ");
  if (!msg.guild || !msg.member) return;
  if (msg.channel.id === "583598785134067741") {
    const discordClient = new DiscordWebhook(client.config.webHookUrl);

    const requestBody: Webhook.input.POST = {
      content: `${msg.content}\n\nPosted by: ${msg.author.tag}, in: ${msg.guild.name}`,
    };

    discordClient.execute(requestBody); // -> Promise<AxiosResponse>
  }
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
