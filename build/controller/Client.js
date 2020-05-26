"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const config_1 = __importDefault(require("../config/config"));
class Client extends discord_js_1.default.Client {
    constructor(commandInfo) {
        super();
        this.commandInfo = commandInfo;
        this.config = config_1.default;
        this.commands = commandInfo.commands;
    }
}
exports.default = Client;
