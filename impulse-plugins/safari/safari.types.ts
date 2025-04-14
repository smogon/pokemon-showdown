export interface Player {
    name: string;
    id: string;
    points: number;
    catches: Pokemon[];
    ballsLeft: number;
    lastCatch: number;
}

export interface Pokemon {
    name: string;
    rarity: number;
    points: number;
    sprite: string;
}

export interface MovementState {
    canMove: boolean;
    pokemonDisplayed: boolean;
    currentPokemon: Pokemon | null;
}

export type GameStatus = 'waiting' | 'started' | 'ended';

export interface SafariGameConfig {
    MIN_PLAYERS: number;
    MAX_PLAYERS: number;
    DEFAULT_BALLS: number;
    MIN_BALLS: number;
    MAX_BALLS: number;
    MIN_PRIZE_POOL: number;
    MAX_PRIZE_POOL: number;
    TURN_TIME: number;
    INACTIVE_TIME: number;
    CATCH_COOLDOWN: number;
}
