exports.BattleText = {
	default: {
		startBattle: "Battle started between [TRAINER] and [TRAINER]!",
		winBattle: "**[TRAINER]** won the battle!",
		tieBattle: "Tie between [TRAINER] and [TRAINER]!",

		pokemon: "[NICKNAME]",
		opposingPokemon: "the opposing [NICKNAME]",
		team: "your team",
		opposingTeam: "the opposing team",

		turn: "== Turn [NUMBER] ==",
		switchIn: "[TRAINER] sent out [FULLNAME]!",
		switchInOwn: "Go! [FULLNAME]!",
		switchOut: "[TRAINER] withdrew [NICKNAME]!",
		switchOutOwn: "[NICKNAME], come back!",
		drag: "[FULLNAME] was dragged out!",
		faint: "[POKEMON] fainted!",
		swap: "[POKEMON] and [TARGET] switched places!",
		swapCenter: "[POKEMON] moved to the center!",

		zEffect: "  [POKEMON] unleases its full-force Z-Move!",
		move: "[POKEMON] used **[MOVE]**!",
		abilityActivation: "  [[POKEMON]'s [ABILITY]]",

		mega: "  [POKEMON]'s [ITEM] is reacting to the Key Stone!",
		megaNoItem: "  [POKEMON] is reacting to [TRAINER]'s Key Stone!",
		megaGen6: "  [POKEMON]'s [ITEM] is reacting to [TRAINER]'s Mega Bracelet!",
		transformMega: "[POKEMON] has Mega Evolved into Mega [SPECIES]!",
		primal: "[POKEMON]'s Primal Reversion! It reverted to its primal state!",
		zPower: "  [POKEMON] surrounded itself with its Z-Power!",
		zBroken: "  [POKEMON] couldn't fully protect itself and got hurt!",

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] can't use [MOVE]!",
		cantNoMove: "[POKEMON] can't move!",
		fail: "  But it failed!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] transformed!",
		typeChange: "  [POKEMON] transformed into the [TYPE] type!",
		typeChangeFromEffect: "  [POKEMON]'s [EFFECT] made it the [TYPE] type!",
		typeAdd: "  [TYPE] type was added to [POKEMON]!",

		start: "  ([EFFECT] started on [POKEMON]!)",
		end: "  [POKEMON] was freed from [EFFECT]!",
		activate: "  ([EFFECT] activated!)",
		startTeamEffect: "  ([EFFECT] started on [TEAM]!)",
		endTeamEffect: "  ([EFFECT] ended on [TEAM]!)",
		startFieldEffect: "  ([EFFECT] started!)",
		endFieldEffect: "  ([EFFECT] ended!)",

		changeAbility: "  [POKEMON] acquired [ABILITY]!",
		addItem: "  [POKEMON] obtained one [ITEM].", // Trick, Switcheroo
		takeItem: "  [POKEMON] stole [SOURCE]'s [ITEM]!", // Thief, Covet, Magician, Pickpocket
		eatItem: "  [POKEMON] ate its [ITEM]!",
		useGem: "  The [ITEM] strengthened [POKEMON]'s power!",
		eatItemWeaken: "  The [ITEM] weakened damage to [POKEMON]!",
		removeItem: "  [POKEMON] lost its [ITEM]!",
		activateItem: "  ([POKEMON] used its [ITEM]!)",
		activateWeaken: "  The [ITEM] weakened the damage to [POKEMON]!",

		damage: "  ([POKEMON] was hurt!)",
		damagePercentage: "  ([POKEMON] lost [PERCENTAGE] of its health!)",
		damageFromPokemon: "  [POKEMON] is hurt by [SOURCE]'s [ITEM]!", // Jaboca/Rowap Berry
		damageFromItem: "  [POKEMON] is hurt by its [ITEM]!", // Sticky Barb
		damageFromPartialTrapping: "  [POKEMON] is hurt by [MOVE]!",
		heal: "  [POKEMON] restored its HP.",
		healFromZEffect: "  [POKEMON] restored its HP using its Z-Power!",
		healFromEffect: "  [POKEMON] restored HP using its [EFFECT]!",

		boost: "  [POKEMON]'s [STAT] rose!",
		boost2: "  [POKEMON]'s [STAT] rose sharply!",
		boost3: "  [POKEMON]'s [STAT] rose drastically!",
		boost0: "  [POKEMON]'s [STAT] won't go any higher!",
		boostFromItem: "  The [ITEM] raised [POKEMON]'s [STAT]!",
		boost2FromItem: "  The [ITEM] sharply raised [POKEMON]'s [STAT]!",
		boost3FromItem: "  The [ITEM] drastically raised [POKEMON]'s [STAT]!",
		boostFromZEffect: "  [POKEMON] boosted its [STAT] using its Z-Power!",
		boost2FromZEffect: "  [POKEMON] boosted its [STAT] sharply using its Z-Power!",
		boost3FromZEffect: "  [POKEMON] boosted its [STAT] drastically using its Z-Power!",
		boostMultipleFromZEffect: "  [POKEMON] boosted its stats using its Z-Power!",

		unboost: "  [POKEMON]'s [STAT] fell!",
		unboost2: "  [POKEMON]'s [STAT] fell harshly!",
		unboost3: "  [POKEMON]'s [STAT] fell severely!",
		unboost0: "  [POKEMON]'s [STAT] won't go any lower!",
		unboostFromItem: "  The [ITEM] lowered [POKEMON]'s [STAT]!",
		unboost2FromItem: "  The [ITEM] harshly lowered [POKEMON]'s [STAT]!",
		unboost3FromItem: "  The [ITEM] drastically lowered [POKEMON]'s [STAT]!",

		swapBoost: "  [POKEMON] switched stat changes with its target!",
		swapOffensiveBoost: "  [POKEMON] switched all changes to its Attack and Sp. Atk with its target!",
		swapDefensiveBoost: "  [POKEMON] switched all changes to its Defense and Sp. Def with its target!",
		copyBoost: "  [POKEMON] copied [TARGET]'s stat changes!",
		clearBoost: "  [POKEMON]'s stat changes were removed!",
		clearBoostFromZEffect: "  [POKEMON] returned its decreased stats to normal using its Z-Power!",
		invertBoost: "  [POKEMON]'s stat changes were inverted!",
		clearAllBoost: "  All stat changes were eliminated!",

		superEffective: "  It's super effective!",
		superEffectiveSpread: "  It's super effective on [POKEMON]!",
		resisted: "  It's not very effective...",
		resistedSpread: "  It's not very effective on [POKEMON].",
		crit: "  A critical hit!",
		critSpread: "  A critical hit on [POKEMON]!",
		immune: "  It doesn't affect [POKEMON]...",
		immuneNoPokemon: "  It had no effect!", // old gens
		immuneOHKO: "  [POKEMON] is unaffected!",
		miss: "  [POKEMON] avoided the attack!",
		missNoPokemon: "  [SOURCE]'s attack missed!", // old gens

		center: "  Automatic center!",
		noTarget: "  But there was no target...", // gen 5 and earlier
		ohko: "  It's a one-hit KO!",
		combine: "  The two moves have become one! It's a combined move!",
		hitCount: "  Hit [NUMBER] times!",
		hitCountSingular: "  Hit 1 time!",
	},

	// stats
	hp: {
		statName: "HP",
	},
	atk: {
		statName: "Attack",
	},
	def: {
		statName: "Defense",
	},
	spa: {
		statName: "Special Attack",
	},
	spd: {
		statName: "Special Defense",
	},
	spe: {
		statName: "Speed",
	},
	accuracy: {
		statName: "accuracy",
	},
	evasion: {
		statName: "evasiveness",
	},
	spc: {
		statName: "Special",
	},
	stats: {
		statName: "stats",
	},

	// statuses
	brn: {
		start: "  [POKEMON] was burned!",
		startFromItem: "  [POKEMON] was burned by the [ITEM]!",
		alreadyStarted: "  [POKEMON] already has a burn.",
		end: "  [POKEMON]'s burn was healed.",
		endFromItem: "  [POKEMON]'s [ITEM] healed its burn!",
		damage: "  [POKEMON] was hurt by its burn!",
	},
	frz: {
		start: "  [POKEMON] was frozen solid!",
		alreadyStarted: "  [POKEMON] is already frozen solid!",
		end: "  [POKEMON] thawed out!",
		endFromItem: "  [POKEMON]'s [ITEM] defrosted it!",
		endFromMove: "  [POKEMON]'s [MOVE] melted the ice!",
		cant: "[POKEMON] is frozen solid!",
	},
	par: {
		start: "  [POKEMON] is paralyzed! It may be unable to move!",
		alreadyStarted: "  [POKEMON] is already paralyzed.",
		end: "  [POKEMON] was cured of paralysis.",
		endFromItem: "  [POKEMON]'s [ITEM] cured its paralysis!",
		cant: "[POKEMON] is paralyzed! It can't move!",
	},
	psn: {
		start: "  [POKEMON] was poisoned!",
		alreadyStarted: "  [POKEMON] is already poisoned.",
		end: "  [POKEMON] was cured of its poisoning.",
		endFromItem: "  [POKEMON]'s [ITEM] cured its poison!",
		damage: "  [POKEMON] was hurt by poison!",
	},
	tox: {
		start: "  [POKEMON] was badly poisoned!",
		startFromItem: "  [POKEMON] was badly poisoned by the [ITEM]!",
		end: "#psn",
		endFromItem: "#psn",
		alreadyStarted: "#psn",
		damage: "#psn",
	},
	slp: {
		start: "  [POKEMON] fell asleep!",
		startFromRest: "  [POKEMON] slept and became healthy!",
		alreadyStarted: "  [POKEMON] is already asleep!",
		end: "  [POKEMON] woke up!",
		endFromItem: "  [POKEMON]'s [ITEM] woke it up!",
		cant: "[POKEMON] is fast asleep.",
	},

	// misc effects
	confusion: {
		start: "  [POKEMON] became confused!",
		startFromFatigue: "  [POKEMON] became confused due to fatigue!",
		end: "  [POKEMON] snapped out of its confusion!",
		endFromItem: "  [POKEMON]'s [ITEM] snapped it out of its confusion!",
		alreadyStarted: "  [POKEMON] is already confused!",
		activate: "  [POKEMON] is confused!",
		damage: "It hurt itself in its confusion!",
	},
	drain: {
		heal: "  [SOURCE] had its energy drained!",
	},
	flinch: {
		cant: "[POKEMON] flinched and couldn't move!",
	},
	healreplacement: {
		activate: "  [POKEMON] will restore its replacement's HP using its Z-Power!",
	},
	nopp: {
		cant: "[POKEMON] used [MOVE]!\n  But there was no PP left for the move!",
	},
	recharge: {
		cant: "[POKEMON] must recharge!",
	},
	recoil: {
		damage: "  [POKEMON] is damaged by the recoil!",
	},
	unboost: {
		fail: "  [POKEMON]'s stats were not lowered!",
		failSingular: "  [POKEMON]'s [STAT] was not lowered!",
	},
	struggle: {
		activate: "  [POKEMON] has no moves left!",
	},
	trapped: {
		start: "  [POKEMON] can no longer escape!",
	},

	// weather
	sandstorm: {
		weatherName: "Sandstorm",
		start: "  A sandstorm kicked up!",
		end: "  The sandstorm subsided.",
		upkeep: "  The sandstorm is raging.",
		damage: "  [POKEMON] is buffeted by the sandstorm!",
	},
	sunnyday: {
		weatherName: "Sun",
		start: "  The sunlight turned harsh!",
		end: "  The sunlight faded.",
		upkeep: "  (The sunlight is strong!)",
	},
	raindance: {
		weatherName: "Rain",
		start: "  It started to rain!",
		end: "  The rain stopped.",
		upkeep: "  (Rain continues to fall!)",
	},
	hail: {
		weatherName: "Hail",
		start: "  It started to hail!",
		end: "  The hail stopped.",
		upkeep: "  The hail is crashing down.",
		damage: "  [POKEMON] is buffeted by the hail!",
	},
	desolateland: {
		weatherName: "Intense Sun",
		start: "  The sunlight turned extremely harsh!",
		end: "  The extremely harsh sunlight faded.",
		block: "  The extremely harsh sunlight was not lessened at all!",
		blockMove: "  The Water-type attack evaporated in the harsh sunlight!",
	},
	primordialsea: {
		weatherName: "Heavy Rain",
		start: "  A heavy rain began to fall!",
		end: "  The heavy rain has lifted!",
		block: "  There is no relief from this heavy rain!",
		blockMove: "  The Fire-type attack fizzled out in the heavy rain!",
	},
	deltastream: {
		weatherName: "Strong Winds",
		start: "  Mysterious strong winds are protecting Flying-type Pok\u00E9mon!",
		end: "  The mysterious strong winds have dissipated!",
		activate: "  The mysterious strong winds weakened the attack!",
		block: "  The mysterious strong winds blow on regardless!",
	},

	// terrain
	electricterrain: {
		start: "  An electric current runs across the battlefield!",
		end: "  The electricity disappeared from the battlefield.",
		block: "  [POKEMON] surrounds itself with electrified terrain!",
	},
	grassyterrain: {
		start: "  Grass grew to cover the battlefield!",
		end: "  The grass disappeared from the battlefield.",
	},
	mistyterrain: {
		start: "  Mist swirls around the battlefield!",
		end: "  The mist disappeared from the battlefield.",
		block: "  [POKEMON] surrounds itself with a protective mist!",
	},
	psychicterrain: {
		start: "  The battlefield got weird!",
		end: "  The weirdness disappeared from the battlefield!",
		block: "  [POKEMON] surrounds itself with psychic terrain!",
	},

	// field effects
	gravity: {
		start: "  Gravity intensified!",
		end: "  Gravity returned to normal!",
		cant: "[POKEMON] can't use [MOVE] because of gravity!",
		activate: "[POKEMON] couldn't stay airborne because of gravity!",
	},
	magicroom: {
		start: "  It created a bizarre area in which Pok\u00E9mon's held items lose their effects!",
		end: "  Magic Room wore off, and held items' effects returned to normal!",
	},
	mudsport: {
		start: "  Electricity's power was weakened!",
		end: "  The effects of Mud Sport have faded.",
	},
	trickroom: {
		start: "  [POKEMON] twisted the dimensions!",
		end: "  The twisted dimensions returned to normal!",
	},
	watersport: {
		start: "  Fire's power was weakened!",
		end: "  The effects of Water Sport have faded.",
	},
	wonderroom: {
		start: "  It created a bizarre area in which Defense and Sp. Def stats are swapped!",
		end: "  Wonder Room wore off, and Defense and Sp. Def stats returned to normal!",
	},

	// moves
	afteryou: {
		activate: "  [TARGET] took the kind offer!",
	},
	aquaring: {
		start: "  [POKEMON] surrounded itself with a veil of water!",
		heal: "  A veil of water restored [POKEMON]'s HP!",
	},
	aromatherapy: {
		activate: "  A soothing aroma wafted through the area!",
	},
	attract: {
		start: "  [POKEMON] fell in love!",
		startFromItem: "  [POKEMON] fell in love from the [ITEM]!",
		end: "  [POKEMON] got over its infatuation!",
		endFromItem: "  [POKEMON] cured its infatuation using its [ITEM]!",
		activate: "  [POKEMON] is in love with [TARGET]!",
		cant: "[POKEMON] is immobilized by love!",
	},
	auroraveil: {
		start: "  Aurora Veil made [TEAM] stronger against physical and special moves!",
		end: "  [TEAM]'s Aurora Veil wore off!",
	},
	autotomize: {
		start: "  [POKEMON] became nimble!",
	},
	beakblast: {
		start: "  [POKEMON] started heating up its beak!",
	},
	beatup: {
		activate: "  [TARGET]'s attack!", // past gen only
	},
	bestow: {
		takeItem: "  [POKEMON] received [ITEM] from [SOURCE]!",
	},
	bide: {
		start: "  [POKEMON] is storing energy!",
		end: "  [POKEMON] unleashed its energy!",
		activate: "  [POKEMON] is storing energy!",
	},
	bind: {
		start: "  [POKEMON] was squeezed by [SOURCE]!",
		move: "#wrap", // gen 1 only
	},
	brickbreak: {
		activate: "  [POKEMON] shattered [TEAM]'s protections!",
	},
	bellydrum: {
		boost: "  [POKEMON] cut its own HP and maximized its Attack!"
	},
	bounce: {
		prepare: "[POKEMON] sprang up!",
	},
	bugbite: {
		removeItem: "  [SOURCE] stole and ate its target's [ITEM]!",
	},
	burnup: {
		typeChange: "  [POKEMON] burned itself out!",
	},
	celebrate: {
		activate: "  Congratulations, [TRAINER]!",
	},
	charge: {
		start: "  [POKEMON] began charging power!",
	},
	clamp: {
		start: "  [SOURCE] clamped down on [POKEMON]!",
		move: "#wrap", // gen 1 only
	},
	craftyshield: {
		start: "  Crafty Shield protected [TEAM]!",
		block: "  Crafty Shield protected [POKEMON]!",
	},
	crash: {
		damage: "  [POKEMON] kept going and crashed!",
	},
	curse: {
		start: "  [SOURCE] cut its own HP and put a curse on [POKEMON]!",
		damage: "  [POKEMON] is afflicted by the curse!",
	},
	darkvoid: {
		fail: "But [POKEMON] can't use the move!",
		failWrongForme: "But [POKEMON] can't use it the way it is now!",
	},
	destinybond: {
		start: "[POKEMON] is hoping to take its attacker down with it!",
		activate: "  [POKEMON] took its attacker down with it!",
	},
	dig: {
		prepare: "[POKEMON] burrowed its way under the ground!",
	},
	disable: {
		start: "  [POKEMON]'s [MOVE] was disabled!",
		end: "  [POKEMON]'s move is no longer disabled!",
	},
	dive: {
		prepare: "[POKEMON] hid underwater!",
	},
	doomdesire: {
		start: "  [POKEMON] chose Doom Desire as its destiny!",
		activate: "  [TARGET] took the Doom Desire attack!",
	},
	dragonascent: {
		megaNoItem: "  [TRAINER]'s fervent wish has reached [POKEMON]!",
	},
	electrify: {
		start: "  [POKEMON]'s moves have been electrified!",
	},
	embargo: {
		start: "  [POKEMON] can't use items anymore!",
		end: "  [POKEMON] can use items again!",
	},
	encore: {
		start: "  [POKEMON] received an encore!",
		end: "  [POKEMON]'s encore ended!",
	},
	endure: {
		start: "  [POKEMON] braced itself!",
		activate: "  [POKEMON] endured the hit!",
	},
	fairylock: {
		activate: "  No one will be able to run away during the next turn!",
	},
	feint: {
		activate: "  [TARGET] fell for the feint!",
	},
	firepledge: {
		activate: "#waterpledge",
		start: "  A sea of fire enveloped [TEAM]!",
		end: "  The sea of fire around [TEAM] disappeared!",
		damage: "  [POKEMON] is hurt by the sea of fire!",
	},
	firespin: {
		start: "  [POKEMON] became trapped in the fiery vortex!",
		move: "#wrap", // gen 1 only
	},
	flameburst: {
		damage: "  The bursting flame hit [POKEMON]!",
	},
	fling: {
		removeItem: "  [POKEMON] flung its [ITEM]!",
	},
	fly: {
		prepare: "[POKEMON] flew up high!",
	},
	focusenergy: {
		start: "  [POKEMON] is getting pumped!",
		startFromItem: "  [POKEMON] used the [ITEM] to get pumped!",
		startFromZEffect: "  [POKEMON] boosted its critical-hit ratio using its Z-Power!",
	},
	focuspunch: {
		start: "  [POKEMON] is tightening its focus!",
		cant: "[POKEMON] lost its focus and couldn't move!",
	},
	followme: {
		start: "  [POKEMON] became the center of attention!",
		startFromZEffect: "  [POKEMON] became the center of attention!",
	},
	foresight: {
		start: "  [POKEMON] was identified!",
	},
	freezeshock: {
		prepare: "  [POKEMON] became cloaked in a freezing light!",
	},
	futuresight: {
		start: "  [POKEMON] foresaw an attack!",
		activate: "  [TARGET] took the Future Sight attack!",
	},
	gastroacid: {
		start: "  [POKEMON]'s Ability was suppressed!",
	},
	geomancy: {
		prepare: "[POKEMON] is absorbing power!",
	},
	grasspledge: {
		activate: "#waterpledge",
		start: "  A swamp enveloped [TEAM]!",
		end: "  The swamp around [TEAM] disappeared!",
	},
	grudge: {
		activate: "  [POKEMON]'s [MOVE] lost all of its PP due to the grudge!",
		start: "[POKEMON] wants its target to bear a grudge!",
	},
	guardsplit: {
		activate: "  [POKEMON] shared its guard with the target!",
	},
	happyhour: {
		activate: "  Everyone is caught up in the happy atmosphere!",
	},
	healbell: {
		activate: "  A bell chimed!",
	},
	healblock: {
		start: "  [POKEMON] was prevented from healing!",
		end: "  [POKEMON]'s Heal Block wore off!",
		cant: "[POKEMON] can't use [MOVE] because of Heal Block!",
	},
	healingwish: {
		heal: "  The healing wish came true for [POKEMON]!",
	},
	helpinghand: {
		start: "  [SOURCE] is ready to help [POKEMON]!",
	},
	highjumpkick: {
		damage: "#crash",
	},
	hyperspacefury: {
		activate: "#shadowforce",
		fail: "#darkvoid",
	},
	hyperspacehole: {
		activate: "#shadowforce",
	},
	iceburn: {
		prepare: "  [POKEMON] became cloaked in freezing air!",
	},
	imprison: {
		start: "  [POKEMON] sealed any moves its target shares with it!",
		cant: "[POKEMON] can't use its sealed [MOVE]!",
	},
	incinerate: {
		removeItem: "  [POKEMON]'s [ITEM] was burned up!",
	},
	infestation: {
		start: "  [POKEMON] has been afflicted with an infestation by [SOURCE]!",
	},
	ingrain: {
		start: "  [POKEMON] planted its roots!",
		block: "  [POKEMON] anchored itself with its roots!",
		heal: "  [POKEMON] absorbed nutrients with its roots!",
	},
	instruct: {
		activate: "  [TARGET] used the move instructed by [POKEMON]!",
	},
	iondeluge: {
		activate: "  A deluge of ions showers the battlefield!",
	},
	jumpkick: {
		damage: "#crash",
	},
	knockoff: {
		removeItem: "  [SOURCE] knocked off [POKEMON]'s [ITEM]!",
	},
	laserfocus: {
		start: "  [POKEMON] concentrated intensely!",
	},
	leechseed: {
		start: "  [POKEMON] was seeded!",
		end: "  [POKEMON] was freed from Leech Seed!",
		damage: "  [POKEMON]'s health is sapped by Leech Seed!",
	},
	lightscreen: {
		start: "  Light Screen made [TEAM] stronger against special moves!",
		end: "  [TEAM]'s Light Screen wore off!",
		// gen 1
		startGen1: "  [POKEMON]'s protected against special attacks!",
	},
	lockon: {
		start: "  [SOURCE] took aim at [POKEMON]!",
	},
	luckychant: {
		start: "  Lucky Chant shielded [TEAM] from critical hits!",
		end: "  [TEAM]'s Lucky Chant wore off!",
	},
	lunardance: {
		heal: "  [POKEMON] became cloaked in mystical moonlight!",
	},
	magiccoat: {
		start: "  [POKEMON] shrouded itself with Magic Coat!",
		move: "[POKEMON] bounced the [MOVE] back!",
	},
	magikarpsrevenge: {
		fail: "#darkvoid",
	},
	magmastorm: {
		start: "  [POKEMON] became trapped by swirling magma!",
	},
	magnitude: {
		activate: "  Magnitude [NUMBER]!",
	},
	matblock: {
		start: "  [POKEMON] intends to flip up a mat and block incoming attacks!",
		block: "  [MOVE] was blocked by the kicked-up mat!",
	},
	magnetrise: {
		start: "  [POKEMON] levitated with electromagnetism!",
		end: "  [POKEMON]'s electromagnetism wore off!",
		// "The electromagnetism of [POKEMON] wore off!" // PO artifact?
	},
	memento: {
		heal: "  [POKEMON]'s HP was restored by the Z-Power!",
	},
	metronome: {
		move: "Waggling a finger let it use [MOVE]!",
	},
	mimic: {
		start: "  [POKEMON] learned [MOVE]!",
	},
	mindreader: {
		start: "#lockon",
	},
	miracleeye: {
		start: "#foresight",
	},
	mist: {
		start: "  [TEAM] became shrouded in mist!",
		end: "  [TEAM] is no longer protected by mist!",
		block: "  [POKEMON] is protected by the mist!",
	},
	naturepower: {
		move: "Nature Power turned into [MOVE]!",
	},
	nightmare: {
		start: "  [POKEMON] began having a nightmare!",
		damage: "  [POKEMON] is locked in a nightmare!",
	},
	painsplit: {
		activate: "  The battlers shared their pain!",
	},
	partingshot: {
		heal: "#memento",
	},
	payday: {
		activate: "  Coins were scattered everywhere!",
	},
	perishsong: {
		start: "  All Pok\u00E9mon that heard the song will faint in three turns!",
		activate: "  [POKEMON]'s perish count fell to [NUMBER].",
	},
	phantomforce: {
		prepare: "#shadowforce",
		activate: "#shadowforce",
	},
	pluck: {
		removeItem: '#bugbite',
	},
	powder: {
		start: "  [POKEMON] is covered in powder!",
		activate: "  When the flame touched the powder on the Pok\u00E9mon, it exploded!",
	},
	powersplit: {
		activate: "  [POKEMON] shared its power with the target!",
	},
	powertrick: {
		start: "  [POKEMON] switched its Attack and Defense!",
		end: '#.start',
	},
	protect: {
		start: "  [POKEMON] protected itself!",
		block: "  [POKEMON] protected itself!",
	},
	pursuit: {
		activate: "  ([TARGET] is being withdrawn...)",
	},
	quash: {
		activate: "  [TARGET]'s move was postponed!",
	},
	quickguard: {
		start: "  Quick Guard protected [TEAM]!",
		block: "  Quick Guard protected [POKEMON]!",
	},
	ragepowder: {
		start: '#followme',
		startFromZEffect: '#followme',
	},
	razorwind: {
		prepare: "  [POKEMON] whipped up a whirlwind!",
	},
	recycle: {
		addItem: "  [POKEMON] found one [ITEM]!",
	},
	reflect: {
		start: "  Reflect made [TEAM] stronger against physical moves!",
		end: "  [TEAM]'s Reflect wore off!",
		// gen 1
		startGen1: "  [POKEMON] gained armor!",
	},
	reflecttype: {
		typeChange: "  [POKEMON]'s type became the same as [SOURCE]'s type!",
	},
	roleplay: {
		changeAbility: "  [POKEMON] copied [SOURCE]'s [ABILITY] Ability!",
	},
	roost: {
		start: "  ([POKEMON] loses Flying type this turn.)",
	},
	safeguard: {
		start: "  [TEAM] cloaked itself in a mystical veil!",
		end: "  [TEAM] is no longer protected by Safeguard!",
		block: "  [POKEMON] is protected by Safeguard!",
	},
	sandtomb: {
		start: "  [POKEMON] became trapped by the quicksand!",
	},
	shadowforce: {
		activate: "  It broke through [TARGET]'s protection!",
		prepare: "[POKEMON] vanished instantly!",
	},
	shelltrap: {
		start: "  [POKEMON] set a shell trap!",
		prepare: "  [POKEMON] set a shell trap!",
		cant: "[POKEMON]'s shell trap didn't work!",
	},
	sketch: {
		activate: "  [POKEMON] sketched [MOVE]!",
	},
	skillswap: {
		activate: "  [POKEMON] swapped Abilities with its target!",
	},
	skullbash: {
		prepare: "[POKEMON] tucked in its head!",
	},
	skyattack: {
		prepare: "[POKEMON] became cloaked in a harsh light!",
	},
	skydrop: {
		prepare: "[POKEMON] took [TARGET] into the sky!",
		end: "  [POKEMON] was freed from the Sky Drop!",
		failSelect: "Sky Drop won't let [POKEMON] go!",
		failTooHeavy: "  [POKEMON] is too heavy to be lifted!",
	},
	smackdown: {
		start: "  [POKEMON] fell straight down!",
	},
	snatch: {
		start: "  [POKEMON] waits for a target to make a move!",
		activate: "  [POKEMON] snatched [TARGET]'s move!",
	},
	solarbeam: {
		prepare: "  [POKEMON] absorbed light!",
	},
	solarblade: {
		prepare: "#solarbeam",
	},
	spectralthief: {
		clearBoost: "  [SOURCE] stole the target's boosted stats!",
	},
	speedswap: {
		activate: "  [POKEMON] switched Speed with its target!",
	},
	spikes: {
		start: "  Spikes were scattered on the ground all around [TEAM]!",
		end: "  The spikes disappeared from the ground around [TEAM]!",
		damage: "  [POKEMON] is hurt by the spikes!",
	},
	spikyshield: {
		damage: "#roughskin",
	},
	spite: {
		activate: "  It reduced the PP of [TARGET]'s [MOVE] by [NUMBER]!",
	},
	splash: {
		activate: "  But nothing happened!",
	},
	spotlight: {
		start: "#followme",
		startFromZEffect: "#followme",
	},
	stealthrock: {
		start: "  Pointed stones float in the air around [TEAM]!",
		end: "  The pointed stones disappeared from around [TEAM]!",
		damage: "  Pointed stones dug into [POKEMON]!",
	},
	stickyweb: {
		start: "  A sticky web spreads out on the ground around [TEAM]!",
		end: "  The sticky web has disappeared from the ground around [TEAM]!",
		activate: "  [POKEMON] was caught in a sticky web!",
	},
	stockpile: {
		start: "  [POKEMON] stockpiled [NUMBER]!",
		end: "  [POKEMON]'s stockpiled effect wore off!",
	},
	substitute: {
		start: "  [POKEMON] put in a substitute!",
		alreadyStarted: "  [POKEMON] already has a substitute!",
		end: "  [POKEMON]'s substitute faded!",
		fail: "  But it does not have enough HP left to make a substitute!",
		activate: "  The substitute took damage for [POKEMON]!",
	},
	switcheroo: {
		activate: "#trick",
	},
	tailwind: {
		start: "  The Tailwind blew from behind [TEAM]!",
		end: "  [TEAM]'s Tailwind petered out!",
	},
	taunt: {
		start: "  [POKEMON] fell for the taunt!",
		end: "  [POKEMON]'s taunt wore off!",
		cant: "[POKEMON] can't use [MOVE] after the taunt!",
	},
	telekinesis: {
		start: "  [POKEMON] was hurled into the air!",
		end: "  [POKEMON] was freed from the telekinesis!",
	},
	throatchop: {
		cant: "The effects of Throat Chop prevent [POKEMON] from using certain moves!",
	},
	torment: {
		start: "  [POKEMON] was subjected to torment!",
		end: "  [POKEMON]'s torment wore off!",
	},
	toxicspikes: {
		start: "  Poison spikes were scattered on the ground all around [TEAM]!",
		end: "  The poison spikes disappeared from the ground around [TEAM]!",
	},
	transform: {
		transform: "[POKEMON] transformed into [SPECIES]!",
	},
	trick: {
		activate: "  [POKEMON] switched items with its target!",
	},
	uproar: {
		start: "  [POKEMON] caused an uproar!",
		end: "  [POKEMON] calmed down.",
		upkeep: "  [POKEMON] is making an uproar!",
		block: "  But the uproar kept [POKEMON] awake!",
		blockSelf: "  [POKEMON] can't sleep in an uproar!",
	},
	uturn: {
		switchOut: "[POKEMON] went back to [TRAINER]!",
	},
	voltswitch: {
		switchOut: '#uturn',
	},
	waterpledge: {
		activate: "  [POKEMON] is waiting for [TARGET]'s move...",
		start: "  A rainbow appeared in the sky on [TEAM]'s side!",
		end: "  The rainbow on [TEAM]'s side disappeared!",
	},
	weatherball: {
		move: "Breakneck Blitz turned into [MOVE] due to the weather!",
	},
	whirlpool: {
		start: "  [POKEMON] became trapped in the vortex!",
	},
	wideguard: {
		start: "  Wide Guard protected [TEAM]!",
		block: "  Wide Guard protected [POKEMON]!",
	},
	wish: {
		heal: "  [NICKNAME]'s wish came true!",
	},
	wrap: {
		start: "  [POKEMON] was wrapped by [SOURCE]!",
		move: "[POKEMON]'s attack continues!", // gen 1 only
	},
	yawn: {
		start: "  [POKEMON] grew drowsy!",
	},

	// abilities
	aftermath: {
		damage: "  [POKEMON] is hurt!",
	},
	airlock: {
		start: "  The effects of the weather disappeared.",
	},
	angerpoint: {
		boost: "  [POKEMON] maxed its Attack!",
	},
	anticipation: {
		activate: "  [POKEMON] shuddered!",
	},
	aromaveil: {
		block: "  [POKEMON] is protected by an aromatic veil!",
	},
	aurabreak: {
		start: "  [POKEMON] reversed all other Pok\u00E9mon's auras!",
	},
	baddreams: {
		damage: "  [POKEMON] is tormented!",
	},
	battlebond: {
		activate: "  [POKEMON] became fully charged due to its bond with its Trainer!",
		transform: "[POKEMON] became Ash-Greninja!",
	},
	blacksludge: {
		heal: "  [POKEMON] restored a little HP using its Black Sludge!",
	},
	cloudnine: {
		start: "#airlock",
	},
	comatose: {
		start: "  [POKEMON] is drowsing!",
	},
	damp: {
		cant: "[POKEMON] cannot use [MOVE]!",
	},
	darkaura: {
		start: "  [POKEMON] is radiating a dark aura!",
	},
	dazzling: {
		cant: "#damp",
	},
	disguise: {
		block: "  Its disguise served it as a decoy!",
		transform: "[POKEMON]'s disguise was busted!",
	},
	dryskin: {
		damage: "  ([POKEMON] was hurt by its Dry Skin.)",
	},
	fairyaura: {
		start: "  [POKEMON] is radiating a fairy aura!",
	},
	flashfire: {
		start: "  The power of [POKEMON]'s Fire-type moves rose!",
	},
	flowerveil: {
		block: "  [POKEMON] surrounded itself with a veil of petals!",
	},
	forewarn: {
		activate: "  It was alerted to [TARGET]'s [MOVE]!",
		activateNoTarget: "  [POKEMON]'s Forewarn alerted it to [MOVE]!",
	},
	frisk: {
		activate: "  [POKEMON] frisked [TARGET] and found its [ITEM]!",
		activateNoTarget: "  [POKEMON] frisked its target and found one [ITEM]!",
	},
	harvest: {
		addItem: "  [POKEMON] harvested one [ITEM]!",
	},
	illusion: {
		end: "  [POKEMON]'s illusion wore off!",
	},
	innardsout: {
		damage: "#aftermath",
	},
	ironbarbs: {
		damage: "#roughskin",
	},
	leftovers: {
		heal: "  [POKEMON] restored a little HP using its Leftovers!",
	},
	lightningrod: {
		activate: "  [POKEMON] took the attack!",
	},
	liquidooze: {
		damage: "  [POKEMON] sucked up the liquid ooze!",
	},
	magicbounce: {
		move: '#magiccoat',
	},
	mindblown: {
		damage: "  ([POKEMON] cut its own HP to power up its move!)",
	},
	moldbreaker: {
		start: "  [POKEMON] breaks the mold!",
	},
	mummy: {
		changeAbility: "  [TARGET]'s Ability became Mummy!",
	},
	naturalcure: {
		activate: "  ([POKEMON] is cured by its Natural Cure!)",
	},
	owntempo: {
		block: "  [POKEMON] doesn't become confused!",
	},
	persistent: {
		activate: "  [POKEMON] extends [MOVE] by 2 turns!",
	},
	pickup: {
		addItem: '#recycle',
	},
	powerconstruct: {
		activate: "  You sense the presence of many!",
		transform: "[POKEMON] transformed into its Complete Forme!",
	},
	powerofalchemy: {
		changeAbility: "#receiver",
	},
	pressure: {
		start: "  [POKEMON] is exerting its pressure!",
	},
	queenlymajesty: {
		cant: "#damp",
	},
	rebound: {
		move: '#magiccoat',
	},
	receiver: {
		changeAbility: "  [SOURCE]'s [ABILITY] was taken over!",
	},
	rockyhelmet: {
		damage: "  [POKEMON] was hurt by the Rocky Helmet!",
	},
	roughskin: {
		damage: "  [POKEMON] was hurt!",
	},
	schooling: {
		transform: "[POKEMON] formed a school!",
		transformEnd: "[POKEMON] stopped schooling!",
	},
	shellbell: {
		heal: "  [POKEMON] restored a little HP using its Shell Bell!",
	},
	shieldsdown: {
		// n.b. this isn't a bug, the game actually says "Shields Down deactivated" on first transformation
		// https://www.youtube.com/watch?v=SThjYBz4SEA
		transform: "Shields Down deactivated!\n([POKEMON] shielded itself.)",
		transformEnd: "Shields Down activated!\n([POKEMON] stopped shielding itself.)",
	},
	slowstart: {
		start: "  [POKEMON] can't get it going!",
		end: "  [POKEMON] finally got its act together!",
	},
	solarpower: {
		damage: "  ([POKEMON] was hurt by its Solar Power.)",
	},
	stancechange: {
		transform: "Changed to Blade Forme!",
		transformEnd: "Changed to Shield Forme!",
	},
	stickyhold: {
		block: "  [POKEMON]'s item cannot be removed!",
	},
	stormdrain: {
		activate: "#lightningrod",
	},
	sturdy: {
		activate: "  [POKEMON] endured the hit!",
	},
	suctioncups: {
		block: "  [POKEMON] anchors itself!",
	},
	sweetveil: {
		block: "  [POKEMON] surrounded itself with a veil of sweetness!",
	},
	symbiosis: {
		activate: "  [POKEMON] shared its [ITEM] with [TARGET]!",
	},
	telepathy: {
		block: "  [POKEMON] avoids attacks by its ally Pok\u00E9mon!",
	},
	teravolt: {
		start: "  [POKEMON] is radiating a bursting aura!",
	},
	trace: {
		changeAbility: "  [POKEMON] traced [SOURCE]'s [ABILITY]!",
	},
	truant: {
		cant: "[POKEMON] is loafing around!",
	},
	turboblaze: {
		start: "  [POKEMON] is radiating a blazing aura!",
	},
	unnerve: {
		start: "  [TEAM] is too nervous to eat Berries!",
	},
	zenmode: {
		transform: 'Zen Mode triggered!',
		transformEnd: 'Zen Mode ended!',
	},

	// items
	airballoon: {
		start: "  [POKEMON] floats in the air with its Air Balloon!",
		end: "  [POKEMON]'s Air Balloon popped!",
	},
	custapberry: {
		activate: "  [POKEMON]'s Custap Berry let it move first!",
	},
	ejectbutton: {
		end: "  [POKEMON] is switched out with the Eject Button!",
	},
	focusband: {
		activate: "  [POKEMON] hung on using its Focus Band!",
	},
	focussash: {
		end: "  [POKEMON] hung on using its Focus Sash!",
	},
	leppaberry: {
		activate: "  [POKEMON] restored PP to its [MOVE] move using Leppa Berry!",
	},
	lifeorb: {
		damage: "  [POKEMON] lost some of its HP!",
	},
	mysteryberry: {
		activate: "  [POKEMON] restored PP to its [MOVE] move using Mystery Berry!",
	},
	powerherb: {
		end: "  [POKEMON] became fully charged due to its Power Herb!",
	},
	protectivepads: {
		block: "  [POKEMON] protected itself with the Protective Pads!",
	},
	quickclaw: {
		activate: "  [POKEMON]'s Quick Claw let it move first!",
	},
	redcard: {
		end: "  [POKEMON] held up its Red Card against [TARGET]!",
	},
	safetygoggles: {
		block: "  [POKEMON] is not affected by [MOVE] thanks to its Safety Goggles!",
	},
	ultranecroziumz: {
		transform: "  Bright light is about to burst out of [POKEMON]!",
		activate: "[POKEMON] regained its true power through Ultra Burst!",
	},
	whiteherb: {
		end: "  [POKEMON] returned its status to normal using its White Herb!",
	},
};
