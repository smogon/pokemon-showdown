/*************************************
 * Pokemon Safari Zone Game Types    *
 * Author: @musaddiktemkar           *
 **************************************/

/**
 * Represents a player in the Safari Zone game
 */
export interface Player {
    name: string;
    id: string;
    points: number;
    catches: Pokemon[];
    ballsLeft: number;
    lastCatch: number;
}

/**
 * Represents a Pokemon that can be encountered
 */
export interface Pokemon {
    name: string;
    rarity: number;
    points: number;
    sprite: string;
}

/**
 * Represents the state of a player's movement
 */
export interface MovementState {
    canMove: boolean;
    pokemonDisplayed: boolean;
    currentPokemon: Pokemon | null;
}

/**
 * Game constants
 */
export const SAFARI_CONSTANTS = {
    INACTIVE_TIME: 2 * 60 * 1000,
    CATCH_COOLDOWN: 2 * 1000,
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 10,
    DEFAULT_BALLS: 20,
    MIN_BALLS: 5,
    MAX_BALLS: 50,
    MIN_PRIZE_POOL: 10,
    MAX_PRIZE_POOL: 1000000,
    TURN_TIME: 30 * 1000
};

/**
 * Type for game status
 */
export type GameStatus = 'waiting' | 'started' | 'ended';

/**
 * Type for movement directions
 */
export type MovementDirection = 'up' | 'down' | 'left' | 'right';
