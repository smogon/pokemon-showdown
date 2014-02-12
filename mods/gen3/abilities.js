exports.BattleAbilities = {
	"cutecharm": {
		inherit: true,
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (this.random(3) < 1) {
					source.addVolatile('attract', target);
				}
			}
		}
	},
	"effectspore": {
		inherit: true,
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact && !source.status) {
				var r = this.random(300);
				if (r < 10) source.setStatus('slp');
				else if (r < 20) source.setStatus('par');
				else if (r < 30) source.setStatus('psn');
			}
		}
	},
	"flamebody": {
		inherit: true,
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (this.random(3) < 1) {
					source.trySetStatus('brn', target, move);
				}
			}
		}
	},
	"flashfire": {
		inherit: true,
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (move.id === 'willowisp' && (target.hasType('Fire') || target.status || target.volatiles['substitute'])) {
					return;
				}
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		}
	},
	"lightningrod": {
		desc: "During double battles, this Pokemon draws any single-target Electric-type attack to itself. If an opponent uses an Electric-type attack that affects multiple Pokemon, those targets will be hit. This ability does not affect Electric Hidden Power or Judgment. The user is immune to Electric and its Special Attack is increased one stage when hit by one.",
		shortDesc: "This Pokemon draws opposing Electric moves to itself.",
		onFoeRedirectTargetPriority: 1,
		onFoeRedirectTarget: function(target, source, source2, move) {
			if (move.type !== 'Electric') return;
			if (this.validTarget(this.effectData.target, source, move.target)) {
				return this.effectData.target;
			}
		},
		id: "lightningrod",
		name: "Lightningrod",
		rating: 3.5,
		num: 32
	},
	"pickup": {
		inherit: true,
		onResidualOrder: null,
		onResidualSubOrder: null,
		onResidual: function() {}
	},
	"poisonpoint": {
		inherit: true,
		onAfterDamage: function(damage, target, source, move) {
			if (move && move.isContact) {
				if (this.random(3) < 1) {
					source.trySetStatus('psn', target, move);
				}
			}
		}
	},
	"pressure": {
		inherit: true,
		onStart: function() { }
	},
	"rockhead": {
		inherit: true,
		onModifyMove: function(move) {
			if (move.id !== 'struggle') delete move.recoil;
		}
	},
	"roughskin": {
		inherit: true,
		onAfterDamage: function(damage, target, source, move) {
			if (source && source !== target && move && move.isContact) {
				this.damage(source.maxhp/16, source, target);
			}
		}
	},
	"shadowtag": {
		inherit: true,
		onFoeModifyPokemon: function(pokemon) {
			pokemon.trapped = true;
		}
	},
	"static": {
		inherit: true,
		onAfterDamage: function(damage, target, source, effect) {
			if (effect && effect.isContact) {
				if (this.random(3) < 1) {
					source.trySetStatus('par', target, effect);
				}
			}
		}
	},
	"stench": {
		inherit: true,
		onModifyMove: function(){}
	},
	"sturdy": {
		inherit: true,
		onDamage: function(damage, target, source, effect) {
			if (effect && effect.ohko) {
				this.add('-activate',target,'Sturdy');
				return 0;
			}
		}
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
				if (pokemon.setAbility('Illuminate')) {  // Temporary fix so Intimidate doesn't activate in third gen when traced
					this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
				}
			}
			else if (pokemon.setAbility(ability)) {
				this.add('-ability',pokemon, ability,'[from] ability: Trace','[of] '+target);
			}
		}
	},
	"voltabsorb": {
		inherit: true,
		onTryHit: function(target, source, move) {
			if (target !== source && move.type === 'Electric' && move.id !== 'thunderwave') {
				if (!this.heal(target.maxhp/4)) {
					this.add('-immune', target, '[msg]');
				}
				return null;
			}
		}
	}
};
