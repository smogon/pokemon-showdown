exports.BattleMovedex = {
	/******************************************************************
	Perfect accuracy moves:
	- base power increased 60 to 80

	Justification:
	- perfect accuracy is too underpowered to have such low base power
	- it's not even an adequate counter to accuracy boosting, which
	  is why the latter is banned

	Precedent:
	- Giga Drain and Drain Punch, similar 60 base power moves, have
	  been upgraded
	******************************************************************/
	aerialace: {	
		inherit: true,
		basePower: 80
	},
	faintattack: {
		inherit: true,
		basePower: 80
	},
	shadowpunch: {
		inherit: true,
		basePower: 80
	},
	shockwave: {
		inherit: true,
		basePower: 80
	},
	swift: {
		inherit: true,
		basePower: 80
	},
	/******************************************************************
	HMs:
	- shouldn't suck (as much)

	Justification:
	- there are HMs that don't suck

	Precedent:
	- Dive! Technically, it was to be in-line with Dig, but still.
	******************************************************************/
	strength: {
		inherit: true,
		secondary: {
			chance: 30,
			self: {
				boosts: {
					atk: 1
				}
			}
		}
	},
	cut: {
		inherit: true,
		secondary: {
			chance: 100,
			boosts: {
				def: -1
			}
		}
	},
	rocksmash: {
		inherit: true,
		basePower: 50
	},
	/******************************************************************
	Weather moves:
	- have increased priority

	Justification:
	- several Rain abusers get Prankster, which makes Rain otherwise
	  overpowered
	******************************************************************/
	raindance: {
		inherit: true,
		priority: 1
	},
	sunnyday: {
		inherit: true,
		priority: 1
	},
	sandstorm: {
		inherit: true,
		priority: 1
	},
	hail: {
		inherit: true,
		priority: 1
	},
	/******************************************************************
	Two-turn moves:
	- now a bit better

	Justification:
	- Historically, these moves are useless.
	******************************************************************/
	solarbeam: {
		inherit: true,
		basePower: 60,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		effect: {
			duration: 2,
			onLockMove: 'solarbeam',
			onStart: function(pokemon) {
				this.heal(pokemon.maxhp/3);
			}
		},
		breaksProtect: true
	},
	razorwind: {
		inherit: true,
		basePower: 40,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion'
		},
		breaksProtect: true
	},
	skullbash: {
		inherit: true,
		basePower: 50,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		effect: {
			duration: 2,
			onLockMove: 'skullbash',
			onStart: function(pokemon) {
				this.boost({def:1,spd:1}, pokemon, pokemon, this.getMove('skullbash'));
			}
		},
		breaksProtect: true
	},
	skyattack: {
		inherit: true,
		basePower: 70,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1
			}
		},
		breaksProtect: true
	},
	freezeshock: {
		inherit: true,
		basePower: 70,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			status: 'par'
		},
		breaksProtect: true
	},
	iceburn: {
		inherit: true,
		basePower: 70,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			status: 'brn'
		},
		breaksProtect: true
	},
	bounce: {
		inherit: true,
		basePower: 45,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			status: 'par'
		},
		breaksProtect: true
	},
	fly: {
		inherit: true,
		basePower: 45,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1
			}
		},
		breaksProtect: true
	},
	dig: {
		inherit: true,
		basePower: 40,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1
			}
		},
		breaksProtect: true
	},
	dive: {
		inherit: true,
		basePower: 40,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1
			}
		},
		breaksProtect: true
	},
	shadowforce: {
		inherit: true,
		basePower: 30,
		willCrit: true,
		accuracy: true,
		onTryHitPriority: 10,
		onTryHit: function(target) {
			target.removeVolatile('substitute');
		},
		secondary: {
			chance: 100,
			volatileStatus: 'curse'
		},
		breaksProtect: true
	},
	/******************************************************************
	Snore:
	- base power increased to 100

	Justification:
	- Sleep Talk needs some competition
	******************************************************************/
	snore: {
		inherit: true,
		basePower: 100
	},
	/******************************************************************
	Relic Song:
	- secondary changed to 40% -Atk -SpA (80% after Serene Grace)

	Justification:
	- Meloetta-P needs viability
	******************************************************************/
	relicsong: {
		inherit: true,
		secondary: {
			chance: 40,
			boosts: {
				atk: -1,
				spa: -1
			}
		},
	},
	/******************************************************************
	Multi-hit moves:
	- changed to perfect accuracy

	Justification:
	- as an Interesting Mechanic in terms of being able to hit past
	  Substitute, it could use a buff

	Flavor justification:
	- You're going to attack that many times and they're all going to
	  miss?
	******************************************************************/
	armthrust: {
		inherit: true,
		accuracy: true
	},
	barrage: {
		inherit: true,
		accuracy: true
	},
	beatup: {
		inherit: true,
		accuracy: true
	},
	bonemerang: {
		inherit: true,
		accuracy: true
	},
	bonerush: {
		inherit: true,
		accuracy: true
	},
	bulletseed: {
		inherit: true,
		accuracy: true
	},
	cometpunch: {
		inherit: true,
		accuracy: true
	},
	doublehit: {
		inherit: true,
		accuracy: true
	},
	doublekick: {
		inherit: true,
		accuracy: true
	},
	doubleslap: {
		inherit: true,
		accuracy: true
	},
	dualchop: {
		inherit: true,
		accuracy: true
	},
	furyattack: {
		inherit: true,
		accuracy: true
	},
	furyswipes: {
		inherit: true,
		accuracy: true
	},
	geargrind: {
		inherit: true,
		accuracy: true
	},
	iciclespear: {
		inherit: true,
		accuracy: true
	},
	pinmissile: {
		inherit: true,
		accuracy: true
	},
	rockblast: {
		inherit: true,
		accuracy: true
	},
	spikecannon: {
		inherit: true,
		accuracy: true
	},
	tailslap: {
		inherit: true,
		accuracy: true
	},
	/******************************************************************
	Draining moves:
	- move types around, buff Leech Life

	Justification:
	- Poison, Bug, and Grass make sense for draining moves. Fighting
	  really doesn't.
	******************************************************************/
	leechlife: {
		inherit: true,
		basePower: 60
	},
	drainpunch: {
		inherit: true,
		type: 'Poison'
	},
	/******************************************************************
	Flying moves:
	- now a bit better

	Justification:
	- Flying has always been the type that's suffered from limited
	  distribution. Let's see how it does without that disadvantage.
	******************************************************************/
	twister: {
		inherit: true,
		basePower: 80,
		secondary: {
			chance: 30,
			volatileStatus: 'confusion'
		},
		pp: 15,
		type: "Flying"
	},
	/******************************************************************
	Signature moves and other moves with limited distribution:
	- buffed in various ways

	Justification:
	- more metagame variety is always good
	******************************************************************/
	twineedle: {
		inherit: true,
		basePower: 50
	},
	drillpeck: {
		inherit: true,
		basePower: 100,
		pp: 10
	},
	attackorder: {
		inherit: true,
		basePower: 100,
		pp: 10
	},
	smog: {
		inherit: true,
		basePower: 75,
		secondary: {
			chance: 30,
			status: 'psn'
		}
	},
	octazooka: {
		inherit: true,
		basePower: 75,
		accuracy: 90,
		secondary: {
			chance: 100,
			boosts: {
				accuracy: -1
			}
		}
	},
	leaftornado: {
		inherit: true,
		basePower: 75,
		accuracy: 90,
		secondary: {
			chance: 100,
			boosts: {
				accuracy: -1
			}
		}
	},
	muddywater: {
		inherit: true,
		basePower: 85,
		accuracy: 100,
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1
			}
		}
	},
	triattack: {
		num: 161,
		accuracy: true,
		basePower: 30,
		category: "Special",
		desc: "Hits 3 times. Has a 10% chance to burn, paralyze or freeze the target each time.",
		shortDesc: "hits 3x; 10% chance to paralyze/burn/freeze.",
		id: "triattack",
		name: "Tri Attack",
		pp: 10,
		isViable: true,
		priority: 0,
		multihit: [3,3],
		secondary: {
			chance: 10,
			onHit: function(target, source) {
				var result = this.random(3);
				if (result===0) {
					target.trySetStatus('brn', source);
				} else if (result===1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('frz', source);
				}
			}
		},
		target: "normal",
		type: "Normal"
	}
};
