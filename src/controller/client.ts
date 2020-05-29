import Discord from "discord.js";
import { Command } from "./command";
import config from "../config/config";

class Client extends Discord.Client {
  public config = config;
  public commands: Discord.Collection<string, Command>;

  constructor(
    public commandInfo: {
      commands: Discord.Collection<string, Command>;
    }
  ) {
    super();

    this.commands = commandInfo.commands;
  }
}

export default Client;
