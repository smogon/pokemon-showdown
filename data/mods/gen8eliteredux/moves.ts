// TODO: Make Gastro Acid only disable ability, not innates
//TODO: Implement Shield Dust entry hazard immunity
export const Moves: {[k: string]: ModdedMoveData} = {
	aeroblast: {
		inherit: true,
		isNonstandard: null,
	},
	allyswitch: {
		inherit: true,
		stallingMove: false,
		onPrepareHit() {},
		onHit(pokemon) {
			const newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
			if (!pokemon.side.active[newPosition]) return false;
			if (pokemon.side.active[newPosition].fainted) return false;
			this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
		},
	},
	anchorshot: {
		inherit: true,
		isNonstandard: null,
	},
	aquafang: {
		inherit: true,
		isNonstandard: null,
		gen: 8,
	},
	aquaring: {
		inherit: true, 
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 8);
			},
		},
		desc: "The user has 1/8 of its maximum HP, rounded down, restored at the end of each turn while it remains active. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. If the user uses Baton Pass, the replacement will receive the healing effect.",
		shortDesc: "User recovers 1/8 max HP per turn.",

	},
	aromatherapy: {
		inherit: true,
		isNonstandard: null,
	},
	assist: {
		inherit: true,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	attract: {
		inherit: true, 
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.name === 'Cute Charm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', '[of] ' + source);
				} else if (effect.name === 'Destiny Knot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', '[of] ' + source);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
					this.debug('Removing Attract volatile on ' + pokemon);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
		onTryImmunity(target, source) {
			return (target.gender === 'M' && source.gender === 'F') || (target.gender === 'F' && source.gender === 'M');
		},

	},
	aurawheel: {
		inherit: true,
		isNonstandard: null,
	},
	auroraveil: {
		inherit: true,
		onTry() {
			return this.field.isWeather('hail');
		},
	},
	autotomize: {
		inherit: true,
		isNonstandard: null,
	},
	belch: {
		inherit: true,
		flags: {protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	blizzard: {
		inherit: true,
		onModifyMove(move) {
			if (this.field.isWeather('hail')) move.accuracy = true;
		},
	},
	blueflare: {
		inherit: true,
		isNonstandard: null,
	},
	boltbeak: {
		inherit: true,
		isNonstandard: null,
	},
	boltstrike: {
		inherit: true,
		isNonstandard: null,
	},
	bonemerang: {
		inherit: true,
		isNonstandard: null,
	},
	celebrate: {
		inherit: true,
		flags: {nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	charge: {
		inherit: true,
		condition: {
			onStart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Charge');
			},
			onRestart(pokemon, source, effect) {
				this.add('-start', pokemon, 'Charge');
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.id !== 'charge') {
					pokemon.removeVolatile('charge');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.id !== 'charge') {
					pokemon.removeVolatile('charge');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Charge', '[silent]');
			},
		},
	},
	chatter: {
		inherit: true,
		flags: {
			protect: 1, mirror: 1, sound: 1, distance: 1, bypasssub: 1,
			noassist: 1, failcopycat: 1, failinstruct: 1, failmefirst: 1, nosleeptalk: 1, failmimic: 1,
		},
	},
	clangingscales: {
		inherit: true,
		isNonstandard: null,
	},
	clangoroussoul: {
		inherit: true,
		isNonstandard: null,
	},
	conversion: {
		inherit: true,
		isNonstandard: null,
	},
	conversion2: {
		inherit: true,
		isNonstandard: null,
	},
	copycat: {
		inherit: true,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	coreenforcer: {
		inherit: true,
		isNonstandard: null,
	},
	cosmicpower: {
		inherit: true,
		isNonstandard: null,
	},
	craftyshield: {
		inherit: true,
		isNonstandard: null,
	},
	crushgrip: {
		inherit: true,
		isNonstandard: null,
	},
	curse: {
		inherit: true,
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				move.target = move.nonGhostTarget as MoveTarget;
			}
		},
		target: "randomNormal",
	},
	deathroll: {
		inherit: true,
		isNonstandard: null,
		gen: 8,
	},
	decorate: {
		inherit: true,
		isNonstandard: null,
	},
	doomdesire: {
		inherit: true,
		isNonstandard: null,
	},
	doubleironbash: {
		inherit: true,
		isNonstandard: null,
	},
	dragonhammer: {
		inherit: true,
		isNonstandard: null,
	},
	dualchop: {
		inherit: true,
		isNonstandard: null,
	},
	electrify: {
		inherit: true,
		isNonstandard: null,
	},
	eternabeam: {
		inherit: true,
		flags: {recharge: 1, protect: 1, mirror: 1, failinstruct: 1},
		isNonstandard: null,
	},
	excalibur: {
		inherit: true,
		isNonstandard: null,
		gen: 8,
	},
	fishiousrend: {
		inherit: true,
		isNonstandard: null,
	},
	floralhealing: {
		inherit: true,
		isNonstandard: null,
	},
	flowershield: {
		inherit: true,
		isNonstandard: null,
	},
	fly: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}

			// In SwSh, Fly's animation leaks the initial target through a camera focus
			// The animation leak target itself isn't "accurate"; the target it reveals is as if Fly weren't a charge movee
			// (Fly, like all other charge moves, will actually target slots on its charging turn, relevant for things like Follow Me)
			// We use a generic single-target move to represent this
			if (this.gameType === 'doubles' || this.gameType === 'multi') {
				const animatedTarget = attacker.getMoveTargets(this.dex.getActiveMove('aerialace'), defender).targets[0];
				if (animatedTarget) {
					this.hint(`${move.name}'s animation targeted ${animatedTarget.name}`);
				}
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
	},
	forestscurse: {
		inherit: true,
		isNonstandard: null,
	},
	freezeshock: {
		inherit: true,
		isNonstandard: null,
	},
	fusionbolt: {
		inherit: true,
		isNonstandard: null,
	},
	fusionflare: {
		inherit: true,
		isNonstandard: null,
	},
	futuresight: {
		inherit: true,
		flags: {futuremove: 1},
	},
	geargrind: {
		inherit: true,
		isNonstandard: null,
	},
	gearup: {
		inherit: true,
		isNonstandard: null,
	},
	geomancy: {
		inherit: true,
		isNonstandard: null,
	},
	glaciallance: {
		inherit: true,
		basePower: 130,
	},
	glaciate: {
		inherit: true,
		isNonstandard: null,
	},
	grassyglide: {
		inherit: true,
		basePower: 70,
	},
	grudge: {
		inherit: true,
		isNonstandard: null,
	},
	hail: {
		inherit: true,
		isNonstandard: null,
	},
	headcharge: {
		inherit: true,
		isNonstandard: null,
	},
	healbell: {
		inherit: true,
		isNonstandard: null,
	},
	heartswap: {
		inherit: true,
		isNonstandard: null,
	},
	hiddenpower: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerbug: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerdark: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerdragon: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerelectric: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerfighting: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerfire: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerflying: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerghost: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowergrass: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerground: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerice: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerpoison: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerpsychic: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerrock: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowersteel: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	hiddenpowerwater: {
      inherit: true,
      basePower: 70,
		isNonstandard: null,
		gen: 8,
	},
	holdhands: {
		inherit: true,
		flags: {bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	hyperspacefury: {
		inherit: true,
		isNonstandard: null,
	},
	hyperspacehole: {
		inherit: true,
		isNonstandard: null,
	},
	iceburn: {
		inherit: true,
		isNonstandard: null,
	},
	icehammer: {
		inherit: true,
		isNonstandard: null,
	},
	judgment: {
		inherit: true,
		isNonstandard: null,
	},
	kinesis: {
		inherit: true,
		isNonstandard: null,
	},
	landswrath: {
		inherit: true,
		isNonstandard: null,
	},
	laserfocus: {
		inherit: true,
		isNonstandard: null,
	},
	leaftornado: {
		inherit: true,
		isNonstandard: null,
	},
	lovelykiss: {
		inherit: true,
		isNonstandard: null,
	},
	lusterpurge: {
		inherit: true,
		isNonstandard: null,
	},
	magiccoat: {
		inherit: true,
		isNonstandard: null,
	},
	matblock: {
		inherit: true,
		isNonstandard: null,
	},
	maxairstream: {
		inherit: true,
		isNonstandard: null,
	},
	maxdarkness: {
		inherit: true,
		isNonstandard: null,
	},
	maxflare: {
		inherit: true,
		isNonstandard: null,
	},
	maxflutterby: {
		inherit: true,
		isNonstandard: null,
	},
	maxgeyser: {
		inherit: true,
		isNonstandard: null,
	},
	maxguard: {
		inherit: true,
		isNonstandard: null,
	},
	maxhailstorm: {
		inherit: true,
		isNonstandard: null,
	},
	maxknuckle: {
		inherit: true,
		isNonstandard: null,
	},
	maxlightning: {
		inherit: true,
		isNonstandard: null,
	},
	maxmindstorm: {
		inherit: true,
		isNonstandard: null,
	},
	maxooze: {
		inherit: true,
		isNonstandard: null,
	},
	maxovergrowth: {
		inherit: true,
		isNonstandard: null,
	},
	maxphantasm: {
		inherit: true,
		isNonstandard: null,
	},
	maxquake: {
		inherit: true,
		isNonstandard: null,
	},
	maxrockfall: {
		inherit: true,
		isNonstandard: null,
	},
	maxstarfall: {
		inherit: true,
		isNonstandard: null,
	},
	maxsteelspike: {
		inherit: true,
		isNonstandard: null,
	},
	maxstrike: {
		inherit: true,
		isNonstandard: null,
	},
	maxwyrmwind: {
		inherit: true,
		isNonstandard: null,
	},
	mefirst: {
		inherit: true,
		flags: {
			protect: 1, bypasssub: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1,
		},
	},
	meteorassault: {
		inherit: true,
		isNonstandard: null,
	},
	metronome: {
		inherit: true,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	milkdrink: {
		inherit: true,
		pp: 10,
	},
	mindblown: {
		inherit: true,
		isNonstandard: null,
	},
	mindreader: {
		inherit: true,
		isNonstandard: null,
	},
	mirrorcoat: {
		inherit: true,
		flags: {protect: 1, failmefirst: 1, noassist: 1, failcopycat: 1},
	},
	mirrormove: {
		inherit: true,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	mistball: {
		inherit: true,
		isNonstandard: null,
	},
	moongeistbeam: {
		inherit: true,
		isNonstandard: null,
	},
	multiattack: {
		inherit: true,
		isNonstandard: null,
	},
	naturepower: {
		inherit: true,
		isNonstandard: null,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	naturesmadness: {
		inherit: true,
		isNonstandard: null,
	},
	oblivionwing: {
		inherit: true,
		isNonstandard: null,
	},
	obstruct: {
		inherit: true,
		isNonstandard: null,
	},
	octazooka: {
		inherit: true,
		isNonstandard: null,
	},
	octolock: {
		inherit: true,
		isNonstandard: null,
	},
	photongeyser: {
		inherit: true,
		isNonstandard: null,
	},
	plasmafists: {
		inherit: true,
		isNonstandard: null,
	},
	poweruppunch: {
		inherit: true,
		isNonstandard: null,
	},
	prismaticlaser: {
		inherit: true,
		isNonstandard: null,
	},
	psychoshift: {
		inherit: true,
		isNonstandard: null,
	},
	purify: {
		inherit: true,
		isNonstandard: null,
	},
	pursuit: {
		inherit: true,
		isNonstandard: null,
		gen: 8,
	},
	recover: {
		inherit: true,
		pp: 10,
	},
	relicsong: {
		inherit: true,
		isNonstandard: null,
	},
	rest: {
		inherit: true,
		pp: 10,
	},
	revelationdance: {
		inherit: true,
		isNonstandard: null,
	},
	revenge: {
		inherit: true,
		isNonstandard: null,
	},
	rockwrecker: {
		inherit: true,
		isNonstandard: null,
	},
	roost: {
		inherit: true,
		pp: 10,
	},
	sacredfire: {
		inherit: true,
		isNonstandard: null,
	},
	searingshot: {
		inherit: true,
		isNonstandard: null,
	},
	secretsword: {
		inherit: true,
		isNonstandard: null,
	},
	shadowbone: {
		inherit: true,
		isNonstandard: null,
	},
	shelltrap: {
		inherit: true,
		isNonstandard: null,
	},
	shoreup: {
		inherit: true,
		pp: 10,
	},
	simplebeam: {
		inherit: true,
		isNonstandard: null,
	},
	skullbash: {
		inherit: true,
		isNonstandard: null,
	},
	slackoff: {
		inherit: true,
		pp: 10,
	},
	sleeptalk: {
		inherit: true,
		flags: {failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1},
	},
	snaptrap: {
		inherit: true,
		isNonstandard: null,
	},
	softboiled: {
		inherit: true,
		pp: 10,
	},
	sparklingaria: {
		inherit: true,
		isNonstandard: null,
	},
	spectralthief: {
		inherit: true,
		isNonstandard: null,
	},
	stormthrow: {
		inherit: true,
		isNonstandard: null,
	},
	strangesteam: {
		inherit: true,
		isNonstandard: null,
	},
	submission: {
		inherit: true,
		isNonstandard: null,
	},
	sunsteelstrike: {
		inherit: true,
		isNonstandard: null,
	},
	technoblast: {
		inherit: true,
		isNonstandard: null,
	},
	thousandarrows: {
		inherit: true,
		isNonstandard: null,
	},
	thousandwaves: {
		inherit: true,
		isNonstandard: null,
	},
	topsyturvy: {
		inherit: true,
		isNonstandard: null,
	},
	trickortreat: {
		inherit: true,
		isNonstandard: null,
	},
	triplekick: {
		inherit: true,
		isNonstandard: null,
	},
	venomdrench: {
		inherit: true,
		isNonstandard: null,
	},
	vitalthrow: {
		inherit: true,
		isNonstandard: null,
	},
	wavecrash: {
		inherit: true,
		isNonstandard: null,
		gen: 8,
	},
	wickedblow: {
		inherit: true,
		basePower: 80,
	},
	"10000000voltthunderbolt": {
		inherit: true,
		isNonstandard: null,
	},
	aciddownpour: {
		inherit: true,
		isNonstandard: null,
	},
	alloutpummeling: {
		inherit: true,
		isNonstandard: null,
	},
	baddybad: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
	},
	barrage: {
		inherit: true,
		isNonstandard: null,
	},
	barrier: {
		inherit: true,
		isNonstandard: null,
	},
	beakblast: {
		inherit: true,
		isNonstandard: null,
	},
	bestow: {
		inherit: true,
		isNonstandard: null,
	},
	bide: {
		inherit: true,
		isNonstandard: null,
	},
	blackholeeclipse: {
		inherit: true,
		isNonstandard: null,
	},
	bloomdoom: {
		inherit: true,
		isNonstandard: null,
	},
	boneclub: {
		inherit: true,
		isNonstandard: null,
	},
	bouncybubble: {
		inherit: true,
		basePower: 90,
		pp: 15,
	},
	breakneckblitz: {
		inherit: true,
		isNonstandard: null,
	},
	bubble: {
		inherit: true,
		isNonstandard: null,
	},
	buzzybuzz: {
		inherit: true,
		basePower: 90,
		pp: 15,
	},
	camouflage: {
		inherit: true,
		isNonstandard: null,
	},
	captivate: {
		inherit: true,
		isNonstandard: null,
	},
	catastropika: {
		inherit: true,
		isNonstandard: null,
	},
	chipaway: {
		inherit: true,
		isNonstandard: null,
	},
	clamp: {
		inherit: true,
		isNonstandard: null,
	},
	clangoroussoulblaze: {
		inherit: true,
		isNonstandard: null,
	},
	cometpunch: {
		inherit: true,
		isNonstandard: null,
	},
	constrict: {
		inherit: true,
		isNonstandard: null,
	},
	continentalcrush: {
		inherit: true,
		isNonstandard: null,
	},
	corkscrewcrash: {
		inherit: true,
		isNonstandard: null,
	},
	darkvoid: {
		inherit: true,
		isNonstandard: null,
	},
	defog: {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
			];
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb'];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
					success = true;
				}
			}
			return success;
		},
	},
	devastatingdrake: {
		inherit: true,
		isNonstandard: null,
	},
	dive: {
		inherit: true,
		flags: {contact: 1, charge: 1, protect: 1, mirror: 1, nonsky: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1},
	},
	dizzypunch: {
		inherit: true,
		isNonstandard: null,
	},
	doubleslap: {
		inherit: true,
		isNonstandard: null,
	},
	dragonrage: {
		inherit: true,
		isNonstandard: null,
	},
	eggbomb: {
		inherit: true,
		isNonstandard: null,
	},
	electricterrain: {
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
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Electric Terrain');
					}
					return false;
				}
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
	},
	embargo: {
		inherit: true,
		isNonstandard: null,
	},
	extremeevoboost: {
		inherit: true,
		isNonstandard: null,
	},
	feintattack: {
		inherit: true,
		isNonstandard: null,
	},
	flameburst: {
		inherit: true,
		isNonstandard: null,
	},
	flash: {
		inherit: true,
		isNonstandard: null,
	},
	foresight: {
		inherit: true,
		isNonstandard: null,
	},
	freezyfrost: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
	},
	frustration: {
		inherit: true,
		isNonstandard: null,
	},
	genesissupernova: {
		inherit: true,
		isNonstandard: null,
	},
	gigavolthavoc: {
		inherit: true,
		isNonstandard: null,
	},
	glitzyglow: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
	},
	grassknot: {
		inherit: true,
		onTryHit() {},
	},
	grasswhistle: {
		inherit: true,
		isNonstandard: null,
	},
	grassyterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
				} else {
					this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
	},
	guardianofalola: {
		inherit: true,
		isNonstandard: null,
	},
	healblock: {
		inherit: true,
		isNonstandard: null,
	},
	healingwish: {
		inherit: true,
		condition: {
			duration: 2,
			onSwitchInPriority: 1,
			onSwitchIn(target) {
				if (!target.fainted) {
					target.heal(target.maxhp);
					target.clearStatus();
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					target.side.removeSlotCondition(target, 'healingwish');
				}
			},
		},
	},
	healorder: {
		inherit: true,
		isNonstandard: null,
	},
	healpulse: {
		inherit: true,
		onHit(target, source) {
			let success = false;
			if (source.hasAbility('megalauncher')) {
				success = !!this.heal(this.modify(target.baseMaxhp, 0.75));
			} else {
				success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
			}
			if (success && !target.isAlly(source)) {
				target.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', target, 'heal');
				return null;
			}
			return success;
		},
	},
	heartstamp: {
		inherit: true,
		isNonstandard: null,
	},
	heatcrash: {
		inherit: true,
		onTryHit() {},
	},
	heavyslam: {
		inherit: true,
		onTryHit() {},
	},
	howl: {
		inherit: true,
		isNonstandard: null,
	},
	hydrovortex: {
		inherit: true,
		isNonstandard: null,
	},
	hyperfang: {
		inherit: true,
		isNonstandard: null,
	},
	iceball: {
		inherit: true,
		isNonstandard: null,
	},
	infernooverdrive: {
		inherit: true,
		isNonstandard: null,
	},
	iondeluge: {
		inherit: true,
		isNonstandard: null,
	},
	ironfangs: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	jaggedfangs: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	jumpkick: {
		inherit: true,
		isNonstandard: null,
	},
	karatechop: {
		inherit: true,
		isNonstandard: null,
	},
	kingsshield: {
		inherit: true,
		isNonstandard: null,
	},
	letssnuggleforever: {
		inherit: true,
		isNonstandard: null,
	},
	lightofruin: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lightthatburnsthesky: {
		inherit: true,
		isNonstandard: null,
	},
	lovelybite: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	lowkick: {
		inherit: true,
		onTryHit() {},
	},
	luckychant: {
		inherit: true,
		isNonstandard: null,
	},
	lunardance: {
		inherit: true,
		condition: {
			duration: 2,
			onSwitchInPriority: 1,
			onSwitchIn(target) {
				if (!target.fainted) {
					target.heal(target.maxhp);
					target.clearStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSlotCondition(target, 'lunardance');
				}
			},
		},
	},
	magnetbomb: {
		inherit: true,
		isNonstandard: null,
	},
	magnitude: {
		inherit: true,
		isNonstandard: null,
	},
	maliciousmoonsault: {
		inherit: true,
		isNonstandard: null,
	},
	meditate: {
		inherit: true,
		isNonstandard: null,
	},
	menacingmoonrazemaelstrom: {
		inherit: true,
		isNonstandard: null,
	},
	miracleeye: {
		inherit: true,
		isNonstandard: null,
	},
	mirrorshot: {
		inherit: true,
		isNonstandard: null,
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	mudbomb: {
		inherit: true,
		isNonstandard: null,
	},
	mudsport: {
		inherit: true,
		isNonstandard: null,
	},
	naturalgift: {
		inherit: true,
		isNonstandard: null,
	},
	needlearm: {
		inherit: true,
		isNonstandard: null,
	},
	neverendingnightmare: {
		inherit: true,
		isNonstandard: null,
	},
	nightmare: {
		inherit: true,
		isNonstandard: null,
	},
	oceanicoperetta: {
		inherit: true,
		isNonstandard: null,
	},
	odorsleuth: {
		inherit: true,
		isNonstandard: null,
	},
	ominouswind: {
		inherit: true,
		isNonstandard: null,
	},
	outburst: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	pollenpuff: {
		inherit: true,
		flags: {bullet: 1, protect: 1, mirror: 1},
		onHit(target, source) {
			if (source.isAlly(target)) {
				if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
					this.add('-immune', target);
					return null;
				}
			}
		},
	},
	powder: {
		inherit: true,
		isNonstandard: null,
	},
	precipiceblades: {
		inherit: true,
		isNonstandard: null,
	},
	psychicterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
					return;
				}
				if (target.isSemiInvulnerable() || target.isAlly(source)) return;
				if (!target.isGrounded()) {
					const baseMove = this.dex.moves.get(effect.id);
					if (baseMove.priority > 0) {
						this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
					}
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify(1.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Psychic Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
			},
		},
	},
	psychoboost: {
		inherit: true,
		isNonstandard: null,
	},
	psywave: {
		inherit: true,
		isNonstandard: null,
	},
	pulverizingpancake: {
		inherit: true,
		isNonstandard: null,
	},
	punishment: {
		inherit: true,
		isNonstandard: null,
	},
	quash: {
		inherit: true,
		onHit(target) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(target);
			if (!action) return false;

			action.priority = -7.1;
			this.queue.cancelMove(target);
			for (let i = this.queue.list.length - 1; i >= 0; i--) {
				if (this.queue.list[i].choice === 'residual') {
					this.queue.list.splice(i, 0, action);
					break;
				}
			}
			this.add('-activate', target, 'move: Quash');
		},
	},
	rage: {
		inherit: true,
		isNonstandard: null,
	},
	rapidspin: {
		inherit: true,
		basePower: 60,
	},
	razorwind: {
		inherit: true,
		isNonstandard: null,
	},
	refresh: {
		inherit: true,
		isNonstandard: null,
	},
	return: {
		inherit: true,
		isNonstandard: null,
	},
	rockclimb: {
		inherit: true,
		isNonstandard: null,
	},
	rollingkick: {
		inherit: true,
		isNonstandard: null,
	},
	rototiller: {
		inherit: true,
		isNonstandard: null,
	},
	sappyseed: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
	},
	savagespinout: {
		inherit: true,
		isNonstandard: null,
	},
	scorchedearth: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	searingsunrazesmash: {
		inherit: true,
		isNonstandard: null,
	},
	secretpower: {
		inherit: true,
		isNonstandard: null,
	},
	seedflare: {
		inherit: true,
		isNonstandard: null,
	},
	seismicfist: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	shadowfangs: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	sharpen: {
		inherit: true,
		isNonstandard: null,
	},
	shatteredpsyche: {
		inherit: true,
		isNonstandard: null,
	},
	signalbeam: {
		inherit: true,
		isNonstandard: null,
	},
	silverwind: {
		inherit: true,
		isNonstandard: null,
	},
	sinisterarrowraid: {
		inherit: true,
		isNonstandard: null,
	},
	sizzlyslide: {
		inherit: true,
		basePower: 90,
		pp: 15,
	},
	sketch: {
		inherit: true,
		isNonstandard: null,
	},
	skydrop: {
		inherit: true,
		isNonstandard: null,
	},
	skyuppercut: {
		inherit: true,
		isNonstandard: null,
	},
	smellingsalts: {
		inherit: true,
		isNonstandard: null,
	},
	smite: {
		inherit: true,
		isNonstandard: null,
		gen: 8
	},
	snatch: {
		inherit: true,
		isNonstandard: null,
	},
	sonicboom: {
		inherit: true,
		isNonstandard: null,
	},
	soulstealing7starstrike: {
		inherit: true,
		isNonstandard: null,
	},
	sparklyswirl: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
	},
	spiderweb: {
		inherit: true,
		isNonstandard: null,
	},
	spikecannon: {
		inherit: true,
		isNonstandard: null,
	},
	splinteredstormshards: {
		inherit: true,
		isNonstandard: null,
	},
	spotlight: {
		inherit: true,
		isNonstandard: null,
	},
	steamroller: {
		inherit: true,
		isNonstandard: null,
	},
	stokedsparksurfer: {
		inherit: true,
		isNonstandard: null,
	},
	subzeroslammer: {
		inherit: true,
		isNonstandard: null,
	},
	supersonicskystrike: {
		inherit: true,
		isNonstandard: null,
	},
	swallow: {
		inherit: true,
		onHit(pokemon) {
			const healAmount = [0.25, 0.5, 1];
			const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[(pokemon.volatiles['stockpile'].layers - 1)]));
			if (!success) this.add('-fail', pokemon, 'heal');
			pokemon.removeVolatile('stockpile');
			return success || null;
		},
	},
	switcheroo: {
		inherit: true,
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] ' + target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
			}
		},
	},
	synchronoise: {
		inherit: true,
		isNonstandard: null,
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return null;
			}
			return success;
		},
	},
	tailglow: {
		inherit: true,
		isNonstandard: null,
	},
	tectonicrage: {
		inherit: true,
		isNonstandard: null,
	},
	telekinesis: {
		inherit: true,
		isNonstandard: null,
	},
	teleport: {
		inherit: true,
	},
	toxic: {
		inherit: true,
		onPrepareHit(target, source, move) {
			if (source.hasType('Poison')) source.addVolatile('toxic');
		},
		condition: {
			noCopy: true,
			duration: 1,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(target, source, move) {
				if (move && source === this.effectState.target) return 0;
			},
			onSourceAccuracy(accuracy, target, source, move) {
				if (move && source === this.effectState.target) return true;
			},
		},
	},
	toxicthread: {
		inherit: true,
		isNonstandard: null,
	},
	trick: {
		inherit: true,
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', '[of] ' + target);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
			}
		},
	},
	trumpcard: {
		inherit: true,
		isNonstandard: null,
	},
	twineedle: {
		inherit: true,
		isNonstandard: null,
	},
	twinkletackle: {
		inherit: true,
		isNonstandard: null,
	},
	wakeupslap: {
		inherit: true,
		isNonstandard: null,
	},
	watershuriken: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			return move.basePower;
		},
	},
	watersport: {
		inherit: true,
		isNonstandard: null,
	},
	wringout: {
		inherit: true,
		isNonstandard: null,
	},
	zippyzap: {
		inherit: true,
		basePower: 50,
		pp: 15,
		willCrit: true,
		secondary: null,
	},
	gastroacid: {
		inherit: true,
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
				if (pokemon.m.innates) {
					for (const innate of pokemon.m.innates) {
						pokemon.removeVolatile("ability" + innate);
					}
				}
			},
		},
	},
};
