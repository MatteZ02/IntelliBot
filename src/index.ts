import Client from "./controller/Client";
import { getCommands } from "./functions/utils/getCommands";

import messageHandler from "./functions/EventHandlers/messageHandler";
import readyHandler from "./functions/EventHandlers/readyHandler";

const client = new Client(getCommands());

client.on("message", (message) => messageHandler(message, client));
client.on("ready", () => readyHandler(client));

client.login(client.config.token);
