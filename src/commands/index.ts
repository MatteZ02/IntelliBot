import Command from "../struct/classes/Command";

import DeleteCommand from "./delete";
import infractionCommand from "./infraction";
import punishCommand from "./punish";

const commands: Command[] = [
    DeleteCommand,
    infractionCommand,
    punishCommand,
];

export default commands;
