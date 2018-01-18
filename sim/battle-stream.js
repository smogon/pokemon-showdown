/**
 * Battle Stream
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Supports interacting with a PS battle in Stream format.
 *
 * This format is VERY NOT FINALIZED, please do not use it directly yet.
 *
 * @license MIT
 */

'use strict';

const Streams = require('./../lib/streams');
const Battle = require('./battle');

class BattleStream extends Streams.ObjectReadWriteStream {
	constructor() {
		super();
		/** @type {Battle?} */
		this.battle = null;
	}
	/**
	 * @param {string} message
	 */
	_write(message) {
		let startTime = Date.now();
		let nlIndex = message.indexOf("\n");
		let more = '';
		if (nlIndex > 0) {
			more = message.substr(nlIndex + 1);
			message = message.substr(0, nlIndex);
		}
		let data = message.split('|');
		if (data[0] === 'init') {
			const id = data[1];
			try {
				const battle = new Battle(data[2], data[3], (/** @type {string} */ type, /** @type {any} */ data) => {
					if (Array.isArray(data)) data = data.join("\n");
					this.push(`${type}\n${data}`);
				});
				battle.id = id;
				this.battle = battle;
			} catch (err) {
				if (require('./../lib/crashlogger')(err, 'A battle', {
					message: message,
				}) === 'lockdown') {
					let ministack = Chat.escapeHTML(err.stack).split("\n").slice(0, 2).join("<br />");
					this.push(`update\n|html|<div class="broadcast-red"><b>A BATTLE PROCESS HAS CRASHED:</b> ${ministack}</div>`);
				} else {
					this.push(`update\n|html|<div class="broadcast-red"><b>The battle crashed!</b><br />Don't worry, we're working on fixing it.</div>`);
				}
			}
		} else {
			let battle = this.battle;
			if (battle) {
				let prevRequest = battle.currentRequest;
				try {
					battle.receive(data, more);
				} catch (err) {
					require('./../lib/crashlogger')(err, 'A battle', {
						message: message,
						currentRequest: prevRequest,
						log: '\n' + battle.log.join('\n').replace(/\n\|split\n[^\n]*\n[^\n]*\n[^\n]*\n/g, '\n'),
					});

					let logPos = battle.log.length;
					battle.add('html', `<div class="broadcast-red"><b>The battle crashed</b><br />You can keep playing but it might crash again.</div>`);
					let nestedError;
					try {
						battle.makeRequest(prevRequest);
					} catch (e) {
						nestedError = e;
					}
					battle.sendUpdates(logPos);
					if (nestedError) {
						throw nestedError;
					}
				}
			} else if (data[1] === 'eval') {
				try {
					eval(data[2]);
				} catch (e) {}
			}
		}
		let deltaTime = Date.now() - startTime;
		if (deltaTime > 1000) {
			console.log(`[slow battle] ${deltaTime}ms - ${message}\\\\${more}`);
		}
	}
	_end() {
		this._destroy();
	}
	_destroy() {
		if (this.battle) {
			this.battle.destroy();
		}
		this.battle = null;
	}
}

module.exports = {
	BattleStream,
};
