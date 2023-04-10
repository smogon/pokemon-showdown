'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Curse', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should request the Ghost target if the user is a known Ghost`, function () {
		battle = common.createBattle([[
			{species: 'Gengar', moves: ['curse']},
		], [
			{species: 'Caterpie', moves: ['sleeptalk']},
		]]);
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'normal');
	});

	it(`should request the Ghost target after the user becomes Ghost`, function () {
		battle = common.createBattle([[
			{species: 'Rapidash', moves: ['curse']},
		], [
			{species: 'Trevenant', item: 'laggingtail', moves: ['trickortreat']},
		]]);
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
		battle.makeChoices();
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'normal');
	});

	it(`should not request a target after the user stops being Ghost`, function () {
		battle = common.createBattle([[
			{species: 'Gengar', moves: ['curse']},
		], [
			{species: 'Jellicent', moves: ['soak']},
		]]);
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'normal');
		battle.makeChoices();
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
	});

	it(`should not request a target if the user is a known non-Ghost`, function () {
		battle = common.createBattle([[
			{species: 'Blastoise', moves: ['curse']},
		], [
			{species: 'Caterpie', moves: ['sleeptalk']},
		]]);
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
	});

	it(`should not request a target if the user is an unknown non-Ghost`, function () {
		battle = common.createBattle([[
			{species: 'Blastoise', moves: ['curse', 'reflecttype']},
		], [
			{species: 'Zoroark', ability: 'illusion', moves: ['sleeptalk']},
			{species: 'Gengar', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move reflecttype', 'auto');

		assert.deepEqual(battle.p1.active[0].getTypes(), ["Dark"]); // Copied Zoroark's type instead of Gengar's
		assert.equal(battle.p1.active[0].getMoveRequestData().moves[0].target, 'self');
	});

	it(`should curse a non-Ghost user with Protean`, function () {
		battle = common.createBattle([[
			{species: 'Greninja', ability: 'protean', moves: ['curse', 'spite']},
		], [
			{species: 'Caterpie', moves: ['sleeptalk']},
		]]);
		const greninja = battle.p1.active[0];
		const caterpie = battle.p2.active[0];
		const curseResidual = Math.floor(greninja.maxhp / 4);
		battle.makeChoices();
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2) - curseResidual, `Greninja should have Cursed itself`);
		assert.fullHP(caterpie);

		battle.makeChoices('move spite', 'auto');
		assert.equal(greninja.hp, greninja.maxhp - Math.floor(greninja.maxhp / 2) - curseResidual * 2, `Greninja should have taken Curse damage again`);
		assert.fullHP(caterpie);
	});

	it(`should curse the target if a Ghost user has Protean`, function () {
		battle = common.createBattle([[
			{species: 'Gengar', ability: 'protean', moves: ['curse']},
		], [
			{species: 'Caterpie', moves: ['sleeptalk']},
		]]);
		const gengar = battle.p1.active[0];
		const caterpie = battle.p2.active[0];
		const curseResidual = Math.floor(caterpie.maxhp / 4);
		battle.makeChoices();
		assert.equal(gengar.hp, gengar.maxhp - Math.floor(gengar.maxhp / 2));
		assert.equal(caterpie.hp, caterpie.maxhp - curseResidual);

		battle.makeChoices();
		assert.equal(gengar.hp, gengar.maxhp - Math.floor(gengar.maxhp / 2));
		assert.equal(caterpie.hp, caterpie.maxhp - curseResidual * 2);
	});

	it(`should target either random opponent if the target is an ally`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Gengar', moves: ['curse']},
		], [
			{species: 'Caterpie', moves: ['sleeptalk']},
			{species: 'Metapod', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk, move curse -1', 'auto');

		const wynaut = battle.p1.active[0];
		const caterpie = battle.p2.active[0];
		const metapod = battle.p2.active[1];
		assert.fullHP(wynaut);
		assert(caterpie.maxhp !== caterpie.hp || metapod.maxhp !== metapod.hp, `Either Caterpie or Metapod should have lost HP from Curse`);
	});

	it(`[Gen 7] should target the ally if the target is an ally`, function () {
		battle = common.gen(7).createBattle({gameType: 'doubles'}, [[
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Gengar', moves: ['curse']},
		], [
			{species: 'Caterpie', moves: ['sleeptalk']},
			{species: 'Metapod', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk, move curse -1', 'auto');

		const wynaut = battle.p1.active[0];
		assert.false.fullHP(wynaut);
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
			assert.false.fullHP(cursePartner); // Partner afflicted by Curse

			// Foes unaffected by Curse
			assert.fullHP(p2active[0]);
			assert.fullHP(p2active[1]);
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
