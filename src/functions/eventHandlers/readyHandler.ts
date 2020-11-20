import Discord from "discord.js";
import Client, {
  MuteData,
  TempBanData,
  WarnData,
} from "../../controller/BaseClient";
import logs from "../modules/logs";

export default async function readyHandler(client: Client): Promise<void> {
  client.getDB("mutes").then((data) => {
    if (typeof data === "string" || data instanceof String) return;
    data.forEach((data) => {
      client.global.db.mutes[data.id] = data.d as MuteData;
    });
  });
  client.getDB("warnings").then((data) => {
    if (typeof data === "string" || data instanceof String) return;
    data.forEach((data) => {
      client.global.db.warnings[data.id] = data.d as WarnData;
    });
  });
  client.getDB("bans").then((data) => {
    if (typeof data === "string" || data instanceof String) return;
    data.forEach((data) => {
      client.global.db.bans[data.id] = data.d as TempBanData;
    });
  });
  console.log("Ready!");
  client.user?.setPresence(client.config.presence as Discord.PresenceData);
  setInterval(function () {
    const timeDate = Date.now();
    client.global.db.bans["users"].ids?.forEach((id) => {
      if (id === "users") return;
      if (client.global.db.bans[id].expire <= timeDate) {
        client.guilds.cache
          .get(client.config.guild)
          ?.members.unban(id, "tempban time expired");
        client.global.db.bans["users"].ids?.splice(
          client.global.db.bans["users"].ids?.indexOf(id),
          1
        );
        delete client.global.db.bans[id];
        client.db.collection("bans").doc(id).delete();
      }
    });
    client.global.db.mutes["users"].ids?.forEach((id) => {
      if (id === "users") return;
      if (client.global.db.mutes[id].time <= timeDate) {
        client.guilds.cache
          .get(client.config.guild)
          ?.members.cache.get(id)
          ?.roles.remove(client.config.roles.muted);
        client.global.db.mutes["users"].ids?.splice(
          client.global.db.mutes["users"].ids?.indexOf(id),
          1
        );
        delete client.global.db.mutes[id];
        client.db.collection("mutes").doc(id).delete();
      }
    });
  }, 10000);
  setInterval(function () {
    client.db.collection("mutes").doc("users").set({
      ids: client.global.db.mutes["users"].ids,
    });
    client.db.collection("warnings").doc("users").set({
      ids: client.global.db.warnings["users"].ids,
    });
    client.db.collection("bans").doc("users").set({
      ids: client.global.db.bans["users"].ids,
    });
    client.global.db.warnings["users"].ids?.forEach((id) => {
      client.db
        .collection("warnings")
        .doc(id)
        .set(client.global.db.warnings[id]);
    });
  }, 60000);
  logs(client);
}
