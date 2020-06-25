import Client, { Data } from "../../controller/client";
import logs from "../modules/logs";

interface readyGuildData extends Data {
  d: Data;
  id: string;
}

export default async function readyHandler(client: Client) {
  client.getDB("mutes").then((data) => {
    if (typeof data === "string" || data instanceof String) return;
    data.forEach((data) => {
      client.global.db.mutes[data.id] = data.d;
    });
  });
  console.log("Ready!");
  client.user?.setPresence({
    status: "dnd",
    afk: true,
    activity: {
      name: "Musix Support",
      type: "STREAMING",
      url: "https://www.twitch.tv/Mattez02",
    },
  });
  setInterval(function () {
    const timeDate = Date.now();
    client.global.db.mutes["users"].ids?.forEach((user) => {
      if (user === "users") return;
      if (client.global.db.mutes[user].time <= timeDate) {
        client.guilds.cache
          .get("583597555095437312")
          ?.members.cache.get(user)
          ?.roles.remove("608365682291376128");
        const index = client.global.db.mutes.users.ids?.indexOf(user);
        client.global.db.mutes.users.ids?.splice(index!, 1);
        delete client.global.db.mutes[user];
        client.db.collection("mutes").doc(user).delete();
      }
    });
  }, 60000);
  setInterval(function () {
    client.db.collection("mutes").doc("users").set({
      ids: client.global.db.mutes.users.ids,
    });
  }, 60000);
  logs(client);
}
