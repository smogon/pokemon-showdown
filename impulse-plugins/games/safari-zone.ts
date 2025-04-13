/*************************************
 * Pokemon Safari Zone Game          *
 * Author: @musaddiktemkar           *
 **************************************/

import { FS } from '../../lib/fs';

interface Player {
    name: string;
    id: string;
    points: number;
    catches: Pokemon[];
    ballsLeft: number;
    lastCatch: number;
}

interface Pokemon {
    name: string;
    rarity: number;
    points: number;
    sprite: string;
}

class SafariGame {
    private room: ChatRoom;
    private entryFee: number;
    private players: {[k: string]: Player};
    private timer: NodeJS.Timeout | null;
    private status: 'waiting' | 'started' | 'ended';
    private prizePool: number;
    private gameId: string;
    private host: string;
    private lastCatchMessage: string | null;
    private lastDisplayUpdate: number;
    private displayUpdateTimeout: NodeJS.Timeout | null;

    private static readonly INACTIVE_TIME = 2 * 60 * 1000;
    private static readonly CATCH_COOLDOWN = 2 * 1000;
    private static readonly MIN_PLAYERS = 2;
    private static readonly MAX_PLAYERS = 10;
    private static readonly BALLS_PER_PLAYER = 20;
    private static readonly DISPLAY_UPDATE_DELAY = 500; // 500ms minimum between display updates

    private readonly pokemonPool: Pokemon[] = [
        { name: 'Pidgey', rarity: 0.3, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pidgey.gif' },
        { name: 'Rattata', rarity: 0.3, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/rattata.gif' },
        { name: 'Pikachu', rarity: 0.15, points: 30, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pikachu.gif' },
        { name: 'Chansey', rarity: 0.1, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/chansey.gif' },
        { name: 'Tauros', rarity: 0.1, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/tauros.gif' },
        { name: 'Dratini', rarity: 0.05, points: 100, sprite: 'https://play.pokemonshowdown.com/sprites/ani/dratini.gif' }
    ];

    constructor(room: ChatRoom, entryFee: number, host: string) {
        this.room = room;
        this.entryFee = entryFee;
        this.host = host;
        this.players = {};
        this.timer = null;
        this.status = 'waiting';
        this.prizePool = 0;
        this.gameId = `safari-${Date.now()}`;
        this.lastCatchMessage = null;
        this.lastDisplayUpdate = 0;
        this.displayUpdateTimeout = null;

        this.setInactivityTimer();
        this.display();
    }

    private getPlayerList(): string {
        const players = Object.values(this.players);
        if (players.length === 0) return 'None';
        return players.map(p => Impulse.nameColor(p.name, true, true)).join(', ');
    }

    private setInactivityTimer() {
        this.timer = setTimeout(() => {
            if (this.status === 'waiting') {
                this.end(true);
            }
        }, SafariGame.INACTIVE_TIME);
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private queueDisplayUpdate() {
        const now = Date.now();
        // Clear any pending update
        if (this.displayUpdateTimeout) {
            clearTimeout(this.displayUpdateTimeout);
        }

        // If we haven't updated recently, update immediately
        if (now - this.lastDisplayUpdate >= SafariGame.DISPLAY_UPDATE_DELAY) {
            this.display();
            this.lastDisplayUpdate = now;
        } else {
            // Otherwise, queue an update for later
            this.displayUpdateTimeout = setTimeout(() => {
                this.display();
                this.lastDisplayUpdate = Date.now();
                this.displayUpdateTimeout = null;
            }, SafariGame.DISPLAY_UPDATE_DELAY - (now - this.lastDisplayUpdate));
        }
    }

    private display() {
        if (this.status === 'waiting') {
            const startMsg = 
                `<div class="infobox">` +
                `<div style="text-align:center;margin:5px">` +
                `<h2 style="color:#24678d">Safari Zone Game</h2>` +
                `<b>Started by:</b> ${Impulse.nameColor(this.host, true, true)}<br />` +
                `<b>Entry Fee:</b> ${this.entryFee} coins<br />` +
                `<b>Pokeballs:</b> ${SafariGame.BALLS_PER_PLAYER} per player<br />` +
                `<b>Players:</b> ${this.getPlayerList()}<br /><br />` +
                `<img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" width="80" height="80" style="margin-right:30px">` +
                `<img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80" style="margin-left:30px"><br />` +
                `<button class="button" name="send" value="/safari join">Click to join!</button>` +
                `</div></div>`;
            
            this.room.add(`|uhtml|safari-waiting|${startMsg}`, -1000).update();
            return;
        }

        // Clear any waiting state display
        this.room.add(`|uhtmlchange|safari-waiting|`, -1000);

        // Send individual displays to each player
        for (const userid in this.players) {
            const player = this.players[userid];
            let buf = `<div class="infobox"><div style="text-align:center">`;
            buf += `<h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>`;
            buf += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
            buf += `<b>Status:</b> ${this.status}<br />`;
            buf += `<b>Prize Pool:</b> ${this.prizePool} coins<br />`;

            if (Object.keys(this.players).length) {
                buf += `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
                buf += `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
                const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
                for (const p of sortedPlayers) {
                    buf += `<tr>`;
                    buf += `<td>${Impulse.nameColor(p.name, true, true)}${p.id === userid ? ' (You)' : ''}</td>`;
                    buf += `<td>${p.points}</td>`;
                    buf += `<td>${p.ballsLeft}</td>`;
                    buf += `<td>${p.catches.map(pk => `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`).join('')}</td>`;
                    buf += `</tr>`;
                }
                buf += `</table>`;
            }

            if (this.status === 'started') {
                if (this.lastCatchMessage) {
                    buf += `<br /><div style="color: #008000; margin: 5px 0;">${this.lastCatchMessage}</div>`;
                }
                
                if (player.ballsLeft > 0) {
                    const now = Date.now();
                    const timeSinceLastThrow = now - player.lastCatch;
                    const isOnCooldown = timeSinceLastThrow < SafariGame.CATCH_COOLDOWN;
                    
                    if (isOnCooldown) {
                        const remainingCooldown = Math.ceil((SafariGame.CATCH_COOLDOWN - timeSinceLastThrow) / 1000);
                        buf += `<br /><button class="button" disabled>Cooldown: ${remainingCooldown}s</button>`;
                    } else {
                        buf += `<br /><button class="button" name="send" value="/safari throw">Throw Safari Ball</button>`;
                    }
                }
            }

            buf += `</div></div>`;
            
            // Send the player-specific display
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.room, `|uhtml|safari-player-${userid}|${buf}`);
            }
        }

        // Show minimal display for spectators in the room
        if (this.status !== 'ended') {
            let spectatorBuf = `<div class="infobox"><div style="text-align:center">`;
            spectatorBuf += `<h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>`;
            spectatorBuf += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
            spectatorBuf += `<b>Players:</b> ${this.getPlayerList()}<br />`;
            spectatorBuf += `<i>Game in progress - Join the next round!</i>`;
            spectatorBuf += `</div></div>`;

            // Update room display for spectators
            this.room.add(`|uhtml|safari-spectator|${spectatorBuf}`, -1000).update();
        }
    }

    addPlayer(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (this.players[user.id]) return "You have already joined the game!";
        if (!Economy.hasMoney(user.id, this.entryFee)) return "You don't have enough coins to join!";

        Economy.takeMoney(user.id, this.entryFee, "Safari Zone entry fee");
        this.prizePool += this.entryFee;

        this.players[user.id] = {
            name: user.name,
            id: user.id,
            points: 0,
            catches: [],
            ballsLeft: SafariGame.BALLS_PER_PLAYER,
            lastCatch: 0
        };

        this.queueDisplayUpdate();
        
        if (Object.keys(this.players).length === SafariGame.MAX_PLAYERS) {
            this.start(user);
        }

        user.sendTo(this.room, `|html|<div class="broadcast-green"><b>You have successfully joined the Safari Zone game!</b></div>`);
        
        return null;
    }

    start(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (Object.keys(this.players).length < SafariGame.MIN_PLAYERS) return "Not enough players to start!";
        if (!this.players[user.id]) return "You must be in the game to start it!";

        this.status = 'started';
        this.clearTimer();
        this.queueDisplayUpdate();
        return null;
    }

    throwBall(user: User): string | null {
        if (this.status !== 'started') return "The game hasn't started yet!";
        if (!this.players[user.id]) return "You're not in this game!";

        const player = this.players[user.id];
        
        if (player.ballsLeft <= 0) return "You have no Safari Balls left!";
        
        const now = Date.now();
        if (now - player.lastCatch < SafariGame.CATCH_COOLDOWN) {
            // Don't update display for cooldown messages, just send to the player
            const remaining = Math.ceil((SafariGame.CATCH_COOLDOWN - (now - player.lastCatch)) / 1000);
            const roomUser = Users.get(user.id);
            if (roomUser?.connected) {
                roomUser.sendTo(this.room, `|html|<div class="message-error">Please wait ${remaining} second${remaining !== 1 ? 's' : ''} before throwing again!</div>`);
            }
            return null;
        }

        player.lastCatch = now;
        player.ballsLeft--;

        const random = Math.random();
        let cumulativeProbability = 0;

        for (const pokemon of this.pokemonPool) {
            cumulativeProbability += pokemon.rarity;
            if (random <= cumulativeProbability) {
                player.catches.push(pokemon);
                player.points += pokemon.points;
                this.lastCatchMessage = `${player.name} caught a ${pokemon.name} worth ${pokemon.points} points! (${player.ballsLeft} balls left)`;
                this.queueDisplayUpdate();

                if (player.ballsLeft === 0) {
                    this.checkGameEnd();
                }

                return null;
            }
        }

        this.lastCatchMessage = `${player.name}'s Safari Ball missed! (${player.ballsLeft} balls left)`;
        this.queueDisplayUpdate();
        
        if (player.ballsLeft === 0) {
            this.checkGameEnd();
        }
        return null;
    }

    disqualifyPlayer(targetId: string, executor: string): string | null {
        if (toID(executor) !== toID(this.host)) return "Only the game creator can disqualify players.";
        if (this.status === 'ended') return "The game has already ended.";
        
        const player = this.players[targetId];
        if (!player) return "That player is not in this game.";

        if (this.status === 'waiting') {
            const refund = Math.floor(this.entryFee / 2);
            Economy.addMoney(targetId, refund, "Safari Zone partial refund - disqualified");
            this.prizePool -= refund;
        }

        delete this.players[targetId];
        this.queueDisplayUpdate();

        // Check if we should end the game
        if (this.status === 'started') {
            if (Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
                this.end(false);
                return `${player.name} was disqualified. Game ended due to insufficient players.`;
            }
            // Check if all remaining players have used their balls
            this.checkGameEnd();
        }

        return `${player.name} was disqualified from the Safari Zone game.`;
    }

    private checkGameEnd() {
        // Check if any players are left
        if (Object.keys(this.players).length === 0) {
            this.end(false);
            return;
        }

        // Check if all remaining players have used their balls
        const allFinished = Object.values(this.players).every(p => p.ballsLeft === 0);
        if (allFinished) {
            this.end(false);
        }
    }

    end(inactive: boolean = false) {
        if (this.status === 'ended') return;

        this.clearTimer();
        if (this.displayUpdateTimeout) {
            clearTimeout(this.displayUpdateTimeout);
            this.displayUpdateTimeout = null;
        }
        this.status = 'ended';

        // If the game is ending due to inactivity and not enough players
        if (inactive && Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
            for (const id in this.players) {
                Economy.addMoney(id, this.entryFee, "Safari Zone refund");
            }
            this.room.add(`|uhtmlchange|safari-spectator|<div class="infobox">The Safari Zone game has been canceled due to inactivity. Entry fees have been refunded.</div>`, -1000).update();
            delete this.room.safari;
            return;
        }

        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);

        // Only distribute prizes if there are players
        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1];
            for (let i = 0; i < Math.min(3, sortedPlayers.length); i++) {
                const prize = Math.floor(this.prizePool * prizes[i]);
                if (prize > 0) {
                    Economy.addMoney(sortedPlayers[i].id, prize, `Safari Zone ${i + 1}${['st', 'nd', 'rd'][i]} place`);
                }
            }

            let buf = `<div class="infobox"><center><h2>Safari Zone Results</h2>`;
            sortedPlayers.forEach((player, index) => {
                if (index < 3) {
                    const prize = Math.floor(this.prizePool * prizes[index]);
                    buf += `${index + 1}. ${Impulse.nameColor(player.name, true, true)} - ${player.points} points (Won ${prize} coins)<br>`;
                }
            });
            buf += `</center></div>`;

            this.room.add(`|uhtmlchange|safari-spectator|${buf}`, -1000).update();

            // Clear player displays
            for (const userid in this.players) {
                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-player-${userid}|`);
                }
            }
        } else {
            // If no players are left
            this.room.add(`|uhtmlchange|safari-spectator|<div class="infobox">The Safari Zone game has ended with no winners.</div>`, -1000).update();
        }

        delete this.room.safari;
    }
}

export const commands: Chat.ChatCommands = {
    safari(target, room, user) {
        if (!room) return this.errorReply("This command can only be used in a room.");
        const [cmd, ...args] = target.split(' ');

        switch ((cmd || '').toLowerCase()) {
            case 'new':
            case 'create': {
                this.checkCan('mute', null, room);
                if (room.safari) return this.errorReply("A Safari game is already running in this room.");
                const entryFee = parseInt(args[0]);
                if (isNaN(entryFee) || entryFee < 1) return this.errorReply("Please enter a valid entry fee.");
                
                room.safari = new SafariGame(room, entryFee, user.name);
                this.modlog('SAFARI', null, `started by ${user.name} with ${entryFee} coin entry fee`);
                return this.privateModAction(`${user.name} started a Safari game with ${entryFee} coin entry fee.`);
            }

            case 'join': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const error = room.safari.addPlayer(user);
                if (error) return this.errorReply(error);
                
                // Clear the spectator view for the joining player
                this.sendReply(`|uhtmlchange|safari-spectator|`);
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
            `<center><strong>Safari Zone Commands</strong></center>` +
            `<hr />` +
            `<code>/safari create [fee]</code>: Creates a new Safari game with the specified entry fee. Requires @.<br />` +
            `<code>/safari join</code>: Joins the current Safari game.<br />` +
            `<code>/safari start</code>: Starts the Safari game if enough players have joined.<br />` +
            `<code>/safari throw</code>: Throws a Safari Ball at a 
