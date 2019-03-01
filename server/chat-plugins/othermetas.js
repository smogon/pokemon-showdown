// Other Metas plugin by Spandan
'use strict';

/**
 * @param {string} stone
 * @return {Object}
 */
function getMegaStone(stone) {
	let item = Dex.getItem(stone);
	if (!item.exists) {
		if (toId(stone) === 'dragonascent') {
			let move = Dex.getMove(stone);
			return {
				id: move.id,
				name: move.name,
				megaEvolves: 'Rayquaza',
				megaStone: 'Rayquaza-Mega',
				exists: true,
			};
		} else {
			return {exists: false};
		}
	}
	if (!item.megaStone && !item.onPrimal) return {exists: false};
	return item;
}

/** @type {ChatCommands} */
const commands = {
	'!othermetas': true,
	om: 'othermetas',
	othermetas(target, room, user) {
		if (!this.runBroadcast()) return;
		target = toId(target);
		let buffer = ``;

		if (target === 'all' && this.broadcasting) {
			return this.sendReplyBox(`You cannot broadcast information about all Other Metagames at once.`);
		}

		if (!target || target === 'all') {
			buffer += `- <a href="https://www.smogon.com/forums/forums/394/">Other Metagames Forum</a><br />`;
			if (!target) return this.sendReplyBox(buffer);
		}
		let showMonthly = (target === 'all' || target === 'omofthemonth' || target === 'omotm' || target === 'month');

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
		if (!toId(target) || !target.includes('@')) return this.parse('/help mixandmega');
		let sep = target.split('@');
		let stone = getMegaStone(sep[1]);
		let template = Dex.getTemplate(sep[0]);
		if (!stone.exists) return this.errorReply(`Error: Mega Stone not found.`);
		if (!template.exists) return this.errorReply(`Error: Pokemon not found.`);
		if (template.isMega || template.name === 'Necrozma-Ultra') { // Mega Pokemon and Ultra Necrozma cannot be mega evolved
			this.errorReply(`Warning: You cannot mega evolve Mega Pokemon and Ultra Necrozma in Mix and Mega.`);
		}
		let banlist = Dex.getFormat('gen7mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			this.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		let restrictedStones = Dex.getFormat('gen7mixandmega').restrictedStones || [];
		if (restrictedStones.includes(stone.name) && template.name !== stone.megaEvolves) {
			this.errorReply(`Warning: ${stone.name} is restricted to ${stone.megaEvolves} in Mix and Mega.`);
		}
		let cannotMega = Dex.getFormat('gen7mixandmega').cannotMega || [];
		if (cannotMega.includes(template.name) && template.name !== stone.megaEvolves && !template.isMega) { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			this.errorReply(`Warning: ${template.name} is banned from mega evolving with a non-native mega stone in Mix and Mega.`);
		}
		if (['Multitype', 'RKS System'].includes(template.abilities['0']) && !['Arceus', 'Silvally'].includes(template.name)) {
			this.errorReply(`Warning: ${template.name} is required to hold ${template.baseSpecies === 'Arceus' && template.requiredItems ? 'either ' + template.requiredItems[0] + ' or ' + template.requiredItems[1] : template.requiredItem}.`);
		}
		if (stone.isUnreleased) {
			this.errorReply(`Warning: ${stone.name} is unreleased and is not usable in current Mix and Mega.`);
		}
		if (toId(sep[1]) === 'dragonascent' && !['smeargle', 'rayquaza', 'rayquazamega'].includes(toId(sep[0]))) {
			this.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits.`);
		}
		// Fake Pokemon and Mega Stones
		if (template.isNonstandard) {
			this.errorReply(`Warning: ${template.name} is not a real Pokemon and is therefore not usable in Mix and Mega.`);
		}
		if (stone.isNonstandard) {
			this.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseTemplate = Dex.getTemplate(stone.megaEvolves);
		let megaTemplate = Dex.getTemplate(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaTemplate = Dex.getTemplate("Groudon-Primal");
			baseTemplate = Dex.getTemplate("Groudon");
		} else if (stone.id === 'blueorb') {
			megaTemplate = Dex.getTemplate("Kyogre-Primal");
			baseTemplate = Dex.getTemplate("Kyogre");
		}
		/** @type {{baseStats: {[k: string]: number}, weightkg: number, type?: string}} */
		let deltas = {
			baseStats: {},
			weightkg: megaTemplate.weightkg - baseTemplate.weightkg,
		};
		for (let statId in megaTemplate.baseStats) {
			// @ts-ignore
			deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		}
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.type = megaTemplate.types[1];
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.type = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.type = megaTemplate.types[1];
		}
		//////////////////////////////////////////
		let mixedTemplate = Dex.deepClone(template);
		mixedTemplate.abilities = Object.assign({}, megaTemplate.abilities);
		if (mixedTemplate.types[0] === deltas.type) { // Add any type gains
			mixedTemplate.types = [deltas.type];
		} else if (deltas.type) {
			mixedTemplate.types = [mixedTemplate.types[0], deltas.type];
		}
		for (let statName in template.baseStats) { // Add the changed stats and weight
			mixedTemplate.baseStats[statName] = Dex.clampIntRange(mixedTemplate.baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		mixedTemplate.weightkg = Math.round(Math.max(0.1, template.weightkg + deltas.weightkg) * 100) / 100;
		mixedTemplate.tier = "MnM";
		let weighthit = 20;
		if (mixedTemplate.weightkg >= 200) {
			weighthit = 120;
		} else if (mixedTemplate.weightkg >= 100) {
			weighthit = 100;
		} else if (mixedTemplate.weightkg >= 50) {
			weighthit = 80;
		} else if (mixedTemplate.weightkg >= 25) {
			weighthit = 60;
		} else if (mixedTemplate.weightkg >= 10) {
			weighthit = 40;
		}
		/** @type {{[k: string]: string}} */
		let details = {
			"Dex#": '' + mixedTemplate.num,
			"Gen": '' + mixedTemplate.gen,
			"Height": mixedTemplate.heightm + " m",
			"Weight": mixedTemplate.weightkg + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedTemplate.color,
		};
		if (mixedTemplate.eggGroups) details["Egg Group(s)"] = mixedTemplate.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedTemplate)}`);
		this.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	},
	mixandmegahelp: [`/mnm <pokemon> @ <mega stone> - Shows the Mix and Mega evolved Pokemon's type and stats.`],

	'!stone': true,
	orb: 'stone',
	megastone: 'stone',
	stone(target) {
		if (!this.runBroadcast()) return;
		let targetid = toId(target);
		if (!targetid) return this.parse('/help stone');
		let stone = getMegaStone(targetid);
		if (!stone.exists) return this.errorReply(`Error: Mega Stone not found.`);
		let banlist = Dex.getFormat('gen7mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			this.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		let restrictedStones = Dex.getFormat('gen7mixandmega').restrictedStones || [];
		if (restrictedStones.includes(stone.name)) {
			this.errorReply(`Warning: ${stone.name} is restricted to ${stone.megaEvolves} in Mix and Mega.`);
		}
		if (stone.isUnreleased) {
			this.errorReply(`Warning: ${stone.name} is unreleased and is not usable in current Mix and Mega.`);
		}
		if (targetid === 'dragonascent') {
			this.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits.`);
		}
		// Fake Mega Stones
		if (stone.isNonstandard) {
			this.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseTemplate = Dex.getTemplate(stone.megaEvolves);
		let megaTemplate = Dex.getTemplate(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			baseTemplate = Dex.getTemplate("Groudon");
			megaTemplate = Dex.getTemplate("Groudon-Primal");
		} else if (stone.id === 'blueorb') {
			baseTemplate = Dex.getTemplate("Kyogre");
			megaTemplate = Dex.getTemplate("Kyogre-Primal");
		}
		/** @type {{baseStats: {[k: string]: number}, weightkg: number, type?: string}} */
		let deltas = {
			baseStats: {},
			weightkg: megaTemplate.weightkg - baseTemplate.weightkg,
		};
		for (let statId in megaTemplate.baseStats) {
			// @ts-ignore
			deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		}
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.type = megaTemplate.types[1];
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.type = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.type = megaTemplate.types[1];
		}
		let details = {
			"Gen": 6,
			"Weight": (JSON.stringify(deltas.weightkg).startsWith("-") ? "" : "+") + Math.round(deltas.weightkg * 100) / 100 + " kg",
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
			buf += `<span class="col movenamecol" style="white-space:nowrap"><a href="https://pokemonshowdown.com/dex/moves/${targetid}" target="_blank">Dragon Ascent</a></span> `;
		} else {
			buf += `<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://pokemonshowdown.com/dex/items/${stone.id}" target="_blank">${stone.name}</a></span> `;
		}
		if (deltas.type) {
			buf += `<span class="col typecol"><img src="https://play.pokemonshowdown.com/sprites/types/${deltas.type}.png" alt="${deltas.type}" height="14" width="32"></span> `;
		} else {
			buf += `<span class="col typecol"></span>`;
		}
		buf += `<span style="float:left;min-height:26px">`;
		buf += `<span class="col abilitycol">${megaTemplate.abilities['0']}</span>`;
		buf += `<span class="col abilitycol"></span>`;
		buf += `</span>`;
		buf += `<span style="float:left;min-height:26px">`;
		buf += `<span class="col statcol"><em>HP</em><br />0</span> `;
		buf += `<span class="col statcol"><em>Atk</em><br />${deltas.baseStats.atk}</span> `;
		buf += `<span class="col statcol"><em>Def</em><br />${deltas.baseStats.def}</span> `;
		buf += `<span class="col statcol"><em>SpA</em><br />${deltas.baseStats.spa}</span> `;
		buf += `<span class="col statcol"><em>SpD</em><br />${deltas.baseStats.spd}</span> `;
		buf += `<span class="col statcol"><em>Spe</em><br />${deltas.baseStats.spe}</span> `;
		buf += `<span class="col bstcol"><em>BST<br />100</em></span> `;
		buf += `</span>`;
		buf += `</li>`;
		this.sendReply(`|raw|<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`);
		this.sendReply(`|raw|<font size="1"><font color="#686868">Gen:</font> ${details["Gen"]}&nbsp;|&ThickSpace;<font color="#686868">Weight:</font> ${details["Weight"]}</font>`);
	},
	stonehelp: [`/stone <mega stone> - Shows the changes that a mega stone/orb applies to a Pokemon.`],

	'!350cup': true,
	'350': '350cup',
	'350cup'(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.parse('/help 350cup');
		let template = Dex.deepClone(Dex.getTemplate(target));
		if (!template.exists) return this.errorReply("Error: Pokemon not found.");
		let bst = 0;
		for (let i in template.baseStats) {
			bst += template.baseStats[i];
		}
		for (let i in template.baseStats) {
			template.baseStats[i] = template.baseStats[i] * (bst <= 350 ? 2 : 1);
		}
		this.sendReply(`|html|${Chat.getDataPokemonHTML(template)}`);
	},
	'350cuphelp': [`/350 OR /350cup <pokemon> - Shows the base stats that a Pokemon would have in 350 Cup.`],

	'!tiershift': true,
	ts: 'tiershift',
	tiershift(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.parse('/help tiershift');
		let template = Dex.deepClone(Dex.getTemplate(target));
		if (!template.exists) return this.errorReply("Error: Pokemon not found.");
		/** @type {{[k: string]: number}} */
		let boosts = {
			'UU': 10,
			'RUBL': 10,
			'RU': 20,
			'NUBL': 20,
			'NU': 30,
			'PUBL': 30,
			'PU': 40,
			'NFE': 40,
			'LC Uber': 40,
			'LC': 40,
		};
		let tier = template.tier;
		if (tier[0] === '(') tier = tier.slice(1, -1);
		if (!(tier in boosts)) return this.sendReply(`|html|${Chat.getDataPokemonHTML(template)}`);
		let boost = boosts[tier];
		for (let statName in template.baseStats) {
			if (statName === 'hp') continue;
			template.baseStats[statName] = Dex.clampIntRange(template.baseStats[statName] + boost, 1, 255);
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(template)}`);
	},
	tiershifthelp: [`/ts OR /tiershift <pokemon> - Shows the base stats that a Pokemon would have in Tier Shift.`],

	'!scalemons': true,
	scale: 'scalemons',
	scalemons(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.parse(`/help scalemons`);
		let template = Dex.deepClone(Dex.getTemplate(target));
		if (!template.exists) return this.errorReply(`Error: Pokemon ${target} not found.`);
		let stats = ['atk', 'def', 'spa', 'spd', 'spe'];
		let pst = stats.map(stat => template.baseStats[stat]).reduce((x, y) => x + y);
		let scale = 600 - template.baseStats['hp'];
		for (const stat of stats) {
			template.baseStats[stat] = Dex.clampIntRange(template.baseStats[stat] * scale / pst, 1, 255);
		}
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(template)}`);
	},
	scalemonshelp: [`/scale OR /scalemons <pokemon> - Shows the base stats that a Pokemon would have in Scalemons.`],
};

exports.commands = commands;
