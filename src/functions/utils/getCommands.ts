import Discord from "discord.js";
import Command from "../../controller/command";

import Commands from "../../commands/index";

/**
 * Returns a collection of all the commands.
 */
export function getCommands() {
  const commands = new Discord.Collection<string, Command>();

  for (const command of Commands) {
    commands.set(command.name, command);
  }

  return { commands };
}
