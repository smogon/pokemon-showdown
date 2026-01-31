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
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Triples'] });
		assert.equal(battle.gameType, 'triples');
	});

	it('should support multi game type when format is already multi or ffa', () => {
		battle = common.createBattle({ gameType: 'freeforall', customRules: ['Game Type = Multi'] });
		assert.equal(battle.gameType, 'multi');
	});

	it('should support freeforall game type when format is already multi or ffa', () => {
		battle = common.createBattle({ gameType: 'multi', customRules: ['Game Type = FreeForAll'] });
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

	it('should allow singles/doubles/triples/multi with Best Of', () => {
		battle = common.createBattle({ customRules: ['Game Type = Singles', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'singles');
		battle.destroy();
		battle = common.createBattle({ customRules: ['Game Type = Doubles', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'doubles');
		battle.destroy();
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Triples', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'triples');
		battle.destroy();
		battle = common.createBattle({ gameType: 'multi', customRules: ['Best Of = 3'] });
		assert.equal(battle.gameType, 'multi');
	});

	it('should reject freeforall with Best Of', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ gameType: 'freeforall', customRules: ['Best Of = 3'] }),
			/Free-For-All battles cannot be a Best-of series/
		);
	});

	it('should reject non-singles game types with format-specific restrictions', () => {
		battle = null;
		// Shared Power format has onValidateRule that only allows singles
		assert.throws(
			() => common.createBattle({ formatid: '[Gen 9] Shared Power @@@Game Type = Doubles' }),
			/Shared Power currently does not support/
		);
	});

	it('should reject changing from 2-player to 4-player game types', () => {
		battle = null;
		// Singles to Multi/FFA
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = Multi'] }),
			/Changing between 2-player and 4-player game types is not supported/
		);
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = FreeForAll'] }),
			/Changing between 2-player and 4-player game types is not supported/
		);
		// Doubles to Multi/FFA
		assert.throws(
			() => common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Multi'] }),
			/Changing between 2-player and 4-player game types is not supported/
		);
		assert.throws(
			() => common.createBattle({ gameType: 'doubles', customRules: ['Game Type = FreeForAll'] }),
			/Changing between 2-player and 4-player game types is not supported/
		);
	});

	it('should reject changing from 4-player to 2-player game types', () => {
		battle = null;
		// Multi to Singles/Doubles
		assert.throws(
			() => common.createBattle({ gameType: 'multi', customRules: ['Game Type = Singles'] }),
			/Changing between 4-player and 2-player game types is not supported/
		);
		assert.throws(
			() => common.createBattle({ gameType: 'multi', customRules: ['Game Type = Doubles'] }),
			/Changing between 4-player and 2-player game types is not supported/
		);
		// FFA to Singles/Doubles
		assert.throws(
			() => common.createBattle({ gameType: 'freeforall', customRules: ['Game Type = Singles'] }),
			/Changing between 4-player and 2-player game types is not supported/
		);
		assert.throws(
			() => common.createBattle({ gameType: 'freeforall', customRules: ['Game Type = Doubles'] }),
			/Changing between 4-player and 2-player game types is not supported/
		);
	});

	it('should allow changing between 2-player game types', () => {
		// Singles <-> Doubles
		battle = common.createBattle({ customRules: ['Game Type = Doubles'] });
		assert.equal(battle.gameType, 'doubles');
		battle.destroy();
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Singles'] });
		assert.equal(battle.gameType, 'singles');
		battle.destroy();
		// Doubles <-> using existing format
		battle = common.createBattle({ formatid: '[Gen 9] Doubles OU @@@Game Type = Singles' });
		assert.equal(battle.gameType, 'singles');
	});

	it('should allow changing between 4-player game types', () => {
		// Multi <-> FFA
		battle = common.createBattle({ gameType: 'multi', customRules: ['Game Type = FreeForAll'] });
		assert.equal(battle.gameType, 'freeforall');
		battle.destroy();
		battle = common.createBattle({ gameType: 'freeforall', customRules: ['Game Type = Multi'] });
		assert.equal(battle.gameType, 'multi');
	});
});
