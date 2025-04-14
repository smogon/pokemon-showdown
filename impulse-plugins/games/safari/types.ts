/**************************************
 * Pokemon Safari Zone Game Types     *
 * Author: @musaddiktemkar            *
 **************************************/

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
