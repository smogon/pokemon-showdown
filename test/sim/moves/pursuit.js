'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Pursuit`, () => {
	afterEach(() => battle.destroy());

	it(`should execute before the target switches out and after the user mega evolves`, () => {
		battle = common.createBattle([[
			{ species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit'] },
		], [
			{ species: "Alakazam", ability: 'magicguard', moves: ['psyshock'] },
			{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
		]]);
		battle.makeChoices('move Pursuit mega', 'switch 2');
		assert.species(battle.p1.active[0], "Beedrill-Mega");
		assert.fainted(battle.p2.active[0]);
	});

	it(`should execute before the target switches out and after the user Terastallizes`, () => {
		battle = common.gen(9).createBattle([[
			{ species: "Kingambit", ability: 'defiant', moves: ['pursuit'] },
		], [
			{ species: "Giratina", ability: 'pressure', moves: ['shadow ball'] },
			{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
		]]);
		const giratina = battle.p2.pokemon[0];
		const hpBeforeSwitch = giratina.hp;
		battle.makeChoices('move Pursuit terastallize', 'switch 2');
		const damage = hpBeforeSwitch - giratina.hp;
		// 0 Atk Tera Dark Kingambit switching boosted Pursuit (80 BP) vs. 0 HP / 0 Def Giratina: 256-304
		assert.bounded(damage, [256, 304], 'Actual damage: ' + damage);
	});

	it(`should not repeat`, () => {
		battle = common.createBattle([[
			{ species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit'] },
			{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
		], [
			{ species: "Clefable", ability: 'magicguard', moves: ['calmmind'] },
			{ species: "Alakazam", ability: 'unaware', moves: ['calmmind'] },
		]]);
		battle.makeChoices('move Pursuit mega', 'auto');
		const clefable = battle.p2.pokemon[0];
		const hpBeforeSwitch = clefable.hp;
		battle.makeChoices('switch 2', 'switch 2');
		assert.equal(hpBeforeSwitch, clefable.hp);
	});

	it(`should not double in power or activate before a switch if targeting an ally`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Beedrill", item: 'beedrillite', moves: ['pursuit'] },
			{ species: "Clefable", moves: ['calmmind'] },
			{ species: "Furret", ability: 'shellarmor', moves: ['uturn'] },
		], [
			{ species: "Clefable", moves: ['calmmind'] },
			{ species: "Alakazam", moves: ['calmmind'] },
		]]);
		const furret = battle.p1.pokemon[2];
		battle.makeChoices('move pursuit mega -2, switch 3', 'auto');
		assert.bounded(furret.maxhp - furret.hp, [60, 70]);
	});

	it(`should not double in power or activate before a switch triggered by Red Card`, () => {
		battle = common.createBattle([[
			{ species: 'Steelix', item: 'redcard', moves: ['pursuit'] },
		], [
			{ species: 'Darkrai', moves: ['tackle'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		const darkrai = battle.p2.active[0];
		battle.makeChoices('move pursuit', 'auto');
		assert.fullHP(darkrai);
		assert.false.fullHP(battle.p2.active[0]);
	});

	it(`should deal damage prior to attacker selecting a switch in after u-turn etc`, () => {
		battle = common.createBattle([[
			{ species: 'parasect', moves: ['pursuit'] },
		], [
			{ species: 'emolga', moves: ['voltswitch'] },
			{ species: 'zapdos', moves: ['batonpass'] },
		]]);
		battle.makeChoices('move Pursuit', 'move voltswitch');
		assert.false.fullHP(battle.p2.pokemon[0]);
		battle.choose('p2', 'switch 2');
		assert.equal(battle.p2.pokemon[0].name, "Zapdos");
		battle.makeChoices('move Pursuit', 'move batonpass');
		battle.choose('p2', 'switch 2');
		assert.fullHP(battle.p2.pokemon[1], 'should not hit Pokemon that has used Baton Pass');
		assert.equal(battle.p2.pokemon[0].name, "Emolga");
		battle.makeChoices('move Pursuit', 'move voltswitch');
	});

	it(`should only activate before switches on adjacent foes`, () => {
		battle = common.gen(5).createBattle({ gameType: 'triples' }, [[
			{ species: 'Beedrill', moves: ['pursuit'] },
			{ species: 'Wynaut', moves: ['swordsdance'] },
			{ species: 'Wynaut', moves: ['swordsdance'] },
		], [
			{ species: 'Alakazam', moves: ['swordsdance'] },
			{ species: 'Solosis', moves: ['swordsdance'] },
			{ species: 'Wynaut', moves: ['swordsdance'] },
			{ species: 'Wynaut', moves: ['swordsdance'] },
		]]);
		battle.makeChoices('move pursuit 2, auto', 'switch 4, auto');
		assert.false(battle.log.includes('|-activate|p2a: Alakazam|move: Pursuit'));
		assert.false.fullHP(battle.p2.active[1]);
	});

	it(`should not be redirected if activated by a switch`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Beedrill', moves: ['pursuit'] },
			{ species: 'Clefable', moves: ['sleeptalk'] },
		], [
			{ species: 'Gengar', moves: ['uturn'] },
			{ species: 'Alakazam', moves: ['followme'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		const gengar = battle.p2.active[0];
		battle.makeChoices('move pursuit 1, move sleeptalk', 'auto');
		assert.false.fullHP(gengar);
	});

	it(`should be able to be paralyzed to prevent activation`, () => {
		battle = common.createBattle({ forceRandomChance: true }, [[
			{ species: "Tyranitar", moves: ['pursuit', 'sleeptalk'] },
		], [
			{ species: "Jolteon", moves: ['thunderwave'] },
			{ species: "Clefable", moves: ['calmmind'] },
		]]);
		const jolteon = battle.p2.pokemon[0];
		battle.makeChoices('move sleeptalk', 'move thunderwave');
		assert.equal(battle.p1.active[0].status, 'par');
		battle.makeChoices('move pursuit', 'switch 2');
		assert.fullHP(jolteon);
	});

	describe(`[Gen 4]`, () => {
		it(`should continue the switch`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "Tyranitar", ability: 'sandstream', moves: ['pursuit'] },
			], [
				{ species: "Alakazam", ability: 'magicguard', moves: ['psyshock'] },
				{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
			]]);
			battle.makeChoices('move Pursuit', 'switch 2');
			assert(battle.p2.active[0].hp);
		});

		it(`should not activate if the user is asleep at the beginning of the turn`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "Tyranitar", moves: ['pursuit'] },
			], [
				{ species: "Breloom", moves: ['spore'] },
				{ species: "Breloom", moves: ['sleeptalk'] },
			]]);
			battle.makeChoices('move pursuit', 'move spore');
			assert.equal(battle.p1.active[0].status, 'slp');
			while (battle.p1.active[0].status === 'slp') {
				battle.makeChoices('move pursuit', 'switch 2');
			}
			// Tyranitar woke up and used Pursuit
			const activeBreloom = battle.p2.active[0];
			assert.bounded(activeBreloom.maxhp - activeBreloom.hp, [33, 40]);
			assert.fullHP(battle.p2.pokemon[1].hp);
		});

		it(`should be able to be paralyzed to prevent activation`, () => {
			battle = common.gen(4).createBattle({ forceRandomChance: true }, [[
				{ species: "Tyranitar", moves: ['pursuit', 'sleeptalk'] },
			], [
				{ species: "Jolteon", moves: ['thunderwave'] },
				{ species: "Clefable", moves: ['calmmind'] },
			]]);
			const jolteon = battle.p2.pokemon[0];
			battle.makeChoices('move sleeptalk', 'move thunderwave');
			assert.equal(battle.p1.active[0].status, 'par');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.false.fullHP(jolteon);
		});
	});

	describe(`[Gen 3]`, () => {
		it(`should continue the switch`, () => {
			battle = common.gen(3).createBattle([[
				{ species: "Tyranitar", ability: 'sandstream', moves: ['pursuit'] },
			], [
				{ species: "Alakazam", ability: 'magicguard', moves: ['psyshock'] },
				{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
			]]);
			battle.makeChoices('move Pursuit', 'switch 2');
			assert(battle.p2.active[0].hp);
		});
	});

	describe(`[Gen 2]`, () => {
		it(`should continue the switch`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "Tyranitar", moves: ['pursuit'] },
			], [
				{ species: "Alakazam", moves: ['psyshock'] },
				{ species: "Clefable", moves: ['calmmind'] },
			]]);
			battle.makeChoices('move Pursuit', 'switch 2');
			assert(battle.p2.active[0].hp);
		});

		it(`should try to activate even if the user is asleep at the beginning of the turn`, () => {
			battle = common.gen(2).createBattle([[
				{ species: "Paras", moves: ['pursuit'], evs: { spa: 252 } },
			], [
				{ species: "Parasect", moves: ['spore'], evs: { hp: 252, spd: 252 } },
				{ species: "Parasect", moves: ['sleeptalk'], evs: { hp: 252, spd: 252 } },
			]]);
			battle.makeChoices('move pursuit', 'move spore');
			assert.equal(battle.p1.active[0].status, 'slp');
			while (battle.p1.active[0].status === 'slp') {
				battle.makeChoices('move pursuit', 'switch 2');
			}
			// Paras woke up and used Pursuit
			assert.fullHP(battle.p2.active[0].hp);
			const inactiveParasect = battle.p2.pokemon[1];
			assert.bounded(inactiveParasect.maxhp - inactiveParasect.hp, [42, 50]);
		});

		it(`should be able to be paralyzed to prevent activation`, () => {
			battle = common.gen(2).createBattle({ forceRandomChance: true }, [[
				{ species: "Tyranitar", moves: ['pursuit', 'sleeptalk'] },
			], [
				{ species: "Jolteon", moves: ['thunderwave'] },
				{ species: "Clefable", moves: ['calmmind'] },
			]]);
			const jolteon = battle.p2.pokemon[0];
			battle.makeChoices('move sleeptalk', 'move thunderwave');
			assert.equal(battle.p1.active[0].status, 'par');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.fullHP(jolteon);
		});
	});
});
