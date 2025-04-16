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
                let clanDisplay = `${clan.name} - Leader: ${Users.get(clan.leader)?.name || clan.leader} ` +
                    `(${clan.members.length} members, ${clan.points} points) [${roomStatus}]`;
                
                // Add icon indicator if clan has one
                if (clan.icon) {
                    clanDisplay = `<img src="${Chat.escapeHTML(clan.icon)}" width="16" height="16" alt="Icon" /> ${clanDisplay}`;
                }
                
                return clanDisplay;
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
            `<strong>Clan: ${Chat.escapeHTML(clan.name)}</strong>`
        ];

        // Add icon if exists
        if (clan.icon) {
            output.push(`<img src="${Chat.escapeHTML(clan.icon)}" width="32" height="32" alt="${Chat.escapeHTML(clan.name)} Icon" />`);
        }

        output.push(
            `Leader: ${Users.get(clan.leader)?.name || clan.leader}`,
            `Members (${clan.members.length}): ${members}`,
            `Points: ${clan.points}`,
            `Room Status: ${roomStatus}`,
            `Created: ${Chat.toTimestamp(new Date(clan.createdAt))}`
        );

        // Add description if exists
        if (clan.description) {
            output.push(`Description: ${Chat.escapeHTML(clan.description)}`);
        }

        return this.sendReplyBox(output.join('<br />'));
    },

	async viewclaninvite(target, room, user) {
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
        `To accept this invite, use: /clanaccept ${invite.id}`,
        `</div>`
    ].join('');

    this.sendReplyBox(`|raw|${output}`);
	},
	
async clanauth(target, room, user) {
    // Don't allow broadcasting for popups
    if (this.broadcasting) {
        throw new Chat.ErrorMessage(`This command can't be broadcast.`);
    }

    let targetClan;
    if (!target) {
        // If no target specified, try to get the user's clan
        targetClan = await clanDatabase.findClanByMemberId(user.id);
        if (!targetClan) {
            throw new Chat.ErrorMessage(`You are not in a clan. Use /clanauth [clan name] to view another clan's auth list.`);
        }
    } else {
        // If target specified, try to find that clan
        targetClan = await clanDatabase.getClan(toID(target));
        if (!targetClan) {
            throw new Chat.ErrorMessage(`Clan "${target}" not found.`);
        }
    }

    // Sort members by rank (highest to lowest) and then by join date
    const sortedMembers = [...targetClan.members].sort((a, b) => {
        if (b.rank !== a.rank) return b.rank - a.rank;
        return a.joinedAt - b.joinedAt;
    });

    // Group members by rank
    const authByRank: { [key: number]: string[] } = {};
    for (const member of sortedMembers) {
        const username = Users.get(member.id)?.name || member.id;
        if (!authByRank[member.rank]) authByRank[member.rank] = [];
        authByRank[member.rank].push(username);
    }

    // Create the popup content with CSS styling
    const popupContent = [`<div class="infobox">`];
    
    // Header with clan name and icon
    popupContent.push(`<div style="text-align: center; margin-bottom: 10px;">`);
    if (targetClan.icon) {
        popupContent.push(`<img src="${Chat.escapeHTML(targetClan.icon)}" width="32" height="32" alt="Icon" style="vertical-align: middle; margin-right: 10px;" />`);
    }
    popupContent.push(`<h2 style="display: inline-block; margin: 0;">${Chat.escapeHTML(targetClan.name)} Authority</h2></div>`);

    // Description if it exists
    if (targetClan.description) {
        popupContent.push(`<div style="text-align: center; margin-bottom: 10px; font-style: italic;">${Chat.escapeHTML(targetClan.description)}</div>`);
    }

    // Auth lists with styling
    popupContent.push(`<div style="margin: 10px 0;">`);
    if (authByRank[ClanRank.LEADER]?.length) {
        popupContent.push(`<div style="margin: 5px 0;"><strong style="color: #6B1FA6;">Leader (#)</strong>: ${authByRank[ClanRank.LEADER].join(', ')}</div>`);
    }
    if (authByRank[ClanRank.DEPUTY]?.length) {
        popupContent.push(`<div style="margin: 5px 0;"><strong style="color: #007AA3;">Deputies (@)</strong>: ${authByRank[ClanRank.DEPUTY].join(', ')}</div>`);
    }
    if (authByRank[ClanRank.SENIOR]?.length) {
        popupContent.push(`<div style="margin: 5px 0;"><strong style="color: #44934A;">Seniors (%)</strong>: ${authByRank[ClanRank.SENIOR].join(', ')}</div>`);
    }
    if (authByRank[ClanRank.MEMBER]?.length) {
        popupContent.push(`<div style="margin: 5px 0;"><strong style="color: #6E7175;">Members (+)</strong>: ${authByRank[ClanRank.MEMBER].join(', ')}</div>`);
    }
    popupContent.push(`</div>`);

    // Statistics section
    popupContent.push(`<div style="border-top: 1px solid #AAA; margin-top: 10px; padding-top: 10px;">`);
    popupContent.push(`<strong>Statistics:</strong>`);
    popupContent.push(`<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin-top: 5px;">`);
    popupContent.push(`<div>Leaders: ${authByRank[ClanRank.LEADER]?.length || 0}</div>`);
    popupContent.push(`<div>Deputies: ${authByRank[ClanRank.DEPUTY]?.length || 0}</div>`);
    popupContent.push(`<div>Seniors: ${authByRank[ClanRank.SENIOR]?.length || 0}</div>`);
    popupContent.push(`<div>Members: ${authByRank[ClanRank.MEMBER]?.length || 0}</div>`);
    popupContent.push(`<div style="grid-column: span 2; text-align: center; margin-top: 5px;">`);
    popupContent.push(`<strong>Total Members: ${sortedMembers.length}</strong>`);
    popupContent.push(`</div></div></div>`);

    // Points display
    popupContent.push(`<div style="text-align: center; margin-top: 10px;">`);
    popupContent.push(`<strong>Clan Points:</strong> ${targetClan.points}`);
    popupContent.push(`</div>`);

    // Created date
    popupContent.push(`<div style="text-align: center; margin-top: 10px; font-size: 0.9em; color: #666;">`);
    popupContent.push(`Created: ${Chat.toTimestamp(new Date(targetClan.createdAt))}`);
    popupContent.push(`</div>`);

    popupContent.push(`</div>`);

    return this.popup(`${popupContent.join('')} ${targetClan.name} Authority`);
},
};
