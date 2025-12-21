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

	it('should reject doubles/triples with Chimera 1v1 Rule', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ customRules: ['Chimera 1v1 Rule', 'Game Type = Doubles'] }),
			/incompatible with Chimera 1v1|cannot be 1v1/
		);
		assert.throws(
			() => common.createBattle({ customRules: ['Chimera 1v1 Rule', 'Game Type = Triples'] }),
			/incompatible with Chimera 1v1|cannot be 1v1/
		);
	});

	it('should reject non-singles/doubles with Best Of', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = Triples', 'Best Of = 3'] }),
			/incompatible with Best Of|Only single and doubles/
		);
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = Multi', 'Best Of = 3'] }),
			/incompatible with Best Of|Only single and doubles/
		);
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = FreeForAll', 'Best Of = 3'] }),
			/incompatible with Best Of|Only single and doubles/
		);
	});

	it('should allow singles/doubles with Best Of', () => {
		battle = common.createBattle({ customRules: ['Game Type = Singles', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'singles');
		battle.destroy();
		battle = common.createBattle({ customRules: ['Game Type = Doubles', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'doubles');
	});
});
