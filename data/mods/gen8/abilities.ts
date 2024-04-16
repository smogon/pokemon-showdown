/*

Ratings and how they work:

-1: Detrimental
	  An ability that severely harms the user.
	ex. Defeatist, Slow Start

 0: Useless
	  An ability with no overall benefit in a singles battle.
	ex. Color Change, Plus

 1: Ineffective
	  An ability that has minimal effect or is only useful in niche situations.
	ex. Light Metal, Suction Cups

 2: Useful
	  An ability that can be generally useful.
	ex. Flame Body, Overcoat

 3: Effective
	  An ability with a strong effect on the user or foe.
	ex. Chlorophyll, Sturdy

 4: Very useful
	  One of the more popular abilities. It requires minimal support to be effective.
	ex. Adaptability, Magic Bounce

 5: Essential
	  The sort of ability that defines metagames.
	ex. Imposter, Shadow Tag

*/

export const Abilities: {[k: string]: ModdedAbilityData} = {
	noability: {
		inherit: true,
		rating: 0.1,
	},
	adaptability: {
		inherit: true,
		rating: 4,
	},
	aerilate: {
		inherit: true,
		rating: 4,
	},
	aftermath: {
		inherit: true,
		rating: 2.5,
	},
	airlock: {
		inherit: true,
		rating: 2,
	},
	analytic: {
		inherit: true,
		rating: 2.5,
	},
	angerpoint: {
		inherit: true,
		rating: 1.5,
	},
	anticipation: {
		inherit: true,
		rating: 0.5,
	},
	arenatrap: {
		inherit: true,
		rating: 5,
	},
	aromaveil: {
		inherit: true,
		rating: 2,
	},
	asoneglastrier: {
		inherit: true,
		rating: 3.5,
	},
	asonespectrier: {
		inherit: true,
		rating: 3.5,
	},
	aurabreak: {
		inherit: true,
		rating: 1,
	},
	baddreams: {
		inherit: true,
		rating: 1.5,
	},
	ballfetch: {
		inherit: true,
		rating: 0,
	},
	battery: {
		inherit: true,
		rating: 0,
	},
	battlearmor: {
		inherit: true,
		rating: 1,
	},
	battlebond: {
		inherit: true,
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Greninja-Ash', this.effect, true);
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' &&
				!attacker.transformed) {
				move.multihit = 3;
			}
		},
		isNonstandard: null,
		rating: 4,
	},
	beastboost: {
		inherit: true,
		rating: 3.5,
	},
	berserk: {
		inherit: true,
		rating: 2,
	},
	bigpecks: {
		inherit: true,
		rating: 0.5,
	},
	blaze: {
		inherit: true,
		rating: 2,
	},
	bulletproof: {
		inherit: true,
		rating: 3,
	},
	cheekpouch: {
		inherit: true,
		rating: 2,
	},
	chillingneigh: {
		inherit: true,
		rating: 3,
	},
	chlorophyll: {
		inherit: true,
		rating: 3,
	},
	clearbody: {
		inherit: true,
		rating: 2,
	},
	cloudnine: {
		inherit: true,
		rating: 2,
	},
	colorchange: {
		inherit: true,
		rating: 0,
	},
	comatose: {
		inherit: true,
		rating: 4,
	},
	competitive: {
		inherit: true,
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				if (effect.id === 'stickyweb') {
					this.hint("In Gen 8, Court Change Sticky Web counts as lowering your own Speed, and Competitive only affects stats lowered by foes.", true, source.side);
				}
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({spa: 2}, target, target, null, false, true);
			}
		},
		rating: 2.5,
	},
	compoundeyes: {
		inherit: true,
		rating: 3,
	},
	contrary: {
		inherit: true,
		rating: 4.5,
	},
	corrosion: {
		inherit: true,
		rating: 2.5,
	},
	cottondown: {
		inherit: true,
		rating: 2,
	},
	curiousmedicine: {
		inherit: true,
		rating: 0,
	},
	cursedbody: {
		inherit: true,
		rating: 2,
	},
	cutecharm: {
		inherit: true,
		rating: 0.5,
	},
	damp: {
		inherit: true,
		rating: 1,
	},
	dancer: {
		inherit: true,
		rating: 1.5,
	},
	darkaura: {
		inherit: true,
		rating: 3,
	},
	dauntlessshield: {
		inherit: true,
		onStart(pokemon) {
			this.boost({def: 1}, pokemon);
		},
		rating: 3.5,
	},
	dazzling: {
		inherit: true,
		rating: 2.5,
	},
	defeatist: {
		inherit: true,
		rating: -1,
	},
	defiant: {
		inherit: true,
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				if (effect.id === 'stickyweb') {
					this.hint("In Gen 8, Court Change Sticky Web counts as lowering your own Speed, and Defiant only affects stats lowered by foes.", true, source.side);
				}
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({atk: 2}, target, target, null, false, true);
			}
		},
		rating: 2.5,
	},
	deltastream: {
		inherit: true,
		rating: 4,
	},
	desolateland: {
		inherit: true,
		rating: 4.5,
	},
	disguise: {
		inherit: true,
		rating: 3.5,
	},
	download: {
		inherit: true,
		rating: 3.5,
	},
	dragonsmaw: {
		inherit: true,
		rating: 3.5,
	},
	drizzle: {
		inherit: true,
		rating: 4,
	},
	drought: {
		inherit: true,
		rating: 4,
	},
	dryskin: {
		inherit: true,
		rating: 3,
	},
	earlybird: {
		inherit: true,
		rating: 1.5,
	},
	effectspore: {
		inherit: true,
		rating: 2,
	},
	electricsurge: {
		inherit: true,
		rating: 4,
	},
	emergencyexit: {
		inherit: true,
		rating: 1,
	},
	fairyaura: {
		inherit: true,
		rating: 3,
	},
	filter: {
		inherit: true,
		rating: 3,
	},
	flamebody: {
		inherit: true,
		rating: 2,
	},
	flareboost: {
		inherit: true,
		rating: 2,
	},
	flashfire: {
		inherit: true,
		rating: 3.5,
	},
	flowergift: {
		inherit: true,
		rating: 1,
	},
	flowerveil: {
		inherit: true,
		rating: 0,
	},
	fluffy: {
		inherit: true,
		rating: 3.5,
	},
	forecast: {
		inherit: true,
		rating: 2,
	},
	forewarn: {
		inherit: true,
		rating: 0.5,
	},
	friendguard: {
		inherit: true,
		rating: 0,
	},
	frisk: {
		inherit: true,
		rating: 1.5,
	},
	fullmetalbody: {
		inherit: true,
		rating: 2,
	},
	furcoat: {
		inherit: true,
		rating: 4,
	},
	galewings: {
		inherit: true,
		rating: 2.5,
	},
	galvanize: {
		inherit: true,
		rating: 4,
	},
	gluttony: {
		inherit: true,
		rating: 1.5,
	},
	gooey: {
		inherit: true,
		rating: 2,
	},
	gorillatactics: {
		inherit: true,
		rating: 4.5,
	},
	grasspelt: {
		inherit: true,
		rating: 0.5,
	},
	grassysurge: {
		inherit: true,
		rating: 4,
	},
	grimneigh: {
		inherit: true,
		rating: 3,
	},
	gulpmissile: {
		inherit: true,
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1},
		rating: 2.5,
	},
	guts: {
		inherit: true,
		rating: 3,
	},
	harvest: {
		inherit: true,
		rating: 2.5,
	},
	healer: {
		inherit: true,
		rating: 0,
	},
	heatproof: {
		inherit: true,
		onSourceModifyAtk() {},
		onSourceModifySpA() {},
		onSourceBasePowerPriority: 18,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof BP weaken');
				return this.chainModify(0.5);
			}
		},
		rating: 2,
	},
	heavymetal: {
		inherit: true,
		rating: 0,
	},
	honeygather: {
		inherit: true,
		rating: 0,
	},
	hugepower: {
		inherit: true,
		rating: 5,
	},
	hungerswitch: {
		inherit: true,
		rating: 1,
	},
	hustle: {
		inherit: true,
		rating: 3.5,
	},
	hydration: {
		inherit: true,
		rating: 1.5,
	},
	hypercutter: {
		inherit: true,
		rating: 1.5,
	},
	icebody: {
		inherit: true,
		rating: 1,
	},
	iceface: {
		inherit: true,
		rating: 3,
	},
	icescales: {
		inherit: true,
		rating: 4,
	},
	illuminate: {
		inherit: true,
		onTryBoost() {},
		onModifyMove() {},
		flags: {},
		rating: 0,
	},
	illusion: {
		inherit: true,
		rating: 4.5,
	},
	immunity: {
		inherit: true,
		rating: 2,
	},
	imposter: {
		inherit: true,
		rating: 5,
	},
	infiltrator: {
		inherit: true,
		rating: 2.5,
	},
	innardsout: {
		inherit: true,
		rating: 4,
	},
	innerfocus: {
		inherit: true,
		rating: 1.5,
	},
	insomnia: {
		inherit: true,
		rating: 2,
	},
	intimidate: {
		inherit: true,
		rating: 3.5,
	},
	intrepidsword: {
		inherit: true,
		onStart(pokemon) {
			this.boost({atk: 1}, pokemon);
		},
		rating: 4,
	},
	ironbarbs: {
		inherit: true,
		rating: 2.5,
	},
	ironfist: {
		inherit: true,
		rating: 3,
	},
	justified: {
		inherit: true,
		rating: 2.5,
	},
	keeneye: {
		inherit: true,
		rating: 0.5,
	},
	klutz: {
		inherit: true,
		rating: -1,
	},
	leafguard: {
		inherit: true,
		rating: 0.5,
	},
	levitate: {
		inherit: true,
		rating: 3.5,
	},
	libero: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		onSwitchIn() {},
		rating: 4.5,
	},
	lightmetal: {
		inherit: true,
		rating: 1,
	},
	lightningrod: {
		inherit: true,
		rating: 3,
	},
	limber: {
		inherit: true,
		rating: 2,
	},
	liquidooze: {
		inherit: true,
		rating: 1.5,
	},
	liquidvoice: {
		inherit: true,
		rating: 1.5,
	},
	longreach: {
		inherit: true,
		rating: 1,
	},
	magicbounce: {
		inherit: true,
		rating: 4,
	},
	magicguard: {
		inherit: true,
		rating: 4,
	},
	magician: {
		inherit: true,
		rating: 1.5,
	},
	magmaarmor: {
		inherit: true,
		rating: 1,
	},
	magnetpull: {
		inherit: true,
		rating: 4,
	},
	marvelscale: {
		inherit: true,
		rating: 2.5,
	},
	megalauncher: {
		inherit: true,
		rating: 3,
	},
	merciless: {
		inherit: true,
		rating: 1.5,
	},
	mimicry: {
		inherit: true,
		rating: 0.5,
	},
	minus: {
		inherit: true,
		rating: 0,
	},
	mirrorarmor: {
		inherit: true,
		rating: 2.5,
	},
	mistysurge: {
		inherit: true,
		rating: 3.5,
	},
	moldbreaker: {
		inherit: true,
		rating: 3.5,
	},
	moody: {
		inherit: true,
		rating: 5,
	},
	motordrive: {
		inherit: true,
		rating: 3,
	},
	moxie: {
		inherit: true,
		rating: 3,
	},
	multiscale: {
		inherit: true,
		rating: 3.5,
	},
	multitype: {
		inherit: true,
		rating: 4,
	},
	mummy: {
		inherit: true,
		rating: 2,
	},
	naturalcure: {
		inherit: true,
		rating: 2.5,
	},
	neuroforce: {
		inherit: true,
		rating: 2.5,
	},
	neutralizinggas: {
		inherit: true,
		rating: 4,
	},
	noguard: {
		inherit: true,
		rating: 4,
	},
	normalize: {
		inherit: true,
		rating: 0,
	},
	oblivious: {
		inherit: true,
		rating: 1.5,
	},
	overcoat: {
		inherit: true,
		rating: 2,
	},
	overgrow: {
		inherit: true,
		rating: 2,
	},
	owntempo: {
		inherit: true,
		rating: 1.5,
	},
	parentalbond: {
		inherit: true,
		rating: 4.5,
	},
	pastelveil: {
		inherit: true,
		rating: 2,
	},
	perishbody: {
		inherit: true,
		rating: 1,
	},
	pickpocket: {
		inherit: true,
		rating: 1,
	},
	pickup: {
		inherit: true,
		rating: 0.5,
	},
	pixilate: {
		inherit: true,
		rating: 4,
	},
	plus: {
		inherit: true,
		rating: 0,
	},
	poisonheal: {
		inherit: true,
		rating: 4,
	},
	poisonpoint: {
		inherit: true,
		rating: 1.5,
	},
	poisontouch: {
		inherit: true,
		rating: 2,
	},
	powerconstruct: {
		inherit: true,
		rating: 5,
	},
	powerofalchemy: {
		inherit: true,
		rating: 0,
	},
	powerspot: {
		inherit: true,
		rating: 1,
	},
	prankster: {
		inherit: true,
		rating: 4,
	},
	pressure: {
		inherit: true,
		rating: 2.5,
	},
	primordialsea: {
		inherit: true,
		rating: 4.5,
	},
	prismarmor: {
		inherit: true,
		rating: 3,
	},
	propellertail: {
		inherit: true,
		rating: 0,
	},
	protean: {
		inherit: true,
		onPrepareHit(source, target, move) {
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch') return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		onSwitchIn() {},
		rating: 4.5,
	},
	psychicsurge: {
		inherit: true,
		rating: 4,
	},
	punkrock: {
		inherit: true,
		rating: 3.5,
	},
	purepower: {
		inherit: true,
		rating: 5,
	},
	queenlymajesty: {
		inherit: true,
		rating: 2.5,
	},
	quickdraw: {
		inherit: true,
		rating: 2.5,
	},
	quickfeet: {
		inherit: true,
		rating: 2.5,
	},
	raindish: {
		inherit: true,
		rating: 1.5,
	},
	rattled: {
		inherit: true,
		rating: 1.5,
	},
	receiver: {
		inherit: true,
		rating: 0,
	},
	reckless: {
		inherit: true,
		rating: 3,
	},
	refrigerate: {
		inherit: true,
		rating: 4,
	},
	regenerator: {
		inherit: true,
		rating: 4.5,
	},
	ripen: {
		inherit: true,
		rating: 2,
	},
	rivalry: {
		inherit: true,
		rating: 0,
	},
	rkssystem: {
		inherit: true,
		rating: 4,
	},
	rockhead: {
		inherit: true,
		rating: 3,
	},
	roughskin: {
		inherit: true,
		rating: 2.5,
	},
	runaway: {
		inherit: true,
		rating: 0,
	},
	sandforce: {
		inherit: true,
		rating: 2,
	},
	sandrush: {
		inherit: true,
		rating: 3,
	},
	sandspit: {
		inherit: true,
		rating: 2,
	},
	sandstream: {
		inherit: true,
		rating: 4,
	},
	sandveil: {
		inherit: true,
		rating: 1.5,
	},
	sapsipper: {
		inherit: true,
		rating: 3,
	},
	schooling: {
		inherit: true,
		rating: 3,
	},
	scrappy: {
		inherit: true,
		rating: 3,
	},
	screencleaner: {
		inherit: true,
		rating: 2,
	},
	serenegrace: {
		inherit: true,
		rating: 3.5,
	},
	shadowshield: {
		inherit: true,
		rating: 3.5,
	},
	shadowtag: {
		inherit: true,
		rating: 5,
	},
	shedskin: {
		inherit: true,
		rating: 3,
	},
	sheerforce: {
		inherit: true,
		rating: 3.5,
	},
	shellarmor: {
		inherit: true,
		rating: 1,
	},
	shielddust: {
		inherit: true,
		rating: 2,
	},
	shieldsdown: {
		inherit: true,
		rating: 3,
	},
	simple: {
		inherit: true,
		rating: 4,
	},
	skilllink: {
		inherit: true,
		rating: 3,
	},
	slowstart: {
		inherit: true,
		rating: -1,
	},
	slushrush: {
		inherit: true,
		rating: 3,
	},
	sniper: {
		inherit: true,
		rating: 2,
	},
	snowcloak: {
		inherit: true,
		rating: 1.5,
	},
	snowwarning: {
		inherit: true,
		onStart(source) {
			this.field.setWeather('hail');
		},
		rating: 4,
	},
	solarpower: {
		inherit: true,
		rating: 2,
	},
	solidrock: {
		inherit: true,
		rating: 3,
	},
	soulheart: {
		inherit: true,
		rating: 3.5,
	},
	soundproof: {
		inherit: true,
		rating: 1.5,
	},
	speedboost: {
		inherit: true,
		rating: 4.5,
	},
	stakeout: {
		inherit: true,
		rating: 4.5,
	},
	stall: {
		inherit: true,
		rating: -1,
	},
	stalwart: {
		inherit: true,
		rating: 0,
	},
	stamina: {
		inherit: true,
		rating: 3.5,
	},
	stancechange: {
		inherit: true,
		rating: 4,
	},
	static: {
		inherit: true,
		rating: 2,
	},
	steadfast: {
		inherit: true,
		rating: 1,
	},
	steamengine: {
		inherit: true,
		rating: 2,
	},
	steelworker: {
		inherit: true,
		rating: 3.5,
	},
	steelyspirit: {
		inherit: true,
		rating: 3.5,
	},
	stench: {
		inherit: true,
		rating: 0.5,
	},
	stickyhold: {
		inherit: true,
		rating: 2,
	},
	stormdrain: {
		inherit: true,
		rating: 3,
	},
	strongjaw: {
		inherit: true,
		rating: 3,
	},
	sturdy: {
		inherit: true,
		rating: 3,
	},
	suctioncups: {
		inherit: true,
		rating: 1,
	},
	superluck: {
		inherit: true,
		rating: 1.5,
	},
	surgesurfer: {
		inherit: true,
		rating: 3,
	},
	swarm: {
		inherit: true,
		rating: 2,
	},
	sweetveil: {
		inherit: true,
		rating: 2,
	},
	swiftswim: {
		inherit: true,
		rating: 3,
	},
	symbiosis: {
		inherit: true,
		rating: 0,
	},
	synchronize: {
		inherit: true,
		rating: 2,
	},
	tangledfeet: {
		inherit: true,
		rating: 1,
	},
	tanglinghair: {
		inherit: true,
		rating: 2,
	},
	technician: {
		inherit: true,
		rating: 3.5,
	},
	telepathy: {
		inherit: true,
		rating: 0,
	},
	teravolt: {
		inherit: true,
		rating: 3.5,
	},
	thickfat: {
		inherit: true,
		rating: 3.5,
	},
	tintedlens: {
		inherit: true,
		rating: 4,
	},
	torrent: {
		inherit: true,
		rating: 2,
	},
	toughclaws: {
		inherit: true,
		rating: 3.5,
	},
	toxicboost: {
		inherit: true,
		rating: 2.5,
	},
	trace: {
		inherit: true,
		rating: 3,
	},
	transistor: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify(1.5);
			}
		},
		rating: 3.5,
	},
	triage: {
		inherit: true,
		rating: 3.5,
	},
	truant: {
		inherit: true,
		rating: -1,
	},
	turboblaze: {
		inherit: true,
		rating: 3.5,
	},
	unaware: {
		inherit: true,
		rating: 4,
	},
	unburden: {
		inherit: true,
		rating: 3.5,
	},
	unnerve: {
		inherit: true,
		rating: 1.5,
	},
	unseenfist: {
		inherit: true,
		rating: 2,
	},
	victorystar: {
		inherit: true,
		rating: 2,
	},
	vitalspirit: {
		inherit: true,
		rating: 2,
	},
	voltabsorb: {
		inherit: true,
		rating: 3.5,
	},
	wanderingspirit: {
		inherit: true,
		rating: 2.5,
	},
	waterabsorb: {
		inherit: true,
		rating: 3.5,
	},
	waterbubble: {
		inherit: true,
		rating: 4.5,
	},
	watercompaction: {
		inherit: true,
		rating: 1.5,
	},
	waterveil: {
		inherit: true,
		rating: 2,
	},
	weakarmor: {
		inherit: true,
		rating: 1,
	},
	whitesmoke: {
		inherit: true,
		rating: 2,
	},
	wimpout: {
		inherit: true,
		rating: 1,
	},
	wonderguard: {
		inherit: true,
		flags: {failroleplay: 1, noreceiver: 1, failskillswap: 1, breakable: 1},
		rating: 5,
	},
	wonderskin: {
		inherit: true,
		rating: 2,
	},
	zenmode: {
		inherit: true,
		rating: 0,
	},
	mountaineer: {
		inherit: true,
		rating: 3,
	},
	rebound: {
		inherit: true,
		rating: 3,
	},
	persistent: {
		inherit: true,
		rating: 3,
	},
};
