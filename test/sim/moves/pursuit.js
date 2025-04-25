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

	it(`should continue the switch in Gen 3`, () => {
		battle = common.gen(3).createBattle([[
			{ species: "Tyranitar", ability: 'sandstream', moves: ['pursuit'] },
		], [
			{ species: "Alakazam", ability: 'magicguard', moves: ['psyshock'] },
			{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
		]]);
		battle.makeChoices('move Pursuit', 'switch 2');
		assert(battle.p2.active[0].hp);
	});

	it(`should continue the switch in Gen 4`, () => {
		battle = common.gen(4).createBattle([[
			{ species: "Tyranitar", ability: 'sandstream', moves: ['pursuit'] },
		], [
			{ species: "Alakazam", ability: 'magicguard', moves: ['psyshock'] },
			{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
		]]);
		battle.makeChoices('move Pursuit', 'switch 2');
		assert(battle.p2.active[0].hp);
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
});
