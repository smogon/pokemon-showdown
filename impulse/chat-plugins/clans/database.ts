/*
* Pokemon Showdown - Impulse Server
* Clans Database & Types
* @author PrinceSky-Git
*/
import { ImpulseDB } from '../../impulse-db';
import type { Document } from 'mongodb';
import type {
	Clan,
	UserClanInfo,
	ClanLog,
	ClanPointsLogEntry,
	ClanBattleLogEntry,
	ClanWar,
} from './interface';

export type ClanDoc = Omit<Clan, 'id'> & { _id: ID } & Document;
export type UserClanDoc = UserClanInfo & { _id: ID } & Document;
export type ClanLogDoc = ClanLog & { clanId: ID } & Document;
export type ClanPointsLogDoc = ClanPointsLogEntry & { clanId: ID } & Document;
export type ClanBanDoc = { _id: ID, banned: boolean } & Document;
export type ClanBattleLogDoc = ClanBattleLogEntry & Document;
export type ClanWarDoc = ClanWar & Document;

export const Clans = ImpulseDB<ClanDoc>('clans');
export const UserClans = ImpulseDB<UserClanDoc>('userclans');
export const ClanLogs = ImpulseDB<ClanLogDoc>('clanlogs');
export const ClanPointsLogs = ImpulseDB<ClanPointsLogDoc>('clanpointslogs');
export const ClanBans = ImpulseDB<ClanBanDoc>('clanbans');
export const ClanBattleLogs = ImpulseDB<ClanBattleLogDoc>('clanbattlelogs');
export const ClanWars = ImpulseDB<ClanWarDoc>('clanwars');
