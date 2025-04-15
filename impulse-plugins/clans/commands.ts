import { clanManager } from './manager';
import { ClanRank, ClanRankNames } from './types';
import { clanDatabase } from './database';

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
            
            this.globalModlog('CLANCREATE', targetUser, `${clan.name} (by ${user.name})`);
            return this.addModAction(
                `${user.name} created the clan ${clan.name} with ${targetUser.name} as the leader.`
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
            await clanManager.deleteClan(clan.id);
            this.globalModlog('CLANDELETE', null, `${clan.name} (by ${user.name})`);
            return this.addModAction(
                `${user.name} deleted the clan ${clan.name}.`
            );
        } catch (error) {
            throw new Chat.ErrorMessage(`Failed to delete clan: ${error.message}`);
        }
    },

    async clanrank(target, room, user) {
        if (!target) {
            throw new Chat.ErrorMessage(`/clanrank [username], [rank] - Sets a user's clan rank. Requires: ${ClanRankNames[ClanRank.LEADER]} or bypassall`);
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
            this.globalModlog('CLANRANK', targetUser, 
                `changed to ${ClanRankNames[newRank]} in ${clan.name} (by ${user.name})`
            );
            return this.addModAction(
                `${user.name} changed ${targetUser.name}'s rank to ${ClanRankNames[newRank]} in clan ${clan.name}.`
            );
        } catch (error) {
            throw new Chat.ErrorMessage(error.message);
        }
    },

    clans(target, room, user) {
        // View all clans or specific clan info
        this.runBroadcast();

        if (this.broadcasting) {
            if (!this.canBroadcast()) return;
        }

        const clans = Array.from(clanDatabase['clans'].values());
        if (!clans.length) {
            return this.sendReply("There are no clans.");
        }

        if (!target) {
            const output = clans.map(clan => 
                `${clan.name} - Leader: ${Users.get(clan.leader)?.name || clan.leader} (${clan.members.length} members)`
            ).join('<br />');
            return this.sendReplyBox(`<strong>Clans:</strong><br />${output}`);
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

        const output = [
            `<strong>Clan: ${clan.name}</strong>`,
            `Leader: ${Users.get(clan.leader)?.name || clan.leader}`,
            `Members (${clan.members.length}): ${members}`,
            `Created: ${new Date(clan.createdAt).toUTCString()}`
        ].join('<br />');

        return this.sendReplyBox(output);
    },
};