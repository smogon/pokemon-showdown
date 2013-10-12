exports.BattleMovedex = {
	acidarmor: {
		inherit: true,
		pp: 40
	},
	aircutter: {
		inherit: true,
		basePower: 55
	},
	assurance: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function(pokemon, target) {
			if (pokemon.volatiles.assurance && pokemon.volatiles.assurance.hurt) {
				this.debug('Boosted for being damaged this turn');
				return 100;
			}
			return 50;
		}
	},
	aurasphere: {
		inherit: true,
		basePower: 90
	},
	barrier: {
		inherit: true,
		pp: 30
	},
	blizzard: {
		inherit: true,
		basePower: 120
	},
	bubble: {
		inherit: true,
		basePower: 20
	},
	charm: {
		inherit: true,
		type: "Normal"
	},
	chatter: {
		inherit: true,
		basePower: 60
	},
	cottonspore: {
		inherit: true,
		onTryHit: function() {}
	},
	dragonpulse: {
		inherit: true,
		basePower: 90
	},
	energyball: {
		inherit: true,
		basePower: 80
	},
	extrasensory: {
		inherit: true,
		pp: 30
	},
	fireblast: {
		inherit: true,
		basePower: 120
	},
	firepledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect in {grasspledge:1, waterpledge:1}) {
				this.add('-combine');
				this.debug('triple damage');
				return 150;
			}
			return 50;
		}
	},
	flamethrower: {
		inherit: true,
		basePower: 95
	},
	frostbreath: {
		inherit: true,
		basePower: 40
	},
	furycutter: {
		inherit: true,
		basePower: 20
	},
	futuresight: {
		inherit: true,
		basePower: 100,
		onTryHit: function(target, source) {
			source.side.addSideCondition('futuremove');
			if (source.side.sideConditions['futuremove'].positions[source.position]) {
				return false;
			}
			source.side.sideConditions['futuremove'].positions[source.position] = {
				duration: 3,
				move: 'futuresight',
				targetPosition: target.position,
				source: source,
				moveData: {
					basePower: 100,
					category: "Special",
					affectedByImmunities: true,
					type: 'Psychic'
				}
			};
			this.add('-start', source, 'move: Future Sight');
			return null;
		}
	},
	glare: {
		inherit: true,
		accuracy: 90
	},
	grasspledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect in {waterpledge:1, firepledge:1}) {
				this.add('-combine');
				this.debug('triple damage');
				return 150;
			}
			return 50;
		}
	},
	gunkshot: {
		inherit: true,
		accuracy: 70
	},
	heatwave: {
		inherit: true,
		basePower: 100
	},
	hiddenpower: {
		inherit: true,
		basePower: 0,
		basePowerCallback: function(pokemon) {
			return pokemon.hpPower || 70;
		}
	},
	hiddenpowerbug: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerdark: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerdragon: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerelectric: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerfairy: null,
	hiddenpowerfighting: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerfire: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerflying: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerghost: {
		inherit: true,
		basePower: 70
	},
	hiddenpowergrass: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerground: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerice: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerpoison: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerpsychic: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerrock: {
		inherit: true,
		basePower: 70
	},
	hiddenpowersteel: {
		inherit: true,
		basePower: 70
	},
	hiddenpowerwater: {
		inherit: true,
		basePower: 70
	},
	hurricane: {
		inherit: true,
		basePower: 120
	},
	hydropump: {
		inherit: true,
		basePower: 120
	},
	icebeam: {
		inherit: true,
		basePower: 95
	},
	incinerate: {
		inherit: true,
		desc: "Deals damage to all adjacent foes and destroys any Berry they may be holding.",
		shortDesc: "Destroys the foe(s) Berry.",
		onHit: function(pokemon, source) {
			var item = pokemon.getItem();
			if (item.isBerry && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		}
	},
	knockoff: {
		inherit: true,
		basePower: 20
	},
	leafstorm: {
		inherit: true,
		basePower: 140
	},
	lick: {
		inherit: true,
		basePower: 20
	},
	lowsweep: {
		inherit: true,
		basePower: 60
	},
	minimize: {
		inherit: true,
		pp: 20
	},
	moonlight: {
		inherit: true,
		type: "Normal"
	},
	muddywater: {
		inherit: true,
		basePower: 95
	},
	overheat: {
		inherit: true,
		basePower: 140
	},
	pinmissile: {
		inherit: true,
		accuracy: 85,
		basePower: 14
	},
	poisongas: {
		inherit: true,
		accuracy: 80
	},
	rocktomb: {
		inherit: true,
		accuracy: 80,
		basePower: 50,
		pp: 10
	},
	skullbash: {
		inherit: true,
		basePower: 100,
		pp: 15
	},
	smog: {
		inherit: true,
		basePower: 20
	},
	snore: {
		inherit: true,
		basePower: 40
	},
	spore: {
		inherit: true,
		onTryHit: function() {}
	},
	stormthrow: {
		inherit: true,
		basePower: 40
	},
	strugglebug: {
		inherit: true,
		basePower: 30
	},
	stunspore: {
		inherit: true,
		onTryHit: function() {}
	},
	surf: {
		inherit: true,
		basePower: 95
	},
	sweetkiss: {
		inherit: true,
		type: "Normal"
	},
	thief: {
		inherit: true,
		basePower: 40
	},
	thunder: {
		inherit: true,
		basePower: 120
	},
	thunderbolt: {
		inherit: true,
		basePower: 95
	},
	vinewhip: {
		inherit: true,
		basePower: 35,
		pp: 15
	},
	waterpledge: {
		inherit: true,
		basePower: 50,
		basePowerCallback: function(target, source, move) {
			if (move.sourceEffect in {firepledge:1, grasspledge:1}) {
				this.add('-combine');
				this.debug('triple damage');
				return 150;
			}
			return 50;
		}
	},
	willowisp: {
		inherit: true,
		accuracy: 75
	}
};
