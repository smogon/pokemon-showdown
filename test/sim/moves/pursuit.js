'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Pursuit`, () => {
	afterEach(() => battle.destroy());

	for (const gen of [2, 3, 4, 5, 6, 7, 8, 9]) {
		// [9:24 AM] Marty: It's an information loss; the text was there because since Gen 3 the game always shows you the usual "Player withdrew" text before a non-Encored Pursuit happens, whether or not it knocks them out
		// [9:25 AM] Marty: The text itself was not game text, which is why it was in parentheses, what should actually happen is the standard switch out text appears first
		it(`[Gen ${gen}] should announce each interrupted withdrawal before Pursuit`, () => {
			battle = common.gen(gen).createBattle([[
				{ species: 'Furret', moves: ['pursuit', 'splash'] },
			], [
				{ species: 'Snorlax', ability: 'shellarmor', moves: ['splash'] },
				{ species: 'Blissey', moves: ['splash'] },
			]]);
			const message = '|-activate|p2a: Snorlax|move: Pursuit';
			battle.makeChoices('move pursuit', 'move splash');
			assert.false(battle.log.includes(message), 'Ordinary Pursuit should not announce a withdrawal');
			const start = battle.log.length;
			battle.makeChoices('move pursuit', 'switch 2');
			const log = battle.log.slice(start);
			assert.equal(log.filter(line => line === message).length, 1);
			assert(log.findIndex(line => line.startsWith('|move|p1a: Furret|Pursuit|')) > log.indexOf(message));
			battle.makeChoices('move splash', 'switch 2');
			battle.makeChoices('move pursuit', 'switch 2');
			assert.equal(battle.log.filter(line => line === message).length, 2);
		});
	}

	for (const gen of [3, 4, 7, 9]) {
		it(`[Gen ${gen}] should announce a withdrawal only once for multiple Pursuit users`, () => {
			battle = common.gen(gen).createBattle({ gameType: 'doubles' }, [[
				{ species: 'Beedrill', moves: ['pursuit'] },
				{ species: 'Furret', moves: ['pursuit'] },
			], [
				{ species: 'Snorlax', ability: 'shellarmor', moves: ['splash'] },
				{ species: 'Blissey', moves: ['splash'] },
				{ species: 'Clefable', moves: ['splash'] },
			]]);
			battle.makeChoices('move pursuit 1, move pursuit 1', 'switch 3, move splash');
			const message = '|-activate|p2a: Snorlax|move: Pursuit';
			assert.equal(battle.log.filter(line => line === message).length, 1);
			const moves = battle.log.filter(line => line.startsWith('|move|') && line.includes('|Pursuit|p2a: Snorlax'));
			assert.equal(moves.length, 2);
			assert(battle.log.indexOf(message) < battle.log.indexOf(moves[0]));
		});
	}

	it(`should execute before the target switches out and after the user mega evolves`, () => {
		battle = common.createBattle([[
			{ species: "Beedrill", ability: 'swarm', item: 'beedrillite', moves: ['pursuit'] },
		], [
			{ species: "Alakazam", ability: 'magicguard', moves: ['psyshock'] },
			{ species: "Clefable", ability: 'unaware', moves: ['calmmind'] },
		]]);
		battle.makeChoices('move Pursuit mega', 'switch 2');
		const message = battle.log.indexOf('|-activate|p2a: Alakazam|move: Pursuit');
		assert(message >= 0);
		assert(message < battle.log.findIndex(line => line.startsWith('|-mega|')));
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
		const pursuit = battle.p1.active[0].moveSlots[0];
		assert.equal(pursuit.pp, pursuit.maxpp - 2);
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

	it(`should activate on the first target switching out`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Beedrill", moves: ['pursuit'] },
			{ species: "Furret", moves: ['pursuit'] },
		], [
			{ species: "Clefable", ability: 'shellarmor', moves: ['calmmind'] },
			{ species: "Toxapex", moves: ['calmmind'] },
			{ species: "Wynaut", moves: ['calmmind'] },
			{ species: "Alakazam", moves: ['calmmind'] },
		]]);
		const [clefable, toxapex, wynaut, alakazam] = battle.p2.pokemon;
		battle.makeChoices('move pursuit 1, move pursuit 2', 'switch 3, switch 4'); // Does not matter who Pursuit targets
		assert.bounded(clefable.maxhp - clefable.hp, [34 + 30, 40 + 35]);
		assert.fullHP(toxapex);
		assert.fullHP(wynaut);
		assert.fullHP(alakazam);
		assert.equal(battle.log.filter(line => line === '|-activate|p2a: Clefable|move: Pursuit').length, 1);
	});

	it(`should activate on the second target switching out, if the first fainted`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Beedrill", moves: ['pursuit'] },
			{ species: "Furret", moves: ['pursuit'] },
		], [
			{ species: "Clefable", ability: 'shellarmor', moves: ['calmmind'] },
			{ species: "Shedinja", moves: ['calmmind'], evs: { spe: 252 } },
			{ species: "Wynaut", moves: ['calmmind'] },
			{ species: "Alakazam", moves: ['calmmind'] },
		]]);
		const [clefable, shedinja, wynaut, alakazam] = battle.p2.pokemon;
		battle.makeChoices('move pursuit 1, move pursuit 2', 'switch 3, switch 4');
		assert.bounded(clefable.maxhp - clefable.hp, [34, 40]);
		assert.fainted(shedinja);
		assert.fullHP(wynaut);
		assert.fullHP(alakazam);
		assert.equal(battle.log.filter(line => line === '|-activate|p2a: Clefable|move: Pursuit').length, 1);
		assert.equal(battle.log.filter(line => line === '|-activate|p2b: Shedinja|move: Pursuit').length, 1);
	});

	it(`should activate on a switching opponent even if targeting an ally`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Beedrill", item: 'beedrillite', moves: ['pursuit'] },
			{ species: "Clefable", moves: ['calmmind'] },
			{ species: "Furret", moves: ['calmmind'] },
		], [
			{ species: "Clefable", ability: 'shellarmor', moves: ['calmmind'] },
			{ species: "Alakazam", moves: ['calmmind'] },
			{ species: "Roserade", moves: ['calmmind'] },
		]]);
		const clefable = battle.p2.pokemon[0];
		battle.makeChoices('move pursuit mega -2, switch 3', 'switch 3, move calmmind');
		assert.bounded(clefable.maxhp - clefable.hp, [53, 63]);
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
		const activation = '|-activate|p2a: Emolga|move: Pursuit';
		assert.equal(battle.log.filter(line => line === activation).length, 1);
		battle.choose('p2', 'switch 2');
		assert.equal(battle.log.filter(line => line === activation).length, 1);
		assert.equal(battle.p2.pokemon[0].name, "Zapdos");
		battle.makeChoices('move Pursuit', 'move batonpass');
		battle.choose('p2', 'switch 2');
		assert.fullHP(battle.p2.pokemon[1], 'should not hit Pokemon that has used Baton Pass');
		assert.equal(battle.p2.pokemon[0].name, "Emolga");
		assert.equal(battle.log.filter(line => line === activation).length, 1);
		battle.makeChoices('move Pursuit', 'move voltswitch');
		assert.equal(battle.log.filter(line => line === activation).length, 2);
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

	it(`should not activate if Encored into Pursuit`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Empoleon", moves: ['tackle', 'pursuit'] },
			{ species: "Carnivine", moves: ['sleeptalk'] },
		], [
			{ species: "Deoxys", moves: ['sleeptalk', 'encore'] },
			{ species: "Infernape", moves: ['sleeptalk', 'uturn'] },
			{ species: "Carnivine", moves: ['sleeptalk'] },
		]]);
		const [deoxys, infernape] = battle.p2.active;
		battle.makeChoices('move pursuit 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
		deoxys.hp = deoxys.maxhp;
		battle.makeChoices('move tackle 1, move sleeptalk', 'move encore 1, move uturn 2');
		assert.fullHP(deoxys);
		assert.fullHP(infernape);
		battle.makeChoices('', 'switch 3');
		assert.false.fullHP(deoxys);
	});

	it(`should not activate other move if Encored out of Pursuit`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Empoleon", moves: ['tackle', 'pursuit'] },
			{ species: "Carnivine", moves: ['sleeptalk'] },
		], [
			{ species: "Deoxys", moves: ['sleeptalk', 'encore'] },
			{ species: "Infernape", moves: ['sleeptalk', 'uturn'] },
			{ species: "Carnivine", moves: ['sleeptalk'] },
		]]);
		const [deoxys, infernape] = battle.p2.active;
		battle.makeChoices('move tackle 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
		deoxys.hp = deoxys.maxhp;
		battle.makeChoices('move pursuit 1, move sleeptalk', 'move encore 1, move uturn 2');
		assert.fullHP(deoxys);
		assert.fullHP(infernape);
		assert.false(battle.log.includes('|-activate|p2b: Infernape|move: Pursuit'));
		battle.makeChoices('', 'switch 3');
		assert.false.fullHP(deoxys);
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
			for (let i = 0; i < 5; i++) {
				if (battle.p1.active[0].status !== 'slp') break;
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

		it(`should activate if Encored into Pursuit`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: "Empoleon", moves: ['tackle', 'pursuit'] },
				{ species: "Carnivine", moves: ['sleeptalk'] },
			], [
				{ species: "Deoxys", moves: ['sleeptalk', 'encore'] },
				{ species: "Infernape", moves: ['sleeptalk', 'uturn'] },
				{ species: "Carnivine", moves: ['sleeptalk'] },
			]]);
			const [deoxys, infernape] = battle.p2.active;
			battle.makeChoices('move pursuit 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
			deoxys.hp = deoxys.maxhp;
			battle.makeChoices('move tackle 1, move sleeptalk', 'move encore 1, move uturn 2');
			assert.fullHP(deoxys);
			assert.false.fullHP(infernape);
			battle.makeChoices('', 'switch 3');
			assert.fullHP(deoxys);
		});

		it(`should not activate other move if Encored out of Pursuit`, () => {
			battle = common.gen(4).createBattle({ gameType: 'doubles' }, [[
				{ species: "Empoleon", moves: ['tackle', 'pursuit'] },
				{ species: "Carnivine", moves: ['sleeptalk'] },
			], [
				{ species: "Deoxys", moves: ['sleeptalk', 'encore'] },
				{ species: "Infernape", moves: ['sleeptalk', 'uturn'] },
				{ species: "Carnivine", moves: ['sleeptalk'] },
			]]);
			const [deoxys, infernape] = battle.p2.active;
			battle.makeChoices('move tackle 1, move sleeptalk', 'move sleeptalk, move sleeptalk');
			deoxys.hp = deoxys.maxhp;
			battle.makeChoices('move pursuit 1, move sleeptalk', 'move encore 1, move uturn 2');
			assert.fullHP(deoxys);
			assert.fullHP(infernape);
			assert.false(battle.log.includes('|-activate|p2b: Infernape|move: Pursuit'));
			battle.makeChoices('', 'switch 3');
			assert.false.fullHP(deoxys);
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

		it(`should only activate on the targeted opponent`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "Beedrill", moves: ['pursuit'] },
				{ species: "Furret", moves: ['pursuit'] },
			], [
				{ species: "Clefable", ability: 'shellarmor', moves: ['calmmind'] },
				{ species: "Clefable", ability: 'shellarmor', moves: ['calmmind'] },
				{ species: "Wynaut", moves: ['calmmind'] },
				{ species: "Alakazam", moves: ['calmmind'] },
			]]);
			const [clefable, clefable2, wynaut, alakazam] = battle.p2.pokemon;
			battle.makeChoices('move pursuit 1, move pursuit 2', 'switch 3, switch 4');
			assert.bounded(clefable.maxhp - clefable.hp, [35, 42]);
			assert.bounded(clefable2.maxhp - clefable2.hp, [35, 42]);
			assert.fullHP(wynaut);
			assert.fullHP(alakazam);
		});

		it(`should not activate on a switching opponent if targeting an ally`, () => {
			battle = common.gen(3).createBattle({ gameType: 'doubles' }, [[
				{ species: "Beedrill", moves: ['pursuit'] },
				{ species: "Clefable", moves: ['calmmind'] },
				{ species: "Furret", moves: ['calmmind'] },
			], [
				{ species: "Clefable", moves: ['calmmind'] },
				{ species: "Alakazam", moves: ['calmmind'] },
				{ species: "Roserade", moves: ['calmmind'] },
			]]);
			const clefable = battle.p2.pokemon[0];
			battle.makeChoices('move pursuit -2, switch 3', 'switch 3, move calmmind');
			assert.fullHP(clefable);
			const furret = battle.p1.pokemon[1];
			assert.bounded(furret.maxhp - furret.hp, [25, 30]);
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
			for (let i = 0; i < 5; i++) {
				if (battle.p1.active[0].status !== 'slp') break;
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
