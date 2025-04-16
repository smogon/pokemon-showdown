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
    clan: {
        async rank(target, room, user) {
            if (!target) {
                throw new Chat.ErrorMessage(`/clan rank [username], [rank] - Sets a user's clan rank. ` + 
                    `Requires: ${ClanRankNames[ClanRank.LEADER]} or bypassall`);
            }

            const [targetUsername, rankStr] = target.split(',').map(param => param.trim());
            if (!targetUsername || !rankStr) {
                throw new Chat.ErrorMessage(`Usage: /clan rank [username], [rank]`);
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

        async invite(target, room, user) {
            if (!target) {
                throw new Chat.ErrorMessage(`/clan invite [username] - Invites a user to your clan.`);
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
                    `Use <code>/clan accept ${invite.id}</code> to accept. This invite expires in 24 hours.`;
                
                targetUser.send(`|pm|${user.name}|${targetUser.name}|${pmMessage}`);

                sendClanMessage(clan.id, `${user.name} has invited ${targetUser.name} to join the clan.`);
                return this.sendReply(`Invitation sent to ${targetUser.name}. They have 24 hours to accept.`);
            } catch (error) {
                throw new Chat.ErrorMessage(error.message);
            }
        },

        async accept(target, room, user) {
            if (!target) {
                throw new Chat.ErrorMessage(`/clan accept [invite code] - Accepts a clan invitation.`);
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

        async viewinvite(target, room, user) {
            if (!user.id) {
                throw new Chat.ErrorMessage(`You must be logged in to view clan invites.`);
            }

            const invite = await clanManager.getPendingInvite(user.id);
            if (!invite) {
                throw new Chat.ErrorMessage(`You have no pending clan invites.`);
            }

            const clan = await clanDatabase.getClan(invite.clanId);
            if (!clan) {
                // Clean up orphaned invite if clan no longer exists
                await clanInviteDatabase.removeInvite(invite.id);
                throw new Chat.ErrorMessage(`The clan associated with your invite no longer exists.`);
            }

            const inviter = Users.get(invite.inviterId);
            const inviterName = inviter?.name || invite.inviterId;

            const expiresIn = invite.expiresAt - Date.now();
            const hoursLeft = Math.floor(expiresIn / (60 * 60 * 1000));
            const minutesLeft = Math.floor((expiresIn % (60 * 60 * 1000)) / (60 * 1000));

            const output = [
                `<div class="infobox">`,
                `<strong>Your Pending Clan Invite:</strong><br />`,
                `<strong>Clan:</strong> ${Chat.escapeHTML(clan.name)}<br />`,
                `<strong>Invited By:</strong> ${Chat.escapeHTML(inviterName)}<br />`,
                `<strong>Expires In:</strong> ${hoursLeft} hours and ${minutesLeft} minutes<br />`,
                `<strong>Invite ID:</strong> ${invite.id}<br />`,
                `<br />`,
                `To accept this invite, use: /clan accept ${invite.id}`,
                `</div>`
            ].join('');

            this.sendReplyBox(`${output}`);
        },

        async call(target, room, user) {
            if (!target) {
                throw new Chat.ErrorMessage(`/clan call [message] - Sends a notification to all online clan members. Requires: Clan Leader or Deputy`);
            }

            // Find the user's clan
            const clan = await clanDatabase.findClanByMemberId(user.id);
            if (!clan) {
                throw new Chat.ErrorMessage(`You are not in a clan.`);
            }

            // Check if user is Leader or Deputy
            const member = clan.members.find(m => m.id === toID(user.id));
            if (!member || (member.rank !== ClanRank.LEADER && member.rank !== ClanRank.DEPUTY)) {
                throw new Chat.ErrorMessage(`You must be a clan leader or deputy to use /clan call.`);
            }

            // Check if the message is too long
            if (target.length > 500) {
                throw new Chat.ErrorMessage(`The message cannot exceed 500 characters.`);
            }

            // Create a formatted message for the popup
            const popupContent = [
                `<div class="infobox">`,
                `<div style="text-align: center; margin-bottom: 10px;">`,
                `<h2>${Chat.escapeHTML(clan.name)} - Clan Call</h2>`,
                `</div>`,
                `<div style="margin: 10px 0;">`,
                `<strong>From:</strong> ${Chat.escapeHTML(user.name)}`,
                `<br><br>`,
                `<strong>Message:</strong><br>`,
                `${Chat.escapeHTML(target)}`,
                `</div>`,
                `<div style="text-align: right; font-size: 0.9em; color: #666;">`,
                `Sent: ${Chat.toTimestamp(new Date())}`,
                `</div>`,
                `</div>`
            ].join('');

            let notifiedCount = 0;

            // Send popup to all online clan members
            for (const member of clan.members) {
                const targetUser = Users.get(member.id);
                if (targetUser?.connected && targetUser.id !== user.id) { // Don't send to the caller
                    targetUser.popup(`|html|${popupContent}`);
                    notifiedCount++;
                }
            }

            // Log the clan call
            this.globalModlog('CLANCALL', user, `to ${clan.name}`);

            // Send confirmation messages
            sendClanMessage(clan.id, `${user.name} has sent a clan call: ${target}`);
            return this.sendReply(`Your message has been sent to ${notifiedCount} online clan member${notifiedCount !== 1 ? 's' : ''}.`);
        },

        async list(target, room, user) {
            // Allow broadcasting this command
            this.runBroadcast();

            const clans = clanDatabase.getAllClans();
            if (!clans.length) {
                return this.sendReply("There are no clans.");
            }

            // Sort clans by points (highest to lowest)
            const sortedClans = [...clans].sort((a, b) => b.points - a.points);

            // Define table headers
            const headers = ['Rank', 'Clan', 'Leader', 'Members', 'Points', 'Status'];

            // Create data rows
            const dataRows = sortedClans.map((clan, index) => {
                const leader = Users.get(clan.leader)?.name || clan.leader;
                const clanRoom = Rooms.get(clan.id);
                const roomStatus = clanRoom ? '<span style="color: green">Active</span>' : '<span style="color: gray">Inactive</span>';
                
                // Create clan name with icon if exists
                let clanDisplay = Chat.escapeHTML(clan.name);
                if (clan.icon) {
                    clanDisplay = `<img src="${Chat.escapeHTML(clan.icon)}" width="16" height="16" alt="Icon" style="vertical-align: middle; margin-right: 5px;" /> ${clanDisplay}`;
                }

                return [
                    `#${index + 1}`,
                    clanDisplay,
                    Impulse.nameColor(leader, true),
                    String(clan.members.length),
                    String(clan.points),
                    roomStatus
                ];
            });

            // Generate the themed table
            const tableHtml = Impulse.generateThemedTable(
                `${Impulse.serverName} Clan Rankings`,
                headers,
                dataRows,
            );
            return this.sendReplyBox(tableHtml);
        },

        async kick(target, room, user) {
            if (!target) {
                throw new Chat.ErrorMessage(`/clan kick [username] - Kicks a user from your clan. Requires: Clan Leader or Deputy`);
            }

            const targetUser = Users.getExact(target);
            const targetId = toID(target);
            if (!targetId) {
                throw new Chat.ErrorMessage(`Please specify a valid username to kick.`);
            }

            // Find the kicker's clan
            const kickerClan = await clanDatabase.findClanByMemberId(user.id);
            if (!kickerClan) {
                throw new Chat.ErrorMessage(`You are not in a clan.`);
            }

            // Check if kicker has permission (must be leader or deputy)
            const kicker = kickerClan.members.find(m => m.id === user.id);
            if (!kicker || (kicker.rank !== ClanRank.LEADER && kicker.rank !== ClanRank.DEPUTY)) {
                throw new Chat.ErrorMessage(`You must be a clan leader or deputy to kick members.`);
            }

            // Find target member in the clan
            const targetMember = kickerClan.members.find(m => m.id === targetId);
            if (!targetMember) {
                throw new Chat.ErrorMessage(`${targetUser ? targetUser.name : target} is not in your clan.`);
            }

            // Prevent kicking leaders
            if (targetMember.rank === ClanRank.LEADER) {
                throw new Chat.ErrorMessage(`You cannot kick the clan leader.`);
            }

            // Prevent deputies from kicking other deputies
            if (kicker.rank === ClanRank.DEPUTY && targetMember.rank === ClanRank.DEPUTY) {
                throw new Chat.ErrorMessage(`Deputies cannot kick other deputies.`);
            }

            // Remove member from clan
            kickerClan.members = kickerClan.members.filter(m => m.id !== targetId);
            await clanDatabase.saveClan(kickerClan);

            // Remove room auth if clan room exists
            const clanRoom = Rooms.get(kickerClan.id);
            if (clanRoom) {
                clanRoom.auth.delete(targetId);
                clanRoom.saveSettings();
            }

            // Notify the kicked user if they're online
            if (targetUser?.connected) {
                targetUser.send(`|pm|${user.name}|${targetUser.name}|You have been kicked from clan ${kickerClan.name}.`);
            }

            // Log the action and send notifications
            this.globalModlog('CLANKICK', targetUser || targetId, `from ${kickerClan.name} (by ${user.name})`);
            sendClanMessage(kickerClan.id, `${targetUser ? targetUser.name : target} has been kicked from the clan by ${user.name}.`);
            
            return this.sendReply(`Successfully kicked ${targetUser ? targetUser.name : target} from clan ${kickerClan.name}.`);
        },

        async leave(target, room, user) {
            // Find user's clan
            const clan = await clanDatabase.findClanByMemberId(user.id);
            if (!clan) {
                throw new Chat.ErrorMessage(`You are not in a clan.`);
            }

            // Find the member in the clan
            const member = clan.members.find(m => m.id === user.id);
            if (!member) {
                throw new Chat.ErrorMessage(`An error occurred finding your clan membership.`);
            }

            // Prevent leader from leaving without transferring leadership
            if (member.rank === ClanRank.LEADER) {
                throw new Chat.ErrorMessage(`As the clan leader, you must transfer leadership before leaving. Use /clan rank [new leader], Leader`);
            }

            // Create confirmation button
            if (!target || target !== 'confirm') {
                return this.sendReply(
                    `Are you sure you want to leave clan ${clan.name}? ` +
                    `This cannot be undone. Use /clan leave confirm to confirm.`
                );
            }

            // Remove member from clan
            clan.members = clan.members.filter(m => m.id !== user.id);
            await clanDatabase.saveClan(clan);

            // Remove room auth if clan room exists
            const clanRoom = Rooms.get(clan.id);
            if (clanRoom) {
                clanRoom.auth.delete(user.id);
                clanRoom.saveSettings();

                // Remove user from clan room if they're in it
                if (clanRoom.users[user.id]) {
                    for (const connection of user.connections) {
                        user.leaveRoom(clanRoom, connection);
                    }
                }
            }

            // Log the action and send notifications
            const leaveTime = Chat.toTimestamp(new Date()).split(' ')[1];
            this.globalModlog('CLANLEAVE', user, `left ${clan.name}`);
            sendClanMessage(clan.id, `${user.name} has left the clan at ${leaveTime}.`);

            // Send confirmation to the user
            const confirmationMessage = [
                `You have successfully left clan ${clan.name}.`,
                `You have lost your clan rank of ${ClanRankNames[member.rank]}.`,
                `To join another clan, you'll need to be invited using /clan invite.`
            ].join(' ');

            return this.sendReply(confirmationMessage);
        },

        help(target, room, user) {
            if (!this.runBroadcast()) return;
            this.sendReplyBox(
                `<div class="infobox">` +
                `<center><strong>Clan Commands:</strong></center><br/>` +
                `<ul>` +
                `<li><code>/clan rank [username], [rank]</code> - Changes a user's clan rank. Requires: Clan Leader</li>` +
                `<li><code>/clan invite [username]</code> - Invites a user to your clan. Requires: Clan Leader or Deputy</li>` +
                `<li><code>/clan accept [invite code]</code> - Accepts a clan invitation.</li>` +
                `<li><code>/clan viewinvite</code> - Views your pending clan invitation.</li>` +
                `<li><code>/clan call [message]</code> - Sends a notification to all online clan members. Requires: Clan Leader or Deputy</li>` +
                `<li><code>/clan list</code> - Shows a list of all clans and their rankings.</li>` +
                `<li><code>/clan kick [username]</code> - Kicks a user from your clan. Requires: Clan Leader or Deputy</li>` +
                `<li><code>/clan leave</code> - Leaves your current clan. Leaders must transfer leadership first.</li>` +
                `</ul>` +
                `</div>`
      
