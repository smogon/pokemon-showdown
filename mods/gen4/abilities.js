exports.BattleAbilities = {
	"pickup": {
		desc: "No in-battle effect.",
		shortDesc: "No in-battle effect.",
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 1
	},
	"shadowtag": {
		inherit: true,
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they are holding Shed Shell or use the moves Baton Pass or U-Turn.",
		shortDesc: "Prevents foes from switching out normally.",
		onFoeModifyPokemon: function(pokemon) {
			pokemon.trapped = true;
		}
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
	"wonderguard": {
		inherit: true,
		onDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (effect.type === '???' || effect.id === 'struggle' || effect.id === 'firefang') return;
			this.debug('Wonder Guard immunity: '+effect.id);
			if (this.getEffectiveness(effect.type, target) <= 0) {
				this.add('-activate',target,'ability: Wonder Guard');
				return null;
			}
		},
		onSubDamage: function(damage, target, source, effect) {
			if (effect.effectType !== 'Move') return;
			if (target.negateImmunity[effect.type] || effect.id === 'firefang') return;
			this.debug('Wonder Guard immunity: '+effect.id);
			if (this.getEffectiveness(effect.type, target) <= 0) {
				this.add('-activate',target,'ability: Wonder Guard');
				return null;
			}
		}
	}
};
