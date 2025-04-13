/*************************************
 * Pokemon Safari Zone Game          *
 * Author: @musaddiktemkar          *
 * Last Updated: 2025-04-13 11:42:43 *
 *************************************/

import { Utils } from '../../lib';
import type { Room, User } from '../../server/rooms';

// Type definitions
type PokemonRarity = 'Common' | 'Uncommon' | 'Rare' | 'VeryRare';
type GameState = 'signups' | 'started' | 'ended';

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
    rarity: PokemonRarity;
    points: number;
    sprite: string;
    catchRate: number;
}

// Game Configuration
const GAME_CONFIG = {
    MAX_TIME: 60, // seconds
    INACTIVE_TIME: 2 * 60 * 1000, // 2 minutes
    CATCH_COOLDOWN: 2 * 1000, // 2 seconds
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 10,
    BALLS_PER_PLAYER: 20,
    PRIZE_DISTRIBUTION: {
        FIRST: 0.6,  // 60% of prize pool
        SECOND: 0.3, // 30% of prize pool
        THIRD: 0.1   // 10% of prize pool
    }
} as const;

// Styling Constants
const rarityColors = {
    Common: "rgba(150, 150, 150, 1)",
    Uncommon: "rgba(0, 150, 0, 1)",
    Rare: "rgba(0, 100, 255, 1)",
    VeryRare: "rgba(255, 100, 0, 1)"
};

const textColors = {
    Common: "#666666",
    Uncommon: "#008000",
    Rare: "#0000FF",
    VeryRare: "#FF4500"
};

export class SafariGame extends Rooms.RoomGame<SafariPlayer> {
    override readonly gameid = 'safari' as ID;
    override title = 'Safari Zone';
    override readonly allowRenames = true;
    override timer: NodeJS.Timeout | null = null;
    
    private entryFee: number;
    private prizePool: number;
    private host: string;
    private gameNumber: number;
    private state: GameState;
    private suppressMessages: boolean;
    private lastCatchMessage: string | null;
    private spectators: { [k: string]: number };

    public readonly pokemonPool: Pokemon[] = [
        { name: 'Pidgey', rarity: 'Common', catchRate: 0.7, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pidgey.gif' },
        { name: 'Rattata', rarity: 'Common', catchRate: 0.7, points: 10, sprite: 'https://play.pokemonshowdown.com/sprites/ani/rattata.gif' },
        { name: 'Pikachu', rarity: 'Uncommon', catchRate: 0.4, points: 30, sprite: 'https://play.pokemonshowdown.com/sprites/ani/pikachu.gif' },
        { name: 'Chansey', rarity: 'Rare', catchRate: 0.2, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/chansey.gif' },
        { name: 'Tauros', rarity: 'Rare', catchRate: 0.2, points: 50, sprite: 'https://play.pokemonshowdown.com/sprites/ani/tauros.gif' },
        { name: 'Dratini', rarity: 'VeryRare', catchRate: 0.1, points: 100, sprite: 'https://play.pokemonshowdown.com/sprites/ani/dratini.gif' }
    ];

    constructor(room: Room, entryFee: number, host: string, suppressMessages: boolean = false) {
        super(room);
        this.gameNumber = room.nextGameNumber();
        this.entryFee = entryFee;
        this.host = host;
        this.suppressMessages = suppressMessages;
        this.state = 'signups';
        this.prizePool = 0;
        this.lastCatchMessage = null;
        this.spectators = Object.create(null);

        this.setInactivityTimer();
        this.display();
    }

    private setInactivityTimer() {
        this.timer = setTimeout(() => {
            if (this.state === 'signups') {
                this.end(true);
            }
        }, GAME_CONFIG.INACTIVE_TIME);
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private getPlayerList(showDetails: boolean = false): string {
        const players = Object.values(this.players);
        if (players.length === 0) return 'None';
        
        if (!showDetails) {
            return players.map(p => Impulse.nameColor(p.name, true, true)).join(', ');
        }

        let buf = `<ol style="padding-left:0;">`;
        for (const player of players) {
            buf += `<li>${Impulse.nameColor(player.name, true, true)} `;
            buf += `(${player.points} points, ${player.ballsLeft} balls left)</li>`;
        }
        buf += `</ol>`;
        return buf;
    }

    private display() {
        if (this.state === 'signups') {
            const startMsg = 
                `<div class="infobox">` +
                `<div style="text-align:center;margin:5px">` +
                `<h2 style="color:#24678d">Safari Zone Game</h2>` +
                `<b>Started by:</b> ${Impulse.nameColor(this.host, true, true)}<br />` +
                `<b>Entry Fee:</b> ${this.entryFee} coins<br />` +
                `<b>Safari Balls:</b> ${GAME_CONFIG.BALLS_PER_PLAYER} per player<br />` +
                `<b>Players:</b> ${this.getPlayerList()}<br /><br />` +
                `<button class="button" name="send" value="/safari join">Join Game!</button>` +
                `</div></div>`;
            
            this.room.add(`|uhtml|safari-${this.gameNumber}|${startMsg}`).update();
            return;
        }

        // Show game state to all players and spectators
        let display = `<div class="infobox">`;
        display += `<h2>Safari Zone Game${this.state === 'ended' ? ' (Ended)' : ''}</h2>`;
        display += `<b>Host:</b> ${Impulse.nameColor(this.host, true, true)}<br />`;
        display += `<b>Prize Pool:</b> ${this.prizePool} coins<br />`;
        display += `<b>Players:</b><br />${this.getPlayerList(true)}<br />`;
        
        if (this.lastCatchMessage) {
            display += `<div style="color: #008000; margin: 5px 0;">${this.lastCatchMessage}</div>`;
        }
        
        display += `</div>`;

        if (!this.suppressMessages) {
            this.room.add(`|uhtml|safari-${this.gameNumber}|${display}`).update();
        } else {
            // Send to players and spectators
            for (const player of Object.values(this.players)) {
                player.sendDisplay();
            }
            for (const spectatorId in this.spectators) {
                const spectator = Users.get(spectatorId);
                if (spectator?.connected) {
                    spectator.sendTo(this.room, `|uhtml|safari-${this.gameNumber}|${display}`);
                }
            }
        }
    }

    override onConnect(user: User, connection: Connection) {
        if (this.state === 'signups') {
            connection.sendTo(
                this.room,
                `|uhtml|safari-${this.gameNumber}|<div class="broadcast-blue">` +
                `<p style="font-size: 14pt; text-align: center">A new Safari Zone game is starting!</p>` +
                `<p style="font-size: 9pt; text-align: center">` +
                `<button class="button" name="send" value="/safari join">Join Game</button> ` +
                `<button class="button" name="send" value="/safari spectate">Watch</button></p>` +
                `${this.suppressMessages ? `<p style="font-size: 6pt; text-align: center">Game messages won't show up unless you're playing or watching.</p>` : ''}</div>`
            );
        } else {
            const player = this.playerTable[user.id];
            if (player) {
                player.sendDisplay();
            } else {
                connection.sendTo(
                    this.room,
                    `|uhtml|safari-${this.gameNumber}|<div class="infobox">` +
                    `<p>A Safari Zone game is in progress. ` +
                    `<button class="button" name="send" value="/safari spectate">Spectate Game</button></p>` +
                    `${this.suppressMessages ? `<p style="font-size: 6pt">Game messages won't show up unless you're playing or watching.</p>` : ''}</div>`
                );
            }
        }
    }

    makePlayer(user: User): SafariPlayer {
        return new SafariPlayer(user, this);
    }

    override joinGame(user: User): string | null {
        if (this.state !== 'signups') return "The game has already started!";
        if (user.id in this.playerTable) return "You have already joined the game!";
        if (!Economy.hasMoney(user.id, this.entryFee)) return "You don't have enough coins to join!";

        Economy.takeMoney(user.id, this.entryFee, "Safari Zone entry fee");
        this.prizePool += this.entryFee;

        if (this.addPlayer(user)) {
            this.sendToRoom(`${user.name} has joined the Safari Zone game.`);
            this.display();
            
            if (Object.keys(this.players).length === GAME_CONFIG.MAX_PLAYERS) {
                this.start();
            }
            return null;
        }
        return "Unable to join the game.";
    }

    start(): string | null {
        if (this.state !== 'signups') return "The game has already started!";
        if (Object.keys(this.players).length < GAME_CONFIG.MIN_PLAYERS) {
            return "Not enough players to start!";
        }

        this.state = 'started';
        this.clearTimer();
        
        for (const player of Object.values(this.players)) {
            player.ballsLeft = GAME_CONFIG.BALLS_PER_PLAYER;
        }

        this.sendToRoom("The Safari Zone game has started! Use /safari throw to catch Pokemon!");
        this.display();
        return null;
    }

    throwBall(player: SafariPlayer): string | null {
        if (this.state !== 'started') return "The game hasn't started yet!";
        if (player.ballsLeft <= 0) return "You have no Safari Balls left!";

        const now = Date.now();
        if (now - player.lastCatch < GAME_CONFIG.CATCH_COOLDOWN) {
            const remaining = Math.ceil((GAME_CONFIG.CATCH_COOLDOWN - (now - player.lastCatch)) / 1000);
            return `Please wait ${remaining} seconds before throwing again!`;
        }

        player.lastCatch = now;
        player.ballsLeft--;

        // Random Pokemon selection and catch attempt
        const pokemon = this.selectRandomPokemon();
        const caught = Math.random() <= pokemon.catchRate;
        
        if (caught) {
            player.catches.push(pokemon);
            player.points += pokemon.points;
            this.lastCatchMessage = `${player.name} caught a ${pokemon.name} worth ${pokemon.points} points!`;
        } else {
            this.lastCatchMessage = `${player.name} failed to catch the ${pokemon.name}!`;
        }

        this.display();
        
        if (player.ballsLeft === 0) {
            this.checkGameEnd();
        }

        return null;
    }

    private selectRandomPokemon(): Pokemon {
        const random = Math.random();
        let cumulativeProbability = 0;

        for (const pokemon of this.pokemonPool) {
            const probability = pokemon.rarity === 'Common' ? 0.4 :
                              pokemon.rarity === 'Uncommon' ? 0.3 :
                              pokemon.rarity === 'Rare' ? 0.2 :
                              0.1;
                              
            cumulativeProbability += probability;
            if (random <= cumulativeProbability) return pokemon;
        }

        return this.pokemonPool[0];
    }

    private checkGameEnd() {
        if (Object.values(this.players).every(p => p.ballsLeft === 0)) {
            this.end(false);
        }
    }

    end(inactive: boolean = false) {
        if (this.state === 'ended') return;

        this.clearTimer();
        this.state = 'ended';

        if (inactive && Object.keys(this.players).length < GAME_CONFIG.MIN_PLAYERS) {
            for (const player of Object.values(this.players)) {
                Economy.addMoney(player.id, this.entryFee, "Safari Zone refund - game canceled");
            }
            this.room.add(`The Safari Zone game was canceled due to insufficient players. Entry fees have been refunded.`).update();
        } else {
            const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
            const prizes = [
                Math.floor(this.prizePool * GAME_CONFIG.PRIZE_DISTRIBUTION.FIRST),
                Math.floor(this.prizePool * GAME_CONFIG.PRIZE_DISTRIBUTION.SECOND),
                Math.floor(this.prizePool * GAME_CONFIG.PRIZE_DISTRIBUTION.THIRD)
            ];

            let resultsDisplay = `<div class="broadcast-blue"><h2>Safari Zone Results</h2>`;
            for (let i = 0; i < Math.min(3, sortedPlayers.length); i++) {
                const player = sortedPlayers[i];
                if (prizes[i] > 0) {
                    Economy.addMoney(player.id, prizes[i], `Safari Zone ${i + 1}${['st', 'nd', 'rd'][i]} place`);
                    resultsDisplay += `${i + 1}. ${Impulse.nameColor(player.name, true, true)} - ${player.points} points (Won ${prizes[i]} coins)<br>`;
                }
            }
            resultsDisplay += `</div>`;
            
            this.room.add(`|uhtml|safari-${this.gameNumber}|${resultsDisplay}`).update();
        }

        this.room.game = null;
    }

    override leaveGame(user: User) {
        const player = this.playerTable[user.id];
        if (!player) return false;

        this.removePlayer(player);
        this.sendToRoom(`${user.name} has left the Safari Zone game.`);
        
        if (this.state === 'started') {
            this.checkGameEnd();
        } else if (this.state === 'signups') {
            const refund = Math.floor(this.entryFee / 2);
            Economy.addMoney(user.id, refund, "Safari Zone partial refund - left during signups");
            this.prizePool -= refund;
        }

        return true;
    }

    sendToRoom(message: string, overrideSuppress: boolean = false) {
        if (!this.suppressMessages || overrideSuppress) {
            this.room.add(message).update();
        } else {
            for (const player of Object.values(this.players)) {
                player.sendRoom(message);
            }
            for (const spectatorId in this.spectators) {
                const spectator = Users.get(spectatorId);
                if (spectator?.connected) {
                    spectator.sendTo(this.room, message);
                }
            }
        }
    }
}

class SafariPlayer extends Rooms.RoomGamePlayer<SafariGame> {
    points: number;
    catches: Pokemon[];
    ballsLeft: number;
    lastCatch: number;

    constructor(user: User, game: SafariGame) {
        super(user, game);
        this.points = 0;
        this.catches = [];
        this.ballsLeft = GAME_CONFIG.BALLS_PER_PLAYER;
        this.lastCatch = 0;
    }

    sendDisplay() {
        const catches = this.catches.map(pokemon => 
            `<img src="${pokemon.sprite}" width="40" height="30" title="${pokemon.name} (${pokemon.points} points)">`
        ).join('');
        
        const display = 
            `<div class="infobox">` +
            `<h3>Your Safari Status</h3>` +
            `<b>Points:</b> ${this.points}<br />` +
            `<b>Balls Left:</b> ${this.ballsLeft}<br />` +
            `<b>Catches:</b><br />` +
            `<div style="margin: 5px">${catches}</div>` +
            `${this.ballsLeft > 0 ? '<button class="button" name="send" value="/safari throw">Throw Safari Ball!</button>' : ''}` +
            `</div>`;

        this.sendRoom(`|uhtml|safari-${this.game.gameNumber}-${this.id}|${display}`);
    }
}

export const pages: Chat.PageTable = {
    safari(args, user, connection) {
        const pageid = `safari-${args[0]}`;
        const room = this.requireRoom();
        const game = this.requireGame(SafariGame);

        let buf = `<div class="pad">`;
        
        switch (args[0]) {
            case 'rules':
                buf += `<h2>Safari Zone Rules</h2>`;
                buf += `<p><strong>Game Basics:</strong></p>`;
                buf += `<ul>`;
                buf += `<li>Each player starts with ${GAME_CONFIG.BALLS_PER_PLAYER} Safari Balls</li>`;
                buf += `<li>Use /safari throw to attempt catching Pokemon</li>`;
                buf += `<li>Different Pokemon have different catch rates and point values</li>`;
                buf += `<li>The game ends when all players use their balls</li>`;
                buf += `<li>Prizes are distributed to top 3 players:</li>`;
                buf += `<ul>`;
                buf += `<li>1st place: ${GAME_CONFIG.PRIZE_DISTRIBUTION.FIRST * 100}% of prize pool</li>`;
                buf += `<li>2nd place: ${GAME_CONFIG.PRIZE_DISTRIBUTION.SECOND * 100}% of prize pool</li>`;
                buf += `<li>3rd place: ${GAME_CONFIG.PRIZE_DISTRIBUTION.THIRD * 100}% of prize pool</li>`;
                buf += `</ul>`;
                buf += `</ul>`;
                break;

            case 'pokemon':
                buf += `<h2>Available Pokemon</h2>`;
                buf += `<table border="1" cellspacing="0" cellpadding="3">`;
                buf += `<tr><th>Pokemon</th><th>Rarity</th><th>Points</th><th>Catch Rate</th></tr>`;
                for (const pokemon of game.pokemonPool) {
                    buf += `<tr>`;
                    buf += `<td><img src="${pokemon.sprite}" width="40" height="30"> ${pokemon.name}</td>`;
                    buf += `<td style="color: ${textColors[pokemon.rarity]}">${pokemon.rarity}</td>`;
                    buf += `<td>${pokemon.points}</td>`;
                    buf += `<td>${Math.floor(pokemon.catchRate * 100)}%</td>`;
                    buf += `</tr>`;
                }
                buf += `</table>`;
                break;

            case 'scores':
                buf += `<h2>Current Scores</h2>`;
                const players = Object.values(game.players).sort((a, b) => b.points - a.points);
                buf += `<table border="1" cellspacing="0" cellpadding="3">`;
                buf += `<tr><th>Player</th><th>Points</th><th>Balls Left</th><th>Catches</th></tr>`;
                for (const player of players) {
                    buf += `<tr>`;
                    buf += `<td>${Impulse.nameColor(player.name, true, true)}</td>`;
                    buf += `<td>${player.points}</td>`;
                    buf += `<td>${player.ballsLeft}</td>`;
                    buf += `<td>${player.catches.map(p => 
                        `<img src="${p.sprite}" width="40" height="30" title="${p.name} (${p.points} points)">`
                    ).join('')}</td>`;
                    buf += `</tr>`;
                }
                buf += `</table>`;
                break;

            default:
                buf += `<h2>Safari Zone Menu</h2>`;
                buf += `<p>Welcome to the Safari Zone! Select an option:</p>`;
                buf += `<p>`;
                buf += `<button class="button" name="send" value="/safari rules">Rules</button> `;
                buf += `<button class="button" name="send" value="/safari pokemon">Pokemon List</button> `;
                buf += `<button class="button" name="send" value="/safari scores">Current Scores</button>`;
                buf += `</p>`;
                break;
        }

        buf += `</div>`;
        return user.sendTo(room, `|popup||wide||html|${buf}`);
    },
};

export const commands: Chat.ChatCommands = {
    safari: {
        // Room owner commands
        off: 'disable',
        disable(target, room, user) {
            room = this.requireRoom();
            this.checkCan('gamemanagement', null, room);
            if (room.settings.safariDisabled) {
                throw new Chat.ErrorMessage("Safari Zone is already disabled in this room.");
            }
            room.settings.safariDisabled = true;
            room.saveSettings();
            return this.sendReply("Safari Zone has been disabled for this room.");
        },

        on: 'enable',
        enable(target, room, user) {
            room = this.requireRoom();
            this.checkCan('gamemanagement', null, room);
            if (!room.settings.safariDisabled) {
                throw new Chat.ErrorMessage("Safari Zone is already enabled in this room.");
            }
            delete room.settings.safariDisabled;
            room.saveSettings();
            return this.sendReply("Safari Zone has been enabled for this room.");
        },

        // Game creation and management
        new: 'create',
        create(target, room, user) {
            room = this.requireRoom();
            this.checkCan('minigame', null, room);
            if (room.settings.safariDisabled) throw new Chat.ErrorMessage("Safari Zone is currently disabled for this room.");
            if (room.game) throw new Chat.ErrorMessage("There is already a game in progress in this room.");

            const entryFee = parseInt(target);
            if (isNaN(entryFee) || entryFee < 1) {
                throw new Chat.ErrorMessage("Please enter a valid entry fee.");
            }

            room.game = new SafariGame(room, entryFee, user.name);
            this.privateModAction(`A Safari Zone game was created by ${user.name}.`);
            this.modlog('SAFARI CREATE');
        },

        start(target, room, user) {
            room = this.requireRoom();
            this.checkCan('minigame', null, room);
            const game = this.requireGame(SafariGame);
            const error = game.start();
            if (error) throw new Chat.ErrorMessage(error);
            this.privateModAction(`The Safari Zone game was started by ${user.name}.`);
            this.modlog('SAFARI START');
        },

        end(target, room, user) {
            room = this.requireRoom();
            this.checkCan('minigame', null, room);
            const game = this.requireGame(SafariGame);
            game.end(false);
            this.privateModAction(`The Safari Zone game was ended by ${user.name}.`);
            this.modlog('SAFARI END');
        },

        // Player commands
        join(target, room, user) {
            const game = this.requireGame(SafariGame);
            this.checkChat();
            const error = game.joinGame(user);
            if (error) throw new Chat.ErrorMessage(error);
            return this.sendReply("You have joined the Safari Zone game.");
        },

        leave(target, room, user) {
            const game = this.requireGame(SafariGame);
            if (!game.leaveGame(user)) {
                throw new Chat.ErrorMessage("You're not in the Safari Zone game!");
            }
            return this.sendReply("You have left the Safari Zone game.");
        },

        throw(target, room, user) {
            const game = this.requireGame(SafariGame);
            const player = game.playerTable[user.id];
            if (!player) throw new Chat.ErrorMessage("You're not in the Safari Zone game!");
            const error = game.throwBall(player);
            if (error) throw new Chat.ErrorMessage(error);
        },

        // Page commands
        rules(target, room, user) {
            this.parse(`/j view-safari-rules`);
        },

        pokemon(target, room, user) {
            this.parse(`/j view-safari-pokemon`);
        },

        scores(target, room, user) {
            this.parse(`/j view-safari-scores`);
        },

        menu(target, room, user) {
            this.parse(`/j view-safari`);
        },

        // Spectator commands
        spectate(target, room, user) {
            const game = this.requireGame(SafariGame);
            if (!game.suppressMessages) {
                throw new Chat.ErrorMessage("This Safari Zone game is not running in suppress mode.");
            }
            if (game.spectators[user.id]) {
                throw new Chat.ErrorMessage("You're already spectating this game.");
            }
            game.spectators[user.id] = 1;
            this.sendReply("You are now spectating the Safari Zone game.");
        },

        unspectate(target, room, user) {
            const game = this.requireGame(SafariGame);
            if (!game.suppressMessages) {
                throw new Chat.ErrorMessage("This Safari Zone game is not running in suppress mode.");
            }
            if (!game.spectators[user.id]) {
                throw new Chat.ErrorMessage("You're not spectating this game.");
            }
            delete game.spectators[user.id];
            this.sendReply("You are no longer spectating the Safari Zone game.");
        },

        // Information commands
        players(target, room, user) {
            const game = this.requireGame(SafariGame);
            if (!this.runBroadcast()) return;
            this.sendReplyBox(`<strong>Players (${Object.keys(game.players).length}):</strong> ${game.getPlayerList()}`);
        },

        status(target, room, user) {
            const game = this.requireGame(SafariGame);
            if (!this.runBroadcast()) return;
            const player = game.playerTable[user.id];
            if (player) {
                player.sendDisplay();
            } else {
                this.sendReplyBox(`<strong>A Safari Zone game is in progress.</strong><br />` +
                    `Players: ${game.getPlayerList()}`);
            }
        },

        help(target, room, user) {
            this.parse('/help safari');
        },
    },

    safarihelp: [
        `/safari create [entry fee] - Creates a new Safari Zone game with the specified entry fee. Requires: % @ # &`,
        `/safari join - Joins the current Safari Zone game.`,
        `/safari leave - Leaves the current Safari Zone game.`,
        `/safari start - Starts the current Safari Zone game. Requires: % @ # &`,
        `/safari end - Ends the current Safari Zone game. Requires: % @ # &`,
        `/safari throw - Throws a Safari Ball at a Pokemon.`,
        `/safari status - Shows your current game status.`,
        `/safari players - Shows the list of players in the game.`,
        `/safari menu - Opens the Safari Zone menu.`,
        `/safari rules - Shows the game rules.`,
        `/safari pokemon - Shows available Pokemon and their details.`,
        `/safari scores - Shows current game scores.`,
        `/safari spectate - Spectates the current game (only in suppress mode).`,
        `/safari unspectate - Stops spectating the current game.`,
    ],
};

export const roomSettings: Chat.SettingsHandler = room => ({
    label: "Safari Zone",
    permission: 'editroom',
    options: [
        [`disabled`, room.settings.safariDisabled || 'safari disable'],
        [`enabled`, !room.settings.safariDisabled || 'safari enable'],
    ],
});