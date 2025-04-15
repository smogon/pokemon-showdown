import { FS } from '../../lib/fs';
import type { 
    Clan, 
    ClanMember, 
    ClanInvite, 
    ClanRank, 
    ClanWar, 
    ClanWarMatch, 
    ClanWarState 
} from './types';

export class ClanManager {
    private clans: Map<string, Clan>;
    private userClans: Map<string, string>;
    private invites: Map<string, ClanInvite[]>;
    private wars: Map<string, ClanWar>;
    private readonly CLANS_FILE = 'config/clans.json';
    private readonly INVITES_FILE = 'config/clan-invites.json';
    private readonly WARS_FILE = 'config/clan-wars.json';

    constructor() {
        this.clans = new Map();
        this.userClans = new Map();
        this.invites = new Map();
        this.wars = new Map();
        this.loadClans();
        this.loadInvites();
        this.loadWars();
    }

    private async loadClans() {
        try {
            const data = await FS(this.CLANS_FILE).readIfExists();
            if (!data) return;
            
            const savedClans = JSON.parse(data);
            for (const [id, clan] of Object.entries(savedClans)) {
                this.clans.set(id, {
                    ...clan,
                    createdAt: new Date(clan.createdAt),
                    lastUpdated: new Date(clan.lastUpdated),
                    members: clan.members.map((m: any) => ({
                        ...m,
                        joinedAt: new Date(m.joinedAt)
                    }))
                });
                
                clan.members.forEach((member: ClanMember) => {
                    this.userClans.set(member.userid, id);
                });
            }
        } catch (e) {
            console.error('Error loading clans:', e);
        }
    }

    private async loadInvites() {
        try {
            const data = await FS(this.INVITES_FILE).readIfExists();
            if (!data) return;
            
            const savedInvites = JSON.parse(data);
            for (const [userId, userInvites] of Object.entries(savedInvites)) {
                this.invites.set(userId, userInvites.map((invite: any) => ({
                    ...invite,
                    timestamp: new Date(invite.timestamp),
                    expires: new Date(invite.expires)
                })));
            }
        } catch (e) {
            console.error('Error loading clan invites:', e);
        }
    }

    private async loadWars() {
        try {
            const data = await FS(this.WARS_FILE).readIfExists();
            if (!data) return;
            
            const savedWars = JSON.parse(data);
            for (const [id, war] of Object.entries(savedWars)) {
                this.wars.set(id, {
                    ...war,
                    startTime: new Date(war.startTime),
                    endTime: war.endTime ? new Date(war.endTime) : undefined,
                    matches: war.matches.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp)
                    }))
                });
            }
        } catch (e) {
            console.error('Error loading clan wars:', e);
        }
    }

    private async saveClans() {
        const data = JSON.stringify(Object.fromEntries(this.clans));
        await FS(this.CLANS_FILE).write(data);
    }

    private async saveInvites() {
        const data = JSON.stringify(Object.fromEntries(this.invites));
        await FS(this.INVITES_FILE).write(data);
    }

    private async saveWars() {
        const data = JSON.stringify(Object.fromEntries(this.wars));
        await FS(this.WARS_FILE).write(data);
    }

    createClan(name: string, leaderId: string, creator: string): boolean {
        const clanId = toID(name);
        
        if (this.clans.has(clanId)) {
            return false;
        }

        const clan: Clan = {
            id: clanId,
            name,
            leader: leaderId,
            members: [{
                userid: leaderId,
                username: leaderId,
                rank: ClanRank.LEADER,
                joinedAt: new Date()
            }],
            createdAt: new Date(),
            description: '',
            icon: '',
            lastUpdated: new Date()
        };

        this.clans.set(clanId, clan);
        this.userClans.set(leaderId, clanId);
        this.saveClans();
        return true;
    }

    deleteClan(clanId: string): boolean {
        const clan = this.clans.get(clanId);
        if (!clan) return false;

        clan.members.forEach(member => {
            this.userClans.delete(member.userid);
        });

        this.clans.delete(clanId);
        this.saveClans();
        return true;
    }

    setClanDescription(clanId: string, description: string, userId: string): boolean {
        const clan = this.clans.get(clanId);
        if (!clan) return false;

        const member = clan.members.find(m => m.userid === userId);
        if (!member || member.rank < ClanRank.COLEADER) return false;

        clan.description = description.trim();
        clan.lastUpdated = new Date();
        this.saveClans();
        return true;
    }

    setClanIcon(clanId: string, iconUrl: string, userId: string): boolean {
        const clan = this.clans.get(clanId);
        if (!clan) return false;

        const member = clan.members.find(m => m.userid === userId);
        if (!member || member.rank < ClanRank.COLEADER) return false;

        try {
            new URL(iconUrl);
        } catch {
            return false;
        }

        clan.icon = iconUrl;
        clan.lastUpdated = new Date();
        this.saveClans();
        return true;
    }

    setRank(clanId: string, targetId: string, newRank: ClanRank, promoterId: string): boolean {
        const clan = this.clans.get(clanId);
        if (!clan) return false;

        if (targetId === clan.leader) return false;

        const promoter = clan.members.find(m => m.userid === promoterId);
        if (!promoter) return false;

        const member = clan.members.find(m => m.userid === targetId);
        if (!member) return false;

        if (!canPromoteTo(promoter.rank, newRank)) return false;

        member.rank = newRank;
        this.saveClans();
        return true;
    }

    inviteUser(clanId: string, userId: string, inviterId: string): boolean {
        const clan = this.clans.get(clanId);
        if (!clan) return false;

        if (this.userClans.has(userId)) return false;

        let userInvites = this.invites.get(userId) || [];
        userInvites = userInvites.filter(invite => invite.expires > new Date());

        if (userInvites.some(invite => invite.clanId === clanId)) return false;

        const invite: ClanInvite = {
            clanId,
            userId,
            inviterId,
            timestamp: new Date(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };

        userInvites.push(invite);
        this.invites.set(userId, userInvites);
        this.saveInvites();
        return true;
    }

    getInvites(userId: string): ClanInvite[] {
        const userInvites = this.invites.get(userId) || [];
        const validInvites = userInvites.filter(invite => invite.expires > new Date());
        if (validInvites.length !== userInvites.length) {
            this.invites.set(userId, validInvites);
            this.saveInvites();
        }
        return validInvites;
    }

    acceptInvite(userId: string, clanId: string): boolean {
        const userInvites = this.getInvites(userId);
        const invite = userInvites.find(inv => inv.clanId === clanId);
        
        if (!invite) return false;

        if (this.joinClan(userId, clanId)) {
            this.invites.delete(userId);
            this.saveInvites();
            return true;
        }
        return false;
    }

    joinClan(userId: string, clanId: string): boolean {
        if (this.userClans.has(userId)) return false;
        
        const clan = this.clans.get(clanId);
        if (!clan) return false;

        clan.members.push({
            userid: userId,
            username: userId,
            rank: ClanRank.MEMBER,
            joinedAt: new Date()
        });

        this.userClans.set(userId, clanId);
        this.saveClans();
        return true;
    }

    leaveClan(userId: string): boolean {
        const clanId = this.userClans.get(userId);
        if (!clanId) return false;

        const clan = this.clans.get(clanId);
        if (!clan) return false;

        if (clan.leader === userId) return false;

        clan.members = clan.members.filter(member => member.userid !== userId);
        this.userClans.delete(userId);
        this.saveClans();
        return true;
    }

    getClan(clanId: string): Clan | null {
        return this.clans.get(clanId) || null;
    }

    getUserClan(userId: string): Clan | null {
        const clanId = this.userClans.get(userId);
        return clanId ? this.clans.get(clanId) || null : null;
    }

    getAllClans(): Clan[] {
        return Array.from(this.clans.values());
    }

    getMember(clanId: string, userId: string): ClanMember | null {
        const clan = this.clans.get(clanId);
        if (!clan) return null;
        return clan.members.find(m => m.userid === userId) || null;
    }

    private generateWarId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `war-${timestamp}-${random}`;
    }

    proposeWar(clanAId: string, clanBId: string, size: number, format: string): string | false {
        const clanA = this.clans.get(clanAId);
        const clanB = this.clans.get(clanBId);
        
        if (!clanA || !clanB) return false;
        if (size < 1 || size > 7) return false;

        // Check if either clan is already in an active war
        for (const war of this.wars.values()) {
            if (war.state === ClanWarState.ACTIVE &&
                (war.clanA === clanAId || war.clanB === clanAId ||
                 war.clanA === clanBId || war.clanB === clanBId)) {
                return false;
            }
        }

        const warId = this.generateWarId();
        const war: ClanWar = {
            id: warId,
            clanA: clanAId,
            clanB: clanBId,
            matches: [],
            size,
            format,
            startTime: new Date(),
            state: ClanWarState.PENDING,
            score: {
                [clanAId]: 0,
                [clanBId]: 0
            }
        };

        this.wars.set(warId, war);
        this.saveWars();
        return warId;
    }

    acceptWar(warId: string): boolean {
        const war = this.wars.get(warId);
        if (!war || war.state !== ClanWarState.PENDING) return false;

        war.state = ClanWarState.ACTIVE;
        this.saveWars();
        return true;
    }

    cancelWar(warId: string): boolean {
        const war = this.wars.get(warId);
        if (!war || war.state === ClanWarState.COMPLETED) return false;

        war.state = ClanWarState.CANCELLED;
        war.endTime = new Date();
        this.saveWars();
        return true;
    }

    startWarMatch(warId: string, playerA: string, playerB: string, roomid: string): boolean {
        const war = this.wars.get(warId);
        if (!war || war.state !== ClanWarState.ACTIVE) return false;

        const playerAClan = this.userClans.get(playerA);
        const playerBClan = this.userClans.get(playerB);
        if (playerAClan !== war.clanA || playerBClan !== war.clanB) return false;

        if (war.matches.some(m => !m.completed && 
            (m.playerA === playerA || m.playerA === playerB ||
             m.playerB === playerA || m.playerB === playerB))) {
            return false;
        }

        const match: ClanWarMatch = {
            playerA,
            playerB,
            format: war.format,
            roomid,
            timestamp: new Date(),
            completed: false
        };

        war.matches.push(match);
        this.saveWars();
        return true;
    }

    endWarMatch(warId: string, roomid: string, winner: string): boolean {
        const war = this.wars.get(warId);
        if (!war || war.state !== ClanWarState.ACTIVE) return false;

        const match = war.matches.find(m => m.roomid === roomid && !m.completed);
        if (!match) return false;

        match.completed = true;
        match.winner = winner;

        const winnerClan = this.userClans.get(winner);
        if (winnerClan === war.clanA || winnerClan === war.clanB) {
            war.score[winnerClan]++;
        }

        const requiredWins = Math.ceil(war.size / 2);
        if (war.score[war.clanA] >= requiredWins || war.score[war.clanB] >= requiredWins) {
            war.state = ClanWarState.COMPLETED;
            war.endTime = new Date();
            war.winner = war.score[war.clanA] > war.score[war.clanB] ? war.clanA : war.clanB;
        }

        this.saveWars();
        return true;
    }

    getWar(warId: string): ClanWar | null {
        return this.wars.get(warId) || null;
    }

    getActiveClanWar(clanId: string): ClanWar | null {
        for (const war of this.wars.values()) {
            if ((war.clanA === clanId || war.clanB === clanId) &&
                war.state === ClanWarState.ACTIVE) {
                return war;
            }
        }
        return null;
    }

    getPendingClanWar(clanId: string): ClanWar | null {
        for (const war of this.wars.values()) {
            if ((war.clanA === clanId || war.clanB === clanId) &&
                war.state === ClanWarState.PENDING) {
                return war;
            }
        }
        return null;
    }

    getClanWarHistory(clanId: string): ClanWar[] {
        return Array.from(this.wars.values())
            .filter(war => (war.clanA === clanId || war.clanB === clanId) &&
                          war.state === ClanWarState.COMPLETED)
            .sort((a, b) => b.endTime!.getTime() - a.endTime!.getTime());
    }
}

export const Clans = new ClanManager();
