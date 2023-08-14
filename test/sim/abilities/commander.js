'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Commander', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should skip Tatsugiri's action while commanding`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'wobbuffet', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['swordsdance']},
			{species: 'dondozo', moves: ['sleeptalk']},
		]]);
		assert.cantMove(() => battle.p2.choose('move swordsdance', 'move sleeptalk'));
	});

	it(`should not work if either Pokemon is Transformed into Dondozo/Tatsugiri`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
			{species: 'mew', moves: ['transform']},
		]]);

		battle.makeChoices('auto', 'move sleeptalk, move transform 2');
		const mewDondozo = battle.p2.active[1];
		assert.false(!!mewDondozo.volatiles['commanded']);
	});

	it(`should not work if Tatsugiri is Transformed, and should work if Dondozo is Transformed`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
		], [
			{species: 'roggenrola', moves: ['sleeptalk']},
			{species: 'tatsugiri', ability: 'commander', moves: ['transform']},
			{species: 'dondozo', moves: ['transform']},
		]]);

		battle.makeChoices('auto', 'move sleeptalk, move transform 2');
		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		const dondozo = battle.p2.active[0];
		assert.false(!!dondozo.volatiles['commanded'], `Transformed Tatsugiri should not trigger Commander`);

		battle.makeChoices('auto', 'move transform 1, switch 3');
		battle.makeChoices('auto', 'move sleeptalk, switch 3');
		assert(!!dondozo.volatiles['commanded'], `Transformed Dondozo should trigger Commander`);
	});

	it.skip(`should cause Tatsugiri to dodge all moves, including moves which normally bypass semi-invulnerability`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'machamp', ability: 'noguard', moves: ['closecombat']},
			{species: 'seviper', moves: ['toxic']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move closecombat 1, move toxic 1', 'auto');

		// Tatsugiri shouldn't be damaged from No Guard CC or Toxic
		assert.fullHP(battle.p2.active[0]);

		// It shouldn't redirect to Dondozo either
		assert.fullHP(battle.p2.active[1]);
	});

	it(`should prevent all kinds of switchouts`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', item: 'redcard', ability: 'noguard', moves: ['sleeptalk', 'tackle', 'dragontail']},
			{species: 'gyarados', item: 'ejectbutton', ability: 'intimidate', moves: ['sleeptalk', 'trick', 'roar']},
		], [
			{species: 'tatsugiri', ability: 'commander', item: 'ejectpack', moves: ['sleeptalk']},
			{species: 'dondozo', item: 'ejectpack', moves: ['sleeptalk', 'peck']},
			{species: 'rufflet', moves: ['sleeptalk']},
		]]);

		const tatsugiri = battle.p2.active[0];
		const dondozo = battle.p2.active[1];

		assert.statStage(tatsugiri, 'atk', -1);
		assert.holdsItem(tatsugiri);
		assert.statStage(dondozo, 'atk', 1);
		assert.holdsItem(dondozo);
		assert.equal(battle.requestState, 'move', 'It should not have switched out on Eject Pack');

		battle.makeChoices('move tackle 2, move trick 2', 'auto');
		assert.holdsItem(dondozo);
		assert.equal(battle.requestState, 'move', 'It should not have switched out on Eject Button');

		battle.makeChoices('auto', 'move peck 1');
		assert.false.holdsItem(battle.p1.active[0]);
		assert.equal(battle.requestState, 'move', 'It should not have switched out on Red Card');

		battle.makeChoices('move dragontail 2, move roar 2', 'auto');
		assert.equal(battle.requestState, 'move', 'It should not have switched out on standard phazing moves');
	});

	it(`should cause Dondozo to stay commanded even if Tatsugiri faints`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'hypno', moves: ['sleeptalk']},
			{species: 'shuckle', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiri', ability: 'commander', item: 'toxicorb', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['sleeptalk', 'orderup']},
			{species: 'teddiursa', moves: ['sleeptalk']},
			{species: 'tatsugiridroopy', ability: 'commander', moves: ['sleeptalk']},
		]]);

		// Kill turns for Toxic Orb to KO Tatsugiri
		for (let i = 0; i < 7; i++) battle.makeChoices();
		battle.makeChoices('', 'switch teddiursa');
		assert.cantMove(() => battle.p2.choose('move sleeptalk, switch tatsugiri'));
		battle.makeChoices('auto', 'switch tatsugiridroopy, move orderup 1');
		assert.statStage(battle.p2.pokemon[1], 'atk', 3);
	});

	it(`should allow one Tatsugiri to occupy multiple Dondozo`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'noguard', moves: ['sheercold']},
			{species: 'shuckle', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['sleeptalk']},
			{species: 'dondozo', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move sheercold 2, move sleeptalk', 'auto');
		battle.makeChoices('', 'switch 3');

		const secondDondozo = battle.p2.active[1];
		assert(!!secondDondozo.volatiles['commanded']);
	});

	it(`should not work in Multi Battles`, function () {
		battle = common.createBattle({gameType: 'multi'}, [[
			{species: 'diggersby', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk']},
		], [
			{species: 'cubone', moves: ['sleeptalk']},
		], [
			{species: 'dondozo', moves: ['sleeptalk']},
		]]);

		const dondozo = battle.p4.active[0];
		assert.false(!!dondozo.volatiles['commanded']);
	});
});
