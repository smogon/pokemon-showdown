'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init() {
		for (let id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
		}
	},
	canMegaEvo(pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return null;

		const item = pokemon.getItem();
		if (item.megaStone) {
			if (item.megaStone === pokemon.species) return null;
			return item.megaStone;
		} else if (pokemon.baseMoves.includes('dragonascent')) {
			return 'Rayquaza-Mega';
		} else {
			return null;
		}
	},
	runMegaEvo(pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;

		const isUltraBurst = !pokemon.canMegaEvo;
		/**@type {Template} */
		// @ts-ignore
		const template = this.getMixedTemplate(pokemon.m.originalSpecies, pokemon.canMegaEvo || pokemon.canUltraBurst);
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		// Do we have a proper sprite for it?
		// @ts-ignore assert non-null pokemon.canMegaEvo
		if (isUltraBurst || this.getTemplate(pokemon.canMegaEvo).baseSpecies === pokemon.m.originalSpecies) {
			pokemon.formeChange(template, pokemon.getItem(), true);
		} else {
			let oTemplate = this.getTemplate(pokemon.m.originalSpecies);
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(template.originalMega);
			pokemon.formeChange(template, pokemon.getItem(), true);
			this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
			}
		}

		pokemon.canMegaEvo = null;
		if (isUltraBurst) pokemon.canUltraBurst = null;
		return true;
	},
	getMixedTemplate(originalSpecies, megaSpecies) {
		let originalTemplate = this.getTemplate(originalSpecies);
		let megaTemplate = this.getTemplate(megaSpecies);
		if (originalTemplate.baseSpecies === megaTemplate.baseSpecies) return megaTemplate;
		// @ts-ignore
		let deltas = this.getMegaDeltas(megaTemplate);
		// @ts-ignore
		let template = this.doGetMixedTemplate(originalTemplate, deltas);
		return template;
	},
	getMegaDeltas(megaTemplate) {
		let baseTemplate = this.getTemplate(megaTemplate.baseSpecies);
		/**@type {{ability: string, baseStats: {[k: string]: number}, weightkg: number, originalMega: string, requiredItem: string | undefined, type?: string, isMega?: boolean, isPrimal?: boolean}} */
		let deltas = {
			ability: megaTemplate.abilities['0'],
			baseStats: {},
			weightkg: megaTemplate.weightkg - baseTemplate.weightkg,
			originalMega: megaTemplate.species,
			requiredItem: megaTemplate.requiredItem,
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
		if (megaTemplate.isMega) deltas.isMega = true;
		if (megaTemplate.isPrimal) deltas.isPrimal = true;
		return deltas;
	},
	doGetMixedTemplate(templateOrTemplateName, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		let template = this.deepClone(this.getTemplate(templateOrTemplateName));
		template.abilities = {'0': deltas.ability};
		if (template.types[0] === deltas.type) {
			template.types = [deltas.type];
		} else if (deltas.type) {
			template.types = [template.types[0], deltas.type];
		}
		let baseStats = template.baseStats;
		for (let statName in baseStats) {
			baseStats[statName] = this.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		template.weightkg = Math.max(0.1, template.weightkg + deltas.weightkg);
		template.originalMega = deltas.originalMega;
		template.requiredItem = deltas.requiredItem;
		if (deltas.isMega) template.isMega = true;
		if (deltas.isPrimal) template.isPrimal = true;
		return template;
	},
};

exports.BattleScripts = BattleScripts;
