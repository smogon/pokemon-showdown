'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Dancer', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should only copy dance moves used by other Pokemon', function () {
		battle = common.createBattle([[
			{species: 'Oricorio', ability: 'dancer', moves: ['swordsdance']},
		], [
			{species: 'Oricorio', ability: 'dancer', moves: ['howl']},
		]]);
		battle.makeChoices('move swordsdance', 'move howl');
		assert.statStage(battle.p1.active[0], 'atk', 2);
		assert.statStage(battle.p2.active[0], 'atk', 3);
	});

	it('should activate in order of lowest to highest raw speed', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Shedinja', level: 98, ability: 'dancer', item: 'focussash', moves: ['sleeptalk']},
			{species: 'Shedinja', level: 99, ability: 'dancer', moves: ['sleeptalk']},
		], [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['fierydance']},
			{species: 'Shedinja', ability: 'dancer', moves: ['sleeptalk']},
		]]);
		const [, fastDancer] = battle.p1.active;
		const [wwDanceSource, foeDancer] = battle.p2.active;
		fastDancer.boostBy({spe: 6});
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance 1, move sleeptalk');
		assert.fainted(wwDanceSource);
		assert.fainted(foeDancer);
	});

	it('should activate in order of lowest to highest raw speed inside Trick Room', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Shedinja', level: 98, ability: 'dancer', item: 'focussash', moves: ['sleeptalk']},
			{species: 'Shedinja', level: 99, ability: 'dancer', moves: ['sleeptalk']},
		], [
			{species: 'Shedinja', ability: 'wonderguard', moves: ['fierydance', 'trickroom']},
			{species: 'Shedinja', ability: 'dancer', moves: ['sleeptalk']},
		]]);
		const [, fastDancer] = battle.p1.active;
		const [wwDanceSource, foeDancer] = battle.p2.active;
		fastDancer.boostBy({spe: 6});
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move trickroom, move sleeptalk');
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance 1, move sleeptalk');
		assert.fainted(wwDanceSource);
		assert.fainted(foeDancer);
	});

	it(`should not copy a move that was blocked by Protect`, function () {
		battle = common.createBattle([[
			{species: 'Oricorio', ability: 'dancer', moves: ['protect']},
		], [
			{species: 'Wynaut', ability: 'dancer', moves: ['fierydance']},
		]]);

		battle.makeChoices();
		assert.fullHP(battle.p2.active[0]);
	});

	it(`should not copy Teeter Dance when all targets are confused`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Oricorio', ability: 'dancer', moves: ['sleeptalk', 'protect']},
			{species: 'Slowbro', ability: 'owntempo', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', ability: 'dancer', item: 'persimberry', moves: ['sleeptalk', 'teeterdance']},
			{species: 'Slowking', ability: 'owntempo', moves: ['sleeptalk']},
		]]);

		const wynaut = battle.p2.active[0];
		battle.makeChoices('move protect, move sleeptalk', 'move teeterdance, move sleeptalk');
		assert.holdsItem(wynaut, `Persim Berry should not be consumed, because Dancer did not activate`);

		battle.makeChoices('auto', 'move teeterdance, move sleeptalk');
		assert(battle.log.some(line => line.includes('Dancer')));
	});

	it(`should not copy a Dance move that failed for other reasons`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'mew', ability: 'dancer', moves: ['dragondance', 'protect']},
			{species: 'wynaut', ability: 'dancer', moves: ['featherdance']},
		], [
			{species: 'oricoriopau', ability: 'dancer', moves: ['revelationdance', 'protect']},
			{species: 'shedinja', ability: 'wonderguard', moves: ['finalgambit']},
		]]);
		const mew = battle.p1.active[0];
		const wynaut = battle.p1.active[1];
		const oricorio = battle.p2.active[0];

		mew.boostBy({atk: 6, spe: 6});
		oricorio.boostBy({atk: -6});

		battle.makeChoices('move dragondance, move featherdance 1', 'move revelationdance -2, move finalgambit 1');
		assert.fullHP(oricorio, `Nothing should target Oricorio because Revelation Dance failed from Wonder Guard`);
		assert.statStage(wynaut, 'atk', 0, `Wynaut's attack should not have changed from either Feather Dance or Dragon Dance, because both failed`);
	});

	it(`should not copy a move that missed`, function () {
		battle = common.createBattle([[
			{species: 'Oricorio', ability: 'dancer', moves: ['revelationdance']},
		], [
			{species: 'Wynaut', ability: 'dancer', moves: ['dig']},
		]]);

		// Modding accuracy so Revelation Dance always misses if Oricorio uses it (Wynaut should in fact never use it though)
		battle.onEvent('Accuracy', battle.format, function (accuracy, target, pokemon, move) {
			return pokemon.id === 'wynaut';
		});

		battle.makeChoices(); // miss on initial use
		battle.makeChoices(); // miss into semi-invulnerability
		assert.false(battle.log.some(line => line.includes('Dancer')));
	});

	it('should copy a move that hit, but did 0 damage', function () {
		battle = common.createBattle([[
			{species: 'Oricorio', ability: 'dancer', moves: ['fierydance']},
		], [
			{species: 'Shedinja', ability: 'dancer', item: 'focussash', moves: ['meanlook']},
		]]);
		const dancer = battle.p1.active[0];
		assert.hurts(dancer, () => battle.makeChoices('move fierydance', 'move meanlook'));
	});

	it('should not activate if the holder fainted', function () {
		battle = common.createBattle([[
			{species: 'Oricoriopompom', ability: 'dancer', moves: ['revelationdance']},
		], [
			{species: 'oricorio', ability: 'dancer', level: 1, moves: ['sleeptalk']},
			{species: 'oricorio', ability: 'dancer', level: 1, moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert(!battle.log.includes('|-activate|p2: Oricorio|ability: Dancer'));
	});

	it('should target the user of a Dance move unless it was an ally attacking an opponent', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Oricorio', level: 98, ability: 'dancer', item: 'laggingtail', moves: ['sleeptalk', 'protect', 'teeterdance']},
			{species: 'Oricorio', level: 99, ability: 'heatproof', moves: ['fierydance', 'sleeptalk']},
		], [
			{species: 'Oricorio', ability: 'heatproof', moves: ['fierydance', 'sleeptalk']},
			{species: 'Suicune', ability: 'heatproof', moves: ['sleeptalk']},
		]]);

		const opponentTargetingAlly = battle.p2.active[0];
		assert.hurts(opponentTargetingAlly, () => battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance 2, move sleeptalk'));

		const opponentTargetingOpponent = battle.p2.active[0];
		assert.hurts(opponentTargetingOpponent, () => battle.makeChoices('move sleeptalk, move sleeptalk', 'move fierydance -2, move sleeptalk'));

		const allyTargetingDancer = battle.p1.active[1];
		assert.hurts(allyTargetingDancer, () => battle.makeChoices('move sleeptalk, move fierydance -1', 'move sleeptalk, move sleeptalk'));

		const allyTargetingOpponent = battle.p1.active[1];
		const allyHP = allyTargetingOpponent.hp;
		const opponentTargetedByAlly = battle.p2.active[1];
		const opponentNotTargetedByAlly = battle.p2.active[0];
		const opponentHP = opponentNotTargetedByAlly.hp;
		assert.hurts(opponentTargetedByAlly, () => battle.makeChoices('move sleeptalk, move fierydance 2', 'move sleeptalk, move sleeptalk'));
		assert.equal(allyTargetingOpponent.hp, allyHP);
		assert.equal(opponentNotTargetedByAlly.hp, opponentHP);
	});

	it('should adopt the target selected by copycat', function () {
		battle = common.createBattle({gameType: 'doubles', seed: [1, 2, 3, 4]}, [[
			{species: 'oricoriopau', ability: 'dancer', moves: ['featherdance']},
			{species: 'flamigo', moves: ['copycat']},
		], [
			{species: 'fletchinder', level: 1, moves: ['sleeptalk']},
			{species: 'squawkabilly', level: 1, moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move featherdance 1, move copycat', 'auto');
		const flamigo = battle.p1.active[1];
		const [fletchinder, squawkabilly] = battle.p2.active;
		assert.equal(flamigo.boosts.atk, 0);
		assert.equal(fletchinder.boosts.atk, -2);
		assert.equal(squawkabilly.boosts.atk, -4);
	});
});
