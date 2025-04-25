'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Flame Orb', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should not trigger when entering battle', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Magikarp', ability: 'swiftswim', item: 'focussash', moves: ['splash'] },
			{ species: 'Ursaring', ability: 'guts', item: 'flameorb', moves: ['protect'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Breloom', ability: 'technician', moves: ['bulletseed'] },
		] });
		battle.makeChoices('move splash', 'move bulletseed');
		battle.makeChoices('switch 2', '');
		assert.notEqual(battle.p1.active[0].status, 'brn');
	});

	it('should trigger after one turn', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Ursaring', ability: 'guts', item: 'flameorb', moves: ['protect'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Magikarp', ability: 'swiftswim', moves: ['splash'] }] });
		const target = battle.p1.active[0];
		assert.sets(() => target.status, 'brn', () => battle.makeChoices('move protect', 'move splash'));
	});
});
