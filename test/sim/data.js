'use strict';

const assert = require('./../assert');
const fs = require('fs');

describe('Dex data', () => {
	it('should have valid Pokedex entries', () => {
		const Pokedex = Dex.data.Pokedex;
		for (const pokemonid in Pokedex) {
			const entry = Pokedex[pokemonid];
			assert.equal(toID(entry.name), pokemonid, `Mismatched Pokemon key "${pokemonid}" of ${entry.name}`);
			assert(!entry.name.startsWith("-") && !entry.name.endsWith("-"), `Pokemon name "${entry.name}" should not start or end with a hyphen`);
			assert.equal(entry.name, entry.name.trim(), `Pokemon name "${entry.name}" should not start or end with whitespace`);

			assert(entry.color, `Pokemon ${entry.name} must have a color.`);
			if (!entry.isCosmeticForme) assert(entry.heightm, `Pokemon ${entry.name} must have a height.`);

			if (entry.forme) {
				// entry is a forme of a base species
				const baseEntry = Pokedex[toID(entry.baseSpecies)];
				assert(baseEntry && !baseEntry.forme, `Forme ${entry.name} should have a valid baseSpecies`);
				// Gmax formes are not actually formes, they are only included in pokedex.ts for convenience
				if (!entry.name.includes('Gmax') && !entry.isCosmeticForme) {
					assert((baseEntry.otherFormes || []).includes(entry.name), `Base species ${entry.baseSpecies} should have ${entry.name} listed as an otherForme`);
				}
				assert.false(entry.otherFormes, `Forme ${entry.baseSpecies} should not have a forme list (the list goes in baseSpecies).`);
				assert.false(entry.cosmeticFormes, `Forme ${entry.baseSpecies} should not have a cosmetic forme list (the list goes in baseSpecies).`);
				assert.false(entry.baseForme, `Forme ${entry.baseSpecies} should not have a baseForme (its forme name goes in forme) (did you mean baseSpecies?).`);
			} else {
				// entry should be a base species
				assert.false(entry.baseSpecies, `Base species ${entry.name} should not have its own baseSpecies.`);
				assert.false(entry.changesFrom, `Base species ${entry.name} should not change from anything (its changesFrom forme should be base).`);
				assert.false(entry.battleOnly, `Base species ${entry.name} should not be battle-only (its out-of-battle forme should be base).`);
				if (entry.baseForme) {
					assert.equal(Dex.getAlias(pokemonid + toID(entry.baseForme)), pokemonid, `Base species ${entry.name}-${entry.baseForme} should be aliased to ${entry.name}`);
				}
			}

			if (entry.prevo) {
				const prevoEntry = Pokedex[toID(entry.prevo)] || {};
				assert(prevoEntry.evos.includes(entry.name), `Prevo ${entry.prevo} should have ${entry.name} listed as an evo`);
			}
			if (entry.evos) {
				for (const evo of entry.evos) {
					const evoEntry = Pokedex[toID(evo)] || {};
					assert.equal(evo, evoEntry.name, `Misspelled/nonexistent evo "${evo}" of ${entry.name}`);
					assert.notEqual(entry.num, evoEntry.num, `Evo ${evo} of ${entry.name} should have a different dex number`);
					if (entry.name === "Gimmighoul-Roaming") continue;
					assert.equal(evoEntry.prevo, entry.name, `Evo ${evo} should have ${entry.name} listed as a prevo`);
				}
			}
			if (entry.otherFormes) {
				for (const forme of entry.otherFormes) {
					const formeEntry = Pokedex[toID(forme)] || {};
					assert.equal(forme, formeEntry.name, `Misspelled/nonexistent forme "${forme}" of ${entry.name}`);
					assert.equal(entry.num, formeEntry.num, `Forme ${formeEntry.name} of ${entry.name} should have the same dex number`);
					assert.equal(formeEntry.baseSpecies, entry.name, `Forme ${forme} of ${entry.name} should have it as a baseSpecies`);
					if (!forme.startsWith('Pokestar')) {
						assert.notEqual(entry.formeOrder, undefined, `${entry.name} has an otherForme "${forme}" but no formeOrder field`);
						assert(entry.formeOrder.includes(forme), `Forme "${forme}" of ${entry.name} is not included in its formeOrder`);
					}
				}
			}
			if (entry.cosmeticFormes) {
				for (const forme of entry.cosmeticFormes) {
					assert.equal(Dex.getAlias(toID(forme)), pokemonid, `Misspelled/nonexistent alias "${forme}" of ${entry.name}`);
					assert.equal(Dex.data.FormatsData[toID(forme)], undefined, `Cosmetic forme "${forme}" should not have its own tier`);
				}
			}
			if (entry.isCosmeticForme) {
				assert.equal(Dex.getAlias(pokemonid), toID(entry.baseSpecies), `Misspelled/nonexistent alias "${pokemonid}" of ${entry.baseSpecies}`);
				assert.equal(Dex.data.FormatsData[pokemonid], undefined, `Cosmetic forme "${entry.name}" should not have its own tier`);
			}
			if (entry.battleOnly) {
				const battleOnly = Array.isArray(entry.battleOnly) ? entry.battleOnly : [entry.battleOnly];
				for (const battleForme of battleOnly) {
					const battleEntry = Pokedex[toID(battleForme)] || {};
					assert.equal(battleForme, battleEntry.name, `Misspelled/nonexistent battle-only forme "${battleForme}" of ${entry.name}`);
					assert.equal(battleEntry.baseSpecies || battleEntry.name, entry.baseSpecies, `Battle-only forme ${entry.name} of ${battleEntry.name} should have the same baseSpecies`);
					assert(!battleEntry.battleOnly, `Out-of-battle forme ${battleEntry.name} of ${entry.name} should not be battle-only`);
				}
			}
			if (entry.changesFrom) {
				const formeEntry = Pokedex[toID(entry.changesFrom)] || {};
				assert.equal(entry.changesFrom, formeEntry.name, `Misspelled/nonexistent changesFrom value "${entry.changesFrom}" of ${entry.name}`);
				assert.equal(formeEntry.baseSpecies || formeEntry.name, entry.baseSpecies, `Original forme ${formeEntry.name} of ${entry.name} should have the same baseSpecies`);
				assert(!formeEntry.changesFrom, `Original forme ${formeEntry.name} of ${entry.name} should not also have chagesFrom`);
				assert(!formeEntry.battleOnly, `Original forme ${formeEntry.name} of ${entry.name} should not also have battleOnly`);
			}
			if (entry.cosmeticFormes) {
				for (const forme of entry.cosmeticFormes) {
					assert(forme.startsWith(`${entry.name}-`), `Misspelled/nonexistent beginning of cosmetic forme name "${forme}" of ${entry.name}`);
					assert(!forme.endsWith("-"), `Cosmetic forme name "${forme}" of ${entry.name} should not end with a hyphen`);
					assert.equal(forme, forme.trim(), `Cosmetic forme name "${forme}" of ${entry.name} should not start or end with whitespace`);
					if (!forme.startsWith('Pokestar')) {
						assert.notEqual(entry.formeOrder, undefined, `${entry.name} has a cosmetic forme "${forme}" but no formeOrder field`);
						assert(entry.formeOrder.includes(forme), `Cosmetic forme name "${forme}" of ${entry.name} is not included in its formeOrder`);
					}
				}
			}
			if (entry.formeOrder) {
				for (const forme of entry.formeOrder) {
					if (toID(forme).includes('gmax')) continue;
					// formeOrder contains other formes and 'cosmetic' formes which do not have entries in Pokedex but should have aliases
					const formeEntry = Dex.species.get(toID(forme));
					assert.equal(forme, formeEntry.name, `Misspelled/nonexistent forme "${forme}" of ${entry.name}`);
					assert(entry.formeOrder.includes(formeEntry.baseSpecies), `${entry.name}'s formeOrder does not contain its base species ${formeEntry.baseSpecies}`);
				}
			}

			if (entry.evoItem) {
				const item = Dex.items.get(entry.evoItem);
				assert.equal(entry.evoItem, item.exists && item.name, `Misspelled/nonexistent evo item "${entry.evoItem}" of ${entry.name}`);
			}

			const battleOnly = ['Mega', 'Mega-X', 'Mega-Y', 'Primal'].includes(entry.forme) ? entry.baseSpecies : entry.battleOnly;
			if (entry.requiredAbility) {
				assert(entry.battleOnly, `Forme ${entry.name} with requiredAbility must have battleOnly`);
			}
			if (entry.requiredItem) {
				assert(battleOnly || entry.changesFrom, `Forme ${entry.name} with requiredAbility must have battleOnly or changesFrom`);
			}
			if (entry.requiredMove) {
				assert(battleOnly || entry.changesFrom, `Forme ${entry.name} with requiredAbility must have battleOnly or changesFrom`);
			}
		}
	});

	it('should have valid Items entries', () => {
		const Items = Dex.data.Items;
		for (const itemid in Items) {
			const entry = Items[itemid];
			assert.equal(toID(entry.name), itemid, `Mismatched Item key "${itemid}" of "${entry.name}"`);
			assert.equal(typeof entry.num, 'number', `Item ${entry.name} should have a number`);
		}
	});

	it('should have valid Moves entries', () => {
		const Moves = Dex.data.Moves;
		for (const moveid in Moves) {
			const entry = Moves[moveid];
			assert.equal(toID(entry.name), moveid, `Mismatched Move key "${moveid}" of "${entry.name}"`);
			assert.equal(typeof entry.num, 'number', `Move ${entry.name} should have a number`);
			assert.false(entry.infiltrates, `Move ${entry.name} should not have an 'infiltrates' property (no real move has it)`);
		}
	});

	it('should have valid Abilities entries', () => {
		const Abilities = Dex.data.Abilities;
		for (const abilityid in Abilities) {
			const entry = Abilities[abilityid];
			assert.equal(toID(entry.name), abilityid, `Mismatched Ability key "${abilityid}" of "${entry.name}"`);
			assert.equal(typeof entry.num, 'number', `Ability ${entry.name} should have a number`);
			assert.equal(typeof entry.rating, 'number', `Ability ${entry.name} should have a rating`);
		}
	});

	it('should have valid Aliases entries', () => {
		const Aliases = require('../../dist/data/aliases').Aliases;
		for (const aliasid in Aliases) {
			const targetid = toID(Aliases[aliasid]);
			if (targetid in Dex.data.Pokedex) {
				assert.equal(Aliases[aliasid], Dex.data.Pokedex[targetid].name, `Alias ${aliasid} has incorrect Species name "${Aliases[aliasid]}"`);
			} else if (targetid in Dex.data.Moves) {
				assert.equal(Aliases[aliasid], Dex.data.Moves[targetid].name, `Alias ${aliasid} has incorrect Move name "${Aliases[aliasid]}"`);
			} else if (targetid in Dex.data.Abilities) {
				assert.equal(Aliases[aliasid], Dex.data.Abilities[targetid].name, `Alias ${aliasid} has incorrect Ability name "${Aliases[aliasid]}"`);
			} else if (targetid in Dex.data.Items) {
				assert.equal(Aliases[aliasid], Dex.data.Items[targetid].name, `Alias ${aliasid} has incorrect Item name "${Aliases[aliasid]}"`);
			} else if (targetid in Dex.data.Rulesets) {
				assert.equal(Aliases[aliasid], Dex.data.Rulesets[targetid].name, `Alias ${aliasid} has incorrect Ruleset name "${Aliases[aliasid]}"`);
			} else {
				assert(false, `Alias ${aliasid} -> "${Aliases[aliasid]}" must be a pokemon/move/ability/item/format`);
			}
		}

		// Dex.loadAliases();
		// for (const aliasid in Aliases) {
		// 	const targetid = toID(Aliases[aliasid]);
		// 	if (Dex.fuzzyAliases.get(aliasid)?.join(',') === targetid) {
		// 		console.log(`Redundant alias "${aliasid}"`);
		// 	}
		// }
	});

	it('should have valid CompoundWordNames entries', () => {
		const CompoundWordNames = require('../../dist/data/aliases').CompoundWordNames;
		const used = new Map();
		for (const name of CompoundWordNames) {
			const targetid = toID(name);
			assert(!used.has(targetid), `CompoundWordNames entry "${name}" already exists as "${used.get(targetid)}"`);
			used.set(targetid, name);

			let actualName = Dex.data.Pokedex[targetid]?.name || Dex.data.Moves[targetid]?.name ||
				Dex.data.Abilities[targetid]?.name || Dex.data.Items[targetid]?.name;
			if (Dex.data.Pokedex[targetid]?.name) {
				const species = Dex.species.get(targetid);
				if (species.forme) actualName = species.baseSpecies + ' ' + species.forme;
			}
			assert(actualName, `CompoundWordNames entry "${name}" must be a pokemon/move/ability/item`);
			assert.equal(actualName.replace(/-/g, ''), name.replace(/-/g, ''), `CompoundWordNames entry "${name}" should be the same as its target name (ignoring hyphens)`);
			assert(name.split('-').length > actualName.split('-').length, `CompoundWordNames entry "${name}" should have at least one more hyphen than "${actualName}" (to mark a word boundary)`);
		}
	});

	it('should have valid Rulesets entries', () => {
		const Rulesets = Dex.data.Rulesets;
		for (const formatid in Rulesets) {
			const entry = Rulesets[formatid];
			assert.equal(toID(entry.name), formatid, `Mismatched Ruleset key "${formatid}" of "${entry.name}"`);
			if (entry.mod) {
				assert.equal(toID(entry.mod) || undefined, entry.mod, `Mod of "${formatid}" must be an ID"`);
			}
		}
	});

	it('should have valid Formats (slow)', () => {
		for (const format of Dex.formats.all()) {
			try {
				Dex.formats.getRuleTable(format);
			} catch (e) {
				e.message = `${format.name}: ${e.message}`;
				throw e;
			}
		}
	});

	it('should have valid Natures entries', () => {
		const Natures = Dex.data.Natures;
		for (const natureid in Natures) {
			const entry = Natures[natureid];
			assert.equal(toID(entry.name), natureid, `Mismatched Nature key "${natureid}" of "${entry.name}"`);
			assert.equal(!!entry.plus, !!entry.minus, `Mismatched Nature values "+${entry.plus}"/"-${entry.minus}" of "${entry.name}"`);
		}
	});

	it('should have valid Learnsets entries', function () {
		this.timeout(0);
		const mods = [Dex.mod('gen2'), Dex.mod('gen7letsgo'), Dex.mod('gen8bdsp'), Dex.mod('gen8legends'), Dex.mod('gen9legends'), Dex];
		for (const mod of mods) {
			for (const speciesid in mod.data.Learnsets) {
				const species = Dex.species.get(speciesid);
				assert.equal(speciesid, species.id, `Key "${speciesid}" in Learnsets should be a Species ID`);
				assert(species.exists, `Key "${speciesid}" in Learnsets should be a pokemon`);
				let entry = mod.data.Learnsets[speciesid];
				if (!entry.learnset) entry = mod.data.Learnsets[toID(species.changesFrom || species.baseSpecies)];
				for (const moveid in entry.learnset) {
					const move = Dex.moves.get(moveid);
					assert.equal(moveid, move.id, `Move key "${moveid}" of Learnsets entry ${species.name} should be a Move ID`);
					assert(move.exists && !move.realMove, `Move key "${moveid}" of Learnsets entry ${species.name} should be a real move`);

					let prevLearnedGen = 10;
					let prevLearnedTypeIndex = -1;
					const LEARN_ORDER = 'MTLREVDSC';
					for (const learned of entry.learnset[moveid]) {
						// See the definition of MoveSource in sim/global-types
						assert(/^[1-9][MTLREDSVC]/.test(learned), `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid`);

						// the move validator uses early exits, so this isn't purely a consistency thing
						// MTL must be before REDSVC, and generations must be ordered newest to oldest
						const learnedGen = parseInt(learned.charAt(0));
						const learnedTypeIndex = LEARN_ORDER.indexOf(learned.charAt(1));
						assert(learnedGen <= prevLearnedGen, `Learn method "${learned}" for ${species.name}'s ${move.name} should be in order from newest to oldest gen`);
						if (learnedGen === prevLearnedGen) {
							assert(learnedTypeIndex >= prevLearnedTypeIndex, `Learn method "${learned}" for ${species.name}'s ${move.name} should be in MTLREVDSC order`);
						}
						prevLearnedGen = learnedGen;
						prevLearnedTypeIndex = learnedTypeIndex;

						switch (learned.charAt(1)) {
						case 'L':
							assert(/^[0-9]+$/.test(learned.slice(2)), `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid: a level-up move should have the level`);
							const level = parseInt(learned.slice(2));
							assert(level >= 0 && level <= 100, `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid: level should be between 0 and 100`);
							break;
						case 'S':
							assert(/^[0-9]+$/.test(learned.slice(2)), `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid: an event move should have the event number`);
							const eventNum = parseInt(learned.slice(2));
							const eventEntry = entry.eventData[eventNum];
							assert(eventEntry, `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid: an event move's event number should be available in entry.eventData`);
							assert(eventEntry.moves.includes(moveid), `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid: an event move's event entry should include that move`);
							break;
						default:
							assert.equal(learned, learned.slice(0, 2), `Learn method "${learned}" for ${species.name}'s ${move.name} is invalid: it should be 2 characters long`);
							break;
						}
					}
				}

				if (entry.eventData) {
					for (const [i, eventEntry] of entry.eventData.entries()) {
						if (eventEntry.moves) {
							const learned = `${eventEntry.generation}S${i}`;
							for (const eventMove of eventEntry.moves) {
								if (speciesid.startsWith('pokestar')) {
									assert(Dex.data.Moves[eventMove], `${species.name}'s event move ${Dex.moves.get(eventMove).name} should exist`);
									continue;
								}
								assert.equal(eventMove, toID(eventMove), `${species.name}'s event move "${eventMove}" must be an ID`);
								assert(entry.learnset, `${species.name} has event moves but no learnset`);
								const effectiveMod = ['gen8bdsp', 'gen8legends', 'gen9legends'].includes(mod.currentMod) ? mod.currentMod : undefined;
								if (eventEntry.source === effectiveMod) assert(entry.learnset[eventMove]?.includes(learned), `${species.name}'s event move ${Dex.moves.get(eventMove).name} should exist as "${learned}"`);
							}
						}
					}
				}
			}
		}
	});

	// Existence function takes a Pokemon and returns yes if it exists and no otherwise
	// can be override for testing CAPs
	function countPokemon(dex, existenceFunction = s => s.exists && !s.isNonstandard && s.tier !== 'Illegal') {
		const count = { species: 0, formes: 0 };
		for (const pkmn of dex.species.all()) {
			if (!existenceFunction(pkmn)) continue;
			if (pkmn.isCosmeticForme) continue;
			if (pkmn.name !== pkmn.baseSpecies) {
				count.formes++;
			} else {
				count.species++;
			}
		}

		return count;
	}

	// Source: https://github.com/pkmn/ps/blob/main/dex/index.test.ts#L283-L326
	// key = gen #, value = number of formes/species in that gen
	const species = {
		1: 151,
		2: 251,
		3: 386,
		4: 493,
		5: 649,
		6: 721,
		7: 807,
		8: 664,
		9: 733,
	};
	const formes = {
		// Gens 1 and 2 have no alternate formes
		1: 0,
		2: 0,
		3: 3 + 3, // Deoxys (3) + Castform (3)
	};
	// Wormadam (2) + Cherrim (1) + Arceus (16) + Pichu (1) +
	// Rotom (5) + Giratina (1) + Shaymin (1)
	formes[4] = formes[3] + 2 + 1 + 16 + 1 + 5 + 1 + 1;
	// Basculin (1) + Darmanitan (1) + *-Therian (3) + Keldeo (1) +
	// Kyurem (2) + Meloetta (1) + Genesect (4) - Pichu (1)
	formes[5] = formes[4] + 1 + 1 + 3 + 1 + 2 + 1 + 4 - 1;
	// Arceus (1) + Vivillon (2) + Meowstic (1) + Primal (2) +
	// Aegislash (1) + Pumpkaboo (3) + Gourgeist (3) + Hoopa (1) +
	// Pikachu (6) + Mega (48) [Floette (1)]
	formes[6] = formes[5] + 1 + 2 + 1 + 2 + 1 + 3 + 3 + 1 + 6 + 48;
	// Alola (18) + Totem (12) + Pikachu (7) - Pikachu (6) + Greninja (2) + Zygarde (2) +
	// Oricorio (3) + Rockruff (1) + Lycanroc (2) + Wishiwashi (1) + Silvally (17) + Minior (1) +
	// Mimikyu (1) + Necrozma (3) [Magearna (1) + LGPE Starters/Meltan/Melmetal (4)]
	formes[7] = formes[6] + 18 + 12 + 7 - 6 + 2 + 2 + 3 + 1 + 2 + 1 + 17 + 1 + 1 + 3;
	// Silvally (17) + Rotom (5) + Basculin (1) + Meowstic (1) +
	// Aegislash (1) + Pumpkaboo (3) + Gourgeist (3) + Pikachu (7) + Galar (14) +
	// Alola (8) + Indeedee (1) + Morpeko (1) + Eiscue (1) + Zacian/Zamazenta (2) +
	// Toxtricity (1) + Cramorant (2) + Necrozma (2) + Mimikyu (2) + Wishiwashi (1) +
	// Keldeo (1) + Kyruem (2) + Darmanitan (2) + Cherrim (1)
	// {DLC1} Alola (4) + Galar (1) + Magearna (1) + Urshifu (1) +
	// Rockruff (1) + Lycanroc (2) + [Pikachu (1) + Zarude (1)]
	// {DLC2} Giratina (1) + *-Therian (3) + Genesect (4) + Zygarde (2) +
	// Birds (3) + Slowking (1) + Calyrex (2)
	// {GMax} 26 + 7
	formes[8] = 17 + 5 + 1 + 1 + 1 + 3 + 3 + 7 + 14 + 8 +
		1 + 1 + 1 + 2 + 1 + 2 + 2 + 2 + 1 + 1 + 2 + 2 + 1 +
		(4 + 1 + 1 + 1 + 1 + 2 + (1 + 1)) + (1 + 3 + 4 + 2 + 3 + 1 + 2);
	// Pikachu (8) + Origin (3) + Therian (4) + Alola (16) + Galar (7) + Paldea (4) + Hisui (16) +
	// Deoxys (3) + Rotom (5) + Shaymin (1) + Arceus (17) + Basculin (2) + Kyurem (2) + Keldeo (1) +
	// Meloetta (1) + Greninja (1) + Vivillon (2) + Meowstic (1) + Hoopa (1) + Oricorio (3) + Rockruff (1) +
	// Lycanroc (2) + Minior (1) + Mimikyu (1) + Necrozma (2) + Magearna (1) + Toxtricity (1) +
	// Antique (2) + Eiscue (1) + Indeedee (1) + Cramorant (2) + Morpeko (1) + Crowned (2) +
	// Urshifu (1) + Zarude (1) + Calyrex (2) + Oinkologne (1) + Ursaluna (1) + Dudunsparce (1) +
	// Palafin (1) + Maushold (1) + Squawkabilly (3) + Gimmighoul (1) + Basculegion (1) +
	// Masterpiece (2) + Ogerpon (7) + Terapagos (2)
	formes[9] = 8 + 3 + 4 + 16 + 7 + 4 + 16 + 3 + 5 + 1 + 17 +
		2 + 2 + 1 + 1 + 1 + 2 + 1 + 1 + 3 + 1 + 2 + 1 + 1 + 2 +
		1 + 1 + 2 + 1 + 1 + 2 + 1 + 2 + 1 + 1 + 1 + 2 + 1 + 1 +
		1 + 1 + 3 + 1 + 1 + 2 + 7 + 2;

	for (const gen of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
		it(`Gen ${gen} should have ${species[gen]} species and ${formes[gen]} formes`, () => {
			const count = countPokemon(Dex.forGen(gen));
			assert.equal(count.species, species[gen]);
			assert.equal(count.formes, formes[gen]);
		});
	}

	species['gen7letsgo'] = species[1] + 2; // Meltan + Melmetal
	formes['gen7letsgo'] = 15 + 18 + 2; // Mega (15) + Alola (18) + Starter (2)
	species['gen8bdsp'] = species[4];
	formes['gen8bdsp'] = formes[4] + 1 - 1; // Arceus (1) - Pichu (1)
	species['gen8legends'] = 242 - 16 + 1 - 1; // - Hisui (16) + Sneasel (1) - Basculin (1)
	// Vulpix (1) + Ninetales (1) + Wormadam (2) + Cherrim (1) + Rotom (5) + Origin (3) + Arceus (17) +
	// Shaymin (1) + Therian (4) + Hisui (16) + Basculin (1) + Basculegion (1)
	formes['gen8legends'] = 1 + 1 + 2 + 1 + 5 + 3 + 17 + 1 + 4 + 16 + 1 + 1;
	species['gen9legends'] = 231;
	// Mega (65) + Vivillon (2) + Floette (1) + Meowstic (1) + Aegislash (1) + Pumpkaboo (3) + Gourgeist (3) +
	// Zygarde (2) + Alola (1) + Galar (4)
	formes['gen9legends'] = 65 + 2 + 1 + 1 + 1 + 3 + 3 + 2 + 1 + 4;

	for (const mod of ['gen7letsgo', 'gen8bdsp', 'gen8legends', 'gen9legends']) {
		it(`${mod} should have ${species[mod]} species and ${formes[mod]} formes`, () => {
			const existenceFunction = mod.includes('legends') ? s => s.exists && !s.isNonstandard : undefined;
			const count = countPokemon(Dex.mod(mod), existenceFunction);
			assert.equal(count.species, species[mod]);
			assert.equal(count.formes, formes[mod]);
		});
	}

	it('should never import', () => {
		const modNames = fs.readdirSync(`${__dirname}/../../dist/data/mods/`)
			.filter(mod => mod === toID(mod))
			// fine, SSB is allowed to; it's not an official format
			.filter(mod => mod !== 'gen9ssb');
		// console.log(modNames);
		const mods = ['data/', ...modNames.map(mod => `data/mods/${mod}/`)];
		const files = ['abilities.js', 'aliases.js', 'conditions.js', 'formats-data.js', 'items.js', 'learnsets.js', 'moves.js', 'natures.js', 'pokedex.js', 'pokemongo.js', 'rulesets.js', 'tags.js', 'typechart.js'];
		for (const mod of mods) {
			for (const file of files) {
				let contents;
				try {
					contents = fs.readFileSync(`${__dirname}/../../dist/${mod}${file}`, 'utf8');
					// console.log(`Checking ${mod}${file}`);
				} catch {
					// fine if the file doesn't exist
				}
				if (contents) {
					assert.false(
						/\brequire\(/.test(contents),
						`File ${mod}${file} should not import anything but types`
					);
				}
			}
		}
	});
});
