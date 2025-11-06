/*
* Pokemon Showdown
* RPG Pokedex System
*
* Manages tracking of seen and caught Pokemon for collection progress.
*/

import type { PlayerData } from './interface';
import { toID } from '../../../sim/dex';

// --- POKEDEX INITIALIZATION ---

export function initializePokedex(player: PlayerData): void {
	if (!player.pokedex) {
		player.pokedex = {
			seen: new Set<string>(),
			caught: new Set<string>(),
		};
	}
}

// --- POKEDEX REGISTRATION ---

export function registerPokemonSeen(player: PlayerData, speciesId: string): void {
	initializePokedex(player);
	player.pokedex!.seen.add(toID(speciesId));
}

export function registerPokemonCaught(player: PlayerData, speciesId: string): void {
	initializePokedex(player);
	const id = toID(speciesId);
	player.pokedex!.seen.add(id);
	player.pokedex!.caught.add(id);
}

// --- POKEDEX QUERIES ---

export function getPokedexStats(player: PlayerData): { seen: number, caught: number } {
	initializePokedex(player);
	return {
		seen: player.pokedex!.seen.size,
		caught: player.pokedex!.caught.size,
	};
}

export function hasSeenPokemon(player: PlayerData, speciesId: string): boolean {
	initializePokedex(player);
	return player.pokedex!.seen.has(toID(speciesId));
}

export function hasCaughtPokemon(player: PlayerData, speciesId: string): boolean {
	initializePokedex(player);
	return player.pokedex!.caught.has(toID(speciesId));
}
