'use strict';

const assert = require('../../assert');

describe('Team Validator', () => {
	it("should allow Shedinja to take exactly one level-up move from Ninjask in gen 3-4", () => {
		let team = [
			{ species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen4ou');

		team = [
			{ species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'batonpass'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen31v1');

		team = [
			{ species: 'shedinja', ability: 'wonderguard', moves: ['silverwind', 'swordsdance', 'batonpass'], evs: { hp: 1 } },
			{ species: 'charmander', ability: 'blaze', moves: ['flareblitz', 'dragondance'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen4ou');
	});

	it('should correctly enforce levels on Pokémon with unusual encounters in RBY', () => {
		const team = [
			{ species: 'dragonair', level: 15, moves: ['dragonrage'], evs: { hp: 1 } },
			{ species: 'electrode', level: 15, moves: ['thunderbolt'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen1ou');
	});

	it('should correctly enforce per-game evolution restrictions', () => {
		let team = [
			{ species: 'raichualola', ability: 'surgesurfer', moves: ['doublekick'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');

		team = [
			{ species: 'raichualola', ability: 'surgesurfer', moves: ['sing', 'fakeout'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes@@@minsourcegen=8');

		team = [
			{ species: 'exeggutoralola', ability: 'frisk', moves: ['psybeam'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8anythinggoes');

		// This works in Gen 9+ because of Mirror Herb
		team = [
			{ species: 'raichualola', ability: 'surgesurfer', moves: ['fakeout'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9anythinggoes');
	});

	it('should prevent Pokemon that don\'t evolve via level-up and evolve from a Pokemon that does evolve via level-up from being underleveled.', () => {
		const team = [
			{ species: 'nidoking', level: 1, ability: 'sheerforce', moves: ['earthpower'], evs: { hp: 1 } },
			{ species: 'mamoswine', level: 1, ability: 'oblivious', moves: ['earthquake'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7anythinggoes');
	});

	it('should require Pokémon transferred from Gens 1 and 2 to be above Level 2', () => {
		const team = [
			{ species: 'pidgey', level: 1, ability: 'bigpecks', moves: ['curse'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou');

		team[0].level = 2;
		assert.false.legalTeam(team, 'gen7ou');

		team[0].level = 3;
		assert.legalTeam(team, 'gen7ou');
	});

	it('should enforce Gen 1 minimum levels', () => {
		let team = [
			{ species: 'onix', level: 12, moves: ['headbutt'] },
		];
		assert.false.legalTeam(team, 'gen1ou');

		assert.legalTeam(team, 'gen2ou');

		team = [
			{ species: 'slowbro', level: 15, moves: ['earthquake'] },
			{ species: 'voltorb', level: 14, moves: ['thunderbolt'] },
			{ species: 'scyther', level: 15, moves: ['quickattack'] },
			{ species: 'pinsir', level: 15, moves: ['visegrip'] },
		];

		assert.legalTeam(team, 'gen1ou');
	});

	it('should correctly enforce Shell Smash as a sketched move for Necturna prior to Gen 9', () => {
		const team = [
			{ species: 'necturna', ability: 'forewarn', moves: ['shellsmash', 'vcreate'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen8cap');
	});

	it("should prevent Pokemon from having a Gen 3 tutor move and a Gen 4 ability together without evolving", () => {
		let team = [
			{ species: 'hitmonchan', ability: 'ironfist', moves: ['dynamicpunch'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen4ou');

		// Clefairy can learn Softboiled and evolve into Magic Guard Clefable
		team = [
			{ species: 'clefable', ability: 'magicguard', moves: ['softboiled'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen4ou');
	});

	// Based on research by Anubis: https://www.smogon.com/forums/posts/9713378
	describe(`Hackmons formes`, () => {
		it(`should reject battle-only formes in Gen 9, even in Hackmons`, () => {
			const team = [
				{ species: 'palafinhero', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'zamazentacrowned', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should also reject battle-only dexited formes in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'zygardecomplete', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'darmanitangalarzen', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'eternatuseternamax', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should not allow Xerneas with a hacked Ability in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'xerneasneutral', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should allow various other hacked formes in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'giratinaorigin', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'calyrexshadow', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'greninjaash', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'gengarmega', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'groudonprimal', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'necrozmaultra', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, 'gen9purehackmons');
		});

		it(`should not allow old gen-exclusive formes in Gen 9 Hackmons`, () => {
			let team = [
				{ species: 'pikachucosplay', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');

			team = [
				{ species: 'pichuspikyeared', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');

			team = [
				{ species: 'pokestarsmeargle', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should not allow CAP Pokemon in Gen 9 Hackmons`, () => {
			const team = [
				{ species: 'hemogoblin', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.false.legalTeam(team, 'gen9purehackmons');
		});

		it(`should allow battle-only formes in Hackmons before Gen 9`, () => {
			const team = [
				{ species: 'zamazentacrowned', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
				{ species: 'zygardecomplete', ability: 'steadfast', moves: ['watergun'], evs: { hp: 1 } },
			];
			assert.legalTeam(team, 'gen8customgame@@@-Nonexistent');
		});
	});

	it('should allow various (underleveled) from Pokemon GO', () => {
		const team = [
			{ species: 'mewtwo', level: 20, ability: 'pressure', moves: ['agility'], evs: { hp: 1 }, ivs: { hp: 1, atk: 1, def: 1, spa: 1, spd: 1 } },
			{ species: 'donphan', level: 1, ability: 'sturdy', moves: ['endeavor'] },
			{ species: 'mew', shiny: true, level: 15, ability: 'synchronize', moves: ['pound'], evs: { hp: 1 } },
			{ species: 'uxie', level: 1, ability: 'levitate', moves: ['acrobatics'] },
			{ species: 'zacian', ability: 'intrepidsword', moves: ['agility'], evs: { hp: 1 } },
			{ species: 'volcarona', level: 2, ability: 'flamebody', moves: ['acrobatics'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9ubers');
	});

	it('should disallow Pokemon from Pokemon GO knowing incompatible moves', () => {
		const team = [
			{ species: 'mew', shiny: true, level: 15, ability: 'synchronize', moves: ['aircutter'], evs: { hp: 1 }, ivs: { hp: 21, atk: 31, def: 21, spa: 21, spd: 31, spe: 0 } },
		];
		assert.false.legalTeam(team, 'gen8ou');
	});

	it('should check for legal combinations of prevo/evo-exclusive moves', () => {
		let team = [
			{ species: 'slowking', ability: 'oblivious', moves: ['counter', 'slackoff'], evs: { hp: 1 } },
		];
		assert.false.legalTeam(team, 'gen7ou');

		team = [
			{ species: 'incineroar', ability: 'blaze', moves: ['knockoff', 'partingshot'], evs: { hp: 1 } },
			{ species: 'shelloseast', ability: 'stickyhold', moves: ['infestation', 'stringshot'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen8ou');
	});

	// Sometimes a Pokemon gets marked as NDZU or some such nonexistent tier on accident, resulting in it not being covered by the banlist.
	it('should should validate exactly as many species as are in the unbanlist for 35 Pokes', () => {
		const formatid = 'gen9nationaldex35pokes';

		const format = Dex.formats.get(formatid);
		if (!format.exists) return;

		const ruleTable = Dex.formats.getRuleTable(format);

		// not using Dex.formats.isPokemonRule here because that includes '+pokemontag:unobtainable' and '+pokemontag:past'
		const allowed = Array.from(ruleTable)
			.map(([rule, source]) => (
				// For basepokemon unbans, count all non-cosmetic formes including base forme
				rule.startsWith('+basepokemon:') ? 1 + (Dex.species.get(rule.slice(13)).otherFormes?.length ?? 0) :
				// For pokemon unbans, count only if not already unbanned via a basepokemon unban
				(rule.startsWith('+pokemon:') && !ruleTable.has(`+basepokemon:${toID(Dex.species.get(rule.slice(9)).baseSpecies)}`)) ? 1 : 0
			))
			.reduce((x, y) => x + y);

		// Dex.species.all skips over cosmetic formes
		const accepted = Dex.species.all().filter(species => !(
			// ruleTable.isBannedSpecies blind spots
			species.natDexTier === 'Illegal' || species.isNonstandard === 'CAP'
		) && !ruleTable.isBannedSpecies(species)).length;

		assert.equal(accepted, allowed);
	});

	it('should allow moves learned via HOME relearner', () => {
		const team = [
			{ species: 'bronzor', level: 1, ability: 'levitate', moves: ['hypnosis'] },
			{ species: 'porygon', level: 25, ability: 'trace', moves: ['triattack'], evs: { hp: 1 } },
			// Darkrai from Pokemon GO with Dream Eater learned via BDSP TM
			{ species: 'darkrai', level: 15, ability: 'baddreams', moves: ['dreameater'], evs: { hp: 1 } },
			{ species: 'phione', level: 46, ability: 'hydration', moves: ['takeheart'], evs: { hp: 1 } },
		];
		assert.legalTeam(team, 'gen9ubers');
	});
});
