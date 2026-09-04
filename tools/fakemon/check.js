'use strict';
/**
 * Fakemon data and balance check.
 *
 *   node tools/fakemon/check.js
 *
 * Walks the whole custom dex looking for the problems listed in the spec:
 * Pokemon without moves, moves without a type or category, damaging moves with
 * no power, abilities with no implementation, items with no effect, Mega Stones
 * with no target, Mega formes with no stats or ability, broken references,
 * missing sprites, and outliers that are probably balance mistakes.
 *
 * Exits non-zero if any ERROR is found, so it can be used in CI.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const { Dex } = require(path.join(ROOT, 'dist', 'sim'));
const index = require(path.join(ROOT, 'tools', 'fakemon', 'raw', 'index.json'));

const errors = [];
const warnings = [];
const error = msg => errors.push(msg);
const warn = msg => warnings.push(msg);

/**
 * Items whose effect is implemented in another effect's callback rather than in
 * their own handlers - the same shape as Light Clay upstream. Each entry names
 * where the effect lives so this list cannot quietly hide a real gap.
 */
const EFFECT_ELSEWHERE = {
	lunarrock: "data/mods/fakemon/conditions.ts - fullmoon.durationCallback",
};

/** Handlers that mean an ability/item actually does something in battle. */
const isImplemented = entry => Object.entries(entry).some(([key, value]) => (
	(key.startsWith('on') && typeof value === 'function') ||
	key === 'condition' || key === 'isBerry' || key === 'megaStone' ||
	key === 'isChoice' || key === 'naturalGift'
));

function main() {
	const dex = Dex.mod('fakemon');
	dex.includeData();

	const speciesIds = Object.keys(dex.data.Pokedex);
	const moveIds = new Set(Object.keys(dex.data.Moves));
	const abilityIds = new Set(Object.keys(dex.data.Abilities));
	const itemIds = new Set(Object.keys(dex.data.Items));
	const customMoveIds = new Set([...index.genericMoves, ...Object.keys(index.signatureMoves)]);

	// ---------------------------------------------------------------- Pokemon
	for (const id of speciesIds) {
		const species = dex.species.get(id);

		if (!species.types.length) error(`${species.name}: no types`);
		for (const type of species.types) {
			if (!dex.types.get(type).exists) error(`${species.name}: unknown type "${type}"`);
		}

		const bst = Object.values(species.baseStats).reduce((a, b) => a + b, 0);
		if (bst < 200 || bst > 800) error(`${species.name}: implausible BST ${bst}`);
		for (const [stat, value] of Object.entries(species.baseStats)) {
			if (value < 1 || value > 255) error(`${species.name}: ${stat} out of range (${value})`);
		}

		const abilities = Object.values(species.abilities).filter(Boolean);
		if (!abilities.length) error(`${species.name}: no abilities`);
		for (const ability of abilities) {
			if (!abilityIds.has(dex.toID(ability))) {
				error(`${species.name}: unknown ability "${ability}"`);
			}
		}

		// Mega formes
		if (species.isMega) {
			const base = dex.species.get(species.baseSpecies);
			if (!base.exists) {
				error(`${species.name}: Mega forme with no base forme`);
			} else {
				const baseBst = Object.values(base.baseStats).reduce((a, b) => a + b, 0);
				if (bst - baseBst !== 100) {
					error(`${species.name}: Mega Stone forme must be +100 BST, is +${bst - baseBst}`);
				}
				if (species.baseStats.hp !== base.baseStats.hp) {
					warn(`${species.name}: Mega forme changes HP, which shifts the HP bar mid-battle`);
				}
			}
			if (!species.requiredItem) error(`${species.name}: Mega forme with no Mega Stone`);
			else if (!itemIds.has(dex.toID(species.requiredItem))) {
				error(`${species.name}: Mega Stone "${species.requiredItem}" does not exist`);
			}
			if (!Object.values(species.abilities).filter(Boolean).length) {
				error(`${species.name}: Mega forme with no Mega Ability`);
			}
			continue; // Mega formes share their base forme's learnset
		}

		// Learnset
		const learnset = dex.species.getLearnsetData(id).learnset || {};
		const learned = Object.keys(learnset);
		if (!learned.length) {
			error(`${species.name}: no moves`);
		} else {
			if (learned.length < 8) warn(`${species.name}: only ${learned.length} moves`);
			const damaging = learned.filter(m => dex.moves.get(m).category !== 'Status');
			if (!damaging.length) error(`${species.name}: learns no damaging move`);
			const stab = learned.filter(m => {
				const move = dex.moves.get(m);
				return move.category !== 'Status' && species.types.includes(move.type);
			});
			if (!stab.length) warn(`${species.name}: no STAB move`);
			for (const moveId of learned) {
				if (!moveIds.has(moveId)) error(`${species.name}: unknown move "${moveId}"`);
				else if (!customMoveIds.has(moveId)) {
					error(`${species.name}: learns "${moveId}", which is not custom data`);
				}
			}
		}

		// Sprites
		const sprite = path.join(ROOT, 'assets', 'pokemon', `${id}.png`);
		if (!fs.existsSync(sprite)) warn(`${species.name}: no sprite yet (using placeholder)`);
	}

	// ------------------------------------------------------------------ Moves
	for (const id of customMoveIds) {
		const move = dex.moves.get(id);
		const data = dex.data.Moves[id];
		if (!move.exists) {
			error(`move "${id}" is referenced but does not exist`);
			continue;
		}
		if (!dex.types.get(move.type).exists) error(`${move.name}: unknown type "${move.type}"`);
		if (!['Physical', 'Special', 'Status'].includes(move.category)) {
			error(`${move.name}: invalid category "${move.category}"`);
		}
		if (move.category !== 'Status' && !move.basePower &&
			!data.basePowerCallback && !data.damageCallback) {
			error(`${move.name}: damaging move with no power`);
		}
		if (move.category === 'Status' && move.basePower) {
			error(`${move.name}: status move with base power`);
		}
		if (!move.pp || move.pp < 1) error(`${move.name}: invalid PP (${move.pp})`);
		if (move.accuracy !== true && (move.accuracy < 1 || move.accuracy > 100)) {
			error(`${move.name}: invalid accuracy (${move.accuracy})`);
		}
		if (!move.target) error(`${move.name}: no target`);
		if (Math.abs(move.priority) > 6) error(`${move.name}: priority out of range`);

		// Balance: power has to be paid for.
		const effectivePower = move.basePower * (Array.isArray(move.multihit) ?
			(move.multihit[0] + move.multihit[1]) / 2 : (move.multihit || 1));
		if (effectivePower > 150 && !data.recoil && !data.selfdestruct && !data.self &&
			(move.accuracy === true || move.accuracy >= 95)) {
			warn(`${move.name}: ${effectivePower} effective power with no drawback`);
		}
		if (move.priority > 0 && move.basePower >= 110) {
			warn(`${move.name}: priority move with ${move.basePower} base power`);
		}
		if (move.basePower >= 100 && move.drain && move.accuracy === true) {
			warn(`${move.name}: strong, always-hits drain move`);
		}
	}

	// -------------------------------------------------------------- Abilities
	for (const id of [...Object.keys(index.abilities), ...Object.keys(index.megaAbilities)]) {
		const data = dex.data.Abilities[id];
		if (!data) {
			error(`ability "${id}" from the dex PDF is not implemented`);
			continue;
		}
		if (!isImplemented(data)) error(`${data.name}: no battle implementation`);
		if (data.rating === undefined) warn(`${data.name}: no rating`);
	}
	// Mega abilities must not be reachable without Mega Evolving.
	const megaAbilityNames = new Set(Object.values(index.megaAbilities));
	for (const id of speciesIds) {
		const species = dex.species.get(id);
		if (species.isMega) continue;
		for (const ability of Object.values(species.abilities)) {
			if (megaAbilityNames.has(ability)) {
				error(`${species.name}: has Mega Ability "${ability}" on its base forme`);
			}
		}
	}

	// ------------------------------------------------------------------ Items
	for (const id of itemIds) {
		const data = dex.data.Items[id];
		if (data.isNonstandard !== 'Custom') {
			error(`item "${id}" is not tagged as custom data`);
		}
		if (!isImplemented(data) && !EFFECT_ELSEWHERE[id]) {
			error(`${data.name}: item with no effect`);
		}
		if (data.megaStone) {
			const targets = Object.entries(data.megaStone);
			if (!targets.length) error(`${data.name}: Mega Stone with no target`);
			for (const [base, forme] of targets) {
				if (!dex.species.get(base).exists) {
					error(`${data.name}: targets unknown Pokémon "${base}"`);
				}
				if (!dex.species.get(forme).exists) {
					error(`${data.name}: produces unknown forme "${forme}"`);
				}
			}
		}
	}
	// Every Mega forme needs a stone, and every stone a forme.
	for (const [baseId, info] of Object.entries(index.megas)) {
		if (!itemIds.has(info.stoneId)) error(`${info.stone}: Mega Stone missing from items`);
		if (!dex.species.get(info.forme).exists) error(`${info.forme}: Mega forme missing`);
		if (!dex.species.get(baseId).exists) error(`${baseId}: base forme for ${info.stone} missing`);
	}

	// ------------------------------------------------------- Original data gone
	for (const id of ['pikachu', 'charizard', 'garchomp', 'landorustherian']) {
		if (dex.species.get(id).exists) error(`original Pokémon "${id}" is still available`);
	}
	for (const id of ['thunderbolt', 'earthquake', 'closecombat']) {
		if (dex.moves.get(id).exists) error(`original move "${id}" is still available`);
	}
	for (const id of ['levitate', 'intimidate', 'protean']) {
		if (dex.abilities.get(id).exists) error(`original ability "${id}" is still available`);
	}
	for (const id of ['leftovers', 'choicescarf', 'lifeorb']) {
		if (dex.items.get(id).exists) error(`original item "${id}" is still available`);
	}

	// ----------------------------------------------------------------- Report
	const megaCount = Object.keys(index.megas).length;
	console.log('IMPLEMENTED:');
	console.log(`  ${index.baseSpecies.length} Pokémon (${speciesIds.length} entries incl. ${megaCount} Mega formes)`);
	console.log(`  ${customMoveIds.size} Moves (${Object.keys(index.signatureMoves).length} signature)`);
	console.log(`  ${Object.keys(index.abilities).length} Abilities + ${Object.keys(index.megaAbilities).length} Mega Abilities`);
	console.log(`  ${itemIds.size} Items`);
	console.log(`  ${megaCount} Mega Stones`);
	console.log('');
	console.log(`WARNINGS: ${warnings.length}`);
	for (const message of warnings) console.log(`  - ${message}`);
	console.log('');
	console.log(`ERRORS: ${errors.length}`);
	for (const message of errors) console.log(`  - ${message}`);

	if (errors.length) process.exitCode = 1;
}

main();
