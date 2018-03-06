'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protective Pads', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent abilities triggered by contact from acting', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Cofagrigus", ability: 'mummy', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Hariyama", ability: 'thickfat', item: 'protectivepads', moves: ['bulletpunch']}]);
		const attacker = battle.p2.active[0];
		battle.commitDecisions();
		assert.strictEqual(attacker.ability, 'thickfat');
		const mummyActivationMessages = battle.log.filter(logStr => logStr.startsWith('|-activate|') && logStr.includes('Mummy'));
		assert.strictEqual(mummyActivationMessages.length, 1, "Mummy should activate only once");
		assert.ok(mummyActivationMessages[0].includes('Cofagrigus'), "Source of Mummy activation should be included");
		assert.false(mummyActivationMessages[0].includes('Thick Fat'), "Attacker's ability should not be revealed");
	});
});
