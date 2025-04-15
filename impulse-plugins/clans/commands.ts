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
    createclan: {
        requiresAdmin: true,
        help: `[clan name], [leader] - Creates a new clan. Requires admin privileges.`,
        command(target, room, user) {
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
        }
    },

    deleteclan: {
        requiresAdmin: true,
        help: `[clan name] - Deletes a clan. Requires admin privileges.`,
        command(target, room, user) {
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
        }
    },

    clanicon: {
        help: `[url] - Sets the clan icon. Requires Co-Leader or higher.`,
        command(target, room, user) {
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
        }
    },

    clandesc: {
        help: `[description] - Sets the clan description. Requires Co-Leader or higher.`,
        command(target, room, user) {
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
        }
    },

    clanrank: {
        help: `[user], [rank] - Sets a user's clan rank. Requires appropriate privileges.`,
        command(target, room, user) {
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
        }
    },

    claninvite: {
        help: `[user] - Invites a user to your clan. Requires Veteran rank or higher.`,
        command(target, room, user) {
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
        }
    },

    clanaccept: {
        help: `[clan name] - Accepts an invitation to join a clan.`,
        command(target, room, user) {
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
        }
    },

    claninvites: {
        help: `Shows your pending clan invites.`,
        command(target, room, user) {
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
        }
    },

    clanwar: {
        help: `[clan], [size], [format] - Challenges another clan to a war. Size can be 1-7, format must be a valid battle format.`,
        command(target, room, user) {
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
        }
    },

    clanwaraccept: {
        help: `[war ID] - Accepts a clan war challenge.`,
        command(target, room, user) {
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
        }
    },

    clanwardecline: {
        help: `[war ID] - Declines a clan war challenge.`,
        command(target, room, user) {
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
        }
    },

    clanwarstart: {
        help: `[user] - Starts a clan war match with the specified opponent.`,
        command(target, room, user) {
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
        }
    },

    clanwarhistory: {
        help: `[clan] - Shows the war history of a clan.`,
        command(target, room, user) {
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
        }
    },

    clanwarstatus: {
        help: `[clan] - Shows the current war status of a clan.`,
        command(target, room, user) {
            const clan = target ? Clans.getClan(toID(target)) : Clans.getUserClan(user.id);
            if (!clan) {
                return this.errorReply(target ? 'That clan does not exist.' : 'You are not in a clan.');
            }

            const activeWar = Clans.getActiveClanWar(clan.id);
            const pendingWar = Clans.getPendingClanWar(clan.id);

            let buf = `<div class="infobox"><h2>${clan.name}'s War Status</h2>`;

            if (activeWar) {
                const opponent = Clans.getClan(activeWar.clanA === clan.id ? activeWar.clanB : activeWar.clanA)!;
                buf += `<h3>Active War</h3>`;
                buf += `<strong>Opponent:</strong> ${opponent.name}<br />`;
                buf += `<strong>Format:</strong> ${activeWar.format}<br />`;
                buf += `<strong>Score:</strong> ${activeWar.score[clan.id]}-${activeWar.score[opponent.id]}<br />`;
                buf += `<strong>Matches:</strong><br />`;
                activeWar.matches.forEach((match, i) => {
                    const playerA = Users.get(match.playerA)?.name || match.playerA;
                    const playerB = Users.get(match.playerB)?.name || match.playerB;
                    if (match.completed) {
                        const winner = Users.get(match.winner!)?.name || match.winner;
                        buf += `&bull; Match ${i + 1}: ${playerA} vs ${playerB} - Winner: ${winner}<br />`;
                    } else {
                        buf += `&bull; Match ${i + 1}: ${playerA} vs ${playerB} - In Progress<br />`;
                    }
                });
            } else if (pendingWar) {
                const opponent = Clans.getClan(pendingWar.clanA === clan.id ? pendingWar.clanB : pendingWar.clanA)!;
                buf += `<h3>Pending War</h3>`;
                buf += `<strong>Against:</strong> ${opponent.name}<br />`;
                buf += `<strong>Format:</strong> ${pendingWar.format}<br />`;
                buf += `<strong>Size:</strong> ${pendingWar.size} battles<br />`;
                buf += `<strong>Status:</strong> Waiting for ${pendingWar.clanA === clan.id ? opponent.name : clan.name} to accept<br />`;
            } else {
                buf += `No active or pending wars.`;
    
