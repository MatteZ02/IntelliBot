import Discord, { PermissionString } from "discord.js";
import MusixClient from "./client";

interface CommandProps {
  name: string;
  usage: string;
  description: string;
  execute: (msg: Discord.Message, args: string[], client: MusixClient) => void;
}

export class Command {
  public name: string;
  public usage: string;
  public description: string;
  public permission?: Discord.PermissionString;
  public execute: (
    msg: Discord.Message,
    args: string[],
    client: MusixClient
  ) => void;
  constructor(commandProps: CommandProps) {
    this.name = commandProps.name;
    this.usage = commandProps.usage;
    this.description = commandProps.description;
    this.execute = commandProps.execute;
  }
}
