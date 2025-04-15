import { ClanData, ClanManager, ClanRank, ClanMember } from './types';
import { clanDatabase } from './database';

class ClanManagerImpl implements ClanManager {
    async createClan(name: string, leaderId: ID): Promise<ClanData> {
        const clanId = toID(name);
        leaderId = toID(leaderId);

        const existingClan = await clanDatabase.getClanByName(name);
        if (existingClan) {
            throw new Error('A clan with this name already exists');
        }

        if (clanId.length < 2) {
            throw new Error('Clan name must be at least 2 characters long');
        }

        if (clanId.length > 24) {
            throw new Error('Clan name must not exceed 24 characters');
        }

        // Check if user is already in a clan
        const userClan = await clanDatabase.findClanByMemberId(leaderId);
        if (userClan) {
            throw new Error('This user is already in a clan');
        }

        const leaderMember: ClanMember = {
            id: leaderId,
            rank: ClanRank.LEADER,
            joinedAt: Date.now()
        };

        const clanData: ClanData = {
            id: clanId,
            name: name.trim(),
            leader: leaderId,
            members: [leaderMember],
            createdAt: Date.now(),
        };

        await clanDatabase.saveClan(clanData);
        return clanData;
    }

    async deleteClan(clanId: ID): Promise<boolean> {
        return clanDatabase.deleteClan(toID(clanId));
    }

    async getClan(clanId: ID): Promise<ClanData | null> {
        return clanDatabase.getClan(toID(clanId));
    }

    async setRank(clanId: ID, userId: ID, newRank: ClanRank): Promise<boolean> {
        clanId = toID(clanId);
        userId = toID(userId);

        const clan = await this.getClan(clanId);
        if (!clan) return false;

        const member = clan.members.find(m => m.id === userId);
        if (!member) return false;

        // Don't allow changing leader's rank
        if (userId === clan.leader && newRank !== ClanRank.LEADER) {
            throw new Error("The clan leader's rank cannot be changed");
        }

        member.rank = newRank;
        if (newRank === ClanRank.LEADER) {
            // If setting a new leader, demote the old leader to Deputy
            const oldLeader = clan.members.find(m => m.id === clan.leader);
            if (oldLeader) {
                oldLeader.rank = ClanRank.DEPUTY;
            }
            clan.leader = userId;
        }

        await clanDatabase.saveClan(clan);
        return true;
    }
}

export const clanManager = new ClanManagerImpl();