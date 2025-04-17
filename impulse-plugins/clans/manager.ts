import { ClanData, ClanManager, ClanRank, ClanMember, ClanInvite } from './types';
import { clanDatabase, clanInviteDatabase } from './database';
import { randomUUID } from 'crypto';

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
            points: 1000, // Initialize points
            icon: undefined,
            description: undefined,
            isRoomClosed: false // Initialize room state
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

    async setClanIcon(clanId: ID, icon: string | undefined): Promise<boolean> {
        const clan = await this.getClan(toID(clanId));
        if (!clan) return false;

        if (icon === undefined) {
            delete clan.icon;
        } else {
            // Validate icon URL format
            try {
                const urlPattern = /^https?:\/\/.+\.(png|jpg|jpeg|gif)$/i;
                if (!urlPattern.test(icon)) {
                    throw new Error('Invalid image URL format');
                }
                clan.icon = icon;
            } catch (e) {
                throw new Error('Invalid icon URL');
            }
        }

        await clanDatabase.saveClan(clan);
        return true;
    }

    async setClanDescription(clanId: ID, description: string | undefined): Promise<boolean> {
        const clan = await this.getClan(toID(clanId));
        if (!clan) return false;

        if (description === undefined) {
            delete clan.description;
        } else {
            // Validate description length
            if (description.length > 500) {
                throw new Error('Description cannot exceed 500 characters');
            }
            clan.description = description;
        }

        await clanDatabase.saveClan(clan);
        return true;
    }

    async inviteMember(clanId: ID, inviterId: ID, inviteeId: ID): Promise<ClanInvite> {
        clanId = toID(clanId);
        inviterId = toID(inviterId);
        inviteeId = toID(inviteeId);

        const clan = await this.getClan(clanId);
        if (!clan) {
            throw new Error('Clan not found');
        }

        // Check if inviter has permission (Leader or Deputy)
        const inviter = clan.members.find(m => m.id === inviterId);
        if (!inviter || (inviter.rank !== ClanRank.LEADER && inviter.rank !== ClanRank.DEPUTY)) {
            throw new Error('You must be a clan leader or deputy to invite members');
        }

        // Check if invitee is already in a clan
        const inviteeClan = await clanDatabase.findClanByMemberId(inviteeId);
        if (inviteeClan) {
            throw new Error('This user is already in a clan');
        }

        // Check if there's already a pending invite
        const existingInvite = await clanInviteDatabase.getPendingInvite(inviteeId);
        if (existingInvite) {
            throw new Error('This user already has a pending clan invite');
        }

        // Create new invite (expires in 24 hours)
        const invite: ClanInvite = {
            id: randomUUID(),
            clanId,
            inviterId,
            inviteeId,
            createdAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        await clanInviteDatabase.addInvite(invite);
        return invite;
    }

    async acceptInvite(inviteId: string): Promise<boolean> {
        const now = Date.now();
        const invites = clanInviteDatabase.getInvites();
        const invite = invites.find(inv => inv.id === inviteId);

        if (!invite || invite.expiresAt <= now) {
            throw new Error('Invalid or expired invite');
        }

        const clan = await this.getClan(invite.clanId);
        if (!clan) {
            throw new Error('Clan no longer exists');
        }

        // Check if user is already in a clan (double-check in case they joined another way)
        const userClan = await clanDatabase.findClanByMemberId(invite.inviteeId);
        if (userClan) {
            throw new Error('You are already in a clan');
        }

        // Add member to clan - directly as Member
        const newMember: ClanMember = {
            id: invite.inviteeId,
            rank: ClanRank.MEMBER,
            joinedAt: now
        };

        clan.members.push(newMember);
        await clanDatabase.saveClan(clan);
        await clanInviteDatabase.removeInvite(invite.id);

        return true;
    }

    async getPendingInvite(inviteeId: ID): Promise<ClanInvite | null> {
        return clanInviteDatabase.getPendingInvite(toID(inviteeId));
    }

    async setClanRoomClosed(clanId: ID, isClosed: boolean): Promise<boolean> {
        const clan = await this.getClan(toID(clanId));
        if (!clan) return false;

        clan.isRoomClosed = isClosed;
        await clanDatabase.saveClan(clan);
        return true;
    }

    async isClanRoomClosed(clanId: ID): Promise<boolean> {
        const clan = await this.getClan(toID(clanId));
        return clan?.isRoomClosed || false;
    }
}

export const clanManager = new ClanManagerImpl();
