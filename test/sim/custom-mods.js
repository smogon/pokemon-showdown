'use strict';

/**
 * DigiPen fork: the standardized custom content mods.
 *
 * These lock in the parts of the design that are easy to break by accident — a format ruleset that
 * lets in content it shouldn't, a tier that stops matching its evolution line, a tag that stops
 * marking a mod's items as existing.
 */

const assert = require('./../assert');
const { CustomMods, getCustomModTiers } = require('../../dist/data/custom-mods');
const { TeamValidator } = require('../../dist/sim/team-validator');

const PERFECT_IVS = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

/** The formats generated for a mod, by the name they get in `config/custom-formats.ts`. */
function formatsFor(mod) {
	const suffixes = [
		'singles', 'nationaldex', 'nationaldexubers',
		'vgc', 'vgcnonrestricted', 'vgcrestricted', 'vgcdualrestricted', 'vgcmythical',
	];
	return suffixes.map(suffix => `gen9${mod.prefix}${suffix}`);
}

/** A set that is legal apart from whatever the test is probing. */
function makeSet(species, extra) {
	return {
		name: species, species, item: '', ability: '', moves: [],
		evs: { hp: 4 }, ivs: PERFECT_IVS, level: 100, nature: 'Serious',
		...extra,
	};
}

/** Whether a format rejects a species on legality grounds, ignoring moveset complaints. */
function speciesIsBanned(formatid, speciesName) {
	const problems = new TeamValidator(formatid).validateSet(makeSet(speciesName), {}) || [];
	return problems.some(problem => (
		problem.includes('does not exist') ||
		problem.includes('is made up for Smogon CAP') ||
		problem.includes('not in the list of allowed pokemon') ||
		problem.includes('banned')
	));
}

describe('Custom content mods', () => {
	it('should give every mod the same eight formats, and all of them should load', () => {
		for (const mod of CustomMods) {
			for (const formatid of formatsFor(mod)) {
				const format = Dex.formats.get(formatid);
				assert(format.exists, `${mod.label} is missing the format ${formatid}`);
				assert.doesNotThrow(
					() => Dex.formats.getRuleTable(format),
					`${format.name} has an unusable ruleset`
				);
			}
		}
	});

	it('should not allow CAP Pokemon in any mod format', () => {
		const capSpecies = Object.keys(Dex.data.Pokedex)
			.map(id => Dex.species.get(id))
			.filter(species => species.isNonstandard === 'CAP');
		assert(capSpecies.length > 0, 'expected the base dex to contain CAP Pokemon to test against');
		for (const mod of CustomMods) {
			for (const formatid of formatsFor(mod)) {
				for (const species of capSpecies.slice(0, 5)) {
					assert(
						speciesIsBanned(formatid, species.name),
						`${species.name} is a CAP Pokemon but is legal in ${formatid}`
					);
				}
			}
		}
	});

	it('should not allow unobtainable Pokemon in any mod format', () => {
		const unobtainable = Object.keys(Dex.data.Pokedex)
			.map(id => Dex.species.get(id))
			.filter(species => (
				species.isNonstandard === 'Unobtainable' || species.tags?.includes('Past Unobtainable')
			));
		assert(unobtainable.length > 0, 'expected the base dex to contain unobtainable Pokemon');
		for (const mod of CustomMods) {
			for (const formatid of formatsFor(mod)) {
				for (const species of unobtainable) {
					assert(
						speciesIsBanned(formatid, species.name),
						`${species.name} is unobtainable but is legal in ${formatid}`
					);
				}
			}
		}
	});

	it('should keep restricted legendaries and Arceus out of National Dex but not National Dex Ubers', () => {
		// Arceus is tagged Mythical rather than Restricted Legendary, so the banlist names it; that
		// bans every forme. The client mirrors this in `BattleCustomMods.nationalDexBanned`.
		for (const mod of CustomMods) {
			const natDex = `gen9${mod.prefix}nationaldex`;
			const ubers = `gen9${mod.prefix}nationaldexubers`;
			for (const name of ['Koraidon', 'Arceus', 'Arceus-Fire', 'Arceus-Ghost']) {
				assert(speciesIsBanned(natDex, name), `${name} should be banned in ${natDex}`);
				assert(!speciesIsBanned(ubers, name), `${name} should be legal in ${ubers}`);
			}
			// Other Mythicals are unaffected.
			assert(!speciesIsBanned(natDex, 'Mew'), `Mew should be legal in ${natDex}`);
		}
	});

	it("should take a mod species' tier from its evolution line", () => {
		for (const mod of CustomMods) {
			const tiers = getCustomModTiers(mod.label);
			const modDex = Dex.mod(mod.id);
			let seen = 0;
			for (const id in require(`../../dist/data/mods/${mod.id}/pokedex`).Pokedex) {
				const species = modDex.species.get(id);
				if (species.isNonstandard !== mod.label) continue;
				seen++;
				const evolvesTwice = species.evos.some(evo => modDex.species.get(evo).evos.length);
				const expected = !species.evos.length ? tiers.fe : evolvesTwice ? tiers.lc : tiers.nfe;
				assert.equal(species.tier, expected, `${species.name} should be ${expected}`);
				assert.equal(species.natDexTier, expected, `${species.name} natDexTier`);
				assert.equal(species.doublesTier, expected, `${species.name} doublesTier`);
			}
			assert(seen > 0, `${mod.label} has no Pokemon of its own`);
		}
	});

	it("should let a mod's own items be held in its formats", () => {
		// Regression: the `fnaf` tag was a speciesFilter, not a genericFilter, so `+FNAF` could
		// never mark an *item* as existing and every FNAF item was rejected as nonexistent.
		for (const mod of CustomMods) {
			const modDex = Dex.mod(mod.id);
			// A Pokemon of this mod's own that has a movepool, and an item of its own that does not
			// force a forme, so the set is legal apart from the thing being tested.
			const species = Object.keys(require(`../../dist/data/mods/${mod.id}/pokedex`).Pokedex)
				.map(id => modDex.species.get(id))
				.find(s => s.isNonstandard === mod.label && modDex.data.Learnsets[s.id]?.learnset);
			const items = Object.keys(require(`../../dist/data/mods/${mod.id}/items`).Items)
				.map(id => modDex.items.get(id))
				.filter(item => (
					item.isNonstandard === mod.label && !item.forcedForme && !item.itemUser && !item.megaStone
				));
			assert(species, `${mod.label} has no Pokemon of its own with a movepool`);
			if (!items.length) continue;

			const move = Object.keys(modDex.data.Learnsets[species.id].learnset)[0];
			for (const formatid of formatsFor(mod)) {
				for (const item of items) {
					const problems = new TeamValidator(formatid).validateSet(makeSet(species.name, {
						item: item.name, ability: species.abilities[0], moves: [modDex.moves.get(move).name],
					}), {}) || [];
					assert.deepEqual(
						problems, [],
						`${species.name} holding ${item.name} should be legal in ${formatid}`
					);
				}
			}
		}
	});

	it("should add a mod's learnset entries to the inherited movepool, not replace it", () => {
		// Regression: the dex loader merges one level deep, so a mod listing one new move used to
		// leave the Pokemon with only that move.
		for (const mod of CustomMods) {
			const modDex = Dex.mod(mod.id);
			for (const id in require(`../../dist/data/mods/${mod.id}/learnsets`).Learnsets) {
				const baseLearnset = Dex.data.Learnsets[id]?.learnset;
				if (!baseLearnset) continue;
				const modLearnset = modDex.data.Learnsets[id]?.learnset;
				for (const moveid in baseLearnset) {
					assert(
						modLearnset[moveid],
						`${mod.label} dropped ${moveid} from ${id}'s movepool`
					);
				}
			}
		}
	});
});
