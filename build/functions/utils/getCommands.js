"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommands = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const index_1 = __importDefault(require("../../commands/index"));
/**
 * Returns a collection of all the commands.
 */
function getCommands() {
    const commands = new discord_js_1.default.Collection();
    const commandAliases = new discord_js_1.default.Collection();
    for (const command of index_1.default) {
        commands.set(command.name, command);
    }
    return { commands, commandAliases };
}
exports.getCommands = getCommands;
