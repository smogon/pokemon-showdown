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
			buffer += "- <a href=\"https://www.smogon.com/forums/forums/other-metagames.394/\">Other Metagames Forum</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/forums/om-analyses.416/\">Other Metagames Analyses</a><br />";
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

	ce: "crossevolve",
	crossevo: "crossevolve",
	crossevolve: function (target, user, room) {
		if (!this.runBroadcast()) return;
		if (!target || !target.includes(',')) return this.parse('/help crossevo');
		let pokes = target.split(",");
		if (!Tools.data.Pokedex[toId(pokes[0])] || !Tools.data.Pokedex[toId(pokes[1])]) {
			return this.errorReply('Error: Pokemon not found.');
		}
		let poke1 = Tools.getTemplate(pokes[0]), poke2 = Tools.getTemplate(pokes[1]);
		let prevo = Tools.getTemplate(poke2.prevo);
		if (!poke1.evos || !poke1.evos.length) {
			return this.errorReply(`Error: ${poke1.species} does not evolve.`);
		}
		if (!prevo.exists) {
			return this.errorReply(`Error: You cannot cross evolve into ${poke2.species}.`);
		}
		let setStage = 1, crossStage = 1;
		if (poke1.prevo) {
			setStage++;
			if (Tools.data.Pokedex[poke1.prevo].prevo) {
				setStage++;
			}
		}
		if (poke2.prevo) {
			crossStage++;
			if (prevo.prevo) {
				crossStage++;
			}
		}
		if (setStage + 1 !== crossStage) {
			return this.sendReply(`Error: Cross evolution must follow evolutionary stages. (${poke1.species} is Stage ${setStage} and can only cross evolve to Stage ${setStage + 1})`);
		}
		let stats = {};
		let ability = Object.values(poke2.abilities).join('/');
		for (let statName in poke1.baseStats) {
			let stat = poke1.baseStats[statName];
			stat += poke2.baseStats[statName] - prevo.baseStats[statName];
			stats[statName] = stat;
		}
		let typ1 = "", typ2 = "";
		typ1 = typ1 + poke1.types[0];
		if (poke1.types[1]) typ2 = typ2 + poke1.types[1];
		if (poke2.types[0] !== prevo.types[0]) typ1 = poke2.types[0];
		if (poke2.types[1] !== prevo.types[1]) typ2 = poke2.types[1] || poke2.types[0];
		if (typ1 === typ2) typ2 = "";
		let weightkg = poke2.weightkg - prevo.weightkg + poke1.weightkg;
		if (weightkg <= 0) {
			weightkg = 0.1;
		}
		for (let i in stats) {
			if (stats[i] <= 0 || stats[i] > 255) {
				return this.errorReply(`This Cross Evolution cannot happen since a stat goes below 0 or above 255.`);
			}
		}
		let type = `<span class="col typecol"><img src="https://play.pokemonshowdown.com/sprites/types/${typ1}.png" alt="${typ1}" height="14" width="32">`;
		if (typ2) type = `${type}<img src="https://play.pokemonshowdown.com/sprites/types/${typ2}.png" alt="${typ2}" height="14" width="32">`;
		type += "</span>";
		let gnbp = 20;
		if (weightkg >= 200) { // Calculate Grass Knot/Low Kick Base Power
			gnbp = 120;
		} else if (weightkg >= 100) {
			gnbp = 100;
		} else if (weightkg >= 50) {
			gnbp = 80;
		} else if (weightkg >= 25) {
			gnbp = 60;
		} else if (weightkg >= 10) {
			gnbp = 40;
		} // Aah, only if `template` had a `bst` property.
		let bst = stats['hp'] + stats['atk'] + stats['def'] + stats['spa'] + stats['spd'] + stats['spe'];
		let text = `<b>${poke1.species}</b> ===> <b>${poke2.species}</b>:<br />`;
		text = `${text}<b>Stats</b>: ${Object.values(stats).join('/')}<br />`;
		text = `${text}<b>BST</b>: ${bst}<br />`;
		text = `${text}<b>Type:</b> ${type}<br />`;
		text = `${text}<b>Abilities</b>: ${ability}<br />`;
		text = `${text}<b>Weight</b>: ${weightkg} kg (${gnbp} BP)`;
		return this.sendReplyBox(text);
	},
	crossevolvehelp: ["/crossevo <base pokemon>, <evolved pokemon> - Shows the type and stats for the Cross Evolved Pokemon."],

	mnm: 'mixandmega',
	mixandmega: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target) || !target.includes('@')) return this.parse('/help mixandmega');
		let sep = target.split('@');
		let stone = toId(sep[1]);
		let template = toId(sep[0]);
		if (!Dex.data.Items[stone] || (Dex.data.Items[stone] && !Dex.data.Items[stone].megaEvolves && !Dex.data.Items[stone].onPrimal)) {
			return this.errorReply(`Error: Mega Stone not found`);
		}
		if (!Dex.data.Pokedex[toId(template)]) {
			return this.errorReply(`Error: Pokemon not found`);
		}
		template = Object.assign({}, Dex.getTemplate(template));
		stone = Object.assign({}, Dex.getItem(stone));
		if (template.isMega || (template.evos && Object.keys(template.evos).length > 0)) { // Mega Pokemon cannot be mega evolved
			return this.errorReply(`You cannot mega evolve ${template.name} in Mix and Mega.`);
		}
		let bannedStones = {'beedrillite':1, 'gengarite':1, 'kangaskhanite':1, 'mawilite':1, 'medichamite':1};
		if (stone.id in bannedStones && template.name !== stone.megaEvolves) {
			return this.errorReply(`You cannot use ${stone.name} on anything besides ${stone.megaEvolves} in Mix and Mega.`);
		}
		if (Dex.mod("mixandmega").getTemplate(sep[0]).tier === "Uber") { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			return this.errorReply(`${template.name} is banned from mega evolving in Mix and Mega.`);
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
			ability: megaTemplate.abilities['0'],
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
		let ability = deltas.ability;
		let types = template.types;
		let baseStats = Object.assign({}, template.baseStats);
		if (types[0] === deltas.type) { // Add any type gains
			types = [deltas.type];
		} else if (deltas.type) {
			types = [types[0], deltas.type];
		}
		for (let statName in baseStats) { // Add the changed stats and weight
			baseStats[statName] = Dex.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		let weightkg = Math.round(Math.max(0.1, template.weightkg + deltas.weightkg) * 100) / 100;
		let type = '<span class="col typecol">';
		for (let i = 0; i < types.length; i++) { // HTML for some nice type images.
			type = `${type}<img src="https://play.pokemonshowdown.com/sprites/types/${types[i]}.png" alt="${types[i]}" height="14" width="32">`;
		}
		type = type + "</span>";
		let gnbp = 20;
		if (weightkg >= 200) { // Calculate Grass Knot/Low Kick Base Power
			gnbp = 120;
		} else if (weightkg >= 100) {
			gnbp = 100;
		} else if (weightkg >= 50) {
			gnbp = 80;
		} else if (weightkg >= 25) {
			gnbp = 60;
		} else if (weightkg >= 10) {
			gnbp = 40;
		} // Aah, only if `template` had a `bst` property.
		let bst = baseStats['hp'] + baseStats['atk'] + baseStats['def'] + baseStats['spa'] + baseStats['spd'] + baseStats['spe'];
		let text = `<b>Stats</b>: ${Object.values(baseStats).join('/')}<br />`;
		text = `${text}<b>BST</b>: ${bst}<br />`;
		text = `${text}<b>Type:</b> ${type}<br />`;
		text = `${text}<b>Ability</b>: ${ability}<br />`;
		text = `${text}<b>Weight</b>: ${weightkg} kg (${gnbp} BP)`;
		return this.sendReplyBox(text);
	},
	mixandmegahelp: ["/mnm <pokemon> @ <mega stone> - Shows the Mix and Mega evolved Pokemon's type and stats."],

	'350': '350cup',
	'350cup': function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!Dex.data.Pokedex[toId(target)]) {
			return this.errorReply("Error: Pokemon not found.");
		}
		let bst = 0;
		let pokeobj = Dex.getTemplate(toId(target));
		for (let i in pokeobj.baseStats) {
			bst += pokeobj.baseStats[i];
		}
		let newStats = {};
		for (let i in pokeobj.baseStats) {
			newStats[i] = pokeobj.baseStats[i] * (bst <= 350 ? 2 : 1);
		}
		this.sendReplyBox(`${pokeobj.species} in 350 Cup: <br /> ${Object.values(newStats).join('/')}`);
	},
	'350cuphelp': ["/350 OR /350cup <pokemon> - Shows the base stats that a Pokemon would have in 350 Cup."],

	ts: 'tiershift',
	tiershift: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!Dex.data.Pokedex[toId(target)]) {
			return this.errorReply("Error: Pokemon not found.");
		}
		let boosts = {
			'UU': 5,
			'BL2': 5,
			'RU': 10,
			'BL3': 10,
			'NU': 15,
			'BL4': 15,
			'PU': 20,
			'NFE': 20,
			'LC Uber': 20,
			'LC': 20,
		};
		let template = Object.assign({}, Dex.getTemplate(target));
		if (!(template.tier in boosts)) return this.sendReplyBox(`${template.species} in Tier Shift: <br /> ${Object.values(template.baseStats).join('/')}`);
		let boost = boosts[template.tier];
		let newStats = Object.assign({}, template.baseStats);
		for (let statName in template.baseStats) {
			newStats[statName] = Dex.clampIntRange(newStats[statName] + boost, 1, 255);
		}
		this.sendReplyBox(`${template.species} in Tier Shift: <br /> ${Object.values(newStats).join('/')}`);
	},
	'tiershifthelp': ["/ts OR /tiershift <pokemon> - Shows the base stats that a Pokemon would have in Tier Shift."],
};
