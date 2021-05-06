import Client from "./base/Client";
import { getCommands } from "./struct/utils/getCommands";

const client = new Client(getCommands());

client.login(client.config.token);
