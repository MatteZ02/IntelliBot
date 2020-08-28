import Command from "../controller/command";
import Client from "../controller/BaseClient";
import Discord from "discord.js";

const EvalCommand = new Command({
  name: "eval",
  async execute(msg: Discord.Message, args: Array<String>, client: Client) {
    if (msg.member?.id !== "360363051792203779") return;
    const input = msg.content.slice(
      client.config.prefix.length + args[0].length
    );
    let output;
    try {
      output = await eval(input);
    } catch (error) {
      output = error.toString();
    }
    const embed = new Discord.MessageEmbed()
      .setTitle("evaluation command")
      .setColor("")
      .setDescription(
        `Input: \`\`\`js\n${input
          .replace(/; /g, ";")
          .replace(/;/g, ";\n")}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``
      );
    return msg.channel.send(embed);
  },
});

export default EvalCommand;
