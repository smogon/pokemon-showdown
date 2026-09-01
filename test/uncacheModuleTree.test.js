'use strict';
const assert = require('assert');
const path = require('path');

const uncacheModuleTree = require('../tools/uncacheModuleTree');

describe('uncacheModuleTree', () => {
	const fixturesDir = path.resolve(__dirname, 'fixtures');
	const aPath = path.resolve(fixturesDir, 'modA.js');
	const bPath = path.resolve(fixturesDir, 'modB.js');

	beforeEach(() => {
		// ensure a clean slate for our fixtures
		delete require.cache[aPath];
		delete require.cache[bPath];

		// also clear cycle fixtures if present
		delete require.cache[path.resolve(fixturesDir, 'modCycleA.js')];
		delete require.cache[path.resolve(fixturesDir, 'modCycleB.js')];
	});

	it('should remove a module and its children from require.cache and return removed ids', () => {
		// load modules (modA requires modB)
		require(aPath);

		assert.ok(require.cache[aPath], 'modA should be cached after require');
		assert.ok(require.cache[bPath], 'modB should be cached after require (child of modA)');

		const removed = uncacheModuleTree(aPath, require);
		// expect both aPath and bPath (order doesn't matter)
		assert.ok(Array.isArray(removed), 'should return array of removed ids');
		assert.ok(removed.includes(aPath), 'returned removed ids should include modA');
		assert.ok(removed.includes(bPath), 'returned removed ids should include modB');

		assert.ok(!require.cache[aPath], 'modA should be uncached after uncacheModuleTree');
		assert.ok(!require.cache[bPath], 'modB should be uncached as child of modA');
	});

	it('is safe to call on non-cached modules', () => {
		delete require.cache[aPath];
		delete require.cache[bPath];
		assert.doesNotThrow(() => {
			const ret = uncacheModuleTree(aPath, require);
			assert.deepStrictEqual(ret, []);
		});
	});

	it('handles cycles without throwing (mutual requires)', () => {
		const cycleA = path.resolve(fixturesDir, 'modCycleA.js');
		const cycleB = path.resolve(fixturesDir, 'modCycleB.js');

		// load the cyclical modules
		require(cycleA);

		assert.ok(require.cache[cycleA], 'cycleA should be cached after require');
		assert.ok(require.cache[cycleB], 'cycleB should be cached after require (via cycle)');

		const removed = uncacheModuleTree(cycleA, require);
		assert.ok(Array.isArray(removed));
		assert.ok(removed.includes(cycleA));
		assert.ok(removed.includes(cycleB));

		assert.ok(!require.cache[cycleA], 'cycleA should be uncached');
		assert.ok(!require.cache[cycleB], 'cycleB should be uncached');
	});

	it('is idempotent (calling twice is harmless)', () => {
		require(aPath);
		const first = uncacheModuleTree(aPath, require);
		const second = uncacheModuleTree(aPath, require);
		assert.ok(Array.isArray(first));
		assert.deepStrictEqual(second, []);
	});
});
