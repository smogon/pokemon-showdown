exports.BattleAbilities = {
/*
Alright, just here to say that some of the changes I made to the abilities for gen3, I'm not quite sure are correct - documentation for this generation is rather diverse
I tried to come up with the most legitimate sources I could.  Here's an important one that should probably be addressed early on, because I'm not sure I fixed it:
According to what I looked up, TWave doesn't activate Volt Absorb and Will-o-wisp doesn't activate Flash Fire.  I'm not sure how accurate this information is.
However, I did try to put that in nonetheless, but I'm pretty sure I did it badly (you won't find my changes here, I think they're in the moves file).  One of the programmers who knows how this stuff works more than I do (which is all of them) should maybe try to implement that better than I did
There's a couple of t hings I copied here also from the gen4 file (this also applies to all the move changes).  Once again, some documentation on that I doubt the credibility - not all of it may be correct
Oh, and one more thing:  I didn't alter the descriptions much, if at all, on the changes to moves, items, and abilities.
-Relados
*/
	"cutecharm": {
		desc: "If an opponent of the opposite gender directly attacks this Pokemon, there is a 30% chance that the opponent will become Attracted to this Pokemon.",
		shortDesc: "30% chance of infatuating Pokemon of the opposite gender if they make contact.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (this.random(4) < 1) {
					if (source.addVolatile('attract', target)) {
						this.add('-start', source, 'Attract', '[from] Cute Charm', '[of] '+target);
					}
				}
			}
		},
		id: "cutecharm",
		name: "Cute Charm",
		rating: 2,
		num: 56
	},
	"effectspore": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become either poisoned, paralyzed or put to sleep. There is an equal chance to inflict each status.",
		shortDesc: "30% chance of poisoning, paralyzing, or causing sleep on Pokemon making contact.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact && !source.status) {
				var r = this.random(300);
				if (r < 10) source.setStatus('slp');
				else if (r < 20) source.setStatus('par');
				else if (r < 30) source.setStatus('psn');
			}
		},
		id: "effectspore",
		name: "Effect Spore",
		rating: 2,
		num: 27
	},
	"flamebody": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become burned.",
		shortDesc: "30% chance of burning a Pokemon making contact with this Pokemon.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (this.random(4) < 1) {
					source.trySetStatus('brn', target, move);
				}
			}
		},
		id: "flamebody",
		name: "Flame Body",
		rating: 2,
		num: 49
	},
	"flashfire": {
		desc: "This Pokemon is immune to all Fire-type attacks; additionally, its own Fire-type attacks receive a 50% boost if a Fire-type move hits this Pokemon. Multiple boosts do not occur if this Pokemon is hit with multiple Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.",
		onImmunity: function(type, pokemon) {
			if (type === 'Fire') {
				pokemon.addVolatile('flashfire');
				return null;
			}
		},
		effect: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart: function(target) {
				this.add('-start',target,'ability: Flash Fire');
			},
			onBasePower: function(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('Flash Fire boost');
					return basePower * 1.5;
				}
			}
		},
		id: "flashfire",
		name: "Flash Fire",
		rating: 3,
		num: 18
	},
	"lightningrod": {
		desc: "During double battles, this Pokemon draws any single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment.",
		shortDesc: "This Pokemon draws Electric moves to itself.",
		// drawing not implemented
		id: "lightningrod",
		name: "Lightningrod",
		rating: 0,
		num: 32
	},
	"pickup": {
		desc: "No in-battle effect.",
		shortDesc: "No in-battle effect.",
		id: "pickup",
		name: "Pickup",
		rating: 0,
		num: 1
	},
	"poisonpoint": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become poisoned.",
		shortDesc: "30% chance of poisoning a Pokemon making contact with this Pokemon.",
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (this.random(4) < 1) {
					source.trySetStatus('psn', target, move);
				}
			}
		},
		id: "poisonpoint",
		name: "Poison Point",
		rating: 2,
		num: 38
	},
	"pressure": {
		desc: "When an opponent uses a move that affects this Pokemon, an additional PP is required for the opponent to use that move.",
		shortDesc: "If this Pokemon is the target of a move, that move loses one additional PP.",
		onSourceDeductPP: function(pp, target, source) {
			if (target === source) return;
			return pp+1;
		},
		id: "pressure",
		name: "Pressure",
		rating: 1,
		num: 46
	},
	"rockhead": {
		desc: "This Pokemon does not receive recoil damage unless it uses Struggle, it misses with Jump Kick or Hi Jump Kick or it is holding Life Orb, Jaboca Berry or Rowap Berry.",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle, Life Orb, crash damage.",
		onModifyMove: function(move) {
			if (move.id !== 'struggle') delete move.recoil;
		},
		id: "rockhead",
		name: "Rock Head",
		rating: 3.5,
		num: 69
	},
	"roughskin": {
		desc: "Causes recoil damage equal to 1/16 of the opponent's max HP if an opponent directly attacks.",
		shortDesc: "This Pokemon causes other Pokemon making contact to lose 1/16 of their max HP.",
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp/16, source, target);
			}
		},
		id: "roughskin",
		name: "Rough Skin",
		rating: 3,
		num: 24
	},
	"shadowtag": {
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they are holding Shed Shell, or they use the moves Baton Pass or U-Turn.",
		shortDesc: "Prevents foes from switching out normally.",
		onFoeModifyPokemon: function(pokemon) {
			pokemon.trapped = true;
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 5,
		num: 23
	},
	"static": {
		desc: "If an opponent directly attacks this Pokemon, there is a 30% chance that the opponent will become paralyzed.",
		shortDesc: "30% chance of paralyzing a Pokemon making contact with this Pokemon.",
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.isContact) {
				if (this.random(4) < 1) {
					source.trySetStatus('par', target, effect);
				}
			}
		},
		id: "static",
		name: "Static",
		rating: 2,
		num: 9
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
	"synchronize": {
		inherit: true,
		onAfterSetStatus: function(status, target, source) {
			if (!source || source === target) return;
			var status = status.id;
			if (status === 'slp' || status === 'frz') return;
			if (status === 'tox') status = 'psn';
			source.trySetStatus(status);
		}
	},
	"trace": {
		inherit: true,
		onUpdate: function(pokemon) {
			var target = pokemon.side.foe.randomActive();
			if (!target || target.fainted) return;
			var ability = this.getAbility(target.ability);
			var bannedAbilities = {forecast:1, multitype:1, trace:1};
			if (bannedAbilities[target.ability]) {
				return;
			}
			if (ability === 'Intimidate')
			{
				if (pokemon.setAbility('Illuminate')) {  //Temporary fix so Intimidate doesn't activate in third gen when traced
					this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
				}
			}
			else if (pokemon.setAbility(ability)) {
				this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
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
	},
	"voltabsorb": {
		desc: "When an Electric-type attack hits this Pokemon, it recovers 25% of its max HP.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.",
		onImmunity: function(type, pokemon) {
			if (type === 'Electric') {
				var d = pokemon.heal(pokemon.maxhp/4);
				this.add('-heal',pokemon,pokemon.getHealth,'[from] ability: Volt Absorb');
				return null;
			}
		},
		id: "voltabsorb",
		name: "Volt Absorb",
		rating: 3,
		num: 10
	}
};
