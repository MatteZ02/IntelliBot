"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(commandProps) {
        this.name = commandProps.name;
        this.usage = commandProps.usage;
        this.description = commandProps.description;
        this.execute = commandProps.execute;
    }
}
exports.Command = Command;
