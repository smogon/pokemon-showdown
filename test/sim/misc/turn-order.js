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
		it(`should not choose more than one switch at a time`, () => {
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
	});

	describe('[Gen 2]', () => {
		it(`effects should be applied when the Pokemon enters the field, but fainting should only happen after all Pokemon have switched in`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "alakazam", moves: ['sleeptalk'] },
				{ species: "shedinja", moves: ['sleeptalk'] }, // I know Shedinja doesn't exist in Gen 2, bite me
				{ species: "cloyster", moves: ['sleeptalk'] },
			], [
				{ species: "snorlax", moves: ['spikes', 'selfdestruct'] },
				{ species: "tyranitar", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices();
			battle.makeChoices('auto', 'move selfdestruct');
			battle.makeChoices();
			assert.logOrder(battle, [
				'|-damage|p1a: Shedinja|0 fnt',
				'|switch|p2a: Tyranitar',
				'|faint|p1a: Shedinja',
			]);
		});
	});

	describe('Win checks', () => {
		describe('[Gen 4]', () => {
			it(`should finish a Pursuit-interrupted switch and its hazards before checking the outcome`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "alakazam", moves: ['spikes', 'pursuit'] },
				], [
					{ species: "gastly", level: 1, moves: ['destinybond'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move spikes', 'move destinybond');
				battle.makeChoices('move pursuit', 'switch 2');
				assert.logOrder(battle, [
					'|faint|p1a: Alakazam',
					'|switch|p2a: Shedinja',
					'|-damage|p2a: Shedinja|0 fnt|[from] Spikes',
					'|faint|p2a: Shedinja',
				]);
				assert(battle.ended);
				assert.equal(battle.winner, '');
			});

			it(`should check the outcome after one voluntary switch before executing the next`, () => {
				battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
					{ species: "shedinja", moves: ['destinybond'] },
					{ species: "shuckle", moves: ['sleeptalk'] },
					{ species: "pikachu", moves: ['sleeptalk'] },
					{ species: "eevee", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['sleeptalk', 'pursuit'] },
					{ species: "abra", level: 1, moves: ['explosion'] },
				]]);
				battle.makeChoices('move destinybond, move sleeptalk', 'move sleeptalk, move explosion');
				battle.makeChoices('switch 3, switch 4', 'move pursuit 1, pass');
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 1');
				assert.logOrder(battle, [
					'|faint|p2a: Snorlax',
					'|switch|p1a: Pikachu',
					'|win|Player 1',
				]);
				assert(!battle.getDebugLog().includes('|switch|p1b: Eevee'));
			});

			it(`should check the outcome before requesting a replacement batch`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "alakazam", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['explosion'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices();
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 2');
				assert(!battle.getDebugLog().includes('|switch|p2a: Shedinja'));
			});

			it(`should tie after both last replacements faint in the same batch`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "alakazam", moves: ['spikes', 'sleeptalk'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['spikes', 'explosion'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move spikes', 'move spikes');
				battle.makeChoices('move sleeptalk', 'move explosion');
				assert.equal(battle.p1.requestState, 'switch');
				assert.equal(battle.p2.requestState, 'switch');
				battle.makeChoices('switch 2', 'switch 2');
				assert.species(battle.p1.active[0], 'Shedinja');
				assert.species(battle.p2.active[0], 'Shedinja');
				assert.fainted(battle.p1.active[0]);
				assert.fainted(battle.p2.active[0]);
				assert(battle.ended);
				assert.equal(battle.winner, '');
			});

			it(`should finish the replacement batch before declaring a win when one side has reserves`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "alakazam", moves: ['spikes', 'sleeptalk'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['spikes', 'explosion'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
					{ species: "blissey", ability: 'drought', moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move spikes', 'move spikes');
				battle.makeChoices('move sleeptalk', 'move explosion');
				assert.equal(battle.p1.requestState, 'switch');
				assert.equal(battle.p2.requestState, 'switch');
				battle.makeChoices('switch 2', 'switch 2');
				assert.species(battle.p1.active[0], 'Shedinja');
				assert.species(battle.p2.active[0], 'Shedinja');
				assert.fainted(battle.p1.active[0]);
				assert.fainted(battle.p2.active[0]);
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 2');
			});

			it(`should finish the replacement batch without activating abilities before declaring a win`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "alakazam", moves: ['sleeptalk'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['spikes', 'explosion'] },
					{ species: "blissey", ability: 'drought', moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move sleeptalk', 'move spikes');
				battle.makeChoices('move sleeptalk', 'move explosion');
				assert.equal(battle.p1.requestState, 'switch');
				assert.equal(battle.p2.requestState, 'switch');
				battle.makeChoices('switch 2', 'switch 2');
				assert.species(battle.p1.active[0], 'Shedinja');
				assert.species(battle.p2.active[0], 'Blissey');
				assert.fainted(battle.p1.active[0]);
				assert.false.fainted(battle.p2.active[0]);
				assert.equal(battle.field.weather, '');
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 2');
			});

			it(`should activate the U-turn replacement's ability before checking the outcome`, () => {
				battle = common.gen(4).createBattle([[
					{ species: "crobat", moves: ['sleeptalk', 'uturn'] },
					{ species: "tyranitar", ability: 'sandstream', moves: ['sleeptalk'] },
				], [
					{ species: "steelix", item: 'lifeorb', moves: ['spikes', 'pursuit'] },
				]]);
				battle.makeChoices('move sleeptalk', 'move spikes');
				const crobat = battle.p1.active[0];
				const steelix = battle.p2.active[0];
				// Steelix survives the resisted U-turn, but cannot survive Life Orb recoil.
				steelix.hp = Math.floor(steelix.maxhp / 10);
				battle.makeChoices('move uturn', 'move pursuit');
				assert.false.fainted(crobat);
				assert(!steelix.fainted);
				battle.makeChoices('switch 2', '');
				assert.species(battle.p1.active[0], 'Tyranitar');
				assert.equal(battle.field.weather, 'sandstorm');
				assert(steelix.fainted);
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 1');
				assert.logOrder(battle, [
					'|switch|p1a: Tyranitar',
					'|faint|p2a: Steelix',
					'|-weather|Sandstorm|[from] ability: Sand Stream',
					'|win|Player 1',
				]);
			});
		});

		describe('[Gen 3]', () => {
			it(`should check the outcome after each replacement, before the other side switches in`, () => {
				battle = common.gen(3).createBattle([[
					{ species: "alakazam", moves: ['spikes', 'sleeptalk'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['spikes', 'explosion'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move spikes', 'move spikes');
				battle.makeChoices('move sleeptalk', 'move explosion');
				const secondReplacement = battle.p2.pokemon[1];
				battle.makeChoices('switch 2', 'switch 2');
				assert.species(battle.p1.active[0], 'Shedinja');
				assert.fainted(battle.p1.active[0]);
				assert.false.fainted(secondReplacement);
				assert(!battle.getDebugLog().includes('|switch|p2a: Shedinja'));
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 2');
			});

			it(`should finish a Pursuit-interrupted switch and its hazards before checking the outcome`, () => {
				battle = common.gen(3).createBattle([[
					{ species: "alakazam", moves: ['spikes', 'pursuit'] },
				], [
					{ species: "gastly", level: 1, moves: ['destinybond'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move spikes', 'move destinybond');
				battle.makeChoices('move pursuit', 'switch 2');
				assert.logOrder(battle, [
					'|faint|p1a: Alakazam',
					'|switch|p2a: Shedinja',
					'|-damage|p2a: Shedinja|0 fnt|[from] Spikes',
					'|faint|p2a: Shedinja',
				]);
				assert(battle.ended);
				assert.equal(battle.winner, '');
			});

			it(`should check the outcome after one voluntary switch before executing the next`, () => {
				battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
					{ species: "shedinja", moves: ['destinybond'] },
					{ species: "shuckle", moves: ['sleeptalk'] },
					{ species: "pikachu", moves: ['sleeptalk'] },
					{ species: "eevee", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['sleeptalk', 'pursuit'] },
					{ species: "abra", level: 1, moves: ['explosion'] },
				]]);
				battle.makeChoices('move destinybond, move sleeptalk', 'move sleeptalk, move explosion');
				battle.makeChoices('switch 3, switch 4', 'move pursuit 1, pass');
				assert(battle.ended);
				assert.equal(battle.winner, 'Player 1');
				assert.logOrder(battle, [
					'|faint|p2a: Snorlax',
					'|switch|p1a: Pikachu',
					'|win|Player 1',
				]);
				assert(!battle.getDebugLog().includes('|switch|p1b: Eevee'));
			});
		});

		describe('[Gen 2]', () => {
			it(`should defer hazard faints between voluntary switches`, () => {
				battle = common.gen(2).createBattle([[
					{ species: "shedinja", moves: ['sleeptalk'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "forretress", moves: ['spikes'] },
					{ species: "snorlax", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move sleeptalk', 'move spikes');
				battle.makeChoices('switch 2', 'switch 2');
				assert.logOrder(battle, [
					'|-damage|p1a: Shedinja|0 fnt|[from] Spikes',
					'|switch|p2a: Snorlax',
					'|faint|p1a: Shedinja',
				]);
			});

			it(`fainting should only happen after all Pokemon have switched in, even if one side will eventually lose`, () => {
				battle = common.gen(2).createBattle([[
					{ species: "alakazam", moves: ['sleeptalk'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['spikes', 'selfdestruct'] },
					{ species: "tyranitar", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices();
				battle.makeChoices('auto', 'move selfdestruct');
				battle.makeChoices();
				assert.logOrder(battle, [
					'|-damage|p1a: Shedinja|0 fnt',
					'|switch|p2a: Tyranitar',
					'|faint|p1a: Shedinja',
				]);
				assert(battle.ended);
			});

			it(`should result in a tie if both sides faint simultaneously`, () => {
				battle = common.gen(2).createBattle([[
					{ species: "alakazam", moves: ['spikes'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				], [
					{ species: "snorlax", moves: ['spikes', 'selfdestruct'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices();
				battle.makeChoices('auto', 'move selfdestruct');
				battle.makeChoices();
				assert(battle.ended);
				assert.equal(battle.winner, '');
			});

			it(`should finish a Pursuit-interrupted switch and its hazards before checking the outcome`, () => {
				battle = common.gen(2).createBattle([[
					{ species: "alakazam", moves: ['spikes', 'pursuit'] },
				], [
					{ species: "gastly", level: 1, moves: ['destinybond'] },
					{ species: "shedinja", moves: ['sleeptalk'] },
				]]);
				battle.makeChoices('move spikes', 'move destinybond');
				battle.makeChoices('move pursuit', 'switch 2');
				assert.logOrder(battle, [
					'|faint|p1a: Alakazam',
					'|switch|p2a: Shedinja',
					'|-damage|p2a: Shedinja|0 fnt|[from] Spikes',
					'|faint|p2a: Shedinja',
				]);
				assert(battle.ended);
				assert.equal(battle.winner, '');
			});
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
