'use strict';

const assert = require('assert').strict;
const common = require('../../common');

let battle;

describe('Game Type Rule', () => {
	afterEach(() => {
		if (battle && battle.destroy) battle.destroy();
	});

	it('should override singles -> doubles', () => {
		battle = common.createBattle({ customRules: ['Game Type = Doubles'] });
		assert.equal(battle.gameType, 'doubles');
	});

	it('should override doubles -> singles', () => {
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Singles'] });
		assert.equal(battle.gameType, 'singles');
	});

	it('should override doubles -> triples', () => {
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Triples'] });
		assert.equal(battle.gameType, 'triples');
	});

	it('should override ffa -> multi'  , () => {
		battle = common.createBattle({ gameType: 'freeforall', customRules: ['Game Type = Multi'] });
		assert.equal(battle.gameType, 'multi');
	});

	it('should override multi -> ffa', () => {
		battle = common.createBattle({ gameType: 'multi', customRules: ['Game Type = FreeForAll'] });
		assert.equal(battle.gameType, 'freeforall');
	});

	it('should succeed with multiple overrides', () => {
		// set game type, then override
		battle = common.createBattle({ customRules: ['Game Type = Doubles', '!! Game Type = Singles'] });
		assert.equal(battle.gameType, 'singles');
	});

	it('should reject nonexistent game types', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = Perchance'] }),
			/not a valid game type/
		);
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

	it('should allow 2 player types with Best Of', () => {
		battle = common.createBattle({ customRules: ['Game Type = Singles', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'singles');
		battle.destroy();
		battle = common.createBattle({ customRules: ['Game Type = Doubles', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'doubles');
		battle.destroy();
		battle = common.createBattle({ gameType: 'doubles', customRules: ['Game Type = Triples', 'Best Of = 3'] });
		assert.equal(battle.gameType, 'triples');
		battle.destroy();
	});

	it('should reject freeforall/multi with Best Of', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ gameType: 'freeforall', customRules: ['Best Of = 3'] }),
			/Only two-player battles/
		);
		assert.throws(
			() => common.createBattle({ gameType: 'multi', customRules: ['Best Of = 3'] }),
			/Only two-player battles/
		);
	});

	it('should reject non-singles game types with format restrictions', () => {
		battle = null;
		// Shared Power has an onValidateRule to disallow non-singles, it should not be bypassed
		assert.throws(
			() => common.createBattle({ formatid: '[Gen 9] Shared Power @@@ Game Type = Doubles' }),
			/Shared Power currently does not support doubles battles/
		);
	});

	it('should reject changing from 2 to 4-players', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = Multi'] }),
			/Changing between 2-player and 4-player game types is not supported/
		);
		assert.throws(
			() => common.createBattle({ customRules: ['Game Type = FreeForAll'] }),
			/Changing between 2-player and 4-player game types is not supported/
		);
	});

	it('should reject changing from 4 to 2-players', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ gameType: 'multi', customRules: ['Game Type = Singles'] }),
			/game types is not supported/
		);
		assert.throws(
			() => common.createBattle({ gameType: 'freeforall', customRules: ['Game Type = Singles'] }),
			/game types is not supported/
		);
	});
});
