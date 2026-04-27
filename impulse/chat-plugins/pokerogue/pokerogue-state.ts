/*
 * =======================================================================
 *
 * ___ __  __ ___ _   _ _    ___ ___
 * |_ _|  \/  | _ \ | | | |  / __| __|
 * | || |\/| |  _/ |_| | |__\__ \ _|
 * |___|_|  |_|_|  \___/|____|___/___|
 *
 * Server: Impulse
 * Plugin: PokéRogue State
 * Made by: @TurboRx
 *
 * =======================================================================
 */

import { FS } from '../../../lib';
import { type PokeRogueState, type SavedData } from './pokerogue-types';

const DATA_FILE = 'impulse/db/pokerogue.json';

export let savedData: SavedData = {};

function saveData(): void {
	FS(DATA_FILE).writeUpdate(() => JSON.stringify(savedData), { throttle: 3000 });
}

async function loadData(): Promise<void> {
	try {
		const raw = await FS(DATA_FILE).readIfExists();
		if (raw) savedData = JSON.parse(raw);
	} catch {
		savedData = {};
	}
}

void loadData();

export function getState(userid: string): PokeRogueState | null {
	return savedData[userid] ?? null;
}

export function setState(userid: string, state: PokeRogueState): void {
	savedData[userid] = state;
	saveData();
}

export function deleteState(userid: string): void {
	delete savedData[userid];
	saveData();
}