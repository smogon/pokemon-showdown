/*************************************
 * Pokemon Safari Zone Renderer      *
 * Author: @musaddiktemkar           *
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
     * @param status Current game status
     * @param players Players object
     * @param turnOrder Array of player IDs in turn order
     * @param currentTurn Current turn index
     * @param turnStartTime When the current turn started
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

        // Update spectator view
        this.updateSpectatorsView(status);
    }

    /**
     * Displays the waiting screen when the game is in waiting state
     */
    private displayWaitingScreen() {
        const startMsg = 
            `<div class="infobox">` +
            `<div style="text-align:center;margin:5px">` +
            `<h2 style="color:#24678d">Safari Zone Game</h2>` +
            `<small>Game Time: ${this.formatUTCTime(Date.now())} UTC</small><br />` +
            `<b>Started by:</b> ${Impulse.nameColor(this.game.getHost(), true, true)}<br />` +
            `<b>Prize Pool:</b> ${this.game.getPrizePool()} coins<br />` +
            `<b>Pokeballs:</b> ${this.game.getBallsPerPlayer()} per player<br />` +
            `<b>Players:</b> ${this.getPlayerList()}<br /><br />` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" width="80" height="80" style="margin-right:30px">` +
            `<img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80" style="margin-left:30px"><br />` +
            `<button class="button" name="send" value="/safari join">Click to join!</button>` +
            `</div></div>`;
        
        this.game.room.add(`|uhtml|safari-waiting|${startMsg}`, -1000).update();
    }

    /**
     * Displays the active game UI for all players
     * @param currentPlayerId ID of the player whose turn it is
     */
    private displayActiveGameForPlayers(currentPlayerId: string) {
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((SAFARI_CONSTANTS.TURN_TIME - (now - this.game.turnStartTime)) / 1000));

        for (const userid in this.game.players) {
            const player = this.game.players[userid];
            let buf = `<div class="infobox"><div style="text-align:center">`;
            buf += `<h2>Safari Zone Game</h2>`;
            
            buf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
            buf += `<small>Game Duration: ${Math.floor((now - this.game.getGameStartTime()) / 1000)}s</small><br />`;
            
            buf += `<b>Host:</b> ${Impulse.nameColor(this.game.getHost(), true, true)}<br />`;
            buf += `<b>Status:</b> ${this.game.getStatus()}<br />`;
            buf += `<b>Prize Pool:</b> ${this.game.getPrizePool()} coins<br />`;

            buf += `<b>Current Turn:</b> ${Impulse.nameColor(this.game.players[currentPlayerId].name, true, true)}`;
            buf += ` <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;

            if (Object.keys(this.game.players).length) {
                buf += this.renderPlayerTable(currentPlayerId, userid);
            }

            if (this.game.getLastCatchMessage()) {
                buf += `<br /><div style="color: ${this.game.getLastWasCatch() ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.game.getLastCatchMessage()}</div>`;
            }

            if (userid === currentPlayerId) {
                buf += this.renderPlayerControls(userid, player, timeLeft);
            } else {
                const currentPlayer = this.game.players[currentPlayerId];
                buf += `<br /><div style="color: #666666">Waiting for ${currentPlayer.name}'s turn... (${timeLeft}s left)</div>`;
            }

            buf += `</div></div>`;
            
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.game.room, `|uhtml|safari-player-${userid}|${buf}`);
            }
        }
    }

    /**
     * Renders the player table with current game standings
     * @param currentPlayerId ID of the player whose turn it is
     * @param currentUserid ID of the user viewing the table
     * @returns HTML for the player table
     */
    private renderPlayerTable(currentPlayerId: string, currentUserid: string): string {
        let buf = `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
        buf += `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
        const sortedPlayers = Object.values(this.game.players).sort((a: Player, b: Player) => b.points - a.points);
        
        for (const p of sortedPlayers) {
            const isCurrentTurn = p.id === currentPlayerId;
            buf += `<tr${isCurrentTurn ? ' style="background-color: rgba(85, 85, 255, 0.1)"' : ''}>`;
            buf += `<td>${Impulse.nameColor(p.name, true, true)}${p.id === currentUserid ? ' (You)' : ''}${isCurrentTurn ? ' ⭐' : ''}</td>`;
            buf += `<td>${p.points}</td>`;
            buf += `<td>${p.ballsLeft}</td>`;
            buf += `<td>${p.catches.map(pk => `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`).join('')}</td>`;
            buf += `</tr>`;
        }
        
        buf += `</table>`;
        return buf;
    }

    /**
     * Renders the controls for the current player
     * @param userid ID of the current player
     * @param player Player object
     * @param timeLeft Time left in the current turn
     * @returns HTML for player controls
     */
    private renderPlayerControls(userid: string, player: Player, timeLeft: number): string {
        let buf = '';
        
        if (player.ballsLeft > 0) {
            const state = this.game.getMovementState(userid);
            
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
        
        return buf;
    }

    /**
     * Clear all player displays
     */
    private clearAllPlayerDisplays() {
        for (const userid in this.game.players) {
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.game.room, `|uhtmlchange|safari-player-${userid}|`);
            }
        }
    }

    /**
     * Update spectator views
     * @param status Current game status
     */
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

    /**
     * Display the game UI to a spectator
     * @param userid ID of the spectator
     */
    displayToSpectator(userid: string): void {
        if (!this.game.getSpectators().has(userid)) return;
        
        const now = Date.now();
        const currentPlayerId = this.game.turnOrder[this.game.currentTurn];
        const timeLeft = Math.max(0, Math.ceil((SAFARI_CONSTANTS.TURN_TIME - (now - this.game.turnStartTime)) / 1000));
        
        let buf = `<div class="infobox"><div style="text-align:center">`;
        buf += `<h2>Safari Zone Game${this.game.getStatus() === 'ended' ? ' (Ended)' : ''}</h2>`;
        buf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
        buf += `<small>Game Duration: ${Math.floor((now - this.game.getGameStartTime()) / 1000)}s</small><br />`;
        
        buf += `<b>Host:</b> ${Impulse.nameColor(this.game.getHost(), true, true)}<br />`;
        buf += `<b>Status:</b> ${this.game.getStatus()}<br />`;
        buf += `<b>Prize Pool:</b> ${this.game.getPrizePool()} coins<br />`;

        if (this.game.getStatus() === 'started' && currentPlayerId) {
            buf += `<b>Current Turn:</b> ${Impulse.nameColor(this.game.players[currentPlayerId].name, true, true)}`;
            buf += ` <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;
        }

        if (Object.keys(this.game.players).length) {
            buf += `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
            buf += `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
            const sortedPlayers = Object.values(this.game.players).sort((a: Player, b: Player) => b.points - a.points);
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

        if (this.game.getStatus() === 'started' && this.game.getLastCatchMessage()) {
            buf += `<br /><div style="color: ${this.game.getLastWasCatch() ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.game.getLastCatchMessage()}</div>`;
        }

        buf += `<br /><small style="color: #666666">You are spectating this game</small>`;
        buf += `</div></div>`;

        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.game.room, `|uhtml|safari-spectator-${userid}|${buf}`);
        }
    }

    /**
     * Display the end results of the game
     */
    displayEndResults(): void {
        const now = Date.now();
        const sortedPlayers = Object.values(this.game.players).sort((a: Player, b: Player) => b.points - a.points);
        
        let endMsg = `<div class="infobox"><center><h2>Safari Zone Results</h2>`;
        endMsg += `<small>Game Ended: ${this.formatUTCTime(now)} UTC</small><br />`;
        endMsg += `<small>Duration: ${Math.floor((now - this.game.getGameStartTime()) / 1000)} seconds</small><br /><br />`;
        
        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1];
            const top3Players = sortedPlayers.slice(0, 3);
            
            endMsg += `<table border="1" cellspacing="0" cellpadding="3">`;
            endMsg += `<tr><th>Place</th><th>Player</th><th>Points</th><th>Prize</th><th>Catches</th></tr>`;
            
            top3Players.forEach((player: Player, index: number) => {
                const prize = Math.floor(this.game.getPrizePool() * prizes[index]);
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
