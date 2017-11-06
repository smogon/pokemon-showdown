// Other Metas plugin by Spandan
'use strict';

exports.commands = {
	'!othermetas': true,
	om: 'othermetas',
	othermetas: function (target, room, user) {
		if (!this.runBroadcast()) return;
		target = toId(target);
		let buffer = "";

		if (target === 'all' && this.broadcasting) {
			return this.sendReplyBox("You cannot broadcast information about all Other Metagames at once.");
		}

		if (!target || target === 'all') {
			buffer += "- <a href=\"http://www.smogon.com/forums/forums/394/\">Other Metagames Forum</a><br />";
			buffer += "- <a href=\"http://www.smogon.com/forums/forums/442/\">Other Metagames Analyses</a><br />";
			if (!target) return this.sendReplyBox(buffer);
		}
		let showMonthly = (target === 'all' || target === 'omofthemonth' || target === 'omotm' || target === 'month');

		if (target === 'all') {
			// Display OMotM formats, with forum thread links as caption
			this.parse('/formathelp omofthemonth');

			// Display the rest of OM formats, with OM hub/index forum links as caption
			this.parse('/formathelp othermetagames');
			return this.sendReply('|raw|<center>' + buffer + '</center>');
		}
		if (showMonthly) {
			this.target = 'omofthemonth';
			this.run('formathelp');
		} else {
			this.run('formathelp');
		}
	},
	othermetashelp: ["/om - Provides links to information on the Other Metagames.",
		"!om - Show everyone that information. Requires: + % @ * # & ~"],

	'!mixandmega': true,
	mnm: 'mixandmega',
	mixandmega: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target) || !target.includes('@')) return this.parse('/help mixandmega');
		let sep = target.split('@');
		let stone;
		if (toId(sep[1]) === 'dragonascent') {
			stone = {
				megaStone: "Rayquaza-Mega",
				megaEvolves: "Rayquaza",
			};
		} else {
			stone = Dex.getItem(sep[1]);
		}
		let template = Object.assign({}, Dex.getTemplate(sep[0]));
		if (!stone.megaEvolves && !stone.onPrimal) return this.errorReply(`Error: Mega Stone not found.`);
		if (!template.exists) return this.errorReply(`Error: Pokemon not found.`);
		if (template.isMega || (template.evos && Object.keys(template.evos).length > 0)) { // Mega Pokemon cannot be mega evolved
			this.errorReply(`Warning: You cannot mega evolve non-fully evolved Pokemon and Mega Pokemon in Mix and Mega.`);
		}
		let bannedStones = Dex.getFormat('gen7mixandmega').bannedStones;
		if (bannedStones.includes(stone.name) && template.name !== stone.megaEvolves) {
			this.errorReply(`Warning: ${stone.name} is restricted to ${stone.megaEvolves} in Mix and Mega; therefore, ${template.name} cannot use ${stone.name} in actual play.`);
		}
		let cannotMega = Dex.getFormat('gen7mixandmega').cannotMega;
		if (cannotMega.includes(template.name) && !template.isMega) { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			this.errorReply(`Warning: ${template.name} is banned from mega evolving with a non-native mega stone in Mix and Mega and therefore cannot use ${toId(sep[1]) === 'dragonascent' ? 'Dragon Ascent' : stone.name} in actual play.`);
		}
		if (stone.isUnreleased) {
			this.errorReply(`Warning: ${stone.name} is unreleased and is not usable in current Mix and Mega.`);
		}
		let dragonAscentUsers = {'smeargle':1, 'rayquaza':1, 'rayquazamega':1};
		if (toId(sep[1]) === 'dragonascent' && !(toId(sep[0]) in dragonAscentUsers)) {
			this.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits; therefore, ${template.name} cannot mega evolve with Dragon Ascent.`);
		}
		// Fake Pokemon and Mega Stones
		if (template.isNonstandard) {
			this.errorReply(`Warning: ${template.name} is not a real Pokemon and is therefore not usable in Mix and Mega.`);
		}
		if (toId(sep[1]) === 'crucibellite') {
			this.errorReply(`Warning: Crucibellite is a fake mega stone created by the CAP Project and is restricted to the CAP Crucibelle.`);
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
		let deltas = {
			baseStats: {},
			weightkg: megaTemplate.weightkg - baseTemplate.weightkg,
		};
		for (let statId in megaTemplate.baseStats) {
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
		let mixedTemplate = Object.assign({}, template);
		mixedTemplate.abilities = Object.assign({}, megaTemplate.abilities);
		if (mixedTemplate.types[0] === deltas.type) { // Add any type gains
			mixedTemplate.types = [deltas.type];
		} else if (deltas.type) {
			mixedTemplate.types = [mixedTemplate.types[0], deltas.type];
		}
		mixedTemplate.baseStats = {};
		for (let statName in template.baseStats) { // Add the changed stats and weight
			mixedTemplate.baseStats[statName] = Dex.clampIntRange(Dex.data.Pokedex[template.id].baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		mixedTemplate.weightkg = Math.round(Math.max(0.1, template.weightkg + deltas.weightkg) * 100) / 100;
		mixedTemplate.tier = "MnM";
		let details;
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
		details = {
			"Dex#": mixedTemplate.num,
			"Gen": mixedTemplate.gen,
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
	mixandmegahelp: ["/mnm <pokemon> @ <mega stone> - Shows the Mix and Mega evolved Pokemon's type and stats."],

	'!350cup': true,
	'350': '350cup',
	'350cup': function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.parse('/help 350cup');
		let template = Object.assign({}, Dex.getTemplate(target));
		if (!template.exists) return this.errorReply("Error: Pokemon not found.");
		let bst = 0;
		for (let i in template.baseStats) {
			bst += template.baseStats[i];
		}
		let newStats = {};
		for (let i in template.baseStats) {
			newStats[i] = template.baseStats[i] * (bst <= 350 ? 2 : 1);
		}
		template.baseStats = Object.assign({}, newStats);
		this.sendReply(`|html|${Chat.getDataPokemonHTML(template)}`);
	},
	'350cuphelp': ["/350 OR /350cup <pokemon> - Shows the base stats that a Pokemon would have in 350 Cup."],

	'!tiershift': true,
	ts: 'tiershift',
	tiershift: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.parse('/help tiershift');
		let template = Object.assign({}, Dex.getTemplate(target));
		if (!template.exists) return this.errorReply("Error: Pokemon not found.");
		let boosts = {
			'UU': 10,
			'BL2': 10,
			'RU': 20,
			'BL3': 20,
			'NU': 30,
			'BL4': 30,
			'PU': 40,
			'NFE': 40,
			'LC Uber': 40,
			'LC': 40,
		};
		if (!(template.tier in boosts)) return this.sendReply(`|html|${Chat.getDataPokemonHTML(template)}`);
		let boost = boosts[template.tier];
		let newStats = Object.assign({}, template.baseStats);
		for (let statName in template.baseStats) {
			newStats[statName] = Dex.clampIntRange(newStats[statName] + boost, 1, 255);
		}
		template.baseStats = Object.assign({}, newStats);
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(template)}`);
	},
	'tiershifthelp': ["/ts OR /tiershift <pokemon> - Shows the base stats that a Pokemon would have in Tier Shift."],
};
