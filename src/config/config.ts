require("dotenv/config");
import config from "./config.json";
import presence from "./presence.json";

export default {
  prefix: config.prefix,
  token: process.env.TOKEN,
  channelWhitelist: config.channelWhilelist,
  logsChannel: config.logsChannel,
  serverLogs: config.serverLogs,
  roles: config.roles,
  embedColor: "#82a1e1",
  guild: config.guild,
  presence,
};
