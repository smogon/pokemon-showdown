/**
 * Tests for Gen 8 randomized formats
 */
'use strict';

const {testSet, testNotBothMoves, testHasSTAB, testAlwaysHasMove} = require('./tools');
const assert = require('../assert');

describe('[Gen 8] Random Battle (slow)', () => {
	const options = {format: 'gen8randombattle'};
	const dataJSON = require(`../../dist/data/mods/gen8/random-data.json`);
	const dex = Dex.forFormat(options.format);
	const generator = Teams.getGenerator(options.format);

	it('All moves on all sets should be obtainable', () => {
		const rounds = 500;
		for (const pokemon of Object.keys(dataJSON)) {
			const species = dex.species.get(pokemon);
			const data = dataJSON[pokemon];
			if (!data.moves || species.isNonstandard) continue;
			const remainingMoves = new Set(data.moves);
			for (let i = 0; i < rounds; i++) {
				// Test lead 1/6 of the time
				const set = generator.randomSet(species, {}, i % 6 === 0);
				for (const move of set.moves) remainingMoves.delete(move);
				if (!remainingMoves.size) break;
			}
			assert.false(remainingMoves.size,
				`The following moves on ${species.name} are unused: ${[...remainingMoves].join(', ')}`);
		}
	});

	it('should not generate Golisopod without Bug STAB', () => {
		testSet('golisopod', options, set => {
			assert(set.moves.some(m => {
				const move = Dex.moves.get(m);
				return move.type === 'Bug' && move.category !== 'Status';
			}), `Golisopod should get Bug STAB (got ${set.moves})`);
		});
	});

	it('should not generate Stone Edge + Swords Dance Lucario', () => {
		testNotBothMoves('lucario', options, 'stoneedge', 'swordsdance');
	});

	it('should not generate Shift Gear + U-turn Genesect', () => {
		testNotBothMoves('Genesect', options, 'shiftgear', 'uturn');
	});

	it('should not generate Flame Charge + Flare Blitz Solgaleo', () => {
		testNotBothMoves('solgaleo', options, 'flamecharge', 'flareblitz');
	});

	it('should not generate Knock Off + Sucker Punch Toxicroak', () => {
		testNotBothMoves('toxicroak', options, 'knockoff', 'suckerpunch');
	});

	it('should not generate Swords Dance + Fire Blast Garchomp', () => {
		testNotBothMoves('garchomp', options, 'swordsdance', 'fireblast');
	});

	it('should give 4 Attacks Scyther a Choice Band', () => {
		testSet('scyther', options, set => {
			if (!set.moves.includes('roost') && !set.moves.includes('swordsdance')) {
				assert.equal(set.item, "Choice Band");
			}
		});
	});

	it('should give Solid Rock + Shell Smash Carracosta a Weakness Policy', () => {
		testSet('carracosta', options, set => {
			if (set.moves.includes('shellsmash') && set.ability === 'Solid Rock') {
				assert.equal(set.item, "Weakness Policy");
			}
		});
	});

	it('should not generate 3-attack Alcremie-Gmax', () => {
		testSet('alcremiegmax', options, set => assert(
			!['psychic', 'dazzlinggleam', 'mysticalfire'].every(move => set.moves.includes(move)),
			`Alcremie-Gmax should not get three attacks (got ${set.moves})`
		));
	});

	it('should always give Doublade Swords Dance', () => {
		testAlwaysHasMove('doublade', options, 'swordsdance');
	});

	it('Dragonite and Salamence should always get Outrage', () => {
		for (const pkmn of ['dragonite', 'salamence']) {
			testAlwaysHasMove(pkmn, options, 'outrage');
		}
	});

	it('should give Sticky Web Pokémon Sticky Web unless they have setup', () => {
		for (const pkmn of ['shuckle', 'orbeetle', 'araquanid']) {
			testSet(pkmn, options, set => {
				if (set.moves.some(move => Dex.moves.get(move).boosts)) return; // Setup
				assert(
					set.moves.includes('stickyweb'),
					`${pkmn} should always generate Sticky Web (generated moveset: ${set.moves})`
				);
				if (pkmn === 'shuckle') assert(set.moves.includes('stealthrock'));
			});
		}
	});

	it('should give Throat Spray to Shift Gear Toxtricity sets', () => {
		testSet('toxtricity', options, set => {
			if (!set.moves.includes('shiftgear')) return;
			assert.equal(set.item, "Throat Spray", `got ${set.item} instead of Throat Spray`);
		});
	});

	it('Toxapex should always have Scald', () => testAlwaysHasMove('toxapex', options, 'scald'));

	it('Shiinotic should always have Moonblast', () => testAlwaysHasMove('shiinotic', options, 'moonblast'));

	it('should prevent Dragon Dance and Extreme Speed from appearing together', () => {
		testNotBothMoves('dragonite', options, 'dragondance', 'extremespeed');
	});

	it('Rapidash with Swords Dance should have at least two attacks', () => {
		testSet('rapidash', options, set => {
			if (!set.moves.includes('swordsdance')) return;
			assert(set.moves.filter(m => dex.moves.get(m).category !== 'Status').length > 1, `got ${JSON.stringify(set.moves)}`);
		});
	});

	it('Celesteela should not get Leech Seed or Protect on Autotomize sets', () => {
		testNotBothMoves('celesteela', options, 'leechseed', 'autotomize');
		testNotBothMoves('celesteela', options, 'protect', 'autotomize');
	});

	it('Landorus-Therian should not get Fly and Stealth Rock on the same set', () => {
		testNotBothMoves('landorustherian', options, 'fly', 'stealthrock');
	});

	it('should give Scyther the correct item', () => {
		testSet('scyther', options, set => {
			let item;
			if (set.moves.every(move => Dex.moves.get(move).category !== 'Status')) {
				item = 'Choice Band';
			} else if (set.moves.includes('uturn')) {
				item = 'Heavy-Duty Boots';
			} else {
				// Test interface currently doesn't tell us if we're testing in the lead slot or not
				// But FTR it should be Eviolite if it's the lead, Boots otherwise
				return;
			}
			assert.equal(set.item, item, `set=${JSON.stringify(set)}`);
		});
	});

	it('should guarantee Poison STAB on all Grass/Poison types', function () {
		// This test takes more than 2000ms
		this.timeout(0);

		const pokemon = Object.keys(dataJSON)
			.filter(pkmn =>
				dataJSON[pkmn].moves &&
				dex.species.get(pkmn).types.includes('Grass') && dex.species.get(pkmn).types.includes('Poison'));
		for (const pkmn of pokemon) {
			testHasSTAB(pkmn, options, ['Poison']);
		}
	});

	it('should not allow Swords Dance + Dragon Dance Rayquaza', () => {
		testNotBothMoves('rayquaza', options, 'swordsdance', 'dragondance');
	});

	it('should not allow Extreme Speed + Dragon Dance Rayquaza', () => {
		testNotBothMoves('rayquaza', options, 'extremespeed', 'dragondance');
	});

	it('should not generate Noctowl with three attacks and Roost', () => {
		testSet('noctowl', options, set => {
			const attacks = set.moves.filter(m => dex.moves.get(m).category !== 'Status');
			assert(
				!(set.moves.includes('roost') && attacks.length === 3),
				`Noctowl should not get three attacks and Roost (got ${set.moves})`
			);
		});
	});

	it(`should minimize Chansey's attack stat`, () => {
		testSet('chansey', options, set => {
			const [atkIV, atkEV] = [set.ivs.atk, set.evs.atk];
			assert(atkIV === 0 && atkEV === 0, `Chansey should have minimum attack (Atk IV: ${atkIV}, Atk EV: ${atkEV})`);
		});
	});

	it('should always give Palossand Shore Up', () => testAlwaysHasMove('palossand', options, 'shoreup'));
	it('should always give Azumarill Aqua Jet', () => testAlwaysHasMove('azumarill', options, 'aquajet'));


	it('should forbid a certain Togekiss set', () => {
		testSet('togekiss', options, set => {
			assert.notDeepEqual(
				[...set.moves].sort(),
				['airslash', 'aurasphere', 'fireblast', 'roost'],
				`got ${set.moves}`
			);
		});
	});
});

describe('[Gen 8] Random Doubles Battle (slow)', () => {
	const options = {format: 'gen8randomdoublesbattle'};

	it('should never generate Melmetal without Body Press', () => {
		testSet('melmetal', options, set => {
			assert(set.moves.includes('bodypress'), `Melmetal should get Body Press (got ${set.moves})`);
		});
	});

	it('should enforce STAB on Pinsir, Pikachu, and Zygarde', () => {
		for (const pkmn of ['pinsir', 'pikachu', 'zygarde']) {
			testHasSTAB(pkmn, options);
		}
	});

	it('should give Galarian Darmanitan a Choice Item', () => {
		testSet('darmanitangalar', options, set => assert(set.item.startsWith('Choice ')));
	});

	it('should always give Urshifu-Rapid-Strike Surging Strikes', () => {
		testAlwaysHasMove('urshifurapidstrike', options, 'surgingstrikes');
	});

	it('should always give Urshifu Wicked Blow', () => {
		testAlwaysHasMove('urshifu', options, 'wickedblow');
	});

	it('should always give Flapple Ripen', () => {
		testSet('flapple', options, set => {
			assert.equal(set.ability, 'Ripen');
		});
	});
});

describe('[Gen 8] Random Battle (No Dmax) (slow)', () => {
	// No tests here yet!
	// This format is extremely new; this will be filled in later when I have to fix No Dmax bugs.

	// const options = {format: 'gen8randombattlenodmax', isDynamax: true};
});

describe('[Gen 8] Free-for-All Random Battle (slow)', () => {
	const options = {format: 'gen8freeforallrandombattle', isDoubles: true};

	it('should enforce STAB on Pinsir, Pikachu, and Zygarde', () => {
		for (const pkmn of ['pinsir', 'pikachu', 'zygarde']) {
			testHasSTAB(pkmn, options);
		}
	});
});

describe('[Gen 8 BDSP] Random Battle (slow)', () => {
	const options = {format: 'gen8bdsprandombattle'};
	const dataJSON = require(`../../dist/data/mods/gen8bdsp/random-data.json`);
	const dex = Dex.forFormat(options.format);

	const okToHaveChoiceMoves = ['switcheroo', 'trick', 'healingwish'];
	for (const pokemon of Object.keys(dataJSON)) {
		const species = dex.species.get(pokemon);
		const data = dataJSON[pokemon];
		if (!data.moves) continue;

		// Pokémon with Sniper should never have Scope Lens
		if (Object.values(species.abilities).includes('Sniper')) {
			it(`should never give ${species} Scope Lens if it has Sniper`, () => {
				testSet(species, options, set => {
					if (set.ability !== 'Sniper') return;
					assert.notEqual(set.item, 'Scope Lens', `got Scope Lens (set=${JSON.stringify(set)})`);
				});
			});
		}

		// Pokemon with Fake Out should not have Choice Items
		if (data.moves.includes('fakeout')) {
			it(`should not give ${species} a Choice Item if it has Fake Out`, () => {
				testSet(species, options, set => {
					if (!set.moves.includes('fakeout')) return;
					assert.doesNotMatch(set.item, /Choice /, `got Choice Item '${set.item}' on a Fake Out set (${set.moves})`);
				});
			});
		}

		if (species.id !== 'ditto') { // Ditto always wants Choice Scarf
			// This test is marked as slow because although each individual test is fairly fast to run,
			// ~500 tests are generated, so they can dramatically slow down the process of unit testing.
			it(`should not generate Choice items on ${species.name} sets with status moves, unless an item-switching move or Healing Wish is generated`, () => {
				testSet(species.id, {...options, rounds: 500}, set => {
					if (set.item.startsWith('Choice') && !okToHaveChoiceMoves.some(okMove => set.moves.includes(okMove))) {
						assert(set.moves.every(m => dex.moves.get(m).category !== 'Status'), `Choice item and status moves on set ${JSON.stringify(set)}`);
					}
				});
			});
		}
	}

	it('should give Tropius Harvest + Sitrus Berry', () => {
		testSet('tropius', options, set => {
			assert.equal(set.item, 'Sitrus Berry');
			assert.equal(set.ability, 'Harvest');
		});
	});

	it('should give Unown a Choice item', () => {
		testSet('unown', options, set => assert(set.item.startsWith('Choice')));
	});

	it('should give Toxic Orb to Gliscor and Zangoose', () => {
		testSet('gliscor', options, set => assert.equal(set.item, 'Toxic Orb'));
		testSet('zangoose', options, set => assert.equal(set.item, 'Toxic Orb', set.ability));
	});

	it('should not generate Power Herb + Solar Beam on Drought sets', () => {
		for (const species of ['ninetales', 'torkoal']) {
			testSet(species, options, set => {
				if (set.ability !== 'Drought') return;
				if (!set.moves.includes('solarbeam')) return;
				assert.notEqual(set.item, 'Power Herb', `${species} should not get Power Herb with Solar Beam + Drought`);
			});
		}
	});

	it('should not give Unown Leftovers', () => {
		testSet('unown', options, set => assert.notEqual(set.item, 'Leftovers'));
	});

	it('should always give Jumpluff Acrobatics', () => {
		testAlwaysHasMove('jumpluff', options, 'acrobatics');
	});

	it('should always give Smeargle Spore', () => {
		testAlwaysHasMove('smeargle', options, 'spore');
	});

	it('should give No Guard to Dynamic Punch Machamp', () => {
		testSet('machamp', options, set => {
			if (set.moves.includes('dynamicpunch')) assert.equal(set.ability, 'No Guard', set.moves);
		});
	});

	it('should not give Shell Smash Blastoise Roar', () => {
		testSet('blastoise', options, set => {
			if (set.moves.includes('roar')) {
				assert(!set.moves.includes('shellsmash'), `Blastoise has Roar and Shell Smash (${set.moves})`);
			}
		});
	});

	it('should always give Smeargle a Focus Sash', () => {
		testSet('smeargle', options, set => assert.equal(set.item, 'Focus Sash'));
	});

	it('should always give Shaymin-Sky Air Slash', () => testAlwaysHasMove('shayminsky', options, 'airslash'));

	it('should always give Hitmonlee Reckless', () => {
		testSet('hitmonlee', options, set => assert.equal(set.ability, 'Reckless'));
	});

	it('should always give Bibarel Simple', () => {
		testSet('bibarel', options, set => assert.equal(set.ability, 'Simple'));
	});

	it('should not give Breloom Focus Punch without Substitute', () => {
		testSet('breloom', options, set => {
			if (set.moves.includes('focuspunch')) assert(set.moves.includes('substitute'), `Breloom has Focus Punch and no Substitute (${set.moves})`);
		});
	});

	it('should never give Flygon Defog and Dragon Dance', () => {
		testSet('flygon', options, set => {
			if (set.moves.includes('defog')) {
				assert(!set.moves.includes('dragondance'), `Flygon has Defog and Dragon Dance (${set.moves})`);
			}
		});
	});

	for (const pokemon of ['arceussteel', 'empoleon']) {
		it(`should not give ${pokemon} Defog and Stealth Rock`, () => {
			testSet(pokemon, options, set => {
				if (set.moves.includes('defog')) {
					assert(!set.moves.includes('stealthrock'), `${pokemon} has Defog and Stealth Rock (${set.moves})`);
				}
			});
		});
	}

	it('should not give Magcargo Fire Blast and Lava Plume', () => {
		testSet('magcargo', options, set => {
			if (set.moves.includes('fireblast')) {
				assert(!set.moves.includes('lavaplume'), `Magcargo has Fire Blast and Lava Plume (${set.moves})`);
			}
		});
	});

	it('should not give Yanmega Protect + Tinted Lens', () => {
		testSet('yanmega', options, set => {
			if (set.moves.includes('protect')) {
				assert.notEqual(set.ability, 'Tinted Lens', `Yanmega has Protect and Tinted Lens (set=${JSON.stringify(set)})`);
			}
		});
	});

	for (const species of ['shaymin', 'shayminsky', 'phione']) {
		it(`should not give ${species} Chesto Berry`, () => {
			testSet(species, options, set => {
				assert.notEqual(set.item, 'Chesto Berry', `${species} has Chesto Berry`);
			});
		});
	}

	it('Ambipom should only get Switcheroo if it has a Choice item', () => {
		testSet('ambipom', options, set => {
			if (!set.moves.includes('switcheroo')) return;
			assert(set.item.startsWith('Choice'), `Ambipom has Switcheroo and no Choice item (set=${JSON.stringify(set)})`);
		});
	});

	it('should give Yanmega Tinted Lens when it has Choice Specs', () => {
		testSet('yanmega', options, set => {
			if (set.item !== 'Choice Specs') return;
			assert.equal(set.ability, 'Tinted Lens', `Yanmega has Protect and no Tinted Lens (set=${JSON.stringify(set)})`);
		});
	});

	it('should give Yanmega Speed Boost if it has Protect', () => {
		testSet('yanmega', options, set => {
			if (!set.moves.includes('protect')) return;
			assert.equal(set.ability, 'Speed Boost', `Yanmega has Protect and no Speed Boost (set=${JSON.stringify(set)})`);
		});
	});
});
