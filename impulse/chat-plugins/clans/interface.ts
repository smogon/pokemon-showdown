export type DefaultClanRankID = 'owner' | 'leader' | 'officer' | 'member';
export type ClanPermission =
	| 'canInvite'
	| 'canDeinvite'
	| 'canKick'
	| 'canPromote'
	| 'canDemote'
	| 'canEditDesc'
	| 'canEditIcon'
	| 'canEditTag'
	| 'canSetMotw'
	| 'canManageChat'
	| 'canBankWithdraw'
	| 'canBankDeposit'
	| 'canManageAllies'
	| 'canManageRivals'
	| 'canEditRanks'

export interface ClanPermissions {
	[key in ClanPermission]?: boolean;
}

export interface CustomClanRank {
	id: ID;
	name: string;
	permissionLevel: number;
	permissions: ClanPermissions;
}

export interface ClanInvite {
	userid: ID;
	actor: ID;
	timestamp: number;
}

export interface ClanMember {
	rank: ID;
	joinDate: number;
	totalPointsContributed: number;
	nickname?: string;
}

export interface ClanStats {
	tourWins: number;
	eventWins: number;
	totalPointsEarned: number;
}

export interface Clan {
	id: ID;
	name:string;
	tag: string;
	owner: ID;
	members: {
		[userid: string]: ClanMember;
	};
	ranks: {
		[rankId: string]: CustomClanRank;
	};
	created: number;
	desc: string;
	memberOfTheWeek: ID;
	inviteOnly: boolean;
	invites: ClanInvite[];
	points: number;
	level: number;
	bank: number;
	chatRoom: ID;
	icon: string;
	lastActive: number;
	allies: ID[];
	rivals: ID[];
	stats: ClanStats;
}

export interface ClanData {
	[clanId: string]: Clan;
}

export interface UserClanInfo {
	memberOf?: ID;
	invites?: ID[];
}

export interface UserClanData {
	[userid: string]: UserClanInfo;
}

export type ClanLogType =
	| 'CREATE'
	| 'DELETE'
	| 'JOIN'
	| 'LEAVE'
	| 'KICK'
	| 'INVITE'
	| 'DEINVITE'
	| 'PROMOTE'
	| 'DEMOTE'
	| 'SET_MOTW'
	| 'SET_DESC'
	| 'SET_TAG'
	| 'SET_ICON'
	| 'SET_INVITEONLY'
	| 'CHATROOM_SET'
	| 'ALLY_ADD'
	| 'ALLY_REMOVE'
	| 'RIVAL_ADD'
	| 'RIVAL_REMOVE'
	| 'RANK_CREATE'
	| 'RANK_DELETE'
	| 'RANK_EDIT';

export interface ClanLog {
	timestamp: number;
	actor: ID;
	action: ClanLogType;
	target?: ID;
	oldValue?: string | number | boolean;
	newValue?: string | number | boolean;
	note?: string;
}

export interface ClanLogs {
	[clanId: string]: ClanLog[];
}

export interface ClanFinancialLogEntry {
	timestamp: number;
	userid: ID;
	actor: ID;
	amount: number;
	reason: string;
}

export type ClanPointsLogEntry = ClanFinancialLogEntry;
export interface ClanPointsLogs {
	[clanId: string]: ClanPointsLogEntry[];
}

export type ClanBankLogEntry = ClanFinancialLogEntry;
export interface ClanBankLogs {
	[clanId: string]: ClanBankLogEntry[];
}
