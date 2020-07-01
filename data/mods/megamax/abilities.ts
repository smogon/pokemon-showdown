export const BattleAbilities: {[k: string]: ModdedAbilityData} = {
	calmingtides: {
		desc: "Water-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a major status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Water types can't have stats lowered or status inflicted by other Pokemon.",
		onAllyBoost(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Water')) return;
			let showMsg = false;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				const effectHolder = this.effectData.target;
				this.add('-block', target, 'ability: Calming Tides', '[of] ' + effectHolder);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType('Water') && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Calming Tides');
				if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectData.target;
					this.add('-block', target, 'ability: Calming Tides', '[of] ' + effectHolder);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (target.hasType('Water') && status.id === 'yawn') {
				this.debug('Calming Tides blocking yawn');
				const effectHolder = this.effectData.target;
				this.add('-block', target, 'ability: Calming Tides', '[of] ' + effectHolder);
				return null;
			}
		},
		name: "Calming Tides",
		rating: 0,
	},
	contaminate: {
		desc: "On switch-in, this Pokemon lowers the Special Defense of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Sp. Atk of adjacent opponents by 1 stage.",
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.side.foe.active) {
				if (!target || !this.isAdjacent(target, pokemon)) continue;
				if (!activated) {
					this.add('-ability', pokemon, 'Contaminate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({spa: -1}, target, pokemon, null, true);
				}
			}
		},
		name: "Contaminate",
		rating: 3.5,
	},
	corrosivepincers: {
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.",
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Technically not a secondary effect, but it is negated
				if (move.id === 'clangoroussoulblaze') delete move.selfBoost;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([0x14CD, 0x1000]);
		},
		name: "Corrosive Pincers",
		rating: 3.5,
	},
	deepfocus: {
		shortDesc: "This Pokemon's critical hit ratio is raised by 1 stage if it hasn't taken damage.",
		onModifyCritRatio(critRatio, source, target) {
			if (target.hp >= target.maxhp) return critRatio + 1;
		},
		name: "Deep Focus",
		rating: 1,
	},
	lightpower: {
		shortDesc: "If this Pokemon is a Pikachu, its Attack and Special Attack are doubled.",
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		name: "Light Power",
	},
	nemesis: {
		shortDesc: "On switch-in, this Pokemon uses Psych Up.",
		onStart(pokemon) {
			this.useMove('psychup', pokemon);
		},
		name: "Nemesis",
		rating: 4,
	},
	psychozone: {
		desc: "This Pokemon's Normal-type moves become Psychic-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Psychic type and have 1.2x power.",
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Psychic';
				// @ts-ignore
				move.zoneBoosted = true;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			// @ts-ignore
			if (move.zoneBoosted) return this.chainModify([0x1333, 0x1000]);
		},
		name: "Psycho Zone",
		rating: 4,
	},
};
