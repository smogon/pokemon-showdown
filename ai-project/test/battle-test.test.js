const fs = require('fs');
const path = require('path');
const assert = require('assert').strict;

process.chdir(path.resolve(__dirname, '..'));

window = global;

require('../js/battle-dex-data.js');
require('../js/battle-dex.js');
require('../js/battle-scene-stub.js');
global.BattleText = require('../data/text.js').BattleText;
require('../js/battle-text-parser.js');
require('../js/battle.js');

describe('Battle', () => {

	it('should process a bunch of messages properly', () => {
		let battle = new Battle();
		battle.debug = true;

		battle.setQueue([
			"|init|battle",
			"|title|FOO vs. BAR",
			"|j|FOO",
			"|j|BAR",
			"|request|",
			"|player|p1|FOO|169",
			"|player|p2|BAR|265",
			"|teamsize|p1|6",
			"|teamsize|p2|6",
			"|gametype|singles",
			"|gen|7",
			"|tier|[Gen 7] Random Battle",
			"|rated|",
			"|seed|",
			"|rule|Sleep Clause Mod: Limit one foe put to sleep",
			"|rule|HP Percentage Mod: HP is shown in percentages",
			"|",
			"|start",
			"|switch|p1a: Leafeon|Leafeon, L83, F|100/100",
			"|switch|p2a: Gliscor|Gliscor, L77, F|242/242",
			"|turn|1",
		]);
		battle.fastForwardTo(-1);

		let p1 = battle.sides[0];
		let p2 = battle.sides[1];

		assert(p1.name === 'FOO');
		let p1leafeon = p1.pokemon[0];
		assert(p1leafeon.ident === 'p1: Leafeon');
		assert(p1leafeon.details === 'Leafeon, L83, F');
		assert(p1leafeon.hp === 100);
		assert(p1leafeon.maxhp === 100);
		assert(p1leafeon.isActive());
		assert.deepEqual(p1leafeon.moveTrack, []);

		assert(p2.name === 'BAR');
		let p2gliscor = p2.pokemon[0];
		assert(p2gliscor.ident === 'p2: Gliscor');
		assert(p2gliscor.details === 'Gliscor, L77, F');
		assert(p2gliscor.hp === 242);
		assert(p2gliscor.maxhp === 242);
		assert(p2gliscor.isActive());
		assert.deepEqual(p2gliscor.moveTrack, []);

		for (const line of [
			"|",
			"|switch|p2a: Kyurem|Kyurem-White, L73|303/303",
			"|-ability|p2a: Kyurem|Turboblaze",
			"|move|p1a: Leafeon|Knock Off|p2a: Kyurem",
			"|-damage|p2a: Kyurem|226/303",
			"|-enditem|p2a: Kyurem|Leftovers|[from] move: Knock Off|[of] p1a: Leafeon",
			"|",
			"|upkeep",
			"|turn|2",
			"|inactive|Time left: 150 sec this turn | 740 sec total",
		]) {
			battle.add(line);
		}
		battle.fastForwardTo(-1);

		assert(!p2gliscor.isActive());
		let p2kyurem = p2.pokemon[1];
		assert(p2kyurem.ident === 'p2: Kyurem');
		assert(p2kyurem.details === 'Kyurem-White, L73');
		assert(p2kyurem.hp === 226);
		assert(p2kyurem.maxhp === 303);
		assert(p2kyurem.isActive());
		assert(p2kyurem.item === '');
		assert(p2kyurem.prevItem === 'Leftovers');

		assert.deepEqual(p1leafeon.moveTrack, [['Knock Off', 1]]);
	});
});

describe('Text parser', () => {
	it('should process messages correctly', () => {
		let parser = new BattleTextParser();

		assert.equal(parser.extractMessage(`|-activate|p2a: Cool.|move: Skill Swap|Speed Boost|Cute Charm|[of] p1a: Speedy`), `  [The opposing Cool.'s Speed Boost]
  [Speedy's Cute Charm]
  The opposing Cool. swapped Abilities with its target!
`);
		assert.equal(parser.extractMessage(`|-activate|p2a: Cool.|move: Skill Swap|p1a: Speedy|[ability]Speed Boost|[ability2]Cute Charm`), `  [The opposing Cool.'s Speed Boost]
  [Speedy's Cute Charm]
  The opposing Cool. swapped Abilities with its target!
`);
		assert.equal(parser.extractMessage(`|move|p2a: Palkia|Swagger|p1a: Shroomish
|-boost|p1a: Shroomish|atk|2
|-start|p1a: Shroomish|confusion
|-activate|p1a: Shroomish|confusion
|move|p1a: Shroomish|Power-Up Punch|p2a: Palkia
`), `
The opposing Palkia used **Swagger**!
  Shroomish's Attack rose sharply!
  Shroomish became confused!

  Shroomish is confused!
Shroomish used **Power-Up Punch**!
`);
	});
});