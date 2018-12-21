'use strict';

/**@type {{[k: string]: ModdedAbilityData}} */
let BattleAbilities = {
	effortless: {
		shortDesc: "When this Pokemon's stat stages are raised or lowered, the effect is tripled instead.",
		onBoost: function (boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			for (let i in boost) {
				// @ts-ignore
				boost[i] *= 3;
			}
		},
		id: "effortless",
		name: "Effortless",
		isNonstandard: true,
	},
	sandheal: {
		desc: "If Sandstorm is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Sandstorm.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'sandstorm') {
				this.heal(target.maxhp / 16);
			}
		},
		onImmunity: function (type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		id: "sandheal",
		name: "Sand Heal",
		isNonstandard: true,
	},
	mindawakening: {
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Special Attack is raised by 12 stages.",
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Special Attack is raised 12 stages.",
		onHit: function (target, source, move) {
			if (!target.hp) return;
			if (move && move.effectType === 'Move' && move.crit) {
				target.setBoost({spa: 6});
				this.add('-setboost', target, 'spa', 12, '[from] ability: Mind Awakening');
			}
		},
		id: "mindawakening",
		name: "Mind Awakening",
		isNonstandard: true,
	},
	miracleguard: {
		desc: "This Pokemon can only be damaged by supereffective moves. Moongeist Beam, Sunsteel Strike, Photon Geyser and the Mold Breaker, Teravolt, and Turboblaze Abilities cannot ignore this Ability.",
		shortDesc: "This Pokemon can only be damaged by supereffective moves.",
		onTryHit: function (target, source, move) {
			if (target === source || move.id === 'struggle') return;
			this.debug('Miracle Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0) {
				this.add('-immune', target, '[from] ability: Miracle Guard');
				return null;
			}
		},
		isUnbreakable: true,
		id: "miracleguard",
		name: "Miracle Guard",
		isNonstandard: true,
	},			
};

exports.BattleAbilities = BattleAbilities;
