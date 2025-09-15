'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Conversion2', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change users type to resist', () => {
		battle = common.createBattle([
			[{ species: 'porygon2', moves: ['sleeptalk', 'conversion2', 'spore'] }],
			[{ species: 'raticate', moves: ['tackle'] },
				{ species: 'zapdos', moves: ['thundershock', 'sleeptalk'] }],
		]);
		battle.makeChoices('move conversion2', 'move tackle');
		assert(['Rock', 'Ghost', 'Steel'].includes(battle.p1.active[0].getTypes()[0]));
		battle.makeChoices('move spore', 'switch 2');
		battle.makeChoices('move conversion2', 'move sleeptalk');
		assert(['Electric', 'Grass', 'Ground', 'Dragon'].includes(battle.p1.active[0].getTypes()[0]), 'should change type based on submove');
	});

	it('should respect the determined type of the last move', () => {
		battle = common.createBattle([
			[{ species: 'porygon2', moves: ['electrify', 'conversion2'] }],
			[{ species: 'shuckle', moves: ['tackle'] }],
		]);
		battle.makeChoices('move electrify', 'move tackle');
		battle.makeChoices('move conversion2', 'move tackle');
		assert(['Electric', 'Grass', 'Ground', 'Dragon'].includes(battle.p1.active[0].getTypes()[0]), 'Tackle should be considered Electric');
	});

	it('should fail if the last move was typeless', () => {
		battle = common.createBattle([
			[{ species: 'porygon2', moves: ['conversion2'] }],
			[{ species: 'raticate', item: 'assaultvest', moves: ['taunt'] }],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].getTypes()[0], 'Normal');
	});

	it('should fail to change to a type the user already has', () => {
		// Gen 5 to force Steel-type
		battle = common.gen(5).createBattle([
			[{ species: 'forretress', moves: ['conversion2'] }],
			[{ species: 'salamence', moves: ['dragonrage'] }],
		]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].getTypes()[0], 'Bug');
	});

	describe('[Gen 4]', () => {
		it('should not fail if the last move was Struggle', () => {
			battle = common.gen(4).createBattle([
				[{ species: 'porygon2', moves: ['conversion2'] }],
				[{ species: 'raticate', item: 'assaultvest', moves: ['taunt'] }],
			]);
			battle.makeChoices();
			assert(['Rock', 'Ghost', 'Steel'].includes(battle.p1.active[0].getTypes()[0]));
		});
	});

	describe('[Gen 3]', () => {
		it('should not fail to change to a type the user already has', () => {
			battle = common.gen(3).createBattle([
				[{ species: 'forretress', moves: ['conversion2'] }],
				[{ species: 'salamence', moves: ['dragonrage'] }],
			]);
			battle.makeChoices();
			assert.equal(battle.p1.active[0].getTypes()[0], 'Steel');
		});
	});
});
