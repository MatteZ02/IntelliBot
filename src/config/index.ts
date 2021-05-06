require("dotenv/config");
import config from "./config.json";
import presence from "./presence.json";

export default {
    databaseURL: process.env.DATABASE_URL,
    databaseName: process.env.DATABASE_NAME,
    token: process.env.DISCORD_TOKEN,
    userId: process.env.USER_ID,
    config,
    presence,
    local: true,
};
