/**
 * Pokemon Showdown - Battle Tower Commands
 * 
 * Created: 2025-04-17 18:26:16 UTC
 * Author: impulseserver
 * 
 * Command interface for the Battle Tower game system.
 */

import {BattleTower} from '../server/room-battle-tower';

export const commands: ChatCommands = {
    battletower: {
        create(target, room, user) {
            if (!this.can('gamemanagement')) return;
            if (!room) return this.errorReply("This command must be used in a room.");
            
            if (room.game) {
                return this.errorReply("A game is already running in this room.");
            }

            room.game = new BattleTower(room);
            this.privateModAction(`${user.name} created a Battle Tower.`);
            this.modlog('BATTLETOWER CREATE');
        },

        challenge(target, room, user) {
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            if (!user.registered) {
                return this.errorReply("You must be registered to use the Battle Tower.");
            }

            void room.game.startChallenge(user);
        },

        records(target, room, user, connection) {
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            const state = room.game.getPlayerState(user.id);
            this.sendReplyBox(
                `<strong>${user.name}'s Battle Tower Record:</strong><br />` +
                `<strong>Level:</strong> ${state.level}<br />` +
                `<strong>Total Wins:</strong> ${state.wins}<br />` +
                `<strong>Current Streak:</strong> ${state.streak}<br />` +
                (state.currentBattleId ? 
                    `<strong>Status:</strong> <em style="color:green">In Battle</em>` :
                    `<strong>Status:</strong> ${this.getStatusString(state.lastBattleTime)}`)
            );
        },

        ladder(target, room, user) {
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            // Force an update of the ladder display
            room.game.updateDisplay();
            this.sendReply("Battle Tower rankings have been updated.");
        },

        reset(target, room, user, connection) {
            if (!this.can('gamemanagement')) return;
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            const targetUser = Users.get(target);
            if (!targetUser) return this.errorReply("User not found.");

            const state = room.game.getPlayerState(targetUser.id);
            state.level = 1;
            state.wins = 0;
            state.streak = 0;
            state.currentBattleId = null;
            state.lastBattleTime = 0;

            this.privateModAction(`${user.name} reset ${targetUser.name}'s Battle Tower progress.`);
            this.modlog('BATTLETOWER RESET', targetUser, '');
            room.game.updateDisplay();
        },

        end(target, room, user) {
            if (!this.can('gamemanagement')) return;
            
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            room.game.destroy();
            room.game = null;
            this.privateModAction(`${user.name} ended the Battle Tower.`);
            this.modlog('BATTLETOWER END');
        },

        help(target, room, user) {
            this.sendReplyBox(
                `<strong>Battle Tower Commands:</strong><br />` +
                `<code>/battletower create</code> - Creates a new Battle Tower (requires: @ # &)<br />` +
                `<code>/battletower challenge</code> - Challenge the Battle Tower<br />` +
                `<code>/battletower records</code> - View your Battle Tower records<br />` +
                `<code>/battletower ladder</code> - Update and show the rankings<br />` +
                `<code>/battletower reset [user]</code> - Reset a user's progress (requires: @ # &)<br />` +
                `<code>/battletower end</code> - Ends the Battle Tower (requires: @ # &)<br /><br />` +
                `<strong>Rules:</strong><br />` +
                `• Win 3 battles in a row to advance to the next level<br />` +
                `• Higher levels mean tougher opponents<br />` +
                `• 5 minute cooldown between challenges<br />` +
                `• Must be registered to participate`
            );
        },

        [''] (target, room, user) {
            return this.parse('/help battletower');
        },

        // Helper method to get status string
        getStatusString(lastBattleTime: number) {
            const cooldown = 5 * 60 * 1000; // 5 minutes in milliseconds
            const now = Date.now();
            const timeLeft = cooldown - (now - lastBattleTime);
            
            if (timeLeft <= 0) {
                return '<em style="color:blue">Ready</em>';
            }
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.ceil((timeLeft % 60000) / 1000);
            return `<em style="color:red">Cooldown: ${minutes}:${String(seconds).padStart(2, '0')}</em>`;
        }
    }
};
