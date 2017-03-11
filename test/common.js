'use strict';

const assert = require('assert');
const Tools = require('./../tools').includeFormats();
const PRNG = require('./../prng');
const MockBattle = require('./mocks/Battle');

const cache = new Map();

const RULE_FLAGS = {
	pokemon: 1,
	legality: 2,
	preview: 4,
	sleepClause: 8,
	cancel: 16,
	partialDecisions: 32,
};

function capitalize(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * The default random number generator seed used if one is not given.
 */
const DEFAULT_SEED = [0x09917, 0x06924, 0x0e1c8, 0x06af0];

class TestTools {
	constructor(options) {
		if (!options) options = {};

		const mod = options.mod || 'base';
		this.baseFormat = options.baseFormat || {effectType: 'Format', mod: mod};
		this.tools = Tools.mod(mod);

		this.modPrefix = this.baseFormat.name ? `[${this.baseFormat.name}]` : '';
		if (!this.modPrefix && !this.tools.isBase) {
			this.modPrefix = (/^gen\d$/.test(mod) ? `[Gen ${this.tools.gen}]` : `[${mod}]`);
		}

		// Handle caches
		this.formats = new Map([['singles', new Map()], ['doubles', new Map()], ['triples', new Map()]]);
		cache.set(this.baseFormat.id || mod, this);
	}

	mod(mod) {
		if (cache.has(mod)) return cache.get(mod);
		if (Tools.dexes[mod]) return new TestTools({mod: mod});
		const baseFormat = Tools.getFormat(mod);
		if (baseFormat.effectType === 'Format') return new TestTools({mod: baseFormat.mod, baseFormat});
		throw new Error(`Mod ${mod} does not exist`);
	}

	gen(genNum) {
		return this.mod('gen' + genNum);
	}

	getFormat(options) {
		let mask = 0;
		for (let property in options) {
			if (property === 'gameType' || !options[property]) continue;
			mask |= RULE_FLAGS[property];
		}
		const gameType = Tools.getId(options.gameType || 'singles');
		if (this.formats.get(gameType).has(mask)) return this.formats.get(gameType).get(mask);

		const gameTypePrefix = gameType === 'singles' ? '' : capitalize(gameType);
		const formatName = [this.modPrefix, gameTypePrefix, "Custom Game", '' + mask].filter(part => part).join(" ");
		const formatId = Tools.getId(formatName);

		const format = Object.assign(Object.assign({}, this.baseFormat), {
			id: formatId,
			name: formatName,

			mask: mask,
			gameType: options.gameType || 'singles',
			isCustomGameFormat: true,

			rated: false,
		});
		if (!format.ruleset) format.ruleset = [];
		if (!format.banlist) format.banlist = [];

		if (options.pokemon) format.ruleset.push('Pokemon');
		if (options.legality) format.banlist.push('Illegal', 'Unreleased');
		if (options.preview) format.ruleset.push('Team Preview');
		if (options.sleepClause) format.ruleset.push('Sleep Clause Mod');
		if (options.cancel) format.ruleset.push('Cancel Mod');
		// if (options.partialDecisions) format.ruleset.push('Partial Decisions');

		this.tools.installFormat(formatId, format);
		return format;
	}

	/**
	 * Creates a new Battle and returns it.
	 *
	 * @param {Object} [options]
	 * @param {Team[]} [teams]
	 * @param {PRNG} [prng] A pseudo-random number generator. If not provided, a pseudo-random number
	 * generator will be generated for the user with a seed that is guaranteed to be the same across
	 * test executions to help with determinism.
	 * @returns {MockBattle} A mocked battle. This has mostly the same behaviour as regular Battles,
	 * but some behaviour may differ specifically for testing.
	 */
	createBattle(options, teams, prng = new PRNG(DEFAULT_SEED)) {
		if (Array.isArray(options)) {
			teams = options;
			options = {};
		}
		const format = this.getFormat(options || {});
		const battle = MockBattle.construct(
			format.id,
			undefined,
			undefined,
			prng
		);
		if (options && options.partialDecisions) battle.supportPartialDecisions = true;
		if (teams) {
			for (let i = 0; i < teams.length; i++) {
				assert(Array.isArray(teams[i]), "Team provided is not an array");
				const slotNum = i + 1;
				battle.join('p' + slotNum, 'Guest ' + slotNum, 1, teams[i]);
			}
		}
		return battle;
	}
}

const common = exports = module.exports = new TestTools();
cache.set('base', common);
cache.set('gen7', common);
