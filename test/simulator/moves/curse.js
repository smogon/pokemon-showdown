'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Curse', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should request the Ghost target if the user is a known Ghost', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Gengar", ability: 'levitate', item: '', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]);
		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'normal');
	});

	it('should request the Ghost target after the user becomes Ghost', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Rapidash", ability: 'levitate', item: '', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Trevenant", ability: 'shedskin', item: 'laggingtail', moves: ['trickortreat']}]);

		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'self');
		battle.makeChoices('move curse', 'move trickortreat');
		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'normal');
	});

	it('should not request a target after the user stops being Ghost', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Gengar", ability: 'levitate', item: '', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Jellicent", ability: 'waterabsorb', item: '', moves: ['soak']}]);

		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'normal');
		battle.makeChoices('move curse', 'move soak');
		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'self');
	});

	it('should not request a target if the user is a known non-Ghost', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Blastoise", ability: 'torrent', item: '', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]);
		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'self');
	});

	it('should not request a target if the user is an unknown non-Ghost', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Blastoise", ability: 'torrent', item: '', moves: ['curse', 'reflecttype']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Zoroark", ability: 'illusion', item: '', moves: ['nastyplot']},
			{species: "Gengar", ability: 'levitate', item: '', moves: ['spite']},
		]);
		battle.makeChoices('move reflecttype', 'move nastyplot');

		assert.deepEqual(battle.p1.active[0].getTypes(), ["Dark"]); // Copied Zoroark's type instead of Gengar's
		assert.strictEqual(battle.p1.active[0].getRequestData().moves[0].target, 'self');
	});

	it('should curse a non-Ghost user with Protean', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Greninja", ability: 'protean', item: '', moves: ['curse', 'spite']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]);

		battle.makeChoices('move curse', 'move stringshot');
		let hps = [battle.p1.active[0].hp, battle.p2.active[0].hp];
		assert.notStrictEqual(hps[0], battle.p1.active[0].maxhp); // Curse user cut its HP down + residual damage
		assert.strictEqual(hps[1], battle.p2.active[0].maxhp); // Foe unaffected

		battle.makeChoices('move spite', 'move stringshot');
		assert.notStrictEqual(hps[0], battle.p1.active[0].hp); // Curse user is hurt by residual damage
		assert.strictEqual(hps[1], battle.p2.active[0].hp); // Foe unaffected
	});

	it('should curse the target if a Ghost user has Protean', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Gengar", ability: 'protean', item: '', moves: ['curse', 'spite']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]);

		battle.makeChoices('move curse', 'move stringshot');
		let hps = [battle.p1.active[0].hp, battle.p2.active[0].hp];
		assert.notStrictEqual(hps[0], battle.p1.active[0].maxhp); // Curse user cut its HP down
		assert.notStrictEqual(hps[1], battle.p2.active[0].maxhp); // Curse residual damage

		battle.makeChoices('move spite', 'move stringshot'); // Check residual damage
		assert.strictEqual(hps[0], battle.p1.active[0].hp); // Curse user unaffected
		assert.notStrictEqual(hps[1], battle.p2.active[0].hp); // Curse residual damage
	});
});

describe('XY/ORAS Curse targetting when becoming Ghost the same turn', function () {
	afterEach(function () {
		battle.destroy();
	});

	let doublesTeams = [[
		{species: "Kecleon", ability: 'colorchange', item: 'laggingtail', moves: ['curse', 'calmmind']},
		{species: "Sableye", ability: 'prankster', item: '', moves: ['lightscreen', 'mudsport']},
	], [
		{species: "Raikou", ability: 'pressure', item: '', moves: ['aurasphere', 'calmmind']},
		{species: "Gastly", ability: 'levitate', item: '', moves: ['lick', 'calmmind']},
	]];

	let triplesTeams = [
		doublesTeams[0].concat({species: "Metapod", ability: 'shedskin', item: '', moves: ['harden', 'stringshot']}),
		doublesTeams[1].concat({species: "Kakuna", ability: 'shedskin', item: '', moves: ['harden', 'stringshot']}),
	];

	function runDoublesTest(battle, curseUser) {
		let p2active = battle.p2.active;
		let cursePartner = curseUser.side.active[1 - curseUser.position];

		// p1: Kecleon uses Curse last in the turn.
		// p2: Fighting attack on Kecleon, then Ghost.
		battle.makeChoices('move curse, move lightscreen', 'move aurasphere ' + (curseUser.position + 1) + ', move lick ' + (curseUser.position + 1));

		assert.ok(curseUser.hasType('Ghost')); // Curse user must be Ghost
		assert.ok(curseUser.hp < curseUser.maxhp / 2); // Curse user cut its HP down

		let foeHP = [p2active[0].hp, p2active[1].hp];
		battle.makeChoices('move curse, move lightscreen', 'move calmmind, move calmmind');

		assert.notStrictEqual(curseUser.hp, curseUser.maxhp); // Curse user cut its HP down
		if (curseUser.position === 0) {
			// Expected behavior
			assert.strictEqual(cursePartner.hp, cursePartner.maxhp); // Partner unaffected by Curse
			assert.ok(foeHP[0] !== p2active[0].maxhp || foeHP[1] !== p2active[1].maxhp); // Foe afflicted by Curse
		} else {
			// Cartridge glitch
			assert.notStrictEqual(cursePartner.hp, cursePartner.maxhp); // Partner afflicted by Curse
			assert.ok(foeHP[0] === p2active[0].maxhp && foeHP[1] === p2active[1].maxhp); // Foes unaffected by Curse
		}
	}

	function runTriplesTest(battle, curseUser) {
		let p1active = battle.p1.active;
		let p2active = battle.p2.active;

		// p1: Kecleon uses Curse last in the turn.
		// p2: Electric attack on Kecleon, then Ghost.
		battle.makeChoices('move curse, move lightscree, move harden', 'move aurasphere ' + (curseUser.position + 1) + ', move lick ' + (curseUser.position + 1) + ', move harden');

		assert.ok(curseUser.hasType('Ghost')); // Curse user must be Ghost
		assert.ok(curseUser.hp < curseUser.maxhp / 2); // Curse user cut its HP down

		let cursedFoe = false;
		for (let i = 0; i < 3; i++) {
			let allyPokemon = p1active[i];
			if (allyPokemon === curseUser) {
				assert.notStrictEqual(allyPokemon.hp, allyPokemon.maxhp); // Curse user cut its HP down
			} else {
				assert.strictEqual(allyPokemon.hp, allyPokemon.maxhp); // Partners unaffected by Curse
			}

			let foePokemon = p2active[i];
			if (foePokemon.hp !== foePokemon.maxhp) {
				cursedFoe = true;
			}
		}
		assert.ok(cursedFoe);
	}

	it('should target an opponent in Doubles if the user is on left side and becomes Ghost the same turn', function () {
		battle = common.createBattle({gameType: 'doubles'}, doublesTeams.slice());
		runDoublesTest(battle, battle.p1.active[0]);
	});

	it('should target the ally in Doubles if the user is on right side and becomes Ghost the same turn', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[doublesTeams[0][1], doublesTeams[0][0]],
			doublesTeams[1],
		]);
		runDoublesTest(battle, battle.p1.active[1]);
	});

	for (let cursePos of [0, 1, 2]) {
		it('should target an opponent in Triples even if the user is on position ' + cursePos, function () {
			let p1team = triplesTeams[0].slice(1);
			p1team.splice(cursePos, 0, triplesTeams[0][0]);
			let p2team = triplesTeams[1].slice();

			battle = common.createBattle({gameType: 'triples'}, [p1team, p2team]);
			runTriplesTest(battle, battle.p1.active[cursePos]);
		});
	}
});
