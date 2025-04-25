'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mega Evolution', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should cause mega ability to affect the order of the turn in which it happens', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] }] });
		const pranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(pranksterMega, 'spa', 0);
	});

	it('should cause an ability copied with Trace by a mega to affect the order of the turn in which it happens', () => {
		battle = common.createBattle([
			[{ species: "Politoed", ability: 'drizzle', item: '', moves: ['scald'] }, { species: "Kingdra", ability: 'swiftswim', item: '', moves: ['dragondance'] }],
			[{ species: "Marowak", ability: 'rockhead', item: '', moves: ['earthquake'] }, { species: "Alakazam", ability: 'magicguard', item: 'alakazite', moves: ['psychup'] }],
		]);
		battle.makeChoices('switch 2', 'switch 2');
		battle.makeChoices('move dragondance', 'move psychup mega');
		assert.statStage(battle.p1.active[0], 'atk', 1);
		assert.statStage(battle.p2.active[0], 'atk', 0);
		assert.species(battle.p2.active[0], 'Alakazam-Mega');
	});

	it('should cause base ability to not affect the order of the turn in which it happens', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] }] });
		const noPranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(noPranksterMega, 'spa', 1);
	});

	it('should cause mega forme speed to decide turn order', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock'] }] });
		const fastBase = battle.p2.active[0];
		battle.makeChoices('move xscissor mega', 'move psyshock');
		assert.fainted(fastBase);
	});

	it('should cause ultra forme speed to decide turn order', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Necrozma-Dusk-Mane', ability: 'swarm', item: 'ultranecroziumz', moves: ['xscissor'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Hoopa-Unbound', ability: 'magician', moves: ['darkpulse'] }] });
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
		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Banette', ability: 'frisk', item: 'banettite', moves: ['psychup'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] }] });
		const pranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(pranksterMega, 'spa', 1);
	});

	it('should not cause an ability copied with Trace by a mega to affect the order of the turn in which it happens', () => {
		battle = common.gen(6).createBattle([
			[{ species: "Politoed", ability: 'drizzle', item: '', moves: ['scald'] }, { species: "Kingdra", ability: 'swiftswim', item: '', moves: ['dragondance'] }],
			[{ species: "Marowak", ability: 'rockhead', item: '', moves: ['earthquake'] }, { species: "Alakazam", ability: 'magicguard', item: 'alakazite', moves: ['psychup'] }],
		]);
		battle.makeChoices('switch 2', 'switch 2');
		battle.makeChoices('move dragondance', 'move psychup mega');
		assert.statStage(battle.p1.active[0], 'atk', 1);
		assert.statStage(battle.p2.active[0], 'atk', 1);
		assert.species(battle.p2.active[0], 'Alakazam-Mega');
	});

	it('should cause base ability to affect the order of the turn in which it happens', () => {
		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Sableye', ability: 'prankster', item: 'sablenite', moves: ['psychup'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Deoxys-Speed', ability: 'pressure', moves: ['calmmind'] }] });
		const noPranksterMega = battle.p1.active[0];
		battle.makeChoices('move psychup mega', 'move calmmind');
		assert.statStage(noPranksterMega, 'spa', 0);
	});

	it('should cause base forme speed to decide turn order', () => {
		battle = common.gen(6).createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Beedrill', ability: 'swarm', item: 'beedrillite', moves: ['xscissor'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Hoopa-Unbound', ability: 'magician', moves: ['psyshock'] }] });
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
		battle = common.createBattle({ gameType: 'doubles' });
		const p1team = [
			{ species: 'Ludicolo', ability: 'swiftswim', moves: ['scald'], evs: { spe: 100 } }, // 201 Speed
			{ species: 'Appletun', ability: 'ripen', moves: ['sleeptalk'] }, // To be switched out
			{ species: 'Pelipper', ability: 'drizzle', moves: ['sleeptalk'] }, // Will set rain on switch in
		];
		const p2team = [
			{ species: 'Accelgor', ability: 'hydration', moves: ['bugbuzz'], evs: { spe: 156 }, nature: 'Timid' }, // 401 Speed
			{ species: 'Aegislash', ability: 'stancechange', moves: ['sleeptalk'] }, // Does nothing but fill a slot
		];
		battle.setPlayer('p1', { team: p1team });
		battle.setPlayer('p2', { team: p2team });

		// Set ludicolo's and accelgor's HP to 1.
		battle.p1.pokemon[0].sethp(1); // Ludicolo
		battle.p2.pokemon[0].sethp(1); // Accelgor

		battle.makeChoices('move scald 1, switch 3', 'move bugbuzz 1, auto');
		assert.fainted(battle.p2.pokemon[0]); // Accelgor should be fainted
	});

	it('should NOT update dynamically in Gen 7', () => {
		battle = common.gen(7).createBattle({ gameType: 'doubles' });
		const p1team = [
			{ species: 'Ludicolo', ability: 'swiftswim', moves: ['scald'], evs: { spe: 100 } }, // 201 Speed
			{ species: 'Appletun', ability: 'ripen', moves: ['sleeptalk'] }, // To be switched out
			{ species: 'Pelipper', ability: 'drizzle', moves: ['sleeptalk'] }, // Will set rain on switch in
		];
		const p2team = [
			{ species: 'Accelgor', ability: 'hydration', moves: ['bugbuzz'], evs: { spe: 156 }, nature: 'Timid' }, // 401 Speed
			{ species: 'Aegislash', ability: 'stancechange', moves: ['sleeptalk'] }, // Does nothing but fill a slot
		];
		battle.setPlayer('p1', { team: p1team });
		battle.setPlayer('p2', { team: p2team });

		// Set ludicolo's and accelgor's HP to 1.
		battle.p1.pokemon[0].sethp(1); // Ludicolo
		battle.p2.pokemon[0].sethp(1); // Accelgor

		battle.makeChoices('move scald 1, switch 3', 'move bugbuzz 1, auto');
		assert.fainted(battle.p1.pokemon[0]); // Ludicolo should be fainted
	});
});

describe('Switching out', () => {
	it('should happen in order of switch-out\'s Speed stat', () => {
		battle = common.createBattle();
		const p1team = [
			{ species: 'Accelgor', ability: 'runaway', moves: ['sleeptalk'] },
			{ species: 'Shuckle', ability: 'intimidate', moves: ['sleeptalk'] },
		];
		const p2team = [
			{ species: 'Durant', ability: 'runaway', moves: ['sleeptalk'] },
			{ species: 'Barraskewda', ability: 'runaway', moves: ['sleeptalk'] },
		];
		battle.setPlayer('p1', { team: p1team });
		battle.setPlayer('p2', { team: p2team });

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
