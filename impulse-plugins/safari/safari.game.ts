import { SafariUtils } from './safari.utils';
import { SafariDisplay } from './safari.display';
import { Player, Pokemon, MovementState, GameStatus, SafariGameConfig } from './safari.types';

export class SafariGame {
    private config: SafariGameConfig = {
        MIN_PLAYERS: 2,
        MAX_PLAYERS: 10,
        DEFAULT_BALLS: 20,
        MIN_BALLS: 5,
        MAX_BALLS: 50,
        MIN_PRIZE_POOL: 10,
        MAX_PRIZE_POOL: 1000000,
        TURN_TIME: 30 * 1000,
        INACTIVE_TIME: 2 * 60 * 1000,
        CATCH_COOLDOWN: 2 * 1000
    };

    public players: {[k: string]: Player} = {};
    public status: GameStatus = 'waiting';
    private display: SafariDisplay;
    private timer: NodeJS.Timeout | null = null;
    private turnTimer: NodeJS.Timeout | null = null;
    private turnOrder: string[] = [];
    private currentTurn: number = 0;
    private turnStartTime: number = 0;
    private gameStartTime: number = Date.now();
    private movementStates: { [k: string]: MovementState } = {};
    private lastCatchMessage: string | null = null;
    private lastWasCatch: boolean = false;
    private spectators: Set<string> = new Set();
    private readonly pokemonPool: Pokemon[];

    constructor(
        public room: ChatRoom, 
        public host: string, 
        public prizePool: number = 1000, 
        public ballsPerPlayer: number = this.config.DEFAULT_BALLS
    ) {
        this.pokemonPool = SafariUtils.generatePokemonPool();
        this.display = new SafariDisplay(
            room,
            host,
            this.players,
            this.status,
            prizePool,
            ballsPerPlayer,
            this.turnOrder,
            this.currentTurn,
            this.turnStartTime,
            this.gameStartTime,
            this.lastCatchMessage,
            this.lastWasCatch,
            this.movementStates,
            this.spectators
        );
        this.setInactivityTimer();
        this.display.displayWaiting();
    }

    private setInactivityTimer() {
        this.timer = setTimeout(() => {
            if (this.status === 'waiting') {
                this.end(true);
            }
        }, this.config.INACTIVE_TIME);
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

    public addPlayer(user: User): string | null {
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

        this.display.displayWaiting();
        
        if (Object.keys(this.players).length === this.config.MAX_PLAYERS) {
            this.start(user);
        }

        return null;
    }

    public start(user: User): string | null {
        if (this.status !== 'waiting') return "The game has already started!";
        if (Object.keys(this.players).length < this.config.MIN_PLAYERS) return "Not enough players to start!";
        if (!this.players[user.id]) return "You must be in the game to start it!";

        this.status = 'started';
        this.clearTimer();
        this.initializeTurnOrder();
        this.startTurnTimer();
        this.display.displayGameState();
        return null;
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
        }, this.config.TURN_TIME);

        this.display.displayGameState();
    }

    public handleMovement(userId: string, direction: 'up' | 'down' | 'left' | 'right'): string | null {
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

        state.canMove = false;
        state.pokemonDisplayed = true;
        
        const randomIndex = Math.floor(Math.random() * this.pokemonPool.length);
        state.currentPokemon = this.pokemonPool[randomIndex];
        
        this.display.displayGameState();
        return null;
    }

    public throwBall(user: User): string | null {
        if (this.status !== 'started') return "The game hasn't started yet!";
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

        delete this.movementStates[user.id];
        this.nextTurn();
        return null;
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

        delete this.movementStates[this.turnOrder[this.currentTurn]];
        this.display.displayGameState();
        this.startTurnTimer();
    }

    public addSpectator(userid: string): void {
        this.spectators.add(userid);
        this.display.displayGameState();
    }

    public removeSpectator(userid: string): void {
        this.spectators.delete(userid);
        const roomUser = Users.get(userid);
        if (roomUser?.connected) {
            roomUser.sendTo(this.room, `|uhtmlchange|safari-spectator-${userid}|`);
        }
    }

    public disqualifyPlayer(targetId: string, executor: string): string | null {
        if (toID(executor) !== toID(this.host)) return "Only the game creator can disqualify players.";
        if (this.status === 'ended') return "The game has already ended.";
        
        const player = this.players[targetId];
        if (!player) return "That player is not in this game.";

        delete this.players[targetId];
        this.display.displayGameState();

        if (this.status === 'started') {
            if (Object.keys(this.players).length < this.config.MIN_PLAYERS) {
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
        if (this.status === 'ended') return;

        this.clearTimer();
        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
            this.turnTimer = null;
        }
        this.status = 'ended';

        if (inactive && Object.keys(this.players).length < this.config.MIN_PLAYERS) {
            this.display.displayEndGame(true);
            delete this.room.safari;
            return;
        }

        const sortedPlayers = Object.values(this.players).sort((a, b) => b.points - a.points);
        if (sortedPlayers.length > 0) {
            const prizes = [0.6, 0.3, 0.1];
            for (let i = 0; i < Math.min(3, sortedPlayers.length); i++) {
                const prize = Math.floor(this.prizePool * prizes[i]);
                if (prize > 0) {
                    Economy.addMoney(sortedPlayers[i].id, prize, `Safari Zone ${i + 1}${['st', 'nd', 'rd'][i]} place`);
                }
            }
        }

        this.display.displayEndGame();
        delete this.room.safari;
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
                
                const [prizePoolStr, ballsStr] = args.join(' ').split(',').map(arg => arg.trim());
                const prizePool = parseInt(prizePoolStr);
                const balls = parseInt(ballsStr);
                
                if (!prizePoolStr || isNaN(prizePool) || prizePool < SafariGame.MIN_PRIZE_POOL || prizePool > SafariGame.MAX_PRIZE_POOL) {
                    return this.errorReply(`Please enter a valid prize pool amount (${SafariGame.MIN_PRIZE_POOL}-${SafariGame.MAX_PRIZE_POOL} coins).`);
                }

                if (ballsStr && (isNaN(balls) || balls < SafariGame.MIN_BALLS || balls > SafariGame.MAX_BALLS)) {
                    return this.errorReply(`Please enter a valid number of balls (${SafariGame.MIN_BALLS}-${SafariGame.MAX_BALLS}).`);
                }
                
                room.safari = new SafariGame(room, user.name, prizePool, balls);
                this.modlog('SAFARI', null, `started by ${user.name} with ${prizePool} coin prize pool and ${balls} balls`);
                return this.privateModAction(`${user.name} started a Safari game with ${prizePool} coin prize pool and ${balls || SafariGame.DEFAULT_BALLS} balls per player.`);
            }

            case 'join': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const error = room.safari.addPlayer(user);
                if (error) return this.errorReply(error);
                return;
            }

            case 'move': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const direction = args[0]?.toLowerCase();
                if (!['up', 'down', 'left', 'right'].includes(direction)) {
                    return this.errorReply("Invalid direction! Use up, down, left, or right.");
                }
                const result = room.safari.handleMovement(user.id, direction as 'up' | 'down' | 'left' | 'right');
                if (result) return this.errorReply(result);
                return;
            }

            case 'spectate': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                if (room.safari.players[user.id]) return this.errorReply("You are already in the game!");
                room.safari.addSpectator(user.id);
                return;
            }

            case 'unspectate': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                room.safari.removeSpectator(user.id);
                return;
            }

            case 'start': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const error = room.safari.start(user);
                if (error) return this.errorReply(error);
                this.modlog('SAFARI', null, `started by ${user.name}`);
                return this.privateModAction(`${user.name} started the Safari game.`);
            }

            case 'throw': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const result = room.safari.throwBall(user);
                if (result) return this.errorReply(result);
                return;
            }

            case 'dq':
            case 'disqualify': {
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                const targetUser = args.join(' ').trim();
                if (!targetUser) return this.errorReply("Please specify a player to disqualify.");
                
                const targetId = toID(targetUser);
                const result = room.safari.disqualifyPlayer(targetId, user.name);
                if (result) {
                    this.modlog('SAFARIDQ', targetUser, `by ${user.name}`);
                    this.privateModAction(result);
                    return;
                }
                return this.errorReply("Failed to disqualify player.");
            }

            case 'end': {
                this.checkCan('mute', null, room);
                if (!room.safari) return this.errorReply("There is no Safari game running in this room.");
                room.safari.end(false);
                this.modlog('SAFARI', null, `ended by ${user.name}`);
                return this.privateModAction(`${user.name} ended the Safari game.`);
            }

            default:
                return this.parse('/help safari');
        }
    },

  safarihelp(target, room, user) {
        if (!this.runBroadcast()) return;
        return this.sendReplyBox(
            '<center><strong>Safari Zone Commands</strong></center>' +
            '<hr />' +
            `<code>/safari create [prizePool],[balls]</code>: Creates a new Safari game with the specified prize pool (10-1000000 coins) and balls per player.<br />` +
            '<code>/safari join</code>: Joins the current Safari game.<br />' +
            '<code>/safari start</code>: Starts the Safari game if enough players have joined.<br />' +
            '<code>/safari move [up/down/left/right]</code>: Move in a direction to find a Pokemon.<br />' +
            '<code>/safari throw</code>: Throws a Safari Ball at the encountered Pokemon.<br />' +
            '<code>/safari spectate</code>: Watch an ongoing Safari game.<br />' +
            '<code>/safari unspectate</code>: Stop watching a Safari game.<br />' +
            '<code>/safari dq [player]</code>: Disqualifies a player from the game (only usable by game creator).<br />' +
            '<code>/safari end</code>: Ends the current Safari game. Requires: @ # &<br />' +
            '<hr />' +
            '<strong>Game Rules:</strong><br />' +
            '- No entry fee required<br />' +
            '- Minimum 2 players required to start<br />' +
            '- Each player gets 5-50 Safari Balls (default: 20)<br />' +
            '- On your turn, first choose a direction to move<br />' +
            '- After moving, a Pokemon may appear which you can try to catch<br />' +
            '- 30 second time limit per turn<br />' +
            '- Game ends when all players use their balls<br />' +
            '- Prizes: 1st (60%), 2nd (30%), 3rd (10%) of prize pool<br />' +
            '- Players can be disqualified by the game creator'
        );
    }
};
