/**************************************
 * Pokemon Safari Zone Game Commands  *
 * Author: @musaddiktemkar            *
 **************************************/

import { SafariGame } from './game';
import { SafariConstants } from './constants';

export const commands: Chat.ChatCommands = {
    safari(target, room, user) {
        if (!room) return this.errorReply("This command can only be used in a room.");
        const [cmd, ...args] = target.split(' ');

        switch ((cmd || '').toLowerCase()) {
            case 'new':
            case 'create': {
                this.checkCan('mute', null, room);
                if (room.safari) return this.errorReply("A Safari game is already running in this room.");
                
                const [prizePoolStr, ballsStr] = args.join(' ').split(',').map(arg => arg.trim());
                const prizePool = parseInt(prizePoolStr);
                const balls = parseInt(ballsStr);
                
                if (!prizePoolStr || isNaN(prizePool) || prizePool < SafariConstants.MIN_PRIZE_POOL || prizePool > SafariConstants.MAX_PRIZE_POOL) {
                    return this.errorReply(`Please enter a valid prize pool amount (${SafariConstants.MIN_PRIZE_POOL}-${SafariConstants.MAX_PRIZE_POOL} coins).`);
                }

                if (ballsStr && (isNaN(balls) || balls < SafariConstants.MIN_BALLS || balls > SafariConstants.MAX_BALLS)) {
                    return this.errorReply(`Please enter a valid number of balls (${SafariConstants.MIN_BALLS}-${SafariConstants.MAX_BALLS}).`);
                }
                
                room.safari = new SafariGame(room, user.name, prizePool, balls);
                this.modlog('SAFARI', null, `started by ${user.name} with ${prizePool} coin prize pool and ${balls || SafariConstants.DEFAULT_BALLS} balls`);
                return this.privateModAction(`${user.name} started a Safari game with ${prizePool} coin prize pool and ${balls || SafariConstants.DEFAULT_BALLS} balls per player.`);
            }

            case 'join': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const error = room.safari.addPlayer(user);
                if (error) return this.errorReply(error);
                return;
            }

            case 'move': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const direction = args[0]?.toLowerCase();
                if (!SafariConstants.DIRECTIONS.includes(direction as any)) {
                    return this.errorReply("Invalid direction! Use up, down, left, or right.");
                }
                const result = room.safari.handleMovement(user.id, direction as 'up' | 'down' | 'left' | 'right');
                if (result) return this.errorReply(result);
                return;
            }

            case 'spectate': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                if (room.safari.players[user.id]) return this.errorReply("You are already in the game!");
                room.safari.addSpectator(user.id);
                return;
            }

            case 'unspectate': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                room.safari.removeSpectator(user.id);
                return;
            }

            case 'start': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const error = room.safari.start(user);
                if (error) return this.errorReply(error);
                this.modlog('SAFARI', null, `started by ${user.name}`);
                return this.privateModAction(`${user.name} started the Safari game.`);
            }

            case 'throw': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const result = room.safari.throwBall(user);
                if (result) return this.errorReply(result);
                return;
            }

            case 'dq':
            case 'disqualify': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const targetUser = args.join(' ').trim();
                if (!targetUser) return this.errorReply("Please specify a player to disqualify.");
                
                const targetId = toID(targetUser);
                const result = room.safari.disqualifyPlayer(targetId, user.name);
                if (result) {
                    this.modlog('SAFARIDQ', targetUser, `by ${user.name}`);
                    this.privateModAction(result);
                    return;
                }
                return this.errorReply("Failed to disqualify player.");
            }

            case 'end': {
                this.checkCan('mute', null, room);
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                room.safari.end(false);
                this.modlog('SAFARI', null, `ended by ${user.name}`);
                return this.privateModAction(`${user.name} ended the Safari game.`);
            }

            default:
                return this.parse('/help safari');
        }
    },

    safarihelp(target, room, user) {
        if (!this.runBroadcast()) return;
        return this.sendReplyBox(
            '<center><strong>Safari Zone Commands</strong></center>' +
            '<hr />' +
            `<code>/safari create [prizePool],[balls]</code>: Creates a new Safari game with the specified prize pool (${SafariConstants.MIN_PRIZE_POOL}-${SafariConstants.MAX_PRIZE_POOL} coins) and balls per player<br />` +
            '<code>/safari join</code>: Joins the current Safari game.<br />' +
            '<code>/safari start</code>: Starts the Safari game if enough players have joined.<br />' +
            '<code>/safari move [up/down/left/right]</code>: Move in a direction to find a Pokemon.<br />' +
            '<code>/safari throw</code>: Throws a Safari Ball at the encountered Pokemon.<br />' +
            '<code>/safari spectate</code>: Watch an ongoing Safari game.<br />' +
            '<code>/safari unspectate</code>: Stop watching a Safari game.<br />' +
            '<code>/safari dq [player]</code>: Disqualifies a player from the game (only usable by game creator).<br />' +
            '<code>/safari end</code>: Ends the current Safari game. Requires: @ # &<br />' +
            '<hr />' +
            '<strong>Game Rules:</strong><br />' +
            `- No entry fee required<br />` +
            `- Minimum ${SafariConstants.MIN_PLAYERS} players required to start<br />` +
            `- Each player gets ${SafariConstants.MIN_BALLS}-${SafariConstants.MAX_BALLS} Safari Balls (default: ${SafariConstants.DEFAULT_BALLS})<br />` +
            `- On your turn, first choose a direction to move<br />` +
            `- After moving, a Pokemon may appear which you can try to catch<br />` +
            `- ${SafariConstants.TURN_TIME / 1000} second time limit per turn<br />` +
            '- Game ends when all players use their balls<br />' +
            `- Prizes: 1st (${SafariConstants.PRIZE_DISTRIBUTION.FIRST * 100}%), ` +
            `2nd (${SafariConstants.PRIZE_DISTRIBUTION.SECOND * 100}%), ` +
            `3rd (${SafariConstants.PRIZE_DISTRIBUTION.THIRD * 100}%) of prize pool<br />` +
            '- Players can be disqualified by the game creator'
        );
    }
};
