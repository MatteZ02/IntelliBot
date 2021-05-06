import Discord, { TextChannel } from "discord.js";
import Client from "../base/Client";
import { ApplicationCommand } from "discord-slash-commands-client";
import createCommands from "../struct/utils/createCommands";
import { punishments } from "../base/DataBase";
import roleConfig from "../config/roleConfig.json";

export default async function readyHandler(client: Client): Promise<void> {
    console.log("Ready!");
    client.guild =
        client.guilds.cache.get(client.config.config.guild) ??
        (await client.guilds.fetch(client.config.config.guild)) ??
        null;
    const commands = await client.interactions.getCommands({ guildID: client.config.config.guild });
    if ((commands as ApplicationCommand[]).length < client.commands.size) createCommands(client);
    client.user?.setPresence(client.config.presence as Discord.PresenceData);
    setInterval(async function() {
        const muteData = (await client.database.getData("punishments", {
            type: "mutes"
        })) as punishments;
        const banData = (await client.database.getData("punishments", {
            type: "bans"
        })) as punishments;
        for (const mute of muteData.active) {
            if (mute.expires < Date.now()) {
                const member =
                    client.guild?.members.cache.get(mute.user) ??
                    (await client.guild?.members.fetch(mute.user));
                (client.channels.cache.get(client.config.config.logChannel) as TextChannel)?.send(
                    new Discord.MessageEmbed()
                        .setTitle("Unmute")
                        .setDescription(
                            `${
                                client.guild?.members.cache.get(mute.user)?.user.tag
                            } have been unmuted.`
                        )
                        .setColor(client.config.config.embedColor)
                );
                member?.roles.remove(roleConfig.muted);
                muteData.active.splice(muteData.active.indexOf(mute), 1);
                client.database.updateData(
                    "punishments",
                    { type: "mutes" },
                    { active: muteData.active }
                );
            }
        }

        for (const ban of banData.active) {
            if (ban.expires < Date.now()) {
                (client.channels.cache.get(client.config.config.logChannel) as TextChannel)?.send(
                    new Discord.MessageEmbed()
                        .setTitle("Unmute")
                        .setDescription(
                            `${
                                client.guild?.members.cache.get(ban.user)?.user.tag
                            } have been unbanned.`
                        )
                        .setColor(client.config.config.embedColor)
                );
                client.guild?.members.unban(ban.user, "tempban expired");
                client.database.updateData(
                    "punishments",
                    { type: "bans" },
                    { active: banData.active }
                );
            }
        }
    }, 10000);
}
