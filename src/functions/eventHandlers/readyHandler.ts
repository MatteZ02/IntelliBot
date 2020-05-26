import Discord from "discord.js";
import Client from "../../controller/Client";
import logs from "../modules/logs";

export default async function readyHandler(client: Client) {
  console.log("Ready!");
  if (client.user)
    client.user.setPresence({
      status: "dnd",
      afk: true,
      activity: {
        name: "Musix Support",
        type: "STREAMING",
        url: "https://www.twitch.tv/Mattez02",
      },
    });
  logs(client);
}
