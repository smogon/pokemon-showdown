// Other Metas plugin by Spandan

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
			buffer += `- <a href="https://www.smogon.com/forums/forums/394/">Other Metagames Forum</a><br />`;
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
		`!om - Show everyone that information. Requires: + % @ # & ~`,
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
			mixedSpecies.baseStats[statName] = Dex.clampIntRange(
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
		if (stone.isUnreleased) {
			this.errorReply(`Warning: ${stone.name} is unreleased and is not usable in current Mix and Mega.`);
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
		if (!toID(target)) return this.parse('/help 350cup');
		const species = Dex.deepClone(Dex.getSpecies(target));
		if (!species.exists) return this.errorReply("Error: Pokemon not found.");
		let bst = 0;
		for (const i in species.baseStats) {
			bst += species.baseStats[i];
		}
		for (const i in species.baseStats) {
			species.baseStats[i] = species.baseStats[i] * (bst <= 350 ? 2 : 1);
		}
		this.sendReply(`|html|${Chat.getDataPokemonHTML(species)}`);
	},
	'350cuphelp': [`/350 OR /350cup <pokemon> - Shows the base stats that a Pokemon would have in 350 Cup.`],

	'!tiershift': true,
	ts: 'tiershift',
	tiershift(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toID(target)) return this.parse('/help tiershift');
		const species = Dex.deepClone(Dex.mod('gen7').getSpecies(target));
		if (!species.exists) return this.errorReply("Error: Pokemon not found.");
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
		if (!(tier in boosts)) return this.sendReply(`|html|${Chat.getDataPokemonHTML(species)}`);
		const boost = boosts[tier as TierShiftTiers];
		for (const statName in species.baseStats) {
			if (statName === 'hp') continue;
			species.baseStats[statName] = Dex.clampIntRange(species.baseStats[statName] + boost, 1, 255);
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species)}`);
	},
	tiershifthelp: [`/ts OR /tiershift <pokemon> - Shows the base stats that a Pokemon would have in Tier Shift.`],

	'!scalemons': true,
	scale: 'scalemons',
	scale1: 'scalemons',
	scalemons(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!args.length || !toID(args[0])) return this.parse(`/help scalemons`);
		let isGen1 = false;
		if (cmd === 'scale1') isGen1 = true;
		const species = Dex.deepClone(!isGen1 ? Dex.getSpecies(args[0]) : Dex.mod('gen1').getSpecies(args[0]));
		if (!species.exists) return this.errorReply(`Error: Pokemon ${target} not found.`);
		if (isGen1 && species.gen > 1) return this.errorReply(`Error: Pokemon ${target} not found.`);
		if (!args[1] || toID(args[1]) !== 'hp') {
			const stats = !isGen1 ? ['atk', 'def', 'spa', 'spd', 'spe'] : ['atk', 'def', 'spa', 'spe'];
			const pst = stats.map(stat => species.baseStats[stat]).reduce((x, y) => x + y);
			const scale = (!isGen1 ? 600 : 500) - species.baseStats['hp'];
			for (const stat of stats) {
				species.baseStats[stat] = Dex.clampIntRange(species.baseStats[stat] * scale / pst, 1, 255);
			}
		} else {
			const stats = !isGen1 ? ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] : ['hp', 'atk', 'def', 'spa', 'spe'];
			const pst = stats.map(stat => species.baseStats[stat]).reduce((x, y) => x + y);
			const scale = !isGen1 ? 600 : 500;
			for (const stat of stats) {
				species.baseStats[stat] = Dex.clampIntRange(species.baseStats[stat] * scale / pst, 1, 255);
			}
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, isGen1 ? 1 : 8)}`);
	},
	scalemonshelp: [
		`/scale OR /scalemons <pokemon> - Shows the base stats that a Pokemon would have in Scalemons.`,
		`/scale1 <pokemon> - Shows the base stats that a Pokemon would have in Gen 1.`,
		`You can add ", hp" to both of these commands to scale a Pokemon's stats with HP considered.`,
	],

	'!natureswap': true,
	ns: 'natureswap',
	natureswap(target, room, user) {
		if (!this.runBroadcast()) return;
		const nature = target.trim().split(' ')[0];
		const pokemon = target.trim().split(' ')[1];
		if (!toID(nature) || !toID(pokemon)) return this.parse(`/help natureswap`);
		const natureObj: {
			name: string, plus?: string | undefined, minus?: string | undefined, exists?: boolean,
		} = Dex.getNature(nature);
		if (!natureObj.exists) return this.errorReply(`Error: Nature ${nature} not found.`);
		const species = Dex.deepClone(Dex.getSpecies(pokemon));
		if (!species.exists) return this.errorReply(`Error: Pokemon ${pokemon} not found.`);
		if (natureObj.minus && natureObj.plus) {
			const swap = species.baseStats[natureObj.minus];
			species.baseStats[natureObj.minus] = species.baseStats[natureObj.plus];
			species.baseStats[natureObj.plus] = swap;
			species.tier = 'NS';
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species)}`);
	},
	natureswapshelp: [
		`/ns OR /natureswap <pokemon> - Shows the base stats that a Pokemon would have in Nature Swap. Usage: /ns <Nature> <Pokemon>.`,
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
			mixedSpecies.baseStats[statName] += crossSpecies.baseStats[statName] - prevo.baseStats[statName];
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
		for (const stat in mixedSpecies.baseStats) {
			if (mixedSpecies.baseStats[stat] < 1 || mixedSpecies.baseStats[stat] > 255) {
				this.errorReply(`Warning: This Cross Evolution cannot happen since a stat goes below 0 or above 255.`);
				break;
			}
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
