'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Disguise', function () {
	afterEach(() => battle.destroy());

	it('should block damage from one move', function () {
		battle = common.gen(7).createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Mewtwo', ability: 'pressure', moves: ['psystrike']},
		]]);
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices());
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should only block damage from the first hit of a move', function () {
		battle = common.gen(7).createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Beedrill', ability: 'swarm', moves: ['twineedle']},
		]]);
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it(`should bust Disguise on self-hit confusion`, function () {
		battle = common.gen(7).createBattle({forceRandomChance: true}, [[
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Sableye', ability: 'prankster', moves: ['confuseray']},
		]]);

		battle.makeChoices();
		assert(battle.p1.active[0].abilityState.busted);
	});

	it('should not block damage from weather effects', function () {
		battle = common.createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Tyranitar', ability: 'sandstream', moves: ['rest']},
		]]);
		assert.hurts(battle.p1.active[0], () => battle.makeChoices());
	});

	it('should not block damage from entry hazards', function () {
		battle = common.createBattle([[
			{species: 'Zangoose', ability: 'toxicboost', item: 'laggingtail', moves: ['return']},
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'forretress', ability: 'sturdy', item: 'redcard', moves: ['spikes']},
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p1.active[0]);
	});

	it('should not block status moves or damage from status', function () {
		battle = common.createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Ariados', ability: 'swarm', moves: ['toxicthread']},
		]]);
		const pokemon = battle.p1.active[0];
		assert.sets(() => pokemon.status, 'psn', () => battle.makeChoices());
		assert.statStage(pokemon, 'spe', -1);
		assert.false.fullHP(pokemon);
	});

	it('should not block secondary effects from damaging moves', function () {
		battle = common.gen(7).createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Pikachu', ability: 'lightningrod', moves: ['nuzzle']},
		]]);
		const pokemon = battle.p1.active[0];
		assert.sets(() => pokemon.status, 'par', () => battle.makeChoices());
		assert.fullHP(pokemon);
	});

	it('should cause Counter to deal 1 damage if it blocks a move', function () {
		battle = common.createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['counter']},
		], [
			{species: 'Weavile', ability: 'pressure', moves: ['feintattack']},
		]]);
		assert.hurtsBy(battle.p2.active[0], 1, () => battle.makeChoices());
	});

	it('should not trigger critical hits while active', function () {
		battle = common.createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['sleeptalk']},
		], [
			{species: 'Cryogonal', ability: 'noguard', moves: ['frostbreath']},
		]]);
		battle.makeChoices();
		assert(battle.log.every(line => !line.startsWith('|-crit')));
	});

	it(`should not work while Transformed`, function () {
		battle = common.createBattle([[
			{species: 'Mimikyu', ability: 'disguise', moves: ['transform']},
		], [
			{species: 'Mimikyu', ability: 'disguise', moves: ['sleeptalk', 'aerialace']},
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move aerialace');
		const transformedMimikyu = battle.p1.active[0];
		assert.species(transformedMimikyu, 'Mimikyu', `Transformed Mimikyu should not have changed to Mimikyu-busted after taking damage`);
		assert.false.fullHP(transformedMimikyu);
	});
});
