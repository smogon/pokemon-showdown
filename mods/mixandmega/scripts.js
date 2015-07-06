exports.BattleScripts = {
	init: function () {
		var onTakeMegaStone = function (item, source) {
			return false;
		};
		for (var id in this.data.Items) {
			if (id !== 'redorb' && id !== 'blueorb' && !this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = onTakeMegaStone;
		}
	},
	canMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;

		var item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.species) return false;
			return item.megaStone;
		} else if (pokemon.set.moves.indexOf('dragonascent') >= 0) {
			return 'Rayquaza-Mega';
		} else {
			return false;
		}
	},
	runMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;
		var template = this.getMixedTemplate(pokemon.originalSpecies, pokemon.canMegaEvo);
		var side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		var foeActive = side.foe.active;
		for (var i = 0; i < foeActive.length; i++) {
			if (foeActive[i].volatiles['skydrop'] && foeActive[i].volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(template);
		pokemon.baseTemplate = template; // mega evolution is permanent

		// Do we have a proper sprite for it?
		if (this.getTemplate(pokemon.canMegaEvo).baseSpecies === pokemon.originalSpecies) {
			pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
			this.add('detailschange', pokemon, pokemon.details);
			this.add('-mega', pokemon, template.baseSpecies, template.requiredItem);
		} else {
			var oTemplate = this.getTemplate(pokemon.originalSpecies);
			var oMegaTemplate = this.getTemplate(template.originalMega);
			if (template.originalMega === 'Rayquaza-Mega') {
				this.add('message', "" + pokemon.side.name + "'s fervent wish has reached " + pokemon.species + "!");
			} else {
				this.add('message', "" + pokemon.species + "'s " + pokemon.getItem().name + " is reacting to " + pokemon.side.name + "'s Mega Bracelet!");
			}
			this.add('-formechange', pokemon, oTemplate.species, template.requiredItem);
			this.add('message', template.baseSpecies + " has Mega Evolved into Mega " + template.baseSpecies + "!");
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
			}
		}

		pokemon.setAbility(template.abilities['0']);
		pokemon.baseAbility = pokemon.ability;
		pokemon.canMegaEvo = false;
		return true;
	},
	doGetMixedTemplate: function (template, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		if (!template || typeof template === 'string') template = this.getTemplate(template);
		template = Object.clone(template); // shallow is enough
		template.abilities = {'0': deltas.ability};
		template.types = Object.merge(template.types.slice(), deltas.types).compact().unique();
		var baseStats = template.baseStats;
		template.baseStats = {};
		for (var statName in baseStats) template.baseStats[statName] = baseStats[statName] + deltas.baseStats[statName];
		template.weightkg = Math.max(0.1, template.weightkg + deltas.weightkg);
		template.originalMega = deltas.originalMega;
		template.requiredItem = deltas.requiredItem;
		if (deltas.isMega) template.isMega = true;
		if (deltas.isPrimal) template.isPrimal = true;
		return template;
	},
	getMixedTemplate: function (originalSpecies, megaSpecies) {
		var originalTemplate = this.getTemplate(originalSpecies);
		var megaTemplate = this.getTemplate(megaSpecies);
		if (originalTemplate.baseSpecies === megaTemplate.baseSpecies) return megaTemplate;
		var deltas = this.getMegaDeltas(megaTemplate);
		var template = this.doGetMixedTemplate(originalTemplate, deltas);
		return template;
	},
	getMegaDeltas: function (megaTemplate) {
		var baseTemplate = this.getTemplate(megaTemplate.baseSpecies);
		var deltas = {
			ability: megaTemplate.abilities['0'], baseStats: {}, weightkg: megaTemplate.weightkg - baseTemplate.weightkg, types: Array(baseTemplate.types.length),
			originalMega: megaTemplate.species, requiredItem: megaTemplate.requiredItem
		};
		for (var statId in megaTemplate.baseStats) deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.types.push(megaTemplate.types[1]);
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.types[1] = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.types[1] = megaTemplate.types[1];
		}
		if (megaTemplate.isMega) deltas.isMega = true;
		if (megaTemplate.isPrimal) deltas.isPrimal = true;
		return deltas;
	}
};
