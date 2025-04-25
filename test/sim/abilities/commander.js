'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Commander', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should skip Tatsugiri's action while commanding`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'wobbuffet', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['swordsdance'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
		]]);
		assert.cantMove(() => battle.p2.choose('move swordsdance', 'move sleeptalk'));
	});

	it(`should not work if another Pokemon is Transformed into Dondozo`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'mew', moves: ['transform'] },
		]]);

		battle.makeChoices('auto', 'move sleeptalk, move transform 2');
		const mewDondozo = battle.p2.active[1];
		assert.false(!!mewDondozo.volatiles['commanded']);
	});

	it(`should not work if another Pokemon is Transformed into Tatsugiri`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
		], [
			{ species: 'roggenrola', moves: ['sleeptalk'] },
			{ species: 'sunkern', ability: 'commander', moves: ['transform'] },
			{ species: 'dondozo', moves: ['transform'] },
		]]);

		battle.makeChoices('auto', 'move sleeptalk, move transform 2');
		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		const dondozo = battle.p2.active[0];
		assert.false(!!dondozo.volatiles['commanded'], `Transformed Sunkern into another Tatsugiri should not trigger Commander`);
	});

	it(`should work if Tatsugiri is Transformed into another Pokemon with Commander`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'sunkern', ability: 'commander', moves: ['sleeptalk'] },
		], [
			{ species: 'roggenrola', moves: ['sleeptalk'] },
			{ species: 'tatsugiri', ability: 'commander', moves: ['transform'] },
			{ species: 'dondozo', moves: ['transform'] },
		]]);

		battle.makeChoices('auto', 'move sleeptalk, move transform 2');
		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		const dondozo = battle.p2.active[0];
		assert(!!dondozo.volatiles['commanded']);
	});

	it(`should work if Dondozo is Transformed`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'diglett', moves: ['sleeptalk'] },
		], [
			{ species: 'dondozo', moves: ['transform'] },
			{ species: 'roggenrola', moves: ['sleeptalk'] },
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('auto', 'move transform 2, move sleeptalk');
		battle.makeChoices('auto', 'move sleeptalk, switch 3');
		const dondozo = battle.p2.active[0];
		assert(!!dondozo.volatiles['commanded']);
	});

	it(`should cause Tatsugiri to dodge all moves, including moves which normally bypass semi-invulnerability`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'machamp', ability: 'noguard', moves: ['closecombat'] },
			{ species: 'seviper', moves: ['toxic'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move closecombat 1, move toxic 1', 'auto');

		// Tatsugiri shouldn't be damaged from No Guard CC or Toxic
		assert.fullHP(battle.p2.active[0]);

		// It shouldn't redirect to Dondozo either
		assert.fullHP(battle.p2.active[1]);
	});

	it(`should prevent all kinds of switchouts`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', item: 'redcard', ability: 'noguard', moves: ['sleeptalk', 'tackle', 'dragontail'] },
			{ species: 'gyarados', item: 'ejectbutton', ability: 'intimidate', moves: ['sleeptalk', 'trick', 'roar'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk', 'peck'] },
			{ species: 'rufflet', moves: ['sleeptalk'] },
		]]);

		// const tatsugiri = battle.p2.active[0];
		const dondozo = battle.p2.active[1];

		battle.makeChoices('move tackle 2, move trick 2', 'auto');
		assert.holdsItem(dondozo);
		assert.equal(battle.requestState, 'move', 'It should not have switched out on Eject Button');

		battle.makeChoices('auto', 'move peck 1');
		assert.false.holdsItem(battle.p1.active[0]);
		assert.equal(battle.requestState, 'move', 'It should not have switched out on Red Card');

		battle.makeChoices('move dragontail 2, move roar 2', 'auto');
		assert.equal(battle.requestState, 'move', 'It should not have switched out on standard phazing moves');
	});

	it.skip(`should prevent Eject Pack switchouts`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', item: 'redcard', ability: 'noguard', moves: ['sleeptalk', 'tackle', 'dragontail'] },
			{ species: 'gyarados', item: 'ejectbutton', ability: 'intimidate', moves: ['sleeptalk', 'trick', 'roar'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', item: 'ejectpack', moves: ['sleeptalk'] },
			{ species: 'dondozo', item: 'ejectpack', moves: ['sleeptalk', 'peck'] },
			{ species: 'rufflet', moves: ['sleeptalk'] },
		]]);

		const tatsugiri = battle.p2.active[0];
		const dondozo = battle.p2.active[1];

		assert.statStage(tatsugiri, 'atk', -1);
		assert.equal(battle.requestState, 'move', 'It should not have switched out on Eject Pack');
		assert.holdsItem(tatsugiri);
		assert.statStage(dondozo, 'atk', 1);
		assert.holdsItem(dondozo);
	});

	it(`should cause Dondozo to stay commanded even if Tatsugiri faints`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'hypno', moves: ['sleeptalk'] },
			{ species: 'shuckle', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', item: 'toxicorb', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk', 'orderup'] },
			{ species: 'teddiursa', moves: ['sleeptalk'] },
			{ species: 'tatsugiridroopy', ability: 'commander', moves: ['sleeptalk'] },
		]]);

		// Kill turns for Toxic Orb to KO Tatsugiri
		for (let i = 0; i < 7; i++) battle.makeChoices();
		battle.makeChoices('', 'switch teddiursa');
		assert.cantMove(() => battle.p2.choose('move sleeptalk, switch tatsugiri'));
		battle.makeChoices('auto', 'switch tatsugiridroopy, move orderup 1');
		assert.statStage(battle.p2.pokemon[1], 'atk', 3);
	});

	it(`should allow one Tatsugiri to occupy multiple Dondozo`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', ability: 'noguard', moves: ['sheercold'] },
			{ species: 'shuckle', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('move sheercold 2, move sleeptalk', 'auto');
		battle.makeChoices('', 'switch 3');

		const secondDondozo = battle.p2.active[1];
		assert(!!secondDondozo.volatiles['commanded']);
	});

	it(`should not work in Multi Battles`, () => {
		battle = common.createBattle({ gameType: 'multi' }, [[
			{ species: 'diggersby', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
		], [
			{ species: 'cubone', moves: ['sleeptalk'] },
		], [
			{ species: 'dondozo', moves: ['sleeptalk'] },
		]]);

		const dondozo = battle.p4.active[0];
		assert.false(!!dondozo.volatiles['commanded']);
	});

	it(`should prevent Dondozo and Tatsugiri from combining if Commander is suppressed`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'shuckle', moves: ['sleeptalk'] },
			{ species: 'weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
		]]);

		const dondozo = battle.p2.active[1];
		assert.false(!!dondozo.volatiles['commanded']);

		battle.makeChoices('move sleeptalk, switch 3', 'auto');
		assert(!!dondozo.volatiles['commanded']);
	});

	it(`should not split apart Dondozo and Tatsugiri if Neutralizing Gas switches in`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'shuckle', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['dazzlinggleam'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		battle.makeChoices();

		const dondozo = battle.p2.active[1];
		assert(!!dondozo.volatiles['commanded']);

		const shuckle = battle.p1.active[0];
		assert.fullHP(shuckle, `Shuckle should have never taken damage from Dazzling Gleam`);
	});

	it(`should allow Tatsugiri to move again if Dondozo faints while Neutralizing Gas is active`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'shuckle', moves: ['sleeptalk'] },
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiri', ability: 'commander', moves: ['dazzlinggleam'] },
			{ species: 'dondozo', moves: ['memento'] },
		]]);

		battle.makeChoices('switch 3, move sleeptalk', 'auto');
		battle.makeChoices();

		const tatsugiri = battle.p2.pokemon[0];
		assert.false(!!tatsugiri.volatiles['commanding']);

		battle.makeChoices();
		const shuckle = battle.p1.active[0];
		assert.false.fullHP(shuckle, `Shuckle should have taken damage from Dazzling Gleam`);
	});

	it(`should activate after hazards run`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'regieleki', moves: ['toxicspikes'] },
			{ species: 'registeel', moves: ['sleeptalk'] },
		], [
			{ species: 'shuckle', moves: ['uturn'] },
			{ species: 'dondozo', moves: ['sleeptalk'] },
			{ species: 'tatsugiri', ability: 'commander', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		const tatsugiri = battle.p2.pokemon[0];

		assert.equal(tatsugiri.status, 'psn');
	});
});
