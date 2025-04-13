/*************************************
 * Pokemon Safari Zone Game          *
 * Current User: musaddiktemkar     *
 * Current Time: 2025-04-13 13:15:58 UTC *
 * Version: 1.0.0                   *
 *************************************/

import { FS } from '../../lib/fs';

interface Player {
    name: string;
    id: string;
    points: number;
    catches: Pokemon[];
    ballsLeft: number;
    lastCatch: number;
    roundPoints: number[];  // Points per round
    roundCatches: Pokemon[][]; // Catches per round
}

interface Pokemon {
    name: string;
    rarity: number;
    points: number;
    sprite: string;
    catchTime?: number;
    caughtBy?: string;
    round?: number;
}

interface RoundStats {
    roundNumber: number;
    startTime: number;
    endTime: number;
    catches: Pokemon[];
    turnOrder: string[];
    roundSummary?: string;
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
    private currentTurn: number;
    private turnOrder: string[];
    private turnTimer: NodeJS.Timeout | null;
    private turnStartTime: number;
    private gameStartTime: number;
    private currentRound: number;
    private roundStartTime: number;
    private roundStats: RoundStats[];
    private displayUpdateTimeout: NodeJS.Timeout | null;
    private lastDisplayUpdate: number;
    private gameStartDate: string;
    private currentUser: string;
    private currentDateTime: string;

    // Game constants
    private static readonly INACTIVE_TIME = 2 * 60 * 1000;  // 2 minutes
    private static readonly TURN_TIME = 30 * 1000;         // 30 seconds
    private static readonly MIN_PLAYERS = 2;
    private static readonly MAX_PLAYERS = 10;
    private static readonly BALLS_PER_ROUND = 1;          // 1 ball per round
    private static readonly MAX_ROUNDS = 5;                // 5 rounds total
    private static readonly DISPLAY_UPDATE_DELAY = 500;    // 500ms between display updates
    private static readonly CURRENT_UTC_TIME = '2025-04-13 13:15:58';
    private static readonly CURRENT_USER = 'musaddiktemkar';

    // Pokemon pool with their catch rates and point values
    private readonly pokemonPool: Pokemon[] = [
        { name: 'Pidgey',  rarity: 0.3, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pidgey.gif' },
        { name: 'Rattata', rarity: 0.3, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/rattata.gif' },
        { name: 'Pikachu', rarity: 0.15, points: 30, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pikachu.gif' },
        { name: 'Chansey', rarity: 0.1, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/chansey.gif' },
        { name: 'Tauros',  rarity: 0.1, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/tauros.gif' },
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
        this.currentTurn = 0;
        this.turnOrder = [];
        this.turnTimer = null;
        this.turnStartTime = 0;
        this.gameStartTime = Date.now();
        this.currentRound = 0;
        this.roundStartTime = 0;
        this.roundStats = [];
        this.displayUpdateTimeout = null;
        this.lastDisplayUpdate = 0;
        this.gameStartDate = SafariGame.CURRENT_UTC_TIME;
        this.currentUser = SafariGame.CURRENT_USER;
        this.currentDateTime = SafariGame.CURRENT_UTC_TIME;

        this.setInactivityTimer();
        this.display();
    }

    private getCurrentUTCTime(): string {
        return SafariGame.CURRENT_UTC_TIME;
    }

    private formatUTCTime(timestamp: number): string {
        if (timestamp === this.gameStartTime) {
            return this.gameStartDate;
        }
        // Calculate offset from game start time
        const timeDiff = timestamp - this.gameStartTime;
        const date = new Date(this.gameStartDate.replace(' ', 'T') + 'Z');
        date.setMilliseconds(date.getMilliseconds() + timeDiff);
        return date.toISOString().replace('T', ' ').substr(0, 19);
    }

    private initializeRound() {
        this.currentRound++;
        this.roundStartTime = Date.now();
        
        // Give each player one ball for the new round
        for (const player of Object.values(this.players)) {
            if (player.roundPoints.length < this.currentRound) {
                player.roundPoints.push(0);
                player.roundCatches.push([]);
            }
            player.ballsLeft = SafariGame.BALLS_PER_ROUND;
        }

        // Randomize turn order
        this.turnOrder = Object.keys(this.players);
        for (let i = this.turnOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
        }
        
        this.roundStats.push({
            roundNumber: this.currentRound,
            startTime: this.roundStartTime,
            endTime: 0,
            catches: [],
            turnOrder: [...this.turnOrder]
        });

        // Round start announcement
        const roundMsg = `<div class="broadcast-blue">
            <h2>Round ${this.currentRound} of ${SafariGame.MAX_ROUNDS}</h2>
            <b>Turn Order:</b> ${this.turnOrder.map(id => this.players[id].name).join(' → ')}<br />
            <small>Time: ${this.getCurrentUTCTime()} UTC</small><br />
            <i>Each player has received 1 Safari Ball for this round!</i>
        </div>`;
        this.room.add(`|html|${roundMsg}`);
        
        this.currentTurn = 0;
        this.startTurnTimer();
    }

    private startTurnTimer() {
        if (this.turnTimer) clearTimeout(this.turnTimer);
        
        this.turnStartTime = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const player = this.players[currentPlayerId];

        // Notify current player
        const roomUser = Users.get(currentPlayerId);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|html|<div class="broadcast-blue">
                It's your turn! You have ${SafariGame.TURN_TIME / 1000} seconds to throw your Safari Ball.
            </div>`);
        }
        
        this.turnTimer = setTimeout(() => {
            if (player?.ballsLeft > 0) {
                player.ballsLeft--;
                this.lastCatchMessage = `${player.name} lost their Safari Ball due to not throwing within ${SafariGame.TURN_TIME / 1000} seconds!`;
            }
            this.nextTurn();
        }, SafariGame.TURN_TIME);

        this.queueDisplayUpdate();
    }

    private queueDisplayUpdate() {
        if (this.displayUpdateTimeout) {
            clearTimeout(this.displayUpdateTimeout);
        }

        const now = Date.now();
        if (!this.lastDisplayUpdate || now - this.lastDisplayUpdate >= SafariGame.DISPLAY_UPDATE_DELAY) {
            this.display();
            this.lastDisplayUpdate = now;
        } else {
            this.displayUpdateTimeout = setTimeout(() => {
                this.display();
                this.lastDisplayUpdate = Date.now();
            }, SafariGame.DISPLAY_UPDATE_DELAY - (now - this.lastDisplayUpdate));
        }
    }

    private display() {
        const now = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const timeLeft = Math.max(0, Math.ceil((SafariGame.TURN_TIME - (now - this.turnStartTime)) / 1000));

        if (this.status === 'waiting') {
            const startMsg = `<div class="infobox">
                <div style="text-align:center;margin:5px">
                    <h2 style="color:#24678d">Safari Zone Game</h2>
                    <small>Current Time: ${this.getCurrentUTCTime()} UTC</small><br />
                    <small>Current User: ${this.currentUser}</small><br />
                    <b>Started by:</b> ${Impulse.nameColor(this.host, true, true)}<br />
                    <b>Entry Fee:</b> ${this.entryFee} coins<br />
                    <b>Rounds:</b> ${SafariGame.MAX_ROUNDS} (1 ball per round)<br />
                    <b>Players:</b> ${this.getPlayerList()}<br /><br />
                    <img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" width="80" height="80" style="margin-right:30px">
                    <img src="https://play.pokemonshowdown.com/sprites/ani/tauros.gif" width="80" height="80" style="margin-left:30px"><br />
                    <button class="button" name="send" value="/safari join">Click to join!</button>
                </div>
            </div>`;
            
            this.room.add(`|uhtml|safari-waiting|${startMsg}`);
            return;
        }

        // Game in progress - Send individual displays to each player
        for (const userid in this.players) {
            const player = this.players[userid];
            let buf = this.getPlayerDisplay(userid, player, currentPlayerId, timeLeft);
            
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.room, `|uhtml|safari-player-${userid}|${buf}`);
            }
        }

        // Spectator display
        if (this.status !== 'ended') {
            let spectatorBuf = this.getSpectatorDisplay(currentPlayerId, timeLeft);
            this.room.add(`|uhtml|safari-spectator|${spectatorBuf}`);
        }
    }

    private getPlayerDisplay(userid: string, player: Player, currentPlayerId: string, timeLeft: number): string {
        let buf = `<div class="infobox"><div style="text-align:center">
            <h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>
            <small>Current Time: ${this.getCurrentUTCTime()} UTC</small><br />
            <small>Current User: ${this.currentUser}</small><br />`;

        if (this.status === 'started') {
            buf += `<b>Round:</b> ${this.currentRound} of ${SafariGame.MAX_ROUNDS}<br />
                   <b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}
                   <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;
        }

        buf += this.getPlayerStatsTable(userid, currentPlayerId);
        buf += this.getCurrentTurnInfo(userid, currentPlayerId, player, timeLeft);

        if (this.roundStats.length > 1) {
            buf += `<br /><button class="button" name="send" value="/safari rounds">View Previous Rounds</button>`;
        }

        buf += `</div></div>`;
        return buf;
    }

    private getPlayerStatsTable(userid: string, currentPlayerId: string): string {
        let buf = `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">
            <tr><th>Player</th><th>Total Points</th><th>Current Ball</th><th>Round ${this.currentRound} Catches</th></tr>`;
        
        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
        for (const p of sortedPlayers) {
            const isCurrentTurn = p.id === currentPlayerId;
            const currentRoundCatches = p.roundCatches[this.currentRound - 1] || [];
            
            buf += `<tr${isCurrentTurn ? ' style="background-color: rgba(85, 85, 255, 0.1)"' : ''}>`;
            buf += `<td>${Impulse.nameColor(p.name, true, true)}${p.id === userid ? ' (You)' : ''}${isCurrentTurn ? ' ⭐' : ''}</td>`;
            buf += `<td>${p.points}</td>`;
            buf += `<td>${p.ballsLeft > 0 ? '🟢' : '❌'}</td>`;
            buf += `<td>${currentRoundCatches.map(pk => 
                `<img src="${pk.sprite}" width="40" height="30" title="${pk.name} (${pk.points} pts)">`
            ).join('')}</td>`;
            buf += `</tr>`;
        }
        buf += `</table>`;
        return buf;
    }

    private getCurrentTurnInfo(userid: string, currentPlayerId: string, player: Player, timeLeft: number): string {
        let buf = '';
        if (this.status === 'started') {
            if (this.lastCatchMessage) {
                buf += `<br /><div style="color: #008000; margin: 5px 0;">${this.lastCatchMessage}</div>`;
            }
            
            if (userid === currentPlayerId) {
                if (player.ballsLeft > 0) {
                    buf += `<br />
                    <button class="button" style="font-size: 12pt; padding: 8px 16px; ${timeLeft <= 10 ? 'background-color: #ff5555;' : ''}"
                    name="send" value="/safari throw">Throw Safari Ball</button>
                    <br /><b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">
                    You have ${timeLeft} second${timeLeft !== 1 ? 's' : ''} to throw!</b>`;
                    if (timeLeft <= 10) {
                        buf += `<br /><small style="color: #ff5555">Warning: You'll lose your ball if you don't throw!</small>`;
                    }
                } else {
                    buf += `<br /><div style="color: #ff5555">You have no Safari Ball for this round!</div>`;
                }
            } else {
                const currentPlayer = this.players[currentPlayerId];
                buf += `<br /><div style="color: #666666">Waiting for ${currentPlayer.name}'s turn... (${timeLeft}s left)</div>`;
            }
        }
        return buf;
    }

    private getSpectatorDisplay(currentPlayerId: string, timeLeft: number): string {
        return `<div class="infobox"><div style="text-align:center">
            <h2>Safari Zone Game in Progress</h2>
            <small>Current Time: ${this.getCurrentUTCTime()} UTC</small><br />
            <small>Current User: ${this.currentUser}</small><br />
            <b>Round:</b> ${this.currentRound} of ${SafariGame.MAX_ROUNDS}<br />
            <b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)} (${timeLeft}s left)<br />
            <b>Players:</b> ${Object.values(this.players).map(p => Impulse.nameColor(p.name, true, true)).join(', ')}<br />
            <i>Game in progress - Join the next game!</i>
        </div></div>`;
    }

    private nextTurn() {
        if (this.turnTimer) clearTimeout(this.turnTimer);
        
        this.currentTurn = (this.currentTurn + 1) % this.turnOrder.length;
        
        if (this.currentTurn === 0) {
            const currentRoundStats = this.roundStats[this.currentRound - 1];
            if (currentRoundStats) {
                currentRoundStats.endTime = Date.now();
                currentRoundStats.roundSummary = this.generateRoundSummary(currentRoundStats);
                this.room.add(`|html|${currentRoundStats.roundSummary}`);
            }
            
            const shouldEndGame = this.currentRound >= SafariGame.MAX_ROUNDS || 
                !Object.values(this.players).some(p => p.ballsLeft > 0);
            
            if (shouldEndGame) {
                this.end(false);
                return;
            }
            
            this.initializeRound();
            return;
        }

        // Skip players with no balls
        while (this.players[this.turnOrder[this.currentTurn]]?.ballsLeft === 0) {
            this.currentTurn = (this.currentTurn + 1) % this.turnOrder.length;
            if (this.currentTurn === 0) {
                // Handle round end
                const currentRoundStats = this.roundStats[this.currentRound - 1];
                if (currentRoundStats) {
                    currentRoundStats.endTime = Date.now();
                    currentRoundStats.roundSummary = this.generateRoundSummary(currentRoundStats);
                    this.room.add(`|html|${currentRoundStats.roundSummary}`);
                }
                
                const shouldEndGame = this.currentRound >= SafariGame.MAX_ROUNDS || 
                    !Object.values(this.players).some(p => p.ballsLeft > 0);
                
                if (shouldEndGame) {
                    this.end(false);
                    return;
                }
                
                this.initializeRound();
                return;
            }
        }

        this.queueDisplayUpdate();
        this.startTurnTimer();
    }

    private generateRoundSummary(stats: RoundStats): string {
        const duration = Math.floor((stats.endTime - stats.startTime) / 1000);
        let buf = `<div class="infobox"><center>
            <h2>Round ${stats.roundNumber} Summary</h2>
            <small>Time: ${this.formatUTCTime(stats.endTime)}</small><br />
            <small>Duration: ${duration} seconds</small><br /><br />`;
        
        const playerCatches = new Map<string, Pokemon[]>();
        stats.catches.forEach(pokemon => {
            if (pokemon.caughtBy) {
                if (!playerCatches.has(pokemon.caughtBy)) {
                    playerCatches.set(pokemon.caughtBy, []);
                }
                playerCatches.get(pokemon.caughtBy)!.push(pokemon);
            }
        });

        buf += `<table border="1" cellspacing="0" cellpadding="3">
            <tr><th>Player</th><th>Catches</th><th>Round Points</th></tr>`;
        
        for (const [playerId, catches] of playerCatches) {
            const player = this.players[playerId];
            if (!player) continue;
            
            const roundPoints = catches.reduce((sum, p) => sum + p.points, 0);
            buf += `<tr>
                <td>${Impulse.nameColor(player.name, true, true)}</td>
                <td>${catches.map(p => 
                    `<img src="${p.sprite}" width="40" height="30" title="${p.name} (${p.points} pts)">`
                ).join('')}</td>
                <td>${roundPoints}</td>
            </tr>`;
        }
        
        buf += `</table></center></div>`;
        return buf;
    }

    throwBall(user: User): string | null {
        if (this.status !== 'started') return "The game hasn't started yet!";
        if (!this.players[user.id]) return "You're not in this game!";
        if (user.id !== this.turnOrder[this.currentTurn]) return "It's not your turn!";
        
        const player = this.players[user.id];
        if (player.ballsLeft <= 0) return "You have no Safari Ball for this round!";

        player.lastCatch = Date.now();
        player.ballsLeft--;

        const random = Math.random();
        let cumulativeProbability = 0;

        for (const pokemon of this.pokemonPool) {
            cumulativeProbability += pokemon.rarity;
            if (random <= cumulativeProbability) {
                const caught = { 
                    ...pokemon, 
                    catchTime: Date.now(),
                    caughtBy: user.id,
                    round: this.currentRound
                };
                
                player.catches.push(caught);
                player.points += pokemon.points;
                
                if (!player.roundCatches[this.currentRound - 1]) {
                    player.roundCatches[this.currentRound - 1] = [];
                }
                player.roundCatches[this.currentRound - 1].push(caught);
                player.roundPoints[this.currentRound - 1] = (player.roundPoints[this.currentRound - 1] || 0) + pokemon.points;
                
                const currentRoundStats = this.roundStats[this.currentRound - 1];
                if (currentRoundStats) {
                    currentRoundStats.catches.push(caught);
                }
                
                this.lastCatchMessage = `${player.name} caught a ${pokemon.name} worth ${pokemon.points} points!`;
                this.nextTurn();
                return null;
            }
        }

        this.lastCatchMessage = `${player.name}'s Safari Ball missed!`;
        this.nextTurn();
        return null;
    }

    viewRoundSummaries(user: User): void {
        if (!this.roundStats.length) {
            user.sendTo(this.room, '|html|<div class="message-error">No round summaries available yet.</div>');
            return;
        }

        let buf = `<div class="infobox">
            <center><h2>Safari Zone Round Summaries</h2>
            <small>Current Time: ${this.getCurrentUTCTime()} UTC</small><br />
            <small>Game Started: ${this.gameStartDate}</small></center><br />`;

        for (const stats of this.roundStats) {
            if (stats.roundSummary) {
                buf += stats.roundSummary;
                if (stats !== this.roundStats[this.roundStats.length - 1]) {
                    buf += `<hr />`;
                }
            }
        }
        buf += `</div>`;

        user.sendTo(this.room, `|html|${buf}`);
    }

    end(inactive: boolean = false) {
        if (this.status === 'ended') return;

        this.clearTimer();
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
        this.status = 'ended';

        const now = Date.now();

        if (inactive && Object.keys(this.players).length < SafariGame.MIN_PLAYERS) {
            for (const id in this.players) {
                Economy.addMoney(id, this.entryFee, "Safari Zone refund - game canceled");
            }
            this.room.add(`|uhtmlchange|safari-spectator|<div class="infobox">
                <div style="text-align:center">
                    <h2>Safari Zone Game Canceled</h2>
                    <small>Time: ${this.getCurrentUTCTime()} UTC</small><br />
                    <small>Current User: ${this.currentUser}</small><br />
                    The game has been canceled due to inactivity. Entry fees have been refunded.
                </div>
            </div>`).update();
            delete this.room.safari;
            return;
        }

        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);

        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1]; // 60%, 30%, 10% of prize pool
            
            let buf = `<div class="infobox"><center>
                <h2>Safari Zone Results</h2>
                <small>Game Ended: ${this.getCurrentUTCTime()} UTC</small><br />
                <small>Current User: ${this.currentUser}</small><br />
                <small>Duration: ${Math.floor((now - this.gameStartTime) / 1000)} seconds</small><br /><br />
                
                <table border="1" cellspacing="0" cellpadding="3">
                <tr><th>Place</th><th>Player</th><th>Points</th><th>Prize</th><th>Total Catches</th></tr>`;
            
            sortedPlayers.forEach((player, index) => {
                const prize = index < 3 ? Math.floor(this.prizePool * prizes[index]) : 0;
                if (prize > 0) {
                    Economy.addMoney(player.id, prize, `Safari Zone ${index + 1}${['st', 'nd', 'rd'][index]} place`);
                }
                
                buf += `<tr>
                    <td>${index + 1}</td>
                    <td>${Impulse.nameColor(player.name, true, true)}</td>
                    <td>${player.points}</td>
                    <td>${prize > 0 ? `${prize} coins` : '-'}</td>
                    <td>${player.catches.map(p => 
                        `<img src="${p.sprite}" width="40" height="30" title="${p.name} (${p.points} pts)">`
                    ).join('')}</td>
                </tr>`;
            });
            
            buf += `</table></center></div>`;

            this.room.add(`|uhtmlchange|safari-spectator|${buf}`).update();

            // Clear player displays
            for (const userid in this.players) {
                const roomUser = Users.get(userid);
                if (roomUser?.connected) {
                    roomUser.sendTo(this.room, `|uhtmlchange|safari-player-${userid}|${buf}`);
                }
            }
        } else {
            const endMsg = `<div class="infobox">
                <div style="text-align:center">
                    <h2>Safari Zone Game Ended</h2>
                    <small>Time: ${this.getCurrentUTCTime()} UTC</small><br />
                    <small>Current User: ${this.currentUser}</small><br />
                    The game has ended with no winners.
                </div>
            </div>`;
            this.room.add(`|uhtmlchange|safari-spectator|${endMsg}`).update();
        }

        delete this.room.safari;
    }

    addPlayer(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (this.players[user.id]) return "You have already joined the game!";
        if (Object.keys(this.players).length >= SafariGame.MAX_PLAYERS) return "The game is full!";
        if (!Economy.hasMoney(user.id, this.entryFee)) return "You don't have enough coins to join!";

        Economy.takeMoney(user.id, this.entryFee, "Safari Zone entry fee");
        this.prizePool += this.entryFee;

        this.players[user.id] = {
            name: user.name,
            id: user.id,
            points: 0,
            catches: [],
            ballsLeft: SafariGame.BALLS_PER_ROUND,
            lastCatch: 0,
            roundPoints: [],
            roundCatches: []
        };

        this.display();
        
        if (Object.keys(this.players).length === SafariGame.MAX_PLAYERS) {
            this.start(user);
        }

        return null;
    }

    start(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (Object.keys(this.players).length < SafariGame.MIN_PLAYERS) 
            return `At least ${SafariGame.MIN_PLAYERS} players are needed to start!`;
        if (!this.players[user.id] && user.id !== this.host) 
            return "Only the host or a player can start the game!";

        this.status = 'started';
        this.clearTimer();
        this.initializeRound();
        return null;
    }

    private setInactivityTimer() {
        if (this.timer) clearTimeout(this.timer);
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

    private getPlayerList(): string {
        return Object.values(this.players)
            .map(p => Impulse.nameColor(p.name, true, true))
            .join(', ') || 'None';
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
                const entryFee = parseInt(args[0