/*************************************
 * Pokemon Safari Zone Game          *
 * Integration with Economy System   *
 * Author: musaddiktemkar           *
 **************************************/

import { FS } from '../../lib/fs';

class Dice {
    room: ChatRoom;
    safari: boolean;

    constructor(room: ChatRoom) {
        this.room = room;
        this.safari = false;
    }
}

class SafariGame {
    public room: ChatRoom;
    public entryFee: number;
    private players: {[k: string]: Player};
    private readonly times = {
        gameTime: 5 * 60 * 1000, // 5 minutes
        inactivityTime: 2 * 60 * 1000, // 2 minutes for joining
        catchCooldown: 10 * 1000 // 10 seconds between catches
    };
    private timer: NodeJS.Timeout | null;
    private startTime: number;
    private endTime: number;
    private status: 'waiting' | 'started' | 'ended';
    private prizePool: number;

    constructor(room: ChatRoom, entryFee: number) {
        this.room = room;
        this.entryFee = entryFee;
        this.players = {};
        this.timer = null;
        this.startTime = 0;
        this.endTime = 0;
        this.status = 'waiting';
        this.prizePool = 0;

        // Set inactivity timer
        this.setInactivityTimer();
        this.display();
    }

    private readonly pokemonPool = [
        { name: 'Pidgey', rarity: 0.3, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pidgey.gif' },
        { name: 'Rattata', rarity: 0.3, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/rattata.gif' },
        { name: 'Pikachu', rarity: 0.15, points: 30, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pikachu.gif' },
        { name: 'Chansey', rarity: 0.1, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/chansey.gif' },
        { name: 'Tauros', rarity: 0.1, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/tauros.gif' },
        { name: 'Dratini', rarity: 0.05, points: 100, sprite: 'https://play.pokemonshowdown.com/sprites/ani/dratini.gif' }
    ];

    private setInactivityTimer() {
        this.timer = setTimeout(() => {
            if (this.status === 'waiting') {
                this.end(true);
            }
        }, this.times.inactivityTime);
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    addPlayer(user: User) {
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
        return null;
    }

    start(user: User) {
        if (this.status !== 'waiting') return "The game has already started!";
        if (Object.keys(this.players).length < 2) return "Not enough players to start!";
        if (!this.players[user.id]) return "You must be in the game to start it!";

        this.status = 'started';
        this.startTime = Date.now();
        this.endTime = this.startTime + this.times.gameTime;
        
        this.clearTimer();
        this.timer = setTimeout(() => this.end(false), this.times.gameTime);
        
        this.display();
        return null;
    }

    throwBall(user: User) {
        if (this.status !== 'started') return "The game hasn't started yet!";
        if (!this.players[user.id]) return "You're not in this game!";
        
        const player = this.players[user.id];
        const now = Date.now();
        
        if (now - player.lastCatch < this.times.catchCooldown) {
            const remaining = Math.ceil((this.times.catchCooldown - (now - player.lastCatch)) / 1000);
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

        if (inactive && Object.keys(this.players).length < 2) {
            // Refund if not enough players joined
            for (const id in this.players) {
                Economy.addMoney(id, this.entryFee, "Safari Zone refund");
            }
            this.display(`The Safari Zone game has been canceled due to inactivity. Entry fees have been refunded.`);
            return;
        }

        // Sort players by points
        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
        
        // Distribute prizes
        if (sortedPlayers.length >= 1) {
            const firstPrize = Math.floor(this.prizePool * 0.6);
            Economy.addMoney(sortedPlayers[0].id, firstPrize, "Safari Zone 1st place");
        }
        if (sortedPlayers.length >= 2) {
            const secondPrize = Math.floor(this.prizePool * 0.3);
            Economy.addMoney(sortedPlayers[1].id, secondPrize, "Safari Zone 2nd place");
        }
        if (sortedPlayers.length >= 3) {
            const thirdPrize = Math.floor(this.prizePool * 0.1);
            Economy.addMoney(sortedPlayers[2].id, thirdPrize, "Safari Zone 3rd place");
        }

        this.display();
        delete this.room.safari;
    }

    display(message?: string) {
        let buf = `<div class="infobox">`;
        buf += `<div style="text-align:center;margin-bottom:5px;"><h2>Safari Zone</h2>`;
        buf += `Entry Fee: ${this.entryFee} coins | Prize Pool: ${this.prizePool} coins<br/>`;
        
        if (message) {
            buf += `<br/><b>${message}</b><br/>`;
        }

        if (this.status === 'started') {
            const timeLeft = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            buf += `<br/>Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}<br/>`;
        }

        // Player table
        if (Object.keys(this.players).length) {
            buf += `<table style="margin: 5px auto;"><tr><th>Player</th><th>Points</th><th>Catches</th></tr>`;
            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            for (const player of sortedPlayers) {
                buf += `<tr><td>${Impulse.nameColor(player.name, true, true)}</td>`;
                buf += `<td>${player.points}</td>`;
                buf += `<td>${player.catches.map(p => `<img src="${p.sprite}" width="40" height="30" title="${p.name}">`).join('')}</td></tr>`;
            }
            buf += `</table>`;
        } else {
            buf += `<br/>No players yet!`;
        }

        // Game controls
        if (this.status === 'waiting') {
            buf += `<br/><button class="button" name="send" value="/safari join">Join Game</button>`;
            if (Object.keys(this.players).length >= 2) {
                buf += ` <button class="button" name="send" value="/safari start">Start Game</button>`;
            }
        } else if (this.status === 'started') {
            buf += `<br/><button class="button" name="send" value="/safari throw">Throw Safari Ball</button>`;
        }

        buf += `</div></div>`;

        this.room.add(`|uhtmlchange|safari|${buf}`).update();
    }
}

interface Player {
    name: string;
    id: string;
    points: number;
    catches: any[];
    lastCatch: number;
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
                room.safari = new SafariGame(room, entryFee);
                this.modlog('SAFARI', null, `started by ${user.name} with ${entryFee} coin entry fee`);
                return this.privateModAction(`${user.name} started a Safari game with ${entryFee} coin entry fee.`);
            }

            case 'join': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                if (room.safari.status !== 'waiting') return this.errorReply("The game has already started!");
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
                if (result) return this.errorReply(result);
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
            `<hr/>` +
            `<code>/safari create [fee]</code>: Creates a new Safari game with the specified entry fee. Requires @.<br/>` +
            `<code>/safari join</code>: Joins the current Safari game.<br/>` +
            `<code>/safari start</code>: Starts the Safari game if enough players have joined.<br/>` +
            `<code>/safari throw</code>: Throws a Safari Ball at a Pokemon.<br/>` +
            `<code>/safari end</code>: Ends the current Safari game. Requires @.<br/>` +
            `<hr/>` +
            `<strong>Game Rules:</strong><br/>` +
            `- Players must pay an entry fee to join<br/>` +
            `- Minimum 2 players required to start<br/>` +
            `- Game lasts 5 minutes<br/>` +
            `- 10 second cooldown between throws<br/>` +
            `- Prizes: 1st (60%), 2nd (30%), 3rd (10%) of pool`
        );
    }
};
