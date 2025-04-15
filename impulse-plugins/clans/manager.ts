import { ClanData, ClanManager } from './types';
import { clanDatabase } from './database';

class ClanManagerImpl implements ClanManager {
    async createClan(name: string, leaderId: ID): Promise<ClanData> {
        const existingClan = await clanDatabase.getClanByName(name);
        if (existingClan) {
            throw new Error('A clan with this name already exists');
        }

        if (toID(name).length < 2) {
            throw new Error('Clan name must be at least 2 characters long');
        }

        if (toID(name).length > 24) {
            throw new Error('Clan name must not exceed 24 characters');
        }

        const clanData: ClanData = {
            id: toID(name),
            name: name.trim(),
            leader: leaderId,
            members: [leaderId],
            createdAt: Date.now(),
        };

        await clanDatabase.saveClan(clanData);
        return clanData;
    }

    async deleteClan(clanId: string): Promise<boolean> {
        return clanDatabase.deleteClan(clanId);
    }

    async getClan(clanId: string): Promise<ClanData | null> {
        return clanDatabase.getClan(clanId);
    }
}

export const clanManager = new ClanManagerImpl();