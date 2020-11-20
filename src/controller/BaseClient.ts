import Discord from "discord.js";
import admin from "firebase-admin";
import Command from "./command";
import config from "../config/config";
import * as serviceAccount from "../config/serviceAccount.json";

import fetchMember from "../functions/funcs/fetchMember";

const gatewayIntents = new Discord.Intents();
gatewayIntents.add(
  1 << 0, // GUILDS
  1 << 1, // GUILD_MEMBERS
  1 << 2, // GUILD_BANS
  1 << 9 // GUILD_MESSAGES
);

export interface TempBanData {
  ids: Array<string> | null;
  expire: number;
}
export interface MuteData {
  ids: Array<string> | null;
  time: number;
  reason: string;
  mutedFor: number;
}

export interface Warning {
  reason: string;
  author: string;
  timestamp: number;
}

export interface WarnData {
  ids: Array<string> | null;
  warnings: Array<Warning>;
}

interface funcs {
  fetchMember: typeof fetchMember;
}

class Client extends Discord.Client {
  public global: {
    db: {
      mutes: {
        [userid: string]: MuteData;
      };
      warnings: {
        [userid: string]: WarnData;
      };
      bans: {
        [userid: string]: TempBanData;
      };
    };
  };
  readonly db: FirebaseFirestore.Firestore;
  readonly config = config;
  readonly commands: Discord.Collection<string, Command>;
  readonly funcs: funcs;
  constructor(
    public commandInfo: {
      commands: Discord.Collection<string, Command>;
    }
  ) {
    super({
      ws: {
        intents: gatewayIntents,
      },
    });

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: "",
    });

    this.db = admin.firestore();
    this.commands = commandInfo.commands;
    this.global = {
      db: { mutes: {}, warnings: {}, bans: {} },
    };
    this.funcs = {
      fetchMember,
    };
  }
  async getDB(
    collection: string
  ): Promise<
    | Array<{
        id: string;
        d: MuteData | WarnData | TempBanData;
      }>
    | string
  > {
    return this.db
      .collection(collection)
      .get()
      .then((data) => {
        const finalD: {
          id: string;
          d: MuteData | WarnData | TempBanData;
        }[] = [];
        data.forEach((doc) => {
          finalD.push({
            id: doc.id,
            d: doc.data() as MuteData | WarnData | TempBanData,
          });
        });
        return finalD;
      })
      .catch((err) => {
        console.log("Error getting document", err);
        return "error";
      });
  }
}

export default Client;
