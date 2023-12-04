import {Pokemon} from "./pokemon";

export interface BagItem {
	use: (battle: Battle, pokemon: Pokemon, itemId: string, data: string[]) => void;
};

const bagItems = new Map<string, BagItem>();

export function set(itemId, bagItem) {
	bagItems.set(itemId, bagItem);
};

export function getItem(itemId) {
	return bagItems.get(itemId);
};

export function has(itemId) {
	return bagItems.has(itemId);
}

