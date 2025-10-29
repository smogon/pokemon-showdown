import { ImpulseDB } from '../../impulse-db';
import type { Document } from 'mongodb';
import type {
	Clan,
	UserClanInfo,
	ClanLog,
	ClanPointsLogEntry,
	ClanBankLogEntry,
} from './interface';

export type ClanDoc = Omit<Clan, 'id'> & { _id: ID } & Document;
export type UserClanDoc = UserClanInfo & { _id: ID } & Document;
export type ClanLogDoc = ClanLog & { clanId: ID } & Document;
export type ClanPointsLogDoc = ClanPointsLogEntry & { clanId: ID } & Document;

export const Clans = ImpulseDB<ClanDoc>('clans');
export const UserClans = ImpulseDB<UserClanDoc>('userclans');
export const ClanLogs = ImpulseDB<ClanLogDoc>('clanlogs');
export const ClanPointsLogs = ImpulseDB<ClanPointsLogDoc>('clanpointslsogs');
