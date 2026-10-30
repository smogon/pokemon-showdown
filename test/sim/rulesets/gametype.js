'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Game Type Rule', () => {
	describe('Validation', () => {
		it('should reject invalid game types', () => {
			assert.throws(() => Dex.formats.validate('gen9customgame@@@Game Type = Wonder Launcher'));
		});

		it('should support all game types', () => {
			for (const gameType of Dex.getSupportedGameTypes()) {
				Dex.formats.validate(`gen9customgame@@@Game Type = ${gameType}`);
			}
		});

		it('should reject game types that require too many Pokémon', () => {
			assert.throws(() => Dex.formats.validate('gen9customgame@@@Game Type = triples,Picked Team Size = 1'));
		});

		it('should reject Partners-in-Crime Singles', () => {
			assert.throws(() => Dex.formats.validate('gen9partnersincrime@@@Game Type = singles'));
		});

		it('should reject Shared Power Doubles', () => {
			assert.throws(() => Dex.formats.validate('gen9sharedpower@@@Game Type = doubles'));
		});
	});

	describe('Simulation', () => {
		afterEach(() => battle.destroy());

		it('should support adding FFA to random formats', () => {
			battle = common.createBattle({ formatid: 'gen91v1factory@@@Game Type = freeforall' });
			assert.equal(battle.gameType, 'freeforall');
			assert.equal(battle.sides.length, 4);
		});

		it('should support adding FFA to OMs', () => {
			battle = common.createBattle({ formatid: 'gen9mixandmega@@@Game Type = freeforall' }, [[
				{ species: 'Calyrex', moves: ['sleeptalk'] },
			], [
				{ species: 'Victini', ability: 'Victory Star', moves: ['vcreate'] },
			], [
				{ species: 'Chansey', moves: ['sleeptalk'] },
			], [
				{ species: 'Tyrunt', moves: ['crunch'] },
			]]);
			assert.equal(battle.gameType, 'freeforall');
			assert.equal(battle.sides.length, 4);
		});
	});
});
