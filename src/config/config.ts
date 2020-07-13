require("dotenv/config");

export default {
  prefix: "-",
  token: process.env.TOKEN,
  databaseURL: process.env.DATABASE_URL,
  webHookUrl:
    "https://discordapp.com/api/webhooks/715899176730492928/R1fHLkSAPZiYTLituVgVPh6Y9OzU2PSRsJrZDjPIMIxa9iPRGrOH7WvMydZ-CVWg79pY",
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
};
