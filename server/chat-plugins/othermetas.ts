// Other Metas plugin by Spandan

import {Utils} from '../../lib/utils';

interface StoneDeltas {
	baseStats: {[stat in StatName]: number};
	weighthg: number;
	type?: string;
}

type TierShiftTiers = 'UU' | 'RUBL' | 'RU' | 'NUBL' | 'NU' | 'PUBL' | 'PU' | 'NFE' | 'LC Uber' | 'LC';

function getMegaStone(stone: string, mod = 'gen8'): Item | null {
	let dex = Dex;
	if (mod && toID(mod) in Dex.dexes) dex = Dex.mod(toID(mod));
	const item = dex.getItem(stone);
	if (!item.exists) {
		if (toID(stone) === 'dragonascent') {
			const move = dex.getMove(stone);
			return {
				id: move.id,
				name: move.name,
				fullname: move.name,
				megaEvolves: 'Rayquaza',
				megaStone: 'Rayquaza-Mega',
				exists: true,
				// Adding extra values to appease typescript
				gen: 6,
				num: -1,
				effectType: 'Item',
				sourceEffect: '',
			};
		} else {
			return null;
		}
	}
	if (!item.megaStone && !item.onPrimal) return null;
	return item;
}

export const commands: ChatCommands = {
	'!othermetas': true,
	om: 'othermetas',
	othermetas(target, room, user) {
		if (!this.runBroadcast()) return;
		target = toID(target);
		let buffer = ``;

		if (target === 'all' && this.broadcasting) {
			return this.sendReplyBox(`You cannot broadcast information about all Other Metagames at once.`);
		}

		if (!target || target === 'all') {
			buffer += `- <a href="https://www.smogon.com/forums/forums/531/">Other Metagames Forum</a><br />`;
			if (!target) return this.sendReplyBox(buffer);
		}
		const showMonthly = (target === 'all' || target === 'omofthemonth' || target === 'omotm' || target === 'month');

		if (target === 'all') {
			// Display OMotM formats, with forum thread links as caption
			this.parse(`/formathelp omofthemonth`);

			// Display the rest of OM formats, with OM hub/index forum links as caption
			this.parse(`/formathelp othermetagames`);
			return this.sendReply(`|raw|<center>${buffer}</center>`);
		}
		if (showMonthly) {
			this.target = 'omofthemonth';
			this.run('formathelp');
		} else {
			this.run('formathelp');
		}
	},
	othermetashelp: [
		`/om - Provides links to information on the Other Metagames.`,
		`!om - Show everyone that information. Requires: + % @ # &`,
	],

	'!mixandmega': true,
	mnm: 'mixandmega',
	mixandmega(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toID(target) || !target.includes('@')) return this.parse('/help mixandmega');
		let dex = Dex;
		const sep = target.split('@');
		const stoneName = sep.slice(1).join('@').trim().split(',');
		const mod = stoneName[1];
		if (mod && toID(mod) in Dex.dexes) dex = Dex.mod(toID(mod));
		const stone = getMegaStone(stoneName[0], mod);
		const species = dex.getSpecies(sep[0]);
		if (!stone || (dex.gen >= 8 && ['redorb', 'blueorb'].includes(stone.id))) {
			return this.errorReply(`Error: Mega Stone not found.`);
		}
		if (!species.exists) return this.errorReply(`Error: Pokemon not found.`);
		const banlist = Dex.getFormat('gen8mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			this.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		// Fake Pokemon and Mega Stones
		if (species.isNonstandard === "CAP") {
			this.errorReply(`Warning: ${species.name} is not a real Pokemon and is therefore not usable in Mix and Mega.`);
		}
		if (stone.isNonstandard === "CAP") {
			this.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseSpecies = dex.getSpecies(stone.megaEvolves);
		let megaSpecies = dex.getSpecies(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaSpecies = dex.getSpecies("Groudon-Primal");
			baseSpecies = dex.getSpecies("Groudon");
		} else if (stone.id === 'blueorb') {
			megaSpecies = dex.getSpecies("Kyogre-Primal");
			baseSpecies = dex.getSpecies("Kyogre");
		}
		const deltas: StoneDeltas = {
			baseStats: Object.create(null),
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
		};
		let statId: StatName;
		for (statId in megaSpecies.baseStats) {
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = dex.gen >= 8 ? 'mono' : megaSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		const mixedSpecies = Dex.deepClone(species);
		mixedSpecies.abilities = Dex.deepClone(megaSpecies.abilities);
		if (mixedSpecies.types[0] === deltas.type) { // Add any type gains
			mixedSpecies.types = [deltas.type];
		} else if (deltas.type === 'mono') {
			mixedSpecies.types = [mixedSpecies.types[0]];
		} else if (deltas.type) {
			mixedSpecies.types = [mixedSpecies.types[0], deltas.type];
		}
		let statName: StatName;
		for (statName in species.baseStats) { // Add the changed stats and weight
			mixedSpecies.baseStats[statName] = Utils.clampIntRange(
				mixedSpecies.baseStats[statName] + deltas.baseStats[statName], 1, 255
			);
		}
		mixedSpecies.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		mixedSpecies.tier = "MnM";
		let weighthit = 20;
		if (mixedSpecies.weighthg >= 2000) {
			weighthit = 120;
		} else if (mixedSpecies.weighthg >= 1000) {
			weighthit = 100;
		} else if (mixedSpecies.weighthg >= 500) {
			weighthit = 80;
		} else if (mixedSpecies.weighthg >= 250) {
			weighthit = 60;
		} else if (mixedSpecies.weighthg >= 100) {
			weighthit = 40;
		}
		const details: {[k: string]: string} = {
			"Dex#": '' + mixedSpecies.num,
			Gen: '' + mixedSpecies.gen,
			Height: mixedSpecies.heightm + " m",
			Weight: mixedSpecies.weighthg / 10 + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		this.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	},
	mixandmegahelp: [
		`/mnm <pokemon> @ <mega stone>[, generation] - Shows the Mix and Mega evolved Pokemon's type and stats.`,
	],

	'!stone': true,
	orb: 'stone',
	megastone: 'stone',
	stone(target) {
		if (!this.runBroadcast()) return;
		const sep = target.split(',');
		let dex = Dex;
		if (sep[1] && toID(sep[1]) in Dex.dexes) dex = Dex.mod(toID(sep[1]));
		const targetid = toID(sep[0]);
		if (!targetid) return this.parse('/help stone');
		const stone = getMegaStone(targetid, sep[1]);
		if (!stone || (dex.gen >= 8 && ['redorb', 'blueorb'].includes(stone.id))) {
			return this.errorReply(`Error: Mega Stone not found.`);
		}
		const banlist = Dex.getFormat('gen8mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			this.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		if (targetid === 'dragonascent') {
			this.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits.`);
		}
		// Fake Mega Stones
		if (stone.isNonstandard === 'CAP') {
			this.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseSpecies = dex.getSpecies(stone.megaEvolves);
		let megaSpecies = dex.getSpecies(stone.megaStone);
		if (dex.gen >= 8 && ['redorb', 'blueorb'].includes(stone.id)) return this.parse('/help stone');
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaSpecies = dex.getSpecies("Groudon-Primal");
			baseSpecies = dex.getSpecies("Groudon");
		} else if (stone.id === 'blueorb') {
			megaSpecies = dex.getSpecies("Kyogre-Primal");
			baseSpecies = dex.getSpecies("Kyogre");
		}
		const deltas: StoneDeltas = {
			baseStats: Object.create(null),
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
		};
		let statId: StatName;
		for (statId in megaSpecies.baseStats) {
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = dex.gen >= 8 ? 'mono' : megaSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		const details = {
			Gen: stone.gen,
			Weight: (deltas.weighthg < 0 ? "" : "+") + deltas.weighthg / 10 + " kg",
		};
		let tier;
		if (['redorb', 'blueorb'].includes(stone.id)) {
			tier = "Orb";
		} else if (targetid === "dragonascent") {
			tier = "Move";
		} else {
			tier = "Stone";
		}
		let buf = `<li class="result">`;
		buf += `<span class="col numcol">${tier}</span> `;
		if (targetid === "dragonascent") {
			buf += `<span class="col itemiconcol"></span>`;
		} else {
			buf += `<span class="col itemiconcol"><psicon item="${targetid}"/></span> `;
		}
		if (targetid === "dragonascent") {
			buf += `<span class="col movenamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/moves/${targetid}" target="_blank">Dragon Ascent</a></span> `;
		} else {
			buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/items/${stone.id}" target="_blank">${stone.name}</a></span> `;
		}
		if (deltas.type && deltas.type !== 'mono') {
			buf += `<span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${deltas.type}.png" alt="${deltas.type}" height="14" width="32"></span> `;
		} else {
			buf += `<span class="col typecol"></span>`;
		}
		buf += `<span style="float:left;min-height:26px">`;
		buf += `<span class="col abilitycol">${megaSpecies.abilities['0']}</span>`;
		buf += `<span class="col abilitycol"></span>`;
		buf += `</span>`;
		buf += `<span style="float:left;min-height:26px">`;
		buf += `<span class="col statcol"><em>HP</em><br />0</span> `;
		buf += `<span class="col statcol"><em>Atk</em><br />${deltas.baseStats.atk}</span> `;
		buf += `<span class="col statcol"><em>Def</em><br />${deltas.baseStats.def}</span> `;
		buf += `<span class="col statcol"><em>SpA</em><br />${deltas.baseStats.spa}</span> `;
		buf += `<span class="col statcol"><em>SpD</em><br />${deltas.baseStats.spd}</span> `;
		buf += `<span class="col statcol"><em>Spe</em><br />${deltas.baseStats.spe}</span> `;
		let bst = 0;
		for (const stat of Object.values(deltas.baseStats)) {
			bst += stat;
		}
		buf += `<span class="col bstcol"><em>BST<br />${bst}</em></span> `;
		buf += `</span>`;
		buf += `</li>`;
		this.sendReply(`|raw|<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`);
		this.sendReply(`|raw|<font size="1"><font color="#686868">Gen:</font> ${details["Gen"]}&nbsp;|&ThickSpace;<font color="#686868">Weight:</font> ${details["Weight"]}</font>`);
	},
	stonehelp: [`/stone <mega stone>[, generation] - Shows the changes that a mega stone/orb applies to a Pokemon.`],

	'!350cup': true,
	350: '350cup',
	'350cup'(target, room, user) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!toID(args[0])) return this.parse('/help 350cup');
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.getFormat(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const species = Dex.deepClone(dex.getSpecies(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			return this.errorReply(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		let bst = 0;
		for (const i in species.baseStats) {
			bst += species.baseStats[i];
		}
		for (const i in species.baseStats) {
			species.baseStats[i] = species.baseStats[i] * (bst <= 350 ? 2 : 1);
		}
		this.sendReply(`|html|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	'350cuphelp': [
		`/350 OR /350cup <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in 350 Cup.`,
	],

	'!tiershift': true,
	ts: 'tiershift',
	ts1: 'tiershift',
	ts2: 'tiershift',
	ts3: 'tiershift',
	ts4: 'tiershift',
	ts5: 'tiershift',
	ts6: 'tiershift',
	ts7: 'tiershift',
	ts8: 'tiershift',
	tiershift(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!toID(args[0])) return this.parse('/help tiershift');
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[1]) args[1] = `gen${targetGen}`;
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.getFormat(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const species = Dex.deepClone(dex.getSpecies(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			return this.errorReply(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		const boosts: {[tier in TierShiftTiers]: number} = {
			UU: 10,
			RUBL: 10,
			RU: 20,
			NUBL: 20,
			NU: 30,
			PUBL: 30,
			PU: 40,
			NFE: 40,
			'LC Uber': 40,
			LC: 40,
		};
		let tier = species.tier;
		if (tier[0] === '(') tier = tier.slice(1, -1);
		if (!(tier in boosts)) return this.sendReply(`|html|${Chat.getDataPokemonHTML(species, dex.gen)}`);
		const boost = boosts[tier as TierShiftTiers];
		for (const statName in species.baseStats) {
			if (statName === 'hp') continue;
			species.baseStats[statName] = Utils.clampIntRange(species.baseStats[statName] + boost, 1, 255);
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	tiershifthelp: [
		`/ts OR /tiershift <pokemon>[, generation] - Shows the base stats that a Pok\u00e9mon would have in Tier Shift.`,
		`Alternatively, you can use /ts[gen number] to see a Pokemon's stats in that generation.`,
	],

	'!scalemons': true,
	scale: 'scalemons',
	scale1: 'scalemons',
	scale2: 'scalemons',
	scale3: 'scalemons',
	scale4: 'scalemons',
	scale5: 'scalemons',
	scale6: 'scalemons',
	scale7: 'scalemons',
	scale8: 'scalemons',
	scalemons(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!args.length || !toID(args[0])) return this.parse(`/help scalemons`);
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[1]) args[1] = `gen${targetGen}`;
		let isGen1 = false;
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.getFormat(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		if (dex.gen === 1) isGen1 = true;
		const species = Dex.deepClone(dex.getSpecies(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			return this.errorReply(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		if (isGen1 && species.gen > 1) return this.errorReply(`Error: Pok\u00e9mon ${target} not found.`);
		const stats = !isGen1 ? ['atk', 'def', 'spa', 'spd', 'spe'] : ['atk', 'def', 'spa', 'spe'];
		const pst = stats.map(stat => species.baseStats[stat]).reduce((x, y) => x + y);
		const scale = (!isGen1 ? 600 : 500) - species.baseStats['hp'];
		for (const stat of stats) {
			species.baseStats[stat] = Utils.clampIntRange(species.baseStats[stat] * scale / pst, 1, 255);
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	scalemonshelp: [
		`/scale OR /scalemons <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in Scalemons.`,
		`Alternatively, you can use /scale[gen number] to see a Pokemon's scaled stats in that generation.`,
	],

	'!natureswap': true,
	ns: 'natureswap',
	ns3: 'natureswap',
	ns4: 'natureswap',
	ns5: 'natureswap',
	ns6: 'natureswap',
	ns7: 'natureswap',
	ns8: 'natureswap',
	natureswap(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		const nature = args[0];
		const pokemon = args[1];
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[2]) args[2] = `gen${targetGen}`;
		let dex = Dex;
		if (args[2] && toID(args[2]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[2])];
		} else if (room?.battle) {
			const format = Dex.getFormat(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		if (!toID(nature) || !toID(pokemon)) return this.parse(`/help natureswap`);
		const natureObj: {
			name: string, plus?: string | undefined, minus?: string | undefined, exists?: boolean,
		} = dex.getNature(nature);
		if (dex.gen < 3) return this.errorReply(`Error: Natures don't exist prior to Generation 3.`);
		if (!natureObj.exists) return this.errorReply(`Error: Nature ${nature} not found.`);
		const species = Dex.deepClone(dex.getSpecies(pokemon));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			return this.errorReply(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		if (natureObj.minus && natureObj.plus) {
			const swap = species.baseStats[natureObj.minus];
			species.baseStats[natureObj.minus] = species.baseStats[natureObj.plus];
			species.baseStats[natureObj.plus] = swap;
			species.tier = 'NS';
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	natureswaphelp: [
		`/ns OR /natureswap <nature>, <pokemon>[, gen] - Shows the base stats that a Pokemon would have in Nature Swap.`,
		`Alternatively, you can use /ns[gen number] to see a Pokemon's stats in that generation.`,
	],

	'!crossevolve': true,
	ce: 'crossevolve',
	crossevo: 'crossevolve',
	crossevolve(target, user, room) {
		if (!this.runBroadcast()) return;
		if (!target || !target.includes(',')) return this.parse(`/help crossevo`);

		const pokes = target.split(',');
		const species = Dex.getSpecies(pokes[0]);
		const crossSpecies = Dex.getSpecies(pokes[1]);

		if (!species.exists) return this.errorReply(`Error: Pokemon '${pokes[0]}' not found.`);
		if (!crossSpecies.exists) return this.errorReply(`Error: Pokemon '${pokes[1]}' not found.`);

		if (!species.evos.length) return this.errorReply(`Error: ${species.name} does not evolve.`);
		if (!crossSpecies.prevo) return this.errorReply(`Error: ${crossSpecies.name} does not have a prevolution.`);

		let setStage = 1;
		let crossStage = 1;
		if (species.prevo) {
			setStage++;
			if (Dex.getSpecies(species.prevo).prevo) {
				setStage++;
			}
		}
		const prevo = Dex.getSpecies(crossSpecies.prevo);
		if (crossSpecies.prevo) {
			crossStage++;
			if (prevo.prevo) {
				crossStage++;
			}
		}
		if (setStage + 1 !== crossStage) {
			return this.errorReply(`Error: Cross evolution must follow evolutionary stages. (${species.name} is Stage ${setStage} and can only cross evolve to Stage ${setStage + 1})`);
		}
		const mixedSpecies = Dex.deepClone(species);
		mixedSpecies.abilities = Dex.deepClone(crossSpecies.abilities);
		mixedSpecies.baseStats = Dex.deepClone(mixedSpecies.baseStats);
		let statName: StatName;
		for (statName in species.baseStats) {
			const statChange = crossSpecies.baseStats[statName] - prevo.baseStats[statName];
			mixedSpecies.baseStats[statName] = Utils.clampIntRange(mixedSpecies.baseStats[statName] + statChange, 1, 255);
		}
		mixedSpecies.types = [species.types[0]];
		if (species.types[1]) mixedSpecies.types.push(species.types[1]);
		if (crossSpecies.types[0] !== prevo.types[0]) mixedSpecies.types[0] = crossSpecies.types[0];
		if (crossSpecies.types[1] !== prevo.types[1]) {
			mixedSpecies.types[1] = crossSpecies.types[1] || crossSpecies.types[0];
		}
		if (mixedSpecies.types[0] === mixedSpecies.types[1]) mixedSpecies.types = [mixedSpecies.types[0]];
		mixedSpecies.weighthg += crossSpecies.weighthg - prevo.weighthg;
		if (mixedSpecies.weighthg < 1) {
			mixedSpecies.weighthg = 1;
		}
		mixedSpecies.tier = "CE";
		let weighthit = 20;
		if (mixedSpecies.weighthg >= 2000) {
			weighthit = 120;
		} else if (mixedSpecies.weighthg >= 1000) {
			weighthit = 100;
		} else if (mixedSpecies.weighthg >= 500) {
			weighthit = 80;
		} else if (mixedSpecies.weighthg >= 250) {
			weighthit = 60;
		} else if (mixedSpecies.weighthg >= 100) {
			weighthit = 40;
		}
		const details: {[k: string]: string} = {
			"Dex#": mixedSpecies.num,
			Gen: mixedSpecies.gen,
			Height: mixedSpecies.heightm + " m",
			Weight: mixedSpecies.weighthg / 10 + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		this.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	},
	crossevolvehelp: [
		"/crossevo <base pokemon>, <evolved pokemon> - Shows the type and stats for the Cross Evolved Pokemon.",
	],
};
