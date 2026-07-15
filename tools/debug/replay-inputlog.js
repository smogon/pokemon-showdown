#!/usr/bin/env node
'use strict';

const fs = require('fs');

global.Config = { allowrequestingties: false };
const { Battle, Dex } = require('../../dist/sim');
Dex.includeModData();

const sides = new Set(['p1', 'p2', 'p3', 'p4']);
const text = fs.readFileSync(0, 'utf8').trim();

let battle = null;

for (const line of text.split('\n')) {
	if (!line || line[0] !== '>') continue;
	const space = line.indexOf(' ');
	const type = line.slice(1, space < 0 ? undefined : space);
	const data = space < 0 ? '' : line.slice(space + 1);

	if (sides.has(type)) {
		const choice = data.startsWith('/choose ') ? data.slice(8) : data;
		battle.choose(type, choice);
		continue;
	}

	switch (type) {
	case 'version':
	case 'version-origin':
		break;
	case 'start':
		battle = new Battle({ ...JSON.parse(data), debug: true, strictChoices: true });
		break;
	case 'player':
		{
			const playerSpace = data.indexOf(' ');
			battle.setPlayer(data.slice(0, playerSpace), JSON.parse(data.slice(playerSpace + 1)));
		}
		break;
	case 'chat':
		battle.inputLog.push(line);
		battle.add('chat', data);
		break;
	case 'forcelose':
		battle.lose(data);
		battle.inputLog.push(line);
		break;
	case 'forcewin':
		battle.forceWin(data);
		break;
	case 'forcetie':
		battle.forceWin(null);
		break;
	case 'tiebreak':
		battle.tiebreak();
		break;
	case 'reseed':
		battle.resetRNG(data);
		battle.inputLog.push(`>reseed ${battle.prng.getSeed()}`);
		break;
	default:
		throw new Error(`Unsupported input log line: ${line}`);
	}
}

console.log(battle.log.join('\n'));

battle.destroy();
