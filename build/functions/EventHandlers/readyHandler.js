"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function readyHandler(client) {
    console.log("Ready!");
    if (client.user)
        client.user.setPresence({
            status: "dnd",
            afk: true,
            activity: {
                name: "Musix Support",
                type: "STREAMING",
                url: "https://www.twitch.tv/Mattez02",
            },
        });
}
exports.default = readyHandler;
