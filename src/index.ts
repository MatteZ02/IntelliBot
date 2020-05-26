import Client from "./controller/client";
import { getCommands } from "./functions/utils/getCommands";
import Discord from "discord.js";

import messageHandler from "./functions/eventHandlers/messageHandler";
import readyHandler from "./functions/eventHandlers/readyHandler";

const client = new Client(getCommands());

client.on("message", (message: Discord.Message) =>
  messageHandler(message, client)
);
client.on("ready", () => readyHandler(client));

client.login(client.config.token);
