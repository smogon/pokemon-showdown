'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Mega Sol", () => {
	afterEach(() => {
		battle.destroy();
	});

	it("should emulate weather", () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Meganium', ability: 'megasol', moves: ['weatherball'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Gengar', moves: ['endure'] },
		] });
		battle.makeChoices('move weatherball', 'move endure');
		assert.false.fullHP(battle.p2.active[0]);
	});

	it("should ignore other weathers", () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Meganium', ability: 'megasol', moves: ['weatherball'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Regieleki', ability: 'waterabsorb', moves: ['raindance'] },
		] });
		battle.makeChoices('move weatherball', 'move raindance');
		assert.false.fullHP(battle.p2.active[0]);
	});
});
