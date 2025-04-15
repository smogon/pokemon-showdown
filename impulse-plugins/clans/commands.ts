import { clanManager } from './manager';
import { ClanRank, ClanRankNames } from './types';
import { clanDatabase, clanInviteDatabase } from './database';
import type { Room } from '../rooms';

const BUTTON_MAX_CLICKS = 10;

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
                modjoin: '%',
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
                    `<li><strong> </strong> - Clan Recruit (can see room but not chat)</li>` +
                    `</ul></div>`,
            });

            if (!clanRoom) {
                throw new Error(`Failed to create clan room: ${clanRoomId}`);
            }

            // Save room settings
            clanRoom.persist = true;
            clanRoom.settings.modjoin = '%';
            clanRoom.settings.isPrivate = true;
            clanRoom.saveSettings();

            this.globalModlog('CLANCREATE', targetUser, `${clan.name} (by ${user.name})`);
            this.addModAction(
                `${user.name} created the clan ${clan.name} with ${targetUser.name} as the leader.`
            );
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
            // Delete clan room if it exists
            const clanRoom = Rooms.get(clanId);
            if (clanRoom) {
                clanRoom.destroy();
            }

            await clanManager.deleteClan(clan.id);
            this.globalModlog('CLANDELETE', null, `${clan.name} (by ${user.name})`);
            return this.addModAction(
                `${user.name} deleted the clan ${clan.name} and its chatroom.`
            );
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
                    case ClanRank.RECRUIT:
                        clanRoom.auth.delete(targetUser.id);
                        break;
                }
                clanRoom.saveSettings();
            }

            this.globalModlog('CLANRANK', targetUser, 
                `changed to ${ClanRankNames[newRank]} in ${clan.name} (by ${user.name})`);
            return this.addModAction(
                `${user.name} changed ${targetUser.name}'s rank to ${ClanRankNames[newRank]} in clan ${clan.name}.`
            );
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

            // Add room auth for new member
            const clanRoom = Rooms.get(clan.id);
            if (clanRoom) {
                // New members start as recruits (no room auth)
                clanRoom.saveSettings();
            }
            
            this.globalModlog('CLANACCEPT', user, `joined ${clan.name}`);
            return this.addModAction(`${user.name} joined clan ${clan.name}.`);
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
            const buf = [`<div class="pad"><h2>Clans</h2>`];
            
            for (const clan of clans) {
                const clanRoom = Rooms.get(clan.id);
                const roomStatus = clanRoom ? 'Active' : 'Inactive';
                const leaderName = Users.get(clan.leader)?.name || clan.leader;
                
                buf.push(`<div class="infobox">` +
                    `<strong>${Chat.escapeHTML(clan.name)}</strong><br />` +
                    `Leader: ${Chat.escapeHTML(leaderName)}<br />` +
                    `Members: ${clan.members.length} | Status: ${roomStatus}<br />` +
                    `<button class="button" name="send" value="/clans ${clan.id}">` +
                    `View Details</button></div>`
                );
            }
            
            buf.push(`</div>`);
            return this.sendReplyBox(buf.join(''));
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
        const leaderName = Users.get(clan.leader)?.name || clan.leader;

        const buf = [
            `<div class="pad"><h2>${Chat.escapeHTML(clan.name)}</h2>`,
            `<strong>Leader:</strong> ${Chat.escapeHTML(leaderName)}<br />`,
            `<strong>Members (${clan.members.length}):</strong> ${members}<br />`,
            `<strong>Room Status:</strong> ${roomStatus}<br />`,
            `<strong>Created:</strong> ${Chat.toTimestamp(new Date(clan.createdAt))}<br />`
        ];

        // Add management buttons if user has permission
        const userMember = clan.members.find(m => m.id === toID(user.id));
        if (userMember) {
            buf.push(`<hr /><h3>Management</h3>`);
            
            if (userMember.rank >= ClanRank.DEPUTY) {
                buf.push(
                    `<button class="button" name="send" value="/claninvite">` +
                    `Invite Member</button> `
                );
            }
            
            if (userMember.rank === ClanRank.LEADER) {
                buf.push(
                    `<button class="button" name="send" value="/clanmanage ${clan.id}">` +
                    `Manage Clan</button>`
                );
            }
        }

        if (clanRoom) {
            buf.push(
                `<hr />` +
                `<button class="button" name="join" value="${clan.id}">` +
                `Join Clan Room</button>`
            );
        }

        buf.push(`</div>`);
        return this.sendReplyBox(buf.join(''));
    },

    clanmanage(target, room, user) {
        const clanId = toID(target);
        if (!clanId) {
            return this.errorReply(`Usage: /clanmanage [clan]`);
        }

        const clan = clanDatabase.getAllClans().find(c => c.id === clanId);
        if (!clan) {
            return this.errorReply(`Clan "${target}" not found.`);
        }

        const member = clan.members.find(m => m.id === toID(user.id));
        if (!member || member.rank !== ClanRank.LEADER) {
            return this.errorReply(`Access denied. You must be the clan leader to use this command.`);
        }

        const buf = [
            `<div class="pad"><h2>Managing ${Chat.escapeHTML(clan.name)}</h2>`,
            `<h3>Members</h3>`
        ];

        // Member management
        for (const member of clan.members) {
            const memberName = Users.get(member.id)?.name || member.id;
            buf.push(
                `<div class="infobox">` +
                `<strong>${Chat.escapeHTML(memberName)}</strong> ` +
                `(${ClanRankNames[member.rank]})<br />`
            );

            if (member.id !== clan.leader) {
                // Rank change buttons
                buf.push(`<details><summary>Change Rank</summary>`);
                for (const [rank, rankName] of Object.entries(ClanRankNames)) {
                    if (Number(rank) !== member.rank && Number(rank) !== ClanRank.LEADER) {
                        buf.push(
                            `<button class="button" name="send" ` +
                            `value="/clanrank ${memberName},${rankName}">` +
                            `Set as ${rankName}</button> `
                        );
                    }
                }
                buf.push(`</details>`);

                // Kick button
                buf.push(
                    `<button class="button" name="send" ` +
                    `value="/clankick ${memberName},${clan.id}">` +
                    `Kick from Clan</button>`
                );
            }
            buf.push(`</div>`);
        }

        // Clan settings
        buf.push(
            `<hr /><h3>Clan Settings</h3>` +
            `<button class="button" name="send" value="/claninfo ${clan.id}">` +
            `View Clan Info</button> ` +
            `<button class="button" name="send" value="/claninvites ${clan.id}">` +
            `View Pending Invites</button>`
        );

        buf.push(`</div>`);
        return this.sendReplyBox(buf.join(''));
    },

    clankick: 'removemember',
    removemember(target, room, user) {
        if (!target) return this.errorReply(`Usage: /clankick [username],[clan]`);

        const [targetUsername, clanId] = target.split(',').map(toID);
        if (!targetUsername || !clanId) {
            return this.errorReply(`Usage: /clankick [username],[clan]`);
        }

        const clan = clanDatabase.getAllClans().find(c => c.id === clanId);
        if (!clan) {
            return this.errorReply(`Clan not found.`);
        }

        const requester = clan.members.find(m => m.id === toID(user.id));
        if (!requester || requester.rank < ClanRank.DEPUTY) {
            return this.errorReply(`Access denied. You must be a clan deputy or leader to kick members.`);
        }

        const targetMember = clan.members.find(m => m.id === targetUsername);
        if (!targetMember) {
            return this.errorReply(`That user is not in the clan.`);
        }

        if (targetMember.rank >= requester.rank) {
            return this.errorReply(`You cannot kick someone of equal or higher rank.`);
        }

        clan.members = clan.members.filter(m => m.id !== targetUsername);
        void clanDatabase.saveClan(clan);

        // Remove from clan room
        const clanRoom = Rooms.get(clan.id);
        if (clanRoom) {
            clanRoom.auth.delete(targetUsername);
            clanRoom.saveSettings();
        }

        this.globalModlog('CLANKICK', targetMember.id, `from ${clan.name} (by ${user.name})`);
        return this.addModAction(
            `${user.name} kicked ${targetMember.id} from clan ${clan.name}.`
        );
    },

    claninvites(target, room, user) {
        if (!target) return this.errorReply(`Usage: /claninvites [clan]`);

        const clanId = toID(target);
        const clan = clanDatabase.getAllClans().find(c => c.id === clanId);
        if (!clan) {
            return this.errorReply(`Clan "${target}" not found.`);
        }

        const member = clan.members.find(m => m.id === toID(user.id));
        if (!member || member.rank < ClanRank.DEPUTY) {
            return this.errorReply(`Access denied. You must be a clan deputy or leader to view invites.`);
        }

        const invites = clanInviteDatabase.getInvites()
            .filter(invite => invite.clanId === clanId && invite.expiresAt > Date.now());

        if (!invites.length) {
            return this.sendReplyBox(
                `<div class="pad"><h2>${Chat.escapeHTML(clan.name)} - Pending Invites</h2>` +
                `<i>No pending invites</i></div>`
            );
        }

        const buf = [
            `<div class="pad"><h2>${Chat.escapeHTML(clan.name)} - Pending Invites</h2>`
        ];

        for (const invite of invites) {
            const inviter = Users.get(invite.inviterId)?.name || invite.inviterId;
            const invitee = Users.get(invite.inviteeId)?.name || invite.inviteeId;
            const expires = Chat.toDurationString(invite.expiresAt - Date.now(), {precision: 1});

            buf.push(
                `<div class="infobox">` +
                `Invited User: ${Chat.escapeHTML(invitee)}<br />` +
                `Invited By: ${Chat.escapeHTML(inviter)}<br />` +
                `Expires: ${expires}<br />` +
                `<button class="button" name="send" value="/clancancel ${invite.id}">` +
                `Cancel Invite</button></div>`
            );
        }

        buf.push(`</div>`);
        return this.sendReplyBox(buf.join(''));
    },

    clancancel(target, room, user) {
        if (!target) return this.errorReply(`Usage: /clancancel [invite code]`);

        const invite = clanInviteDatabase.getInvites().find(i => i.id === target);
        if (!invite) {
            return this.errorReply(`Invalid invite code.`);
        }

        const clan = clanDatabase.getAllClans().find(c => c.id === invite.clanId);
        if (!clan) {
            return this.errorReply(`The clan no longer exists.`);
        }

        const member = clan.members.find(m => m.id === toID(user.id));
        if (!member || member.rank < ClanRank.DEPUTY) {
            return this.errorReply(`Access denied. You must be a clan deputy or leader to cancel invites.`);
        }

        void clanInviteDatabase.removeInvite(invite.id);

        const invitee = Users.get(invite.inviteeId);
        if (invitee?.connected) {
            invitee.send(`|pm|${user.name}|${invitee.name}|Your clan invitation to ${clan.name} has been cancelled.`);
        }

        this.globalModlog('CLANINVITECANCEL', invite.inviteeId, `to ${clan.name} (by ${user.name})`);
        return this.sendReply(`The clan invitation for ${invite.inviteeId} has been cancelled.`);
    },
};
