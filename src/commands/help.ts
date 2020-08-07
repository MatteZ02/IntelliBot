import { Command } from "../controller/Command";
import Discord from "discord.js";
import Client from "../controller/BaseClient";

const HelpCommand = new Command({
  name: "help",
  execute: (msg: Discord.Message, args: string[], client: Client) => {
    let commands = "";
    commands += `${client.commands.map((x) => `\`${x.name}\``).join(", ")}\n`;
    const embed = new Discord.MessageEmbed()
      .setTitle(`${client.user!.username}'s available commands`)
      .setDescription(commands)
      .setColor(client.config.embedColor);
    msg.channel.send(embed);
  },
});

export default HelpCommand;
