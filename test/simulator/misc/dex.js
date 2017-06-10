'use strict';

const assert = require('./../../assert');

describe('Mod loader', function () {
	it.skip('should work fine in any order', function () {
		{
			Chat.uncacheTree('./sim/dex');
			let Dex = require('./../../../sim/dex');
			assert.strictEqual(Dex.mod('gen2').getTemplate('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.strictEqual(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
		{
			Chat.uncacheTree('./sim/dex');
			let Dex = require('./../../../sim/dex');
			Dex.mod('gen2').getTemplate('nidoking');
			Dex.mod('gen4').getMove('crunch');
			assert.strictEqual(Dex.mod('gen2').getTemplate('nidoking').learnset.bubblebeam.join(','), '1M');
			assert.strictEqual(Dex.mod('gen2').getMove('crunch').secondaries[0].boosts.def, undefined);
		}
	});
});
