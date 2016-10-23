'use strict';

const assert = require('./../../assert');

describe('Mod loader', function () {
	it('should work fine in any order', function () {
		{
			Chat.uncacheTree('./tools');
			let Tools = require('./../../../tools');
			assert.strictEqual(Tools.mod('gen2').getTemplate('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.strictEqual(Tools.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
		{
			Chat.uncacheTree('./tools');
			let Tools = require('./../../../tools');
			Tools.mod('gen2').getTemplate('nidoking');
			Tools.mod('gen4').getMove('crunch');
			assert.strictEqual(Tools.mod('gen2').getTemplate('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.strictEqual(Tools.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
	});
});
