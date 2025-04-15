import { clanManager } from './manager';

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
};