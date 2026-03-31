'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Game Type Rule', () => {
	afterEach(() => {
		if (battle?.destroy) battle.destroy();
	});

	it('should override a singles format to doubles', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Doubles' });
		assert.equal(battle.gameType, 'doubles');
	});

	it('should override a doubles format to singles', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Singles' });
		assert.equal(battle.gameType, 'singles');
	});

	it('should override format to triples', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Triples' });
		assert.equal(battle.gameType, 'triples');
	});

	it('should support multi game type when format is already multi or ffa', () => {
		battle = common.createBattle({ formatid: 'gen9freeforall@@@Game Type = Multi' });
		assert.equal(battle.gameType, 'multi');
	});

	it('should support freeforall game type when format is already multi or ffa', () => {
		battle = common.createBattle({ formatid: 'gen9freeforall@@@Game Type = FreeForAll' });
		assert.equal(battle.gameType, 'freeforall');
	});

	it('should work with double bang syntax to override existing rule', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Doubles,!!Game Type = Singles' });
		assert.equal(battle.gameType, 'singles');
	});

	it('should reject invalid game types', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ formatid: 'gen9customgame@@@Game Type = Invalid' }),
			/Invalid game type/
		);
	});

	it('should be case-insensitive', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = DOUBLES' });
		assert.equal(battle.gameType, 'doubles');
	});

	it('should reject doubles/triples with Chimera 1v1 Rule', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ formatid: 'gen9customgame@@@Chimera 1v1 Rule,Game Type=Doubles' }),
			/incompatible with Chimera 1v1|cannot be 1v1/
		);
		assert.throws(
			() => common.createBattle({ formatid: 'gen9customgame@@@Chimera 1v1 Rule,Game Type=Triples' }),
			/incompatible with Chimera 1v1|cannot be 1v1/
		);
	});

	it('should allow singles/doubles with Best Of', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Singles,Best Of = 3' });
		assert.equal(battle.gameType, 'singles');
		battle.destroy();
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Doubles,Best Of = 3' });
		assert.equal(battle.gameType, 'doubles');
	});

	it('should reject triples/multi/freeforall with Best Of', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ formatid: 'gen9customgame@@@Game Type = Triples,Best Of = 3' }),
			/Only single and doubles|Best-of/
		);
		assert.throws(
			() => common.createBattle({ formatid: 'gen9freeforall@@@Game Type = Multi,Best Of = 3' }),
			/Only single and doubles|Best-of/
		);
		assert.throws(
			() => common.createBattle({ formatid: 'gen9freeforall@@@Game Type = FreeForAll,Best Of = 3' }),
			/Only single and doubles|Best-of/
		);
	});

	it('should reject non-singles game types with format-specific restrictions', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ formatid: '[Gen 9] Shared Power @@@Game Type = Doubles' }),
			/The game type "doubles" is not supported in this format/
		);
	});

	it('should reject changing from 4-player to 2-player game types', () => {
		battle = null;
		assert.throws(
			() => common.createBattle({ formatid: 'gen9freeforall@@@Game Type = Singles' }),
			/The game type ".+?" is not supported in this format/
		);
		assert.throws(
			() => common.createBattle({ formatid: 'gen9freeforall@@@Game Type = Doubles' }),
			/The game type ".+?" is not supported in this format/
		);
	});

	it('should allow changing between 2-player game types', () => {
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Doubles' });
		assert.equal(battle.gameType, 'doubles');
		battle.destroy();
		battle = common.createBattle({ formatid: 'gen9customgame@@@Game Type = Singles' });
		assert.equal(battle.gameType, 'singles');
	});

	it('should allow changing between 4-player game types', () => {
		battle = common.createBattle({ formatid: 'gen9freeforall@@@Game Type = Multi' });
		assert.equal(battle.gameType, 'multi');
		battle.destroy();
		battle = common.createBattle({ formatid: 'gen9freeforall@@@Game Type = FreeForAll' });
		assert.equal(battle.gameType, 'freeforall');
	});

	it('should reject game types not listed in supportedGameTypes', () => {
		battle = null;
		// To safely test this, we can try to override a format with limited supportedGameTypes,
		// like Gen 9 Doubles OU, which hasn't defined \`supportedGameTypes\` explicitly,
		// so its \`supportedGameTypes\` will be derived as \`['doubles']\` from \`defaultGameType: 'doubles'\`.
		assert.throws(
			() => common.createBattle({ formatid: 'gen9doublesou@@@Game Type = Singles' }),
			/The game type "singles" is not supported in this format/
		);
	});
});
