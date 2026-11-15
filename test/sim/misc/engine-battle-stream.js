'use strict';

const assert = require('node:assert/strict');
const { EngineBattleStream } = require('../../../dist/sim/engine-battle-stream');

const start = '>start {"format":{"mod":"gen9","gameType":"singles","ruleset":[]}}';
const alice = { name: 'Alice', team: [{ species: 'Pikachu', level: 100, moves: ['tackle'] }] };
const bob = { name: 'Bob', team: [{ species: 'Eevee', level: 1, moves: ['tackle'] }] };

describe('EngineBattleStream', () => {
	it('uses the supplied format and teams and reports the winner', async () => {
		const stream = new EngineBattleStream({ noCatch: true });
		await stream.write([
			start, `>player p1 ${JSON.stringify(alice)}`, `>player p2 ${JSON.stringify(bob)}`,
			'>p1 move 1', '>p2 move 1',
		].join('\n'));

		assert.equal(stream.battle.format.name, 'Orbisforge singles');
		assert.equal(stream.battle.teamGenerator, null);
		assert.equal(stream.battle.winner, 'Alice');
		const messages = [];
		for await (const message of stream) messages.push(message);
		assert.ok(messages.some(message => message.startsWith('sideupdate\np1\n|request|')));
		assert.ok(messages.some(message => message.startsWith('sideupdate\np2\n|request|')));
		assert.ok(messages.some(message => message.includes('\n|win|Alice')));

		const replay = new EngineBattleStream({ noCatch: true });
		await replay.write(stream.battle.inputLog.join('\n'));
		assert.equal(replay.battle.winner, 'Alice');
	});

	it('requires explicit teams for both inline and separate players', async () => {
		const inline = new EngineBattleStream({ noCatch: true });
		const options = JSON.parse(start.slice('>start '.length));
		await assert.rejects(async () => inline.write(`>start ${JSON.stringify({ ...options, p1: alice, p2: {} })}`),
			/Player p2 requires an explicit team/);

		const stream = new EngineBattleStream({ noCatch: true });
		await stream.write(start);
		await assert.rejects(async () => stream.write('>player p1 {"name":"Alice"}'),
			/Player p1 requires an explicit team/);
		await assert.rejects(async () => stream.write('>player p1 {"name":"Alice","team":[]}'),
			/Expected a nonempty explicit team/);
		await stream.writeEnd();
	});
});
