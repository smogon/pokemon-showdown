import {BattleTower} from '../../server/room-battle-tower';

export const commands: Chat.Commands = {
    battletower: {
        create(target, room, user) {
            if (!this.can('gamemanagement')) return;
            if (!room) return this.errorReply("This command must be used in a room.");
            if (room.game) return this.errorReply("A game is already running in this room.");

            room.game = new BattleTower(room);
            room.add(`|raw|<div class="broadcast-blue"><strong>A Battle Tower has been created!</strong><br />Use /battletower challenge to start climbing!</div>`).update();
        },

        challenge(target, room, user) {
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            void room.game.startChallenge(user);
        },

        end(target, room, user) {
            if (!this.can('gamemanagement')) return;
            if (!room?.game || !(room.game instanceof BattleTower)) {
                return this.errorReply("There is no Battle Tower running in this room.");
            }

            room.game.destroy();
            room.add(`|raw|<div class="broadcast-blue">The Battle Tower has been ended by ${user.name}.</div>`).update();
        },

        help() {
            this.sendReplyBox(
                `Battle Tower commands:<br />` +
                `/battletower create - Creates a new Battle Tower (requires: @ # &)<br />` +
                `/battletower challenge - Challenge the Battle Tower<br />` +
                `/battletower end - Ends the Battle Tower (requires: @ # &)`
            );
        }
    }
};
