/*************************************
 * Pokemon Safari Zone Renderer      *
 * Author: @musaddiktemkar           *
 * Updated by: @smoothoperator07     *
 * Last Updated: 2025-04-15          *
 **************************************/

import { Player, GameStatus, SAFARI_CONSTANTS } from './safari-types';

/**
 * Handles all rendering and UI functionality for the Safari Zone game
 */
export class SafariRenderer {
    private game: any; // Reference to the SafariGame instance

    constructor(game: any) {
        this.game = game;
    }

    /**
     * Formats timestamp to UTC time string
     * @param timestamp Timestamp to format
     * @returns Formatted time string
     */
    formatUTCTime(timestamp: number): string {
        return new Date(timestamp)
            .toISOString()
            .replace('T', ' ')
            .substr(0, 19);
    }

    /**
     * Gets a formatted player list
     * @returns String of player names
     */
    getPlayerList(): string {
        const players = Object.values(this.game.players);
        if (players.length === 0) return 'None';
        return players.map((p: Player) => Impulse.nameColor(p.name, true, true)).join(', ');
    }

    /**
     * Main method to display the game UI
     */
    display() {
        const status = this.game.getStatus();
        
        if (status === 'waiting') {
            this.displayWaitingScreen();
            return;
        }

        this.game.room.add(`|uhtmlchange|safari-waiting|`, -1000);

        const currentPlayerId = this.game.turnOrder[this.game.currentTurn];

        if (status === 'started') {
            this.displayActiveGameForPlayers(currentPlayerId);
        } else if (status === 'ended') {
            this.clearAllPlayerDisplays();
        }

        this.updateSpectatorsView(status);
    }

    private displayWaitingScreen() {
        const startMsg = 
            `<div class="safari-zone-box">` +
            `<div class="safari-content">` +
            `<div class="safari-title">` +
            `<h1>SAFARI ZONE</h1>` +
            `<div class="safari-subtitle">A wild Pokémon adventure awaits!</div>` +
            `</div>` +
            `<div class="safari-info-container">` +
            `<div class="safari-info-section">` +
            `<div class="safari-section-header">SAFARI INFO</div>` +
            `<div><b>Guide:</b> ${Impulse.nameColor(this.game.getHost(), true, true)}</div>` +
            `<div><b>Time:</b> ${this.formatUTCTime(Date.now())} UTC</div>` +
            `<div><b>Safari Balls:</b> ${this.game.getBallsPerPlayer()} per explorer</div>` +
            `<div><b>Prize Pool:</b> ${this.game.getPrizePool()} coins</div>` +
            `</div>` +
            `<div class="safari-info-section">` +
            `<div class="safari-section-header">EXPLORERS</div>` +
            `<div>${this.getPlayerList()}</div>` +
            `<div class="safari-player-limits">` +
            `Min players: ${SAFARI_CONSTANTS.MIN_PLAYERS} | Max: ${SAFARI_CONSTANTS.MAX_PLAYERS}` +
            `</div>` +
            `</div>` +
            `</div>` +
            `<div class="safari-pokemon-display">` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/scyther.gif" width="80" height="80" class="safari-pokemon">` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80" class="safari-pokemon">` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/kangaskhan.gif" width="80" height="80" class="safari-pokemon">` +
            `</div>` +
            `<div class="safari-join-button">` +
            `<button class="button" name="send" value="/safari join">Join Safari Zone!</button>` +
            `</div>` +
            `<div class="safari-tips">` +
            `<div class="safari-tips-header">SAFARI TIPS:</div>` +
            `<div>• Move carefully to find rare Pokémon!</div>` +
            `<div>• Stronger Pokémon are worth more points</div>` +
            `<div>• Each Safari Ball is precious - use them wisely</div>` +
            `</div>` +
            `</div>` +
            `</div>`;
        
        this.game.room.add(`|uhtml|safari-waiting|${startMsg}`).update();
    }

    private displayActiveGameForPlayers(currentPlayerId: string) {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((SAFARI_CONSTANTS.TURN_TIME - (now - this.game.turnStartTime)) / 1000));

        for (const userid in this.game.players) {
            const player = this.game.players[userid];
            let buf = `<div class="safari-game-box">` +
                     `<div class="safari-content">` +
                     `<h2 class="safari-game-title">Safari Zone Game</h2>`;
            
            buf += `<div class="safari-game-info">` +
                   `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />` +
                   `<small>Game Duration: ${Math.floor((now - this.game.getGameStartTime()) / 1000)}s</small>` +
                   `</div>`;
            
            buf += `<div class="safari-game-stats">` +
                   `<b>Host:</b> ${Impulse.nameColor(this.game.getHost(), true, true)}<br />` +
                   `<b>Status:</b> ${this.game.getStatus()}<br />` +
                   `<b>Prize Pool:</b> ${this.game.getPrizePool()} coins<br />` +
                   `</div>`;

            buf += `<div class="safari-turn-info">` +
                   `<b>Current Turn:</b> ${Impulse.nameColor(this.game.players[currentPlayerId].name, true, true)}` +
                   ` <b class="safari-timer ${timeLeft <= 10 ? 'warning' : ''}">(${timeLeft}s left)</b>` +
                   `</div>`;

            if (Object.keys(this.game.players).length) {
                buf += this.renderPlayerTable(currentPlayerId, userid);
            }

            if (this.game.getLastCatchMessage()) {
                buf += `<div class="safari-catch-message ${this.game.getLastWasCatch() ? 'success' : 'failure'}">` +
                       `${this.game.getLastCatchMessage()}` +
                       `</div>`;
            }

            if (userid === currentPlayerId) {
                buf += this.renderPlayerControls(userid, player, timeLeft);
            } else {
                const currentPlayer = this.game.players[currentPlayerId];
                buf += `<div class="safari-waiting-message">` +
                       `Waiting for ${currentPlayer.name}'s turn... (${timeLeft}s left)` +
                       `</div>`;
            }

            buf += `</div></div>`;
            
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.game.room, `|uhtml|safari-player-${userid}|${buf}`);
            }
        }
    }

    private renderPlayerTable(currentPlayerId: string, currentUserid: string): string {
        let buf = `<table class="safari-player-table">` +
                 `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
        const sortedPlayers = Object.values(this.game.players).sort((a: Player, b: Player) => b.points - a.points);
        
        for (const p of sortedPlayers) {
            const isCurrentTurn = p.id === currentPlayerId;
            buf += `<tr class="${isCurrentTurn ? 'current-turn' : ''}">` +
                   `<td>${Impulse.nameColor(p.name, true, true)}${p.id === currentUserid ? ' (You)' : ''}${isCurrentTurn ? ' ⭐' : ''}</td>` +
                   `<td>${p.points}</td>` +
                   `<td>${p.ballsLeft}</td>` +
                   `<td>${p.catches.map(pk => `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`).join('')}</td>` +
                   `</tr>`;
        }
        
        buf += `</table>`;
        return buf;
    }

    private renderPlayerControls(userid: string, player: Player, timeLeft: number): string {
        let buf = `<div class="safari-controls">`;
        
        if (player.ballsLeft > 0) {
            const state = this.game.getMovementState(userid);
            
            if (!state || state.canMove) {
                buf += `<div class="movement-controls">` +
                       `<button name="send" value="/safari move up">↑</button><br />` +
                       `<button name="send" value="/safari move left">←</button>` +
                       `<button name="send" value="/safari move right">→</button><br />` +
                       `<button name="send" value="/safari move down">↓</button>` +
                       `</div>` +
                       `<div class="movement-prompt"><b>Choose a direction to move!</b></div>`;
            } else if (state.pokemonDisplayed && state.currentPokemon) {
                buf += `<div class="pokemon-encounter">` +
                       `<img src="${state.currentPokemon.sprite}" width="80" height="80">` +
                       `<div class="encounter-text"><b>A wild ${state.currentPokemon.name} appeared!</b></div>` +
                       `<button class="throw-ball" name="send" value="/safari throw">Throw Safari Ball</button>` +
                       `</div>`;
            }

            if (timeLeft <= 10) {
                buf += `<div class="warning-text">Warning: You'll lose a ball if you don't act!</div>`;
            }
        } else {
            buf += `<div class="no-balls-message">You have no Safari Balls left!</div>`;
        }
        
        buf += `</div>`;
        return buf;
    }

    private clearAllPlayerDisplays() {
        for (const userid in this.game.players) {
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.game.room, `|uhtmlchange|safari-player-${userid}|`);
            }
        }
    }

    private updateSpectatorsView(status: GameStatus) {
        for (const spectatorId of this.game.getSpectators()) {
            if (status === 'ended') {
                const roomUser = Users.get(spectatorId);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.game.room, `|uhtmlchange|safari-spectator-${spectatorId}|`);
                }
            } else {
                this.displayToSpectator(spectatorId);
            }
        }
    }

    displayToSpectator(userid: string): void {
        if (!this.game.getSpectators().has(userid)) return;
        
        const now = Date.now();
        const currentPlayerId = this.game.turnOrder[this.game.currentTurn];
        const timeLeft = Math.max(0, Math.ceil((SAFARI_CONSTANTS.TURN_TIME - (now - this.game.turnStartTime)) / 1000));
        
        let buf = `<div class="safari-spectator-box">` +
                 `<div class="safari-content">` +
                 `<h2 class="safari-game-title">Safari Zone Game${this.game.getStatus() === 'ended' ? ' (Ended)' : ''}</h2>`;
        
        buf += `<div class="safari-game-info">` +
               `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />` +
               `<small>Game Duration: ${Math.floor((now - this.game.getGameStartTime()) / 1000)}s</small>` +
               `</div>`;
        
        buf += `<div class="safari-game-stats">` +
               `<b>Host:</b> ${Impulse.nameColor(this.game.getHost(), true, true)}<br />` +
               `<b>Status:</b> ${this.game.getStatus()}<br />` +
               `<b>Prize Pool:</b> ${this.game.getPrizePool()} coins<br />` +
               `</div>`;

        if (this.game.getStatus() === 'started' && currentPlayerId) {
            buf += `<div class="safari-turn-info">` +
                   `<b>Current Turn:</b> ${Impulse.nameColor(this.game.players[currentPlayerId].name, true, true)}` +
                   ` <b class="safari-timer ${timeLeft <= 10 ? 'warning' : ''}">(${timeLeft}s left)</b>` +
                   `</div>`;
        }

        if (Object.keys(this.game.players).length) {
            buf += this.renderPlayerTable(currentPlayerId, userid);
        }

        if (this.game.getStatus() === 'started' && this.game.getLastCatchMessage()) {
            buf += `<div class="safari-catch-message ${this.game.getLastWasCatch() ? 'success' : 'failure'}">` +
                   `${this.game.getLastCatchMessage()}` +
                   `</div>`;
        }

        buf += `<div class="spectator-notice">You are spectating this game</div>` +
               `</div></div>`;

        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.game.room, `|uhtml|safari-spectator-${userid}|${buf}`);
        }
    }

    displayEndResults(): void {
        const now = Date.now();
        const sortedPlayers = Object.values(this.game.players).sort((a: Player, b: Player) => b.points - a.points);
        
        let endMsg = `<div class="safari-results-box">` +
                    `<div class="safari-content">` +
                    `<h2 class="safari-results-title">Safari Zone Results</h2>`;
        
        endMsg += `<div class="safari-results-info">` +
                  `<small>Game Ended: ${this.formatUTCTime(now)} UTC</small><br />` +
                  `<small>Duration: ${Math.floor((now - this.game.getGameStartTime()) / 1000)} seconds</small>` +
                  `</div>`;
        
        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1];
            const top3Players = sortedPlayers.slice(0, 3);
            
            endMsg += `<table class="safari-results-table">` +
                     `<tr><th>Place</th><th>Player</th><th>Points</th><th>Prize</th><th>Catches</th></tr>`;
            
            top3Players.forEach((player: Player, index: number) => {
                const prize = Math.floor(this.game.getPrizePool() * prizes[index]);
                const place = index + 1;
                const suffix = ['st', 'nd', 'rd'][index];
                
                endMsg += `<tr class="place-${place}">` +
                         `<td>${place}${suffix}</td>` +
                         `<td>${Impulse.nameColor(player.name, true, true)}</td>` +
                         `<td>${player.points}</td>` +
                         `<td>${prize} coins</td>` +
                         `<td>${player.catches.map(pk => 
                             `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`
                         ).join('')}</td>` +
                         `</tr>`;
                
                if (prize > 0) {
                    Economy.addMoney(player.id, prize, `Safari Zone ${place}${suffix} place`);
                }
            });
            endMsg += `</table>`;
        } else {
            endMsg += `<div class="no-winners">No winners in this game.</div>`;
        }
        endMsg += `</div></div>`;

        // Clear all player displays
        this.clearAllPlayerDisplays();

        // Clear all spectator displays
        for (const spectatorId of this.game.getSpectators()) {
            const roomUser = Users.get(spectatorId);
            if (roomUser?.connected) {
                roomUser.sendTo(this.game.room, `|uhtmlchange|safari-spectator-${spectatorId}|`);
            }
        }

        // Display the final results
        this.game.room.add(`|uhtml|safari-end|${endMsg}`).update();
    }
}
