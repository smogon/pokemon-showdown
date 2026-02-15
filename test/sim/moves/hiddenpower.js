'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Hidden Power', () => {
	afterEach(() => {
		battle.destroy();
	});

	for (const gen of [2, 3]) {
		describe(`[Gen ${gen}]`, () => {
			it('should trigger counter when it is special', () => {
				battle = common.gen(gen).createBattle();
				battle.setPlayer('p1', { team: [{ species: 'Shuckle', moves: ['hiddenpowerfire'] }] });
				battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['counter'] }] });
				battle.makeChoices();
				assert.false.fullHP(battle.p1.active[0]);
			});

			it('should not trigger mirror coat when it is special', () => {
				battle = common.gen(gen).createBattle();
				battle.setPlayer('p1', { team: [{ species: 'Shuckle', moves: ['hiddenpowerfire'] }] });
				battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['mirrorcoat'] }] });
				battle.makeChoices();
				assert.fullHP(battle.p1.active[0]);
			});

			it('should not trigger mirror coat when it is physical', () => {
				battle = common.gen(gen).createBattle();
				battle.setPlayer('p1', { team: [{ species: 'Shuckle', moves: ['hiddenpowerrock'] }] });
				battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['mirrorcoat'] }] });
				battle.makeChoices();
				assert.fullHP(battle.p1.active[0]);
			});

			it('should trigger counter when it is physical', () => {
				battle = common.gen(gen).createBattle();
				battle.setPlayer('p1', { team: [{ species: 'Shuckle', moves: ['hiddenpowerrock'] }] });
				battle.setPlayer('p2', { team: [{ species: 'Shuckle', moves: ['counter'] }] });
				battle.makeChoices();
				assert.false.fullHP(battle.p1.active[0]);
			});
		});
	}
});
