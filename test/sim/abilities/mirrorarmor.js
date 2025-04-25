'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Mirror Armor", () => {
	afterEach(() => {
		battle.destroy();
	});

	it("should bounce boosts back to the source", () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [
			{ species: 'Corviknight', ability: 'mirrorarmor', moves: ['endure'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Machop', ability: 'noguard', moves: ['rocktomb', 'leer'] },
		] });
		battle.makeChoices('auto', 'move rocktomb');
		const corv = battle.p1.active[0];
		const machop = battle.p2.active[0];
		assert.statStage(corv, 'spe', 0);
		assert.statStage(machop, 'spe', -1);
		battle.makeChoices('auto', 'move leer');
		assert.statStage(corv, 'def', 0);
		assert.statStage(machop, 'def', -1);
	});

	it("should reflect Parting Shot's stat drops, then the Parting Shot user should switch", () => {
		battle = common.createBattle([[
			{ species: 'Corviknight', ability: 'mirrorarmor', moves: ['sleeptalk'] },
		], [
			{ species: 'Drapion', moves: ['partingshot'] },
			{ species: 'Pangoro', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		const corv = battle.p1.active[0];
		const drapion = battle.p2.active[0];
		assert.statStage(corv, 'atk', 0);
		assert.statStage(corv, 'spa', 0);
		assert.statStage(drapion, 'atk', -1);
		assert.statStage(drapion, 'spa', -1);
		assert.equal(battle.requestState, 'switch');
	});

	it("should activate, but silently, if the source has fainted", () => {
		battle = common.createBattle([[
			{ species: 'corviknight', ability: 'mirrorarmor', moves: ['bravebird'] },
		], [
			{ species: 'gossifleur', ability: 'cottondown', moves: ['sleeptalk'] },
			{ species: 'wynaut', ability: 'shadowtag', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.statStage(battle.p1.active[0], 'spe', 0);
		for (const line of battle.log) {
			assert.false(line.includes("Mirror Armor"), `Expected no Mirror Armor message, but got the following message:\n${line}`);
		}
	});
});
