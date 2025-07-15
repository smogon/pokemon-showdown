'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weather Ball', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should change type when used as a Z-move in weather', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: "Castform", item: 'normaliumz', moves: ['weatherball'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Gastly", level: 2, ability: 'drought', item: 'focussash', moves: ['splash'] },
		] });
		battle.makeChoices('move weatherball zmove', 'move splash');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not change type when called by a Z-move in weather', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: "Castform", item: 'normaliumz', moves: ['shadowball', 'assist'] },
			{ species: "Castform", moves: ['weatherball'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: "Gastly", level: 2, ability: 'drought', item: 'focussash', moves: ['splash'] },
		] });
		battle.makeChoices('move shadowball', 'move splash');
		battle.makeChoices('move assist zmove', 'move splash');
		assert(!battle.p2.active[0].fainted);
	});

	it('should change max moves if it has an -ate ability', () => {
		battle = common.gen(8).createBattle([[
			{ species: 'Aurorus', ability: 'refrigerate', moves: ['weatherball'] },
		], [
			{ species: 'Cofagrigus', ability: 'shellarmor', moves: ['sleeptalk'] },
		]]);
		assert.hurts(battle.p2.active[0], () => battle.makeChoices('move weatherball dynamax', 'move sleeptalk'));
		assert(battle.getDebugLog().includes('Max Hailstorm'));
	});

	describe('[Gen 3]', () => {
		it('should not trigger counter when it is special', () => {
			battle = common.gen(3).createBattle();
			battle.setPlayer('p1', { team: [{ species: 'Shuckle', ability: 'drizzle', moves: ['weatherball'] }] });
			battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['counter'] }] });
			battle.makeChoices();
			assert.fullHP(battle.p1.active[0]);
		});

		it('should trigger mirror coat when it is special', () => {
			battle = common.gen(3).createBattle();
			battle.setPlayer('p1', { team: [{ species: 'Shuckle', ability: 'drought', moves: ['weatherball'] }] });
			battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['mirrorcoat'] }] });
			battle.makeChoices();
			assert.false.fullHP(battle.p1.active[0]);
		});

		it('should not trigger mirror coat when it is physical', () => {
			battle = common.gen(3).createBattle();
			battle.setPlayer('p1', { team: [{ species: 'Shuckle', moves: ['weatherball'] }] });
			battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['mirrorcoat'] }] });
			battle.makeChoices();
			assert.fullHP(battle.p1.active[0]);
		});

		it('should trigger counter when it is physical', () => {
			battle = common.gen(3).createBattle();
			battle.setPlayer('p1', { team: [{ species: 'Shuckle', ability: 'sandstream', moves: ['weatherball'] }] });
			battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['counter'] }] });
			battle.makeChoices();
			assert.false.fullHP(battle.p1.active[0]);
		});
	});
});
