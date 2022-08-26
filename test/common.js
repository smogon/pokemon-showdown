'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('./assert');
const Sim = require('./../sim');
const Dex = Sim.Dex;

const cache = new Map();
const formatsCache = new Map();

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

		this.modPrefix = this.dex.isBase ? `[gen8] ` : `[${mod}] `;
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
		if (options.formatid) return Dex.formats.get(options.formatid);

		const gameType = Dex.toID(options.gameType || 'singles');
		const customRules = [
			options.pokemon && '-Nonexistent',
			options.legality && 'Obtainable',
			!options.preview && '!Team Preview',
			options.sleepClause && 'Sleep Clause Mod',
			!options.cancel && '!Cancel Mod',
			options.endlessBattleClause && 'Endless Battle Clause',
			options.inverseMod && 'Inverse Mod',
			options.overflowStatMod && 'Overflow Stat Mod',
		].filter(Boolean);
		const customRulesID = customRules.length ? `@@@${customRules.join(',')}` : ``;

		let basicFormat = this.currentMod === 'base' && gameType === 'singles' ? 'Anything Goes' : 'Custom Game';
		if (this.currentMod === 'gen1stadium') basicFormat = 'OU';
		if (gameType === 'freeforall' || gameType === 'multi') basicFormat = 'randombattle';
		const gameTypePrefix = gameType === 'singles' ? '' : capitalize(gameType) + ' ';
		const formatName = `${this.modPrefix}${gameTypePrefix}${basicFormat}${customRulesID}`;

		let format = formatsCache.get(formatName);
		if (format) return format;

		format = Dex.formats.get(formatName);
		if (!format.exists) throw new Error(`Unidentified format: ${formatName}`);

		formatsCache.set(formatName, format);
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

	/**
	 * Saves the log of the given battle as a bare-bones replay file in the `test\replays` directory
	 * You can view the replay by opening the file in any browser or by dragging and dropping the
	 * file into a PS! client window.
	 *
	 * @param {Sim.Battle} battle
	 * @param {string} [fileName]
	 */
	saveReplay(battle, fileName) {
		const battleLog = battle.getDebugLog();
		if (!fileName) fileName = 'test-replay';
		const filePath = path.resolve(__dirname, `./replays/${fileName}-${Date.now()}.html`);
		const out = fs.createWriteStream(filePath, {flags: 'a'});
		out.on('open', () => {
			out.write(
				`<!DOCTYPE html>\n` +
				`<script type="text/plain" class="battle-log-data">${battleLog}</script>\n` +
				`<script src="https://play.pokemonshowdown.com/js/replay-embed.js"></script>\n`
			);
			out.end();
		});
	}
	hasModule(mod) {
		try {
			require(mod);
			return true;
		} catch {
			return false;
		}
	}
}

const common = exports = module.exports = new TestTools();
cache.set('base', common);
cache.set('gen8', common);
