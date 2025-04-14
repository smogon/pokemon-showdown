/*************************************
 * Pokemon Safari Zone Game          *
 * Author: @musaddiktemkar          *
 * Last Updated: 2025-04-13         *
 *************************************/

import { FS } from '../../lib/fs';
import { Dex } from '../../sim/dex';

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
        
        const getDetails = (species: Species) => {
            const baseStats = species.baseStats;
            const bst = Object.values(baseStats).reduce((a, b) => a + b, 0);
            
            if (bst >= 600) return { rarity: 0.05, points: 100 };      // Legendaries/Very Strong
            if (bst >= 500) return { rarity: 0.1, points: 50 };        // Strong
            if (bst >= 400) return { rarity: 0.15, points: 30 };       // Medium
            return { rarity: 0.3, points: 10 };                        // Common
        };

        const allSpecies = Array.from(dex.species.all())
            .filter(species => !species.isNonstandard && !species.forme)
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);

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

    private display() {
        if (this.status === 'waiting') {
            const startMsg = `` +
                `<div class="infobox">` +
                    `<div style="background: #162C19; color: #FFFFFF; padding: 8px; text-align: center;">` +
                        `<strong style="font-size: 14pt;">Safari Zone</strong>` +
                    `</div>` +
                    `<div style="background: url('https://play.pokemonshowdown.com/sprites/gen6bgs/forest.png'); padding: 10px; text-align: center;">` +
                        `<div style="background: rgba(255, 255, 255, 0.8); padding: 8px; border-radius: 4px;">` +
                            `<table style="margin: 0 auto; width: 100%;">` +
                                `<tr>` +
                                    `<td colspan="2" style="padding: 8px;">` +
                                        `<img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" width="80" height="80">` +
                                        `<img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80">` +
                                    `</td>` +
                                `</tr>` +
                                `<tr>` +
                                    `<td style="padding: 4px; text-align: right; width: 50%;"><b>Host:</b></td>` +
                                    `<td style="padding: 4px; text-align: left;">${Impulse.nameColor(this.host, true, true)}</td>` +
                                `</tr>` +
                                `<tr>` +
                                    `<td style="padding: 4px; text-align: right;"><b>Entry Fee:</b></td>` +
                                    `<td style="padding: 4px; text-align: left;">${this.entryFee} coins</td>` +
                                `</tr>` +
                                `<tr>` +
                                    `<td style="padding: 4px; text-align: right;"><b>Safari Balls:</b></td>` +
                                    `<td style="padding: 4px; text-align: left;">${SafariGame.BALLS_PER_PLAYER} per player</td>` +
                                `</tr>` +
                                `<tr>` +
                                    `<td style="padding: 4px; text-align: right;"><b>Players:</b></td>` +
                                    `<td style="padding: 4px; text-align: left;">${this.getPlayerList()}</td>` +
                                `</tr>` +
                                `<tr>` +
                                    `<td colspan="2" style="padding: 4px; text-align: center;">` +
                                        `<small>${this.formatUTCTime(Date.now())}</small>` +
                                    `</td>` +
                                `</tr>` +
                                `<tr>` +
                                    `<td colspan="2" style="padding: 8px;">` +
                                        `<button class="button" style="background: #4CAF50; color: white; padding: 8px 16px;" ` +
                                            `name="send" value="/safari join">Enter Safari Zone!</button>` +
                                        `<br><br>` +
                                        `<button class="button" style="background: #5555FF; color: white; padding: 4px 8px;" ` +
                                            `name="send" value="/safari spectate">Spectate Game</button>` +
                                    `</td>` +
                                `</tr>` +
                            `</table>` +
                        `</div>` +
                    `</div>` +
                `</div>`;
            
            this.room.add(`|uhtml|safari-waiting|${startMsg}`, -1000).update();
            return;
        }

        // Game Started UI for Players
        if (this.status === 'started') {
            const currentPlayerId = this.turnOrder[this.currentTurn];
            const now = Date.now();
            const timeLeft = Math.max(0, Math.ceil((SafariGame.TURN_TIME - (now - this.turnStartTime)) / 1000));

            // Update spectator view
            for (const spectatorId of this.spectators) {
                this.displayToSpectator(spectatorId);
            }

            // Update player views
            for (const userid in this.players) {
                const player = this.players[userid];
                const isCurrentPlayer = userid === currentPlayerId;
                
                let buf = `` +
                    `<div class="infobox">` +
                        `<div style="background: #162C19; color: #FFFFFF; padding: 8px; text-align: center;">` +
                            `<strong style="font-size: 14pt;">Safari Zone</strong>` +
                        `</div>` +
                        `<div style="background: url('https://play.pokemonshowdown.com/sprites/gen6bgs/forest.png');">` +
                            `<div style="background: rgba(255, 255, 255, 0.8); padding: 10px;">` +
                                `<table style="margin: 0 auto; width: 100%;">` +
                                    `<tr>` +
                                        `<td style="padding: 8px; text-align: center;">` +
                                            `<strong>${this.formatUTCTime(now)}</strong><br>` +
                                            `<strong>Turn: ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}</strong>` +
                                            `<strong style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}"> (${timeLeft}s)</strong>` +
                                        `</td>` +
                                    `</tr>`;

                if (isCurrentPlayer && player.ballsLeft > 0) {
                    const randomPokemon = this.pokemonPool[Math.floor(Math.random() * this.pokemonPool.length)];
                    buf += `` +
                        `<tr>` +
                            `<td style="padding: 15px; text-align: center; background: rgba(245, 245, 245, 0.9);">` +
                                `<div style="margin: 10px 0;">` +
                                    `<img src="${randomPokemon.sprite}" width="120" height="120">` +
                                `</div>` +
                                `<div style="margin: 10px 0;">` +
                                    `<strong>A wild Pokémon appeared!</strong>` +
                                `</div>` +
                            `</td>` +
                        `</tr>`;
                }

                buf += `` +
                    `<tr>` +
                        `<td style="padding: 8px; background: rgba(249, 249, 249, 0.9);">` +
                            `<table style="width: 100%;">` +
                                `<tr>` +
                                    `<td style="text-align: left;">` +
                                        `<strong>Safari Balls:</strong> ${player.ballsLeft}` +
                                        `<strong style="margin-left: 15px;">Points:</strong> ${player.points}` +
                                    `</td>` +
                                `</tr>` +
                            `</table>` +
                        `</td>` +
                    `</tr>`;

                if (isCurrentPlayer && player.ballsLeft > 0) {
                    buf += `` +
                        `<tr>` +
                            `<td style="padding: 8px; text-align: center;">` +
                                `<button class="button" style="background: ${timeLeft <= 10 ? '#ff5555' : '#4CAF50'}; color: white; padding: 8px 16px;" ` +
                                    `name="send" value="/safari throw">Throw Safari Ball!</button>` +
                            `</td>` +
                        `</tr>`;
                }

                if (player.catches.length > 0) {
                    buf += `` +
                        `<tr>` +
                            `<td style="padding: 8px;">` +
                                `<div style="margin-bottom: 5px;"><strong>Your Catches:</strong></div>` +
                                `<div style="background: rgba(245, 245, 245, 0.9); padding: 8px;">` +
                                    player.catches.map(pk => `` +
                                        `<div style="display: inline-block; margin: 2px; background: rgba(255, 255, 255, 0.9); padding: 4px;">` +
                                            `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">` +
                                            `<div style="font-size: 0.8em;">${pk.points}pts</div>` +
                                        `</div>`
                                    ).join('') +
                                `</div>` +
                            `</td>` +
                        `</tr>`;
                }

                if (this.lastCatchMessage) {
                    buf += `` +
                        `<tr>` +
                            `<td style="padding: 8px; text-align: center; background: ${this.lastWasCatch ? 'rgba(232, 245, 233, 0.9)' : 'rgba(255, 235, 238, 0.9)'};">` +
                                `<strong style="color: ${this.lastWasCatch ? '#2E7D32' : '#C62828'};">` +
                                    `${this.lastCatchMessage}` +
                                `</strong>` +
                            `</td>` +
                        `</tr>`;
                }

                buf += `` +
                    `</table></div></div></div>`;

                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtml|safari-player-${userid}|${buf}`);
                }
            }
        }

        // End game display
        if (this.status === 'ended') {
            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            let endMsg = `` +
                `<div class="infobox">` +
                    `<div style="background: #162C19; color: #FFFFFF; padding: 8px; text-align: center;">` +
                        `<strong style="font-size: 14pt;">Safari Zone Results</strong>` +
                    `</div>` +
                    `<div style="background: url('https://play.pokemonshowdown.com/sprites/gen6bgs/forest.png'); padding: 10px;">` +
                        `<div style="background: rgba(255, 255, 255, 0.8); padding: 8px; border-radius: 4px; text-align: center;">` +
                            `<div style="margin-bottom: 10px;">` +
                                `<small>Game Ended: ${this.formatUTCTime(Date.now())}</small><br>` +
                                `<small>Duration: ${Math.floor((Date.now() - this.gameStartTime) / 1000)} seconds</small>` +
                            `</div>`;

            if (sortedPlayers.length > 0) {
                const prizes = [0.6, 0.3, 0.1];
                sortedPlayers.forEach((player, index) => {
                    if (index < 3) {
                        const prize = Math.floor(this.prizePool * prizes[index]);
                        endMsg += `` +
                            `<div style="margin: 5px 0;">` +
                                `${index + 1}. ${Impulse.nameColor(player.name, true, true)} - ${player.points} points ` +
                                `<span style="color: #4CAF50;">(Won ${prize} coins)</span>` +
                            `</div>`;
                    }
                });
            } else {
                endMsg += `<div>No winners in this game.</div>`;
            }

            endMsg += `</div></div></div>`;
            this.room.add(`|uhtml|safari-results|${endMsg}`, -1000).update();

            // Clear all player displays
            for (const userid in this.players) {
                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-player-${userid}|`);
                }
            }

            // Clear all spectator displays
            for (const spectatorId of this.spectators) {
                this.removeSpectator(spectatorId);
            }
        }
    }

    private displayToSpectator(userid: string): void {
        if (!this.spectators.has(userid)) return;
        
        const now = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const timeLeft = Math.max(0, Math.ceil((SafariGame.TURN_TIME - (now - this.turnStartTime)) / 1000));
        
        let buf = `` +
            `<div class="infobox">` +
                `<div style="background: #162C19; color: #FFFFFF; padding: 8px; text-align: center;">` +
                    `<strong style="font-size: 14pt;">Safari Zone (Spectator View)</strong>` +
                `</div>` +
                `<div style="background: url('https://play.pokemonshowdown.com/sprites/gen6bgs/forest.png');">` +
                    `<div style="background: rgba(255, 255, 255, 0.8); padding: 10px;">` +
                        `<table style="margin: 0 auto; width: 100%;">` +
                            `<tr>` +
                                `<td style="padding: 8px; text-align: center;">` +
                                    `<strong>${this.formatUTCTime(now)} UTC</strong><br>` +
                                    `<strong>Game Duration:</strong> ${Math.floor((now - this.gameStartTime) / 1000)}s<br>` +
                                    `<strong>Prize Pool:</strong> ${this.prizePool} coins` +
                                `</td>` +
                            `</tr>`;

        if (this.status === 'started' && currentPlayerId) {
            buf += `` +
                `<tr>` +
                    `<td style="padding: 8px; text-align: center; background: rgba(245, 245, 245, 0.9);">` +
                        `<strong>Current Turn:</strong> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}` +
                        `<strong style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}"> (${timeLeft}s)</strong>` +
                    `</td>` +
                `</tr>`;
        }

        if (Object.keys(this.players).length) {
            buf += `` +
                `<tr>` +
                    `<td style="padding: 8px;">` +
                        `<table style="width: 100%; background: rgba(249, 249, 249, 0.9);">` +
                            `<tr style="background: rgba(232, 245, 233, 0.9);">` +
                                `<th style="padding: 4px;">Player</th>` +
                                `<th style="padding: 4px;">Points</th>` +
                                `<th style="padding: 4px;">Balls</th>` +
                                `<th style="padding: 4px;">Catches</th>` +
                            `</tr>`;

            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            for (const p of sortedPlayers) {
                const isCurrentTurn = p.id === currentPlayerId;
                buf += `` +
                    `<tr${isCurrentTurn ? ` style="background: rgba(232, 245, 233, 0.9);"` : ``}>` +
                        `<td style="padding: 4px;">${Impulse.nameColor(p.name, true, true)}${isCurrentTurn ? ' ⭐' : ''}</td>` +
                        `<td style="padding: 4px;">${p.points}</td>` +
                        `<td style="padding: 4px;">${p.ballsLeft}</td>` +
                        `<td style="padding: 4px;">${p.catches.map(pk => 
                            `<img src="${pk.sprite}" width="40" height="30" title="${pk.name} (${pk.points}pts)">`
                        ).join('')}</td>` +
                    `</tr>`;
            }
            buf += `</table></td></tr>`;
        }

        if (this.lastCatchMessage) {
            buf += `` +
                `<tr>` +
                    `<td style="padding: 8px; text-align: center; background: ${this.lastWasCatch ? 'rgba(232, 245, 233, 0.9)' : 'rgba(255, 235, 238, 0.9)'};">` +
                        `<strong style="color: ${this.lastWasCatch ? '#2E7D32' : '#C62828'};">` +
                            `${this.lastCatchMessage}` +
                        `</strong>` +
                    `</td>` +
                `</tr>`;
        }

        buf += `` +
            `<tr>` +
                `<td style="padding: 8px; text-align: center;">` +
                    `<small style="color: #666666">You are spectating this game - ` +
                    `<button class="button" style="background: #ff5555; color: white; font-size: 8pt; padding: 2px 4px;" ` +
                        `name="send" value="/safari unspectate">Stop Spectating</button>` +
                    `</small>` +
                `</td>` +
            `</tr>` +
            `</table></div></div></div>`;

        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtml|safari-spectator-${userid}|${buf}`);
        }
    }

    addSpectator(userid: string): void {
        if (this.players[userid]) return; // Players can't spectate
        this.spectators.add(userid);
        this.displayToSpectator(userid);
    }

    removeSpectator(userid: string): void {
        this.spectators.delete(userid);
        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${userid}|`);
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

        // Clear all spectators
        for (const spectatorId of this.spectators) {
            this.removeSpectator(spectatorId);
        }
        this.spectators.clear();

        if (inactive && Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
            for (const id in