require("dotenv/config");

export default {
  prefix: "-",
  token: process.env.TOKEN,
  databaseURL: process.env.DATABASE_URL,
  channelWhitelist: [
    "583601892257693746",
    "700265375073304588",
    "617633098296721409",
    "704683075078193212",
    "632266466707767309",
    "633570377439903755",
  ],
  logsChannel: "714875827166380122",
  roles: {
    devs: "583599235950313472",
    admin: "583600027403026432",
    mod: "583601716088406017",
    supportTeam: "608683224956272663",
  },
  embedColor: "#82a1e1",
};
