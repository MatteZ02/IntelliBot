import Command from "../controller/command";

import kickCommand from "./kick";
import BanComamnd from "./ban";
import DeleteCommand from "./delete";
import DelwarnCommand from "./delwarn";
import HelpCommand from "./help";
import LockdownCommand from "./lockdown";
import PurgeCommand from "./purge";
import MuteCommand from "./mute";
import AddroleCommand from "./addrole";
import RemoveroleCommand from "./removerole";
import TempbanCommand from "./tempban";
import EvalCommand from "./eval";
import UnmuteCommand from "./unmute";
import WarnCommand from "./warn";
import WwarningsCommand from "./warnings";

const commands: Command[] = [
  kickCommand,
  BanComamnd,
  DeleteCommand,
  DelwarnCommand,
  HelpCommand,
  LockdownCommand,
  PurgeCommand,
  MuteCommand,
  AddroleCommand,
  RemoveroleCommand,
  TempbanCommand,
  EvalCommand,
  UnmuteCommand,
  WarnCommand,
  WwarningsCommand,
];

export default commands;
