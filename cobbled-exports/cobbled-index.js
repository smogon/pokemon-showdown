/*
 * Copyright (C) 2023 Cobblemon Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// eslint-disable-next-line strict
const BS = require('./sim/battle-stream');
const Dex = require('./sim/dex').Dex;

const battleMap = new Map();
const cobbledModId = 'cobblemon';
const CobblemonCache = require("./sim/cobblemon-cache");
const BagItems = require("./sim/bag-items");

function startBattle(graalShowdown, battleId, requestMessages) {
	const battleStream = new BS.BattleStream();
	battleMap.set(battleId, battleStream);

	// Join messages with new line
	try {
		for (const element of requestMessages) {
			battleStream.write(element);
		}
	} catch (err) {
		graalShowdown.log(err.stack);
	}

	// Any battle output then gets written to the execution helper logging mechanism
	(async () => {
		for await (const output of battleStream) {
			graalShowdown.sendFromShowdown(battleId, output);
		}
	})();
}

function sendBattleMessage(battleId, messages) {
	const battleStream = battleMap.get(battleId);
	for (const element of messages) {
		battleStream.write(element);
	}
}

function getCobbledMoves() {
	return JSON.stringify(Dex.mod(cobbledModId).moves.all());
}

function getCobbledAbilityIds() {
	return JSON.stringify(Dex.mod(cobbledModId).abilities.all().map(ability => ability.id));
}

function getCobbledItemIds() {
	return JSON.stringify(Dex.mod(cobbledModId).items.all().map(item => item.id));
}

function receiveSpeciesData(speciesArray) {
	CobblemonCache.resetSpecies();
	speciesArray.forEach((speciesJson) => {
		const speciesData = JSON.parse(speciesJson);
		CobblemonCache.registerSpecies(speciesData);
	});
}

function afterCobbledSpeciesInit() {
	Dex.modsLoaded = false;
	Dex.includeMods();
}

function receiveBagItemData(itemId, bagItem) {
	BagItems.set(itemId, eval(`(${bagItem})`));
}
