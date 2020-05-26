"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./controller/Client"));
const getCommands_1 = require("./functions/utils/getCommands");
const messageHandler_1 = __importDefault(require("./functions/EventHandlers/messageHandler"));
const readyHandler_1 = __importDefault(require("./functions/EventHandlers/readyHandler"));
const client = new Client_1.default(getCommands_1.getCommands());
client.on("message", (message) => messageHandler_1.default(message, client));
client.on("ready", () => readyHandler_1.default(client));
client.login(client.config.token);
