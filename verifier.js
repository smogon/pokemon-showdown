/**
 * Verifier process
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is just an asynchronous implementation of a verifier for a
 * signed key, because Node.js's crypto functions are synchronous,
 * strangely, considering how everything else is asynchronous.
 *
 * I wrote this one day hoping it would help with performance, but
 * I don't think it had any noticeable effect.
 *
 * @license MIT license
 */

'use strict';

const crypto = require('crypto');
const ProcessManager = require('./process-manager');

class VerifierManager extends ProcessManager {
	/**
	 * @param {string} message
	 */
	onMessageUpstream(message) {
		// Protocol:
		// success: "[id]|1"
		// failure: "[id]|0"
		let pipeIndex = message.indexOf('|');
		let id = +message.substr(0, pipeIndex);
		let result = Boolean(~~message.slice(pipeIndex + 1));

		// @ts-ignore
		if (this.pendingTasks.has(id)) {
			// @ts-ignore
			this.pendingTasks.get(id)(result);
			// @ts-ignore
			this.pendingTasks.delete(id);
			// @ts-ignore
			this.release();
		}
	}

	/**
	 * @param {string} message
	 */
	onMessageDownstream(message) {
		// protocol:
		// "[id]|{data, sig}"
		let pipeIndex = message.indexOf('|');
		let id = message.substr(0, pipeIndex);

		let data = JSON.parse(message.slice(pipeIndex + 1));
		if (process.send) process.send(`${id}|${this.receive(data)}`);
	}

	/**
	 * @param {{data: string, sig: string}} data
	 * @return {number}
	 */
	receive(data) {
		let verifier = crypto.createVerify(Config.loginserverkeyalgo);
		verifier.update(data.data);
		let success = false;
		try {
			success = verifier.verify(Config.loginserverpublickey, data.sig, 'hex');
		} catch (e) {}

		return success ? 1 : 0;
	}
}

const PM = new VerifierManager({
	execFile: __filename,
	maxProcesses: ('Config' in global) ? Config.verifierprocesses : 1,
	isChatBased: false,
});

if (process.send && module === process.mainModule) {
	// This is a child process!

	// @ts-ignore
	global.Config = require('./config/config');

	process.on('message', message => PM.onMessageDownstream(message));
	process.on('disconnect', () => process.exit(0));

	require('./repl').start('verifier', /** @param {string} cmd */ cmd => eval(cmd));
}

/**
 * @param {string} data
 * @param {string} signature
 * @return {Promise<boolean>}
 */
function verify(data, signature) {
	return PM.send({data: data, sig: signature});
}

module.exports = {
	VerifierManager,
	PM,
	verify,
};
