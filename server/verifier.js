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
 * @license MIT
 */

'use strict';

const crypto = require('crypto');

/*********************************************************
 * Process manager
 *********************************************************/

/** @type {typeof import('../lib/process-manager').QueryProcessManager} */
const QueryProcessManager = require(/** @type {any} */('../.lib-dist/process-manager')).QueryProcessManager;

/**@type {QueryProcessManager} */
// @ts-ignore
const PM = new QueryProcessManager(module, async ({data, signature}) => {
	let verifier = crypto.createVerify(Config.loginserverkeyalgo);
	verifier.update(data);
	let success = false;
	try {
		success = verifier.verify(Config.loginserverpublickey, signature, 'hex');
	} catch (e) {}

	return success;
});

if (!PM.isParentProcess) {
	// This is a child process!
	// @ts-ignore This file doesn't exist on the repository, so Travis checks fail if this isn't ignored
	global.Config = require('../config/config');
	/** @type {typeof import('../lib/repl').Repl} */
	const Repl = require(/** @type {any} */('../.lib-dist/repl')).Repl;
	Repl.start('verifier', /** @param {string} cmd */ cmd => eval(cmd));
} else {
	PM.spawn(global.Config ? Config.verifierprocesses : 1);
}

/*********************************************************
 * Exports
 *********************************************************/

/**
 * @param {string} data
 * @param {string} signature
 * @return {Promise<boolean>}
 */
function verify(data, signature) {
	return PM.query({data, signature});
}

module.exports = {
	verify,
	PM,
};
