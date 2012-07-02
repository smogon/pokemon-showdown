exports.BattleAbilities = {
	"angerpoint": {
		inherit: true,
		desc: "If this Pokemon, or its Substitute, is struck by a Critical Hit, its Attack is boosted to six stages.",
		shortDesc: "If this Pokemon is hit by a critical hit, its Attack is boosted by 12.",
		onCriticalHit: function(target) {
			target.setBoost({atk: 6});
			this.add('-setboost',target,'atk',12,'[from] ability: Anger Point');
		}
	},
	"pickup": {
		desc: "No in-battle effect.",
		shortDesc: "No in-battle effect.",
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 1
	},
	"stench": {
		desc: "No in-battle effect.",
		shortDesc: "No in-battle effect.",
		id: "stench",
		name: "Stench",
		rating: 0,
		num: 1
	},
	"sturdy": {
		desc: "This Pokemon is immune to OHKO moves.",
		shortDesc: "OHKO moves fail on this Pokemon.",
		onDamagePriority: -100,
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.ohko) {
				this.add('-activate',target,'Sturdy');
				return 0;
			}
		},
		id: "sturdy",
		name: "Sturdy",
		rating: 0.5,
		num: 5
	},
	"trace": {
		inherit: true,
		onStart: function(pokemon) {
			pokemon.addVolatile('trace');
		},
		effect: {
			onModifyPokemon: function(pokemon) {
				var target = pokemon.side.foe.randomActive();
				var ability = this.getAbility(target.ability);
				if (ability.id === 'forecast' || ability.id === 'multitype' || ability.id === 'trace') return;
				if (pokemon.setAbility(ability) && pokemon.removeVolatile('trace')) {
					this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
				}
			}
		}
	},
	"wonderguard": {
		inherit: true,
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (effect.type === '???' || effect.id === 'struggle' || effect.id === 'firefang') return;
			if (this.getEffectiveness(effect.type, target) <= 0) {
				this.add('-activate',target,'ability: Wonder Guard');
				return null;
			}
		},
		onSubDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (target.negateImmunity[effect.type] || effect.id === 'firefang') return;
			if (this.getEffectiveness(effect.type, target) <= 0) {
				this.add('-activate',target,'ability: Wonder Guard');
				return null;
			}
		}
	}
};
