/**
 * Data searching commands.
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Commands for advanced searching for pokemon, moves, items and learnsets.
 * These commands run on a child process by default.
 *
 * @license MIT
 */

import { ProcessManager, Utils } from '../../lib';
import { TeamValidator } from '../../sim/team-validator';
import { Chat } from '../chat';

interface DexOrGroup {
	abilities: { [k: string]: boolean };
	tiers: { [k: string]: boolean };
	doublesTiers: { [k: string]: boolean };
	colors: { [k: string]: boolean };
	'egg groups': { [k: string]: boolean };
	formes: { [k: string]: boolean };
	gens: { [k: string]: boolean };
	moves: { [k: string]: boolean };
	types: { [k: string]: boolean };
	resists: { [k: string]: boolean };
	weak: { [k: string]: boolean };
	stats: { [k: string]: { [k in Direction]: number } };
	skip: boolean;
}

interface MoveOrGroup {
	types: { [k: string]: boolean };
	categories: { [k: string]: boolean };
	contestTypes: { [k: string]: boolean };
	flags: { [k: string]: boolean };
	gens: { [k: string]: boolean };
	other: { [k: string]: boolean };
	mon: { [k: string]: boolean };
	property: { [k: string]: { [k in Direction]: number } };
	boost: { [k: string]: boolean };
	lower: { [k: string]: boolean };
	zboost: { [k: string]: boolean };
	status: { [k: string]: boolean };
	volatileStatus: { [k: string]: boolean };
	targets: { [k: string]: boolean };
	skip: boolean;
	multihit: boolean;
}

type Direction = 'less' | 'greater' | 'equal';

const MAX_PROCESSES = 1;
const RESULTS_MAX_LENGTH = 10;
const MAX_RANDOM_RESULTS = 30;
const dexesHelp = Object.keys((global.Dex?.dexes || {})).filter(x => x !== 'sourceMaps').join('</code>, <code>');

function toListString(arr: string[]) {
	if (!arr.length) return '';
	if (arr.length === 1) return arr[0];
	if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
	return `${arr.slice(0, -1).join(", ")}, and ${arr.slice(-1)[0]}`;
}

function checkCanAll(room: Room | null) {
	if (!room) return false; // no, no good reason for using `all` in pms
	const { isPersonal, isHelp } = room.settings;
	// allowed if it's a groupchat
	return !room.battle && !!isPersonal && !isHelp;
}

export const commands: Chat.ChatCommands = {
	ds: 'dexsearch',
	ds1: 'dexsearch',
	ds2: 'dexsearch',
	ds3: 'dexsearch',
	ds4: 'dexsearch',
	ds5: 'dexsearch',
	ds6: 'dexsearch',
	ds7: 'dexsearch',
	ds8: 'dexsearch',
	dsearch: 'dexsearch',
	nds: 'dexsearch',
	async dexsearch(target, room, user, connection, cmd, message) {
		this.checkBroadcast();
		if (!target) return this.parse('/help dexsearch');
		if (target.length > 300) return this.errorReply('Dexsearch queries may not be longer than 300 characters.');
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen) target += `, mod=gen${targetGen}`;
		const split = target.split(',').map(term => term.trim());
		const index = split.findIndex(x => /^max\s*gen/i.test(x));
		if (index >= 0) {
			const genNum = parseInt(/\d*$/.exec(split[index])?.[0] || '');
			if (!isNaN(genNum) && !(genNum < 1 || genNum > Dex.gen)) {
				split[index] = `mod=gen${genNum}`;
				target = split.join(',');
			}
		}
		const defaultFormat = this.extractFormat(room?.settings.defaultFormat || room?.battle?.format);
		if (!target.includes('mod=')) {
			const dex = defaultFormat.dex;
			if (dex) target += `, mod=${dex.currentMod}`;
		}
		if (cmd === 'nds' ||
			(defaultFormat.format && Dex.formats.getRuleTable(defaultFormat.format).has('natdexmod'))) {
			target += ', natdex';
		}
		const response = await runSearch({
			target,
			cmd: 'dexsearch',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		}, user);
		if (!response.error && !this.runBroadcast()) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	dexsearchhelp() {
		this.sendReply(
			`|html| <details class="readmore"><summary><code>/dexsearch [parameter], [parameter], [parameter], ...</code>: searches for Pok\u00e9mon that fulfill the selected criteria<br/>` +
			`Search categories are: type, tier, color, moves, ability, gen, resists, weak, recovery, zrecovery, priority, stat, weight, height, egg group, pivot.<br/>` +
			`Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.<br/>` +
			`Valid tiers are: Uber/OU/UUBL/UU/RUBL/RU/NUBL/NU/PUBL/PU/ZUBL/ZU/NFE/LC/CAP/CAP NFE/CAP LC.<br/>` +
			`Valid doubles tiers are: DUber/DOU/DBL/DUU/DNU.</summary>` +
			`Types can be searched for by either having the type precede <code>type</code> or just using the type itself as a parameter; e.g., both <code>fire type</code> and <code>fire</code> show all Fire types; however, using <code>psychic</code> as a parameter will show all Pok\u00e9mon that learn the move Psychic and not Psychic types.<br/>` +
			`<code>resists</code> followed by a type or move will show Pok\u00e9mon that resist that typing or move (e.g. <code>resists normal</code>).<br/>` +
			`<code>weak</code> followed by a type or move will show Pok\u00e9mon that are weak to that typing or move (e.g. <code>weak fire</code>).<br/>` +
			`<code>asc</code> or <code>desc</code> following a stat will show the Pok\u00e9mon in ascending or descending order of that stat respectively (e.g. <code>speed asc</code>).<br/>` +
			`Inequality ranges use the characters <code>>=</code> for <code>≥</code> and <code><=</code> for <code>≤</code>; e.g., <code>hp <= 95</code> searches all Pok\u00e9mon with HP less than or equal to 95; <code>tier <= uu</code> searches all Pok\u00e9mon in singles tiers lower than UU.<br/>` +
			`Parameters can be excluded through the use of <code>!</code>; e.g., <code>!water type</code> excludes all Water types.<br/>` +
			`The parameter <code>mega</code> can be added to search for Mega Evolutions only, the parameter <code>gmax</code> can be added to search for Pok\u00e9mon capable of Gigantamaxing only, and the parameter <code>Fully Evolved</code> (or <code>FE</code>) can be added to search for fully-evolved Pok\u00e9mon.<br/>` +
			`<code>Alola</code>, <code>Galar</code>, <code>Therian</code>, <code>Totem</code>, or <code>Primal</code> can be used as parameters to search for those formes.<br/>` +
			`Parameters separated with <code>|</code> will be searched as alternatives for each other; e.g., <code>trick | switcheroo</code> searches for all Pok\u00e9mon that learn either Trick or Switcheroo.<br/>` +
			`You can search for info in a specific generation by appending the generation to ds or by using the <code>maxgen</code> keyword; e.g. <code>/ds1 normal</code> or <code>/ds normal, maxgen1</code> searches for all Pok\u00e9mon that were Normal type in Generation I.<br/>` +
			`You can search for info in a specific mod by using <code>mod=[mod name]</code>; e.g. <code>/nds mod=ssb, protean</code>. All valid mod names are: <code>${dexesHelp}</code><br />` +
			`By default, <code>/dexsearch</code> will search only Pok\u00e9mon obtainable in the current generation. Add the parameter <code>unreleased</code> to include unreleased Pok\u00e9mon. Add the parameter <code>natdex</code> (or use the command <code>/nds</code>) to include all past Pok\u00e9mon.<br/>` +
			`Searching for a Pok\u00e9mon with both egg group and type parameters can be differentiated by adding the suffix <code>group</code> onto the egg group parameter; e.g., seaching for <code>grass, grass group</code> will show all Grass types in the Grass egg group.<br/>` +
			`The parameter <code>monotype</code> will only show Pok\u00e9mon that are single-typed.<br/>` +
			`The order of the parameters does not matter.<br/>`
		);
	},

	rollmove: 'randommove',
	randmove: 'randommove',
	async randommove(target, room, user, connection, cmd, message) {
		this.checkBroadcast(true);
		target = target.slice(0, 300);
		const targets = target.split(",");
		const targetsBuffer = [];
		let qty;
		for (const arg of targets) {
			if (!arg) continue;
			const num = Number(arg);
			if (Number.isInteger(num)) {
				if (qty) throw new Chat.ErrorMessage("Only specify the number of Pok\u00e9mon Moves once.");
				qty = num;
				if (qty < 1 || MAX_RANDOM_RESULTS < qty) {
					throw new Chat.ErrorMessage(`Number of random Pok\u00e9mon Moves must be between 1 and ${MAX_RANDOM_RESULTS}.`);
				}
				targetsBuffer.push(`random${qty}`);
			} else {
				targetsBuffer.push(arg);
			}
		}
		if (!qty) targetsBuffer.push("random1");
		const defaultFormat = this.extractFormat(room?.settings.defaultFormat || room?.battle?.format);
		if (!target.includes('mod=')) {
			const dex = defaultFormat.dex;
			if (dex) targetsBuffer.push(`mod=${dex.currentMod}`);
		}
		const response = await runSearch({
			target: targetsBuffer.join(","),
			cmd: 'randmove',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		}, user);
		if (!response.error && !this.runBroadcast(true)) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	randommovehelp: [
		`/randommove - Generates random Pok\u00e9mon Moves based on given search conditions.`,
		`/randommove uses the same parameters as /movesearch (see '/help ms').`,
		`Adding a number as a parameter returns that many random Pok\u00e9mon Moves, e.g., '/randmove 6' returns 6 random Pok\u00e9mon Moves.`,
	],

	rollpokemon: 'randompokemon',
	randpoke: 'randompokemon',
	async randompokemon(target, room, user, connection, cmd, message) {
		this.checkBroadcast(true);
		target = target.slice(0, 300);
		const targets = target.split(",");
		const targetsBuffer = [];
		let qty;
		for (const arg of targets) {
			if (!arg) continue;
			const num = Number(arg);
			if (Number.isInteger(num)) {
				if (qty) throw new Chat.ErrorMessage("Only specify the number of Pok\u00e9mon once.");
				qty = num;
				if (qty < 1 || MAX_RANDOM_RESULTS < qty) {
					throw new Chat.ErrorMessage(`Number of random Pok\u00e9mon must be between 1 and ${MAX_RANDOM_RESULTS}.`);
				}
				targetsBuffer.push(`random${qty}`);
			} else {
				targetsBuffer.push(arg);
			}
		}
		if (!qty) targetsBuffer.push("random1");
		const defaultFormat = this.extractFormat(room?.settings.defaultFormat || room?.battle?.format);
		if (!target.includes('mod=')) {
			const dex = defaultFormat.dex;
			if (dex) targetsBuffer.push(`mod=${dex.currentMod}`);
		}
		const response = await runSearch({
			target: targetsBuffer.join(","),
			cmd: 'randpoke',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		}, user);
		if (!response.error && !this.runBroadcast(true)) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	randompokemonhelp: [
		`/randompokemon - Generates random Pok\u00e9mon based on given search conditions.`,
		`/randompokemon uses the same parameters as /dexsearch (see '/help ds').`,
		`Adding a number as a parameter returns that many random Pok\u00e9mon, e.g., '/randpoke 6' returns 6 random Pok\u00e9mon.`,
	],

	randability: 'randomability',
	async randomability(target, room, user, connection, cmd, message) {
		this.checkBroadcast(true);
		target = target.slice(0, 300);
		const targets = target.split(",");
		const targetsBuffer = [];
		let qty;
		for (const arg of targets) {
			if (!arg) continue;
			const num = Number(arg);
			if (Number.isInteger(num)) {
				if (qty) throw new Chat.ErrorMessage("Only specify the number of abilities once.");
				qty = num;
				if (qty < 1 || MAX_RANDOM_RESULTS < qty) {
					throw new Chat.ErrorMessage(`Number of random abilities must be between 1 and ${MAX_RANDOM_RESULTS}.`);
				}
				targetsBuffer.push(`random${qty}`);
			} else {
				targetsBuffer.push(arg);
			}
		}
		if (!qty) targetsBuffer.push("random1");

		const response = await runSearch({
			target: targetsBuffer.join(","),
			cmd: 'randability',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		});
		if (!response.error && !this.runBroadcast(true)) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	randomabilityhelp: [
		`/randability - Generates random Pok\u00e9mon ability based on given search conditions.`,
		`/randability uses the same parameters as /abilitysearch (see '/help ds').`,
		`Adding a number as a parameter returns that many random Pok\u00e9mon abilities, e.g., '/randabilitiy 6' returns 6 random abilities.`,
	],
	ms: 'movesearch',
	ms1: 'movesearch',
	ms2: 'movesearch',
	ms3: 'movesearch',
	ms4: 'movesearch',
	ms5: 'movesearch',
	ms6: 'movesearch',
	ms7: 'movesearch',
	ms8: 'movesearch',
	msearch: 'movesearch',
	nms: 'movesearch',
	async movesearch(target, room, user, connection, cmd, message) {
		this.checkBroadcast();
		if (!target) return this.parse('/help movesearch');
		target = target.slice(0, 300);
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen) target += `, mod=gen${targetGen}`;
		const split = target.split(',').map(term => term.trim());
		const index = split.findIndex(x => /^max\s*gen/i.test(x));
		if (index >= 0) {
			const genNum = parseInt(/\d*$/.exec(split[index])?.[0] || '');
			if (!isNaN(genNum) && !(genNum < 1 || genNum > Dex.gen)) {
				split[index] = `mod=gen${genNum}`;
				target = split.join(',');
			}
		}
		if (!target.includes('mod=')) {
			const dex = this.extractFormat(room?.settings.defaultFormat || room?.battle?.format).dex;
			if (dex) target += `, mod=${dex.currentMod}`;
		}
		if (cmd === 'nms') target += ', natdex';
		const response = await runSearch({
			target,
			cmd: 'movesearch',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		}, user);
		if (!response.error && !this.runBroadcast()) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	movesearchhelp() {
		this.sendReplyBox(
			`<code>/movesearch [parameter], [parameter], [parameter], ...</code>: searches for moves that fulfill the selected criteria.<br/><br/>` +
			`Search categories are: type, category, gen, contest condition, flag, status inflicted, type boosted, Pok\u00e9mon targeted, and numeric range for base power, pp, priority, and accuracy.<br/><br/>` +
			`<details class="readmore"><summary>Parameter Options</summary>` +
			`- Types can be followed by <code> type</code> for clarity; e.g. <code>dragon type</code>.<br/>` +
			`- Stat boosts must be preceded with <code>boosts </code>, and stat-lowering moves with <code>lowers </code>; e.g., <code>boosts attack</code> searches for moves that boost the Attack stat of either Pok\u00e9mon.<br/>` +
			`- Z-stat boosts must be preceded with <code>zboosts </code>; e.g. <code>zboosts accuracy</code> searches for all Status moves with Z-Effects that boost the user's accuracy. Moves that have a Z-Effect of fully restoring the user's health can be searched for with <code>zrecovery</code>.<br/>` +
			`- <code>zmove</code>, <code>max</code>, or <code>gmax</code> as parameters will search for Z-Moves, Max Moves, and G-Max Moves respectively.<br/>` +
			`- Move targets must be preceded with <code>targets </code>; e.g. <code>targets user</code> searches for moves that target the user.<br/>` +
			`- Valid move targets are: one ally, user or ally, one adjacent opponent, all Pokemon, all adjacent Pokemon, all adjacent opponents, user and allies, user's side, user's team, any Pokemon, opponent's side, one adjacent Pokemon, random adjacent Pokemon, scripted, and user.<br/>` +
			`- Valid flags are: allyanim, bypasssub (bypasses Substitute), bite, bullet, cantusetwice, charge, contact, dance, defrost, distance (can target any Pokemon in Triples), failcopycat, failencore, failinstruct, failmefirst, failmimic, futuremove, gravity, heal, highcrit, instruct, metronome, mimic, mirror (reflected by Mirror Move), mustpressure, multihit, noassist, nonsky, noparentalbond, nosketch, nosleeptalk, ohko, pivot, pledgecombo, powder, priority, protect, pulse, punch, recharge, recovery, reflectable, secondary, slicing, snatch, sound, and wind.<br/>` +
			`- <code>protection</code> as a parameter will search protection moves like Protect, Detect, etc.<br/>` +
			`- A search that includes <code>!protect</code> will show all moves that bypass protection.<br/>` +
			`</details><br/>` +
			`<details class="readmore"><summary>Parameter Filters</summary>` +
			`- Inequality ranges use the characters <code>></code> and <code><</code>.<br/>` +
			`- Parameters can be excluded through the use of <code>!</code>; e.g. <code>!water type</code> excludes all Water-type moves.<br/>` +
			`- <code>asc</code> or <code>desc</code> following a move property will arrange the names in ascending or descending order of that property, respectively; e.g., <code>basepower asc</code> will arrange moves in ascending order of their base powers.<br/>` +
			`- Parameters separated with <code>|</code> will be searched as alternatives for each other; e.g. <code>fire | water</code> searches for all moves that are either Fire type or Water type.<br/>` +
			`- If a Pok\u00e9mon is included as a parameter, only moves from its movepool will be included in the search.<br/>` +
			`- You can search for info in a specific generation by appending the generation to ms; e.g. <code>/ms1 normal</code> searches for all moves that were Normal type in Generation I.<br/>` +
			`- You can search for info in a specific mod by using <code>mod=[mod name]</code>; e.g. <code>/nms mod=ssb, dark, bp=100</code>. All valid mod names are: <code>${dexesHelp}</code><br />` +
			`- <code>/ms</code> will search all non-dexited moves (clickable in that game); you can include dexited moves by using <code>/nms</code> or by adding <code>natdex</code> as a parameter.<br/>` +
			`- The order of the parameters does not matter.` +
			`</details>`
		);
	},

	isearch: 'itemsearch',
	is: 'itemsearch',
	is2: 'itemsearch',
	is3: 'itemsearch',
	is4: 'itemsearch',
	is5: 'itemsearch',
	is6: 'itemsearch',
	is7: 'itemsearch',
	is8: 'itemsearch',
	async itemsearch(target, room, user, connection, cmd, message) {
		this.checkBroadcast();
		if (!target) return this.parse('/help itemsearch');
		target = target.slice(0, 300);
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen) target = `maxgen${targetGen} ${target}`;

		const response = await runSearch({
			target,
			cmd: 'itemsearch',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		}, user);
		if (!response.error && !this.runBroadcast()) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	itemsearchhelp() {
		this.sendReplyBox(
			`<code>/itemsearch [item description]</code>: finds items that match the given keywords.<br/>` +
			`This command accepts natural language. (tip: fewer words tend to work better)<br/>` +
			`The <code>gen</code> keyword can be used to search for items introduced in a given generation; e.g., <code>/is gen4</code> searches for items introduced in Generation 4.<br/>` +
			`To search for items within a generation, append the generation to <code>/is</code> or use the <code>maxgen</code> keyword; e.g., <code>/is4 Water-type</code> or <code>/is maxgen4 Water-type</code> searches for items whose Generation 4 description includes "Water-type".<br/>` +
			`Searches with <code>fling</code> in them will find items with the specified Fling behavior.<br/>` +
			`Searches with <code>natural gift</code> in them will find items with the specified Natural Gift behavior.`
		);
	},

	randitem: 'randomitem',
	async randomitem(target, room, user, connection, cmd, message) {
		this.checkBroadcast(true);
		target = target.slice(0, 300);
		const targets = target.split(",");
		const targetsBuffer = [];
		let qty;
		for (const arg of targets) {
			if (!arg) continue;
			const num = Number(arg);
			if (Number.isInteger(num)) {
				if (qty) throw new Chat.ErrorMessage("Only specify the number of items once.");
				qty = num;
				if (qty < 1 || MAX_RANDOM_RESULTS < qty) {
					throw new Chat.ErrorMessage(`Number of random items must be between 1 and ${MAX_RANDOM_RESULTS}.`);
				}
				targetsBuffer.push(`random${qty}`);
			} else {
				targetsBuffer.push(arg);
			}
		}
		if (!qty) targetsBuffer.push("random1");

		const response = await runSearch({
			target: targetsBuffer.join(","),
			cmd: 'randitem',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		});
		if (!response.error && !this.runBroadcast(true)) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	randomitemhelp: [
		`/randitem - Generates random items based on given search conditions.`,
		`/randitem uses the same parameters as /itemsearch (see '/help ds').`,
		`Adding a number as a parameter returns that many random items, e.g., '/randitem 6' returns 6 random items.`,
	],
	asearch: 'abilitysearch',
	as: 'abilitysearch',
	as3: 'abilitysearch',
	as4: 'abilitysearch',
	as5: 'abilitysearch',
	as6: 'abilitysearch',
	as7: 'abilitysearch',
	as8: 'abilitysearch',
	async abilitysearch(target, room, user, connection, cmd, message) {
		this.checkBroadcast();
		if (!target) return this.parse('/help abilitysearch');
		target = target.slice(0, 300);
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen) target += ` maxgen${targetGen}`;

		const response = await runSearch({
			target,
			cmd: 'abilitysearch',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		}, user);
		if (!response.error && !this.runBroadcast()) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	abilitysearchhelp() {
		this.sendReplyBox(
			`<code>/abilitysearch [ability description]</code>: finds abilities that match the given keywords.<br/>` +
			`This command accepts natural language. (tip: fewer words tend to work better)<br/>` +
			`The <code>gen</code> keyword can be used to search for abilities introduced in a given generation; e.g., <code>/as gen4</code> searches for abilities introduced in Generation 4.<br/>` +
			`To search for abilities within a generation, append the generation to <code>/as</code> or use the <code>maxgen</code> keyword; e.g., <code>/as4 Water-type</code> or <code>/as maxgen4 Water-type</code> searches for abilities whose Generation 4 description includes "Water-type".`
		);
	},

	learnset: 'learn',
	learnall: 'learn',
	learnlc: 'learn',
	learn1: 'learn',
	learn2: 'learn',
	learn3: 'learn',
	learn4: 'learn',
	learn5: 'learn',
	learn6: 'learn',
	learn7: 'learn',
	learn8: 'learn',
	rbylearn: 'learn',
	gsclearn: 'learn',
	advlearn: 'learn',
	dpplearn: 'learn',
	bw2learn: 'learn',
	oraslearn: 'learn',
	usumlearn: 'learn',
	sslearn: 'learn',
	async learn(target, room, user, connection, cmd, message) {
		if (!target) return this.parse('/help learn');
		if (target.length > 300) throw new Chat.ErrorMessage(`Query too long.`);

		const GENS: { [k: string]: number } = { rby: 1, gsc: 2, adv: 3, dpp: 4, bw2: 5, oras: 6, usum: 7, ss: 8 };
		let cmdGen = GENS[cmd.slice(0, -5)];
		if (cmdGen) target = `gen${cmdGen}, ${target}`;

		cmdGen = Number(cmd.slice(5));
		if (cmdGen) target = `gen${cmdGen}, ${target}`;

		this.checkBroadcast();
		const { format, dex, targets } = this.splitFormat(target);

		const formatid = format ? format.id : dex.currentMod;
		if (cmd === 'learnlc') targets.unshift('level5');

		const response = await runSearch({
			target: targets.join(','),
			cmd: 'learn',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: formatid,
		}, user);
		if (!response.error && !this.runBroadcast()) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		}
	},
	learnhelp: [
		`/learn [ruleset], [pokemon], [move, move, ...] - Displays how the Pok\u00e9mon can learn the given moves, if it can at all.`,
		`!learn [ruleset], [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ # ~`,
		`Specifying a ruleset is entirely optional. The ruleset can be a format, a generation (e.g.: gen3) or "min source gen [number]".`,
		`A value of 'min source gen [number]' indicates that trading (or Pokémon Bank) from generations before [number] is not allowed.`,
		`/learnlc displays how the Pok\u00e9mon can learn the given moves at level 5, if it can at all.`,
		`/learnall displays all of the possible fathers for egg moves.`,
		`A generation number can also be appended to /learn (e.g.: /learn4) to indicate which generation is used.`,
	],
	randtype: 'randomtype',
	async randomtype(target, room, user, connection, cmd, message) {
		this.checkBroadcast(true);
		target = target.slice(0, 300);
		const targets = target.split(",");
		const targetsBuffer = [];
		let qty;
		for (const arg of targets) {
			if (!arg) continue;
			const num = Number(arg);
			if (Number.isInteger(num)) {
				if (qty) throw new Chat.ErrorMessage("Only specify the number of types once.");
				qty = num;
				if (qty < 1 || MAX_RANDOM_RESULTS < qty) {
					throw new Chat.ErrorMessage(`Number of random types must be between 1 and ${MAX_RANDOM_RESULTS}.`);
				}
				targetsBuffer.push(`random${qty}`);
			} else {
				targetsBuffer.push(arg);
			}
		}
		if (!qty) targetsBuffer.push("random1");

		const response = await runSearch({
			target: targetsBuffer.join(","),
			cmd: 'randtype',
			canAll: !this.broadcastMessage || checkCanAll(room),
			message: (this.broadcastMessage ? "" : message),
		});
		if (!response.error && !this.runBroadcast(true)) return;
		if (response.error) {
			throw new Chat.ErrorMessage(response.error);
		} else if (response.reply) {
			this.sendReplyBox(response.reply);
		} else if (response.dt) {
			(Chat.commands.data as Chat.ChatHandler).call(
				this, response.dt, room, user, connection, 'dt', this.broadcastMessage ? "" : message
			);
		}
	},
	randomtypehelp: [
		`/randtype - Generates random types based on given search conditions.`,
		`Adding a number as a parameter returns that many random items, e.g., '/randtype 6' returns 6 random types.`,
	],
};

function getMod(target: string) {
	const arr = target.split(',').map(x => x.trim());
	const modTerm = arr.find(x => {
		const sanitizedStr = x.toLowerCase().replace(/[^a-z0-9=]+/g, '');
		return sanitizedStr.startsWith('mod=') && Dex.dexes[toID(sanitizedStr.split('=')[1])];
	});
	const count = arr.filter(x => {
		const sanitizedStr = x.toLowerCase().replace(/[^a-z0-9=]+/g, '');
		return sanitizedStr.startsWith('mod=');
	}).length;
	if (modTerm) arr.splice(arr.indexOf(modTerm), 1);
	return { splitTarget: arr, usedMod: modTerm ? toID(modTerm.split(/ ?= ?/)[1]) : undefined, count };
}

function runDexsearch(target: string, cmd: string, canAll: boolean, message: string, isTest: boolean) {
	const searches: DexOrGroup[] = [];
	const { splitTarget, usedMod, count: c } = getMod(target);
	if (c > 1) {
		return { error: `You can't run searches for multiple mods.` };
	}

	const mod = Dex.mod(usedMod || 'base');
	const allTiers: { [k: string]: TierTypes.Singles | TierTypes.Other } = Object.assign(Object.create(null), {
		anythinggoes: 'AG', ag: 'AG',
		uber: 'Uber', ubers: 'Uber', ou: 'OU',
		uubl: 'UUBL', uu: 'UU',
		rubl: 'RUBL', ru: 'RU',
		nubl: 'NUBL', nu: 'NU',
		publ: 'PUBL', pu: 'PU',
		zubl: 'ZUBL', zu: 'ZU',
		nfe: 'NFE',
		lc: 'LC',
		cap: 'CAP', caplc: 'CAP LC', capnfe: 'CAP NFE',
	});
	const singlesTiersValues: { [k: string]: number } = Object.assign(Object.create(null), {
		AG: 14, Uber: 13,
		OU: 12, CAP: 12,
		UUBL: 11, UU: 10,
		RUBL: 9, RU: 8,
		NUBL: 7, NU: 6,
		PUBL: 5, PU: 4,
		ZUBL: 3, ZU: 2,
		NFE: 1, 'CAP NFE': 1,
		LC: 0, 'CAP LC': 0,
	});
	const allDoublesTiers: { [k: string]: TierTypes.Singles | TierTypes.Other } = Object.assign(Object.create(null), {
		doublesubers: 'DUber', doublesuber: 'DUber', duber: 'DUber', dubers: 'DUber',
		doublesou: 'DOU', dou: 'DOU',
		doublesbl: 'DBL', dbl: 'DBL',
		doublesuu: 'DUU', duu: 'DUU',
		doublesnu: '(DUU)', dnu: '(DUU)',
	});
	const doublesTiersValues: { [k: string]: number } = Object.assign(Object.create(null), {
		DUber: 4, DOU: 3,
		DBL: 2, DUU: 1,
		'(DUU)': 0,
	});
	const allTypes = Object.create(null);
	for (const type of mod.types.all()) {
		allTypes[type.id] = type.name;
	}
	const allColors = ['green', 'red', 'blue', 'white', 'brown', 'yellow', 'purple', 'pink', 'gray', 'black'];
	const allEggGroups: { [k: string]: string } = Object.assign(Object.create(null), {
		amorphous: 'Amorphous',
		bug: 'Bug',
		ditto: 'Ditto',
		dragon: 'Dragon',
		fairy: 'Fairy',
		field: 'Field',
		flying: 'Flying',
		grass: 'Grass',
		humanlike: 'Human-Like',
		mineral: 'Mineral',
		monster: 'Monster',
		undiscovered: 'Undiscovered',
		water1: 'Water 1',
		water2: 'Water 2',
		water3: 'Water 3',
	});
	const allFormes = ['alola', 'galar', 'hisui', 'paldea', 'primal', 'therian', 'totem'];
	const allStats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe', 'bst', 'weight', 'height', 'gen'];
	const allStatAliases: { [k: string]: string } = {
		attack: 'atk', defense: 'def', specialattack: 'spa', spc: 'spa', special: 'spa', spatk: 'spa',
		specialdefense: 'spd', spdef: 'spd', speed: 'spe', wt: 'weight', ht: 'height', generation: 'gen',
	};
	let showAll = false;
	let sort = null;
	let megaSearch = null;
	let gmaxSearch = null;
	let tierSearch = null;
	let capSearch: boolean | null = null;
	let nationalSearch = null;
	let unreleasedSearch = null;
	let fullyEvolvedSearch = null;
	let restrictedSearch = null;
	let singleTypeSearch = null;
	let randomOutput = 0;
	let tierInequalitySearch = false;
	const validParameter = (cat: string, param: string, isNotSearch: boolean, input: string) => {
		const uniqueTraits = ['colors', 'gens'];
		const tierTraits = ['tiers', 'doubles tiers'];
		for (const group of searches) {
			const g = group[cat as keyof DexOrGroup];
			if (g === undefined) continue;
			if (tierTraits.includes(cat) && tierInequalitySearch) continue;
			if (typeof g !== 'boolean' && g[param] === undefined) {
				if (uniqueTraits.includes(cat)) {
					for (const currentParam in g) {
						if (g[currentParam] !== isNotSearch && !isNotSearch) return `A Pok&eacute;mon cannot have multiple ${cat}.`;
					}
				}
				continue;
			}
			if (typeof g !== 'boolean' && g[param] === isNotSearch) {
				return `A search cannot both include and exclude '${input}'.`;
			} else {
				return `The search included '${(isNotSearch ? "!" : "") + input}' more than once.`;
			}
		}
		return false;
	};

	for (const andGroup of splitTarget) {
		const orGroup: DexOrGroup = {
			abilities: {}, tiers: {}, doublesTiers: {}, colors: {}, 'egg groups': {}, formes: {},
			gens: {}, moves: {}, types: {}, resists: {}, weak: {}, stats: {}, skip: false,
		};
		const parameters = andGroup.split("|");
		if (parameters.length > 3) return { error: "No more than 3 alternatives for each parameter may be used." };
		for (const parameter of parameters) {
			let isNotSearch = false;
			target = parameter.trim().toLowerCase();
			if (target.startsWith('!')) {
				isNotSearch = true;
				target = target.substr(1);
			}

			let isTierInequalityParam = false;
			const tierInequality: boolean[] = [];
			if (target.startsWith('tier')) {
				if (isNotSearch) return { error: "You cannot use the negation symbol '!' with inequality tier searches." };
				target = target.substr(4).trim();
				if (!target.startsWith('>') && !target.startsWith('<')) {
					return { error: "You must use an inequality operator '>' or '<' with performing tier inequality searchs." };
				}
				isTierInequalityParam = true;
				tierInequalitySearch = true;
				tierInequality[0] = target.startsWith('>');
				target = target.substr(1).trim();
				tierInequality[1] = target.startsWith('=');
				if (tierInequality[1]) target = target.substr(1).trim();
			}

			const targetAbility = mod.abilities.get(target);
			if (targetAbility.exists) {
				const invalid = validParameter("abilities", targetAbility.id, isNotSearch, targetAbility.name);
				if (invalid) return { error: invalid };
				orGroup.abilities[targetAbility.name] = !isNotSearch;
				continue;
			}

			if (toID(target) in allTiers) {
				target = allTiers[toID(target)];
				if (target.startsWith("CAP")) {
					if (capSearch === isNotSearch) return { error: "A search cannot both include and exclude CAP tiers." };
					capSearch = !isNotSearch;
				}
				const invalid = validParameter("tiers", target, isNotSearch, target);
				if (invalid) return { error: invalid };
				tierSearch = tierSearch || !isNotSearch;
				if (isTierInequalityParam) {
					const tierValue = singlesTiersValues[target];
					const entires = Object.entries(singlesTiersValues);
					for (const [key, value] of entires) {
						const useTier = (value > tierValue && tierInequality[0]) || (value < tierValue && !tierInequality[0]);
						if (useTier && (!key.startsWith('CAP') || capSearch)) {
							orGroup.tiers[key] = true;
						} else if (tierValue === value && tierInequality[1]) {
							orGroup.tiers[key] = true;
						}
					}
				} else {
					orGroup.tiers[target] = !isNotSearch;
				}
				continue;
			}

			if (toID(target) in allDoublesTiers) {
				target = allDoublesTiers[toID(target)];
				const invalid = validParameter("doubles tiers", target, isNotSearch, target);
				if (invalid) return { error: invalid };
				tierSearch = tierSearch || !isNotSearch;
				if (isTierInequalityParam) {
					const tierValue = doublesTiersValues[target];
					const entires = Object.entries(doublesTiersValues);
					for (const [key, value] of entires) {
						if ((value > tierValue && tierInequality[0]) || (value < tierValue && !tierInequality[0])) {
							orGroup.doublesTiers[key] = true;
						} else if (tierValue === value && tierInequality[1]) {
							orGroup.doublesTiers[key] = true;
						}
					}
				} else {
					orGroup.doublesTiers[target] = !isNotSearch;
				}
				continue;
			}

			if (allColors.includes(target)) {
				target = target.charAt(0).toUpperCase() + target.slice(1);
				const invalid = validParameter("colors", target, isNotSearch, target);
				if (invalid) return { error: invalid };
				orGroup.colors[target] = !isNotSearch;
				continue;
			}

			const targetMove = mod.moves.get(target);
			if (targetMove.exists) {
				const invalid = validParameter("moves", targetMove.id, isNotSearch, target);
				if (invalid) return { error: invalid };
				orGroup.moves[targetMove.id] = !isNotSearch;
				continue;
			}

			let targetType;
			if (target.endsWith('type')) {
				targetType = toID(target.substring(0, target.indexOf('type')));
			} else {
				targetType = toID(target);
			}
			if (targetType in allTypes) {
				target = allTypes[targetType];
				const invalid = validParameter("types", target, isNotSearch, target);
				if (invalid) return { error: invalid };
				if ((orGroup.types[target] && isNotSearch) || (orGroup.types[target] === false && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include a type.' };
				}
				orGroup.types[target] = !isNotSearch;
				continue;
			}

			if (['mono', 'monotype'].includes(toID(target))) {
				if (singleTypeSearch === isNotSearch) return { error: "A search cannot include and exclude 'monotype'." };
				if (parameters.length > 1) return { error: "The parameter 'monotype' cannot have alternative parameters." };
				singleTypeSearch = !isNotSearch;
				orGroup.skip = true;
				continue;
			}

			if (target === 'natdex') {
				if (parameters.length > 1) return { error: "The parameter 'natdex' cannot have alternative parameters." };
				nationalSearch = true;
				orGroup.skip = true;
				continue;
			}

			if (target === 'unreleased') {
				if (parameters.length > 1) return { error: "The parameter 'unreleased' cannot have alternative parameters." };
				unreleasedSearch = true;
				orGroup.skip = true;
				continue;
			}

			let groupIndex = target.indexOf('group');
			if (groupIndex === -1) groupIndex = target.length;
			if (groupIndex !== target.length || toID(target) in allEggGroups) {
				target = toID(target.substring(0, groupIndex));
				if (target in allEggGroups) {
					target = allEggGroups[toID(target)];
					const invalid = validParameter("egg groups", target, isNotSearch, target);
					if (invalid) return { error: invalid };
					orGroup['egg groups'][target] = !isNotSearch;
					continue;
				} else {
					return { error: `'${target}' is not a recognized egg group.` };
				}
			}
			if (toID(target) in allEggGroups) {
				target = allEggGroups[toID(target)];
				const invalid = validParameter("egg groups", target, isNotSearch, target);
				if (invalid) return { error: invalid };
				orGroup['egg groups'][target] = !isNotSearch;
				continue;
			}

			let targetInt = 0;
			if (target.substr(0, 1) === 'g' && Number.isInteger(parseFloat(target.substr(1)))) {
				targetInt = parseInt(target.substr(1).trim());
			} else if (target.substr(0, 3) === 'gen' && Number.isInteger(parseFloat(target.substr(3)))) {
				targetInt = parseInt(target.substr(3).trim());
			}
			if (0 < targetInt && targetInt <= mod.gen) {
				const invalid = validParameter("gens", String(targetInt), isNotSearch, target);
				if (invalid) return { error: invalid };
				orGroup.gens[targetInt] = !isNotSearch;
				continue;
			}

			if (target.endsWith(' asc') || target.endsWith(' desc')) {
				if (parameters.length > 1) {
					return { error: `The parameter '${target.split(' ')[1]}' cannot have alternative parameters.` };
				}
				const stat = allStatAliases[toID(target.split(' ')[0])] || toID(target.split(' ')[0]);
				if (!allStats.includes(stat)) return { error: `'${target}' did not contain a valid stat.` };
				sort = `${stat}${target.endsWith(' asc') ? '+' : '-'}`;
				orGroup.skip = true;
				break;
			}

			if (target === 'all') {
				if (!canAll) return { error: "A search with the parameter 'all' cannot be broadcast." };
				if (parameters.length > 1) return { error: "The parameter 'all' cannot have alternative parameters." };
				showAll = true;
				orGroup.skip = true;
				break;
			}

			if (target.substr(0, 6) === 'random' && cmd === 'randpoke') {
				// Validation for this is in the /randpoke command
				randomOutput = parseInt(target.substr(6));
				orGroup.skip = true;
				continue;
			}

			if (allFormes.includes(toID(target))) {
				target = toID(target);
				orGroup.formes[target] = !isNotSearch;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if (megaSearch === isNotSearch) return { error: "A search cannot include and exclude 'mega'." };
				if (parameters.length > 1) return { error: "The parameter 'mega' cannot have alternative parameters." };
				megaSearch = !isNotSearch;
				orGroup.skip = true;
				break;
			}

			if (target === 'gmax' || target === 'gigantamax') {
				if (gmaxSearch === isNotSearch) return { error: "A search cannot include and exclude 'gigantamax'." };
				if (parameters.length > 1) return { error: "The parameter 'gigantamax' cannot have alternative parameters." };
				gmaxSearch = !isNotSearch;
				orGroup.skip = true;
				break;
			}

			if (['fully evolved', 'fullyevolved', 'fe'].includes(target)) {
				if (fullyEvolvedSearch === isNotSearch) return { error: "A search cannot include and exclude 'fully evolved'." };
				if (parameters.length > 1) return { error: "The parameter 'fully evolved' cannot have alternative parameters." };
				fullyEvolvedSearch = !isNotSearch;
				orGroup.skip = true;
				break;
			}

			if (['restricted legendary', 'restrictedlegendary', 'restricted'].includes(target)) {
				if (restrictedSearch === isNotSearch) return { error: "A search cannot include and exclude 'restricted legendary'." };
				if (parameters.length > 1) return { error: "The parameter 'restricted legendary' cannot have alternative parameters." };
				restrictedSearch = !isNotSearch;
				orGroup.skip = true;
				break;
			}

			if (target === 'recovery') {
				const recoveryMoves = [
					"healorder", "junglehealing", "lifedew", "milkdrink", "moonlight", "morningsun", "recover",
					"roost", "shoreup", "slackoff", "softboiled", "strengthsap", "synthesis", "wish",
				];
				for (const move of recoveryMoves) {
					const invalid = validParameter("moves", move, isNotSearch, target);
					if (invalid) return { error: invalid };
					if (isNotSearch) {
						orGroup.skip = true;
						const bufferObj: { moves: { [k: string]: boolean } } = { moves: {} };
						bufferObj.moves[move] = false;
						searches.push(bufferObj as DexOrGroup);
					} else {
						orGroup.moves[move] = true;
					}
				}
				continue;
			}

			if (target === 'zrecovery') {
				const recoveryMoves = [
					"aromatherapy", "bellydrum", "conversion2", "haze", "healbell", "mist",
					"psychup", "refresh", "spite", "stockpile", "teleport", "transform",
				];
				for (const moveid of recoveryMoves) {
					const invalid = validParameter("moves", moveid, isNotSearch, target);
					if (invalid) return { error: invalid };
					if (isNotSearch) {
						orGroup.skip = true;
						const bufferObj: { moves: { [k: string]: boolean } } = { moves: {} };
						bufferObj.moves[moveid] = false;
						searches.push(bufferObj as DexOrGroup);
					} else {
						orGroup.moves[moveid] = true;
					}
				}
				continue;
			}

			if (target === 'priority') {
				for (const moveid in mod.data.Moves) {
					const move = mod.moves.get(moveid);
					if (move.category === "Status" || move.id === "bide") continue;
					if (move.priority > 0) {
						const invalid = validParameter("moves", moveid, isNotSearch, target);
						if (invalid) return { error: invalid };
						if (isNotSearch) {
							orGroup.skip = true;
							const bufferObj: { moves: { [k: string]: boolean } } = { moves: {} };
							bufferObj.moves[moveid] = false;
							searches.push(bufferObj as DexOrGroup);
						} else {
							orGroup.moves[moveid] = true;
						}
					}
				}
				continue;
			}

			if (target.substr(0, 8) === 'resists ') {
				const targetResist = target.substr(8, 1).toUpperCase() + target.substr(9);
				if (mod.types.isName(targetResist)) {
					const invalid = validParameter("resists", targetResist, isNotSearch, target);
					if (invalid) return { error: invalid };
					orGroup.resists[targetResist] = !isNotSearch;
					continue;
				} else {
					if (toID(targetResist) in mod.data.Moves) {
						const move = mod.moves.get(targetResist);
						if (move.category === 'Status') {
							return { error: `'${targetResist}' is a status move and can't be used with 'resists'.` };
						} else {
							const invalid = validParameter("resists", targetResist, isNotSearch, target);
							if (invalid) return { error: invalid };
							orGroup.resists[targetResist] = !isNotSearch;
							continue;
						}
					} else {
						return { error: `'${targetResist}' is not a recognized type or move.` };
					}
				}
			}

			if (target.substr(0, 5) === 'weak ') {
				const targetWeak = target.substr(5, 1).toUpperCase() + target.substr(6);
				if (mod.types.isName(targetWeak)) {
					const invalid = validParameter("weak", targetWeak, isNotSearch, target);
					if (invalid) return { error: invalid };
					orGroup.weak[targetWeak] = !isNotSearch;
					continue;
				} else {
					if (toID(targetWeak) in mod.data.Moves) {
						const move = mod.moves.get(targetWeak);
						if (move.category === 'Status') {
							return { error: `'${targetWeak}' is a status move and can't be used with 'weak'.` };
						} else {
							const invalid = validParameter("weak", targetWeak, isNotSearch, target);
							if (invalid) return { error: invalid };
							orGroup.weak[targetWeak] = !isNotSearch;
							continue;
						}
					} else {
						return { error: `'${targetWeak}' is not a recognized type or move.` };
					}
				}
			}

			if (target === 'pivot') {
				for (const move in mod.data.Moves) {
					const moveData = mod.moves.get(move);
					if (moveData.selfSwitch && moveData.id !== 'revivalblessing' && moveData.id !== 'batonpass') {
						const invalid = validParameter("moves", move, isNotSearch, target);
						if (invalid) return { error: invalid };
						if (isNotSearch) {
							orGroup.skip = true;
							const bufferObj: { moves: { [k: string]: boolean } } = { moves: {} };
							bufferObj.moves[move] = false;
							searches.push(bufferObj as DexOrGroup);
						} else {
							orGroup.moves[move] = true;
						}
					}
				}
				continue;
			}

			const inequality = target.search(/>|<|=/);
			let inequalityString;
			if (inequality >= 0) {
				if (isNotSearch) return { error: "You cannot use the negation symbol '!' in stat ranges." };
				if (target.charAt(inequality + 1) === '=') {
					inequalityString = target.substr(inequality, 2);
				} else {
					inequalityString = target.charAt(inequality);
				}
				const targetParts = target.replace(/\s/g, '').split(inequalityString);
				let num;
				let stat;
				const directions: Direction[] = [];
				if (!isNaN(parseFloat(targetParts[0]))) {
					// e.g. 100 < spe
					num = parseFloat(targetParts[0]);
					stat = targetParts[1];
					if (inequalityString.startsWith('>')) directions.push('less');
					if (inequalityString.startsWith('<')) directions.push('greater');
				} else if (!isNaN(parseFloat(targetParts[1]))) {
					// e.g. spe > 100
					num = parseFloat(targetParts[1]);
					stat = targetParts[0];
					if (inequalityString.startsWith('<')) directions.push('less');
					if (inequalityString.startsWith('>')) directions.push('greater');
				} else {
					return { error: `No value given to compare with '${target}'.` };
				}
				if (inequalityString.endsWith('=')) directions.push('equal');
				if (stat in allStatAliases) stat = allStatAliases[stat];
				if (!allStats.includes(stat)) return { error: `'${target}' did not contain a valid stat.` };
				if (!orGroup.stats[stat]) orGroup.stats[stat] = Object.create(null);
				for (const direction of directions) {
					if (orGroup.stats[stat][direction]) return { error: `Invalid stat range for ${stat}.` };
					orGroup.stats[stat][direction] = num;
				}
				continue;
			}
			return { error: `'${target}' could not be found in any of the search categories.` };
		}
		if (!orGroup.skip) {
			searches.push(orGroup);
		}
	}
	if (
		showAll && searches.length === 0 && singleTypeSearch === null &&
		megaSearch === null && gmaxSearch === null && fullyEvolvedSearch === null && restrictedSearch === null && sort === null
	) {
		return {
			error: "No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.",
		};
	}

	const dex: { [k: string]: Species } = {};
	for (const species of mod.species.all()) {
		const megaSearchResult = megaSearch === null || megaSearch === !!species.isMega;
		const gmaxSearchResult = gmaxSearch === null || gmaxSearch === species.name.endsWith('-Gmax');
		const fullyEvolvedSearchResult = fullyEvolvedSearch === null || fullyEvolvedSearch !== species.nfe;
		const restrictedSearchResult = restrictedSearch === null ||
			restrictedSearch === species.tags.includes('Restricted Legendary');
		if (
			species.gen <= mod.gen &&
			(
				(nationalSearch && species.natDexTier !== 'Illegal') ||
				((species.tier !== 'Unreleased' || unreleasedSearch) && species.tier !== 'Illegal')
			) &&
			(!species.tier.startsWith("CAP") || capSearch) &&
			megaSearchResult &&
			gmaxSearchResult &&
			fullyEvolvedSearchResult &&
			restrictedSearchResult
		) {
			dex[species.id] = species;
		}
	}

	// Prioritize searches with the least alternatives.
	const accumulateKeyCount = (count: number, searchData: AnyObject) =>
		count + (typeof searchData === 'object' ? Object.keys(searchData).length : 0);
	Utils.sortBy(searches, search => (
		Object.values(search).reduce(accumulateKeyCount, 0)
	));

	// Prepare move validator and pokemonSource outside the hot loop
	// but don't prepare them at all if there are no moves to check...
	// These only ever get accessed if there are moves to filter by.
	let validator;
	let pokemonSource;
	if (Object.values(searches).some(search => Object.keys(search.moves).length !== 0)) {
		const format = Object.entries(Dex.data.Rulesets).find(([a, f]) => f.mod === usedMod)?.[1].name || 'gen9ou';
		const ruleTable = Dex.formats.getRuleTable(Dex.formats.get(format));
		const additionalRules = [];
		if (nationalSearch && !ruleTable.has('natdexmod')) additionalRules.push('natdexmod');
		if (nationalSearch && ruleTable.valueRules.has('minsourcegen')) additionalRules.push('!!minsourcegen=3');
		validator = TeamValidator.get(`${format}${additionalRules.length ? `@@@${additionalRules.join(',')}` : ''}`);
	}
	for (const alts of searches) {
		if (alts.skip) continue;
		const altsMoves = Object.keys(alts.moves).map(x => mod.moves.get(x)).filter(move => move.gen <= mod.gen);
		for (const mon in dex) {
			let matched = false;
			if (alts.gens && Object.keys(alts.gens).length) {
				if (alts.gens[dex[mon].gen]) continue;
				if (Object.values(alts.gens).includes(false) && alts.gens[dex[mon].gen] !== false) continue;
			}

			if (alts.colors && Object.keys(alts.colors).length) {
				if (alts.colors[dex[mon].color]) continue;
				if (Object.values(alts.colors).includes(false) && alts.colors[dex[mon].color] !== false) continue;
			}

			for (const eggGroup in alts['egg groups']) {
				if (dex[mon].eggGroups.includes(eggGroup) === alts['egg groups'][eggGroup]) {
					matched = true;
					break;
				}
			}

			if (alts.tiers && Object.keys(alts.tiers).length) {
				let tier = dex[mon].tier;
				if (nationalSearch) tier = dex[mon].natDexTier;
				if (tier.startsWith('(')) tier = tier.slice(1, -1) as TierTypes.Singles;
				// if (tier === 'New') tier = 'OU';
				if (alts.tiers[tier]) continue;
				if (Object.values(alts.tiers).includes(false) && alts.tiers[tier] !== false) continue;
				// LC handling, checks for LC Pokemon in higher tiers that need to be handled separately,
				// as well as event-only Pokemon that are not eligible for LC despite being the first stage
				let format = Dex.formats.get(`gen${mod.gen}lc`);
				if (format.effectType !== 'Format') format = Dex.formats.get('gen9lc');
				if (
					alts.tiers.LC &&
					!dex[mon].prevo &&
					dex[mon].nfe &&
					!Dex.formats.getRuleTable(format).isBannedSpecies(dex[mon])
				) {
					const lsetData = mod.species.getLearnsetData(dex[mon].id);
					if (lsetData.exists && lsetData.eventData && lsetData.eventOnly) {
						let validEvents = 0;
						for (const event of lsetData.eventData) {
							if (event.level && event.level <= 5) validEvents++;
						}
						if (validEvents > 0) continue;
					} else {
						continue;
					}
				}
			}

			if (alts.doublesTiers && Object.keys(alts.doublesTiers).length) {
				let tier = dex[mon].doublesTier;
				if (tier && tier.startsWith('(') && tier !== '(DUU)') tier = tier.slice(1, -1) as TierTypes.Doubles;
				if (alts.doublesTiers[tier]) continue;
				if (Object.values(alts.doublesTiers).includes(false) && alts.doublesTiers[tier] !== false) continue;
			}

			for (const type in alts.types) {
				if (dex[mon].types.includes(type) === alts.types[type]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			for (const targetResist in alts.resists) {
				let effectiveness = 0;
				const move = mod.moves.get(targetResist);
				const attackingType = move.type || targetResist;
				const notImmune = (move.id === 'thousandarrows' || mod.getImmunity(attackingType, dex[mon])) &&
					!(move.id === 'sheercold' && mod.gen >= 7 && dex[mon].types.includes('Ice'));
				if (notImmune && !move.ohko && move.damage === undefined) {
					for (const defenderType of dex[mon].types) {
						const baseMod = mod.getEffectiveness(attackingType, defenderType);
						const moveMod = move.onEffectiveness?.call(
							{ dex: mod } as Battle, baseMod, null, defenderType, move as ActiveMove,
						);
						effectiveness += typeof moveMod === 'number' ? moveMod : baseMod;
					}
				}
				if (!alts.resists[targetResist]) {
					if (notImmune && effectiveness >= 0) matched = true;
				} else {
					if (!notImmune || effectiveness < 0) matched = true;
				}
			}
			if (matched) continue;

			for (const targetWeak in alts.weak) {
				let effectiveness = 0;
				const move = mod.moves.get(targetWeak);
				const attackingType = move.type || targetWeak;
				const notImmune = (move.id === 'thousandarrows' || mod.getImmunity(attackingType, dex[mon])) &&
					!(move.id === 'sheercold' && mod.gen >= 7 && dex[mon].types.includes('Ice'));
				if (notImmune && !move.ohko && move.damage === undefined) {
					for (const defenderType of dex[mon].types) {
						const baseMod = mod.getEffectiveness(attackingType, defenderType);
						const moveMod = move.onEffectiveness?.call(
							{ dex: mod } as Battle, baseMod, null, defenderType, move as ActiveMove,
						);
						effectiveness += typeof moveMod === 'number' ? moveMod : baseMod;
					}
				}
				if (alts.weak[targetWeak]) {
					if (notImmune && effectiveness >= 1) matched = true;
				} else {
					if (!notImmune || effectiveness < 1) matched = true;
				}
			}
			if (matched) continue;

			for (const ability in alts.abilities) {
				if (Object.values(dex[mon].abilities).includes(ability) === alts.abilities[ability]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			for (const forme in alts.formes) {
				if (toID(dex[mon].forme).includes(forme) === alts.formes[forme]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			for (const stat in alts.stats) {
				let monStat = 0;
				if (stat === 'bst') {
					monStat = dex[mon].bst;
				} else if (stat === 'weight') {
					monStat = dex[mon].weighthg / 10;
				} else if (stat === 'height') {
					monStat = dex[mon].heightm;
				} else if (stat === 'gen') {
					monStat = dex[mon].gen;
				} else {
					monStat = dex[mon].baseStats[stat as StatID];
				}
				if (typeof alts.stats[stat].less === 'number') {
					if (monStat < alts.stats[stat].less) {
						matched = true;
						break;
					}
				}
				if (typeof alts.stats[stat].greater === 'number') {
					if (monStat > alts.stats[stat].greater) {
						matched = true;
						break;
					}
				}
				if (typeof alts.stats[stat].equal === 'number') {
					if (monStat === alts.stats[stat].equal) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;

			for (const move of altsMoves) {
				pokemonSource = validator?.allSources();
				if (validator && !validator.checkCanLearn(move, dex[mon], pokemonSource) === alts.moves[move.id]) {
					matched = true;
					break;
				}
				if (pokemonSource && !pokemonSource.size()) break;
			}
			if (matched) continue;

			delete dex[mon];
		}
	}

	const stat = sort?.slice(0, -1);

	function getSortValue(name: string) {
		if (!stat) return 0;
		const mon = mod.species.get(name);
		if (stat === 'bst') {
			return mon.bst;
		} else if (stat === 'weight') {
			return mon.weighthg;
		} else if (stat === 'height') {
			return mon.heightm;
		} else if (stat === 'gen') {
			return mon.gen;
		} else {
			return mon.baseStats[stat as StatID];
		}
	}

	let results: string[] = [];
	for (const mon of Object.keys(dex).sort()) {
		if (singleTypeSearch !== null && (dex[mon].types.length === 1) !== singleTypeSearch) continue;
		const isRegionalForm = (["Alola", "Galar", "Hisui"].includes(dex[mon].forme) || dex[mon].forme.startsWith("Paldea")) &&
			dex[mon].baseSpecies !== "Pikachu";
		const maskForm = dex[mon].baseSpecies === "Ogerpon" && !dex[mon].forme.endsWith("Tera");
		const allowGmax = (gmaxSearch || tierSearch);
		if (!isRegionalForm && !maskForm && dex[mon].baseSpecies && results.includes(dex[mon].baseSpecies) &&
			getSortValue(mon) === getSortValue(dex[mon].baseSpecies)) continue;
		const teraFormeChangesFrom = dex[mon].forme.endsWith("Tera") ? !Array.isArray(dex[mon].battleOnly) ?
			dex[mon].battleOnly! : null : null;
		if (teraFormeChangesFrom && results.includes(teraFormeChangesFrom) &&
			getSortValue(mon) === getSortValue(teraFormeChangesFrom)) continue;
		if (dex[mon].isNonstandard === 'Gigantamax' && !allowGmax) continue;
		results.push(dex[mon].name);
	}

	if (usedMod === 'gen7letsgo') {
		results = results.filter(name => {
			const species = mod.species.get(name);
			return (species.num <= 151 || ['Meltan', 'Melmetal'].includes(species.name)) &&
				(!species.forme || (['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(species.forme) &&
					species.name !== 'Pikachu-Alola'));
		});
	}

	if (usedMod === 'gen8bdsp') {
		results = results.filter(name => {
			const species = mod.species.get(name);
			if (species.id === 'pichuspikyeared') return false;
			if (capSearch) return species.gen <= 4;
			return species.gen <= 4 && species.num >= 1;
		});
	}

	if (randomOutput && randomOutput < results.length) {
		results = Utils.shuffle(results).slice(0, randomOutput);
	}

	let resultsStr = (message === "" ? message : `<span style="color:#999999;">${Utils.escapeHTML(message)}:</span><br />`);
	if (results.length > 1) {
		results.sort();
		if (sort) {
			const direction = sort.slice(-1);
			Utils.sortBy(results, name => getSortValue(name) * (direction === '+' ? 1 : -1));
		}
		let notShown = 0;
		if (!showAll && results.length > MAX_RANDOM_RESULTS) {
			notShown = results.length - RESULTS_MAX_LENGTH;
			results = results.slice(0, RESULTS_MAX_LENGTH);
		}
		resultsStr += results.map(
			result => `<a href="//${Config.routes.dex}/pokemon/${toID(result)}" target="_blank" class="subtle" style="white-space:nowrap"><psicon pokemon="${result}" style="vertical-align:-7px;margin:-2px" />${result}</a>`
		).join(", ");
		if (notShown) {
			resultsStr += `, and ${notShown} more. <span style="color:#999999;">Redo the search with ', all' at the end to show all results.</span>`;
		}
	} else if (results.length === 1) {
		return { dt: `${results[0]}${usedMod ? `,${usedMod}` : ''}` };
	} else {
		resultsStr += "No Pok&eacute;mon found.";
	}
	if (isTest) return { results, reply: resultsStr };
	return { reply: resultsStr };
}

function runMovesearch(target: string, cmd: string, canAll: boolean, message: string, isTest: boolean) {
	const searches: MoveOrGroup[] = [];
	const { splitTarget, usedMod, count } = getMod(target);
	if (count > 1) {
		return { error: `You can't run searches for multiple mods.` };
	}

	const mod = Dex.mod(usedMod || 'base');
	const allCategories = ['physical', 'special', 'status'];
	const allContestTypes = ['beautiful', 'clever', 'cool', 'cute', 'tough'];
	const allProperties = ['basePower', 'accuracy', 'priority', 'pp'];
	const allFlags = [
		'allyanim', 'bypasssub', 'bite', 'bullet', 'cantusetwice', 'charge', 'contact', 'dance', 'defrost', 'distance', 'failcopycat', 'failencore',
		'failinstruct', 'failmefirst', 'failmimic', 'futuremove', 'gravity', 'heal', 'metronome', 'mirror', 'mustpressure', 'noassist', 'nonsky',
		'noparentalbond', 'nosketch', 'nosleeptalk', 'pledgecombo', 'powder', 'protect', 'pulse', 'punch', 'recharge', 'reflectable', 'slicing',
		'snatch', 'sound', 'wind',

		// Not flags directly from move data, but still useful to sort by
		'highcrit', 'multihit', 'ohko', 'protection', 'secondary',
		'zmove', 'maxmove', 'gmaxmove',
	];
	const allStatus = ['psn', 'tox', 'brn', 'par', 'frz', 'slp'];
	const allVolatileStatus = ['flinch', 'confusion', 'partiallytrapped', 'trapped'];
	const allBoosts = ['hp', 'atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'];
	const allTargets: { [k: string]: string } = {
		oneally: 'adjacentAlly',
		userorally: 'adjacentAllyOrSelf',
		oneadjacentopponent: 'adjacentFoe',
		all: 'all',
		alladjacent: 'allAdjacent',
		alladjacentopponents: 'allAdjacentFoes',
		userandallies: 'allies',
		usersside: 'allySide',
		usersteam: 'allyTeam',
		any: 'any',
		opponentsside: 'foeSide',
		oneadjacent: 'normal',
		randomadjacent: 'randomNormal',
		scripted: 'scripted',
		user: 'self',
	};
	const allTypes: { [k: string]: string } = Object.create(null);
	for (const type of mod.types.all()) {
		allTypes[type.id] = type.name;
	}
	let showAll = false;
	let sort: string | null = null;
	const targetMons: { name: string, shouldBeExcluded: boolean }[] = [];
	let nationalSearch = null;
	let randomOutput = 0;
	for (const arg of splitTarget) {
		const orGroup: MoveOrGroup = {
			types: {}, categories: {}, contestTypes: {}, flags: {}, gens: {}, other: {}, mon: {}, property: {},
			boost: {}, lower: {}, zboost: {}, status: {}, volatileStatus: {}, targets: {}, skip: false, multihit: false,
		};
		const parameters = arg.split("|");
		if (parameters.length > 3) return { error: "No more than 3 alternatives for each parameter may be used." };
		for (const parameter of parameters) {
			let isNotSearch = false;
			target = parameter.toLowerCase().trim();
			if (target.startsWith('!')) {
				isNotSearch = true;
				target = target.substr(1);
			}
			let targetType;
			if (target.endsWith('type')) {
				targetType = toID(target.substring(0, target.indexOf('type')));
			} else {
				targetType = toID(target);
			}
			if (allTypes[targetType]) {
				target = allTypes[targetType];
				if ((orGroup.types[target] && isNotSearch) || (orGroup.types[target] === false && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include a type.' };
				}
				orGroup.types[target] = !isNotSearch;
				continue;
			}

			if (allCategories.includes(target)) {
				target = target.charAt(0).toUpperCase() + target.substr(1);
				if (
					(orGroup.categories[target] && isNotSearch) ||
					(orGroup.categories[target] === false && !isNotSearch)
				) {
					return { error: 'A search cannot both exclude and include a category.' };
				}
				orGroup.categories[target] = !isNotSearch;
				continue;
			}

			if (allContestTypes.includes(target)) {
				target = target.charAt(0).toUpperCase() + target.substr(1);
				if (
					(orGroup.contestTypes[target] && isNotSearch) ||
					(orGroup.contestTypes[target] === false && !isNotSearch)
				) {
					return { error: 'A search cannot both exclude and include a contest condition.' };
				}
				orGroup.contestTypes[target] = !isNotSearch;
				continue;
			}

			if (target.startsWith('targets ')) {
				target = toID(target.substr('targets '.length));
				if (target === 'allpokemon' || target === 'anypokemon' || target.includes('adjacent')) {
					target = target.replace('pokemon', '');
				}
				if (Object.keys(allTargets).includes(target)) {
					const moveTarget = allTargets[target];
					if (
						(orGroup.targets[moveTarget] && isNotSearch) ||
						(orGroup.targets[moveTarget] === false && !isNotSearch)
					) {
						return { error: 'A search cannot both exclude and include a move target.' };
					}
					orGroup.targets[moveTarget] = !isNotSearch;
					continue;
				} else {
					return { error: `'${target}' isn't a valid move target.` };
				}
			}

			if (target === 'bypassessubstitute') target = 'bypasssub';
			if (target === 'z') target = 'zmove';
			if (target === 'max') target = 'maxmove';
			if (target === 'gmax') target = 'gmaxmove';
			if (target === 'multi' || toID(target) === 'multihit') target = 'multihit';
			if (target === 'crit' || toID(target) === 'highcrit') target = 'highcrit';
			if (['thaw', 'thaws', 'melt', 'melts', 'defrosts'].includes(target)) target = 'defrost';
			if (target === 'slices' || target === 'slice') target = 'slicing';
			if (toID(target) === 'sheerforce') target = 'secondary';
			if (target === 'bounceable' || toID(target) === 'magiccoat' || toID(target) === 'magicbounce') target = 'reflectable';
			if (allFlags.includes(target)) {
				if ((orGroup.flags[target] && isNotSearch) || (orGroup.flags[target] === false && !isNotSearch)) {
					return { error: `A search cannot both exclude and include '${target}'.` };
				}
				orGroup.flags[target] = !isNotSearch;
				continue;
			}

			let targetInt = 0;
			if (target.substr(0, 1) === 'g' && Number.isInteger(parseFloat(target.substr(1)))) {
				targetInt = parseInt(target.substr(1).trim());
			} else if (target.substr(0, 3) === 'gen' && Number.isInteger(parseFloat(target.substr(3)))) {
				targetInt = parseInt(target.substr(3).trim());
			}

			if (0 < targetInt && targetInt <= mod.gen) {
				if ((orGroup.gens[targetInt] && isNotSearch) || (orGroup.flags[targetInt] === false && !isNotSearch)) {
					return { error: `A search cannot both exclude and include '${target}'.` };
				}
				orGroup.gens[targetInt] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (!canAll) return { error: "A search with the parameter 'all' cannot be broadcast." };
				if (parameters.length > 1) return { error: "The parameter 'all' cannot have alternative parameters." };
				showAll = true;
				orGroup.skip = true;
				continue;
			}

			if (target === 'natdex') {
				if (parameters.length > 1) return { error: "The parameter 'natdex' cannot have alternative parameters." };
				nationalSearch = !isNotSearch;
				orGroup.skip = true;
				continue;
			}

			if (target.endsWith(' asc') || target.endsWith(' desc')) {
				if (parameters.length > 1) {
					return { error: `The parameter '${target.split(' ')[1]}' cannot have alternative parameters.` };
				}
				let prop = target.split(' ')[0];
				switch (toID(prop)) {
				case 'basepower': prop = 'basePower'; break;
				case 'bp': prop = 'basePower'; break;
				case 'power': prop = 'basePower'; break;
				case 'acc': prop = 'accuracy'; break;
				}
				if (!allProperties.includes(prop)) return { error: `'${target}' did not contain a valid property.` };
				sort = `${prop}${target.endsWith(' asc') ? '+' : '-'}`;
				orGroup.skip = true;
				break;
			}

			if (target === 'recovery') {
				if (orGroup.other.recovery === undefined) {
					orGroup.other.recovery = !isNotSearch;
				} else if ((orGroup.other.recovery && isNotSearch) || (!orGroup.other.recovery && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include recovery moves.' };
				}
				continue;
			}

			if (target === 'recoil') {
				if (orGroup.other.recoil === undefined) {
					orGroup.other.recoil = !isNotSearch;
				} else if ((orGroup.other.recoil && isNotSearch) || (!orGroup.other.recoil && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include recoil moves.' };
				}
				continue;
			}

			if (target.substr(0, 6) === 'random' && cmd === 'randmove') {
				// Validation for this is in the /randmove command
				randomOutput = parseInt(target.substr(6));
				orGroup.skip = true;
				continue;
			}

			if (target === 'zrecovery') {
				if (orGroup.other.zrecovery === undefined) {
					orGroup.other.zrecovery = !isNotSearch;
				} else if ((orGroup.other.zrecovery && isNotSearch) || (!orGroup.other.zrecovery && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include z-recovery moves.' };
				}
				continue;
			}

			if (target === 'pivot') {
				if (orGroup.other.pivot === undefined) {
					orGroup.other.pivot = !isNotSearch;
				} else if ((orGroup.other.pivot && isNotSearch) || (!orGroup.other.pivot && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include pivot moves.' };
				}
				continue;
			}

			if (target === 'multihit') {
				if (!orGroup.multihit) {
					orGroup.multihit = true;
				} else if ((orGroup.multihit && isNotSearch) || (!orGroup.multihit && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include multi-hit moves.' };
				}
				continue;
			}

			const species = mod.species.get(target);
			if (species.exists) {
				if (parameters.length > 1) return { error: "A Pok\u00e9mon learnset cannot have alternative parameters." };
				if (targetMons.some(mon => mon.name === species.name && isNotSearch !== mon.shouldBeExcluded)) {
					return { error: "A search cannot both exclude and include the same Pok\u00e9mon." };
				}
				if (targetMons.some(mon => mon.name === species.name)) {
					return { error: "A search should not include a Pok\u00e9mon twice." };
				}
				targetMons.push({ name: species.name, shouldBeExcluded: isNotSearch });
				orGroup.skip = true;
				continue;
			}

			const inequality = target.search(/>|<|=/);
			if (inequality >= 0) {
				let inequalityString;
				if (isNotSearch) return { error: "You cannot use the negation symbol '!' in stat ranges." };
				if (target.charAt(inequality + 1) === '=') {
					inequalityString = target.substr(inequality, 2);
				} else {
					inequalityString = target.charAt(inequality);
				}
				const targetParts = target.replace(/\s/g, '').split(inequalityString);
				let num;
				let prop;
				const directions: Direction[] = [];
				if (!isNaN(parseFloat(targetParts[0]))) {
					// e.g. 100 < bp
					num = parseFloat(targetParts[0]);
					prop = targetParts[1];
					if (inequalityString.startsWith('>')) directions.push('less');
					if (inequalityString.startsWith('<')) directions.push('greater');
				} else if (!isNaN(parseFloat(targetParts[1]))) {
					// e.g. bp > 100
					num = parseFloat(targetParts[1]);
					prop = targetParts[0];
					if (inequalityString.startsWith('<')) directions.push('less');
					if (inequalityString.startsWith('>')) directions.push('greater');
				} else {
					return { error: `No value given to compare with '${target}'.` };
				}
				if (inequalityString.endsWith('=')) directions.push('equal');
				switch (toID(prop)) {
				case 'basepower': prop = 'basePower'; break;
				case 'bp': prop = 'basePower'; break;
				case 'power': prop = 'basePower'; break;
				case 'acc': prop = 'accuracy'; break;
				}
				if (!allProperties.includes(prop)) return { error: `'${target}' did not contain a valid property.` };
				if (!orGroup.property[prop]) orGroup.property[prop] = Object.create(null);
				for (const direction of directions) {
					if (orGroup.property[prop][direction]) return { error: `Invalid property range for ${prop}.` };
					orGroup.property[prop][direction] = num;
				}
				continue;
			}

			if (target.substr(0, 8) === 'priority') {
				let sign: Direction;
				target = target.substr(8).trim();
				if (target === "+" || target === "") {
					sign = 'greater';
				} else if (target === "-") {
					sign = 'less';
				} else {
					return { error: `Priority type '${target}' not recognized.` };
				}
				if (orGroup.property['priority']) {
					return { error: "Priority cannot be set with both shorthand and inequality range." };
				} else {
					orGroup.property['priority'] = Object.create(null);
					orGroup.property['priority'][sign] = 0;
				}
				continue;
			}
			if (target.substr(0, 7) === 'boosts ' || target.substr(0, 7) === 'lowers ') {
				let isBoost = true;
				if (target.substr(0, 7) === 'lowers ') {
					isBoost = false;
				}
				switch (target.substr(7)) {
				case 'attack': target = 'atk'; break;
				case 'defense': target = 'def'; break;
				case 'specialattack': target = 'spa'; break;
				case 'spatk': target = 'spa'; break;
				case 'specialdefense': target = 'spd'; break;
				case 'spdef': target = 'spd'; break;
				case 'speed': target = 'spe'; break;
				case 'acc': target = 'accuracy'; break;
				case 'evasiveness': target = 'evasion'; break;
				default: target = target.substr(7);
				}
				if (!allBoosts.includes(target)) return { error: `'${target}' is not a recognized stat.` };
				if (isBoost) {
					if ((orGroup.boost[target] && isNotSearch) || (orGroup.boost[target] === false && !isNotSearch)) {
						return { error: 'A search cannot both exclude and include a stat boost.' };
					}
					orGroup.boost[target] = !isNotSearch;
				} else {
					if ((orGroup.lower[target] && isNotSearch) || (orGroup.lower[target] === false && !isNotSearch)) {
						return { error: 'A search cannot both exclude and include a stat boost.' };
					}
					orGroup.lower[target] = !isNotSearch;
				}
				continue;
			}

			if (target.substr(0, 8) === 'zboosts ') {
				switch (target.substr(8)) {
				case 'attack': target = 'atk'; break;
				case 'defense': target = 'def'; break;
				case 'specialattack': target = 'spa'; break;
				case 'spatk': target = 'spa'; break;
				case 'specialdefense': target = 'spd'; break;
				case 'spdef': target = 'spd'; break;
				case 'speed': target = 'spe'; break;
				case 'acc': target = 'accuracy'; break;
				case 'evasiveness': target = 'evasion'; break;
				default: target = target.substr(8);
				}
				if (!allBoosts.includes(target)) return { error: `'${target}' is not a recognized stat.` };
				if ((orGroup.zboost[target] && isNotSearch) || (orGroup.zboost[target] === false && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include a stat boost.' };
				}
				orGroup.zboost[target] = !isNotSearch;
				continue;
			}

			const oldTarget = target;
			if (target.endsWith('s')) target = target.slice(0, -1);
			switch (target) {
			case 'toxic': target = 'tox'; break;
			case 'poison': target = 'psn'; break;
			case 'burn': target = 'brn'; break;
			case 'paralyze': target = 'par'; break;
			case 'freeze': target = 'frz'; break;
			case 'sleep': target = 'slp'; break;
			case 'confuse': target = 'confusion'; break;
			case 'partiallytrap': target = 'partiallytrapped'; break;
			case 'flinche': target = 'flinch'; break;
			}

			if (allStatus.includes(target)) {
				if ((orGroup.status[target] && isNotSearch) || (orGroup.status[target] === false && !isNotSearch)) {
					return { error: 'A search cannot both exclude and include a status.' };
				}
				orGroup.status[target] = !isNotSearch;
				continue;
			}

			if (allVolatileStatus.includes(target)) {
				if (
					(orGroup.volatileStatus[target] && isNotSearch) ||
					(orGroup.volatileStatus[target] === false && !isNotSearch)
				) {
					return { error: 'A search cannot both exclude and include a volatile status.' };
				}
				orGroup.volatileStatus[target] = !isNotSearch;
				continue;
			} else if (target === 'trap' || target === 'trapping') {
				for (const trappingType of ['partiallytrapped', 'trapped']) {
					if (!orGroup.volatileStatus[trappingType]) orGroup.volatileStatus[trappingType] = !isNotSearch;
				}
				continue;
			}

			return { error: `'${oldTarget}' could not be found in any of the search categories.` };
		}
		if (!orGroup.skip) {
			searches.push(orGroup);
		}
	}
	if (showAll && !searches.length && !targetMons.length && !sort) {
		return {
			error: "No search parameters other than 'all' were found. Try '/help movesearch' for more information on this command.",
		};
	}

	// Since we assume we have no target mons at first
	// then the valid moveset we can search is the set of all moves.
	const validMoves = new Set(Object.keys(mod.data.Moves)) as Set<ID>;
	for (const mon of targetMons) {
		const species = mod.species.get(mon.name);
		const lsetData = mod.species.getMovePool(species.id, !!nationalSearch);
		// This pokemon's learnset needs to be excluded, so we perform a difference operation
		// on the valid moveset and this pokemon's moveset.
		if (mon.shouldBeExcluded) {
			for (const move of lsetData) {
				validMoves.delete(move);
			}
		} else {
			// This pokemon's learnset needs to be included, so we perform an intersection operation
			// on the valid moveset and this pokemon's moveset.
			for (const move of validMoves) {
				if (!lsetData.has(move)) {
					validMoves.delete(move);
				}
			}
		}
	}

	// At this point, we've trimmed down the valid moveset to be
	// the moves that are appropriate considering the requested pokemon.
	const dex: { [moveid: string]: Move } = {};
	for (const moveid of validMoves) {
		const move = mod.moves.get(moveid);
		if (move.gen <= mod.gen) {
			if (
				(!nationalSearch && move.isNonstandard && move.isNonstandard !== "Gigantamax") ||
				(nationalSearch && move.isNonstandard && !["Gigantamax", "Past", "Unobtainable"].includes(move.isNonstandard)) ||
				(move.isMax && mod.gen !== 8)
			) {
				continue;
			} else {
				dex[moveid] = move;
			}
		}
	}

	for (const alts of searches) {
		if (alts.skip) continue;
		for (const moveid in dex) {
			const move = dex[moveid];
			const recoveryUndefined = alts.other.recovery === undefined;
			const zrecoveryUndefined = alts.other.zrecovery === undefined;
			let matched = false;
			if (Object.keys(alts.types).length) {
				if (alts.types[move.type]) continue;
				if (Object.values(alts.types).includes(false) && alts.types[move.type] !== false) continue;
			}

			if (Object.keys(alts.categories).length) {
				if (alts.categories[move.category]) continue;
				if (Object.values(alts.categories).includes(false) && alts.categories[move.category] !== false) continue;
			}

			if (Object.keys(alts.contestTypes).length) {
				if (alts.contestTypes[move.contestType || 'Cool']) continue;
				if (
					Object.values(alts.contestTypes).includes(false) &&
					alts.contestTypes[move.contestType || 'Cool'] !== false
				) continue;
			}

			if (Object.keys(alts.targets).length) {
				if (alts.targets[move.target]) continue;
				if (Object.values(alts.targets).includes(false) && alts.targets[move.target] !== false) continue;
			}

			for (const flag in alts.flags) {
				if (flag === 'secondary') {
					if (!(move.secondary || move.secondaries || move.hasSheerForce) === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'zmove') {
					if (!move.isZ === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'highcrit') {
					const crit = move.willCrit || (move.critRatio && move.critRatio > 1);
					if (!crit === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'multihit') {
					if (!move.multihit === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'maxmove') {
					if (!(typeof move.isMax === 'boolean' && move.isMax) === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'gmaxmove') {
					if (!(typeof move.isMax === 'string') === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'protection') {
					if (!(move.stallingMove && move.id !== "endure") === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else if (flag === 'ohko') {
					if (!move.ohko === !alts.flags[flag]) {
						matched = true;
						break;
					}
				} else {
					if ((flag in move.flags) === alts.flags[flag]) {
						if (flag === 'protect' && ['all', 'allyTeam', 'allySide', 'foeSide', 'self'].includes(move.target)) continue;
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;
			if (Object.keys(alts.gens).length) {
				if (alts.gens[String(move.gen)]) continue;
				if (Object.values(alts.gens).includes(false) && alts.gens[String(move.gen)] !== false) continue;
			}
			if (!zrecoveryUndefined || !recoveryUndefined) {
				for (const recoveryType in alts.other) {
					let hasRecovery = false;
					if (recoveryType === "recovery") {
						hasRecovery = !!move.drain || !!move.flags.heal;
					} else if (recoveryType === "zrecovery") {
						hasRecovery = (move.zMove?.effect === 'heal');
					}
					if (hasRecovery === alts.other[recoveryType]) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;
			if (alts.other.recoil !== undefined) {
				const recoil = move.recoil || move.hasCrashDamage;
				if (recoil && alts.other.recoil || !(recoil || alts.other.recoil)) matched = true;
			}
			if (matched) continue;
			for (const prop in alts.property) {
				if (typeof alts.property[prop].less === "number") {
					if (
						move[prop as keyof Move] !== true &&
						(move[prop as keyof Move] as number) < alts.property[prop].less
					) {
						matched = true;
						break;
					}
				}
				if (typeof alts.property[prop].greater === "number") {
					if ((move[prop as keyof Move] === true && move.category !== "Status") ||
						move[prop as keyof Move] as number > alts.property[prop].greater) {
						matched = true;
						break;
					}
				}
				if (typeof alts.property[prop].equal === "number") {
					if (move[prop as keyof Move] === alts.property[prop].equal) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;
			for (const boost in alts.boost) {
				if (move.boosts) {
					if ((move.boosts[boost as BoostID]! > 0) === alts.boost[boost]) {
						matched = true;
						break;
					}
				} else if (move.secondary?.self?.boosts) {
					if ((move.secondary.self.boosts[boost as BoostID]! > 0) === alts.boost[boost]) {
						matched = true;
						break;
					}
				} else if (move.selfBoost?.boosts) {
					if ((move.selfBoost.boosts[boost as BoostID]! > 0) === alts.boost[boost]) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;
			for (const lower in alts.lower) {
				if (move.boosts) {
					if ((move.boosts[lower as BoostID]! < 0) === alts.lower[lower]) {
						matched = true;
						break;
					}
				} else if (move.secondary?.boosts) {
					if ((move.secondary.boosts[lower as BoostID]! < 0) === alts.lower[lower]) {
						matched = true;
						break;
					}
				} else if (move.self?.boosts) {
					if ((move.self.boosts[lower as BoostID]! < 0) === alts.lower[lower]) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;
			for (const boost in alts.zboost) {
				const zMove = move.zMove;
				if (zMove?.boost) {
					if ((zMove.boost[boost as BoostID]! > 0) === alts.zboost[boost]) {
						matched = true;
						break;
					}
				}
			}
			if (matched) continue;

			for (const searchStatus in alts.status) {
				let canStatus = !!(
					move.status === searchStatus ||
					(move.secondaries?.some(entry => entry.status === searchStatus))
				);
				if (searchStatus === 'slp') {
					canStatus = canStatus || moveid === 'yawn';
				}
				if (searchStatus === 'brn' || searchStatus === 'frz' || searchStatus === 'par') {
					canStatus = canStatus || moveid === 'triattack';
				}
				if (canStatus === alts.status[searchStatus]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;

			for (const searchStatus in alts.volatileStatus) {
				let canStatus = !!(
					(move.secondary && move.secondary.volatileStatus === searchStatus) ||
					(move.secondaries?.some(entry => entry.volatileStatus === searchStatus)) ||
					(move.volatileStatus === searchStatus) ||
					// This is slightly hacky, but none of the proper trapping moves in moves.ts mechanically use 'trapped' as
					// a volatilestatus despite it being one.
					(('trapped' === searchStatus) &&
						((move.onHit && /\b(?:target|pokemon)\.addVolatile\("trapped",/.test(move.onHit.toString())) ||
							(move.secondary?.onHit && /\b(?:target|pokemon)\.addVolatile\("trapped",/.test(move.secondary.onHit.toString())) ||
							(move.self?.onHit && /\b(?:target|pokemon)\.addVolatile\("trapped",/.test(move.self.onHit.toString()))))
				);
				if (searchStatus === 'partiallytrapped') {
					canStatus = canStatus || moveid === 'gmaxcentiferno' || moveid === 'gmaxsandblast';
				}
				if (searchStatus === 'trapped') {
					canStatus = canStatus || moveid === 'fairylock' || moveid === 'octolock';
				}
				if (canStatus === alts.volatileStatus[searchStatus]) {
					matched = true;
					break;
				}
			}
			if (matched) continue;
			if (alts.other.pivot !== undefined) {
				const pivot = move.selfSwitch && move.id !== 'revivalblessing' && move.id !== 'batonpass';
				if (pivot && alts.other.pivot || !(pivot || alts.other.pivot)) matched = true;
			}
			if (matched) continue;

			delete dex[moveid];
		}
	}

	let results = [];
	for (const move in dex) {
		results.push(dex[move].name);
	}

	let resultsStr = "";
	if (targetMons.length) {
		resultsStr += `<span style="color:#999999;">Matching moves found in learnset(s) for</span> ${targetMons.map(mon => `${mon.shouldBeExcluded ? "!" : ""}${mon.name}`).join(', ')}:<br />`;
	} else {
		resultsStr += (message === "" ? message : `<span style="color:#999999;">${Utils.escapeHTML(message)}:</span><br />`);
	}
	if (randomOutput && randomOutput < results.length) {
		results = Utils.shuffle(results).slice(0, randomOutput);
	}
	if (results.length > 1) {
		results.sort();
		if (sort) {
			const prop = sort.slice(0, -1);
			const direction = sort.slice(-1);
			Utils.sortBy(results, moveName => {
				let moveProp = dex[toID(moveName)][prop as keyof Move] as number;
				// convert booleans to 0 or 1
				if (typeof moveProp === 'boolean') moveProp = moveProp ? 1 : 0;
				return moveProp * (direction === '+' ? 1 : -1);
			});
		}
		let notShown = 0;
		if (!showAll && results.length > MAX_RANDOM_RESULTS) {
			notShown = results.length - RESULTS_MAX_LENGTH;
			results = results.slice(0, RESULTS_MAX_LENGTH);
		}
		resultsStr += results.map(
			result => `<a href="//${Config.routes.dex}/moves/${toID(result)}" target="_blank" class="subtle" style="white-space:nowrap">${result}</a>` +
				(sort ?
					// eslint-disable-next-line @typescript-eslint/no-base-to-string
					` (${dex[toID(result)][sort.slice(0, -1) as keyof Move] === true ? '-' : dex[toID(result)][sort.slice(0, -1) as keyof Move]})` :
					'')
		).join(", ");
		if (notShown) {
			resultsStr += `, and ${notShown} more. <span style="color:#999999;">Redo the search with ', all' at the end to show all results.</span>`;
		}
	} else if (results.length === 1) {
		return { dt: `${results[0]}${usedMod ? `,${usedMod}` : ''}` };
	} else {
		resultsStr += "No moves found.";
	}
	if (isTest) return { results, reply: resultsStr };
	return { reply: resultsStr };
}

function runItemsearch(target: string, cmd: string, canAll: boolean, message: string) {
	let showAll = false;
	let maxGen = 0;
	let gen = 0;
	let randomOutput = 0;

	const targetSplit = target.split(',');
	if (targetSplit[targetSplit.length - 1].trim() === 'all') {
		if (!canAll) return { error: "A search ending in ', all' cannot be broadcast." };
		showAll = true;
		targetSplit.pop();
	}

	const sanitizedTargets = [];
	for (const index of targetSplit.keys()) {
		const localTarget = targetSplit[index].trim();
		if (localTarget.startsWith('random') && cmd === 'randitem') {
			randomOutput = parseInt(localTarget.substr(6));
		} else {
			sanitizedTargets.push(localTarget);
		}
	}
	target = sanitizedTargets.join(',');
	target = target.toLowerCase().replace('-', ' ').replace(/[^a-z0-9.\s/]/g, '');
	const rawSearch = target.replace(/(max ?)?gen \d/g, match => toID(match)).split(' ');
	const searchedWords: string[] = [];
	let foundItems: string[] = [];

	// Refine searched words
	for (const [i, search] of rawSearch.entries()) {
		let newWord = search.trim();
		if (newWord.substr(0, 6) === 'maxgen') {
			const parsedGen = parseInt(newWord.substr(6));
			if (!isNaN(parsedGen)) {
				if (maxGen) return { error: "You cannot specify 'maxgen' multiple times." };
				maxGen = parsedGen;
				if (maxGen < 2 || maxGen > Dex.gen) return { error: "Invalid generation" };
				continue;
			}
		} else if (newWord.substr(0, 3) === 'gen') {
			const parsedGen = parseInt(newWord.substr(3));
			if (!isNaN(parsedGen)) {
				if (gen) return { error: "You cannot specify 'gen' multiple times." };
				gen = parsedGen;
				if (gen < 2 || gen > Dex.gen) return { error: "Invalid generation" };
				continue;
			}
		}
		if (isNaN(parseFloat(newWord))) newWord = newWord.replace('.', '');
		switch (newWord) {
		// Words that don't really help identify item removed to speed up search
		case 'a':
		case 'an':
		case 'is':
		case 'it':
		case 'its':
		case 'the':
		case 'that':
		case 'which':
		case 'user':
		case 'holder':
		case 'holders':
			newWord = '';
			break;
		// replace variations of common words with standardized versions
		case 'opponent': newWord = 'attacker'; break;
		case 'flung': newWord = 'fling'; break;
		case 'heal': case 'heals':
		case 'recovers': newWord = 'restores'; break;
		case 'boost':
		case 'boosts': newWord = 'raises'; break;
		case 'weakens': newWord = 'halves'; break;
		case 'more': newWord = 'increases'; break;
		case 'super':
			if (rawSearch[i + 1] === 'effective') {
				newWord = 'supereffective';
			}
			break;
		case 'special':
			if (rawSearch[i + 1] === 'defense') {
				newWord = 'specialdefense';
			} else if (rawSearch[i + 1] === 'attack') {
				newWord = 'specialattack';
			}
			break;
		case 'spatk':
		case 'spa':
			newWord = 'specialattack';
			break;
		case 'atk':
		case 'attack':
			if (['sp', 'special'].includes(rawSearch[i - 1])) {
				break;
			} else {
				newWord = 'attack';
			}
			break;
		case 'spd':
		case 'spdef':
			newWord = 'specialdefense';
			break;
		case 'def':
		case 'defense':
			if (['sp', 'special'].includes(rawSearch[i - 1])) {
				break;
			} else {
				newWord = 'defense';
			}
			break;
		case 'burns': newWord = 'burn'; break;
		case 'poisons': newWord = 'poison'; break;
		default:
			if (/x[\d.]+/.test(newWord)) {
				newWord = newWord.substr(1) + 'x';
			}
		}
		if (!newWord || searchedWords.includes(newWord)) continue;
		searchedWords.push(newWord);
	}

	if (searchedWords.length === 0 && !gen && !maxGen && randomOutput === 0) {
		return { error: "No distinguishing words were used. Try a more specific search." };
	}

	const dex = maxGen ? Dex.mod(`gen${maxGen}`) : Dex;
	if (searchedWords.includes('fling')) {
		let basePower = 0;
		let effect;

		for (let word of searchedWords) {
			let wordEff = "";
			switch (word) {
			case 'burn': case 'burns':
			case 'brn': wordEff = 'brn'; break;
			case 'paralyze': case 'paralyzes':
			case 'par': wordEff = 'par'; break;
			case 'poison': case 'poisons':
			case 'psn': wordEff = 'psn'; break;
			case 'toxic':
			case 'tox': wordEff = 'tox'; break;
			case 'flinches':
			case 'flinch': wordEff = 'flinch'; break;
			case 'badly': wordEff = 'tox'; break;
			}
			if (wordEff && effect) {
				if (!(wordEff === 'psn' && effect === 'tox')) return { error: "Only specify fling effect once." };
			} else if (wordEff) {
				effect = wordEff;
			} else {
				if (word.substr(word.length - 2) === 'bp' && word.length > 2) word = word.substr(0, word.length - 2);
				if (Number.isInteger(Number(word))) {
					if (basePower) return { error: "Only specify a number for base power once." };
					basePower = parseInt(word);
				}
			}
		}

		for (const item of dex.items.all()) {
			if (!item.fling || (gen && item.gen !== gen) || (maxGen && item.gen <= maxGen)) continue;

			if (basePower && effect) {
				if (item.fling.basePower === basePower &&
					(item.fling.status === effect || item.fling.volatileStatus === effect)) foundItems.push(item.name);
			} else if (basePower) {
				if (item.fling.basePower === basePower) foundItems.push(item.name);
			} else {
				if (item.fling.status === effect || item.fling.volatileStatus === effect) foundItems.push(item.name);
			}
		}
		if (foundItems.length === 0) return { error: `No items inflict ${basePower}bp damage when used with Fling.` };
	} else if (target.search(/natural ?gift/i) >= 0) {
		let basePower = 0;
		let type = "";

		for (let word of searchedWords) {
			if (word in dex.data.TypeChart) {
				if (type) return { error: "Only specify natural gift type once." };
				type = word.charAt(0).toUpperCase() + word.slice(1);
			} else {
				if (word.endsWith('bp') && word.length > 2) word = word.slice(0, -2);
				if (Number.isInteger(Number(word))) {
					if (basePower) return { error: "Only specify a number for base power once." };
					basePower = parseInt(word);
				}
			}
		}

		for (const item of dex.items.all()) {
			if (!item.isBerry || !item.naturalGift || (gen && item.gen !== gen) || (maxGen && item.gen <= maxGen)) continue;

			if (basePower && type) {
				if (item.naturalGift.basePower === basePower && item.naturalGift.type === type) foundItems.push(item.name);
			} else if (basePower) {
				if (item.naturalGift.basePower === basePower) foundItems.push(item.name);
			} else {
				if (item.naturalGift.type === type) foundItems.push(item.name);
			}
		}
		if (foundItems.length === 0) {
			return { error: `No berries inflict ${basePower}bp damage when used with Natural Gift.` };
		}
	} else {
		let bestMatched = 0;
		for (const item of dex.items.all()) {
			let matched = 0;
			// splits words in the description into a toID()-esk format except retaining / and . in numbers
			let descWords = item.desc || '';
			// add more general quantifier words to descriptions
			if (/[1-9.]+x/.test(descWords)) descWords += ' increases';
			if (item.isBerry) descWords += ' berry';
			descWords = descWords.replace(/super[-\s]effective/g, 'supereffective');
			const descWordsArray = descWords.toLowerCase()
				.replace('-', ' ')
				.replace(/[^a-z0-9\s/]/g, '')
				.replace(/(\D)\./, (p0, p1) => p1).split(' ');

			for (const word of searchedWords) {
				switch (word) {
				case 'specialattack':
					if (descWordsArray[descWordsArray.indexOf('sp') + 1] === 'atk') matched++;
					break;
				case 'specialdefense':
					if (descWordsArray[descWordsArray.indexOf('sp') + 1] === 'def') matched++;
					break;
				default:
					if (descWordsArray.includes(word)) matched++;
				}
			}

			if (matched >= (searchedWords.length * 3 / 5) && (!maxGen || item.gen <= maxGen) && (!gen || item.gen === gen)) {
				if (matched === bestMatched) {
					foundItems.push(item.name);
				} else if (matched > bestMatched) {
					foundItems = [item.name];
					bestMatched = matched;
				}
			}
		}
	}

	let resultsStr = (message === "" ? message : `<span style="color:#999999;">${Utils.escapeHTML(message)}:</span><br />`);
	if (randomOutput !== 0) {
		const randomItems = [];
		if (foundItems.length === 0) {
			for (let i = 0; i < randomOutput; i++) {
				randomItems.push(dex.items.all()[Math.floor(Math.random() * dex.items.all().length)]);
			}
		} else {
			if (foundItems.length < randomOutput) {
				randomOutput = foundItems.length;
			}
			for (let i = 0; i < randomOutput; i++) {
				randomItems.push(foundItems[Math.floor(Math.random() * foundItems.length)]);
			}
		}
		resultsStr += randomItems.map(
			result => `<a href="//${Config.routes.dex}/items/${toID(result)}" target="_blank" class="subtle" style="white-space:nowrap"><psicon item="${result}" style="vertical-align:-7px" />${result}</a>`
		).join(", ");
		return { reply: resultsStr };
	}

	if (foundItems.length > 0) {
		foundItems.sort();
		let notShown = 0;
		if (!showAll && foundItems.length > RESULTS_MAX_LENGTH + 5) {
			notShown = foundItems.length - RESULTS_MAX_LENGTH;
			foundItems = foundItems.slice(0, RESULTS_MAX_LENGTH);
		}
		resultsStr += foundItems.map(
			result => `<a href="//${Config.routes.dex}/items/${toID(result)}" target="_blank" class="subtle" style="white-space:nowrap"><psicon item="${result}" style="vertical-align:-7px" />${result}</a>`
		).join(", ");
		if (notShown) {
			resultsStr += `, and ${notShown} more. <span style="color:#999999;">Redo the search with ', all' at the end to show all results.</span>`;
		}
	} else {
		resultsStr += "No items found. Try a more general search";
	}
	return { reply: resultsStr };
}

function runAbilitysearch(target: string, cmd: string, canAll: boolean, message: string) {
	// based heavily on runItemsearch()
	let showAll = false;
	let maxGen = 0;
	let gen = 0;
	let randomOutput = 0;

	const targetSplit = target.split(',');
	if (targetSplit[targetSplit.length - 1].trim() === 'all') {
		if (!canAll) return { error: "A search ending in ', all' cannot be broadcast." };
		showAll = true;
		targetSplit.pop();
	}

	const sanitizedTargets = [];
	for (const index of targetSplit.keys()) {
		const localTarget = targetSplit[index].trim();
		// Check if the target contains "random<digit>".
		if (localTarget.startsWith('random') && cmd === 'randability') {
			// Validation for this is in the /randpoke command
			randomOutput = parseInt(localTarget.substr(6));
		} else {
			sanitizedTargets.push(localTarget);
		}
	}
	target = sanitizedTargets.join(',');

	target = target.toLowerCase().replace('-', ' ').replace(/[^a-z0-9.\s/]/g, '');
	const rawSearch = target.replace(/(max ?)?gen \d/g, match => toID(match)).split(' ');
	const searchedWords: string[] = [];
	let foundAbilities: string[] = [];

	for (const [i, search] of rawSearch.entries()) {
		let newWord = search.trim();
		if (newWord.substr(0, 6) === 'maxgen') {
			const parsedGen = parseInt(newWord.substr(6));
			if (parsedGen) {
				if (maxGen) return { error: "You cannot specify 'maxgen' multiple times." };
				maxGen = parsedGen;
				if (maxGen < 3 || maxGen > Dex.gen) return { error: "Invalid generation" };
				continue;
			}
		} else if (newWord.substr(0, 3) === 'gen') {
			const parsedGen = parseInt(newWord.substr(3));
			if (parsedGen) {
				if (gen) return { error: "You cannot specify 'gen' multiple times." };
				gen = parsedGen;
				if (gen < 3 || gen > Dex.gen) return { error: "Invalid generation" };
				continue;
			}
		}
		if (isNaN(parseFloat(newWord))) newWord = newWord.replace('.', '');
		switch (newWord) {
		// remove extraneous words
		case 'a':
		case 'an':
		case 'is':
		case 'it':
		case 'its':
		case 'the':
		case 'that':
		case 'which':
		case 'user':
			newWord = '';
			break;
		// replace variations of common words with standardized versions
		case 'opponent': newWord = 'attacker'; break;
		case 'heal':
		case 'heals':
		case 'recovers': newWord = 'restores'; break;
		case 'boost':
		case 'boosts': newWord = 'raised'; break;
		case 'super':
			if (rawSearch[i + 1] === 'effective') {
				newWord = 'supereffective';
			}
			break;
		case 'special':
			if (rawSearch[i + 1] === 'defense') {
				newWord = 'specialdefense';
			} else if (rawSearch[i + 1] === 'attack') {
				newWord = 'specialattack';
			}
			break;
		case 'spd':
		case 'spdef': newWord = 'specialdefense'; break;
		case 'spa':
		case 'spatk': newWord = 'specialattack'; break;
		case 'atk': newWord = 'attack'; break;
		case 'def': newWord = 'defense'; break;
		case 'spe': newWord = 'speed'; break;
		case 'burn':
		case 'burns': newWord = 'burned'; break;
		case 'poison':
		case 'poisons': newWord = 'poisoned'; break;
		default:
			if (/x[\d.]+/.test(newWord)) {
				newWord = newWord.substr(1) + 'x';
			}
		}
		if (!newWord || searchedWords.includes(newWord)) continue;
		searchedWords.push(newWord);
	}

	if (searchedWords.length === 0 && !gen && !maxGen && randomOutput === 0) {
		return { error: "No distinguishing words were used. Try a more specific search." };
	}

	let bestMatched = 0;
	const dex = maxGen ? Dex.mod(`gen${maxGen}`) : Dex;
	for (const ability of dex.abilities.all()) {
		let matched = 0;
		// splits words in the description into a toID()-esque format except retaining / and . in numbers
		let descWords = ability.desc || ability.shortDesc || '';
		// add more general quantifier words to descriptions
		if (/[1-9.]+x/.test(descWords)) descWords += ' increases';
		descWords = descWords.replace(/super[-\s]effective/g, 'supereffective');
		const descWordsArray = Chat.normalize(descWords).split(' ');

		for (const word of searchedWords) {
			switch (word) {
			case 'specialattack':
				if (descWordsArray[descWordsArray.indexOf('special') + 1] === 'attack') matched++;
				break;
			case 'specialdefense':
				if (descWordsArray[descWordsArray.indexOf('special') + 1] === 'defense') matched++;
				break;
			default:
				if (descWordsArray.includes(word)) matched++;
			}
		}

		if (matched >= (searchedWords.length * 3 / 5) && (!maxGen || ability.gen <= maxGen) && (!gen || ability.gen === gen)) {
			if (matched === bestMatched) {
				foundAbilities.push(ability.name);
			} else if (matched > bestMatched) {
				foundAbilities = [ability.name];
				bestMatched = matched;
			}
		}
	}

	if (foundAbilities.length === 1) return { dt: foundAbilities[0] };
	let resultsStr = (message === "" ? message : `<span style="color:#999999;">${Utils.escapeHTML(message)}:</span><br />`);

	if (randomOutput !== 0) {
		const randomAbilities = [];
		// If there are no results, we still want to return a random ability.
		if (foundAbilities.length === 0) {
			// Fetch <randomOutput> random abilities.
			for (let i = 0; i < randomOutput; i++) {
				randomAbilities.push(Dex.abilities.all()[Math.floor(Math.random() * Dex.abilities.all().length)]);
			}
		} else {
			// Return <randomOutput> random abilities.
			// If there are less found abilities than the number of random abilities requested, return all found abilities.
			if (foundAbilities.length < randomOutput) {
				randomOutput = foundAbilities.length;
			}
			for (let i = 0; i < randomOutput; i++) {
				randomAbilities.push(foundAbilities[Math.floor(Math.random() * foundAbilities.length)]);
			}
		}
		resultsStr += randomAbilities.map(
			result => `<a href="//${Config.routes.dex}/abilities/${toID(result)}" target="_blank" class="subtle" style="white-space:nowrap">${result}</a>`
		).join(", ");
		return { reply: resultsStr };
	}

	if (foundAbilities.length > 0) {
		foundAbilities.sort();
		let notShown = 0;
		if (!showAll && foundAbilities.length > RESULTS_MAX_LENGTH + 5) {
			notShown = foundAbilities.length - RESULTS_MAX_LENGTH;
			foundAbilities = foundAbilities.slice(0, RESULTS_MAX_LENGTH);
		}
		resultsStr += foundAbilities.map(
			result => `<a href="//${Config.routes.dex}/abilities/${toID(result)}" target="_blank" class="subtle" style="white-space:nowrap">${result}</a>`
		).join(", ");
		if (notShown) {
			resultsStr += `, and ${notShown} more. <span style="color:#999999;">Redo the search with ', all' at the end to show all results.</span>`;
		}
	} else {
		resultsStr += "No abilities found. Try a more general search.";
	}
	return { reply: resultsStr };
}

function runLearn(target: string, cmd: string, canAll: boolean, formatid: string) {
	let format: Format = Dex.formats.get(formatid);
	const targets = target.split(',');
	let formatName = format.name;
	let minSourceGen = undefined;
	let level = 100;

	while (targets.length) {
		const targetid = toID(targets[0]);
		if (targetid === 'pentagon') {
			if (format.effectType === 'Format') {
				return { error: "'pentagon' can't be used with formats." };
			}
			minSourceGen = 6;
			targets.shift();
			continue;
		}
		if (targetid.startsWith('minsourcegen')) {
			if (format.effectType === 'Format') {
				return { error: "'min source gen' can't be used with formats." };
			}
			minSourceGen = parseInt(targetid.slice(12));
			if (isNaN(minSourceGen) || minSourceGen < 1) return { error: `Invalid min source gen "${targetid.slice(12)}"` };
			targets.shift();
			continue;
		}
		if (targetid === 'level5') {
			level = 5;
			targets.shift();
			continue;
		}
		break;
	}
	let gen;
	if (format.effectType !== 'Format') {
		if (!(formatid in Dex.dexes)) {
			// can happen if you hotpatch formats without hotpatching chat
			return { error: `"${formatid}" is not a supported format.` };
		}
		const dex = Dex.mod(formatid);
		gen = dex.gen;
		formatName = `Gen ${gen}`;
		format = new Dex.Format({ mod: formatid, effectType: 'Format', exists: true });
		const ruleTable = dex.formats.getRuleTable(format);
		if (minSourceGen) {
			formatName += ` (Min Source Gen = ${minSourceGen})`;
			ruleTable.minSourceGen = minSourceGen;
		} else if (gen >= 9) {
			ruleTable.minSourceGen = gen;
		}
	} else {
		gen = Dex.forFormat(format).gen;
	}
	const validator = TeamValidator.get(format);

	const species = validator.dex.species.get(targets.shift());
	const setSources = validator.allSources(species);
	const set: Partial<PokemonSet> = {
		name: species.baseSpecies,
		species: species.name,
		level,
	};
	const all = (cmd === 'learnall');

	if (!species.exists || species.id === 'missingno') {
		return { error: `Pok\u00e9mon '${species.id}' not found.` };
	}

	if (species.gen > gen) {
		return { error: `${species.name} didn't exist yet in generation ${gen}.` };
	}

	if (!targets.length) {
		return { error: "You must specify at least one move." };
	}

	const moveNames = [];
	for (const arg of targets) {
		if (['ha', 'hidden', 'hiddenability'].includes(toID(arg))) {
			setSources.isHidden = true;
			continue;
		}
		const move = validator.dex.moves.get(arg);
		moveNames.push(move.name);
		if (!move.exists) {
			return { error: `Move '${move.id}' not found.` };
		}
		if (move.gen > gen) {
			return { error: `${move.name} didn't exist yet in generation ${gen}.` };
		}
	}

	const problems = validator.validateMoves(species, moveNames, setSources, set);
	if (setSources.sources.length) {
		setSources.sources = setSources.sources.map(source => {
			if (source.charAt(1) !== 'E') return source;
			const fathers = validator.findEggMoveFathers(source, species, setSources, true);
			if (!fathers) return '';
			return source + ':' + fathers.join(',');
		}).filter(Boolean);
		if (!setSources.size()) {
			problems.push(`${species.name} doesn't have a valid father for its egg moves (${setSources.limitedEggMoves!.join(', ')})`);
		}
	}

	let buffer = `In ${formatName}, `;
	if (setSources.isHidden) {
		buffer += `${species.abilities['H'] || 'HA'} `;
	}
	buffer += `${species.name}` + (problems.length ? ` <span class="message-learn-cannotlearn">can't</span> learn ` : ` <span class="message-learn-canlearn">can</span> learn `) + toListString(moveNames);
	if (!problems.length) {
		const sourceNames: { [k: string]: string } = {
			'7V': "virtual console transfer from gen 1-2", '8V': "Pok&eacute;mon Home transfer from LGPE", E: "", S: "event", D: "dream world", X: "traded-back ", Y: "traded-back event",
		};
		const sourcesBefore = setSources.sourcesBefore;
		let sources = setSources.sources;
		if (sources.length || sourcesBefore < gen) buffer += " only when obtained";
		buffer += " from:<ul class=\"message-learn-list\">";
		if (sources.length) {
			sources = sources.map(source => {
				if (source.startsWith('1ET')) {
					return '2X' + source.slice(3);
				}
				if (source.startsWith('1ST')) {
					return '2Y' + source.slice(3);
				}
				return source;
			}).sort();
			for (let source of sources) {
				buffer += `<li>Gen ${source.charAt(0)} ${sourceNames[source] || sourceNames[source.charAt(1)]}`;

				if (source.charAt(1) === 'E') {
					let fathers;
					[source, fathers] = source.split(':');
					fathers = fathers.split(',');
					if (fathers.length > 4 && !all) fathers = fathers.slice(-4).concat('...');
					if (source.length > 2) {
						buffer += `${source.slice(2)} `;
					}
					buffer += `egg`;
					if (!fathers[0]) {
						buffer += `: chainbreed`;
					} else {
						buffer += `: breed ${fathers.join(', ')}`;
					}
				}

				if (source.startsWith('5E') && species.maleOnlyHidden) {
					buffer += " (no hidden ability)";
				}
			}
		}
		if (sourcesBefore) {
			const sourceGen = sourcesBefore < gen ? `Gen ${sourcesBefore} or earlier` : `anywhere`;
			if (moveNames.length === 1) {
				if (sourcesBefore >= 8) {
					buffer += `<li>${sourceGen} (move is level-up/tutor/TM/HM/egg in Gen ${sourcesBefore})`;
				} else {
					buffer += `<li>${sourceGen} (move is level-up/tutor/TM/HM in Gen ${sourcesBefore})`;
				}
			} else if (gen >= 8) {
				const orEarlier = sourcesBefore < gen ? ` or level-up/tutor/TM/HM in Gen ${sourcesBefore}${
					sourcesBefore < 7 ? " to 7" : ""
				}` : ``;
				buffer += `<li>${sourceGen} (all moves are level-up/tutor/TM/HM/egg in Gen ${sourcesBefore}${orEarlier})`;
			} else {
				buffer += `<li>${sourceGen} (all moves are level-up/tutor/TM/HM in Gen ${Math.min(gen, sourcesBefore)}${sourcesBefore < gen ? ` to ${gen}` : ""})`;
			}
		}
		if (setSources.babyOnly && sourcesBefore) {
			buffer += `<li>must be obtained as ` + Dex.species.get(setSources.babyOnly).name;
		}
		buffer += "</ul>";
	} else if (problems.length >= 1) {
		const expectedError = `${species.name} can't learn ${moveNames[0]}.`;
		if (problems.length > 1 || moveNames.length > 1 || problems[0] !== expectedError) {
			buffer += ` because:<ul class="message-learn-list">`;
			buffer += `<li>` + problems.join(`</li><li>`) + `</li>`;
			buffer += `</ul>`;
		}
	}
	return { reply: buffer };
}

function runSearch(query: { target: string, cmd: string, canAll: boolean, message: string }, user?: User) {
	if (user) {
		if (user.lastCommand.startsWith('/datasearch ')) {
			throw new Chat.ErrorMessage(
				`You already have a datasearch query pending. Wait until it's complete before running another.`
			);
		}
		user.lastCommand = `/datasearch ${query.cmd}`;
	}
	return PM.query(query).finally(() => {
		if (user) {
			user.lastCommand = '';
		}
	});
}

function runRandtype(target: string, cmd: string, canAll: boolean, message: string) {
	const icon: any = {};
	for (const type of Dex.types.names()) {
		icon[type] = `<img src="https://${Config.routes.client}/sprites/types/${type}.png" width="32" height="14">`;
	}
	let randomOutput = 0;
	target = target.trim();
	const targetSplit = target.split(',');
	for (const index of targetSplit.keys()) {
		const local_target = targetSplit[index].trim();
		// Check if the target contains "random<digit>".
		if (local_target.startsWith('random') && cmd === 'randtype') {
			// Validation for this is in the /randpoke command
			randomOutput = parseInt(local_target.substr(6));
		}
	}
	const randTypes = [];
	for (let i = 0; i < randomOutput; i++) {
		// Add a random type to the output.
		randTypes.push(Dex.types.names()[Math.floor(Math.random() * Dex.types.names().length)]);
	}
	let resultsStr = (message === "" ? message : `<span style="color:#999999;">${Utils.escapeHTML(message)}:</span><br />`);
	resultsStr += randTypes.map(
		type => icon[type]
	).join(' ');
	return { reply: resultsStr };
}

/*********************************************************
 * Process manager
 *********************************************************/

export const PM = new ProcessManager.QueryProcessManager<AnyObject, AnyObject>(module, query => {
	try {
		if (Config.debugdexsearchprocesses && process.send) {
			process.send('DEBUG\n' + JSON.stringify(query));
		}
		switch (query.cmd) {
		case 'randpoke':
		case 'dexsearch':
			return runDexsearch(query.target, query.cmd, query.canAll, query.message, false);
		case 'randmove':
		case 'movesearch':
			return runMovesearch(query.target, query.cmd, query.canAll, query.message, false);
		case 'randitem':
		case 'itemsearch':
			return runItemsearch(query.target, query.cmd, query.canAll, query.message);
		case 'randability':
		case 'abilitysearch':
			return runAbilitysearch(query.target, query.cmd, query.canAll, query.message);
		case 'learn':
			return runLearn(query.target, query.cmd, query.canAll, query.message);
		case 'randtype':
			return runRandtype(query.target, query.cmd, query.canAll, query.message);
		default:
			throw new Error(`Unrecognized Dexsearch command "${query.cmd}"`);
		}
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
	} as any;
	if (Config.crashguard) {
		process.on('uncaughtException', err => {
			Monitor.crashlog(err, 'A dexsearch process');
		});
	}

	global.Dex = require('../../sim/dex').Dex;
	global.toID = Dex.toID;
	Dex.includeData();

	// eslint-disable-next-line no-eval
	require('../../lib/repl').Repl.start('dexsearch', (cmd: string) => eval(cmd));
} else {
	PM.spawn(MAX_PROCESSES);
}

export const testables = {
	runAbilitysearch: (target: string, cmd: string, canAll: boolean, message: string) =>
		runAbilitysearch(target, cmd, canAll, message),
	runDexsearch: (target: string, cmd: string, canAll: boolean, message: string) =>
		runDexsearch(target, cmd, canAll, message, true),
	runMovesearch: (target: string, cmd: string, canAll: boolean, message: string) =>
		runMovesearch(target, cmd, canAll, message, true),
};
