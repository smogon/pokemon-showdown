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
import {Teams as TeamsType} from '../sim/teams';

declare global {
	namespace NodeJS {
		interface Global {
			Config: any;
			Chat: any;
			Dex: any;
			Teams: any;
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
	var Config: ConfigType;
	var Chat: typeof ChatType.Chat;
	var Dex: typeof DexType;
	var Teams: typeof TeamsType;
	var IPTools: typeof IPToolsType;
	var Ladders: typeof LaddersType;
	var LoginServer: typeof LoginServerType;
	var Monitor: typeof MonitorType;
	var Punishments: typeof PunishmentsType;
	var Rooms: typeof RoomsType.Rooms;
	var Sockets: typeof SocketsType.Sockets;
	var TeamValidatorAsync: typeof TeamValidatorAsyncType;
	var Tournaments: typeof TournamentsType;
	var Users: typeof UsersType.Users;
	var Verifier: typeof VerifierType;
	var toID: typeof DexType.toID;
}
