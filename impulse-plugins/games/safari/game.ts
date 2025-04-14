/**************************************
 * Pokemon Safari Zone Game Core      *
 * Author: @musaddiktemkar            *
 **************************************/

import { FS } from '../../lib/fs';
import { Player, Pokemon, MovementState } from './types';
import { SafariConstants } from './constants';

export class SafariGame {
    private room: ChatRoom;
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
    private ballsPerPlayer: number;
    private movementStates: { [k: string]: MovementState };

    constructor(room: ChatRoom, host: string, prizePool: number = 1000, balls: number = SafariConstants.DEFAULT_BALLS) {
        this.room = room;
        this.host = host;
        this.players = {};
        this.timer = null;
        this.status = SafariConstants.STATUS.WAITING;
        this.prizePool = Math.max(SafariConstants.MIN_PRIZE_POOL, Math.min(SafariConstants.MAX_PRIZE_POOL, prizePool));
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
        this.ballsPerPlayer = Math.max(SafariConstants.MIN_BALLS, Math.min(SafariConstants.MAX_BALLS, balls));
        this.movementStates = {};

        this.setInactivityTimer();
        this.display();
    }

    private generatePokemonPool(): Pokemon[] {
        const pool: Pokemon[] = [];
        const dex = Dex.mod('gen9');

        // Get available species
        const allSpecies = Array.from(dex.species.all())
            .filter(species => !species.isNonstandard && !species.forme)
            .sort(() => Math.random() - 0.5)
            .slice(0, SafariConstants.MAX_POKEMON_POOL_SIZE);

        // Create pool with dynamic rarity/points based on stats
        for (const species of allSpecies) {
            const baseStats = species.baseStats;
            const bst = Object.values(baseStats).reduce((a, b) => a + b, 0);
            
            let rarityTier;
            if (bst >= SafariConstants.RARITY_TIERS.LEGENDARY.BST) {
                rarityTier = SafariConstants.RARITY_TIERS.LEGENDARY;
            } else if (bst >= SafariConstants.RARITY_TIERS.STRONG.BST) {
                rarityTier = SafariConstants.RARITY_TIERS.STRONG;
            } else if (bst >= SafariConstants.RARITY_TIERS.MEDIUM.BST) {
                rarityTier = SafariConstants.RARITY_TIERS.MEDIUM;
            } else {
                rarityTier = SafariConstants.RARITY_TIERS.COMMON;
            }

            pool.push({
                name: species.name,
                rarity: rarityTier.RARITY,
                points: rarityTier.POINTS,
                sprite: `${SafariConstants.SPRITE_URL_BASE}${species.id}.gif`
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

    private handleMovement(userId: string, direction: 'up' | 'down' | 'left' | 'right'): string | null {
        const player = this.players[userId];
        if (!player) return "You're not in this game!";
        
        const currentPlayerId = this.turnOrder[this.currentTurn];
        if (userId !== currentPlayerId) return "It's not your turn!";

        if (!this.movementStates[userId]) {
            this.movementStates[userId] = {
                canMove: true,
                pokemonDisplayed: false,
                currentPokemon: null
            };
        }

        const state = this.movementStates[userId];
        if (!state.canMove) return "You've already moved this turn!";
        if (player.ballsLeft <= 0) return "You have no Safari Balls left!";

        // Handle the movement and display a random Pokemon
        state.canMove = false;
        state.pokemonDisplayed = true;
        
        // Select a random Pokemon from the pool
        const randomIndex = Math.floor(Math.random() * this.pokemonPool.length);
        state.currentPokemon = this.pokemonPool[randomIndex];
        
        this.display(); // Update the display to show the new state
        return null;
    }

    private setInactivityTimer() {
        this.timer = setTimeout(() => {
            if (this.status === SafariConstants.STATUS.WAITING) {
                this.end(true);
            }
        }, SafariConstants.INACTIVE_TIME);
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private initializeTurnOrder() {
        this.turnOrder = Object.keys(this.players);
        // Fisher-Yates shuffle
        for (let i = this.turnOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
        }
        this.currentTurn = 0;
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
                this.lastCatchMessage = `${player.name} lost a Safari Ball due to not acting within ${SafariConstants.TURN_TIME / 1000} seconds! (${player.ballsLeft} balls left)`;
                player.lastCatch = Date.now();
            }
            this.nextTurn();
        }, SafariConstants.TURN_TIME);

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

        // Skip players with no balls left
        while (this.players[this.turnOrder[this.currentTurn]]?.ballsLeft === 0) {
            this.currentTurn = (this.currentTurn + 1) % this.turnOrder.length;
            if (this.currentTurn === 0) {
                if (!Object.values(this.players).some(p => p.ballsLeft > 0)) {
                    this.end(false);
                    return;
                }
            }
        }

        // Reset movement state for the new turn
        delete this.movementStates[this.turnOrder[this.currentTurn]];
        this.display();
        this.startTurnTimer();
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
        const timeLeft = Math.max(0, Math.ceil((SafariConstants.TURN_TIME - (now - this.turnStartTime)) / 1000));
        
        let buf = `<div class="infobox"><div style="text-align:center">`;
        buf += `<h2>Safari Zone Game${this.status === SafariConstants.STATUS.ENDED ? ' (Ended)' : ''}</h2>`;
        buf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
        buf += `<small>Game Duration: ${Math.floor((now - this.gameStartTime) / 1000)}s</small><br />`;
        
        buf += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
        buf += `<b>Status:</b> ${this.status}<br />`;
        buf += `<b>Prize Pool:</b> ${this.prizePool} coins<br />`;

        if (this.status === SafariConstants.STATUS.STARTED && currentPlayerId) {
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

        if (this.status === SafariConstants.STATUS.STARTED && this.lastCatchMessage) {
            buf += `<br /><div style="color: ${this.lastWasCatch ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.lastCatchMessage}</div>`;
        }

        buf += `<br /><small style="color: #666666">You are spectating this game</small>`;
        buf += `</div></div>`;

        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtml|safari-spectator-${userid}|${buf}`);
        }
    }

    private display() {
        if (this.status === SafariConstants.STATUS.WAITING) {
            const startMsg = 
                `<div class="infobox">` +
                `<div style="text-align:center;margin:5px">` +
                `<h2 style="color:#24678d">Safari Zone Game</h2>` +
                `<small>Game Time: ${this.formatUTCTime(Date.now())} UTC</small><br />` +
                `<b>Started by:</b> ${Impulse.nameColor(this.host, true, true)}<br />` +
                `<b>Prize Pool:</b> ${this.prizePool} coins<br />` +
                `<b>Pokeballs:</b> ${this.ballsPerPlayer} per player<br />` +
                `<b>Players:</b> ${this.getPlayerList()}<br /><br />` +
                `<img src="${SafariConstants.SPRITE_URL_BASE}chansey.gif" width="80" height="80" style="margin-right:30px">` +
                `<img src="${SafariConstants.SPRITE_URL_BASE}tauros.gif" width="80" height="80" style="margin-left:30px"><br />` +
                `<button class="button" name="send" value="/safari join">Click to join!</button>` +
                `</div></div>`;
            
            this.room.add(`|uhtml|safari-waiting|${startMsg}`, -1000).update();
            return;
        }

          this.room.add(`|uhtmlchange|safari-waiting|`, -1000);

        const currentPlayerId = this.turnOrder[this.currentTurn];
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((SafariConstants.TURN_TIME - (now - this.turnStartTime)) / 1000));

        if (this.status === SafariConstants.STATUS.STARTED) {
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
                        const state = this.movementStates[userid];
                        
                        if (!state || state.canMove) {
                            // Show movement buttons
                            buf += `<br /><div style="margin: 10px;">`;
                            buf += `<button class="button" style="margin: 5px;" name="send" value="/safari move up">↑</button><br />`;
                            buf += `<button class="button" style="margin: 5px;" name="send" value="/safari move left">←</button>`;
                            buf += `<button class="button" style="margin: 5px;" name="send" value="/safari move right">→</button><br />`;
                            buf += `<button class="button" style="margin: 5px;" name="send" value="/safari move down">↓</button>`;
                            buf += `</div>`;
                            buf += `<br /><b>Choose a direction to move!</b>`;
                        } else if (state.pokemonDisplayed && state.currentPokemon) {
                            // Show the Pokemon and throw button
                            buf += `<br /><div style="margin: 10px;">`;
                            buf += `<img src="${state.currentPokemon.sprite}" width="80" height="80">`;
                            buf += `<br /><b>A wild ${state.currentPokemon.name} appeared!</b>`;
                            buf += `<br /><button class="button" style="font-size: 12pt; padding: 8px 16px; margin-top: 10px;" `;
                            buf += `name="send" value="/safari throw">Throw Safari Ball</button>`;
                            buf += `</div>`;
                        }

                        if (timeLeft <= 10) {
                            buf += `<br /><small style="color: #ff5555">Warning: You'll lose a ball if you don't act!</small>`;
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
        } else if (this.status === SafariConstants.STATUS.ENDED) {
            for (const userid in this.players) {
                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-player-${userid}|`);
                }
            }
        }

        // Update spectator view
        for (const spectatorId of this.spectators) {
            if (this.status === SafariConstants.STATUS.ENDED) {
                const roomUser = Users.get(spectatorId);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${spectatorId}|`);
                }
            } else {
                this.displayToSpectator(spectatorId);
            }
        }
    }

    public addPlayer(user: User): string | null {
        if (this.status !== SafariConstants.STATUS.WAITING) return "The game has already started!";
        if (this.players[user.id]) return "You have already joined the game!";

        this.players[user.id] = {
            name: user.name,
            id: user.id,
            points: 0,
            catches: [],
            ballsLeft: this.ballsPerPlayer,
            lastCatch: 0
        };

        this.display();
        
        if (Object.keys(this.players).length === SafariConstants.MAX_PLAYERS) {
            this.start(user);
        }

        user.sendTo(this.room, `|html|<div class="broadcast-green"><b>You have successfully joined the Safari Zone game!</b></div>`);
        
        return null;
    }

    public throwBall(user: User): string | null {
        if (this.status !== SafariConstants.STATUS.STARTED) return "The game hasn't started yet!";
        if (!this.players[user.id]) return "You're not in this game!";
        
        const currentPlayerId = this.turnOrder[this.currentTurn];
        if (user.id !== currentPlayerId) return "It's not your turn!";

        const state = this.movementStates[user.id];
        if (!state?.pokemonDisplayed) return "You need to move first!";
        
        const player = this.players[user.id];
        if (player.ballsLeft <= 0) return "You have no Safari Balls left!";

        player.lastCatch = Date.now();
        player.ballsLeft--;

        if (state.currentPokemon) {
            player.catches.push(state.currentPokemon);
            player.points += state.currentPokemon.points;
            this.lastWasCatch = true;
            this.lastCatchMessage = `${player.name} caught a ${state.currentPokemon.name} worth ${state.currentPokemon.points} points! (${player.ballsLeft} balls left)`;
        } else {
            this.lastWasCatch = false;
            this.lastCatchMessage = `${player.name}'s Safari Ball missed! (${player.ballsLeft} balls left)`;
        }

        // Reset movement state for next turn
        delete this.movementStates[user.id];
        this.nextTurn();
        return null;
    }

    public start(user: User): string | null {
        if (this.status !== SafariConstants.STATUS.WAITING) return "The game has already started!";
        if (Object.keys(this.players).length < SafariConstants.MIN_PLAYERS) return "Not enough players to start!";
        if (!this.players[user.id]) return "You must be in the game to start it!";

        this.status = SafariConstants.STATUS.STARTED;
        this.clearTimer();
        this.initializeTurnOrder();
        this.display();
        this.startTurnTimer();
        return null;
    }

    public disqualifyPlayer(targetId: string, executor: string): string | null {
        if (toID(executor) !== toID(this.host)) return "Only the game creator can disqualify players.";
        if (this.status === SafariConstants.STATUS.ENDED) return "The game has already ended.";
        
        const player = this.players[targetId];
        if (!player) return "That player is not in this game.";

        delete this.players[targetId];
        this.display();

        if (this.status === SafariConstants.STATUS.STARTED) {
            if (Object.keys(this.players).length < SafariConstants.MIN_PLAYERS) {
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

    public end(inactive: boolean = false) {
        if (this.status === SafariConstants.STATUS.ENDED) return;

        this.clearTimer();
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
        this.status = SafariConstants.STATUS.ENDED;

        const now = Date.now();
        if (inactive && Object.keys(this.players).length < SafariConstants.MIN_PLAYERS) {
            const inactiveMsg = `<div class="infobox">The Safari Zone game has been canceled due to inactivity.</div>`;
            this.room.add(`|uhtml|safari-end|${inactiveMsg}`).update();
            delete this.room.safari;
            return;
        }

        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
        let endMsg = `<div class="infobox"><center><h2>Safari Zone Results</h2>`;
        endMsg += `<small>Game Ended: ${this.formatUTCTime(now)} UTC</small><br />`;
        endMsg += `<small>Duration: ${Math.floor((now - this.gameStartTime) / 1000)} seconds</small><br /><br />`;
        
        if (sortedPlayers.length > 0) {
            const prizes = [
                SafariConstants.PRIZE_DISTRIBUTION.FIRST,
                SafariConstants.PRIZE_DISTRIBUTION.SECOND,
                SafariConstants.PRIZE_DISTRIBUTION.THIRD
            ];
            const top3Players = sortedPlayers.slice(0, 3);
            
            endMsg += `<table border="1" cellspacing="0" cellpadding="3">`;
            endMsg += `<tr><th>Place</th><th>Player</th><th>Points</th><th>Prize</th><th>Catches</th></tr>`;
            
            top3Players.forEach((player, index) => {
                const prize = Math.floor(this.prizePool * prizes[index]);
                endMsg += `<tr>`;
                endMsg += `<td>${index + 1}${['st', 'nd', 'rd'][index]}</td>`;
                endMsg += `<td>${Impulse.nameColor(player.name, true, true)}</td>`;
                endMsg += `<td>${player.points}</td>`;
                endMsg += `<td>${prize} coins</td>`;
                endMsg += `<td>${player.catches.map(pk => 
                    `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`
                ).join('')}</td>`;
                endMsg += `</tr>`;
                
                if (prize > 0) {
                    Economy.addMoney(player.id, prize, `Safari Zone ${index + 1}${['st', 'nd', 'rd'][index]} place`);
                }
            });
            endMsg += `</table>`;
        } else {
            endMsg += `No winners in this game.`;
        }
        endMsg += `</center></div>`;

        // Clear all player displays
        for (const userid in this.players) {
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.room, `|uhtmlchange|safari-player-${userid}|`);
            }
        }

        // Clear all spectator displays
        for (const spectatorId of this.spectators) {
            const roomUser = Users.get(spectatorId);
            if (roomUser?.connected) {
                roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${spectatorId}|`);
            }
        }

        // Display the final results
        this.room.add(`|uhtml|safari-end|${endMsg}`).update();
        delete this.room.safari;
    }
}
