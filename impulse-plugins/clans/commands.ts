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

export const commands: ChatCommands = {
    async createclan(target, room, user) {
        this.checkCan('bypassall');

        if (!target) {
            throw new Chat.ErrorMessage(`/createclan [clan name],[leader username] - Creates a new clan.`);
        }

        const [clanName, leaderName] = target.split(',').map(param => param.trim());
        
        if (!clanName || !leaderName) {
            throw new Chat.ErrorMessage(`Usage: /createclan [clan name],[leader username]`);
        }

        try {
            const targetUser = Users.getExact(leaderName);
            if (!targetUser?.connected) {
                throw new Chat.ErrorMessage(`User '${leaderName}' not found or not online.`);
            }

            const clan = await clanManager.createClan(clanName, targetUser.id);
            
            // Create clan chatroom
            const clanRoomId = toID(clan.name);
            if (Rooms.get(clanRoomId)) {
                throw new Chat.ErrorMessage(`Room '${clanRoomId}' already exists.`);
            }

            // Create the room
            const clanRoom = Rooms.createChatRoom(clanRoomId, clan.name, {
                isPrivate: true,
                modjoin: '+',
                auth: {
                    [targetUser.id]: '#',
                },
                introMessage: `<div class="infobox">` +
                    `<div style="text-align: center">` +
                    `<h2>${Chat.escapeHTML(clan.name)}</h2>` +
                    `<p>Welcome to the ${Chat.escapeHTML(clan.name)} clan room!</p>` +
                    `<p><strong>Clan Leader:</strong> ${Chat.escapeHTML(targetUser.name)}</p>` +
                    `<p><strong>Created:</strong> ${Chat.toTimestamp(new Date())}</p>` +
                    `</div></div>`,
                staffMessage: `<div class="infobox">` +
                    `<h3>Clan Room Staff Guide</h3>` +
                    `<p>Room ranks:</p>` +
                    `<ul>` +
                    `<li><strong>#</strong> - Clan Leader</li>` +
                    `<li><strong>@</strong> - Clan Deputy</li>` +
                    `<li><strong>%</strong> - Clan Senior</li>` +
                    `<li><strong>+</strong> - Clan Member</li>` +
                    `</ul></div>`,
            });

            if (!clanRoom) {
                throw new Error(`Failed to create clan room: ${clanRoomId}`);
            }

            // Save room settings
            clanRoom.persist = true;
            clanRoom.settings.modjoin = '+';
            clanRoom.settings.isPrivate = true;
            clanRoom.saveSettings();

            this.globalModlog('CLANCREATE', targetUser, `${clan.name} (by ${user.name})`);
            sendClanMessage(clan.id, `The clan ${clan.name} has been created with ${targetUser.name} as the leader.`);
            return this.sendReply(
                `Clan "${clan.name}" has been created with ${targetUser.name} as the leader. ` +
                `The clan chatroom "${clanRoomId}" has been created.`
            );
        } catch (error) {
            throw new Chat.ErrorMessage(error.message);
        }
    },

    async deleteclan(target, room, user) {
        this.checkCan('bypassall');

        if (!target) {
            throw new Chat.ErrorMessage(`/deleteclan [clan name] - Deletes a clan.`);
        }

        const clanId = toID(target);
        const clan = await clanManager.getClan(clanId);
        if (!clan) {
            throw new Chat.ErrorMessage(`Clan "${target}" not found.`);
        }

        try {
            // Announce deletion in clan room before destroying it
            sendClanMessage(clan.id, `The clan ${clan.name} has been deleted by ${user.name}.`);

            // Delete clan room if it exists
            const clanRoom = Rooms.get(clanId);
            if (clanRoom) {
                clanRoom.destroy();
            }

            await clanManager.deleteClan(clan.id);
            this.globalModlog('CLANDELETE', null, `${clan.name} (by ${user.name})`);
            return this.sendReply(`Successfully deleted clan ${clan.name} and its chatroom.`);
        } catch (error) {
            throw new Chat.ErrorMessage(`Failed to delete clan: ${error.message}`);
        }
    },

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
                    `(${clan.members.length} members) [${roomStatus}]`;
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
            `Room Status: ${roomStatus}`,
            `Created: ${Chat.toTimestamp(new Date(clan.createdAt))}`
        ].join('<br />');

        return this.sendReplyBox(output);
    },
};
