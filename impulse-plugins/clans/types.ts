export enum ClanRank {
    LEADER = 4,
    DEPUTY = 3,
    SENIOR = 2,
    MEMBER = 1
}

export const ClanRankNames: { [key in ClanRank]: string } = {
    [ClanRank.LEADER]: 'Leader',
    [ClanRank.DEPUTY]: 'Deputy',
    [ClanRank.SENIOR]: 'Senior',
    [ClanRank.MEMBER]: 'Member'
};

export interface ClanMember {
    id: ID;
    rank: ClanRank;
    joinedAt: number;
}

export interface ClanData {
    id: ID;
    name: string;
    leader: ID;
    members: ClanMember[];
    createdAt: number;
}

export interface ClanInvite {
    id: string;
    clanId: ID;
    inviterId: ID;
    inviteeId: ID;
    createdAt: number;
    expiresAt: number;
}

export interface ClanManager {
    createClan(name: string, leaderId: ID): Promise<ClanData>;
    deleteClan(clanId: ID): Promise<boolean>;
    getClan(clanId: ID): Promise<ClanData | null>;
    setRank(clanId: ID, userId: ID, rank: ClanRank): Promise<boolean>;
    inviteMember(clanId: ID, inviterId: ID, inviteeId: ID): Promise<ClanInvite>;
    acceptInvite(inviteId: string): Promise<boolean>;
    getPendingInvite(inviteeId: ID): Promise<ClanInvite | null>;
}