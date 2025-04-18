import { FS } from '../../lib/fs';
import { ClanData, ClanInvite } from './types';

const CLANS_FILE = 'config/clans.json';
const INVITES_FILE = 'config/clan-invites.json';

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
                // Ensure backward compatibility by setting default values for existing clans
                if (!clan.points) {
                    clan.points = 1000;
                }
                // Initialize new fields if they don't exist
                if (!clan.hasOwnProperty('icon')) {
                    clan.icon = undefined;
                }
                if (!clan.hasOwnProperty('description')) {
                    clan.description = undefined;
                }
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
        // Ensure the clan object has all required fields before saving
        if (!clan.hasOwnProperty('icon')) {
            clan.icon = undefined;
        }
        if (!clan.hasOwnProperty('description')) {
            clan.description = undefined;
        }
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

    getAllClans(): ClanData[] {
        return Array.from(this.clans.values());
    }
}

class ClanInviteDatabase {
    private invites: Map<string, ClanInvite>;

    constructor() {
        this.invites = new Map();
        void this.loadInvites();
    }

    private async loadInvites() {
        try {
            const data = await FS(INVITES_FILE).readIfExists();
            if (!data) return;

            const invitesData = JSON.parse(data);
            for (const invite of invitesData) {
                this.invites.set(invite.id, invite);
            }
        } catch (error) {
            Monitor.error(`Error loading clan invites: ${error}`);
        }
    }

    private async saveInvitesToFile() {
        try {
            const data = Array.from(this.invites.values());
            await FS(INVITES_FILE).write(JSON.stringify(data, null, 2));
        } catch (error) {
            Monitor.error(`Error saving clan invites: ${error}`);
            throw new Error('Failed to save clan invites');
        }
    }

    async addInvite(invite: ClanInvite): Promise<void> {
        this.invites.set(invite.id, invite);
        await this.saveInvitesToFile();
    }

    async removeInvite(inviteId: string): Promise<boolean> {
        const deleted = this.invites.delete(inviteId);
        if (deleted) {
            await this.saveInvitesToFile();
        }
        return deleted;
    }

    async getPendingInvite(inviteeId: ID): Promise<ClanInvite | null> {
        inviteeId = toID(inviteeId);
        const now = Date.now();
        
        for (const invite of this.invites.values()) {
            if (invite.inviteeId === inviteeId && invite.expiresAt > now) {
                return invite;
            }
        }
        return null;
    }

    async cleanExpiredInvites(): Promise<void> {
        const now = Date.now();
        let changed = false;

        for (const [id, invite] of this.invites) {
            if (invite.expiresAt <= now) {
                this.invites.delete(id);
                changed = true;
            }
        }

        if (changed) {
            await this.saveInvitesToFile();
        }
    }

    getInvites(): ClanInvite[] {
        return Array.from(this.invites.values());
    }
}

export const clanDatabase = new ClanDatabase();
export const clanInviteDatabase = new ClanInviteDatabase();
