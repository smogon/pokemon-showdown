export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	absorb: {
		inherit: true,
		isNonstandard: "Past",
	},
	acid: {
		inherit: true,
		isNonstandard: "Past",
	},
	aeroblast: {
		inherit: true,
		isNonstandard: "Past",
	},
	anchorshot: {
		inherit: true,
		basePower: 90,
	},
	appleacid: {
		inherit: true,
		basePower: 90,
	},
	armthrust: {
		inherit: true,
		isNonstandard: "Past",
	},
	astonish: {
		inherit: true,
		isNonstandard: "Past",
	},
	astralbarrage: {
		inherit: true,
		basePower: 110,
		isNonstandard: "Past",
	},
	attackorder: {
		inherit: true,
		isNonstandard: "Past",
	},
	aurorabeam: {
		inherit: true,
		isNonstandard: "Past",
	},
	banefulbunker: {
		inherit: true,
		pp: 5,
	},
	barbbarrage: {
		inherit: true,
		isNonstandard: "Past",
	},
	beakblast: {
		inherit: true,
		basePower: 120,
		pp: 5,
	},
	belch: {
		inherit: true,
		onTry(source) {
			return source.ateBerry;
		},
		onDisableMove: undefined, // no inherit
		desc: "Fails unless the user has eaten a Berry, either by eating one that was held, stealing and eating one off another Pokemon with Bug Bite or Pluck, or eating one that was thrown at it with Fling. Once the condition is met, this move can be selected and used for the rest of the battle even if the user gains or uses another item or switches out. Consuming a Berry with Natural Gift does not count for the purposes of eating one.",
		shortDesc: "Fails unless the user has eaten a Berry.",
	},
	behemothbash: {
		inherit: true,
		isNonstandard: "Past",
	},
	behemothblade: {
		inherit: true,
		isNonstandard: "Past",
	},
	blazingtorque: {
		inherit: true,
		isNonstandard: "Past",
	},
	bleakwindstorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	bloodmoon: {
		inherit: true,
		basePower: 130,
		isNonstandard: "Past",
	},
	blueflare: {
		inherit: true,
		isNonstandard: "Past",
	},
	boltbeak: {
		inherit: true,
		basePower: 80,
	},
	boltstrike: {
		inherit: true,
		isNonstandard: "Past",
	},
	bonerush: {
		inherit: true,
		basePower: 30,
	},
	branchpoke: {
		inherit: true,
		isNonstandard: "Past",
	},
	brine: {
		inherit: true,
		isNonstandard: "Past",
	},
	bubblebeam: {
		inherit: true,
		isNonstandard: "Past",
	},
	burningbulwark: {
		inherit: true,
		isNonstandard: "Past",
	},
	burnup: {
		inherit: true,
		isNonstandard: null,
	},
	celebrate: {
		inherit: true,
		isNonstandard: "Past",
	},
	chloroblast: {
		inherit: true,
		isNonstandard: "Past",
	},
	clangoroussoul: {
		inherit: true,
		accuracy: true,
	},
	collisioncourse: {
		inherit: true,
		isNonstandard: "Past",
	},
	combattorque: {
		inherit: true,
		isNonstandard: "Past",
	},
	confide: {
		inherit: true,
		isNonstandard: "Past",
	},
	confusion: {
		inherit: true,
		isNonstandard: "Past",
	},
	conversion: {
		inherit: true,
		isNonstandard: "Past",
	},
	conversion2: {
		inherit: true,
		isNonstandard: "Past",
	},
	corrosivegas: {
		inherit: true,
		isNonstandard: null,
	},
	courtchange: {
		inherit: true,
		isNonstandard: "Past",
	},
	crabhammer: {
		inherit: true,
		accuracy: 95,
	},
	crushclaw: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
	},
	crushgrip: {
		inherit: true,
		isNonstandard: "Past",
	},
	cut: {
		inherit: true,
		isNonstandard: "Past",
	},
	darkvoid: {
		inherit: true,
		isNonstandard: "Past",
	},
	defendorder: {
		inherit: true,
		isNonstandard: "Past",
	},
	defensecurl: {
		inherit: true,
		isNonstandard: "Past",
	},
	diamondstorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	direclaw: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 30,
			onHit(target, source) {
				const status = this.sample(['psn', 'par', 'slp']);
				target.trySetStatus(status, source);
			},
		},
		desc: "Has a 30% chance to cause the target to either fall asleep, become poisoned, or become paralyzed.",
		shortDesc: "30% chance to sleep, poison, or paralyze target.",
	},
	disarmingvoice: {
		inherit: true,
		isNonstandard: "Past",
	},
	doodle: {
		inherit: true,
		isNonstandard: "Past",
	},
	doomdesire: {
		inherit: true,
		isNonstandard: "Past",
	},
	doublekick: {
		inherit: true,
		isNonstandard: "Past",
	},
	doubleshock: {
		inherit: true,
		isNonstandard: "Custom",
	},
	dragonascent: {
		inherit: true,
		isNonstandard: "Past",
	},
	dragonbreath: {
		inherit: true,
		isNonstandard: "Past",
	},
	dragoncheer: {
		inherit: true,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1, sound: 1 },
	},
	dragonclaw: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
	},
	dragonenergy: {
		inherit: true,
		isNonstandard: "Past",
	},
	dragonhammer: {
		inherit: true,
		basePower: 100,
		isNonstandard: "Past",
	},
	dreameater: {
		inherit: true,
		isNonstandard: "Past",
	},
	drumbeating: {
		inherit: true,
		isNonstandard: "Past",
	},
	dynamaxcannon: {
		inherit: true,
		isNonstandard: "Past",
	},
	echoedvoice: {
		inherit: true,
		isNonstandard: "Past",
	},
	electrify: {
		inherit: true,
		isNonstandard: null,
	},
	electrodrift: {
		inherit: true,
		isNonstandard: "Past",
	},
	ember: {
		inherit: true,
		isNonstandard: "Past",
	},
	encore: {
		inherit: true,
		condition: {
			inherit: true,
			onStart(target) {
				let move: Move | ActiveMove | null = target.lastMove;
				if (!move || target.volatiles['dynamax']) return false;

				// Encore only works on Max Moves if the base move is not itself a Max Move
				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
				const moveSlot = target.getMoveData(move.id);
				if (move.isZ || move.isMax || move.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = move.id;
				this.add('-start', target, 'Encore');
				const action = this.queue.willMove(target);
				if (!action) {
					this.effectState.duration!++;
					// TODO: this is a quick fix, check if move priority is changed when Mental Herb cures Encore
				} else if (!target.hasItem('mentalherb')) {
					this.queue.changeAction(target, {
						choice: 'move',
						// target: undefined,
						// targetLoc: undefined,
						moveid: move.id,
						order: action.order, // TODO: check Quash + Encore interaction
					});
				}
			},
		},
	},
	esperwing: {
		inherit: true,
		isNonstandard: "Past",
	},
	fairywind: {
		inherit: true,
		isNonstandard: "Past",
	},
	fakeout: {
		inherit: true,
		onDisableMove(pokemon) {
			if (pokemon.activeMoveActions > 1) {
				pokemon.disableMove('fakeout');
			}
		},
		desc: "Has a 100% chance to make the target flinch. This move cannot be selected unless it is the user's first turn on the field.",
	},
	falsesurrender: {
		inherit: true,
		isNonstandard: "Past",
	},
	falseswipe: {
		inherit: true,
		isNonstandard: "Past",
	},
	fierywrath: {
		inherit: true,
		isNonstandard: "Past",
	},
	filletaway: {
		inherit: true,
		isNonstandard: "Past",
	},
	firelash: {
		inherit: true,
		basePower: 90,
	},
	firepledge: {
		inherit: true,
		isNonstandard: "Past",
	},
	firstimpression: {
		inherit: true,
		basePower: 100,
	},
	fishiousrend: {
		inherit: true,
		basePower: 80,
	},
	flamewheel: {
		inherit: true,
		isNonstandard: "Past",
	},
	fleurcannon: {
		inherit: true,
		isNonstandard: "Past",
	},
	floralhealing: {
		inherit: true,
		isNonstandard: "Past",
	},
	forcepalm: {
		inherit: true,
		isNonstandard: "Past",
	},
	freezedry: {
		inherit: true,
		secondary: undefined, // no inherit
		desc: "This move's type effectiveness against Water is changed to be super effective no matter what this move's type is.",
		shortDesc: "Super effective on Water.",
	},
	freezeshock: {
		inherit: true,
		isNonstandard: "Past",
	},
	freezingglare: {
		inherit: true,
		isNonstandard: "Past",
	},
	furyattack: {
		inherit: true,
		isNonstandard: "Past",
	},
	furycutter: {
		inherit: true,
		isNonstandard: "Past",
	},
	furyswipes: {
		inherit: true,
		isNonstandard: "Past",
	},
	fusionbolt: {
		inherit: true,
		isNonstandard: "Past",
	},
	fusionflare: {
		inherit: true,
		isNonstandard: "Past",
	},
	geargrind: {
		inherit: true,
		accuracy: 90,
		basePower: 60,
	},
	glaciallance: {
		inherit: true,
		isNonstandard: "Past",
	},
	glaciate: {
		inherit: true,
		isNonstandard: "Past",
	},
	glaiverush: {
		inherit: true,
		isNonstandard: "Past",
	},
	grasspledge: {
		inherit: true,
		isNonstandard: "Past",
	},
	gravapple: {
		inherit: true,
		basePower: 90,
	},
	growl: {
		inherit: true,
		isNonstandard: "Past",
	},
	growth: {
		inherit: true,
		type: "Grass",
	},
	gust: {
		inherit: true,
		isNonstandard: "Past",
	},
	happyhour: {
		inherit: true,
		isNonstandard: "Past",
	},
	harden: {
		inherit: true,
		isNonstandard: "Past",
	},
	headbutt: {
		inherit: true,
		isNonstandard: "Past",
	},
	heartswap: {
		inherit: true,
		isNonstandard: "Past",
	},
	holdback: {
		inherit: true,
		isNonstandard: "Past",
	},
	holdhands: {
		inherit: true,
		isNonstandard: "Past",
	},
	honeclaws: {
		inherit: true,
		isNonstandard: "Past",
	},
	hornattack: {
		inherit: true,
		isNonstandard: "Past",
	},
	hydrosteam: {
		inherit: true,
		isNonstandard: "Past",
	},
	hyperdrill: {
		inherit: true,
		basePower: 120,
		isNonstandard: "Past",
	},
	hyperspacefury: {
		inherit: true,
		isNonstandard: "Past",
	},
	hyperspacehole: {
		inherit: true,
		isNonstandard: "Past",
	},
	iceburn: {
		inherit: true,
		isNonstandard: "Past",
	},
	incinerate: {
		inherit: true,
		isNonstandard: "Past",
	},
	infernalparade: {
		inherit: true,
		basePower: 65,
	},
	ironhead: {
		inherit: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		desc: "Has a 20% chance to make the target flinch.",
		shortDesc: "20% chance to make the target flinch.",
	},
	ivycudgel: {
		inherit: true,
		isNonstandard: "Past",
	},
	jawlock: {
		inherit: true,
		isNonstandard: "Past",
	},
	judgment: {
		inherit: true,
		isNonstandard: "Past",
	},
	junglehealing: {
		inherit: true,
		isNonstandard: "Past",
	},
	kingsshield: {
		inherit: true,
		isNonstandard: null,
		pp: 5,
	},
	leafage: {
		inherit: true,
		isNonstandard: "Past",
	},
	leer: {
		inherit: true,
		isNonstandard: "Past",
	},
	lick: {
		inherit: true,
		isNonstandard: "Past",
	},
	lightofruin: {
		inherit: true,
		isNonstandard: null,
	},
	lunarblessing: {
		inherit: true,
		isNonstandard: "Past",
	},
	lunardance: {
		inherit: true,
		isNonstandard: "Past",
	},
	lusterpurge: {
		inherit: true,
		isNonstandard: "Past",
	},
	magicalleaf: {
		inherit: true,
		isNonstandard: "Past",
	},
	magicaltorque: {
		inherit: true,
		isNonstandard: "Past",
	},
	magmastorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	makeitrain: {
		inherit: true,
		accuracy: 95,
		isNonstandard: "Past",
	},
	malignantchain: {
		inherit: true,
		isNonstandard: "Past",
	},
	megadrain: {
		inherit: true,
		isNonstandard: "Past",
	},
	megapunch: {
		inherit: true,
		isNonstandard: "Past",
	},
	metalclaw: {
		inherit: true,
		isNonstandard: "Past",
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
	},
	metronome: {
		inherit: true,
		isNonstandard: "Past",
	},
	mightycleave: {
		inherit: true,
		isNonstandard: "Past",
	},
	mimic: {
		inherit: true,
		isNonstandard: "Past",
	},
	mist: {
		inherit: true,
		isNonstandard: "Past",
	},
	mistball: {
		inherit: true,
		isNonstandard: "Past",
	},
	moonblast: {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				spa: -1,
			},
		},
		desc: "Has a 10% chance to lower the target's Special Attack by 1 stage.",
		shortDesc: "10% chance to lower the target's Sp. Atk by 1.",
	},
	moongeistbeam: {
		inherit: true,
		isNonstandard: "Past",
	},
	mountaingale: {
		inherit: true,
		basePower: 120,
	},
	mysticalpower: {
		inherit: true,
		isNonstandard: "Past",
	},
	nightdaze: {
		inherit: true,
		basePower: 90,
	},
	nightslash: {
		inherit: true,
		pp: 20,
	},
	nihillight: {
		inherit: true,
		pp: 5,
	},
	noretreat: {
		inherit: true,
		isNonstandard: "Past",
	},
	noxioustorque: {
		inherit: true,
		isNonstandard: "Past",
	},
	obstruct: {
		inherit: true,
		pp: 5,
	},
	orderup: {
		inherit: true,
		isNonstandard: "Past",
	},
	originpulse: {
		inherit: true,
		isNonstandard: "Past",
	},
	overdrive: {
		inherit: true,
		isNonstandard: "Past",
	},
	payday: {
		inherit: true,
		isNonstandard: "Past",
	},
	peck: {
		inherit: true,
		isNonstandard: "Past",
	},
	photongeyser: {
		inherit: true,
		isNonstandard: "Past",
	},
	playnice: {
		inherit: true,
		isNonstandard: "Past",
	},
	poisongas: {
		inherit: true,
		isNonstandard: "Past",
	},
	poisonsting: {
		inherit: true,
		isNonstandard: "Past",
	},
	poisontail: {
		inherit: true,
		isNonstandard: "Past",
	},
	powdersnow: {
		inherit: true,
		isNonstandard: "Past",
	},
	powershift: {
		inherit: true,
		isNonstandard: null,
	},
	precipiceblades: {
		inherit: true,
		isNonstandard: "Past",
	},
	present: {
		inherit: true,
		isNonstandard: "Past",
	},
	prismaticlaser: {
		inherit: true,
		isNonstandard: "Past",
	},
	protect: {
		inherit: true,
		pp: 5,
	},
	psybeam: {
		inherit: true,
		isNonstandard: "Past",
	},
	psyblade: {
		inherit: true,
		isNonstandard: "Past",
	},
	psychoboost: {
		inherit: true,
		isNonstandard: "Past",
	},
	psyshieldbash: {
		inherit: true,
		basePower: 90,
	},
	psystrike: {
		inherit: true,
		isNonstandard: "Past",
	},
	purify: {
		inherit: true,
		pp: 5,
	},
	pyroball: {
		inherit: true,
		isNonstandard: "Past",
	},
	ragefist: {
		inherit: true,
		isNonstandard: "Past",
	},
	// ragepowder: {
	// 	inherit: true,
	// 	flags: { noassist: 1, failcopycat: 1 },
	// },
	razorleaf: {
		inherit: true,
		isNonstandard: "Past",
	},
	relicsong: {
		inherit: true,
		isNonstandard: "Past",
	},
	retaliate: {
		inherit: true,
		isNonstandard: "Past",
	},
	revelationdance: {
		inherit: true,
		basePower: 100,
		isNonstandard: "Past",
	},
	revivalblessing: {
		inherit: true,
		isNonstandard: "Custom",
	},
	roaroftime: {
		inherit: true,
		isNonstandard: "Past",
	},
	rocksmash: {
		inherit: true,
		isNonstandard: "Past",
	},
	rockthrow: {
		inherit: true,
		isNonstandard: "Past",
	},
	rollout: {
		inherit: true,
		isNonstandard: "Past",
	},
	ruination: {
		inherit: true,
		isNonstandard: "Past",
	},
	sacredfire: {
		inherit: true,
		isNonstandard: "Past",
	},
	saltcure: {
		inherit: true,
		condition: {
			inherit: true,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Water', 'Steel']) ? 8 : 16));
			},
		},
		desc: "Causes damage to the target equal to 1/16 of its maximum HP (1/8 if the target is Steel or Water type), rounded down, at the end of each turn during effect. This effect ends when the target is no longer active.",
		shortDesc: "Deals 1/16 max HP each turn; 1/8 on Steel, Water.",
	},
	sandattack: {
		inherit: true,
		isNonstandard: "Past",
	},
	sandsearstorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	sandstorm: {
		inherit: true,
		pp: 5,
	},
	scratch: {
		inherit: true,
		isNonstandard: "Past",
	},
	secretsword: {
		inherit: true,
		isNonstandard: "Past",
	},
	seedflare: {
		inherit: true,
		isNonstandard: "Past",
	},
	shadowclaw: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
	},
	shadowforce: {
		inherit: true,
		isNonstandard: "Past",
	},
	shelltrap: {
		inherit: true,
		pp: 10,
	},
	shiftgear: {
		inherit: true,
		isNonstandard: "Past",
	},
	shockwave: {
		inherit: true,
		isNonstandard: "Past",
	},
	shoreup: {
		inherit: true,
		isNonstandard: "Past",
	},
	silktrap: {
		inherit: true,
		isNonstandard: "Past",
	},
	sketch: {
		inherit: true,
		isNonstandard: "Past",
	},
	slam: {
		inherit: true,
		isNonstandard: "Past",
	},
	slash: {
		inherit: true,
		isNonstandard: "Past",
	},
	sludge: {
		inherit: true,
		isNonstandard: "Past",
	},
	smog: {
		inherit: true,
		isNonstandard: "Past",
	},
	smokescreen: {
		inherit: true,
		isNonstandard: "Past",
	},
	snaptrap: {
		inherit: true,
		isNonstandard: null,
		type: "Steel",
	},
	snipeshot: {
		inherit: true,
		basePower: 85,
		isNonstandard: "Past",
	},
	snowscape: {
		inherit: true,
		pp: 5,
	},
	spacialrend: {
		inherit: true,
		isNonstandard: "Past",
	},
	spark: {
		inherit: true,
		isNonstandard: "Past",
	},
	spikyshield: {
		inherit: true,
		pp: 5,
	},
	spinout: {
		inherit: true,
		isNonstandard: "Past",
		pp: 10,
	},
	spiritbreak: {
		inherit: true,
		isNonstandard: "Past",
	},
	spiritshackle: {
		inherit: true,
		basePower: 90,
	},
	splash: {
		inherit: true,
		isNonstandard: "Past",
	},
	springtidestorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	steameruption: {
		inherit: true,
		isNonstandard: "Past",
	},
	stomp: {
		inherit: true,
		isNonstandard: "Past",
	},
	stormthrow: {
		inherit: true,
		isNonstandard: null,
	},
	strangesteam: {
		inherit: true,
		isNonstandard: "Past",
	},
	strength: {
		inherit: true,
		isNonstandard: "Past",
	},
	sunsteelstrike: {
		inherit: true,
		isNonstandard: "Past",
	},
	supersonic: {
		inherit: true,
		isNonstandard: "Past",
	},
	surgingstrikes: {
		inherit: true,
		isNonstandard: "Past",
	},
	swift: {
		inherit: true,
		isNonstandard: "Past",
	},
	syrupbomb: {
		inherit: true,
		accuracy: 90,
	},
	tachyoncutter: {
		inherit: true,
		isNonstandard: "Past",
	},
	tackle: {
		inherit: true,
		isNonstandard: "Past",
	},
	tailglow: {
		inherit: true,
		isNonstandard: "Past",
	},
	tailwhip: {
		inherit: true,
		isNonstandard: "Past",
	},
	takedown: {
		inherit: true,
		isNonstandard: "Past",
	},
	takeheart: {
		inherit: true,
		isNonstandard: "Past",
	},
	tarshot: {
		inherit: true,
		isNonstandard: "Past",
	},
	teleport: {
		inherit: true,
		isNonstandard: "Past",
	},
	terablast: {
		inherit: true,
		isNonstandard: "Past",
	},
	terastarstorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	thundercage: {
		inherit: true,
		isNonstandard: "Past",
	},
	thunderclap: {
		inherit: true,
		isNonstandard: "Past",
	},
	thunderouskick: {
		inherit: true,
		isNonstandard: "Past",
	},
	thundershock: {
		inherit: true,
		isNonstandard: "Past",
	},
	topsyturvy: {
		inherit: true,
		isNonstandard: "Past",
	},
	toxicthread: {
		inherit: true,
		boosts: {
			spe: -2,
		},
		desc: "Lowers the target's Speed by 2 stages and poisons it.",
		shortDesc: "Lowers the target's Speed by 2 and poisons it.",
	},
	trickortreat: {
		inherit: true,
		isNonstandard: null,
	},
	tripledive: {
		inherit: true,
		basePower: 35,
		isNonstandard: "Past",
	},
	triplekick: {
		inherit: true,
		isNonstandard: "Past",
	},
	tropkick: {
		inherit: true,
		basePower: 85,
	},
	twister: {
		inherit: true,
		isNonstandard: "Past",
	},
	vcreate: {
		inherit: true,
		isNonstandard: "Past",
	},
	victorydance: {
		inherit: true,
		isNonstandard: "Past",
	},
	vinewhip: {
		inherit: true,
		isNonstandard: "Past",
	},
	visegrip: {
		inherit: true,
		isNonstandard: "Past",
	},
	watergun: {
		inherit: true,
		isNonstandard: "Past",
	},
	waterpledge: {
		inherit: true,
		isNonstandard: "Past",
	},
	wickedblow: {
		inherit: true,
		isNonstandard: "Past",
	},
	wickedtorque: {
		inherit: true,
		isNonstandard: "Past",
	},
	wildboltstorm: {
		inherit: true,
		isNonstandard: "Past",
	},
	wingattack: {
		inherit: true,
		isNonstandard: "Past",
	},
	withdraw: {
		inherit: true,
		isNonstandard: "Past",
	},
	workup: {
		inherit: true,
		isNonstandard: "Past",
	},
	zingzap: {
		inherit: true,
		isNonstandard: "Past",
	},
};
