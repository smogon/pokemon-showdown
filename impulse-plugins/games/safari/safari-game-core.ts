/*************************************
 * Pokemon Safari Zone Game Core     *
 * Author: @musaddiktemkar           *
 **************************************/

import { Player, Pokemon, MovementState, GameStatus, MovementDirection, SAFARI_CONSTANTS } from './safari-types';
import { PokemonGenerator } from './safari-pokemon-generator';
import { SafariRenderer } from './safari-renderer';

/**
 * Safari Zone Game core class that manages game state and logic
 */
export class SafariGame {
    private room: ChatRoom;
    private players: {[k: string]: Player};
    private timer: NodeJS.Timeout | null;
    private status: GameStatus;
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
    private renderer: SafariRenderer;

    constructor(room: ChatRoom, host: string, prizePool: number = 1000, balls: number = SAFARI_CONSTANTS.DEFAULT_BALLS) {
        this.room = room;
        this.host = host;
        this.players = {};
        this.timer = null;
        this.status = 'waiting';
        this.prizePool = Math.max(SAFARI_CONSTANTS.MIN_PRIZE_POOL, Math.min(SAFARI_CONSTANTS.MAX_PRIZE_POOL, prizePool));
        this.gameId = `safari-${Date.now()}`;
        this.lastCatchMessage = null;
        this.lastWasCatch = false;
        this.currentTurn = 0;
        this.turnOrder = [];
        this.turnTimer = null;
        this.turnStartTime = 0;
        this.gameStartTime = Date.now();
        this.spectators = new Set();
        this.ballsPerPlayer = Math.max(SAFARI_CONSTANTS.MIN_BALLS, Math.min(SAFARI_CONSTANTS.MAX_BALLS, balls));
        // Generate Pokemon pool based on the number of balls per player (3x)
        this.pokemonPool = PokemonGenerator.generatePokemonPool(this.ballsPerPlayer);
        this.movementStates = {};
        this.renderer = new SafariRenderer(this);

        this.setInactivityTimer();
        this.display();
    }

    private setInactivityTimer() {
        this.timer = setTimeout(() => {
            if (this.status === 'waiting') {
                this.end(true);
            }
        }, SAFARI_CONSTANTS.INACTIVE_TIME);
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

    private startTurnTimer() {
        if (this.turnTimer) clearTimeout(this.turnTimer);
        
        this.turnStartTime = Date.now();
        const currentPlayerId = this.turnOrder[this.currentTurn];
        const player = this.players[currentPlayerId];
        
        this.turnTimer = setTimeout(() => {
            if (player && player.ballsLeft > 0) {
                player.ballsLeft--;
                this.lastWasCatch = false;
                this.lastCatchMessage = `${player.name} lost a Safari Ball due to not acting within 30 seconds! (${player.ballsLeft} balls left)`;
                player.lastCatch = Date.now();
            }
            this.nextTurn();
        }, SAFARI_CONSTANTS.TURN_TIME);

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

        // Reset movement state for the new turn
        delete this.movementStates[this.turnOrder[this.currentTurn]];
        this.display();
        this.startTurnTimer();
    }

    handleMovement(userId: string, direction: MovementDirection): string | null {
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
        state.currentPokemon = PokemonGenerator.selectRandomPokemon(this.pokemonPool);
        
        this.display(); // Update the display to show the new state
        return null;
    }

    throwBall(userId: string): string | null {
        if (this.status !== 'started') return "The game hasn't started yet!";
        if (!this.players[userId]) return "You're not in this game!";
        
        const currentPlayerId = this.turnOrder[this.currentTurn];
        if (userId !== currentPlayerId) return "It's not your turn!";

        const state = this.movementStates[userId];
        if (!state?.pokemonDisplayed) return "You need to move first!";
        
        const player = this.players[userId];
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
        delete this.movementStates[userId];
        this.nextTurn();
        return null;
    }

    addPlayer(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
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
        
        if (Object.keys(this.players).length === SAFARI_CONSTANTS.MAX_PLAYERS) {
            this.start(user.id);
        }

        user.sendTo(this.room, `|html|<div class="broadcast-green"><b>You have successfully joined the Safari Zone game!</b></div>`);
        
        return null;
    }

    addSpectator(userId: string): void {
        this.spectators.add(userId);
        this.renderer.displayToSpectator(userId);
    }

    removeSpectator(userId: string): void {
        this.spectators.delete(userId);
        const roomUser = Users.get(userId);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${userId}|`);
        }
    }

    start(userId: string): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (Object.keys(this.players).length < SAFARI_CONSTANTS.MIN_PLAYERS) return "Not enough players to start!";
        if (!this.players[userId]) return "You must be in the game to start it!";

        this.status = 'started';
        this.clearTimer();
        this.initializeTurnOrder();
        this.display();
        this.startTurnTimer();
        return null;
    }

    disqualifyPlayer(targetId: string, executor: string): string | null {
        if (toID(executor) !== toID(this.host)) return "Only the game creator can disqualify players.";
        if (this.status === 'ended') return "The game has already ended.";
        
        const player = this.players[targetId];
        if (!player) return "That player is not in this game.";

        delete this.players[targetId];
        this.display();

        if (this.status === 'started') {
            if (Object.keys(this.players).length < SAFARI_CONSTANTS.MIN_PLAYERS) {
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

    display() {
        this.renderer.display();
    }

    // Getter methods for renderer
    getHost(): string {
        return this.host;
    }
    
    getStatus(): GameStatus {
        return this.status;
    }
    
    getPrizePool(): number {
        return this.prizePool;
    }
    
    getBallsPerPlayer(): number {
        return this.ballsPerPlayer;
    }
    
    getGameStartTime(): number {
        return this.gameStartTime;
    }
    
    getLastCatchMessage(): string | null {
        return this.lastCatchMessage;
    }
    
    getLastWasCatch(): boolean {
        return this.lastWasCatch;
    }
    
    getMovementState(userId: string): MovementState | undefined {
        return this.movementStates[userId];
    }
    
    getSpectators(): Set<string> {
        return this.spectators;
    }

    end(inactive: boolean = false) {
        if (this.status === 'ended') return;

        this.clearTimer();
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
        this.status = 'ended';

        if (inactive && Object.keys(this.players).length < SAFARI_CONSTANTS.MIN_PLAYERS) {
            const inactiveMsg = `<div class="infobox">The Safari Zone game has been canceled due to inactivity.</div>`;
            this.room.add(`|uhtml|safari-end|${inactiveMsg}`).update();
            delete this.room.safari;
            return;
        }

        this.renderer.displayEndResults();
        delete this.room.safari;
    }
}
