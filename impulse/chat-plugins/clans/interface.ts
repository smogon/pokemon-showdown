export type DefaultClanRankID = 'owner' | 'leader' | 'officer' | 'member';
export type ClanPermission =
	| 'canInvite' | 'canDeinvite' | 'canKick' |
	'canPromote' | 'canDemote' | 'canEditDesc' |
	'canEditIcon' | 'canEditTag' | 'canSetMotw' |
	'canManageChat' | 'canEditRanks' | 'canAnnounce' | 'canWar';

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
}

export interface ClanStats {
	tourWins: number;
	eventWins: number;
	totalPointsEarned: number;
	clanBattleWins: number;
	clanBattleLosses: number;
	elo: number;
	lastWarChallenge?: number;
}

export interface Clan {
	id: ID;
	name: string;
	tag: string;
	owner: ID;
	members: {
		[userid: string]: ClanMember,
	};
	ranks: {
		[rankId: string]: CustomClanRank,
	};
	created: number;
	desc: string;
	memberOfTheWeek: ID;
	inviteOnly: boolean;
	invites: ClanInvite[];
	points: number;
	level: number;
	chatRoom: ID;
	icon: string;
	lastActive: number;
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
	| 'CREATE' | 'DELETE' | 'JOIN' | 'LEAVE' |
	'KICK' | 'INVITE' | 'DEINVITE' | 'PROMOTE' |
	'DEMOTE' | 'SET_MOTW' | 'SET_DESC' | 'SET_TAG' |
	'SET_ICON' | 'SET_INVITEONLY' | 'RANK_CREATE' | 'RANK_DELETE' |
	'ADMIN_POINTS' | 'ADMIN_TOURWIN' | 'ADMIN_EVENTWIN' | 'ADMIN_CLEARMEMBERS' |
	'ADMIN_TRANSFEROWNER' | 'ADMIN_CLEARINVITES' | 'ADMIN_KICKALL' | 'ADMIN_SETICON' |
	'ADMIN_SETTAG' | 'ADMIN_SETDESC' | 'ADMIN_RESETSTATS' | 'ADMIN_REMOVELEVEL' |
	'ADMIN_ADDLEVEL' | 'ADMIN_SETLEVEL' | 'RANK_EDIT';

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

export interface ClanPointsLogEntry {
	timestamp: number;
	userid: ID;
	actor: ID;
	amount: number;
	reason: string;
}

export interface ClanPointsLogs {
	[clanId: string]: ClanPointsLogEntry[];
}

export interface ClanWar {
	_id: ID;
	clans: [ID, ID];
	scores: { [clanId: string]: number };
	status: 'pending' | 'active' | 'completed';
	startDate: number;
	endDate?: number;
	bestOf: number;
	tieConfirmations?: ID[];
	paused?: boolean;
	pauseConfirmations?: ID[];
	resumeConfirmations?: ID[];
	extendConfirmations?: { clanId: ID, newBestOf: number }[];
}

export interface ClanBattleLogEntry {
	timestamp: number;
	winningClan: ID;
	losingClan: ID;
	winner: ID;
	loser: ID;
	format: string;
	battleID: RoomID;
	warId?: ID;
	eloChangeWinner?: number;
	eloChangeLoser?: number;
	isWarWinningBattle?: boolean;
}
