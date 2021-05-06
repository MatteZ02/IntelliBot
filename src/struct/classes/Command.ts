import { ApplicationOptions } from "discord-slash-commands-client";
import Discord from "discord.js";
import Client from "../../base/Client";

interface CommandProps {
    name: string;
    permissions?: {
        admin?: boolean
        mod?: boolean
        support?: boolean
        helper?: boolean
    };
    data: ApplicationOptions;
    execute: (msg: Discord.Interaction, client: Client) => void;
}

export default class Command {
    readonly name: string;
    readonly permissions: {
        admin?: boolean;
        mod?: boolean;
        support?: boolean;
        helper?: boolean;
    };
    readonly data: ApplicationOptions;
    public execute: (msg: Discord.Interaction, client: Client) => void;
    constructor(commandProps: CommandProps) {
        this.name = commandProps.name;
        this.data = commandProps.data;
        this.permissions = commandProps.permissions ?? {};
        this.execute = commandProps.execute;
    }
}
