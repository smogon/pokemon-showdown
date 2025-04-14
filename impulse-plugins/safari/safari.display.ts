import { SafariUtils } from './safari.utils';
import { Player, Pokemon, MovementState, GameStatus } from './safari.types';

export class SafariDisplay {
    constructor(
        private room: ChatRoom,
        private host: string,
        private players: {[k: string]: Player},
        private status: GameStatus,
        private prizePool: number,
        private ballsPerPlayer: number,
        private turnOrder: string[],
        private currentTurn: number,
        private turnStartTime: number,
        private gameStartTime: number,
        private lastCatchMessage: string | null,
        private lastWasCatch: boolean,
        private movementStates: { [k: string]: MovementState },
        private spectators: Set<string>
    ) {}

    private getPlayerList(): string {
        const players = Object.values(this.players);
        if (players.length === 0) return 'None';
        return players.map(p => Impulse.nameColor(p.name, true, true)).join(', ');
    }

    displayWaiting(): void {
        const startMsg = `<div class="infobox">
            <div style="text-align:center;margin:5px">
            <h2 style="color:#24678d">Safari Zone Game</h2>
            <small>Game Time: ${SafariUtils.formatUTCTime(Date.now())} UTC</small><br />
            <b>Started by:</b> ${Impulse.nameColor(this.host, true, true)}<br />
            <b>Prize Pool:</b> ${this.prizePool} coins<br />
            <b>Pokeballs:</b> ${this.ballsPerPlayer} per player<br />
            <b>Players:</b> ${this.getPlayerList()}<br /><br />
            <img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" width="80" height="80" style="margin-right:30px">
            <img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80" style="margin-left:30px"><br />
            <button class="button" name="send" value="/safari join">Click to join!</button>
            </div></div>`;
            
        this.room.add(`|uhtml|safari-waiting|${startMsg}`, -1000).update();
    }

    displayGameState(): void {
        if (this.status === 'waiting') {
            this.displayWaiting();
            return;
        }

        const now = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const timeLeft = Math.max(0, Math.ceil((30000 - (now - this.turnStartTime)) / 1000));

        // Update display for each player
        for (const userid in this.players) {
            this.displayForPlayer(userid, currentPlayerId, timeLeft, now);
        }

        // Update spectator displays
        for (const spectatorId of this.spectators) {
            this.displayForSpectator(spectatorId, currentPlayerId, timeLeft, now);
        }
    }

    private displayForPlayer(userid: string, currentPlayerId: string, timeLeft: number, now: number): void {
        const player = this.players[userid];
        let buf = this.generateGameHeader(now, currentPlayerId, timeLeft);
        buf += this.generatePlayerTable(currentPlayerId);
        
        if (this.lastCatchMessage) {
            buf += `<br /><div style="color: ${this.lastWasCatch ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.lastCatchMessage}</div>`;
        }

        if (userid === currentPlayerId) {
            buf += this.generateMovementControls(userid);
        }

        buf += `</div></div>`;
        
        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtml|safari-player-${userid}|${buf}`);
        }
    }

    private displayForSpectator(spectatorId: string, currentPlayerId: string, timeLeft: number, now: number): void {
        let buf = this.generateGameHeader(now, currentPlayerId, timeLeft);
        buf += this.generatePlayerTable(currentPlayerId);
        
        if (this.lastCatchMessage) {
            buf += `<br /><div style="color: ${this.lastWasCatch ? '#008000' : '#ff5555'}; margin: 5px 0;">${this.lastCatchMessage}</div>`;
        }

        buf += `<br /><small style="color: #666666">You are spectating this game</small>`;
        buf += `</div></div>`;

        const roomUser = Users.get(spectatorId);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtml|safari-spectator-${spectatorId}|${buf}`);
        }
    }

    private generateGameHeader(now: number, currentPlayerId: string, timeLeft: number): string {
        return `<div class="infobox"><div style="text-align:center">
            <h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>
            <small>Game Time: ${SafariUtils.formatUTCTime(now)} UTC</small><br />
            <small>Game Duration: ${Math.floor((now - this.gameStartTime) / 1000)}s</small><br />
            <b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />
            <b>Status:</b> ${this.status}<br />
            <b>Prize Pool:</b> ${this.prizePool} coins<br />
            <b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}
            <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;
    }

    private generatePlayerTable(currentPlayerId: string): string {
        let buf = `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">
            <tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
        
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
        return buf;
    }

    private generateMovementControls(userid: string): string {
        const state = this.movementStates[userid];
        let buf = '';

        if (!state || state.canMove) {
            buf += `<br /><div style="margin: 10px;">
                <button class="button" style="margin: 5px;" name="send" value="/safari move up">↑</button><br />
                <button class="button" style="margin: 5px;" name="send" value="/safari move left">←</button>
                <button class="button" style="margin: 5px;" name="send" value="/safari move right">→</button><br />
                <button class="button" style="margin: 5px;" name="send" value="/safari move down">↓</button>
                </div>
                <br /><b>Choose a direction to move!</b>`;
        } else if (state.pokemonDisplayed && state.currentPokemon) {
            buf += `<br /><div style="margin: 10px;">
                <img src="${state.currentPokemon.sprite}" width="80" height="80">
                <br /><b>A wild ${state.currentPokemon.name} appeared!</b>
                <br /><button class="button" style="font-size: 12pt; padding: 8px 16px; margin-top: 10px;" 
                name="send" value="/safari throw">Throw Safari Ball</button>
                </div>`;
        }

        return buf;
    }

    displayEndGame(inactive: boolean = false): void {
        if (inactive) {
            const inactiveMsg = `<div class="infobox">The Safari Zone game has been canceled due to inactivity.</div>`;
            this.room.add(`|uhtml|safari-end|${inactiveMsg}`).update();
            return;
        }

        const now = Date.now();
        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
        let endMsg = `<div class="infobox"><center><h2>Safari Zone Results</h2>
            <small>Game Ended: ${SafariUtils.formatUTCTime(now)} UTC</small><br />
            <small>Duration: ${Math.floor((now - this.gameStartTime) / 1000)} seconds</small><br /><br />`;

        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1];
            const top3Players = sortedPlayers.slice(0, 3);
            
            endMsg += `<table border="1" cellspacing="0" cellpadding="3">
                <tr><th>Place</th><th>Player</th><th>Points</th><th>Prize</th><th>Catches</th></tr>`;
            
            top3Players.forEach((player, index) => {
                const prize = Math.floor(this.prizePool * prizes[index]);
                endMsg += `<tr>
                    <td>${index + 1}${['st', 'nd', 'rd'][index]}</td>
                    <td>${Impulse.nameColor(player.name, true, true)}</td>
                    <td>${player.points}</td>
                    <td>${prize} coins</td>
                    <td>${player.catches.map(pk => 
                        `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`
                    ).join('')}</td>
                    </tr>`;
            });
            endMsg += `</table>`;
        } else {
            endMsg += `No winners in this game.`;
        }
        endMsg += `</center></div>`;

        this.room.add(`|uhtml|safari-end|${endMsg}`).update();
    }
}
