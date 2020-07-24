import Discord from "discord.js";
import admin from "firebase-admin";
import { Command } from "./command";
import config from "../config/config";
import * as serviceAccount from "../config/serviceAccount.json";

const gatewayIntents = new Discord.Intents();
gatewayIntents.add(
  1 << 0, // GUILDS
  1 << 1, // GUILD_MEMBERS
  1 << 2, // GUILD_BANS
  1 << 9 // GUILD_MESSAGES
);

export interface MuteData {
  ids: Array<string> | null;
  time: number;
  reason: string;
  mutedFor: number;
}

export interface WarnData {
  ids: Array<string> | null;
  warnings: number;
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
    };
  };
  public db: FirebaseFirestore.Firestore;
  public config = config;
  public commands: Discord.Collection<string, Command>;
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
      databaseURL: config.databaseURL,
    });

    this.db = admin.firestore();
    this.commands = commandInfo.commands;
    this.global = {
      db: { mutes: {}, warnings: {} },
    };
  }
  async getDB(collection: string) {
    return this.db
      .collection(collection)
      .get()
      .then((data) => {
        const finalD: { id: string; d: MuteData | WarnData }[] = [];
        data.forEach((doc) => {
          finalD.push({
            id: doc.id,
            d: doc.data() as MuteData | WarnData,
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
