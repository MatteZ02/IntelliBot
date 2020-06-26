import { Command } from "../controller/command";

import kickCommand from "./kick";
import BanComamnd from "./ban";
import LockdownCommand from "./lockdown";
import PurgeCommand from "./purge";
import MuteCommand from "./mute";
import AddroleCommand from "./addrole";
import RemoveroleCommand from "./removerole";

const commands: Command[] = [
  kickCommand,
  BanComamnd,
  LockdownCommand,
  PurgeCommand,
  MuteCommand,
  AddroleCommand,
  RemoveroleCommand
];

export default commands;
