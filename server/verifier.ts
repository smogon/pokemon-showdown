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
import * as crypto from 'crypto';

import { QueryProcessManager } from '../lib/process-manager';
import * as ConfigLoader from './config-loader';

export const PM = new QueryProcessManager<{ data: string, signature: string }, boolean>(
	'verifier', module, ({ data, signature }) => {
		const verifier = crypto.createVerify(Config.loginserverkeyalgo);
		verifier.update(data);
		let success = false;
		try {
			success = verifier.verify(Config.loginserverpublickey, signature, 'hex');
		} catch {}

		return success;
	}
);

export function verify(data: string, signature: string): Promise<boolean> {
	return PM.query({ data, signature });
}

if (!PM.isParentProcess) {
	ConfigLoader.ensureLoaded();
	// eslint-disable-next-line no-eval
	PM.startRepl((cmd: string) => eval(cmd));
}

export function start(processCount: ConfigLoader.SubProcessesConfig) {
	PM.spawn(processCount['verifier'] ?? 1);
}

export function destroy() {
	// No need to destroy the PM under normal circumstances.
	// A potential exception is graceful shutdown.
	void PM.destroy();
}
