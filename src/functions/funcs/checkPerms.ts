import Discord from "discord.js";
import Client from "../../controller/BaseClient";

export default async function (
  client: Client,
  member: Discord.GuildMember,
  permissions: "admin" | "mod" | "support" | "helper"
): Promise<boolean> {
  return new Promise((resolvePromise) => {
    let found = false;
    const pass = () => {
      resolvePromise(true);
      found = true;
    };
    switch (permissions) {
      case "admin":
        member.roles.cache.forEach((role) => {
          console.log(role.id);
          if (client.config.roles.admin.includes(role.id)) return pass();
        });
        break;
      case "mod":
        member.roles.cache.forEach((role) => {
          if (
            client.config.roles.admin.includes(role.id) ||
            client.config.roles.mod.includes(role.id)
          )
            return pass();
        });
        break;
      case "support":
        member.roles.cache.forEach((role) => {
          if (
            client.config.roles.admin.includes(role.id) ||
            client.config.roles.mod.includes(role.id) ||
            client.config.roles.support.includes(role.id)
          )
            return pass();
        });
        break;
      case "helper":
        member.roles.cache.forEach((role) => {
          if (
            client.config.roles.admin.includes(role.id) ||
            client.config.roles.mod.includes(role.id) ||
            client.config.roles.support.includes(role.id) ||
            client.config.roles.helper.includes(role.id)
          )
            return pass();
        });
        break;

      default:
        resolvePromise(false);
        break;
    }
    if (!found) resolvePromise(false);
  });
}
