// modules
import Discord from "discord.js";
import interactions from "discord-slash-commands-client";

// base
import DataBase from "./DataBase";
import Punisher from "./Punisher";

// classes
import Command from "../struct/classes/Command";

// configs
import config from "../config";

// handlers
import handler from "../handlers";

// functions

interface funcs {}

const GatewayIntents = new Discord.Intents();
GatewayIntents.add(
    1 << 0, // GUILDS
    1 << 9 // GUILD_MESSAGES
);

class Client extends Discord.Client {
    public ready: boolean;
    public guild: Discord.Guild | null;
    readonly config = config;
    readonly database: DataBase;
    readonly interactions: interactions.Client;
    readonly punisher: Punisher;
    readonly funcs: funcs;
    readonly commands: Discord.Collection<string, Command>;
    constructor(
        public commandInfo: {
            commands: Discord.Collection<string, Command>;
        }
    ) {
        super({
            intents: GatewayIntents
        });

        this.log("BaseClient - initializing");
        this.database = new DataBase(this);
        this.interactions = new interactions.Client(
            config.token as string,
            config.userId as string
        );
        this.punisher = new Punisher(this);

        this.ready = false;
        this.guild = null;

        this.commands = commandInfo.commands;

        this.funcs = {};

        handler(this);
    }

    public log(info: string): void {
        this.emit("log", `${new Date().toUTCString()} | ${info}`);
    }
}

export default Client;
