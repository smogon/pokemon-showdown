'use strict';

exports.BattleScripts = {
	inherit: 'gen6',
	gen: 6,
	init() {
		let tankStats = {hp: 90, atk: 30, def: 120, spa: 130, spd: 120, spe: 50};
		let healerStats = {hp: 50, atk: 10, def: 95, spa: 80, spd: 95, spe: 10};
		let supportStats = {hp: 75, atk: 50, def: 90, spa: 50, spd: 90, spe: 100};
		let dpsStats = {hp: 65, atk: 130, def: 85, spa: 130, spd: 85, spe: 150};
		// Modify tanks
		this.modData('Pokedex', 'registeel').baseStats = tankStats;
		this.modData('Pokedex', 'golurk').baseStats = tankStats;
		this.modData('Pokedex', 'golett').baseStats = tankStats;
		this.modData('Pokedex', 'palkia').baseStats = tankStats;
		this.modData('Pokedex', 'slugma').baseStats = tankStats;
		this.modData('Pokedex', 'snorlax').baseStats = tankStats;
		this.modData('Pokedex', 'xerneas').baseStats = tankStats;
		this.modData('Pokedex', 'muk').baseStats = tankStats;
		this.modData('Pokedex', 'gothitelle').baseStats = tankStats;
		// Modify healers
		this.modData('Pokedex', 'jynx').baseStats = healerStats;
		this.modData('Pokedex', 'gardevoir').baseStats = healerStats;
		this.modData('Pokedex', 'alakazam').baseStats = healerStats;
		this.modData('Pokedex', 'celebi').baseStats = healerStats;
		this.modData('Pokedex', 'bisharp').baseStats = healerStats;
		this.modData('Pokedex', 'machoke').baseStats = healerStats;
		this.modData('Pokedex', 'treecko').baseStats = healerStats;
		// Modify supporters
		this.modData('Pokedex', 'regirock').baseStats = supportStats;
		this.modData('Pokedex', 'scrafty').baseStats = supportStats;
		this.modData('Pokedex', 'mrmime').baseStats = supportStats;
		this.modData('Pokedex', 'elgyem').baseStats = supportStats;
		this.modData('Pokedex', 'heliolisk').baseStats = supportStats;
		this.modData('Pokedex', 'regigigas').baseStats = supportStats;
		this.modData('Pokedex', 'genesect').baseStats = supportStats;
		this.modData('Pokedex', 'delphox').baseStats = supportStats;
		// Modify DPSs
		this.modData('Pokedex', 'groudon').baseStats = dpsStats;
		this.modData('Pokedex', 'ursaring').baseStats = dpsStats;
		this.modData('Pokedex', 'magmar').baseStats = dpsStats;
		this.modData('Pokedex', 'sawk').baseStats = dpsStats;
		this.modData('Pokedex', 'hitmonlee').baseStats = dpsStats;
		this.modData('Pokedex', 'throh').baseStats = dpsStats;
		this.modData('Pokedex', 'monferno').baseStats = dpsStats;
		this.modData('Pokedex', 'dialga').baseStats = dpsStats;
		this.modData('Pokedex', 'clawitzer').baseStats = dpsStats;
		this.modData('Pokedex', 'yveltal').baseStats = dpsStats;
		this.modData('Pokedex', 'dusknoir').baseStats = dpsStats;
		this.modData('Pokedex', 'cofagrigus').baseStats = dpsStats;
		this.modData('Pokedex', 'toxicroak').baseStats = dpsStats;
		this.modData('Pokedex', 'raticate').baseStats = dpsStats;
	},
	pokemon: {
		runImmunity(type, message) {
			return true;
		},
	},
	getDamage(pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.getMove(move);

		if (typeof move === 'number') {
			move = {
				basePower: move,
				type: '???',
				category: 'Physical',
				flags: {},
			};
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

		if (!move) move = {};
		if (!move.type) move.type = '???';
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
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		let attacker = pokemon;
		let defender = target;
		let attackStat = category === 'Physical' ? 'atk' : 'spa';
		let defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		let statTable = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
		let attack;
		let defense;
		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		let defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];

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
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		// In this mod, basePower is the %HP of the caster that is used on the damage calcualtion.
		//var baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2;
		let baseDamage = Math.floor(pokemon.maxhp * basePower / 100);

		// Now this is varied by stats slightly.
		baseDamage += Math.floor(baseDamage * (attack - defense) / 100);

		// Randomizer. Doesn't change much.
		baseDamage = Math.floor(baseDamage * (90 + this.random(11)) / 100);

		if (pokemon.volatiles['chilled']) {
			baseDamage = Math.floor(baseDamage * 0.9);
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		// Minimum is 1
		if (basePower && !Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	},
};
