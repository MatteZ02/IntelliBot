import Discord from "discord.js";
import Client from "../base/Client";

export default async function messageHandler(msg: Discord.Message, client: Client): Promise<void> {
    let memberData = await client.database.getData("users", { _id: msg.member?.id as string });
    if (!memberData) {
        client.database.insertData(msg.member?.id as string);
        memberData = {
            _id: msg.member?.id as string,
            warnings: [],
            mutes: [],
            kicks: [],
            bans: []
        };
    }
}
