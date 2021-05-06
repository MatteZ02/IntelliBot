import mongodb from "mongodb";
import Client from "./Client";

export enum reason {
    inv_link = "invite link(s)",
    ads = "advertising",
    discrimination = "discrimination",
    racism = "racism",
    nsfw_link = "nsfw link",
    nsfw_image = "nsfw image",
    nsfw_talk = "nsfw talk",
    nsfw_general = "nsfw",
    swearing = "swearing",
    ghost_ping = "ghost pinging",
    cont_ping = "constantly pinging",
    mass_ping = "mass pinging",
    spam = "spam",
    emoji_spam = "emoji spam",
    gifImage_spam = "gif/image spam",
    disrespect = "disrespect",
    offtopic = "going off topic",
    toxicity = "toxicity",
    other = "other"
}

interface infraction {
    reason: reason;
    detailedReason: string | null;
    timestamp: number;
    author: string;
}
export interface Member {
    _id: string; // user id
    warnings: infraction[];
    mutes: infraction[];
    kicks: infraction[];
    bans: infraction[];
}

export interface punishments {
    type: "mutes" | "bans";
    active: activePunishment[];
}

export interface activePunishment {
    user: string;
    expires: number;
}

interface setPunishmentData {
    type?: "mutes" | "bans";
    active?: activePunishment[];
}

interface setUserData {
    _id?: string;
    warnings?: infraction[];
    mutes?: infraction[];
    kicks?: infraction[];
    bans?: infraction[];
}

class DataBase {
    public db: mongodb.Db | null;
    constructor(private client: Client) {
        this.db = null;
        this.setConnection();
    }

    private async connect(): Promise<mongodb.MongoClient> {
        return new Promise(resolve => {
            const MongoClient = new mongodb.MongoClient(this.client.config.databaseURL as string, {
                useUnifiedTopology: true
            });
            MongoClient.connect(function(err, client) {
                if (err) {
                    console.log(err);
                    resolve(client);
                    return;
                }
                resolve(client);
            });
        });
    }

    public async setConnection(): Promise<void> {
        const dbClient = await this.connect();
        this.db = dbClient.db();
    }

    public async getData(
        collection: "users" | "punishments",
        data: { _id: string } | { type: "mutes" | "bans" }
    ): Promise<Member | punishments> {
        return await this.db?.collection(collection).findOne(data);
    }

    public async updateData(
        collection: "users" | "punishments",
        data: { _id: string } | { type: "mutes" | "bans" },
        set: setUserData | setPunishmentData
    ) {
        this.db?.collection(collection).findOneAndUpdate(data, { $set: set });
    }

    public async insertData(userId: string) {
        this.db?.collection("users").insertOne({
            _id: userId,
            warnings: [],
            mutes: [],
            kicks: [],
            bans: []
        });
    }
}

export default DataBase;
