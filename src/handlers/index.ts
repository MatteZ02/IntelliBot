import debux from "debux";
import Client from "../base/Client";
import roleConfig from "../config/roleConfig.json";

import ready from "./ready";
import message from "./msg";
import interactionCreate from "./interactionCreate";
import { activePunishment, punishments } from "../base/DataBase";

export default function eventHandler(client: Client) {
    client
        .on("ready", () => ready(client))
        .on("message", msg => message(msg, client))
        .on("interactionCreate", interaction => {
            interactionCreate(interaction, client);
        })
        .on("messageDelete", msg => {})
        .on("guildMemberAdd", async member => {
            let memberData = await client.database.getData("users", {
                _id: member?.id as string
            });
            if (!memberData) return;
            client.database.insertData(member?.id as string);

            const mutes = (await client.database.db
                ?.collection("punishments")
                .findOne({ type: "mutes" })) as punishments;
            if (mutes.active.find((mute: activePunishment) => isEqual(mute, { user: member.id })))
                member.roles.add(roleConfig.muted);
        })
        .on("error", err => {
            console.error(err);
        })
        .on("log", info => {
            if (client.config.local) console.log(info);
        })
        .on("invalidated", () => {
            console.log(
                `${new Date().toUTCString()} | Shard: ${
                    client.shard?.ids
                } | Client session invalidated. Exiting the process!`
            );
            process.exit(1);
        })
        .on("warn", info => {
            debux().warn(`Warning! info: ${info}`, {
                process: `shard: ${client.shard?.ids}`,
                event: "warn"
            });
        });
}

function isEqual(obj1: any, obj2: any) {
    const propnames = Object.getOwnPropertyNames(obj1);

    for (const propname of propnames) {
        if (obj1[propname] === obj2[propname]) return true;
    }

    return false;
}
