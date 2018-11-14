'use strict';

const Data = require('../../sim/dex-data');

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init: function () {
		this.modData('Abilities', 'noability').isNonstandard = false;
		for (let i in this.data.Pokedex) {
			let template = this.getTemplate(i);
			this.modData('Pokedex', i).abilities = {0: 'No Ability'};
			if (this.data.FormatsData[i].requiredItem && this.data.Items[toId(this.data.FormatsData[i].requiredItem)].megaStone) {
				this.modData('FormatsData', template.speciesid).requiredItem = undefined;
			}
		}
	},
	/**
	 * @param {Pokemon} pokemon
	 */
	canMegaEvo(pokemon) {
		let altForme = pokemon.baseTemplate.otherFormes && this.getTemplate(pokemon.baseTemplate.otherFormes[0]);
		for (let i in this.data.Items) {
			let item = this.getItem(i);
			if (altForme && altForme.isMega && altForme.requiredMove && pokemon.baseMoves.includes(toId(altForme.requiredMove)) && !item.zMove) return altForme.species;
			if (item.megaEvolves !== pokemon.baseTemplate.baseSpecies || item.megaStone === pokemon.species) {
				return null;
			}
			return item.megaStone;
		}
	},
	/**
	 * @param {Pokemon} pokemon
	 */
	runMegaEvo(pokemon) {
		const templateid = pokemon.canMegaEvo;
		if (!templateid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		for (let i in this.data.Items) {
			let item = this.getItem(i);
			if (!item.megaStone || item.megaStone !== templateid) continue;
			pokemon.formeChange(templateid, item, true);
		}

		// Limit one mega evolution
		let wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			if (wasMega) ally.canMegaEvo = null;
		}

		this.runEvent('AfterMega', pokemon);
		return true;
	},
	/**
	 * Given a table of base stats and a pokemon set, return the actual stats.
	 * @param {StatsTable} baseStats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	spreadModify(baseStats, set) {
		/** @type {any} */
		const modStats = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		for (let statName in modStats) {
			// @ts-ignore
			let stat = baseStats[statName];
			// @ts-ignore
			modStats[statName] = Math.floor(Math.floor(2 * stat + set.ivs[statName] + Math.floor(set.evs[statName] / 4)) * set.level / 100 + 5);
			if (set.happiness && set.happiness >= 255) {
				modStats[statName] *= 1.1;
			}
			for (let pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.id !== toId(set.species)) continue;
				// @ts-ignore
				modStats[statName] += pokemon.getAwakeningValues()[statName];
			}
		}
		if ('hp' in baseStats) {
			let stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + Math.floor(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
			for (let pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.id !== toId(set.species)) continue;
				modStats['hp'] += pokemon.getAwakeningValues()['hp'];
			}
		}
		return this.natureModify(modStats, set.nature);
	},

	/**
	 * @param {Pokemon} pokemon
	 * @param {Pokemon} target
	 * @param {string | number | ActiveMove} move
	 * @param {boolean} [suppressMessages]
	 */
	getDamage(pokemon, target, move, suppressMessages = false) {
		if (typeof move === 'string') move = this.getActiveMove(move);

		if (typeof move === 'number') {
			let basePower = move;
			move = /** @type {ActiveMove} */ (new Data.Move({
				basePower,
				type: '???',
				category: 'Physical',
				willCrit: false,
			}));
			move.hit = 0;
		}

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) {
			return target.maxhp;
		}

		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}
		if (move.damage === 'level') {
			return pokemon.level;
		}
		if (move.damage) {
			return move.damage;
		}

		let category = this.getCategory(move);
		let defensiveCategory = move.defensiveCategory || category;

		let basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		if (this.gen <= 5) {
			critRatio = this.clampIntRange(critRatio, 0, 5);
			critMult = [0, 16, 8, 4, 3, 2];
		} else {
			critRatio = this.clampIntRange(critRatio, 0, 4);
			if (this.gen === 6) {
				critMult = [0, 16, 8, 2, 1];
			} else {
				critMult = [0, 24, 8, 2, 1];
			}
		}

		move.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (critRatio) {
				move.crit = this.randomChance(1, critMult[critRatio]);
			}
		}

		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		let level = pokemon.level;

		let attacker = pokemon;
		let defender = target;
		let attackStat = category === 'Physical' ? 'atk' : 'spa';
		let defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		let statTable = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
		let attack;
		let defense;

		// @ts-ignore
		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		// @ts-ignore
		let defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (move.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		let ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		let ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

		if (ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			atkBoosts = 0;
		}
		if (ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}

		if (move.useTargetOffensive) {
			attack = defender.calculateStat(attackStat, atkBoosts);
		} else {
			attack = attacker.calculateStat(attackStat, atkBoosts);
		}

		if (move.useSourceDefensive) {
			defense = attacker.calculateStat(defenseStat, defBoosts);
		} else {
			defense = defender.calculateStat(defenseStat, defBoosts);
		}

		// Apply Stat Modifiers
		// @ts-ignore
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attacker.getCombatPower());
		// @ts-ignore
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		//int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50);

		// Calculate damage modifiers separately (order differs between generations)
		return this.modifyDamage(baseDamage, pokemon, target, move, suppressMessages);
	},

	pokemon: {
		ability: '',
		baseAbility: '',
		getWeight() {
			let weight = this.template.weightkg;
			weight = this.battle.runEvent('ModifyWeight', this, null, null, weight);
			if (weight < 0.1) weight = 0.1;
			let weightModifierFinal = 20 * Math.random() * 0.01;
			return weight + (weight * (this.battle.random(2) === 1 ? 1 : -1) * weightModifierFinal);
		},
	},
};

exports.BattleScripts = BattleScripts;
