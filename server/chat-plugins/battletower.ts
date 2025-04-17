import {BattleTower} from '../../server/room-battle-tower';

export const commands: Chat.Commands = {
    tower: 'battletower',
    battletower: {
        create(target, room, user) {
            if (!this.can('gamemanagement')) return;
            if (!room) return this.errorReply("This command must be used in a room.");
            
            if (room.game) {
                return this.errorReply("A game is already running in this room.");
            }

            // @ts-ignore
            room.game = new BattleTower(room);
            room.add(
                `|raw|<div class="broadcast-blue"><strong>A Battle Tower has been created by ${user.name}!</strong><br />` +
                `Use /tower challenge to start climbing!</div>`
            ).update();
        },

        challenge(target, room, user) {
            const tower = room?.game;
            if (!tower || !(tower instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            void tower.startChallenge(user);
        },

        end(target, room, user) {
            if (!this.can('gamemanagement')) return;
            
            const tower = room?.game;
            if (!tower || !(tower instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            tower.destroy();
            room.game = null;
            room.add(`|raw|<div class="broadcast-blue">The Battle Tower has been ended by ${user.name}.</div>`).update();
        },

        help() {
            this.sendReplyBox(
                `Battle Tower commands:<br />` +
                `/tower create - Creates a new Battle Tower (requires: @ # &)<br />` +
                `/tower challenge - Challenge the Battle Tower<br />` +
                `/tower end - Ends the Battle Tower (requires: @ # &)`
            );
        }
    }
};
