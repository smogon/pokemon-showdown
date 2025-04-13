/*************************************
 * Pokemon Safari Zone Game          *
 * Integration with Economy System   *
 * Author: musaddiktemkar           *
 * Created: 2025-04-13 07:03:00     *
 **************************************/

import { FS } from '../lib/fs';

interface Player {
    name: string;
    id: string;
    points: number;
    catches: Pokemon[];
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
    private startTime: number;
    private endTime: number;
    private status: 'waiting' | 'started' | 'ended';
    private prizePool: number;
    private gameId: string;
    private startMessage: string;
    private host: string;

    private static readonly GAME_TIME = 5 * 60 * 1000; // 5 minutes
    private static readonly INACTIVE_TIME = 2 * 60 * 1000; // 2 minutes
    private static readonly CATCH_COOLDOWN = 10 * 1000; // 10 seconds
    private static readonly MIN_PLAYERS = 2;
    private static readonly MAX_PLAYERS = 10;

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
        this.players = {};
        this.timer = null;
        this.startTime = 0;
        this.endTime = 0;
        this.status = 'waiting';
        this.prizePool = 0;
        this.gameId = `safari-${Date.now()}`;
        this.host = host;

        this.startMessage = 
            `<div class="infobox">` +
            `<div style="text-align:center;margin:5px">` +
            `<h2 style="color:#24678d">Safari Zone Game</h2>` +
            `<b>Started by:</b> ${Impulse.nameColor(host, true, true)}<br />` +
            `<b>Entry Fee:</b> ${entryFee} coins<br /><br />` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" width="80" height="80" style="margin-right:30px">` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80" style="margin-left:30px"><br />` +
            `<button class="button" name="send" value="/safari join">Click to join!</button>` +
            `</div></div>`;

        this.display();
        this.setInactivityTimer();
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

    private display() {
        if (this.status === 'waiting') {
            this.room.add(`|uhtml|${this.gameId}|${this.startMessage}`).update();
            return;
        }

        let buf = `<div class="infobox"><div style="text-align:center">`;
        buf += `<h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>`;
        buf += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
        buf += `<b>Status:</b> ${this.status}<br />`;
        buf += `<b>Prize Pool:</b> ${this.prizePool} coins<br />`;

        if (this.status === 'started') {
            const timeLeft = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            buf += `<b>Time Remaining:</b> ${minutes}:${seconds.toString().padStart(2, '0')}<br />`;
        }

        // Player table
        if (Object.keys(this.players).length) {
            buf += `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
            buf += `<tr><th>Player</th><th>Points</th><th>Catches</th></tr>`;
            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            for (const player of sortedPlayers) {
                buf += `<tr>`;
                buf += `<td>${Impulse.nameColor(player.name, true, true)}</td>`;
                buf += `<td>${player.points}</td>`;
                buf += `<td>${player.catches.map(p => `<img src="${p.sprite}" width="40" height="30" title="${p.name}">`).join('')}</td>`;
                buf += `</tr>`;
            }
            buf += `</table>`;
        }

        // Game controls
        if (this.status === 'started') {
            buf += `<br /><button class="button" name="send" value="/safari throw">Throw Safari Ball</button>`;
        }

        buf += `</div></div>`;
        this.room.add(`|uhtmlchange|${this.gameId}|${buf}`).update();
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
            lastCatch: 0
        };

        this.display();
        
        // Auto-start if max players joined
        if (Object.keys(this.players).length === SafariGame.MAX_PLAYERS) {
            this.start(user);
        }

        return null;
    }

    start(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (Object.keys(this.players).length < SafariGame.MIN_PLAYERS) return "Not enough players to start!";
        if (!this.players[user.id]) return "You must be in the game to start it!";

        this.status = 'started';
        this.startTime = Date.now();
        this.endTime = this.startTime + SafariGame.GAME_TIME;

        this.clearTimer();
        this.timer = setTimeout(() => this.end(false), SafariGame.GAME_TIME);

        this.display();
        return null;
    }

    throwBall(user: User): string | null {
        if (this.status !== 'started') return "The game hasn't started yet!";
        if (!this.players[user.id]) return "You're not in this game!";

        const player = this.players[user.id];
        const now = Date.now();

        if (now - player.lastCatch < SafariGame.CATCH_COOLDOWN) {
            const remaining = Math.ceil((SafariGame.CATCH_COOLDOWN - (now - player.lastCatch)) / 1000);
            return `Please wait ${remaining} seconds before throwing again!`;
        }

        player.lastCatch = now;

        // Random Pokemon encounter
        const random = Math.random();
        let cumulativeProbability = 0;

        for (const pokemon of this.pokemonPool) {
            cumulativeProbability += pokemon.rarity;
            if (random <= cumulativeProbability) {
                player.catches.push(pokemon);
                player.points += pokemon.points;
                this.display();
                return `Congratulations! You caught a ${pokemon.name} worth ${pokemon.points} points!`;
            }
        }

        return "The Pokemon got away!";
    }

    end(inactive: boolean = false) {
        if (this.status === 'ended') return;

        this.clearTimer();
        this.status = 'ended';

        if (inactive && Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
            // Refund if not enough players joined
            for (const id in this.players) {
                Economy.addMoney(id, this.entryFee, "Safari Zone refund");
            }
            this.room.add(`|uhtmlchange|${this.gameId}|<div class="infobox">The Safari Zone game has been canceled due to inactivity. Entry fees have been refunded.</div>`).update();
            delete this.room.safari;
            return;
        }

        // Sort players by points
        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);

        // Distribute prizes
        const prizes = [0.6, 0.3, 0.1]; // 60%, 30%, 10%
        for (let i = 0; i < Math.min(3, sortedPlayers.length); i++) {
            const prize = Math.floor(this.prizePool * prizes[i]);
            if (prize > 0) {
                Economy.addMoney(sortedPlayers[i].id, prize, `Safari Zone ${i + 1}${['st', 'nd', 'rd'][i]} place`);
            }
        }

        // Show final results
        let buf = `<div class="infobox"><center><h2>Safari Zone Results</h2>`;
        sortedPlayers.forEach((player, index) => {
            if (index < 3) {
                const prize = Math.floor(this.prizePool * prizes[index]);
                buf += `${index + 1}. ${Impulse.nameColor(player.name, true, true)} - ${player.points} points (Won ${prize} coins)<br>`;
            }
        });
        buf += `</center></div>`;

        this.room.add(`|uhtmlchange|${this.gameId}|${buf}`).update();
        delete this.room.safari;
    }
}

export const commands: Chat.ChatCommands = {
    safari(target, room, user) {
        if (!room) return this.errorReply("This command can only be used in a room.");
        const [cmd] = target.split(' ');

        switch ((cmd || '').toLowerCase()) {
            case 'new':
            case 'create': {
                this.checkCan('mute', null, room);
                if (room.safari) return this.errorReply("A Safari game is already running in this room.");
                const entryFee = parseInt(target.split(' ')[1]);
                if (isNaN(entryFee) || entryFee < 1) return this.errorReply("Please enter a valid entry fee.");
                
                room.safari = new SafariGame(room, entryFee, user.name);
                this.modlog('SAFARI', null, `started by ${user.name} with ${entryFee} coin entry fee`);
                return this.privateModAction(`${user.name} started a Safari game with ${entryFee} coin entry fee.`);
            }

            case 'join': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const error = room.safari.addPlayer(user);
                if (error) return this.errorReply(error);
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
                if (result) this.errorReply(result);
                return;
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
            `<code>/safari throw</code>: Throws a Safari Ball at a Pokemon.<br />` +
            `<code>/safari end</code>: Ends the current Safari game. Requires @.<br />` +
            `<hr />` +
            `<strong>Game Rules:</strong><br />` +
            `- Players must pay an entry fee to join<br />` +
            `- Minimum ${SafariGame.MIN_PLAYERS} players required to start<br />` +
            `- Game lasts ${SafariGame.GAME_TIME / 60000} minutes<br />` +
            `- ${SafariGame.CATCH_COOLDOWN / 1000} second cooldown between throws<br />` +
            `- Prizes: 1st (60%), 2nd (30%), 3rd (10%) of pool`
        );
    }
};
