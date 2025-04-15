export interface ClanData {
    id: string;
    name: string;
    leader: ID;
    members: ID[];
    createdAt: number;
}

export interface ClanManager {
    createClan(name: string, leaderId: ID): Promise<ClanData>;
    deleteClan(clanId: string): Promise<boolean>;
    getClan(clanId: string): Promise<ClanData | null>;
}