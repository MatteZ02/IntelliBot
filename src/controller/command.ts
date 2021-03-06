import Discord from "discord.js";
import Client from "./BaseClient";

interface CommandProps {
  name: string;
  execute: (msg: Discord.Message, args: string[], client: Client) => void;
}

export default class Command {
  public name: string;
  public permission?: Discord.PermissionString;
  public execute: (
    msg: Discord.Message,
    args: string[],
    client: Client
  ) => void;
  constructor(commandProps: CommandProps) {
    this.name = commandProps.name;
    this.execute = commandProps.execute;
  }
}
