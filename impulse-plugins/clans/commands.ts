import { clanManager } from './manager';
import { ClanRank, ClanRankNames } from './types';
import { clanDatabase, clanInviteDatabase } from './database';
import type { Room } from '../rooms';

function sendClanMessage(clanId: ID, message: string) {
    const clanRoom = Rooms.get(clanId);
    if (clanRoom) {
        clanRoom.add(`|c|~|${message}`).update();
    }
}

export const commands: Chat.Commands = {
	async clanrank(target, room, user) {
        if (!target) {
            throw new Chat.ErrorMessage(`/clanrank [username], [rank] - Sets a user's clan rank. ` + 
                `Requires: ${ClanRankNames[ClanRank.LEADER]} or bypassall`);
        }

        const [targetUsername, rankStr] = target.split(',').map(param => param.trim());
        if (!targetUsername || !rankStr) {
            throw new Chat.ErrorMessage(`Usage: /clanrank [username], [rank]`);
        }

        const targetUser = Users.getExact(targetUsername);
        if (!targetUser?.connected) {
            throw new Chat.ErrorMessage(`User '${targetUsername}' not found or not online.`);
        }

        // Find user's clan
        const clan = await clanDatabase.findClanByMemberId(targetUser.id);
        if (!clan) {
            throw new Chat.ErrorMessage(`${targetUser.name} is not in a clan.`);
        }

        // Permission check
        if (!this.can('bypassall')) {
            const requester = clan.members.find(m => m.id === toID(user.id));
            if (!requester || requester.rank !== ClanRank.LEADER) {
                throw new Chat.ErrorMessage(`You must be the clan leader to change ranks.`);
            }
        }

        // Convert rank string to enum
        const rankLower = rankStr.toLowerCase();
        let newRank: ClanRank | null = null;
        for (const [rank, name] of Object.entries(ClanRankNames)) {
            if (name.toLowerCase() === rankLower) {
                newRank = Number(rank) as ClanRank;
                break;
            }
        }

        if (newRank === null) {
            throw new Chat.ErrorMessage(`Invalid rank. Valid ranks are: ${Object.values(ClanRankNames).join(', ')}`);
        }

        try {
            await clanManager.setRank(clan.id, targetUser.id, newRank);

            // Update room auth
            const clanRoom = Rooms.get(clan.id);
            if (clanRoom) {
                switch (newRank) {
                    case ClanRank.LEADER:
                        clanRoom.auth.set(targetUser.id, '#');
                        break;
                    case ClanRank.DEPUTY:
                        clanRoom.auth.set(targetUser.id, '@');
                        break;
                    case ClanRank.SENIOR:
                        clanRoom.auth.set(targetUser.id, '%');
                        break;
                    case ClanRank.MEMBER:
                        clanRoom.auth.set(targetUser.id, '+');
                        break;
                }
                clanRoom.saveSettings();
            }

            this.globalModlog('CLANRANK', targetUser, 
                `changed to ${ClanRankNames[newRank]} in ${clan.name} (by ${user.name})`);
            sendClanMessage(clan.id, `${targetUser.name}'s rank has been changed to ${ClanRankNames[newRank]} by ${user.name}.`);
            return this.sendReply(`Changed ${targetUser.name}'s rank to ${ClanRankNames[newRank]}.`);
        } catch (error) {
            throw new Chat.ErrorMessage(error.message);
        }
    },

    async claninvite(target, room, user) {
        if (!target) {
            throw new Chat.ErrorMessage(`/claninvite [username] - Invites a user to your clan.`);
        }

        const targetUser = Users.getExact(target);
        if (!targetUser?.connected) {
            throw new Chat.ErrorMessage(`User '${target}' not found or not online.`);
        }

        // Find inviter's clan
        const clan = await clanDatabase.findClanByMemberId(user.id);
        if (!clan) {
            throw new Chat.ErrorMessage(`You are not in a clan.`);
        }

        // Check if user has permission to invite
        const member = clan.members.find(m => m.id === toID(user.id));
        if (!member || (member.rank !== ClanRank.LEADER && member.rank !== ClanRank.DEPUTY)) {
            throw new Chat.ErrorMessage(`You must be a clan leader or deputy to invite members.`);
        }

        try {
            const invite = await clanManager.inviteMember(clan.id, user.id, targetUser.id);
            
            this.globalModlog('CLANINVITE', targetUser, `to ${clan.name} (by ${user.name})`);
            
            // Notify the invited user
            const pmMessage = `/raw You have been invited to join the clan "${clan.name}". ` +
                `Use <code>/clanaccept ${invite.id}</code> to accept. This invite expires in 24 hours.`;
            
            targetUser.send(`|pm|${user.name}|${targetUser.name}|${pmMessage}`);

            sendClanMessage(clan.id, `${user.name} has invited ${targetUser.name} to join the clan.`);
            return this.sendReply(`Invitation sent to ${targetUser.name}. They have 24 hours to accept.`);
        } catch (error) {
            throw new Chat.ErrorMessage(error.message);
        }
    },

    async clanaccept(target, room, user) {
        if (!target) {
            throw new Chat.ErrorMessage(`/clanaccept [invite code] - Accepts a clan invitation.`);
        }

        try {
            // Clean expired invites first
            await clanInviteDatabase.cleanExpiredInvites();

            // Check if user has a pending invite
            const invite = await clanManager.getPendingInvite(user.id);
            if (!invite || invite.id !== target) {
                throw new Chat.ErrorMessage(`Invalid or expired invite code.`);
            }

            const clan = await clanManager.getClan(invite.clanId);
            if (!clan) {
                throw new Chat.ErrorMessage(`The clan no longer exists.`);
            }

            await clanManager.acceptInvite(invite.id);

            // Add room auth for new member - directly as Member (+)
            const clanRoom = Rooms.get(clan.id);
            if (clanRoom) {
                clanRoom.auth.set(user.id, '+');
                clanRoom.saveSettings();
            }
            
            this.globalModlog('CLANACCEPT', user, `joined ${clan.name}`);
            sendClanMessage(clan.id, `${user.name} has joined the clan as a Member!`);
            return this.sendReply(`You have successfully joined clan ${clan.name} as a Member.`);
        } catch (error) {
            throw new Chat.ErrorMessage(error.message);
        }
    },

	clans(target, room, user) {
        this.runBroadcast();

        if (this.broadcasting) {
            if (!this.canBroadcast()) return;
        }

        const clans = clanDatabase.getAllClans();
        if (!clans.length) {
            return this.sendReply("There are no clans.");
        }

        if (!target) {
            const output = clans.map(clan => {
                const clanRoom = Rooms.get(clan.id);
                const roomStatus = clanRoom ? 'Active' : 'Inactive';
                return `${clan.name} - Leader: ${Users.get(clan.leader)?.name || clan.leader} ` +
                    `(${clan.members.length} members, ${clan.points} points) [${roomStatus}]`;
            }).join('<br />');
            return this.sendReplyBox(`<strong>Clans:</strong><br />` + output);
        }

        const clanId = toID(target);
        const clan = clans.find(c => c.id === clanId);
        if (!clan) {
            return this.errorReply(`Clan "${target}" not found.`);
        }

        const members = clan.members.map(member => {
            const username = Users.get(member.id)?.name || member.id;
            return `${username} (${ClanRankNames[member.rank]})`;
        }).join(', ');

        const clanRoom = Rooms.get(clan.id);
        const roomStatus = clanRoom ? 'Active' : 'Inactive';

        const output = [
            `<strong>Clan: ${Chat.escapeHTML(clan.name)}</strong>`,
            `Leader: ${Users.get(clan.leader)?.name || clan.leader}`,
            `Members (${clan.members.length}): ${members}`,
            `Points: ${clan.points}`, // Display points
            `Room Status: ${roomStatus}`,
            `Created: ${Chat.toTimestamp(new Date(clan.createdAt))}`
        ].join('<br />');

        return this.sendReplyBox(output);
    },

	clanshelp() {
    this.runBroadcast();
    const helpMessage = [
        `<strong>Clan System Commands:</strong>`,
        `</code>/createclan [name], [leader]</code> - Creates a new clan. Requires: &`,
        `</code>/deleteclan [name]</code> - Deletes an existing clan. Requires: &`,
        `</code>/clanrank [username], [rank]</code> - Changes a user's rank in their clan. Ranks: Leader, Deputy, Senior, Member.`,
        `</code>/claninvite [username]</code> - Invites a user to your clan. Requires: Leader or Deputy`,
        `</code>/clanaccept [invite code]</code> - Accepts a pending clan invite.`,
        `</code>/clans</code> - Lists all clans.`,
        `</code>/clans [clan name]</code> - Shows info about a specific clan.`,
    ].map(line => Chat.html`${line}`).join(`<br />`);
    return this.sendReplyBox(helpMessage);
},
};
