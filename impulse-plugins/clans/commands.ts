import { Clans } from './clans';
import { 
    ClanRank, 
    getRankName, 
    canManageRank, 
    canInviteMembers, 
    canManageClanInfo,
    canManageWars,
    ClanWarState
} from './types';

export const commands: Chat.Commands = {
    createclan(target, room, user) {
		      this.checkCan('bypassall');
            if (!target) return this.parse('/help createclan');
            
            const [name, leaderId] = target.split(',').map(part => part.trim());
            
            if (!name || !leaderId) {
                return this.errorReply('Usage: /createclan [clan name], [leader]');
            }

            const targetUser = Users.get(leaderId);
            if (!targetUser?.connected) {
                return this.errorReply(`The specified leader must be online.`);
            }

            if (Clans.createClan(name, targetUser.id, user.id)) {
                this.addModAction(`${user.name} created a new clan "${name}" with ${targetUser.name} as the leader.`);
                this.modlog('CLANCREATE', null, `${name} - Leader: ${targetUser.name}`);
                return this.sendReply(`Clan "${name}" has been created successfully with ${targetUser.name} as the leader.`);
            } else {
                return this.errorReply('Failed to create clan. The name might be taken.');
            }
        },

    deleteclan(target, room, user) {
		      this.checkCan('bypassall');
            if (!target) return this.parse('/help deleteclan');
            
            const clanId = toID(target);
            const clan = Clans.getClan(clanId);
            
            if (!clan) {
                return this.errorReply('That clan does not exist.');
            }

            if (Clans.deleteClan(clanId)) {
                this.addModAction(`${user.name} deleted the clan "${clan.name}".`);
                this.modlog('CLANDELETE', null, clan.name);
                return this.sendReply(`Clan "${clan.name}" has been deleted.`);
            } else {
                return this.errorReply('Failed to delete clan.');
            }
        },

    clanicon(target, room, user) {
            if (!target) return this.parse('/help clanicon');

            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            if (!canManageClanInfo(user, clan)) {
                return this.errorReply('You must be at least a Co-Leader to change the clan icon.');
            }

            if (!/^https?:\/\/.+\/.+/.test(target)) {
                return this.errorReply('Please provide a valid image URL. It must start with http:// or https://');
            }

            if (!/\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(target)) {
                return this.errorReply('The URL must point to a PNG, JPG, GIF, or WEBP image.');
            }

            if (Clans.setClanIcon(clan.id, target, user.id)) {
                this.addModAction(`${user.name} updated the icon for clan ${clan.name}.`);
                this.modlog('CLANICON', null, clan.name);
                return this.sendReply('Clan icon has been updated.');
            } else {
                return this.errorReply('Failed to update clan icon.');
            }
        },

    clandesc(target, room, user) {
            if (!target) return this.parse('/help clandesc');

            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            if (!canManageClanInfo(user, clan)) {
                return this.errorReply('You must be at least a Co-Leader to change the clan description.');
            }

            if (target.length > 500) {
                return this.errorReply('Description cannot be longer than 500 characters.');
            }

            if (Clans.setClanDescription(clan.id, target, user.id)) {
                this.addModAction(`${user.name} updated the description for clan ${clan.name}.`);
                this.modlog('CLANDESC', null, clan.name);
                return this.sendReply('Clan description has been updated.');
            } else {
                return this.errorReply('Failed to update clan description.');
            }
        },

    clanrank(target, room, user) {
            if (!target) return this.parse('/help clanrank');
            
            const [targetUsername, rankStr] = target.split(',').map(part => part.trim());
            const targetUser = Users.get(toID(targetUsername));
            if (!targetUser) return this.errorReply('User not found.');

            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            const rankNames = Object.values(ClanRank)
                .filter(rank => typeof rank === 'string')
                .map(rank => rank.toLowerCase());
            
            const rankIndex = rankNames.indexOf(rankStr.toLowerCase());
            if (rankIndex === -1) {
                return this.errorReply(`Invalid rank. Valid ranks are: ${rankNames.join(', ')}`);
            }

            const newRank = rankIndex as ClanRank;
            
            if (!canManageRank(user, clan, newRank)) {
                return this.errorReply('You cannot set users to this rank.');
            }

            if (Clans.setRank(clan.id, targetUser.id, newRank, user.id)) {
                this.addModAction(`${targetUser.name} was set to ${getRankName(newRank)} rank in clan ${clan.name} by ${user.name}.`);
                this.modlog('CLANRANK', targetUser.id, getRankName(newRank));
                return this.sendReply(`${targetUser.name} was set to ${getRankName(newRank)}.`);
            } else {
                return this.errorReply(`Failed to set ${targetUser.name}'s rank. They might not be in your clan or you might not have permission.`);
            }
        },

    claninvite(target, room, user) {
            if (!target) return this.parse('/help claninvite');
            
            const targetUser = Users.get(toID(target));
            if (!targetUser?.connected) {
                return this.errorReply('The user must be online to be invited.');
            }

            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            const member = clan.members.find(m => m.userid === user.id);
            if (!member || !canInviteMembers(member.rank)) {
                return this.errorReply('You must be at least a Veteran to invite users.');
            }

            if (Clans.inviteUser(clan.id, targetUser.id, user.id)) {
                targetUser.send(`|pm|${user.name}|${targetUser.name}|/raw You have been invited to join the clan ${clan.name}. Use /clanaccept ${clan.name} to accept the invitation.`);
                return this.sendReply(`${targetUser.name} has been invited to the clan.`);
            } else {
                return this.errorReply('Failed to invite user. They might already be in a clan or have a pending invite.');
            }
        },

    clanaccept(target, room, user) {
            if (!target) return this.parse('/help clanaccept');
            
            const clanId = toID(target);
            const invites = Clans.getInvites(user.id);
            
            if (!invites.length) {
                return this.errorReply('You have no pending clan invites.');
            }

            if (Clans.acceptInvite(user.id, clanId)) {
                const clan = Clans.getClan(clanId);
                this.addModAction(`${user.name} joined clan ${clan.name}.`);
                return this.sendReply(`You have successfully joined clan ${clan.name}!`);
            } else {
                return this.errorReply('Failed to accept invite. The invite might have expired.');
            }
        },

    claninvites(target, room, user) {
            const invites = Clans.getInvites(user.id);
            
            if (!invites.length) {
                return this.sendReply('You have no pending clan invites.');
            }

            let buf = `<div class="infobox"><h2>Pending Clan Invites</h2>`;
            invites.forEach(invite => {
                const clan = Clans.getClan(invite.clanId);
                if (!clan) return;
                
                const inviter = Users.get(invite.inviterId);
                const inviterName = inviter ? inviter.name : invite.inviterId;
                const expiresIn = Math.ceil((invite.expires.getTime() - Date.now()) / (1000 * 60 * 60));
                
                buf += `<strong>${clan.name}</strong> (invited by ${inviterName}, expires in ${expiresIn} hours)<br />`;
                buf += `Use /clanaccept ${clan.name} to join.<br /><br />`;
            });
            buf += `</div>`;
            return this.sendReplyBox(buf);
	 },

    clanwar(target, room, user) {
            if (!target) return this.parse('/help clanwar');
            
            const [targetClan, sizeStr, format] = target.split(',').map(part => part.trim());
            
            const userClan = Clans.getUserClan(user.id);
            if (!userClan) return this.errorReply('You are not in a clan.');

            if (!canManageWars(user, userClan)) {
                return this.errorReply('You must be at least an Officer to initiate clan wars.');
            }

            const targetClanObj = Clans.getClan(toID(targetClan));
            if (!targetClanObj) return this.errorReply('That clan does not exist.');

            if (targetClanObj.id === userClan.id) {
                return this.errorReply('You cannot declare war against your own clan.');
            }

            const size = parseInt(sizeStr);
            if (isNaN(size) || size < 1 || size > 7) {
                return this.errorReply('War size must be between 1 and 7 battles.');
            }

            // Validate format
            if (!Dex.formats.get(format).exists) {
                return this.errorReply('Invalid battle format.');
            }

            const warId = Clans.proposeWar(userClan.id, targetClanObj.id, size, format);
            if (!warId) {
                return this.errorReply('Failed to propose war. One of the clans might already be in a war.');
            }

            this.addModAction(`${user.name} has challenged clan ${targetClanObj.name} to a ${size}-battle war in ${format} format.`);
            this.modlog('CLANWAR', null, `${userClan.name} vs ${targetClanObj.name}`);
            
            // Notify the challenged clan
            const targetClanMembers = targetClanObj.members
                .filter(m => m.rank >= ClanRank.OFFICER)
                .map(m => Users.get(m.userid))
                .filter(u => u?.connected);

            targetClanMembers.forEach(targetUser => {
                targetUser.send(
                    `|pm|${user.name}|${targetUser.name}|/raw Your clan has been challenged to a ${size}-battle war by ${userClan.name}! ` +
                    `Use /clanwaraccept ${warId} to accept or /clanwardecline ${warId} to decline.`
                );
            });

            return this.sendReply(`War challenge sent to ${targetClanObj.name}.`);
        },

    clanwaraccept(target, room, user) {
            if (!target) return this.parse('/help clanwaraccept');
            
            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            if (!canManageWars(user, clan)) {
                return this.errorReply('You must be at least an Officer to accept clan wars.');
            }

            const war = Clans.getWar(target);
            if (!war || war.state !== ClanWarState.PENDING) {
                return this.errorReply('That war challenge is not pending.');
            }

            if (war.clanB !== clan.id) {
                return this.errorReply('This war challenge was not sent to your clan.');
            }

            if (Clans.acceptWar(war.id)) {
                const clanA = Clans.getClan(war.clanA)!;
                this.addModAction(`${user.name} accepted the clan war challenge between ${clanA.name} and ${clan.name}.`);
                this.modlog('CLANWARACCEPT', null, `${clanA.name} vs ${clan.name}`);
                return this.sendReply(`War between ${clanA.name} and ${clan.name} has started!`);
            } else {
                return this.errorReply('Failed to accept war challenge.');
            }
        },

    clanwardecline(target, room, user) {
            if (!target) return this.parse('/help clanwardecline');
            
            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            if (!canManageWars(user, clan)) {
                return this.errorReply('You must be at least an Officer to decline clan wars.');
            }

            const war = Clans.getWar(target);
            if (!war || war.state !== ClanWarState.PENDING) {
                return this.errorReply('That war challenge is not pending.');
            }

            if (war.clanB !== clan.id) {
                return this.errorReply('This war challenge was not sent to your clan.');
            }

            if (Clans.cancelWar(war.id)) {
                const clanA = Clans.getClan(war.clanA)!;
                this.addModAction(`${user.name} declined the clan war challenge between ${clanA.name} and ${clan.name}.`);
                this.modlog('CLANWARDECLINE', null, `${clanA.name} vs ${clan.name}`);
                return this.sendReply(`War challenge declined.`);
            } else {
                return this.errorReply('Failed to decline war challenge.');
            }
        },

    clanwarstart(target, room, user) {
            if (!target) return this.parse('/help clanwarstart');
            if (!room?.battle) return this.errorReply('This command can only be used in battle rooms.');
            
            const targetUser = Users.get(toID(target));
            if (!targetUser?.connected) return this.errorReply('The specified user is not online.');

            const userClan = Clans.getUserClan(user.id);
            const targetClan = Clans.getUserClan(targetUser.id);
            
            if (!userClan || !targetClan) {
                return this.errorReply('Both players must be in clans.');
            }

            // Find active war between these clans
            const war = Clans.getActiveClanWar(userClan.id);
            if (!war || (war.clanA !== targetClan.id && war.clanB !== targetClan.id)) {
                return this.errorReply('There is no active war between your clans.');
            }

            if (Clans.startWarMatch(war.id, user.id, targetUser.id, room.id)) {
                this.addModAction(`A clan war match between ${user.name} and ${targetUser.name} has started!`);
                return this.sendReply('Match started! The result will be automatically recorded when the battle ends.');
            } else {
                return this.errorReply('Failed to start match. Players might already be in other matches.');
            }
        },

    clanwarhistory(target, room, user) {
            const clan = target ? Clans.getClan(toID(target)) : Clans.getUserClan(user.id);
            if (!clan) {
                return this.errorReply(target ? 'That clan does not exist.' : 'You are not in a clan.');
            }

            const wars = Clans.getClanWarHistory(clan.id);
            if (!wars.length) {
                return this.sendReply(`${clan.name} has not participated in any wars yet.`);
            }

            let buf = `<div class="infobox"><h2>${clan.name}'s War History</h2>`;
            wars.forEach(war => {
                const opponent = Clans.getClan(war.clanA === clan.id ? war.clanB : war.clanA)!;
                const won = war.winner === clan.id;
                const score = `${war.score[clan.id]}-${war.score[opponent.id]}`;
                buf += `<strong>${won ? 'Won' : 'Lost'}</strong> vs ${opponent.name} (${score}) - ${war.format} - ${war.endTime!.toDateString()}<br />`;
            });
            buf += `</div>`;
            return this.sendReplyBox(buf);
        },

	    clanwarstatus(target, room, user) {
            const clan = target ? Clans.getClan(toID(target)) : Clans.getUserClan(user.id);
            if (!clan) {
                return this.errorReply(target ? 'That clan does not exist.' : 'You are not in a clan.');
            }

            const activeWar = Clans.getActiveClanWar(clan.id);
            const pendingWar = Clans.getPendingClanWar(clan.id);

            let buf = `<div class="infobox"><h2>${clan.name}'s War Status</h2>`;

            if (activeWar) {
                const opponent = Clans.getClan(activeWar.clanA === clan.id ? activeWar.clanB : activeWar.clanA)!;
                const warDuration = Date.now() - activeWar.startTime.getTime();
                const warDurationHours = Math.floor(warDuration / (1000 * 60 * 60));
                const warDurationMinutes = Math.floor((warDuration % (1000 * 60 * 60)) / (1000 * 60));

                buf += `<h3>Active War</h3>`;
                buf += `<strong>Opponent:</strong> ${opponent.name}<br />`;
                buf += `<strong>Format:</strong> ${activeWar.format}<br />`;
                buf += `<strong>War Size:</strong> ${activeWar.size} battles<br />`;
                buf += `<strong>Duration:</strong> ${warDurationHours}h ${warDurationMinutes}m<br />`;
                buf += `<strong>Score:</strong> <span style="color: ${activeWar.score[clan.id] > activeWar.score[opponent.id] ? 'green' : 'red'}">${activeWar.score[clan.id]}-${activeWar.score[opponent.id]}</span><br />`;
                
                // Progress bar
                const totalMatches = activeWar.size;
                const completedMatches = activeWar.matches.filter(m => m.completed).length;
                const progressPercent = (completedMatches / totalMatches) * 100;
                buf += `<br /><strong>Progress:</strong><br />`;
                buf += `<div style="width: 100%; height: 20px; background-color: #eee; border-radius: 10px;">`;
                buf += `<div style="width: ${progressPercent}%; height: 100%; background-color: #007bff; border-radius: 10px;"></div>`;
                buf += `</div>`;
                buf += `${completedMatches}/${totalMatches} matches completed<br /><br />`;

                // Match details
                buf += `<strong>Matches:</strong><br />`;
                const currentTime = new Date('2025-04-15T06:55:42Z'); // Using the provided UTC time

                activeWar.matches.forEach((match, i) => {
                    const playerA = Users.get(match.playerA)?.name || match.playerA;
                    const playerB = Users.get(match.playerB)?.name || match.playerB;
                    const matchNumber = i + 1;

                    buf += `<div style="margin: 5px 0; padding: 5px; ${match.completed ? 'background-color: #f8f9fa' : 'background-color: #e9ecef'}; border-radius: 5px;">`;
                    buf += `<strong>Match ${matchNumber}:</strong> `;

                    if (match.completed) {
                        const winner = Users.get(match.winner!)?.name || match.winner;
                        const matchDuration = match.timestamp ? 
                            Math.floor((currentTime.getTime() - match.timestamp.getTime()) / (1000 * 60)) : 0;
                        
                        buf += `${playerA} vs ${playerB}<br />`;
                        buf += `Winner: <strong style="color: green">${winner}</strong><br />`;
                        buf += `Duration: ${Math.floor(matchDuration / 60)}h ${matchDuration % 60}m<br />`;
                    } else if (match.roomid) {
                        const matchDuration = match.timestamp ? 
                            Math.floor((currentTime.getTime() - match.timestamp.getTime()) / (1000 * 60)) : 0;
                        
                        buf += `${playerA} vs ${playerB}<br />`;
                        buf += `Status: <span style="color: orange">In Progress</span><br />`;
                        buf += `Duration: ${Math.floor(matchDuration / 60)}h ${matchDuration % 60}m<br />`;
                        buf += `<button class="button" name="send" value="/join ${match.roomid}">Watch Battle</button>`;
                    } else {
                        buf += `<span style="color: #666">Waiting for players...</span>`;
                    }
                    buf += `</div>`;
                });

                // War Statistics
                buf += `<br /><h4>War Statistics:</h4>`;
                const clanWins = activeWar.matches.filter(m => m.completed && 
                    m.winner && Clans.getUserClan(m.winner)?.id === clan.id).length;
                const opponentWins = activeWar.matches.filter(m => m.completed && 
                    m.winner && Clans.getUserClan(m.winner)?.id === opponent.id).length;
                const remainingMatches = activeWar.size - completedMatches;

                buf += `<table style="width: 100%; border-collapse: collapse;">`;
                buf += `<tr><td>Clan Wins:</td><td>${clanWins}</td></tr>`;
                buf += `<tr><td>Opponent Wins:</td><td>${opponentWins}</td></tr>`;
                buf += `<tr><td>Remaining Matches:</td><td>${remainingMatches}</td></tr>`;
                buf += `<tr><td>Win Rate:</td><td>${completedMatches > 0 ? 
                    Math.round((clanWins / completedMatches) * 100) : 0}%</td></tr>`;
                buf += `</table>`;

                // Required wins calculation
                const requiredWins = Math.ceil(activeWar.size / 2);
                const remainingWinsNeeded = requiredWins - activeWar.score[clan.id];
                if (remainingWinsNeeded > 0 && remainingMatches >= remainingWinsNeeded) {
                    buf += `<br /><strong>Needs ${remainingWinsNeeded} more win${remainingWinsNeeded === 1 ? '' : 's'} to win the war.</strong>`;
                } else if (remainingWinsNeeded > remainingMatches) {
                    buf += `<br /><strong style="color: red">Cannot win the war - insufficient remaining matches.</strong>`;
                }

            } else if (pendingWar) {
                const opponent = Clans.getClan(pendingWar.clanA === clan.id ? pendingWar.clanB : pendingWar.clanA)!;
                const pendingDuration = Math.floor((currentTime.getTime() - pendingWar.startTime.getTime()) / (1000 * 60));
                
                buf += `<h3>Pending War</h3>`;
                buf += `<strong>Against:</strong> ${opponent.name}<br />`;
                buf += `<strong>Format:</strong> ${pendingWar.format}<br />`;
                buf += `<strong>Size:</strong> ${pendingWar.size} battles<br />`;
                buf += `<strong>Pending for:</strong> ${Math.floor(pendingDuration / 60)}h ${pendingDuration % 60}m<br />`;
                buf += `<strong>Status:</strong> Waiting for ${pendingWar.clanA === clan.id ? opponent.name : clan.name} to accept<br />`;
                
                if (pendingWar.clanB === clan.id) {
                    buf += `<br /><button class="button" name="send" value="/clanwaraccept ${pendingWar.id}">Accept War</button> `;
                    buf += `<button class="button" name="send" value="/clanwardecline ${pendingWar.id}">Decline War</button>`;
                }
            } else {
                buf += `No active or pending wars.<br /><br />`;
                buf += `Use /clanwar [clan], [size], [format] to challenge another clan!`;
            }

            buf += `</div>`;
            return this.sendReplyBox(buf);
        },

	    leaveclan(target, room, user) {
            const clan = Clans.getUserClan(user.id);
            if (!clan) return this.errorReply('You are not in a clan.');

            if (clan.leader === user.id) {
                return this.errorReply('Clan leaders cannot leave their clan. Transfer leadership first using /clanrank.');
            }

            if (Clans.leaveClan(user.id)) {
                this.addModAction(`${user.name} left clan ${clan.name}.`);
                this.modlog('CLANLEAVE', null, clan.name);
                return this.sendReply(`You have left clan ${clan.name}.`);
            } else {
                return this.errorReply('Failed to leave clan.');
            }
        },

    clanhelp(target, room, user) {
            let buf = `<details class="readmore"><summary><h2>Clan Commands:</h2></summary>`;
            buf += `<h3>General Commands:</h3>`;
            buf += `<code>/clan [name]</code> - Shows information about a clan.<br />`;
            buf += `<code>/clans</code> - Shows the list of all clans.<br />`;
            buf += `<code>/clanranks</code> - Shows the clan rank hierarchy and permissions.<br />`;
            buf += `<code>/leaveclan</code> - Leaves your current clan.<br />`;
            
            buf += `<h3>Invitation Commands:</h3>`;
            buf += `<code>/claninvite [user]</code> - Invites a user to your clan (requires Veteran+).<br />`;
            buf += `<code>/claninvites</code> - Shows your pending clan invites.<br />`;
            buf += `<code>/clanaccept [clan name]</code> - Accepts an invitation to join a clan.<br />`;
            
            buf += `<h3>Management Commands:</h3>`;
            buf += `<code>/clanrank [user], [rank]</code> - Sets a user's clan rank (requires appropriate privileges).<br />`;
            buf += `<code>/clanicon [url]</code> - Sets the clan icon (requires Co-Leader+).<br />`;
            buf += `<code>/clandesc [description]</code> - Sets the clan description (requires Co-Leader+).<br />`;
            
            buf += `<h3>War Commands:</h3>`;
            buf += `<code>/clanwar [clan], [size], [format]</code> - Challenges another clan to a war (requires Officer+).<br />`;
            buf += `<code>/clanwaraccept [war ID]</code> - Accepts a clan war challenge (requires Officer+).<br />`;
            buf += `<code>/clanwardecline [war ID]</code> - Declines a clan war challenge (requires Officer+).<br />`;
            buf += `<code>/clanwarstart [user]</code> - Starts a clan war match with the specified opponent.<br />`;
            buf += `<code>/clanwarhistory [clan]</code> - Shows the war history of a clan.<br />`;
            buf += `<code>/clanwarstatus [clan]</code> - Shows the current war status of a clan.<br />`;
            
            if (user.can('admin')) {
                buf += `<h3>Admin Commands:</h3>`;
                buf += `<code>/createclan [clan name], [leader]</code> - Creates a new clan.<br />`;
                buf += `<code>/deleteclan [clan name]</code> - Deletes a clan.<br />`;
            }

            buf += `<h3>Ranks and Permissions:</h3>`;
            buf += `<strong>Leader:</strong> Full control over clan<br />`;
            buf += `<strong>Co-Leader:</strong> Can manage all ranks except leader, change clan icon and description<br />`;
            buf += `<strong>Officer:</strong> Can invite members, manage lower ranks, and manage clan wars<br />`;
            buf += `<strong>Veteran:</strong> Can invite new members<br />`;
            buf += `<strong>Elite:</strong> Experienced member status<br />`;
            buf += `<strong>Member:</strong> Basic member permissions<br />`;
            
            buf += `</details>`;
            return this.sendReplyBox(buf);
        },
};

// Add battle room integration for clan wars
export const handlers = {
    onBattleEnd: function (room: GameRoom, winner: string) {
        // Skip if no winner or room
        if (!room || !winner) return;

        // Get clans for both players
        const p1 = Users.get(room.p1.id);
        const p2 = Users.get(room.p2.id);
        if (!p1 || !p2) return;

        const p1Clan = Clans.getUserClan(p1.id);
        const p2Clan = Clans.getUserClan(p2.id);
        if (!p1Clan || !p2Clan) return;

        // Check for active war between these clans
        const war = Clans.getActiveClanWar(p1Clan.id);
        if (!war || (war.clanA !== p2Clan.id && war.clanB !== p2Clan.id)) return;

        // Find matching battle in war
        const match = war.matches.find(m => m.roomid === room.id && !m.completed);
        if (!match) return;

        // End the match
        if (Clans.endWarMatch(war.id, room.id, winner)) {
            room.add(`|raw|<div class="broadcast-green">Clan war match completed! Winner: ${winner}</div>`);
            if (war.state === ClanWarState.COMPLETED) {
                const winnerClan = Clans.getClan(war.winner!)!;
                room.add(`|raw|<div class="broadcast-green">The clan war has ended! Winner: ${winnerClan.name}</div>`);
            }
        }
    }
};
