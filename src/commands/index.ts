import { Command } from "../controller/command";

import kickCommand from "./kick";
import BanComamnd from "./ban";
import LockdownCommand from "./lockdown";
import PurgeCommand from "./purge";
import MuteCommand from "./mute";

const commands: Command[] = [
  kickCommand,
  BanComamnd,
  LockdownCommand,
  PurgeCommand,
  MuteCommand,
];

export default commands;
