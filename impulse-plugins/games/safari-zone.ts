/*************************************
 * Pokemon Safari Zone Game          *
 * Created by: @musaddiktemkar      *
 * Current User: musaddiktemkar     *
 * Updated: 2025-04-13 12:55:15 UTC *
 **************************************/

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

    private static readonly INACTIVE_TIME = 2 * 60 * 1000;  // 2 minutes
    private static readonly TURN_TIME = 30 * 1000;         // 30 seconds
    private static readonly MIN_PLAYERS = 2;
    private static readonly MAX_PLAYERS = 10;
    private static readonly BALLS_PER_PLAYER = 5;         // Changed to 5 balls (1 per round)
    private static readonly MAX_ROUNDS = 5;                // 5 rounds total
    private static readonly DISPLAY_UPDATE_DELAY = 500;    // 500ms between display updates

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

        this.setInactivityTimer();
        this.display();
    }

    private formatUTCTime(timestamp: number): string {
        return new Date(timestamp)
            .toISOString()
            .replace('T', ' ')
            .substr(0, 19);
    }

    private initializeRound() {
        this.currentRound++;
        this.roundStartTime = Date.now();
        
        // Give each player one ball for the new round if they're still in the game
        for (const player of Object.values(this.players)) {
            if (player.roundPoints.length < this.currentRound) {
                player.roundPoints.push(0);
                player.roundCatches.push([]);
            }
            // Only give a ball if they used their previous ball
            if (player.ballsLeft === 0) {
                player.ballsLeft = 1;
            }
        }

        // Randomize turn order for new round
        this.turnOrder = Object.keys(this.players);
        for (let i = this.turnOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
        }
        
        // Initialize round stats
        this.roundStats.push({
            roundNumber: this.currentRound,
            startTime: this.roundStartTime,
            endTime: 0,
            catches: [],
            turnOrder: [...this.turnOrder]
        });

        // Announce new round
        const roundMsg = `<div class="broadcast-blue"><h2>Round ${this.currentRound} of ${SafariGame.MAX_ROUNDS}</h2>` +
            `<b>Turn Order:</b> ${this.turnOrder.map(id => this.players[id].name).join(' → ')}<br />` +
            `<small>Time: ${this.formatUTCTime(this.roundStartTime)} UTC</small><br />` +
            `<i>Each player has received 1 Safari Ball for this round!</i></div>`;
        this.room.add(`|html|${roundMsg}`);
        
        this.currentTurn = 0;
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
                `<b>Rounds:</b> ${SafariGame.MAX_ROUNDS} (1 ball per round)<br />` +
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

        const currentPlayerId = this.turnOrder[this.currentTurn];
        const now = Date.now();
        const timeLeft = Math.max(0, Math.ceil((SafariGame.TURN_TIME - (now - this.turnStartTime)) / 1000));

        // Send individual displays to each player
        for (const userid in this.players) {
            const player = this.players[userid];
            let buf = `<div class="infobox"><div style="text-align:center">`;
            buf += `<h2>Safari Zone Game${this.status === 'ended' ? ' (Ended)' : ''}</h2>`;
            
            buf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
            buf += `<small>Game Duration: ${Math.floor((now - this.gameStartTime) / 1000)}s</small><br />`;
            
            if (this.status === 'started') {
                buf += `<b>Round:</b> ${this.currentRound} of ${SafariGame.MAX_ROUNDS}<br />`;
                buf += `<b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)}`;
                buf += ` <b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">(${timeLeft}s left)</b><br />`;
            }

            // Player statistics table
            if (Object.keys(this.players).length) {
                buf += `<table border="1" cellspacing="0" cellpadding="3" style="margin:auto;margin-top:5px">`;
                buf += `<tr><th>Player</th><th>Points</th><th>Balls</th><th>Round ${this.currentRound} Catches</th></tr>`;
                const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
                
                for (const p of sortedPlayers) {
                    const isCurrentTurn = p.id === currentPlayerId;
                    const currentRoundCatches = p.roundCatches[this.currentRound - 1] || [];
                    
                    buf += `<tr${isCurrentTurn ? ' style="background-color: rgba(85, 85, 255, 0.1)"' : ''}>`;
                    buf += `<td>${Impulse.nameColor(p.name, true, true)}${p.id === userid ? ' (You)' : ''}${isCurrentTurn ? ' ⭐' : ''}</td>`;
                    buf += `<td>${p.points}</td>`;
                    buf += `<td>${p.ballsLeft}</td>`;
                    buf += `<td>${currentRoundCatches.map(pk => 
                        `<img src="${pk.sprite}" width="40" height="30" title="${pk.name}">`
                    ).join('')}</td>`;
                    buf += `</tr>`;
                }
                buf += `</table>`;
            }

            if (this.status === 'started') {
                if (this.lastCatchMessage) {
                    buf += `<br /><div style="color: #008000; margin: 5px 0;">${this.lastCatchMessage}</div>`;
                }
                
                if (userid === currentPlayerId) {
                    if (player.ballsLeft > 0) {
                        buf += `<br />`;
                        buf += `<button class="button" style="font-size: 12pt; padding: 8px 16px; ${timeLeft <= 10 ? 'background-color: #ff5555;' : ''}" `;
                        buf += `name="send" value="/safari throw">Throw Safari Ball</button>`;
                        buf += `<br /><b style="color: ${timeLeft <= 10 ? '#ff5555' : '#5555ff'}">`;
                        buf += `You have ${timeLeft} second${timeLeft !== 1 ? 's' : ''} to throw!</b>`;
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

            if (this.roundStats.length > 0) {
                buf += `<br /><button class="button" name="send" value="/safari rounds">View Round Summaries</button>`;
            }

            buf += `</div></div>`;
            
            // Send the player-specific display
            const roomUser = Users.get(userid);
            if (roomUser?.connected) {
                roomUser.sendTo(this.room, `|uhtml|safari-player-${userid}|${buf}`);
            }
        }

        // Show spectator display
        if (this.status !== 'ended') {
            let spectatorBuf = `<div class="infobox"><div style="text-align:center">`;
            spectatorBuf += `<h2>Safari Zone Game in Progress</h2>`;
            spectatorBuf += `<small>Game Time: ${this.formatUTCTime(now)} UTC</small><br />`;
            spectatorBuf += `<b>Round:</b> ${this.currentRound} of ${SafariGame.MAX_ROUNDS}<br />`;
            spectatorBuf += `<b>Current Turn:</b> ${Impulse.nameColor(this.players[currentPlayerId].name, true, true)} (${timeLeft}s left)<br />`;
            spectatorBuf += `<b>Players:</b> ${this.getPlayerList()}<br />`;
            spectatorBuf += `<i>Game in progress - Join the next round!</i>`;
            spectatorBuf += `</div></div>`;

            this.room.add(`|uhtml|safari-spectator|${spectatorBuf}`, -1000).update();
        }
    }

    // ... (rest of the methods remain the same, but with BALLS_PER_PLAYER = 5)
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

            // ... (other cases remain the same)
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
            '<code>/safari rounds</code>: View round summaries.<br />' +
            '<code>/safari dq [player]</code>: Disqualifies a player from the game (only usable by game creator).<br />' +
            '<code>/safari end</code>: Ends the current Safari game. Requires @.<br />' +
            '<hr />' +
            '<strong>Game Rules:</strong><br />' +
            `- Players must pay an entry fee to join<br />` +
            `- Minimum ${SafariGame.MIN_PLAYERS} players required to start<br />` +
            `- ${SafariGame.MAX_ROUNDS} rounds total (1 ball per round)<br />` +
            `- ${SafariGame.TURN_TIME / 1000} second time limit per turn<br />` +
            '- Game ends after all rounds or when no players have balls<br />' +
            '- Prizes: 1st (60%), 2nd (30%), 3rd (10%) of pool<br />' +
            '- Players can be disqualified by the game creator'
        );
    }
};