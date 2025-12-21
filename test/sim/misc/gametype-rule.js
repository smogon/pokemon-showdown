'use strict';

const assert = require('assert').strict;
const common = require('../../common');

let battle;

describe('Game Type Rule', () => {
	afterEach(() => {
		if (battle && battle.destroy) battle.destroy();
	});

	it('should override a singles format to doubles', () => {
		battle = common.createBattle({ customRules: ['Game Type = Doubles'] });
		assert.equal(battle.gameType, 'doubles');
	});

	it('should override a doubles format to singles', () => {
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Singles'] });
		assert.equal(battle.gameType, 'singles');
	});

	it('should override format to triples', () => {
		battle = common.createBattle({ customRules: ['Game Type = Triples'] });
		assert.equal(battle.gameType, 'triples');
	});

	it('should support multi game type', () => {
		battle = common.createBattle({ customRules: ['Game Type = Multi'] });
		assert.equal(battle.gameType, 'multi');
	});

	it('should support freeforall game type', () => {
		battle = common.createBattle({ customRules: ['Game Type = FreeForAll'] });
		assert.equal(battle.gameType, 'freeforall');
	});

	it('should work with double bang syntax to override existing rule', () => {
		// first set a game type rule, then override it
		battle = common.createBattle({ customRules: ['Game Type = Doubles', '!! Game Type = Singles'] });
		assert.equal(battle.gameType, 'singles');
	});

	it('should reject invalid game types', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = Invalid'] }),
			/Invalid game type/
		);
	});

	it('should be case-insensitive', () => {
		battle = common.createBattle({ customRules: ['Game Type = DOUBLES'] });
		assert.equal(battle.gameType, 'doubles');
	});
});
