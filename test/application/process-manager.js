'use strict';

const assert = require('assert');
const path = require('path');

const ProcessManager = require('../../process-manager');
const ProcessWrapper = ProcessManager.ProcessWrapper;

// const DatasearchManager = require('../../chat-plugins/datasearch.js').DatasearchManager;
// const SimulatorManager = require('../../simulator.js').SimulatorManager;
// const TeamValidatorManager = require('../../team-validator.js').TeamValidatorManager;
// const VerifierManager = require('../../verifier.js').VerifierManager;

// DO NOT CLEAR PROCESSMANAGER'S CACHE DURING THESE TESTS
// Delete the ProcessManager instances from it manually unless you want to break
// other tests that rely on what's already there at the beginning of these tests
// and watch the world burn.
describe('ProcessManager', function () {
	it('should construct', function () {
		let pm;
		let cacheSize = ProcessManager.cache.size;
		assert.doesNotThrow(() => {
			pm = new ProcessManager({
				execFile: path.resolve('./process-manager'),
				maxProcesses: 0,
				isChatBased: false,
			});
		});
		assert.strictEqual(ProcessManager.cache.size, cacheSize + 1);
		assert.ok(ProcessManager.cache.delete(pm));
	});

	describe('ProcessWrapper', function () {
		beforeEach(function () {
			this.pm = new ProcessManager({
				execFile: path.resolve('./process-manager'),
				maxProcesses: 0,
				isChatBased: false,
			});
		});

		afterEach(function () {
			// Temporary until final process-manager.js refactor
			this.pm.processes.forEach(pw => {
				pw.process.removeAllListeners('message');
				pw.process.disconnect();
				pw.process = null;
				pw.removeAllListeners('message');
				pw.pendingTasks.clear();
				pw.PM.processes.splice(pw.PM.processes.indexOf(pw), 1);
				pw.PM = null;
			});

			ProcessManager.cache.delete(this.pm);
		});

		it('should construct', function () {
			assert.doesNotThrow(() => new ProcessWrapper(this.pm));
		});
	});
});
