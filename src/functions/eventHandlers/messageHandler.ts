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
      content: `${msg.content}\n\nPosted by __${msg.author.tag}__ in __${msg.guild.name}__`,
    };

    discordClient.execute(requestBody); // -> Promise<AxiosResponse>
  }
  const prefix = client.config.prefix;
  if (!msg.content.startsWith(prefix)) return;

  if (!args[0]) return;

  const commandName = args[0].toLowerCase();

  if (commandName === "none") return;

  const command = client.commands.get(commandName);

  if ((!command && msg.content !== `${prefix}`) || !command) return;

  if (msg.channel instanceof Discord.TextChannel) {
    try {
      command.execute(msg, args, client);
    } catch (error) {
      msg.reply();
      const embed = new Discord.MessageEmbed()
        .setTitle(`Intellibot ${error.toString()}`)
        .setDescription(error.stack.replace(/at /g, "**at **"))
        .setColor("#82a1e1");
      msg.channel.send(embed);
    }
  }
}
