/**
 * Other Metagames chat plugin
 * Lets users see elements of Pokemon in various Other Metagames.
 * Originally by Spandan.
 * @author dhelmise
*/

import { Utils } from '../../lib';

interface StoneDeltas {
	baseStats: { [stat in StatID]: number };
	bst: number;
	weighthg: number;
	heightm: number;
	type?: string;
	primaryTypeChange?: boolean;
}

type TierShiftTiers = 'UU' | 'RUBL' | 'RU' | 'NUBL' | 'NU' | 'PUBL' | 'PU' | 'ZUBL' | 'ZU' | 'NFE' | 'LC';

function getMegaStone(stone: string, mod = 'gen9'): Item | null {
	let dex = Dex;
	if (mod && toID(mod) in Dex.dexes) dex = Dex.mod(toID(mod));
	const item = dex.items.get(stone);
	if (!item.exists) {
		if (toID(stone) === 'dragonascent') {
			const move = dex.moves.get(stone);
			return {
				id: move.id,
				name: move.name,
				fullname: move.name,
				megaStone: { 'Rayquaza': 'Rayquaza-Mega' },
				exists: true,
				// Adding extra values to appease typescript
				gen: 6,
				num: -1,
				effectType: 'Item',
				sourceEffect: '',
				isBerry: false,
				ignoreKlutz: false,
				isGem: false,
				isPokeball: false,
				isPrimalOrb: false,
				shortDesc: "",
				desc: "",
				isNonstandard: null,
				noCopy: false,
				affectsFainted: false,
			} as Item;
		} else {
			return null;
		}
	}
	if (!(item.forcedForme && !item.zMove) && !item.megaStone &&
		!item.isPrimalOrb && !item.name.startsWith("Rusted")) return null;
	return item;
}

export const commands: Chat.ChatCommands = {
	om: 'othermetas',
	othermetas(target, room, user) {
		target = toID(target);
		const omLink = `- <a href="https://www.smogon.com/forums/forums/733/">Other Metagames Forum</a><br />`;

		if (!target) {
			this.runBroadcast();
			return this.sendReplyBox(omLink);
		}

		if (target === 'all') {
			this.runBroadcast();
			if (this.broadcasting) {
				throw new Chat.ErrorMessage(`"!om all" is too spammy to broadcast.`);
			}
			// Display OMotM formats, with forum thread links as caption
			this.parse(`/formathelp omofthemonth`);

			// Display the rest of OM formats, with OM hub/index forum links as caption
			this.parse(`/formathelp othermetagames`);
			return this.sendReply(`|raw|<center>${omLink}</center>`);
		}

		if (target === 'month') this.target = 'omofthemonth';
		return this.run('formathelp');
	},
	othermetashelp: [
		`/om - Provides a link to the Other Metagames Smogon forum.`,
		`!om - Shows to other users a link to the Other Metagames Smogon forum. Requires: + % @ # ~`,
		`/om all - Provides links to information on all ladderable Other Metagames.`,
		`/om month - Provides links to information on Other Metagames of the month.`,
		`!om month - Shows to other users links to information on Other Metagames of the month. Requires: + % @ # ~`,
	],

	mnm: 'mixandmega',
	mixandmega(target, room, user) {
		if (!toID(target) || !target.includes('@')) return this.parse('/help mixandmega');
		this.runBroadcast();
		let dex = Dex;
		const sep = target.split('@');
		const stoneName = sep.slice(1).join('@').trim().split(',');
		const mod = stoneName[1];
		if (mod) {
			if (toID(mod) in Dex.dexes) {
				dex = Dex.mod(toID(mod));
			} else {
				throw new Chat.ErrorMessage(`A mod by the name of '${mod.trim()}' does not exist.`);
			}
			if (dex === Dex.dexes['gen9ssb']) {
				throw new Chat.ErrorMessage(`The SSB mod supports custom elements for Mega Stones that have the capability of crashing the server.`);
			}
		}
		const stone = getMegaStone(stoneName[0], mod);
		const species = dex.species.get(sep[0]);
		if (!stone) {
			throw new Chat.ErrorMessage(`Error: Mega Stone/Primal Orb/Rusted Item/Origin Item/Mask not found.`);
		}
		if (!species.exists) throw new Chat.ErrorMessage(`Error: Pok\u00e9mon not found.`);
		let baseSpecies: Species;
		let megaSpecies: Species;
		switch (stone.id) {
		case 'blueorb':
			megaSpecies = dex.species.get("Kyogre-Primal");
			baseSpecies = dex.species.get("Kyogre");
			break;
		case 'redorb':
			megaSpecies = dex.species.get("Groudon-Primal");
			baseSpecies = dex.species.get("Groudon");
			break;
		case 'rustedshield':
			megaSpecies = dex.species.get("Zamazenta-Crowned");
			baseSpecies = dex.species.get("Zamazenta");
			break;
		case 'rustedsword':
			megaSpecies = dex.species.get("Zacian-Crowned");
			baseSpecies = dex.species.get("Zacian");
			break;
		default:
			const forcedForme = stone.forcedForme;
			if (forcedForme) {
				megaSpecies = dex.species.get(forcedForme);
				baseSpecies = dex.species.get(forcedForme.split('-')[0]);
			} else {
				megaSpecies = dex.species.get(Object.values(stone.megaStone!)[0]);
				baseSpecies = dex.species.get(Object.keys(stone.megaStone!)[0]);
			}
			break;
		}
		const deltas: StoneDeltas = {
			baseStats: Object.create(null),
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
			heightm: ((megaSpecies.heightm * 10) - (baseSpecies.heightm * 10)) / 10,
			bst: megaSpecies.bst - baseSpecies.bst,
		};
		let statId: StatID;
		for (statId in megaSpecies.baseStats) {
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (['Arceus', 'Silvally'].includes(baseSpecies.name)) {
			deltas.type = megaSpecies.types[0];
		} else if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = dex.gen === 8 ? 'mono' : baseSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types[0] !== baseSpecies.types[0]) {
			deltas.type = megaSpecies.types[0];
			deltas.primaryTypeChange = true;
		}
		const mixedSpecies = Utils.deepClone(species);
		mixedSpecies.abilities = Utils.deepClone(megaSpecies.abilities);
		if (['Arceus', 'Silvally'].includes(baseSpecies.name) || deltas.primaryTypeChange) {
			const secondType = mixedSpecies.types[1];
			mixedSpecies.types = [deltas.type];
			if (secondType && secondType !== deltas.type) mixedSpecies.types.push(secondType);
		} else if (mixedSpecies.types[0] === deltas.type) { // Add any type gains
			mixedSpecies.types = [deltas.type];
		} else if (deltas.type === 'mono') {
			mixedSpecies.types = [mixedSpecies.types[0]];
		} else if (deltas.type) {
			mixedSpecies.types = [mixedSpecies.types[0], deltas.type];
		}
		let statName: StatID;
		mixedSpecies.bst = 0;
		for (statName in species.baseStats) { // Add the changed stats and weight
			mixedSpecies.baseStats[statName] = Utils.clampIntRange(
				mixedSpecies.baseStats[statName] + deltas.baseStats[statName], 1, 255
			);
			mixedSpecies.bst += mixedSpecies.baseStats[statName];
		}
		mixedSpecies.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		mixedSpecies.heightm = Math.max(0.1, ((species.heightm * 10) + (deltas.heightm * 10)) / 10);
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
		const details: { [k: string]: string } = {
			"Dex#": `${mixedSpecies.num}`,
			Gen: `${mixedSpecies.gen}`,
			Height: `${mixedSpecies.heightm} m`,
			Weight: `${mixedSpecies.weighthg / 10} kg <em>(${weighthit} BP)</em>`,
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		this.sendReply(`|raw|<font size="1">` + Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;") + `</font>`);
	},
	mixandmegahelp: [
		`/mnm <pokemon> @ <mega stone or other>[, generation] - Shows the Mix and Mega evolved Pok\u00e9mon's type and stats.`,
	],

	orb: 'stone',
	megastone: 'stone',
	stone(target) {
		const sep = target.split(',');
		let dex = Dex;
		if (sep[1]) {
			if (toID(sep[1]) in Dex.dexes) {
				dex = Dex.mod(toID(sep[1]));
			} else {
				throw new Chat.ErrorMessage(`A mod by the name of '${sep[1].trim()}' does not exist.`);
			}
			if (dex === Dex.dexes['gen9ssb']) {
				throw new Chat.ErrorMessage(`The SSB mod supports custom elements for Mega Stones that have the capability of crashing the server.`);
			}
		}
		const targetid = toID(sep[0]);
		if (!targetid) return this.parse('/help stone');
		this.runBroadcast();
		const stone = getMegaStone(targetid, sep[1]);
		const stones = [];
		if (!stone) {
			const formeIdRegex = new RegExp(
				`(?:mega[xyz]?|primal|origin|crowned|epilogue|cornerstone|wellspring|hearthflame|douse|shock|chill|burn|${dex.types.all().map(x => x.id).filter(x => x !== 'normal').join('|')})$`
			);
			const species = dex.species.get(targetid.replace(formeIdRegex, ''));
			if (!species.exists) throw new Chat.ErrorMessage(`Error: Mega Stone not found.`);
			if (!species.otherFormes) throw new Chat.ErrorMessage(`Error: Mega Evolution not found.`);
			for (const poke of species.otherFormes) {
				const formeRegex = new RegExp(
					`(?:-Douse|-Shock|-Chill|-Burn|-Cornerstone|-Wellspring|-Hearthflame|-Crowned|-Epilogue|-Origin|-Primal|-Mega(?:-[XYZ])?|${dex.types.names().filter(x => x !== 'Normal').map(x => '-' + x).join('|')})$`
				);
				if (!formeRegex.test(poke)) {
					continue;
				}
				const megaPoke = dex.species.get(poke);
				const flag = megaPoke.requiredMove === 'Dragon Ascent' ? megaPoke.requiredMove : megaPoke.requiredItem;
				if (/mega[xyz]$/.test(targetid) && toID(megaPoke.name) !== toID(dex.species.get(targetid))) continue;
				if (!flag) continue;
				stones.push(getMegaStone(flag, sep[1]));
			}
			if (!stones.length) throw new Chat.ErrorMessage(`Error: Mega Evolution not found.`);
		}
		const toDisplay = (stones.length ? stones : [stone]);
		for (const aStone of toDisplay) {
			if (!aStone) return;
			let baseSpecies: Species;
			let megaSpecies: Species;
			switch (aStone.id) {
			case 'blueorb':
				megaSpecies = dex.species.get("Kyogre-Primal");
				baseSpecies = dex.species.get("Kyogre");
				break;
			case 'redorb':
				megaSpecies = dex.species.get("Groudon-Primal");
				baseSpecies = dex.species.get("Groudon");
				break;
			case 'rustedshield':
				megaSpecies = dex.species.get("Zamazenta-Crowned");
				baseSpecies = dex.species.get("Zamazenta");
				break;
			case 'rustedsword':
				megaSpecies = dex.species.get("Zacian-Crowned");
				baseSpecies = dex.species.get("Zacian");
				break;
			default:
				const forcedForme = aStone.forcedForme;
				if (forcedForme) {
					megaSpecies = dex.species.get(forcedForme);
					baseSpecies = dex.species.get(forcedForme.split('-')[0]);
				} else {
					megaSpecies = dex.species.get(Object.values(aStone.megaStone!)[0]);
					baseSpecies = dex.species.get(Object.keys(aStone.megaStone!)[0]);
				}
				break;
			}
			const deltas: StoneDeltas = {
				baseStats: Object.create(null),
				weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
				heightm: ((megaSpecies.heightm * 10) - (baseSpecies.heightm * 10)) / 10,
				bst: megaSpecies.bst - baseSpecies.bst,
			};
			let statId: StatID;
			for (statId in megaSpecies.baseStats) {
				deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
			}
			if (['Arceus', 'Silvally'].includes(baseSpecies.name)) {
				deltas.type = megaSpecies.types[0];
			} else if (megaSpecies.types.length > baseSpecies.types.length) {
				deltas.type = megaSpecies.types[1];
			} else if (megaSpecies.types.length < baseSpecies.types.length) {
				deltas.type = dex.gen === 8 ? 'mono' : megaSpecies.types[0];
			} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
				deltas.type = megaSpecies.types[1];
			} else if (megaSpecies.types[0] !== baseSpecies.types[0]) {
				deltas.type = megaSpecies.types[0];
			}
			const details = {
				Gen: aStone.gen,
				Height: `${deltas.heightm < 0 ? "" : "+"}${deltas.heightm} m`,
				Weight: `${deltas.weighthg < 0 ? "" : "+"}${deltas.weighthg / 10} kg`,
			};
			let tier;
			if (['redorb', 'blueorb'].includes(aStone.id)) {
				tier = "Orb";
			} else if (aStone.name === "Dragon Ascent") {
				tier = "Move";
			} else if (aStone.name.endsWith('Mask')) {
				tier = "Mask";
			} else if (aStone.megaStone) {
				tier = "Stone";
			} else {
				tier = "Item";
			}
			let buf = `<li class="result">`;
			buf += `<span class="col numcol">${tier}</span> `;
			if (aStone.name === "Dragon Ascent") {
				buf += `<span class="col itemiconcol"></span>`;
			} else {
				// temp image support until real images are uploaded
				const itemName = aStone.name;
				buf += `<span class="col itemiconcol"><psicon item="${toID(itemName)}"/></span> `;
			}
			if (aStone.name === "Dragon Ascent") {
				buf += `<span class="col movenamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/moves/${targetid}" target="_blank">Dragon Ascent</a></span> `;
			} else {
				buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/items/${aStone.id}" target="_blank">${aStone.name}</a></span> `;
			}
			if (deltas.type && deltas.type !== 'mono') {
				buf += `<span class="col typecol"><img src="https://${Config.routes.client}/sprites/types/${deltas.type}.png" alt="${deltas.type}" height="14" width="32"></span> `;
			} else {
				buf += `<span class="col typecol"></span>`;
			}
			buf += `<span style="float:left;min-height:26px">`;
			buf += `<span class="col abilitycol">${megaSpecies.abilities['0']}</span>`;
			buf += `<span class="col abilitycol">${megaSpecies.abilities['H'] ? `<em>${megaSpecies.abilities['H']}</em>` : ''}</span>`;
			buf += `</span>`;
			buf += `<span style="float:left;min-height:26px">`;
			buf += `<span class="col statcol"><em>HP</em><br />0</span> `;
			buf += `<span class="col statcol"><em>Atk</em><br />${deltas.baseStats.atk}</span> `;
			buf += `<span class="col statcol"><em>Def</em><br />${deltas.baseStats.def}</span> `;
			buf += `<span class="col statcol"><em>SpA</em><br />${deltas.baseStats.spa}</span> `;
			buf += `<span class="col statcol"><em>SpD</em><br />${deltas.baseStats.spd}</span> `;
			buf += `<span class="col statcol"><em>Spe</em><br />${deltas.baseStats.spe}</span> `;
			buf += `<span class="col bstcol"><em>BST<br />${deltas.bst}</em></span> `;
			buf += `</span>`;
			buf += `</li>`;
			this.sendReply(`|raw|<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`);
			this.sendReply(`|raw|<font size="1">${Object.entries(details).map(([detail, value]) => `<font color="#686868">${detail}:</font> ${value}`).join("&nbsp;|&ThickSpace;")}</font>`);
		}
	},
	stonehelp: [`/stone <mega stone or other>[, generation] - Shows the changes that a mega stone/orb applies to a Pok\u00e9mon.`],

	350: '350cup',
	'350cup'(target, room, user) {
		const args = target.split(',');
		if (!toID(args[0])) return this.parse('/help 350cup');
		this.runBroadcast();
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.formats.get(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const species = Utils.deepClone(dex.species.get(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		const bst = species.bst;
		species.bst = 0;
		for (const i in species.baseStats) {
			if (dex.gen === 1 && i === 'spd') continue;
			species.baseStats[i] *= (bst <= 350 ? 2 : 1);
			species.bst += species.baseStats[i];
		}
		this.sendReply(`|html|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	'350cuphelp': [
		`/350 OR /350cup <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in 350 Cup.`,
	],

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
		const args = target.split(',');
		if (!toID(args[0])) return this.parse('/help tiershift');
		this.runBroadcast();
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[1]) args[1] = `gen${targetGen}`;
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.formats.get(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const species = Utils.deepClone(dex.species.get(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		const boosts: { [tier in TierShiftTiers]: number } = {
			UU: 15,
			RUBL: 15,
			RU: 20,
			NUBL: 20,
			NU: 25,
			PUBL: 25,
			PU: 30,
			ZUBL: 30,
			ZU: 30,
			NFE: 30,
			LC: 30,
		};
		if (dex.gen < 9) {
			boosts['UU'] = boosts['RUBL'] = 10;
			boosts['RU'] = boosts['NUBL'] = 20;
			boosts['NU'] = boosts['PUBL'] = 30;
			boosts['PU'] = boosts['NFE'] = boosts['LC'] = 40;
		}
		let tier = species.tier;
		if (tier[0] === '(') tier = tier.slice(1, -1);
		if (!(tier in boosts)) return this.sendReply(`|html|${Chat.getDataPokemonHTML(species, dex.gen)}`);
		const boost = boosts[tier as TierShiftTiers];
		species.bst = species.baseStats.hp;
		for (const statName in species.baseStats) {
			if (statName === 'hp') continue;
			if (dex.gen === 1 && statName === 'spd') continue;
			species.baseStats[statName] = Utils.clampIntRange(species.baseStats[statName] + boost, 1, 255);
			species.bst += species.baseStats[statName];
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	tiershifthelp: [
		`/ts OR /tiershift <pokemon>[, generation] - Shows the base stats that a Pok\u00e9mon would have in Tier Shift.`,
		`Alternatively, you can use /ts[gen number] to see a Pok\u00e9mon's stats in that generation.`,
	],

	fuse: 'franticfusions',
	fuse1: 'franticfusions',
	fuse2: 'franticfusions',
	fuse3: 'franticfusions',
	fuse4: 'franticfusions',
	fuse5: 'franticfusions',
	fuse6: 'franticfusions',
	fuse7: 'franticfusions',
	fuse8: 'franticfusions',
	franticfusions(target, room, user, connection, cmd) {
		const args = target.split(',');
		if (!toID(args[0]) && !toID(args[1])) return this.parse('/help franticfusions');
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[2]) target = `${target},gen${targetGen}`;
		const { dex, targets } = this.splitFormat(target, true);
		this.runBroadcast();
		if (targets.length > 2) return this.parse('/help franticfusions');
		const species = Utils.deepClone(dex.species.get(targets[0]));
		const fusion = dex.species.get(targets[1]);
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		if (fusion.name.length) {
			if (!fusion.exists || fusion.gen > dex.gen) {
				const monName = fusion.gen > dex.gen ? fusion.name : args[1].trim();
				const additionalReason = fusion.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
				throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
			}
			if (fusion.name === species.name) {
				throw new Chat.ErrorMessage('Pok\u00e9mon can\'t fuse with themselves.');
			}
		}
		if (fusion.name.length) {
			species.bst = species.baseStats.hp;
		} else {
			species.bst = 0;
		}
		for (const statName in species.baseStats) {
			if (statName === 'hp') continue;
			if (!fusion.name.length) {
				species.baseStats[statName] = Math.floor(species.baseStats[statName as StatID] / 4);
				species.bst += species.baseStats[statName];
			} else {
				const addition = Math.floor(fusion.baseStats[statName as StatID] / 4);
				species.baseStats[statName] = Utils.clampIntRange(species.baseStats[statName] + addition, 1, 255);
				species.bst += species.baseStats[statName];
			}
		}
		const abilities = new Set<string>([...Object.values(species.abilities), ...Object.values(fusion.abilities)]);
		let buf = '<div class="message"><ul class="utilichart"><li class="result">';
		buf += '<span class="col numcol">Fusion</span> ';
		buf += `<span class="col iconcol"><psicon pokemon="${species.id}"/></span> `;
		buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://${Config.routes.dex}/pokemon/${species.id}" target="_blank">${species.name}</a></span> `;
		buf += '<span class="col typecol">';
		if (species.types && fusion.name.length) {
			for (const type of species.types) {
				buf += `<img src="https://${Config.routes.client}/sprites/types/${type}.png" alt="${type}" height="14" width="32">`;
			}
		}
		buf += '</span> ';
		if (dex.gen >= 3) {
			buf += '<span style="float:left;min-height:26px">';
			const ability1 = [...abilities.values()][0];
			abilities.delete(ability1);
			let ability2;
			if (abilities.size) {
				ability2 = [...abilities.values()][0];
				abilities.delete(ability2);
			}
			let ability3;
			if (abilities.size) {
				ability3 = [...abilities.values()][0];
				abilities.delete(ability3);
			}
			let ability4;
			if (abilities.size) {
				ability4 = [...abilities.values()][0];
				abilities.delete(ability4);
			}
			let ability5;
			if (abilities.size) {
				ability5 = [...abilities.values()][0];
				abilities.delete(ability5);
			}
			let ability6;
			if (abilities.size) {
				ability6 = [...abilities.values()][0];
				abilities.delete(ability6);
			}
			let ability7;
			if (abilities.size) {
				ability7 = [...abilities.values()][0];
				abilities.delete(ability7);
			}
			if (ability1) {
				if (ability2) {
					buf += '<span class="col twoabilitycol">' + ability1 + '<br />' + ability2 + '</span>';
				} else {
					buf += '<span class="col abilitycol">' + ability1 + '</span>';
				}
			}
			if (ability3) {
				if (ability4) {
					buf += '<span class="col twoabilitycol">' + ability3 + '<br />' + ability4 + '</span>';
				} else {
					buf += '<span class="col abilitycol">' + ability3 + '</span>';
				}
			}
			if (ability5) {
				if (ability6) {
					buf += '<span class="col twoabilitycol">' + ability5 + '<br />' + ability6 + '</span>';
				} else {
					buf += '<span class="col abilitycol">' + ability5 + '</span>';
				}
			}
			if (ability7) {
				buf += '<span class="col abilitycol">' + ability7 + '</span>';
			}
			buf += '</span>';
		}
		buf += '<span style="float:left;min-height:26px">';
		if (fusion.name.length) {
			buf += '<span class="col statcol"><em>HP</em><br />' + species.baseStats.hp + '</span> ';
		} else {
			buf += '<span class="col statcol"><em>HP</em><br />0</span> ';
		}
		buf += '<span class="col statcol"><em>Atk</em><br />' + species.baseStats.atk + '</span> ';
		buf += '<span class="col statcol"><em>Def</em><br />' + species.baseStats.def + '</span> ';
		if (dex.gen <= 1) {
			buf += '<span class="col statcol"><em>Spc</em><br />' + species.baseStats.spa + '</span> ';
		} else {
			buf += '<span class="col statcol"><em>SpA</em><br />' + species.baseStats.spa + '</span> ';
			buf += '<span class="col statcol"><em>SpD</em><br />' + species.baseStats.spd + '</span> ';
		}
		buf += '<span class="col statcol"><em>Spe</em><br />' + species.baseStats.spe + '</span> ';
		buf += '<span class="col bstcol"><em>BST<br />' + species.bst + '</em></span> ';
		buf += '</span>';
		buf += '</li><li style="clear:both"></li></ul></div>';
		this.sendReply(`|raw|${buf}`);
	},
	franticfusionshelp: [
		`/fuse <pokemon>, <fusion>[, generation] - Shows the stats and abilities that <pokemon> would get when fused with <fusion>.`,
		`/fuse <pokemon>[, generation] - Shows the stats and abilities that <pokemon> donates.`,
		`Alternatively, you can use /fuse[gen number] to see a Pok\u00e9mon's stats in that generation.`,
	],

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
		const args = target.split(',');
		if (!args.length || !toID(args[0])) return this.parse(`/help scalemons`);
		this.runBroadcast();
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[1]) args[1] = `gen${targetGen}`;
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.formats.get(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const species = Utils.deepClone(dex.species.get(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		const bstNoHP = species.bst - species.baseStats.hp;
		const scale = (dex.gen !== 1 ? 600 : 500) - species.baseStats['hp'];
		species.bst = 0;
		for (const stat in species.baseStats) {
			if (stat === 'hp') continue;
			if (dex.gen === 1 && stat === 'spd') continue;
			species.baseStats[stat] = Utils.clampIntRange(species.baseStats[stat] * scale / bstNoHP, 1, 255);
			species.bst += species.baseStats[stat];
		}
		species.bst += species.baseStats.hp;
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	scalemonshelp: [
		`/scale OR /scalemons <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in Scalemons.`,
		`Alternatively, you can use /scale[gen number] to see a Pok\u00e9mon's scaled stats in that generation.`,
	],

	flip: 'flipped',
	flip1: 'flipped',
	flip2: 'flipped',
	flip3: 'flipped',
	flip4: 'flipped',
	flip5: 'flipped',
	flip6: 'flipped',
	flip7: 'flipped',
	flip8: 'flipped',
	flipped(target, room, user, connection, cmd) {
		const args = target.split(',');
		if (!args[0]) return this.parse(`/help flipped`);
		this.runBroadcast();
		const mon = args[0];
		let mod = args[1];
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !mod) mod = `gen${targetGen}`;
		let dex = Dex;
		if (mod && toID(mod) in Dex.dexes) {
			dex = Dex.dexes[toID(mod)];
		} else if (room?.battle) {
			dex = Dex.forFormat(room.battle.format);
		}
		const species = Utils.deepClone(dex.species.get(mon));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : mon.trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		if (dex.gen === 1) {
			const flippedStats: { [k: string]: number } = {
				hp: species.baseStats.spe,
				atk: species.baseStats.spa,
				def: species.baseStats.def,
				spa: species.baseStats.atk,
				spd: species.baseStats.atk,
				spe: species.baseStats.hp,
			};
			for (const stat in species.baseStats) {
				species.baseStats[stat] = flippedStats[stat];
			}
			this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
			return;
		}
		const stats = Object.values(species.baseStats).reverse();
		for (const [i, statName] of Object.keys(species.baseStats).entries()) {
			species.baseStats[statName] = stats[i];
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen)}`);
	},
	flippedhelp: [
		`/flip OR /flipped <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in Flipped.`,
		`Alternatively, you can use /flip[gen number] to see a Pok\u00e9mon's stats in that generation.`,
	],

	ns: 'natureswap',
	ns3: 'natureswap',
	ns4: 'natureswap',
	ns5: 'natureswap',
	ns6: 'natureswap',
	ns7: 'natureswap',
	ns8: 'natureswap',
	natureswap(target, room, user, connection, cmd) {
		const args = target.split(',');
		const nature = args[0];
		const pokemon = args[1];
		const targetGen = parseInt(cmd[cmd.length - 1]);
		if (targetGen && !args[2]) args[2] = `gen${targetGen}`;
		let dex = Dex;
		if (args[2] && toID(args[2]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[2])];
		} else if (room?.battle) {
			const format = Dex.formats.get(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		if (!toID(nature) || !toID(pokemon)) return this.parse(`/help natureswap`);
		this.runBroadcast();
		const natureObj = dex.natures.get(nature);
		if (dex.gen < 3) throw new Chat.ErrorMessage(`Error: Natures don't exist prior to Generation 3.`);
		if (!natureObj.exists) throw new Chat.ErrorMessage(`Error: Nature ${nature} not found.`);
		const species = Utils.deepClone(dex.species.get(pokemon));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
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
		`/ns OR /natureswap <nature>, <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in Nature Swap.`,
		`Alternatively, you can use /ns[gen number] to see a Pok\u00e9mon's stats in that generation.`,
	],

	ce: 'crossevolve',
	crossevo: 'crossevolve',
	crossevolve(target, user, room) {
		if (!this.runBroadcast()) return;
		if (!target?.includes(',')) return this.parse(`/help crossevo`);

		const pokes = target.split(',');
		const species = Dex.species.get(pokes[0]);
		const crossSpecies = Dex.species.get(pokes[1]);

		if (!species.exists) throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${pokes[0]}' not found.`);
		if (!crossSpecies.exists) throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${pokes[1]}' not found.`);

		if (!species.evos.length) throw new Chat.ErrorMessage(`Error: ${species.name} does not evolve.`);
		if (!crossSpecies.prevo) throw new Chat.ErrorMessage(`Error: ${crossSpecies.name} does not have a prevolution.`);

		let setStage = 1;
		let crossStage = 1;
		if (species.prevo) {
			setStage++;
			if (Dex.species.get(species.prevo).prevo) {
				setStage++;
			}
		}
		const prevo = Dex.species.get(crossSpecies.prevo);
		if (crossSpecies.prevo) {
			crossStage++;
			if (prevo.prevo) {
				crossStage++;
			}
		}
		if (setStage + 1 !== crossStage) {
			throw new Chat.ErrorMessage(`Error: Cross evolution must follow evolutionary stages. (${species.name} is Stage ${setStage} and can only cross evolve to Stage ${setStage + 1})`);
		}
		const mixedSpecies = Utils.deepClone(species);
		mixedSpecies.abilities = Utils.deepClone(crossSpecies.abilities);
		mixedSpecies.baseStats = Utils.deepClone(mixedSpecies.baseStats);
		mixedSpecies.bst = 0;
		let statName: StatID;
		for (statName in species.baseStats) {
			const statChange = crossSpecies.baseStats[statName] - prevo.baseStats[statName];
			mixedSpecies.baseStats[statName] = Utils.clampIntRange(mixedSpecies.baseStats[statName] + statChange, 1, 255);
			mixedSpecies.bst += mixedSpecies.baseStats[statName];
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
		const details: { [k: string]: string } = {
			"Dex#": mixedSpecies.num,
			Gen: mixedSpecies.gen,
			Height: `${mixedSpecies.heightm} m`,
			Weight: `${mixedSpecies.weighthg / 10} kg <em>(${weighthit} BP)</em>`,
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		this.sendReply(`|raw|<font size="1">` + Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;") + `</font>`);
	},
	crossevolvehelp: [
		"/crossevo <base pokemon>, <evolved pokemon> - Shows the type and stats for the Cross Evolved Pok\u00e9mon.",
	],

	reevo: 'showevo',
	showevo(target, room, user, connection, cmd) {
		const args = target.split(',');
		if (!toID(args[0])) return this.parse('/help reevohelp');
		this.runBroadcast();
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.formats.get(room.battle.format);
			dex = Dex.mod(format.mod);
		}

		const targetid = toID(args[0]);
		const isReEvo = cmd === 'reevo';
		if (!targetid) return this.parse(`/help ${isReEvo ? 're' : 'show'}evo`);
		const evo = dex.species.get(targetid);
		if (!evo.exists) {
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon ${targetid} not found.`);
		}
		if (!evo.prevo) {
			const evoBaseSpecies = dex.species.get(
				(Array.isArray(evo.battleOnly) ? evo.battleOnly[0] : evo.battleOnly) || evo.changesFrom || evo.name
			);
			if (!evoBaseSpecies.prevo) throw new Chat.ErrorMessage(`Error: ${evoBaseSpecies.name} is not an evolution.`);
			const prevoSpecies = dex.species.get(evoBaseSpecies.prevo);
			const deltas = Utils.deepClone(evo);
			if (!isReEvo) {
				deltas.tier = 'CE';
				deltas.weightkg = evo.weightkg - prevoSpecies.weightkg;
				deltas.types = [];
				if (evo.types[0] !== prevoSpecies.types[0]) deltas.types[0] = evo.types[0];
				if (evo.types[1] !== prevoSpecies.types[1]) {
					deltas.types[1] = evo.types[1] || evo.types[0];
				}
				if (deltas.types.length) {
					// Undefined type remover
					deltas.types = deltas.types.filter((type: string | undefined) => type !== undefined);

					if (deltas.types[0] === deltas.types[1]) deltas.types = [deltas.types[0]];
				} else {
					deltas.types = null;
				}
			}
			deltas.bst = 0;
			let i: StatID;
			for (i in evo.baseStats) {
				const statChange = evoBaseSpecies.baseStats[i] - prevoSpecies.baseStats[i];
				const formeChange = evo.baseStats[i] - evoBaseSpecies.baseStats[i];
				if (!isReEvo) {
					if (!evo.prevo) {
						deltas.baseStats[i] = formeChange;
					} else {
						deltas.baseStats[i] = statChange;
					}
				} else {
					deltas.baseStats[i] = Utils.clampIntRange(evoBaseSpecies.baseStats[i] + statChange, 1, 255);
					deltas.baseStats[i] = Utils.clampIntRange(deltas.baseStats[i] + formeChange, 1, 255);
				}
				deltas.bst += deltas.baseStats[i];
			}
			const details = {
				Gen: evo.gen,
				Weight: `${deltas.weighthg < 0 ? "" : "+"}${deltas.weighthg / 10} kg`,
				Stage: (dex.species.get(prevoSpecies.prevo).exists ? 3 : 2),
			};
			this.sendReply(`|raw|${Chat.getDataPokemonHTML(deltas)}`);
			if (!isReEvo) {
				this.sendReply(`|raw|<font size="1"><font color="#686868">Gen:</font> ${details["Gen"]}&nbsp;|&ThickSpace;<font color="#686868">Weight:</font> ${details["Weight"]}&nbsp;|&ThickSpace;<font color="#686868">Stage:</font> ${details["Stage"]}</font>`);
			}
		} else {
			const prevoSpecies = dex.species.get(evo.prevo);
			const deltas = Utils.deepClone(evo);
			if (!isReEvo) {
				deltas.tier = 'CE';
				deltas.weightkg = evo.weightkg - prevoSpecies.weightkg;
				deltas.types = [];
				if (evo.types[0] !== prevoSpecies.types[0]) deltas.types[0] = evo.types[0];
				if (evo.types[1] !== prevoSpecies.types[1]) {
					deltas.types[1] = evo.types[1] || evo.types[0];
				}
				if (deltas.types.length) {
					// Undefined type remover
					deltas.types = deltas.types.filter((type: string | undefined) => type !== undefined);

					if (deltas.types[0] === deltas.types[1]) deltas.types = [deltas.types[0]];
				} else {
					deltas.types = null;
				}
			}
			deltas.bst = 0;
			let i: StatID;
			for (i in evo.baseStats) {
				const statChange = evo.baseStats[i] - prevoSpecies.baseStats[i];
				if (!isReEvo) {
					deltas.baseStats[i] = statChange;
				} else {
					deltas.baseStats[i] = Utils.clampIntRange(deltas.baseStats[i] + statChange, 1, 255);
				}
				deltas.bst += deltas.baseStats[i];
			}
			const details = {
				Gen: evo.gen,
				Weight: `${deltas.weighthg < 0 ? "" : "+"}${deltas.weighthg / 10} kg`,
				Stage: (dex.species.get(prevoSpecies.prevo).exists ? 3 : 2),
			};
			this.sendReply(`|raw|${Chat.getDataPokemonHTML(deltas)}`);
			if (!isReEvo) {
				this.sendReply(`|raw|<font size="1"><font color="#686868">Gen:</font> ${details["Gen"]}&nbsp;|&ThickSpace;<font color="#686868">Weight:</font> ${details["Weight"]}&nbsp;|&ThickSpace;<font color="#686868">Stage:</font> ${details["Stage"]}</font>`);
			}
		}
	},
	reevohelp: [
		`/reevo <Pok\u00e9mon> - Shows the stats that a Pok\u00e9mon would have in Re-Evolution`,
	],
	showevohelp: [
		`/showevo <Pok\u00e9mon> - Shows the changes that a Pok\u00e9mon applies in Cross Evolution`,
	],

	pokemove(target, room, user) {
		if (!this.runBroadcast()) return;
		const species = Dex.species.get(target);
		if (!species.exists) return this.parse('/help pokemove');
		const move = Utils.deepClone(Dex.moves.get('tackle'));
		move.name = species.name;
		move.type = species.types[0];
		move.flags = { protect: 1 };
		move.basePower = Math.max(species.baseStats['atk'], species.baseStats['spa']);
		move.pp = 5;
		move.gen = species.gen;
		move.num = species.num;
		move.desc = move.shortDesc = `Gives ${species.abilities['0']} as a second ability after use.`;
		move.category = species.baseStats['spa'] >= species.baseStats['atk'] ? 'Special' : 'Physical';
		this.sendReply(`|raw|${Chat.getDataMoveHTML(move)}`);
	},
	pokemovehelp: [
		`/pokemove <Pok\u00e9mon> - Shows the Pokemove data for <Pok\u00e9mon>.`,
	],

	bnb: 'badnboosted',
	badnboosted(target, room, user) {
		const args = target.split(',');
		if (!toID(args[0])) return this.parse('/help badnboostedhelp');
		this.runBroadcast();
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.formats.get(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const species = Utils.deepClone(dex.species.get(args[0]));
		if (!species.exists || species.gen > dex.gen) {
			const monName = species.gen > dex.gen ? species.name : args[0].trim();
			const additionalReason = species.gen > dex.gen ? ` in Generation ${dex.gen}` : ``;
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${monName}' not found${additionalReason}.`);
		}
		species.bst = 0;
		for (const i in species.baseStats) {
			if (dex.gen === 1 && i === 'spd') continue;
			species.baseStats[i] *= (species.baseStats[i] <= 70 ? 2 : 1);
			species.bst += species.baseStats[i];
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(species, dex.gen, 'BnB')}`);
	},
	'badnboostedhelphelp': [
		`/bnb OR /badnboosted <pokemon>[, gen] - Shows the base stats that a Pok\u00e9mon would have in Bad 'n Boosted.`,
	],
};
