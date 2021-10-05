/**
 * Data searching commands.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Commands for advanced searching for pokemon, moves, items and learnsets.
 * These commands run on a child process by default.
 *
 * @license MIT
 */

import {ProcessManager, Utils} from '../../lib';

type DSHandlerTable<T extends BasicEffect> = {[k: string]: DSParser<T>}
type DSParser<T> = (value: string, targets: string[]) => DSValidator<T> | DSError;
type DSValidator<T> = (eff: T) => boolean;
type DSError = {error: string} | {dt: string};

type DSVisualizer<T extends BasicEffect> = (eff: T) => string;

const handlers: {
	abilities: DSHandlerTable<Ability>,
	items: DSHandlerTable<Item>,
	moves: DSHandlerTable<Move>,
	species: DSHandlerTable<Species>,
} = {
	abilities: {},
	items: {},
	moves: {},
	species: {
		bstless(val) {
			const num = parseInt(val);
			if (isNaN(num)) return {error: `'${val}' is not a valid number.`};
			return (species) => species.bst < num;
		},
		color(val) {
			val = toID(val);
			const colors = ['green', 'red', 'blue', 'white', 'brown', 'yellow', 'purple', 'pink', 'gray', 'black'];
			if (!colors.includes(val)) {
				return {error: `'${val}' is not a valid color. Valid colors are: ${colors.join(', ')}.`};
			}
			return (species) => species.color === val;
		},
		tier(val) {
			const tiers = ['zu', 'pu', 'nu', 'ru', 'uu', 'ou', 'ubers', 'ag'];
			if (!tiers.includes(val)) {
				return {error: `'${val}' is not a valid tier. Valid tiers are: ${tiers.join(', ')}.`};
			}
			return (species) => tiers.indexOf(species.tier) <= tiers.indexOf(val);
		},
	},
};

const visualizers: {
	abilities: DSVisualizer<Ability>,
	items: DSVisualizer<Item>,
	moves: DSVisualizer<Move>,
	species: DSVisualizer<Species>,
} = {
	abilities: (eff) => eff.name,
	items: (eff) => eff.name,
	moves: (eff) => eff.name,
	species: (eff) => eff.name,
};

export function runSearch<T extends BasicEffect>(
	table: keyof typeof handlers, target: string
): T[] | DSError {
	const targets = target.split(',');
	const searches: DSValidator<T>[] = [];
	const results: T[] = [];
	for (const t of targets) {
		let [key, val] = Utils.splitFirst(t, '=').map(f => f.trim());
		key = toID(key);
		if (!key || !val) {
			return {error: `'${t}' is not a valid search query (must use search=value format).`};
		}
		const handler = handlers[table][key];
		if (!handler) {
			return {error: `'${key}' is not a valid search parameter.`};
		}
		const searcher = handler(val, targets) as DSValidator<T> | DSError;
		if (typeof searcher !== 'function') {
			return searcher as DSError;
		}
		searches.push(searcher);
	}
	let searchTable;
	switch (table) {
	case 'abilities':
		searchTable = Dex.abilities;
		break;
	case 'items':
		searchTable = Dex.items;
		break;
	case 'moves':
		searchTable = Dex.moves;
		break;
	case 'species':
		searchTable = Dex.species;
		break;
	}
	for (const eff of searchTable.all()) {
		for (const searcher of searches) {
			if (searcher(eff as any as T)) {
				results.push(eff as any as T);
			}
		}
	}
	return results;
}

export const commands: Chat.ChatCommands = {
	async abilitysearch(target, room, user) {
		const results = await PM.query({table: 'abilities', target});
		if (Array.isArray(results)) {
			return this.sendReplyBox(
				Utils.html`/as ${target}: <br />` + results.join(', ')
			);
		}
		if (results.error) {
			return this.errorReply(results.error);
		}
		if (results.dt) {
			return this.parse('/' + results.dt);
		}
	},
	async datasearch(target, room, user) {
		const results = await PM.query({table: 'species', target});
		if (Array.isArray(results)) {
			return this.sendReplyBox(
				Utils.html`/ds ${target}: <br />` + results.join(', ')
			);
		}
		if (results.error) {
			return this.errorReply(results.error);
		}
		if (results.dt) {
			return this.parse('/' + results.dt);
		}
	},
	async itemsearch(target, room, user) {
		const results = await PM.query({table: 'items', target});
		if (Array.isArray(results)) {
			return this.sendReplyBox(
				Utils.html`/is ${target}: <br />` + results.join(', ')
			);
		}
		if (results.error) {
			return this.errorReply(results.error);
		}
		if (results.dt) {
			return this.parse('/' + results.dt);
		}
	},
	async movesearch(target, room, user) {
		const results = await PM.query({table: 'moves', target});
		if (Array.isArray(results)) {
			return this.sendReplyBox(
				Utils.html`/ms ${target}: <br />` + results.join(', ')
			);
		}
		if (results.error) {
			return this.errorReply(results.error);
		}
		if (results.dt) {
			return this.parse('/' + results.dt);
		}
	},
}

/*********************************************************
 * Process manager
 *********************************************************/

export const PM = new ProcessManager.QueryProcessManager<AnyObject, AnyObject>(module, query => {
	try {
		if (Config.debugdexsearchprocesses && process.send) {
			process.send('DEBUG\n' + JSON.stringify(query));
		}
		const {table, target} = query;
		const searchResults = runSearch(table, target);
		if (!Array.isArray(searchResults)) {
			return searchResults;
		}
		const results: string[] = [];
		for (const res of searchResults) {
			results.push(visualizers[table as keyof typeof handlers](res as any));
		}
		return {results};
	} catch (err) {
		Monitor.crashlog(err, 'A search query', query);
	}
	return {
		error: "Sorry! Our search engine crashed on your query. We've been automatically notified and will fix this crash.",
	};
});

if (!PM.isParentProcess) {
	// This is a child process!
	global.Config = require('../config-loader').Config;
	global.Monitor = {
		crashlog(error: Error, source = 'A datasearch process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};
	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			Monitor.crashlog(err, 'A dexsearch process');
		});
	}

	global.Dex = require('../../sim/dex').Dex;
	global.toID = Dex.toID;
	Dex.includeData();

	// @ts-ignore
	require('../../lib/repl').Repl.start('dexsearch', cmd => eval(cmd)); // eslint-disable-line no-eval
} else {
	PM.spawn(1);
}
