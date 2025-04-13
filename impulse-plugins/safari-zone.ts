/*************************************
 * Pokemon Safari Zone Game          *
 * Iitial Release                    *
 * author: @musaddiktemkar           *
 **************************************/

import { FS } from '../lib/fs';

interface SafariPlayer {
    userid: string;
    username: string;
    points: number;
    catches: Pokemon[];
    lastCatch: number; // Timestamp of last catch attempt
}

interface Pokemon {
    name: string;
    rarity: number;
    points: number;
    emoji: string; // Added emoji for visual representation
}

interface SafariGame {
    id: string;
    hostId: string;
    hostName: string;
    players: SafariPlayer[];
    status: 'waiting' | 'active' | 'ended';
    entryFee: number;
    startTime: number;
    endTime: number;
    duration: number;
    prizePool: number;
    room: string;
    winners: { userid: string; username: string; points: number; prize: number }[];
}

export class SafariZone {
    private static games: Map<string, SafariGame> = new Map();
    private static readonly GAME_DURATION = 10 * 60 * 1000; // 10 minutes
    private static readonly MIN_PLAYERS = 2;
    private static readonly MAX_PLAYERS = 10;
    private static readonly DEFAULT_ENTRY_FEE = 100;
    private static readonly CATCH_COOLDOWN = 10 * 1000; // 10 seconds between catches
    private static readonly PRIZE_DISTRIBUTION = [0.6, 0.3, 0.1]; // 60%, 30%, 10% for 1st, 2nd, 3rd

    private static readonly POKEMON_LIST: Pokemon[] = [
        { name: 'Pidgey', rarity: 0.3, points: 10, emoji: '🐦' },
        { name: 'Rattata', rarity: 0.3, points: 10, emoji: '🐀' },
        { name: 'Pikachu', rarity: 0.15, points: 30, emoji: '⚡' },
        { name: 'Chansey', rarity: 0.1, points: 50, emoji: '🥚' },
        { name: 'Tauros', rarity: 0.1, points: 50, emoji: '🐃' },
        { name: 'Dratini', rarity: 0.05, points: 100, emoji: '🐉' }
    ];

    static createGame(hostId: string, hostName: string, roomId: string, entryFee: number = SafariZone.DEFAULT_ENTRY_FEE): string {
        if (entryFee < 1) return null;
        
        // Check for existing active games in the room
        for (const [, game] of this.games) {
            if (game.room === roomId && game.status !== 'ended') {
                return null; // Only one active game per room
            }
        }

        const gameId = `safari-${Date.now()}`;
        const game: SafariGame = {
            id: gameId,
            hostId,
            hostName,
            players: [],
            status: 'waiting',
            entryFee,
            startTime: 0,
            endTime: 0,
            duration: SafariZone.GAME_DURATION,
            prizePool: 0,
            room: roomId,
            winners: []
        };

        this.games.set(gameId, game);
        return gameId;
    }

    static joinGame(gameId: string, userId: string, username: string): boolean {
        const game = this.games.get(gameId);
        if (!game || game.status !== 'waiting') return false;
        if (game.players.length >= SafariZone.MAX_PLAYERS) return false;
        if (game.players.some(p => p.userid === userId)) return false;
        
        // Check if player has enough money
        if (!Economy.hasMoney(userId, game.entryFee)) return false;

        // Take entry fee and add to prize pool
        Economy.takeMoney(userId, game.entryFee, 'Safari Zone entry fee');
        game.prizePool += game.entryFee;

        game.players.push({
            userid: userId,
            username,
            points: 0,
            catches: [],
            lastCatch: 0
        });

        this.updateGameDisplay(game);
        return true;
    }

    static startGame(gameId: string, userId: string): boolean {
        const game = this.games.get(gameId);
        if (!game || game.status !== 'waiting' || game.hostId !== userId) return false;
        if (game.players.length < SafariZone.MIN_PLAYERS) return false;

        game.status = 'active';
        game.startTime = Date.now();
        game.endTime = game.startTime + game.duration;
        this.updateGameDisplay(game);

        // Schedule game end
        setTimeout(() => this.endGame(gameId), game.duration);

        return true;
    }

    static throwBall(gameId: string, userId: string): { success: boolean; message: string; pokemon?: Pokemon } {
        const game = this.games.get(gameId);
        if (!game || game.status !== 'active') {
            return { success: false, message: 'Game is not active.' };
        }

        const player = game.players.find(p => p.userid === userId);
        if (!player) {
            return { success: false, message: 'You are not in this game.' };
        }

        // Check cooldown
        const now = Date.now();
        if (now - player.lastCatch < SafariZone.CATCH_COOLDOWN) {
            const remainingTime = Math.ceil((SafariZone.CATCH_COOLDOWN - (now - player.lastCatch)) / 1000);
            return { success: false, message: `Please wait ${remainingTime} seconds before throwing another ball.` };
        }

        player.lastCatch = now;

        // Random Pokemon encounter
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const pokemon of SafariZone.POKEMON_LIST) {
            cumulativeProbability += pokemon.rarity;
            if (random <= cumulativeProbability) {
                player.catches.push(pokemon);
                player.points += pokemon.points;
                this.updateGameDisplay(game);
                return { 
                    success: true, 
                    message: `Caught a ${pokemon.name} ${pokemon.emoji} worth ${pokemon.points} points!`,
                    pokemon 
                };
            }
        }

        return { success: false, message: 'The Pokémon got away!' };
    }

    private static endGame(gameId: string): void {
        const game = this.games.get(gameId);
        if (!game || game.status !== 'active') return;

        game.status = 'ended';
        game.endTime = Date.now();

        // Sort players by points
        const sortedPlayers = [...game.players].sort((a, b) => b.points - a.points);

        // Distribute prizes
        game.winners = sortedPlayers.slice(0, 3).map((player, index) => {
            const prizeShare = SafariZone.PRIZE_DISTRIBUTION[index];
            const prize = Math.floor(game.prizePool * prizeShare);
            if (prize > 0) {
                Economy.addMoney(player.userid, prize, `Safari Zone ${index + 1}st place`);
            }
            return {
                userid: player.userid,
                username: player.username,
                points: player.points,
                prize
            };
        });

        this.updateGameDisplay(game);

        // Clean up game data after 5 minutes
        setTimeout(() => this.games.delete(gameId), 5 * 60 * 1000);
    }

    private static updateGameDisplay(game: SafariGame): void {
        const room = Rooms.get(game.room);
        if (!room) return;

        const html = this.generateGameHTML(game);
        this.room.add(`|uhtmlchange|safari-${game.id}|${html}`).update();
    }

    private static generateGameHTML(game: SafariGame): string {
        const timeLeft = game.status === 'active' ? 
            Math.max(0, Math.floor((game.endTime - Date.now()) / 1000)) : 0;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Sort players by points
        const sortedPlayers = [...game.players].sort((a, b) => b.points - a.points);
        
        const playerList = sortedPlayers.map((p, index) => `<tr><td>${index + 1}</td><td>${Impulse.nameColor(p.username, true, true)}</td><td>${p.points}</td><td>${p.catches.map(c => c.emoji).join(' ')}</td></tr>`).join('');

        const joinButton = game.status === 'waiting' ? 
            `<button class="button" name="send" value="/safari join ${game.id}">Join Game (${game.entryFee} coins)</button>` : '';
        
        const startButton = game.status === 'waiting' && game.players.length >= SafariZone.MIN_PLAYERS ? 
            `<button class="button" name="send" value="/safari start ${game.id}">Start Game</button>` : '';
        
        const throwButton = game.status === 'active' ?
            `<button class="button" name="send" value="/safari throw ${game.id}">Throw Safari Ball</button>` : '';

        let html = `
        <div class="infobox">
            <center>
                <h2>Safari Zone Game ${game.status === 'ended' ? '(Ended)' : ''}</h2>
                <strong>Host:</strong> ${Impulse.nameColor(game.hostName, true, true)}<br />
                <strong>Status:</strong> ${game.status}<br />
                <strong>Entry Fee:</strong> ${game.entryFee} coins<br />
                <strong>Prize Pool:</strong> ${game.prizePool} coins<br />
                ${game.status === 'active' ? `<strong>Time Remaining:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}<br />` : ''}
                <br />
                ${joinButton} ${startButton} ${throwButton}
                <br /><br />
                <table border="1" cellspacing="0" cellpadding="3">
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Catches</th>
                    </tr>
                    ${playerList}
                </table>
            </center>
        `;

        if (game.status === 'ended' && game.winners.length > 0) {
            html += `<br /><center><h3>Winners</h3>${game.winners.map((w, i) => `${i + 1}. ${Impulse.nameColor(w.username, true, true)} - ${w.points} points<br />Prize: ${w.prize} coins`).join('<br />')}</center>`;
		  }
		 html += `</div>`;
		 return html;
	 }

    static getGameStatus(gameId: string): SafariGame | null {
        return this.games.get(gameId) || null;
    }
}

export const commands: ChatCommands = {
    safari(target, room, user) {
        if (!room) return this.errorReply("This command can only be used in a room.");

        if (!target) {
            return this.sendReply(`Safari Zone commands:
                /safari create [entry fee] - Creates a new Safari Zone game (requires @)
                /safari join [game id] - Join a Safari Zone game
                /safari start [game id] - Start a Safari Zone game (host only)
                /safari throw [game id] - Throw a Safari Ball
                /safari status [game id] - Check the status of a game`);
        }

        const [cmd, gameId, ...args] = target.split(' ');

        switch (cmd.toLowerCase()) {
            case 'create': {
                if (!this.can('mute', null, room)) return false;
                
                const entryFee = parseInt(args[0]) || SafariZone.DEFAULT_ENTRY_FEE;
                const newGameId = SafariZone.createGame(user.id, user.name, room.id, entryFee);
                
                if (!newGameId) {
                    return this.errorReply("Failed to create game. There might be an active game in this room.");
                }

                const game = SafariZone.getGameStatus(newGameId);
                room.add(`|uhtml|safari-${newGameId}|${SafariZone.generateGameHTML(game)}`).update();
                break;
            }
            
            case 'join': {
                if (!gameId) return this.errorReply("Please provide a game ID.");
                const joined = SafariZone.joinGame(gameId, user.id, user.name);
                if (!joined) {
                    this.errorReply("Failed to join game. Check if the game exists, is not full, and you have enough coins.");
                }
                break;
            }

            case 'start': {
                if (!gameId) return this.errorReply("Please provide a game ID.");
                const started = SafariZone.startGame(gameId, user.id);
                if (!started) {
                    this.errorReply("Failed to start game. Make sure you are the host and there are enough players.");
                }
                break;
            }

            case 'throw': {
                if (!gameId) return this.errorReply("Please provide a game ID.");
                const result = SafariZone.throwBall(gameId, user.id);
                this.sendReply(result.message);
                break;
            }

            case 'status': {
                if (!gameId) return this.errorReply("Please provide a game ID.");
                const game = SafariZone.getGameStatus(gameId);
                if (!game) {
                    return this.errorReply("Game not found.");
                }
                room.add(`|uhtml|safari-${gameId}|${SafariZone.generateGameHTML(game)}`).update();
                break;
            }

            default:
                this.errorReply("Unknown Safari Zone command. Use /safari for help.");
        }
    },

    safaristatus: 'safarihelp',
    safarihelp(target, room, user) {
        if (!this.runBroadcast()) return;
        this.sendReplyBox(`<strong>Safari Zone Commands:</strong><br />` +
            `/safari create [entry fee] - Creates a new Safari Zone game (requires @)<br />` +
            `/safari join [game id] - Join a Safari Zone game<br />` +
            `/safari start [game id] - Start a Safari Zone game (host only)<br />` +
            `/safari throw [game id] - Throw a Safari Ball<br />` +
            `/safari status [game id] - Check the status of a game<br />` +
            `<br />` +
            `<strong>Game Rules:</strong><br />` +
            `- Only @ or higher can create games<br />` +
            `- Entry fee is deducted when joining<br />` +
            `- Minimum ${SafariZone.MIN_PLAYERS} players required to start<br />` +
            `- Maximum ${SafariZone.MAX_PLAYERS} players per game<br />` +
            `- ${SafariZone.GAME_DURATION / 60000} minutes per game<br />` +
            `- ${SafariZone.CATCH_COOLDOWN / 1000} seconds cooldown between throws<br />` +
            `- Prizes: 1st (60%), 2nd (30%), 3rd (10%) of pool`);
    }
};
