import * as ChatType from './chat';
import * as RoomsType from './rooms';
import * as SocketsType from './sockets';
import * as TeamValidatorAsyncType from './team-validator-async';
import * as UsersType from './users';
import * as VerifierType from './verifier';

import {ConfigType} from "../server/config-loader";

import {IPTools as IPToolsType} from './ip-tools';
import {Ladders as LaddersType} from './ladders';
import {LoginServer as LoginServerType} from './loginserver';
import {Monitor as MonitorType} from './monitor';
import {Punishments as PunishmentsType} from './punishments';
import {Tournaments as TournamentsType} from './tournaments';

import {Dex as DexType} from '../sim/dex';

declare global {
	namespace NodeJS {
		interface Global {
			Config: any;
			Chat: any;
			Dex: any;
			IPTools: any;
			Ladders: any;
			LoginServer: any;
			Monitor: any;
			nodeOomHeapdump: any;
			Punishments: any;
			Rooms: any;
			Sockets: any
			TeamValidatorAsync: any;
			Tournaments: any;
			Users: any;
			Verifier: any;
			toID: (item: any) => ID;
			__version: {head: string, origin?: string, tree?: string};
		}
	}
	const Config: ConfigType;
	const Chat: typeof ChatType.Chat;
	const Dex: typeof DexType;
	const IPTools: typeof IPToolsType;
	const Ladders: typeof LaddersType;
	const LoginServer: typeof LoginServerType;
	const Monitor: typeof MonitorType;
	const Punishments: typeof PunishmentsType;
	const Rooms: typeof RoomsType.Rooms;
	const Sockets: typeof SocketsType.Sockets;
	const TeamValidatorAsync: typeof TeamValidatorAsyncType;
	const Tournaments: typeof TournamentsType;
	const Users: typeof UsersType.Users;
	const Verifier: typeof VerifierType;
	const toID: typeof DexType.toID;
}
