'use strict';

/**
 * Compatibility layer betweeen Node.js, the browser,
 * and Pokémon Showdown implementation of Mock-FS
 *
 * @license MIT license
 */

const fs = require('fs');
const vm = require('vm');

module.exports = function (path, options, transformer) {
	if (arguments.length < 3 && typeof options === 'function') {
		transformer = options;
		options = {
			encoding: 'utf8',
		};
	} else if (!options) {
		options = {
			encoding: 'utf8',
		};
	}

	const sandbox = {window: {}};
	if (options.timers) {
		Object.assign(sandbox, {
			setTimeout: setTimeout,
			clearTimeout: clearTimeout,
			setImmediate: setImmediate,
			clearImmediate: clearImmediate,
		});
	}

	let fileContents = (function () {
		let error = null;
		try {
			return fs.readFileSync(path, options.encoding);
		} catch (err) {
			error = err;
			require('mock-fs').restore();
			return fs.readFileSync(path, options.encoding);
		} finally {
			if (error) {
				const fsMock = require('mock-fs');
				if (!fsMock.currentSandbox) throw new Error("Mock-FS must have its sandbox defined as `currentSandbox`");
				fsMock(fsMock.currentSandbox);
			}
		}
	})();
	if (typeof transformer === 'function') {
		fileContents = transformer(fileContents);
	}
	vm.runInNewContext(fileContents, sandbox);
	return sandbox;
};
