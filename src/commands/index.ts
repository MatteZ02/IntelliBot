import { Command } from "../controller/Command";

import kickCommand from "./kick";
import BanComamnd from "./ban";
import DeleteCommand from "./delete";
import LockdownCommand from "./lockdown";
import PurgeCommand from "./purge";
import MuteCommand from "./mute";
import AddroleCommand from "./addrole";
import RemoveroleCommand from "./removerole";
import EvalCommand from "./eval";
import UnmuteCommand from "./unmute";
import WarnCommand from "./warn";

const commands: Command[] = [
  kickCommand,
  BanComamnd,
  DeleteCommand,
  LockdownCommand,
  PurgeCommand,
  MuteCommand,
  AddroleCommand,
  RemoveroleCommand,
  EvalCommand,
  UnmuteCommand,
  WarnCommand,
];

export default commands;
