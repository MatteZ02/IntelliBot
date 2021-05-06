import { ApplicationCommandPermissions } from "discord-slash-commands-client";
import Client from "../../base/Client";
import roles from "../../config/roleConfig.json";
import Command from "../classes/Command";

export default function (client: Client): void {
    client.commands.forEach(async (comm) => {
        const command = await client.interactions.createCommand(
            comm.data,
            client.config.config.guild
        ).catch(console.log);
        if (command)
        client.interactions.editCommandPermissions(
            getCommandPermissions(comm),
            client.config.config.guild,
            command.id
        );
    });
}

function getCommandPermissions(command: Command): ApplicationCommandPermissions[] {
    const final: ApplicationCommandPermissions[] = [];

    if (command.permissions.admin) final.push({ id: roles.admin, type: 1, permission: true });
    if (command.permissions.mod) final.push({ id: roles.mod, type: 1, permission: true });
    if (command.permissions.support) final.push({ id: roles.support, type: 1, permission: true });
    if (command.permissions.helper) final.push({ id: roles.helper, type: 1, permission: true });

    return final;
}
