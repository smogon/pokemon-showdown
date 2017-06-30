'use strict';

const assert = require('assert');

const ProcessManager = require('../../process-manager');
const {ProcessWrapper} = ProcessManager;

describe('ProcessManager', function () {
	const setup = isChild => {
		before(function () {
			process.env.PS_MANAGED_PROCESS = '' + +isChild;

			this.PM = new ProcessManager({
				execFile: require.resolve('../../process-manager'),
				maxProcesses: 1,
				isChatBased: false,
			});
		});

		after(function () {
			this.PM.unspawn();
			ProcessManager.cache.delete(this.PM);
			delete process.env.PS_MANAGED_PROCESS;
		});
	};

	context('in the parent process', function () {
		setup(false);

		it('should spawn child processes', function () {
			assert.strictEqual(this.PM.processes.size, this.PM.maxProcesses);
		});
	});

	context('in child processes', function () {
		setup(true);

		it('should not spawn any child processes', function () {
			assert.ok(!this.PM.processes.size);
		});
	});

	describe('ProcessWrapper', function () {
		beforeEach(function () {
			let execFile = require.resolve('../../process-manager');
			this.PW = new ProcessWrapper(execFile);
		});

		afterEach(function (done) {
			if (!this.PW.connected) return done();
			this.PW.once('disconnect', done);
			this.PW.release();
		});

		it('should only disconnect while deactivated and connected', function (done) {
			assert.ok(!this.PW.release());
			this.PW.active = false;
			this.PW.once('disconnect', () => {
				assert.ok(!this.PW.release());
				this.PW.active = true;
				assert.ok(!this.PW.release());
				done();
			});
			assert.ok(this.PW.release());
		});

		it('should only send while activated and connected', function (done) {
			assert.ok(this.PW.send(''));
			this.PW.active = false;
			assert.ok(!this.PW.send(''));
			this.PW.once('disconnect', () => {
				assert.ok(!this.PW.send(''));
				this.PW.active = true;
				assert.ok(!this.PW.send(''));
				done();
			});
			this.PW.release();
		});
	});
});
