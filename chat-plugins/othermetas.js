// Other Metas plugin by Spandan
'use strict';

exports.commands = {
	mnm: 'mixandmega',
	mixandmega: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target) || !target.includes('@')) return this.parse('/help mixandmega');
		let sep = target.split('@');
		let stone = toId(sep[1]);
		let template = toId(sep[0]);
		if (!Tools.data.Items[stone] || (Tools.data.Items[stone] && !Tools.data.Items[stone].megaEvolves && !Tools.data.Items[stone].onPrimal)) {
			return this.errorReply(`Error: Mega Stone not found`);
		}
		if (!Tools.data.Pokedex[toId(template)]) {
			return this.errorReply(`Error: Pokemon not found`);
		}
		template = Object.assign({}, Tools.getTemplate(template));
		stone = Object.assign({}, Tools.getItem(stone));
		if (template.isMega || (template.evos && Object.keys(template.evos).length > 0)) { // Mega Pokemon cannot be mega evolved
			return this.errorReply(`You cannot mega evolve ${template.name} in Mix and Mega.`);
		}
		let bannedStones = {'beedrillite':1, 'gengarite':1, 'kangaskhanite':1, 'mawilite':1, 'medichamite':1};
		if (stone.id in bannedStones && template.name !== stone.megaEvolves) {
			return this.errorReply(`You cannot use ${stone.name} on anything besides ${stone.megaEvolves} in Mix and Mega.`);
		}
		if (Tools.mod("mixandmega").getTemplate(sep[0]).tier === "Uber") { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			return this.errorReply(`${template.name} is banned from mega evolving in Mix and Mega.`);
		}
		let baseTemplate = Tools.getTemplate(stone.megaEvolves);
		let megaTemplate = Tools.getTemplate(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaTemplate = Tools.getTemplate("Groudon-Primal");
			baseTemplate = Tools.getTemplate("Groudon");
		} else if (stone.id === 'blueorb') {
			megaTemplate = Tools.getTemplate("Kyogre-Primal");
			baseTemplate = Tools.getTemplate("Kyogre");
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
			baseStats[statName] = Tools.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
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
		if (!Tools.data.Pokedex[toId(target)]) {
			return this.errorReply("Error: Pokemon not found.");
		}
		let bst = 0;
		let pokeobj = Tools.getTemplate(toId(target));
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
		if (!Tools.data.Pokedex[toId(target)]) {
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
		let template = Object.assign({}, Tools.getTemplate(target));
		if (!(template.tier in boosts)) return this.sendReplyBox(`${template.species} in Tier Shift: <br /> ${Object.values(template.baseStats).join('/')}`);
		let boost = boosts[template.tier];
		let newStats = Object.assign({}, template.baseStats);
		for (let statName in template.baseStats) {
			newStats[statName] = Tools.clampIntRange(newStats[statName] + boost, 1, 255);
		}
		this.sendReplyBox(`${template.species} in Tier Shift: <br /> ${Object.values(newStats).join('/')}`);
	},
	'tiershifthelp': ["/ts OR /tiershift <pokemon> - Shows the base stats that a Pokemon would have in Tier Shift."],
};
