export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	ragingbull: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Tauros-Paldea-Combat':
				move.type = 'Fighting';
				break;
			case 'Tauros-Paldea-Blaze':
			case 'Golisoros-Paldea-Blaze':
				move.type = 'Fire';
				break;
			case 'Tauros-Paldea-Aqua':
				move.type = 'Water';
				break;
			}
		},
	},
	dive: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (attacker.hasAbility('prehistorichunter') && attacker.species.name === 'Scream Cormorant' && !attacker.transformed) {
				const forme = attacker.hp <= attacker.maxhp / 2 ? 'screamcormorantgorging' : 'screamcormorantgulping';
				attacker.formeChange(forme, move);
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	darkvoid: {
		inherit: true,
		onTry(source, target, move) {
			if (source.species.name === 'Icekrai' || move.hasBounced) {
				return;
			}
			this.add('-fail', source, 'move: Dark Void');
			this.hint("Only a Pokemon whose form is Darkrai or a fusion thereof can use this move.");
			return null;
		},
	},
	aromatherapy: {
		inherit: true,
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Aromatherapy');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if ((ally === source || !(ally.hasAbility(['sapsipper', 'pondweed', 'lawnmowerofruin', 'firedrinker']) ||
					(ally.volatiles['substitute'] && !move.infiltrates))) && ally.cureStatus()) {
					success = true;
				}
			}
			return !!success;
		},
	},
	autotomize: {
		inherit: true,
		onTryHit(pokemon) {
			if (pokemon.boosts.spe === (pokemon.hasAbility(['contrary', 'unfiltered']) ? -6 : 6)) {
				return false;
			}
		},
	},
	partingshot: {
		inherit: true,
		onHit(target, source, move) {
			const success = this.boost({ atk: -1, spa: -1 }, target, source);
			if (!success && !target.hasAbility(['mirrorarmor', 'hourglass'])) {
				delete move.selfSwitch;
			}
		},
	},
	smackdown: {
		inherit: true,
		condition: {
			noCopy: true,
			onStart(pokemon) {
				let applies = !(!(pokemon.hasType('Flying') ||
					pokemon.hasAbility([
						'levitate', 'airbornearmor', 'aircontrol', 'holygrail', 'risingtension', 'freeflight', 'hellkite',
						'honeymoon', 'aircontrol', 'magnetize', 'unidentifiedflyingobject', 'anointed'])) ||
						pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] || this.field.getPseudoWeather('gravity'));
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
				}
				if (pokemon.volatiles['magnetrise']) {
					applies = true;
					delete pokemon.volatiles['magnetrise'];
				}
				if (pokemon.volatiles['telekinesis']) {
					// applies = true;
					delete pokemon.volatiles['telekinesis'];
				} else if (!applies) return false;
				this.add('-start', pokemon, 'Smack Down');
			},
			onRestart(pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
					this.add('-start', pokemon, 'Smack Down');
				}
			},
		},
	},
	switcheroo: {
		inherit: true,
		onTryImmunity(target) {
			return !target.hasAbility(['stickyhold', 'armourlock', 'moltenglue']);
		},
	},
	trick: {
		inherit: true,
		onTryImmunity(target) {
			return !target.hasAbility(['stickyhold', 'armourlock', 'moltenglue']);
		},
	},
	rest: {
		inherit: true,
		onTry(source) {
			if (source.status === 'slp' || source.hasAbility('comatose')) return false;

			if (source.hp === source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
			if (source.hasAbility(['insomnia', 'vitalspirit', 'unvital', 'vitalmetalbody'])) {
				this.add('-fail', source, '[from] ability: ' + source.getAbility().name, `[of] ${source}`);
				return null;
			}
		},
	},
	boltbeak: {
		inherit: true,
		isNonstandard: null,
	},
	oblivionwing: {
		inherit: true,
		isNonstandard: null,
	},
	headcharge: {
		inherit: true,
		isNonstandard: null,
	},
	trickortreat: {
		inherit: true,
		isNonstandard: null,
	},
	plasmafists: {
		inherit: true,
		isNonstandard: null,
	},
	anchorshot: {
		inherit: true,
		isNonstandard: null,
	},
	purify: {
		inherit: true,
		isNonstandard: null,
	},
	spectralthief: {
		inherit: true,
		isNonstandard: null,
	},
	naturesmadness: {
		inherit: true,
		isNonstandard: null,
	},
	fishiousrend: {
		inherit: true,
		isNonstandard: null,
	},
	kingsshield: {
		inherit: true,
		isNonstandard: null,
	},
	vcreate: {
		inherit: true,
		isNonstandard: null,
	},
	searingshot: {
		inherit: true,
		isNonstandard: null,
	},
	ivycudgel: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Hattepon-Wellspring': case 'Hattepon-Wellspring-Tera':
			case 'Ogerpon-Wellspring': case 'Ogerpon-Wellspring-Tera':
				move.type = 'Water';
				break;
			case 'Hattepon-Hearthflame': case 'Hattepon-Hearthflame-Tera':
			case 'Ogerpon-Hearthflame': case 'Ogerpon-Hearthflame-Tera':
				move.type = 'Fire';
				break;
			case 'Hattepon-Cornerstone': case 'Hattepon-Cornerstone-Tera':
			case 'Ogerpon-Cornerstone': case 'Ogerpon-Cornerstone-Tera':
				move.type = 'Rock';
				break;
			}
		},
	},
	mistyterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable() ||
					(['psn', 'tox'].includes(status.id) && source?.hasAbility('miasma'))) return;
				if (((effect as Move).status || effect?.id === 'yawn')) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onTryAddVolatile(status, target, source, effect) {
				if (target.isGrounded() && !target.isSemiInvulnerable() && status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
	},
};
