import Discord from "discord.js";
import admin from "firebase-admin";
import { Command } from "./command";
import config from "../config/config";
import * as serviceAccount from "../config/serviceAccount.json";

const myIntents = new Discord.Intents();
myIntents.add(
  1 << 0, // GUILDS
  1 << 1, // GUILD_MEMBERS
  1 << 2, // GUILD_BANS
  1 << 9 // GUILD_MESSAGES
);

export interface Data {
  ids: Array<string> | undefined;
  time: number;
  reason: string;
  mutedFor: number;
}

class Client extends Discord.Client {
  public global: {
    db: {
      mutes: {
        [userid: string]: Data;
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
        intents: myIntents,
      },
    });

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: "https://intellibot-669be.firebaseio.com",
    });

    this.db = admin.firestore();
    this.commands = commandInfo.commands;
    this.global = {
      db: { mutes: {} },
    };
  }
  async getDB(collection: string) {
    return this.db
      .collection(collection)
      .get()
      .then((data) => {
        const finalD: { id: string; d: Data }[] = [];
        data.forEach((doc) => {
          finalD.push({
            id: doc.id,
            d: doc.data() as Data,
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
