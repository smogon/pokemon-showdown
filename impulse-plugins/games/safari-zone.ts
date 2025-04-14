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
    private lastWasCatch: boolean;
    private currentTurn: number;
    private turnOrder: string[];
    private turnTimer: NodeJS.Timeout | null;
    private turnStartTime: number;
    private gameStartTime: number;
    private spectators: Set<string>;
    private readonly pokemonPool: Pokemon[];

    private static readonly INACTIVE_TIME = 2 * 60 * 1000;
    private static readonly CATCH_COOLDOWN = 2 * 1000;
    private static readonly MIN_PLAYERS = 2;
    private static readonly MAX_PLAYERS = 10;
    private static readonly BALLS_PER_PLAYER = 20;
    private static readonly TURN_TIME = 30 * 1000; // 30 seconds per turn

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
        this.lastWasCatch = false;
        this.currentTurn = 0;
        this.turnOrder = [];
        this.turnTimer = null;
        this.turnStartTime = 0;
        this.gameStartTime = Date.now();
        this.spectators = new Set();
        this.pokemonPool = this.generatePokemonPool();

        this.setInactivityTimer();
        this.display();
    }

    private generatePokemonPool(): Pokemon[] {
        const pool: Pokemon[] = [];
        const dex = Dex.mod('gen9');

        // Define rarity and points based on base stats
        const getDetails = (species: Species) => {
            const baseStats = species.baseStats;
            const bst = Object.values(baseStats).reduce((a, b) => a + b, 0);
            
            // Assign rarity and points based on BST
            if (bst >= 600) return { rarity: 0.05, points: 100 };      // Legendaries/Very Strong
            if (bst >= 500) return { rarity: 0.1, points: 50 };        // Strong
            if (bst >= 400) return { rarity: 0.15, points: 30 };       // Medium
            return { rarity: 0.3, points: 10 };                        // Common
        };

        // Get available species
        const allSpecies = Array.from(dex.species.all())
            .filter(species => !species.isNonstandard && !species.forme)
            .sort(() => Math.random() - 0.5)
            .slice(0, 20); // Limit total pool size

        // Create pool with dynamic rarity/points based on stats
        for (const species of allSpecies) {
            const { rarity, points } = getDetails(species);
            pool.push({
                name: species.name,
                rarity,
                points,
                sprite: `https://play.pokemonshowdown.com/sprites/ani/${species.id}.gif`
            });
        }

        return pool;
    }

    private formatUTCTime(timestamp: number): string {
        return new Date(timestamp)
            .toISOString()
            .replace('T', ' ')
            .substr(0, 19);
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

    private initializeTurnOrder() {
        this.turnOrder = Object.keys(this.players);
        for (let i = this.turnOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
        }
        this.currentTurn = 0;
    }

    private addSpectator(userid: string): void {
        this.spectators.add(userid);
        this.displayToSpectator(userid);
    }

    private removeSpectator(userid: string): void {
        this.spectators.delete(userid);
        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${userid}|`);
        }
    }

    private displayToSpectator(userid: string): void {
        if (!this.spectators.has(userid)) return;
        
        const now = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const timeLeft = Math.max(0, Math.ceil((SafariGame.TURN_TIME - (now - this.turnStartTime)) / 1000));
        
        let buf = `<div class="infobox"><div style="text-align:center">`;
        buf += `<h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>`;
        buf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
        buf += `<small>Game Duration: ${Math.floor((now - this.gameStartTime) / 1000)}s</small><br />`;
        
        buf += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
        buf += `<b>Status:</b> ${this.status}<br />`;
        buf += `<b>Prize Pool:</b> ${this.prizePool} coins<br />`;

        if (this.status === 'started' && currentPlayerId) {
            buf += `<b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}`;
            buf += ` <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;
        }

        if (Object.keys(this.players).length) {
            buf += `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
            buf += `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            for (const p of sortedPlayers) {
                const isCurrentTurn = p.id === currentPlayerId;
                buf += `<tr${isCurrentTurn ? ' style="background-color: rgba(85, 85, 255, 0.1)"' : ''}>`;
                buf += `<td>${Impulse.nameColor(p.name, true, true)}${isCurrentTurn ? ' ⭐' : ''}</td>`;
                buf += `<td>${p.points}</td>`;
                buf += `<td>${p.ballsLeft}</td>`;
                buf += `<td>${p.catches.map(pk => `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`).join('')}</td>`;
                buf += `</tr>`;
            }
            buf += `</table>`;
        }

        if (this.status === 'started' && this.lastCatchMessage) {
            buf += `<br /><div style="color: ${this.lastWasCatch ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.lastCatchMessage}</div>`;
        }

        buf += `<br /><small style="color: #666666">You are spectating this game</small>`;
        buf += `</div></div>`;

        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtml|safari-spectator-${userid}|${buf}`);
        }
    }

    private startTurnTimer() {
        if (this.turnTimer) clearTimeout(this.turnTimer);
        
        this.turnStartTime = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const player = this.players[currentPlayerId];
        
        this.turnTimer = setTimeout(() => {
            if (player && player.ballsLeft > 0) {
                player.ballsLeft--;
                this.lastWasCatch = false;
                this.lastCatchMessage = `${player.name} lost a Safari Ball due to not throwing within 30 seconds! (${player.ballsLeft} balls left)`;
                player.lastCatch = Date.now();
            }
            this.nextTurn();
        }, SafariGame.TURN_TIME);

        this.display();
    }

    private nextTurn() {
        if (this.turnTimer) clearTimeout(this.turnTimer);
        
        this.currentTurn = (this.currentTurn + 1) % this.turnOrder.length;
        
        if (this.currentTurn === 0) {
            const anyActivePlayers = Object.values(this.players).some(p => p.ballsLeft > 0);
            if (!anyActivePlayers) {
                this.end(false);
                return;
            }
        }

        while (this.players[this.turnOrder[this.currentTurn]]?.ballsLeft === 0) {
            this.currentTurn = (this.currentTurn + 1) % this.turnOrder.length;
            if (this.currentTurn === 0) {
                if (!Object.values(this.players).some(p => p.ballsLeft > 0)) {
                    this.end(false);
                    return;
                }
            }
        }

        this.display();
        this.startTurnTimer();
    }

    private display() {
        if (this.status === 'waiting') {
            const startMsg = 
                `<div class="infobox">` +
                `<div style="text-align:center;margin:5px">` +
                `<h2 style="color:#24678d">Safari Zone Game</h2>` +
                `<small>Game Time: ${this.formatUTCTime(Date.now())} UTC</small><br />` +
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

        this.room.add(`|uhtmlchange|safari-waiting|`, -1000);

        const currentPlayerId = this.turnOrder[this.currentTurn];
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((SafariGame.TURN_TIME - (now - this.turnStartTime)) / 1000));

        if (this.status === 'started') {
            for (const userid in this.players) {
                const player = this.players[userid];
                let buf = `<div class="infobox"><div style="text-align:center">`;
                buf += `<h2>Safari Zone Game</h2>`;
                
                buf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
                buf += `<small>Game Duration: ${Math.floor((now - this.gameStartTime) / 1000)}s</small><br />`;
                
                buf += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
                buf += `<b>Status:</b> ${this.status}<br />`;
                buf += `<b>Prize Pool:</b> ${this.prizePool} coins<br />`;

                buf += `<b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}`;
                buf += ` <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;

                if (Object.keys(this.players).length) {
                    buf += `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
                    buf += `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
                    const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
                    for (const p of sortedPlayers) {
                        const isCurrentTurn = p.id === currentPlayerId;
                        buf += `<tr${isCurrentTurn ? ' style="background-color: rgba(85, 85, 255, 0.1)"' : ''}>`;
                        buf += `<td>${Impulse.nameColor(p.name, true, true)}${p.id === userid ? ' (You)' : ''}${isCurrentTurn ? ' ⭐' : ''}</td>`;
                        buf += `<td>${p.points}</td>`;
                        buf += `<td>${p.ballsLeft}</td>`;
                        buf += `<td>${p.catches.map(pk => `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`).join('')}</td>`;
                        buf += `</tr>`;
                    }
                    buf += `</table>`;
                }

                if (this.lastCatchMessage) {
                    buf += `<br /><div style="color: ${this.lastWasCatch ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.lastCatchMessage}</div>`;
                }
                
                if (userid === currentPlayerId) {
                    if (player.ballsLeft > 0) {
                        buf += `<br />`;
                        buf += `<button class="button" style="font-size: 12pt; padding: 8px 16px; ${timeLeft <= 10 ? 'background-color: #ff5555;' : ''}" `;
                        buf += `name="send" value="/safari throw">Throw Safari Ball</button>`;
                        buf += `<br /><b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">`;
                        buf += `You have ${timeLeft} second${timeLeft !== 1 ? 's' : ''} to throw!</b>`;
                        if (timeLeft <= 10) {
                            buf += `<br /><small style="color: #ff5555">Warning: You'll lose a ball if you don't throw!</small>`;
                        }
                    } else {
                        buf += `<br /><div style="color: #ff5555">You have no Safari Balls left!</div>`;
                    }
                } else {
                    const currentPlayer = this.players[currentPlayerId];
                    buf += `<br /><div style="color: #666666">Waiting for ${currentPlayer.name}'s turn... (${timeLeft}s left)</div>`;
                }

                buf += `</div></div>`;
                
                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtml|safari-player-${userid}|${buf}`);
                }
            }
        } else if (this.status === 'ended') {
            for (const userid in this.players) {
                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-player-${userid}|`);
                }
            }
        }

        if (this.status === 'ended') {
            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            let buf = `<div class="infobox"><center><h2>Safari Zone Results</h2>`;
            buf += `<small>Game Ended: ${this.formatUTCTime(now)} UTC</small><br />`;
            buf += `<small>Duration: ${Math.floor((now - this.gameStartTime) / 1000)} seconds</small><br /><br />`;
            
            if (sortedPlayers.length > 0) {
                const prizes = [0.6, 0.3, 0.1];
                sortedPlayers.forEach((player, index) => {
                    if (index < 3) {
                        const prize = Math.floor(this.prizePool * prizes[index]);
                        buf += `${index + 1}. ${Impulse.nameColor(player.name, true, true)} - ${player.points} points (Won ${prize} coins)<br>`;
                    }
                });
            } else {
                buf += `No winners in this game.`;
            }
            buf += `</center></div>`;

            this.room.add(`|uhtml|safari-spectator|${buf}`, -1000).update();
        } else {
            this.room.add(`|uhtmlchange|safari-spectator|`, -1000).update();
        }

        for (const spectatorId of this.spectators) {
            if (this.status === 'ended') {
                const roomUser = Users.get(spectatorId);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${spectatorId}|`);
                }
            } else {
                this.displayToSpectator(spectatorId);
            }
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

        this.display();
        
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
        this.initializeTurnOrder();
        this.display();
        this.startTurnTimer();
        return null;
    }

    throwBall(user: User): string | null {
        if (this.status !== 'started') return "The game hasn't started yet!";
        if (!this.players[user.id]) return "You're not in this game!";
        
        const currentPlayerId = this.turnOrder[this.currentTurn];
        if (user.id !== currentPlayerId) return "It's not your turn!";

        const player = this.players[user.id];
        if (player.ballsLeft <= 0) return "You have no Safari Balls left!";

        player.lastCatch = Date.now();
        player.ballsLeft--;

        const random = Math.random();
        let cumulativeProbability = 0;

        for (const pokemon of this.pokemonPool) {
            cumulativeProbability += pokemon.rarity;
            if (random <= cumulativeProbability) {
                player.catches.push(pokemon);
                player.points += pokemon.points;
                this.lastWasCatch = true;
                this.lastCatchMessage = `${player.name} caught a ${pokemon.name} worth ${pokemon.points} points! (${player.ballsLeft} balls left)`;
                this.nextTurn();
                return null;
            }
        }

        this.lastWasCatch = false;
        this.lastCatchMessage = `${player.name}'s Safari Ball missed! (${player.ballsLeft} balls left)`;
        this.nextTurn();
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
        this.display();

        if (this.status === 'started') {
            if (Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
                this.end(false);
                return `${player.name} was disqualified. Game ended due to insufficient players.`;
            }
            this.checkGameEnd();
        }

        return `${player.name} was disqualified from the Safari Zone game.`;
    }

    private checkGameEnd() {
        if (Object.keys(this.players).length === 0) {
            this.end(false);
            return;
        }

        const allFinished = Object.values(this.players).every(p => p.ballsLeft === 0);
        if (allFinished) {
            this.end(false);
        }
    }

    end(inactive: boolean = false) {
        if (this.status === 'ended') return;

        this.clearTimer();
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
        this.status = 'ended';

        if (inactive && Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
            for (const id in this.players) {
                Economy.addMoney(id, this.entryFee, "Safari Zone refund");
            }
            this.room.add(`|uhtmlchange|safari-spectator|<div class="infobox">The Safari Zone game has been canceled due to inactivity. Entry fees have been refunded.</div>`, -1000).update();
            delete this.room.safari;
            return;
        }

        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1];
            for (let i = 0; i < Math.min(3, sortedPlayers.length); i++) {
                const prize = Math.floor(this.prizePool * prizes[i]);
                if (prize > 0) {
                    Economy.addMoney(sortedPlayers[i].id, prize, `Safari Zone ${i + 1}${['st', 'nd', 'rd'][i]} place`);
                }
            }
        }

        this.display();
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
                
                this.sendReply(`|uhtmlchange|safari-spectator|`);
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
            '<code>/safari create [fee]</code>: Creates a new Safari game with the specified entry fee. Requires @.<br />' +
            '<code>/safari join</code>: Joins the current Safari game.<br />' +
            '<code>/safari start</code>: Starts the Safari game if enough players have joined.<br />' +
            '<code>/safari throw</code>: Throws a Safari Ball at a Pokemon.<br />' +
            '<code>/safari spectate</code>: Watch an ongoing Safari game.<br />' +
            '<code>/safari unspectate</code>: Stop watching a Safari game.<br />' +
            '<code>/safari dq [player]</code>: Disqualifies a player from the game (only usable by game creator).<br />' +
            '<code>/safari end</code>: Ends the current Safari game. Requires @.<br />' +
            '<hr />' +
            '<strong>Game Rules:</strong><br />' +
            `- Players must pay an entry fee to join<br />` +
            `- Minimum ${SafariGame.MIN_PLAYERS} players required to start<br />` +
            `- Each player gets ${SafariGame.BALLS_PER_PLAYER} Safari Balls<br />` +
            `- ${SafariGame.TURN_TIME / 1000} second time limit per turn<br />` +
            '- Game ends when all players use their balls<br />' +
            '- Prizes: 1st (60%), 2nd (30%), 3rd (10%) of pool<br />' +
			   '- Players can be disqualified by the game creator'
        );
    }
};
