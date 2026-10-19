'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Evolution', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cause mega ability to affect the order of the turn in which it happens', () => {
		battle = common.createBattle([[
			{ species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup'] },
		], [
			{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] },
		]]);
		const pranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(pranksterMega, 'spa', 0);
	});

	it('should cause an ability copied with Trace by a mega to affect the order of the turn in which it happens', () => {
		battle = common.createBattle([[
			{ species: "Politoed", ability: 'drizzle', item: '', moves: ['scald'] },
			{ species: "Kingdra", ability: 'swiftswim', item: '', moves: ['dragondance'] },
		], [
			{ species: "Marowak", ability: 'rockhead', item: '', moves: ['earthquake'] },
			{ species: "Alakazam", ability: 'magicguard', item: 'alakazite', moves: ['psychup'] },
		]]);
		battle.makeChoices('switch 2', 'switch 2');
		battle.makeChoices('move dragondance', 'move psychup mega');
		assert.statStage(battle.p1.active[0], 'atk', 1);
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert.species(battle.p2.active[0], 'Alakazam-Mega');
	});

	it('should cause base ability to not affect the order of the turn in which it happens', () => {
		battle = common.createBattle([[
			{ species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup'] },
		], [
			{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] },
		]]);
		const noPranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(noPranksterMega, 'spa', 1);
	});

	it('should cause mega forme speed to decide turn order', () => {
		battle = common.createBattle([[
			{ species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor'] },
		], [
			{ species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock'] },
		]]);
		const fastBase = battle.p2.active[0];
		battle.makeChoices('move xscissor mega', 'move psyshock');
		assert.fainted(fastBase);
	});

	it('should cause ultra forme speed to decide turn order', () => {
		battle = common.createBattle([[
			{ species: 'Necrozma-Dusk-Mane', ability: 'swarm', item: 'ultranecroziumz', moves: ['xscissor'] },
		], [
			{ species: 'Hoopa-Unbound', ability: 'magician', moves: ['darkpulse'] },
		]]);
		const fastBase = battle.p2.active[0];
		battle.makeChoices('move xscissor ultra', 'move darkpulse');
		assert.equal(fastBase.hp, 0);
	});
});

describe('Mega Evolution [Gen 6]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not cause mega ability to affect the order of the turn in which it happens', () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup'] },
		], [
			{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] },
		]]);
		const pranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(pranksterMega, 'spa', 1);
	});

	it('should not cause an ability copied with Trace by a mega to affect the order of the turn in which it happens', () => {
		battle = common.gen(6).createBattle([[
			{ species: "Politoed", ability: 'drizzle', item: '', moves: ['scald'] },
			{ species: "Kingdra", ability: 'swiftswim', item: '', moves: ['dragondance'] },
		], [
			{ species: "Marowak", ability: 'rockhead', item: '', moves: ['earthquake'] },
			{ species: "Alakazam", ability: 'magicguard', item: 'alakazite', moves: ['psychup'] },
		]]);
		battle.makeChoices('switch 2', 'switch 2');
		battle.makeChoices('move dragondance', 'move psychup mega');
		assert.statStage(battle.p1.active[0], 'atk', 1);
		assert.statStage(battle.p2.active[0], 'atk', 1);
		assert.species(battle.p2.active[0], 'Alakazam-Mega');
	});

	it('should cause base ability to affect the order of the turn in which it happens', () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup'] },
		], [
			{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] },
		]]);
		const noPranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(noPranksterMega, 'spa', 0);
	});

	it('should cause base forme speed to decide turn order', () => {
		battle = common.gen(6).createBattle([[
			{ species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor'] },
		], [
			{ species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock'] },
		]]);
		const fastMega = battle.p1.active[0];
		battle.makeChoices('move xscissor mega', 'move psyshock');
		assert.fainted(fastMega);
	});
});

describe('Pokemon Speed', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should update dynamically in Gen 8', () => {
		const p1team = [
			{ species: 'Ludicolo', ability: 'swiftswim', moves: ['scald'], evs: { spe: 100 } }, // 201 Speed
			{ species: 'Appletun', ability: 'ripen', moves: ['sleeptalk'] }, // To be switched out
			{ species: 'Pelipper', ability: 'drizzle', moves: ['sleeptalk'] }, // Will set rain on switch in
		];
		const p2team = [
			{ species: 'Accelgor', ability: 'hydration', moves: ['bugbuzz'], evs: { spe: 156 }, nature: 'Timid' }, // 401 Speed
			{ species: 'Aegislash', ability: 'stancechange', moves: ['sleeptalk'] }, // Does nothing but fill a slot
		];
		battle = common.createBattle({ gameType: 'doubles' }, [p1team, p2team]);

		// Set ludicolo's and accelgor's HP to 1.
		battle.p1.pokemon[0].sethp(1); // Ludicolo
		battle.p2.pokemon[0].sethp(1); // Accelgor

		battle.makeChoices('move scald 1, switch 3', 'move bugbuzz 1, auto');
		assert.fainted(battle.p2.pokemon[0]); // Accelgor should be fainted
	});

	it('should NOT update dynamically in Gen 7', () => {
		const p1team = [
			{ species: 'Ludicolo', ability: 'swiftswim', moves: ['scald'], evs: { spe: 100 } }, // 201 Speed
			{ species: 'Appletun', ability: 'ripen', moves: ['sleeptalk'] }, // To be switched out
			{ species: 'Pelipper', ability: 'drizzle', moves: ['sleeptalk'] }, // Will set rain on switch in
		];
		const p2team = [
			{ species: 'Accelgor', ability: 'hydration', moves: ['bugbuzz'], evs: { spe: 156 }, nature: 'Timid' }, // 401 Speed
			{ species: 'Aegislash', ability: 'stancechange', moves: ['sleeptalk'] }, // Does nothing but fill a slot
		];
		battle = common.gen(7).createBattle({ gameType: 'doubles' }, [p1team, p2team]);

		// Set ludicolo's and accelgor's HP to 1.
		battle.p1.pokemon[0].sethp(1); // Ludicolo
		battle.p2.pokemon[0].sethp(1); // Accelgor

		battle.makeChoices('move scald 1, switch 3', 'move bugbuzz 1, auto');
		assert.fainted(battle.p1.pokemon[0]); // Ludicolo should be fainted
	});
});

describe('Switching out', () => {
	it('should happen in order of switch-out\'s Speed stat', () => {
		const p1team = [
			{ species: 'Accelgor', ability: 'runaway', moves: ['sleeptalk'] },
			{ species: 'Shuckle', ability: 'intimidate', moves: ['sleeptalk'] },
		];
		const p2team = [
			{ species: 'Durant', ability: 'runaway', moves: ['sleeptalk'] },
			{ species: 'Barraskewda', ability: 'runaway', moves: ['sleeptalk'] },
		];
		battle = common.createBattle([p1team, p2team]);

		battle.makeChoices('switch 2', 'switch 2');
		assert.equal(battle.p2.pokemon[0].boosts.atk, 0);
	});
});

describe('Switching in', () => {
	it(`should trigger events in an order determined by what each Pokemon's speed was when they switched in`, () => {
		battle = common.gen(7).createBattle([[
			{ species: "ribombee", moves: ['stickyweb'] },
			{ species: "groudon", item: 'redorb', moves: ['sleeptalk'], evs: { spe: 0 } },
		], [
			{ species: "golemalola", ability: 'galvanize', moves: ['explosion'] },
			{ species: "kyogre", item: 'blueorb', moves: ['sleeptalk'], evs: { spe: 252 } },
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'switch 2');
		const kyogre = battle.p2.active[0];
		assert.statStage(kyogre, 'spe', -1);
		assert.equal(battle.field.weather, 'desolateland', 'Groudon should have reverted after Kyogre in spite of Sticky Web because it was slower before the SwitchIn event started');
	});

	describe('[Gen 4]', () => {
		it(`should request one switch per side at a time`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: "alakazam", level: 100, moves: ['spikes'] },
				{ species: "alakazam", level: 98, moves: ['sleeptalk'] },
				{ species: "groudon", ability: 'drought', moves: ['sleeptalk'] },
				{ species: "weavile", moves: ['sleeptalk'] },
			], [
				{ species: "alakazam", level: 99, moves: ['sleeptalk'] },
				{ species: "alakazam", level: 97, moves: ['explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "gardevoir", moves: ['sleeptalk'] },
				{ species: "azumarill", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('switch 3', 'switch 3');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');
			assert.equal(battle.field.weather, '');

			battle.makeChoices('switch 4', 'switch 4');
			assert.equal(battle.p1.requestState, '');
			assert(battle.p1.activeRequest.wait);
			assert.equal(battle.p2.requestState, 'switch');
			assert.equal(battle.field.weather, '');

			battle.makeChoices('', 'switch 5');
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
			assert.equal(battle.field.weather, 'sunnyday');
		});

		it(`should finish each doubles replacement batch before requesting the next and defer entry abilities`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: "alakazam", moves: ['spikes', 'splash'] },
				{ species: "abra", level: 1, moves: ['splash'] },
				{ species: "shedinja", evs: { spe: 252 }, moves: ['splash'] },
				{ species: "vaporeon", moves: ['splash'] },
				{ species: "espeon", moves: ['splash'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'explosion'] },
				{ species: "magikarp", level: 1, moves: ['splash'] },
				{ species: "tyranitar", ability: 'sandstream', moves: ['splash'] },
				{ species: "dusknoir", moves: ['splash'] },
			]]);
			battle.makeChoices('move spikes, move splash', 'move spikes, move splash');
			battle.makeChoices('move splash, move splash', 'move explosion, move splash');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');

			// Both left slots enter; Shedinja faints, so only Player 2 advances to the right slot.
			battle.makeChoices('switch 3', 'switch 3');
			assert.species(battle.p1.active[0], 'Shedinja');
			assert.fainted(battle.p1.active[0]);
			assert.species(battle.p1.active[1], 'Abra');
			assert.species(battle.p2.active[0], 'Tyranitar');
			assert.species(battle.p2.active[1], 'Magikarp');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');
			assert.equal(battle.field.weather, '');

			// Both entrants must arrive before Player 1 is asked to fill its right slot.
			battle.makeChoices('switch 4', 'switch 4');
			assert.species(battle.p1.active[0], 'Vaporeon');
			assert.species(battle.p1.active[1], 'Abra');
			assert.species(battle.p2.active[1], 'Dusknoir');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, '');
			assert(battle.p2.activeRequest.wait);
			assert.equal(battle.field.weather, '');

			battle.makeChoices('switch 5', '');
			assert.species(battle.p1.active[1], 'Espeon');
			assert.equal(battle.field.weather, 'sandstorm');
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
		});
	});

	describe('[Gen 3]', () => {
		it(`should make an instant switch request if a Pokemon faints during switch-in`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "alakazam", level: 99, moves: ['spikes'] },
				{ species: "alakazam", level: 97, moves: ['explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "castform", ability: 'forecast', moves: ['sleeptalk'] },
				{ species: "groudon", ability: 'drought', moves: ['sleeptalk'] },
			], [
				{ species: "alakazam", level: 100, moves: ['spikes'] },
				{ species: "alakazam", level: 98, moves: ['sleeptalk'] },
				{ species: "kyogre", ability: 'drizzle', moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "gyarados", ability: 'intimidate', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('switch 3, switch 4', 'switch 3, switch 4'); // Switch-in Kyogre
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, '');
			assert(battle.p2.activeRequest.wait);
			assert.equal(battle.field.weather, 'raindance');

			assert.throws(() => battle.choose('p1', 'switch 4'));
			assert.throws(() => battle.choose('p1', 'switch 5, switch 6'));
			assert.throws(() => battle.choose('p2', 'auto'));
			battle.makeChoices('switch 5'); // Switch-in Castform
			assert.equal(battle.p1.requestState, '');
			assert(battle.p1.activeRequest.wait);
			assert.equal(battle.p2.requestState, 'switch');
			assert.species(battle.p1.active[0], 'Castform-Rainy');

			battle.makeChoices('', 'switch 5'); // Switch-in Gyarados
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, '');
			assert(battle.p2.activeRequest.wait);

			battle.makeChoices('switch 6'); // Switch-in Groudon
			assert.equal(battle.field.weather, 'sunnyday');
			assert.species(battle.p1.active[0], 'Castform-Sunny');
			assert.equal(battle.p1.active[0].boosts.atk, -1);
			assert.equal(battle.p1.active[1].boosts.atk, -1);
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
		});

		it(`should make an instant switch request if a Pokemon faints during switch-in`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "alakazam", moves: ['sleeptalk'] },
				{ species: "alakazam", moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "groudon", ability: 'drought', moves: ['sleeptalk'] },
			], [
				{ species: "alakazam", level: 99, moves: ['spikes'] },
				{ species: "alakazam", moves: ['sleeptalk'] },
				{ species: "kyogre", ability: 'drizzle', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');

			battle.makeChoices('switch 3, move 1', 'switch 3, move 1');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, '');
			assert(battle.p2.activeRequest.wait);
			assert.equal(battle.field.weather, '');

			battle.makeChoices('switch 4');
			assert.equal(battle.field.weather, 'raindance');
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
		});

		it(`should not send a switch request if the only available pokemon are queued`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "alakazam", level: 99, moves: ['spikes'] },
				{ species: "alakazam", level: 97, moves: ['explosion'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "snorlax", moves: ['sleeptalk'] },
			], [
				{ species: "alakazam", level: 100, moves: ['spikes'] },
				{ species: "alakazam", level: 98, moves: ['sleeptalk'] },
				{ species: "kyogre", ability: 'drizzle', moves: ['sleeptalk'] },
				{ species: "gyarados", ability: 'intimidate', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			// Alakazams should all be fainted now
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('switch 3, switch 4', 'switch 3, switch 4');
			// Shedinja faints to Spikes, but the only available switch-in is Snorlax,
			// who is already queued to switch in
			assert.fainted(battle.p1.active[0]);
			assert.species(battle.p1.active[1], 'Snorlax');
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
		});

		it(`should finish replacements after Pursuit and Destiny Bond before activating Intimidate`, () => {
			battle = common.gen(3).createBattle([[
				{ species: "gastly", level: 1, moves: ['destinybond'] },
				{ species: "gyarados", ability: 'intimidate', moves: ['splash'] },
			], [
				{ species: "snorlax", moves: ['splash', 'pursuit'] },
				{ species: "machamp", ability: 'guts', moves: ['splash'] },
			]]);
			const gastly = battle.p1.active[0];
			const snorlax = battle.p2.active[0];
			battle.makeChoices('move destinybond', 'move splash');
			battle.makeChoices('switch 2', 'move pursuit');
			assert.fainted(gastly);
			assert.fainted(snorlax);
			assert.species(battle.p1.active[0], 'Gyarados');
			assert.equal(battle.p1.requestState, '');
			assert(battle.p1.activeRequest.wait);
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('', 'switch 2');
			assert.species(battle.p2.active[0], 'Machamp');
			assert.equal(battle.p2.active[0].boosts.atk, -1);
		});

		it(`should preserve pending Intimidate when a replacement faints to Spikes`, () => {
			battle = common.gen(3).createBattle([[
				{ species: "gastly", level: 1, moves: ['spikes', 'destinybond'] },
				{ species: "gyarados", ability: 'intimidate', moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['sleeptalk', 'pursuit'] },
				{ species: "shedinja", moves: ['sleeptalk'] },
				{ species: "machamp", ability: 'guts', moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move spikes', 'move sleeptalk');
			battle.makeChoices('move destinybond', 'move sleeptalk');
			battle.makeChoices('switch 2', 'move pursuit');
			assert.species(battle.p1.active[0], 'Gyarados');
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('', 'switch 2'); // Switch-in Shedinja
			assert.fainted(battle.p2.active[0]);
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('', 'switch 3'); // Switch-in Machamp
			assert.species(battle.p2.active[0], 'Machamp');
			assert.equal(battle.p2.active[0].boosts.atk, -1);
		});

		it(`should request one switch per side at a time when only one side has fainted Pokémon`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "alakazam", level: 1, moves: ['sleeptalk'] },
				{ species: "abra", level: 1, moves: ['sleeptalk'] },
				{ species: "shedinja", ability: 'intimidate', moves: ['sleeptalk'] },
				{ species: "hitmontop", ability: 'intimidate', moves: ['sleeptalk'] },
				{ species: "granbull", ability: 'intimidate', moves: ['sleeptalk'] },
			], [
				{ species: "forretress", moves: ['spikes', 'sleeptalk'] },
				{ species: "starmie", moves: ['sleeptalk', 'swift'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('auto', 'move sleeptalk, move swift');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.requestState, '');
			assert(battle.p2.activeRequest.wait);
			assert.throws(() => battle.choose('p1', 'switch 3, switch 4'));

			battle.makeChoices('switch 3'); // Switch-in Shedinja
			assert.species(battle.p1.active[0], 'Shedinja');
			assert.fainted(battle.p1.active[0]);
			assert.species(battle.p1.active[1], 'Abra');
			assert.fainted(battle.p1.active[1]);
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.active[0].boosts.atk, 0);
			assert.equal(battle.p2.active[1].boosts.atk, 0);

			battle.makeChoices('switch 4'); // Switch-in Hitmontop in the same slot
			assert.species(battle.p1.active[0], 'Hitmontop');
			assert.species(battle.p1.active[1], 'Abra');
			assert.equal(battle.p1.requestState, 'switch');
			assert.equal(battle.p2.active[0].boosts.atk, 0);
			assert.equal(battle.p2.active[1].boosts.atk, 0);

			battle.makeChoices('switch 5'); // Switch-in Granbull
			assert.species(battle.p1.active[1], 'Granbull');
			assert.equal(battle.p2.active[0].boosts.atk, -2);
			assert.equal(battle.p2.active[1].boosts.atk, -2);
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
		});

		it(`should still request replacements when the other side has no available switches`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "gengar", ability: 'levitate', moves: ['sleeptalk'] },
				{ species: "abra", level: 1, moves: ['sleeptalk'] },
			], [
				{ species: "abra", level: 1, moves: ['sleeptalk'] },
				{ species: "electrode", moves: ['explosion'] },
				{ species: "snorlax", moves: ['sleeptalk'] },
				{ species: "machamp", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			assert.fainted(battle.p1.active[1]);
			assert.fainted(battle.p2.active[0]);
			assert.fainted(battle.p2.active[1]);
			assert.equal(battle.p2.requestState, 'switch');
			assert.equal(battle.p1.requestState, '');
			assert(battle.p1.activeRequest.wait);

			battle.makeChoices('', 'switch 3'); // Switch-in Snorlax
			assert.species(battle.p2.active[0], 'Snorlax');
			assert.equal(battle.p2.requestState, 'switch');

			battle.makeChoices('', 'switch 4'); // Switch-in Machamp
			assert.species(battle.p2.active[1], 'Machamp');
			assert.equal(battle.p1.requestState, 'move');
			assert.equal(battle.p2.requestState, 'move');
		});
	});

	describe('[Gen 1]', () => {
		afterEach(() => battle.destroy());

		it(`should cancel the other switch and request a replacement after a switch-in faints to poison`, () => {
			battle = common.gen(1).createBattle({ forceRandomChance: true }, [[
				{ species: 'Snorlax', moves: ['splash'] },
				{ species: 'Alakazam', moves: ['splash'] },
			], [
				{ species: 'Slowbro', moves: ['toxic', 'splash'] },
				{ species: 'Chansey', moves: ['splash'] },
			]]);
			const snorlax = battle.p1.active[0];
			battle.makeChoices('move splash', 'move toxic');
			battle.makeChoices('switch alakazam', 'move splash');
			snorlax.hp = 1;

			// Alakazam switches out before Slowbro
			battle.makeChoices('switch snorlax', 'switch chansey');
			assert.fainted(snorlax);
			assert.species(battle.p2.active[0], 'Slowbro');
			assert.equal(battle.p1.requestState, 'switch');
			battle.makeChoices('switch alakazam', '');
			assert.species(battle.p1.active[0], 'Alakazam');
			assert.equal(battle.p1.requestState, 'move');
		});
	});
});

describe('Speed ties', () => {
	it('(slow) Perish Song faint order should be random', () => {
		const wins = { p1: 0, p2: 0 };
		for (let i = 0; i < 20; i++) {
			battle = common.createBattle({
				seed: [i, 2, 3, 4],
			}, [[
				{ species: "Politoed", moves: ['perishsong'] },
			], [
				{ species: "Politoed", moves: ['perishsong'] },
			]]);
			battle.makeChoices('auto', 'auto');
			battle.makeChoices('auto', 'auto');
			battle.makeChoices('auto', 'auto');
			battle.makeChoices('auto', 'auto');
			wins[battle.winner === 'Player 1' ? 'p1' : 'p2']++;
			if (wins.p1 && wins.p2) break;
		}
		assert(wins.p1);
		assert(wins.p2);
	});
});
