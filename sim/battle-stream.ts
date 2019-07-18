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

import * as Streams from './../lib/streams';
import {Battle} from './battle';

/**
 * Like string.split(delimiter), but only recognizes the first `limit`
 * delimiters (default 1).
 *
 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
 *
 * `Chat.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
 *
 * Returns an array of length exactly limit + 1.
 */
function splitFirst(str: string, delimiter: string, limit: number = 1) {
	const splitStr: string[] = [];
	while (splitStr.length < limit) {
		const delimiterIndex = str.indexOf(delimiter);
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

export class BattleStream extends Streams.ObjectReadWriteStream<string> {
	debug: boolean;
	keepAlive: boolean;
	battle: Battle | null;

	constructor(options: {debug?: boolean, keepAlive?: boolean} = {}) {
		super();
		this.debug = !!options.debug;
		this.keepAlive = !!options.keepAlive;
		this.battle = null;
	}

	_write(chunk: string) {
		try {
			this._writeLines(chunk);
		} catch (err) {
			this.pushError(err);
			return;
		}
		if (this.battle) this.battle.sendUpdates();
	}

	_writeLines(chunk: string) {
		for (const line of chunk.split('\n')) {
			if (line.charAt(0) === '>') {
				const [type, message] = splitFirst(line.slice(1), ' ');
				this._writeLine(type, message);
			}
		}
	}

	_writeLine(type: string, message: string) {
		switch (type) {
		case 'start':
			const options = JSON.parse(message);
			options.send = (t: string, data: any) => {
				if (Array.isArray(data)) data = data.join("\n");
				this.push(`${t}\n${data}`);
				if (t === 'end' && !this.keepAlive) this.push(null);
			};
			if (this.debug) options.debug = true;
			this.battle = new Battle(options);
			break;
		case 'player':
			const [slot, optionsText] = splitFirst(message, ' ');
			this.battle!.setPlayer(slot as SideID, JSON.parse(optionsText));
			break;
		case 'p1':
		case 'p2':
		case 'p3':
		case 'p4':
			if (message === 'undo') {
				this.battle!.undoChoice(type);
			} else {
				this.battle!.choose(type, message);
			}
			break;
		case 'forcewin':
		case 'forcetie':
			this.battle!.win(type === 'forcewin' ? message as SideID : null);
			break;
		case 'tiebreak':
			this.battle!.tiebreak();
			break;
		}
	}

	_end() {
		// this is in theory synchronous...
		this.push(null);
		this._destroy();
	}

	_destroy() {
		if (this.battle) this.battle.destroy();
	}
}

/**
 * Splits a BattleStream into omniscient, spectator, p1, p2, p3 and p4
 * streams, for ease of consumption.
 */
export function getPlayerStreams(stream: BattleStream) {
	const streams = {
		omniscient: new Streams.ObjectReadWriteStream({
			write(data: string) {
				stream.write(data);
			},
			end() {
				return stream.end();
			},
		}),
		spectator: new Streams.ObjectReadStream({
			read() {},
		}),
		p1: new Streams.ObjectReadWriteStream({
			write(data: string) {
				stream.write(data.replace(/(^|\n)/g, `$1>p1 `));
			},
		}),
		p2: new Streams.ObjectReadWriteStream({
			write(data: string) {
				stream.write(data.replace(/(^|\n)/g, `$1>p2 `));
			},
		}),
		p3: new Streams.ObjectReadWriteStream({
			write(data: string) {
				stream.write(data.replace(/(^|\n)/g, `$1>p3 `));
			},
		}),
		p4: new Streams.ObjectReadWriteStream({
			write(data: string) {
				stream.write(data.replace(/(^|\n)/g, `$1>p4 `));
			},
		}),
	};
	(async () => {
		let chunk;
		// tslint:disable-next-line:no-conditional-assignment
		while ((chunk = await stream.read())) {
			const [type, data] = splitFirst(chunk, `\n`);
			switch (type) {
			case 'update':
				streams.omniscient.push(Battle.extractUpdateForSide(data, 'omniscient'));
				streams.spectator.push(Battle.extractUpdateForSide(data, 'spectator'));
				streams.p1.push(Battle.extractUpdateForSide(data, 'p1'));
				streams.p2.push(Battle.extractUpdateForSide(data, 'p2'));
				streams.p3.push(Battle.extractUpdateForSide(data, 'p3'));
				streams.p4.push(Battle.extractUpdateForSide(data, 'p4'));
				break;
			case 'sideupdate':
				const [side, sideData] = splitFirst(data, `\n`);
				streams[side as SideID].push(sideData);
				break;
			case 'end':
				// ignore
				break;
			}
		}
		for (const s of Object.values(streams)) {
			s.push(null);
		}
	})().catch(err => {
		for (const s of Object.values(streams)) {
			s.pushError(err);
		}
	});
	return streams;
}

export abstract class BattlePlayer {
	readonly stream: Streams.ObjectReadWriteStream<string>;
	readonly log: string[];
	readonly debug: boolean;

	constructor(playerStream: Streams.ObjectReadWriteStream<string>, debug: boolean = false) {
		this.stream = playerStream;
		this.log = [];
		this.debug = debug;
	}

	async start() {
		let chunk;
		// tslint:disable-next-line:no-conditional-assignment
		while ((chunk = await this.stream.read())) {
			this.receive(chunk);
		}
	}

	receive(chunk: string) {
		for (const line of chunk.split('\n')) {
			this.receiveLine(line);
		}
	}

	receiveLine(line: string) {
		if (this.debug) console.log(line);
		if (line.charAt(0) !== '|') return;
		const [cmd, rest] = splitFirst(line.slice(1), '|');
		if (cmd === 'request') return this.receiveRequest(JSON.parse(rest));
		if (cmd === 'error') return this.receiveError(new Error(rest));
		this.log.push(line);
	}

	abstract receiveRequest(request: AnyObject): void;

	receiveError(error: Error) {
		throw error;
	}

	choose(choice: string) {
		this.stream.write(choice);
	}
}

export class BattleTextStream extends Streams.ReadWriteStream {
	readonly battleStream: BattleStream;
	currentMessage: string;

	constructor(options: {debug?: boolean}) {
		super();
		this.battleStream = new BattleStream(options);
		this.currentMessage = '';
	}

	async start() {
		let message;
		// tslint:disable-next-line:no-conditional-assignment
		while ((message = await this.battleStream.read())) {
			if (!message.endsWith('\n')) message += '\n';
			this.push(message + '\n');
		}
		this.push(null);
	}

	_write(message: string | Buffer) {
		this.currentMessage += '' + message;
		const index = this.currentMessage.lastIndexOf('\n');
		if (index >= 0) {
			this.battleStream.write(this.currentMessage.slice(0, index));
			this.currentMessage = this.currentMessage.slice(index + 1);
		}
	}

	_end() {
		return this.battleStream.end();
	}
}
