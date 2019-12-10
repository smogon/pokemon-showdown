'use strict';

const assert = require('assert');
const Sim = require('./../.sim-dist');
const Dex = Sim.Dex;

const cache = new Map();
const formatsCache = new Map();

const RULE_FLAGS = {
	pokemon: 1,
	legality: 2,
	preview: 4,
	sleepClause: 8,
	cancel: 16,
	endlessBattleClause: 32,
	inverseMod: 64,
};

function capitalize(word) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * The default random number generator seed used if one is not given.
 */
const DEFAULT_SEED = [0x09917, 0x06924, 0x0e1c8, 0x06af0];

class TestTools {
	constructor(mod = 'base') {
		this.currentMod = mod;
		this.dex = Dex.mod(mod);

		this.modPrefix = this.dex.isBase ? `` : `[${mod}]`;
	}

	mod(mod) {
		if (cache.has(mod)) return cache.get(mod);

		if (typeof mod !== 'string') throw new Error("This only supports strings");
		if (!Dex.dexes[mod]) throw new Error(`Mod ${mod} does not exist`);

		const moddedTestTools = new TestTools(mod);
		cache.set(mod, moddedTestTools);
		return moddedTestTools;
	}

	gen(genNum) {
		return this.mod('gen' + genNum);
	}

	getFormat(options) {
		if (options.formatid) return Dex.getFormat(options.formatid);

		let mask = 0;
		for (let property in options) {
			if (property === 'gameType' || !options[property]) continue;
			mask |= RULE_FLAGS[property];
		}
		const gameType = Dex.getId(options.gameType || 'singles');

		const gameTypePrefix = gameType === 'singles' ? '' : capitalize(gameType);
		const formatName = [this.modPrefix, gameTypePrefix, "Custom Game", '' + mask].filter(part => part).join(" ");
		const formatId = Dex.getId(formatName);

		let format = formatsCache.get(formatId);
		if (format) return format;

		format = new Dex.Data.Format({
			id: formatId,
			name: formatName,

			mod: this.currentMod,
			mask: mask,
			gameType: options.gameType || 'singles',
			isCustomGameFormat: true,
			ruleset: [
				options.pokemon && '-Nonexistent',
				options.legality && 'Obtainable',
				options.preview && 'Team Preview',
				options.sleepClause && 'Sleep Clause Mod',
				options.cancel && 'Cancel Mod',
				options.endlessBattleClause && 'Endless Battle Clause',
				options.inverseMod && 'Inverse Mod',
			].filter(Boolean),
			rated: false,

			effectType: 'Format',
		});

		formatsCache.set(formatId, format);
		return format;
	}

	/**
	 * Creates a new Battle and returns it.
	 *
	 * @param {Object} [options]
	 * @param {Team[]} [teams]
	 * @returns {Sim.Battle} A battle.
	 */
	createBattle(options, teams) {
		if (Array.isArray(options)) {
			teams = options;
			options = {};
		}
		if (!options) options = {};
		const format = this.getFormat(options);

		const battleOptions = {
			format: format,
			// If a seed for the pseudo-random number generator is not provided,
			// a default seed (guaranteed to be the same across test executions)
			// will be used.
			seed: options.seed || DEFAULT_SEED,
			strictChoices: options.strictChoices !== false,
		};

		if (!teams) return new Sim.Battle(battleOptions);

		for (let i = 0; i < teams.length; i++) {
			assert(Array.isArray(teams[i]), `Team provided is not an array`);
			const playerSlot = `p${i + 1}`;
			battleOptions[playerSlot] = {team: teams[i]};
		}

		return new Sim.Battle(battleOptions);
	}
}

const common = exports = module.exports = new TestTools();
cache.set('base', common);
cache.set('gen8', common);
