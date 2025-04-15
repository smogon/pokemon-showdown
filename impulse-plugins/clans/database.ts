import { FS } from '../../lib/fs';
import { ClanData } from './types';

const CLANS_FILE = 'config/clans.json';

class ClanDatabase {
    private clans: Map<ID, ClanData>;

    constructor() {
        this.clans = new Map();
        void this.loadClans();
    }

    private async loadClans() {
        try {
            const data = await FS(CLANS_FILE).readIfExists();
            if (!data) return;

            const clansData = JSON.parse(data);
            for (const clan of clansData) {
                this.clans.set(clan.id, clan);
            }
        } catch (error) {
            Monitor.error(`Error loading clans: ${error}`);
        }
    }

    private async saveClansToFile() {
        try {
            const data = Array.from(this.clans.values());
            await FS(CLANS_FILE).write(JSON.stringify(data, null, 2));
        } catch (error) {
            Monitor.error(`Error saving clans: ${error}`);
            throw new Error('Failed to save clan data');
        }
    }

    async saveClan(clan: ClanData): Promise<void> {
        this.clans.set(clan.id, clan);
        await this.saveClansToFile();
    }

    async getClan(clanId: ID): Promise<ClanData | null> {
        return this.clans.get(clanId) || null;
    }

    async deleteClan(clanId: ID): Promise<boolean> {
        const deleted = this.clans.delete(clanId);
        if (deleted) {
            await this.saveClansToFile();
        }
        return deleted;
    }

    async getClanByName(name: string): Promise<ClanData | null> {
        const searchId = toID(name);
        for (const clan of this.clans.values()) {
            if (clan.id === searchId) {
                return clan;
            }
        }
        return null;
    }

    async findClanByMemberId(userId: ID): Promise<ClanData | null> {
        userId = toID(userId);
        for (const clan of this.clans.values()) {
            if (clan.members.some(member => member.id === userId)) {
                return clan;
            }
        }
        return null;
    }
}

export const clanDatabase = new ClanDatabase();