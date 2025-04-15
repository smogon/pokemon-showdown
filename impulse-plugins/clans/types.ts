export enum ClanRank {
    MEMBER = 0,        // Regular member
    ELITE = 1,         // Experienced member
    VETERAN = 2,       // Trusted member with some privileges
    OFFICER = 3,       // Can invite members and manage lower ranks
    COLEADER = 4,      // Can manage all ranks except leader
    LEADER = 5         // Full control over clan
}

export interface ClanMember {
    userid: string;
    username: string;
    rank: ClanRank;
    joinedAt: Date;
}

export interface ClanInvite {
    clanId: string;
    userId: string;
    inviterId: string;
    timestamp: Date;
    expires: Date;
}

export interface Clan {
    id: string;
    name: string;
    leader: string;
    members: ClanMember[];
    createdAt: Date;
    description: string;
    icon: string;
    lastUpdated: Date;
}

export interface ClanWarMatch {
    playerA: string;  // userid of player from clan A
    playerB: string;  // userid of player from clan B
    winner?: string;  // userid of winner
    format: string;   // battle format
    roomid?: string;  // battle room id
    timestamp: Date;
    completed: boolean;
}

export interface ClanWar {
    id: string;           // unique war id
    clanA: string;       // challenger clan id
    clanB: string;       // challenged clan id
    matches: ClanWarMatch[];
    size: number;        // number of matches (e.g., 3, 5, 7)
    format: string;      // battle format
    startTime: Date;
    endTime?: Date;
    state: ClanWarState;
    winner?: string;     // winning clan id
    score: {
        [clanId: string]: number;
    };
}

export enum ClanWarState {
    PENDING = 'pending',     // War has been proposed
    ACTIVE = 'active',       // War is ongoing
    COMPLETED = 'completed', // War has finished
    CANCELLED = 'cancelled'  // War was cancelled
}

export function getRankName(rank: ClanRank): string {
    return [
        'Member',
        'Elite',
        'Veteran',
        'Officer',
        'Co-Leader',
        'Leader'
    ][rank] || 'Unknown';
}

export function canPromoteTo(userRank: ClanRank, targetRank: ClanRank): boolean {
    return userRank > targetRank;
}

export function getPromotableRanks(userRank: ClanRank): ClanRank[] {
    return Object.values(ClanRank)
        .filter(rank => typeof rank === 'number')
        .filter(rank => canPromoteTo(userRank, rank as ClanRank)) as ClanRank[];
}

export function canManageRank(user: User, clan: Clan, targetRank: ClanRank): boolean {
    if (user.can('admin')) return true;
    const member = clan.members.find(m => m.userid === user.id);
    if (!member) return false;
    return canPromoteTo(member.rank, targetRank);
}

export function canInviteMembers(rank: ClanRank): boolean {
    return rank >= ClanRank.VETERAN;
}

export function canManageClanInfo(user: User, clan: Clan): boolean {
    if (user.can('admin')) return true;
    const member = clan.members.find(m => m.userid === user.id);
    if (!member) return false;
    return member.rank >= ClanRank.COLEADER;
}

export function canManageWars(user: User, clan: Clan): boolean {
    if (user.can('admin')) return true;
    const member = clan.members.find(m => m.userid === user.id);
    if (!member) return false;
    return member.rank >= ClanRank.OFFICER;
}
