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
		battle.setPlayer('p1', {team: [{species: "Gengar", ability: 'levitate', item: '', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]});
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'randomNormal');
	});

	it('should request the Ghost target after the user becomes Ghost', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Rapidash", ability: 'levitate', item: '', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: "Trevenant", ability: 'shedskin', item: 'laggingtail', moves: ['trickortreat']}]});

		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
		battle.makeChoices('auto', 'auto');
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'randomNormal');
	});

	it('should not request a target after the user stops being Ghost', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Gengar", ability: 'levitate', item: '', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: "Jellicent", ability: 'waterabsorb', item: '', moves: ['soak']}]});

		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'randomNormal');
		battle.makeChoices('auto', 'auto');
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
	});

	it('should not request a target if the user is a known non-Ghost', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Blastoise", ability: 'torrent', item: '', moves: ['curse']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]});
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
	});

	it('should not request a target if the user is an unknown non-Ghost', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Blastoise", ability: 'torrent', item: '', moves: ['curse', 'reflecttype']}]});
		battle.setPlayer('p2', {team: [
			{species: "Zoroark", ability: 'illusion', item: '', moves: ['nastyplot']},
			{species: "Gengar", ability: 'levitate', item: '', moves: ['spite']},
		]});
		battle.makeChoices('move reflecttype', 'auto'); // Reflect Type!

		assert.deepEqual(battle.p1.active[0].getTypes(), ["Dark"]); // Copied Zoroark's type instead of Gengar's
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
	});

	it('should curse a non-Ghost user with Protean', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Greninja", ability: 'protean', item: '', moves: ['curse', 'spite']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]});

		battle.makeChoices('auto', 'auto');
		const hps = [battle.p1.active[0].hp, battle.p2.active[0].hp];
		assert.notEqual(hps[0], battle.p1.active[0].maxhp); // Curse user cut its HP down + residual damage
		assert.equal(hps[1], battle.p2.active[0].maxhp); // Foe unaffected

		battle.makeChoices('move spite', 'auto');
		assert.notEqual(hps[0], battle.p1.active[0].hp); // Curse user is hurt by residual damage
		assert.equal(hps[1], battle.p2.active[0].hp); // Foe unaffected
	});

	it('should curse the target if a Ghost user has Protean', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Gengar", ability: 'protean', item: '', moves: ['curse', 'spite']}]});
		battle.setPlayer('p2', {team: [{species: "Caterpie", ability: 'shedskin', item: '', moves: ['stringshot']}]});

		battle.makeChoices('auto', 'auto');
		const hps = [battle.p1.active[0].hp, battle.p2.active[0].hp];
		assert.notEqual(hps[0], battle.p1.active[0].maxhp); // Curse user cut its HP down
		assert.notEqual(hps[1], battle.p2.active[0].maxhp); // Curse residual damage

		battle.makeChoices('move spite', 'auto');
		// Check residual damage
		assert.equal(hps[0], battle.p1.active[0].hp); // Curse user unaffected
		assert.notEqual(hps[1], battle.p2.active[0].hp); // Curse residual damage
	});
});

describe('XY/ORAS Curse targetting when becoming Ghost the same turn', function () {
	afterEach(function () {
		battle.destroy();
	});

	const doublesTeams = [[
		{species: "Kecleon", ability: 'colorchange', item: 'laggingtail', moves: ['curse', 'calmmind']},
		{species: "Sableye", ability: 'prankster', item: '', moves: ['lightscreen', 'mudsport']},
	], [
		{species: "Raikou", ability: 'pressure', item: '', moves: ['aurasphere', 'calmmind']},
		{species: "Gastly", ability: 'levitate', item: '', moves: ['lick', 'calmmind']},
	]];

	const triplesTeams = [
		doublesTeams[0].concat({species: "Metapod", ability: 'shedskin', item: '', moves: ['harden', 'stringshot']}),
		doublesTeams[1].concat({species: "Kakuna", ability: 'shedskin', item: '', moves: ['harden', 'stringshot']}),
	];

	function runDoublesTest(battle, curseUser) {
		const p2active = battle.p2.active;
		const cursePartner = curseUser.side.active[1 - curseUser.position];

		battle.makeChoices(
			// p1: Kecleon uses Curse last in the turn.
			// p2: Fighting attack on Kecleon, then Ghost.
			`move 1, move 1`,
			`move aurasphere ${curseUser.position + 1}, move lick ${curseUser.position + 1}`
		);

		assert(curseUser.hasType('Ghost')); // Curse user must be Ghost
		assert(curseUser.hp < curseUser.maxhp / 2); // Curse user cut its HP down

		const foeHP = [p2active[0].hp, p2active[1].hp];
		battle.makeChoices(`move 2, move 2`, `move 2, move 2`);

		assert.notEqual(curseUser.hp, curseUser.maxhp); // Curse user cut its HP down
		if (curseUser.position === 0) {
			// Expected behavior
			assert.equal(cursePartner.hp, cursePartner.maxhp); // Partner unaffected by Curse
			assert(foeHP[0] !== p2active[0].maxhp || foeHP[1] !== p2active[1].maxhp); // Foe afflicted by Curse
		} else {
			// Cartridge glitch
			assert.notEqual(cursePartner.hp, cursePartner.maxhp); // Partner afflicted by Curse
			assert(foeHP[0] === p2active[0].maxhp && foeHP[1] === p2active[1].maxhp); // Foes unaffected by Curse
		}
	}

	function runTriplesTest(battle, curseUser) {
		const p1active = battle.p1.active;
		const p2active = battle.p2.active;

		battle.makeChoices(
			// p1: Kecleon uses Curse last in the turn.
			// p2: Electric attack on Kecleon, then Ghost.
			`move 1, move 1, move 1`,
			`move aurasphere ${curseUser.position + 1}, move lick ${curseUser.position + 1}, move harden`
		);

		assert(curseUser.hasType('Ghost')); // Curse user must be Ghost
		assert(curseUser.hp < curseUser.maxhp / 2); // Curse user cut its HP down

		let cursedFoe = false;
		for (let i = 0; i < 3; i++) {
			const allyPokemon = p1active[i];
			if (allyPokemon === curseUser) {
				assert.notEqual(allyPokemon.hp, allyPokemon.maxhp); // Curse user cut its HP down
			} else {
				assert.equal(allyPokemon.hp, allyPokemon.maxhp); // Partners unaffected by Curse
			}

			const foePokemon = p2active[i];
			if (foePokemon.hp !== foePokemon.maxhp) {
				cursedFoe = true;
			}
		}
		assert(cursedFoe);
	}

	it('should target an opponent in Doubles if the user is on left side and becomes Ghost the same turn', function () {
		battle = common.gen(6).createBattle({gameType: 'doubles'}, doublesTeams.slice());
		runDoublesTest(battle, battle.p1.active[0]);
	});

	it('should target the ally in Doubles if the user is on right side and becomes Ghost the same turn', function () {
		battle = common.gen(6).createBattle({gameType: 'doubles'}, [
			[doublesTeams[0][1], doublesTeams[0][0]],
			doublesTeams[1],
		]);
		runDoublesTest(battle, battle.p1.active[1]);
	});

	for (const cursePos of [0, 1, 2]) {
		it('should target an opponent in Triples even if the user is on position ' + cursePos, function () {
			const p1team = triplesTeams[0].slice(1);
			p1team.splice(cursePos, 0, triplesTeams[0][0]);
			const p2team = triplesTeams[1].slice();

			battle = common.gen(5).createBattle({gameType: 'triples'}, [p1team, p2team]);
			runTriplesTest(battle, battle.p1.active[cursePos]);
		});
	}
});
