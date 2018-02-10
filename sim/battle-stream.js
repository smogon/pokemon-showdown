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

/**
 * Like string.split(delimiter), but only recognizes the first `limit`
 * delimiters (default 1).
 *
 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
 *
 * `Chat.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
 *
 * Returns an array of length exactly limit + 1.
 *
 * @param {string} str
 * @param {string} delimiter
 * @param {number} [limit]
 */
function splitFirst(str, delimiter, limit = 1) {
	let splitStr = /** @type {string[]} */ ([]);
	while (splitStr.length < limit) {
		let delimiterIndex = str.indexOf(delimiter);
		if (delimiterIndex >= 0) {
			splitStr.push(str.slice(0, delimiterIndex));
			str = str.slice(delimiterIndex + delimiter.length);
		} else {
			splitStr.push(str);
			str = '';
		}
	}
	splitStr.push(str);
	return splitStr;
}

class BattleStream extends Streams.ObjectReadWriteStream {
	constructor() {
		super();
		/** @type {Battle} */
		// @ts-ignore
		this.battle = null;
	}
	/**
	 * @param {string} message
	 */
	_write(message) {
		let startTime = Date.now();
		try {
			for (const line of message.split('\n')) {
				if (line.charAt(0) === '>') this._writeLine(line.slice(1));
			}
		} catch (err) {
			const battle = this.battle;
			require('./../lib/crashlogger')(err, 'A battle', {
				message: message,
				inputLog: '\n' + battle && battle.inputLog.join('\n'),
				log: '\n' + battle && battle.getDebugLog(),
			});

			this.push(`update\n|html|<div class="broadcast-red"><b>The battle crashed</b><br />Don't worry, we're working on fixing it.</div>`);
			if (battle && battle.p1 && battle.p1.currentRequest) {
				this.push(`sideupdate\np1\n|error|[Invalid choice] The battle crashed`);
			}
			if (battle && battle.p2 && battle.p2.currentRequest) {
				this.push(`sideupdate\np2\n|error|[Invalid choice] The battle crashed`);
			}
		}
		if (this.battle) this.battle.sendUpdates();
		let deltaTime = Date.now() - startTime;
		if (deltaTime > 1000) {
			console.log(`[slow battle] ${deltaTime}ms - ${message}`);
		}
	}
	/**
	 * @param {string} line
	 */
	_writeLine(line) {
		let [type, message] = splitFirst(line, ' ');
		switch (type) {
		case 'start':
			const options = JSON.parse(message);
			options.send = (/** @type {string} */ type, /** @type {any} */ data) => {
				if (Array.isArray(data)) data = data.join("\n");
				this.push(`${type}\n${data}`);
			};
			this.battle = new Battle(options);
			break;
		case 'player':
			const [slot, optionsText] = splitFirst(message, ' ');
			this.battle.setPlayer(/** @type {PlayerSlot} */ (slot), JSON.parse(optionsText));
			break;
		case 'p1':
		case 'p2':
			if (message === 'undo') {
				this.battle.undoChoice(type);
			} else {
				this.battle.choose(type, message);
			}
			break;
		case 'forcewin':
		case 'forcetie':
			this.battle.win(message);
			break;
		case 'tiebreak':
			this.battle.tiebreak();
			break;
		case 'eval':
			/* eslint-disable no-eval, no-unused-vars */
			let battle = this.battle;
			let p1 = battle && battle.p1;
			let p2 = battle && battle.p2;
			let p1active = p1 && p1.active[0];
			let p2active = p2 && p2.active[0];
			battle.inputLog.push(line);
			message = message.replace(/\f/g, '\n');
			battle.add('', '>>> ' + message.replace(/\n/g, '\n||'));
			try {
				let result = eval(message);
				if (result && result.then) {
					result.then((/** @type {any} */ unwrappedResult) => {
						unwrappedResult = Chat.stringify(unwrappedResult);
						battle.add('', 'Promise -> ' + unwrappedResult);
						battle.sendUpdates();
					}, (/** @type {Error} */ error) => {
						battle.add('', '<<< error: ' + error.message);
						battle.sendUpdates();
					});
				} else {
					result = Chat.stringify(result);
					result = result.replace(/\n/g, '\n||');
					battle.add('', '<<< ' + result);
				}
			} catch (e) {
				battle.add('', '<<< error: ' + e.message);
			}
			/* eslint-enable no-eval, no-unused-vars */
			break;
		}
	}
	_end() {
		// this is in theory synchronous...
		this.push(null);
		this._destroy();
	}
	_destroy() {
		if (this.battle) {
			this.battle.destroy();
		}
		// @ts-ignore
		this.battle = null;
	}
}

class BattleTextStream extends Streams.ReadWriteStream {
	constructor() {
		super();
		this.battleStream = new BattleStream();
		/** @type {string} */
		this.currentMessage = '';
		this._listen();
	}
	/**
	 * @param {string | Buffer} message
	 */
	_write(message) {
		this.currentMessage += '' + message;
		let index = this.currentMessage.lastIndexOf('\n');
		if (index >= 0) {
			this.battleStream.write(this.currentMessage.slice(0, index));
			this.currentMessage = this.currentMessage.slice(index + 1);
		}
	}
	_end() {
		this.battleStream.end();
	}
	async _listen() {
		/** @type {string?} */
		let message;
		while ((message = await this.battleStream.read())) {
			if (!message.endsWith('\n')) message += '\n';
			this.push(message + '\n');
		}
		this.push(null);
	}
}

module.exports = {
	BattleStream,
	BattleTextStream,
};
