import Discord from "discord.js";
import Client from "../../controller/BaseClient";

export default async function messageHandler(
  msg: Discord.Message,
  client: Client
): Promise<void> {
  const args = msg.content.slice(client.config.prefix.length).split(" ");
  if (!msg.guild || !msg.member) return;
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
      msg.channel.send(`An error occured! \`${error}\``);
      console.error(error);
    }
  }
}
