'use strict';

const assert = require('../../assert');

describe("Giveaway", () => {
	it("should load the giveaway command", () => {
		const ecoCommands = require('../../../dist/impulse/chat-plugins/economy/eco-commands');
		assert(ecoCommands.commands);
		assert(ecoCommands.commands.eco);
		assert(ecoCommands.commands.eco.giveaway);
		assert(typeof ecoCommands.commands.eco.giveaway === 'object');
		assert(typeof ecoCommands.commands.eco.giveaway.start === 'function');
		assert(typeof ecoCommands.commands.eco.giveaway.join === 'function');
		assert(typeof ecoCommands.commands.eco.giveaway.end === 'function');
		assert(typeof ecoCommands.commands.eco.giveaway.cancel === 'function');
		assert(typeof ecoCommands.commands.eco.giveaway.status === 'function');
		assert(typeof ecoCommands.commands.eco.giveaway.help === 'function');
	});
});
