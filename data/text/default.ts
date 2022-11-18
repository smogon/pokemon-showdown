export const DefaultText: {[k: string]: DefaultText} = {
	default: {
		startBattle: "Battle started between [TRAINER] and [TRAINER]!",
		winBattle: "**[TRAINER]** won the battle!",
		tieBattle: "Tie between [TRAINER] and [TRAINER]!",

		pokemon: "[NICKNAME]",
		opposingPokemon: "the opposing [NICKNAME]",
		team: "your team",
		opposingTeam: "the opposing team",
		party: "your ally Pok\u00E9mon",
		opposingParty: "the opposing Pok\u00E9mon",

		turn: "== Turn [NUMBER] ==",
		switchIn: "[TRAINER] sent out [FULLNAME]!",
		switchInOwn: "Go! [FULLNAME]!",
		switchOut: "[TRAINER] withdrew [NICKNAME]!",
		switchOutOwn: "[NICKNAME], come back!",
		drag: "[FULLNAME] was dragged out!",
		faint: "[POKEMON] fainted!",
		swap: "[POKEMON] and [TARGET] switched places!",
		swapCenter: "[POKEMON] moved to the center!",

		// Multi Battles only
		canDynamax: "  [TRAINER] can dynamax now!",
		canDynamaxOwn: "  Dynamax Energy gathered around [TRAINER]!",

		zEffect: "  [POKEMON] unleashes its full-force Z-Move!",
		move: "[POKEMON] used **[MOVE]**!",
		abilityActivation: "[[POKEMON]'s [ABILITY]]",

		mega: "  [POKEMON]'s [ITEM] is reacting to the Key Stone!",
		megaNoItem: "  [POKEMON] is reacting to [TRAINER]'s Key Stone!",
		megaGen6: "  [POKEMON]'s [ITEM] is reacting to [TRAINER]'s Mega Bracelet!",
		transformMega: "[POKEMON] has Mega Evolved into Mega [SPECIES]!",
		primal: "[POKEMON]'s Primal Reversion! It reverted to its primal state!",
		zPower: "  [POKEMON] surrounded itself with its Z-Power!",
		zBroken: "  [POKEMON] couldn't fully protect itself and got hurt!",
		terastallize: "  [POKEMON] has Terastallized into the [TYPE]-type!", // filler

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] can't use [MOVE]!",
		cantNoMove: "[POKEMON] can't move!",
		fail: "  But it failed!",

		// n.b. this is the default message for in-battle forme changes
		// for the move Transform and ability Imposter, see the entry for the move Transform
		transform: "[POKEMON] transformed!",
		typeChange: "  [POKEMON]'s type changed to [TYPE]!",
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
		eatItem: "  ([POKEMON] ate its [ITEM]!)",
		useGem: "  The [ITEM] strengthened [POKEMON]'s power!",
		eatItemWeaken: "  The [ITEM] weakened damage to [POKEMON]!",
		removeItem: "  [POKEMON] lost its [ITEM]!",
		activateItem: "  ([POKEMON] used its [ITEM]!)",
		activateWeaken: "  The [ITEM] weakened the damage to [POKEMON]!",

		damage: "  ([POKEMON] was hurt!)",
		damagePercentage: "  ([POKEMON] lost [PERCENTAGE] of its health!)",
		damageFromPokemon: "  [POKEMON] was hurt by [SOURCE]'s [ITEM]!", // Jaboca/Rowap Berry
		damageFromItem: "  [POKEMON] was hurt by its [ITEM]!", // Sticky Barb
		damageFromPartialTrapping: "  [POKEMON] is hurt by [MOVE]!",
		heal: "  [POKEMON] had its HP restored.",
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
		hitCount: "  The Pok\u00E9mon was hit [NUMBER] times!",
		hitCountSingular: "  The Pok\u00E9mon was hit 1 time!",
	},

	// stats
	hp: {
		statName: "HP",
		statShortName: "HP",
	},
	atk: {
		statName: "Attack",
		statShortName: "Atk",
	},
	def: {
		statName: "Defense",
		statShortName: "Def",
	},
	spa: {
		statName: "Sp. Atk",
		statShortName: "SpA",
	},
	spd: {
		statName: "Sp. Def",
		statShortName: "SpD",
	},
	spe: {
		statName: "Speed",
		statShortName: "Spe",
	},
	accuracy: {
		statName: "accuracy",
	},
	evasion: {
		statName: "evasiveness",
	},
	spc: {
		statName: "Special",
		statShortName: "Spc",
	},
	stats: {
		statName: "stats",
	},

	// statuses
	brn: {
		start: "  [POKEMON] was burned!",
		startFromItem: "  [POKEMON] was burned by the [ITEM]!",
		alreadyStarted: "  [POKEMON] is already burned!",
		end: "  [POKEMON]'s burn was healed!",
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
		alreadyStarted: "  [POKEMON] is already paralyzed!",
		end: "  [POKEMON] was cured of paralysis!",
		endFromItem: "  [POKEMON]'s [ITEM] cured its paralysis!",
		cant: "[POKEMON] is paralyzed! It can't move!",
	},
	psn: {
		start: "  [POKEMON] was poisoned!",
		alreadyStarted: "  [POKEMON] is already poisoned!",
		end: "  [POKEMON] was cured of its poisoning!",
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
	heal: {
		fail: "  [POKEMON]'s HP is full!",
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
		damage: "  [POKEMON] was damaged by the recoil!",
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
	dynamax: {
		start: "  ([POKEMON]'s Dynamax!)",
		end: "  ([POKEMON] returned to normal!)",
		block: "  The move was blocked by the power of Dynamax!",
		fail: "  [POKEMON] shook its head. It seems like it can't use this move...",
	},

	// weather
	sandstorm: {
		weatherName: "Sandstorm",
		start: "  A sandstorm kicked up!",
		end: "  The sandstorm subsided.",
		upkeep: "  (The sandstorm is raging.)",
		damage: "  [POKEMON] is buffeted by the sandstorm!",
	},
	sunnyday: {
		weatherName: "Sun",
		start: "  The sunlight turned harsh!",
		end: "  The harsh sunlight faded.",
		upkeep: "  (The sunlight is strong.)",
	},
	raindance: {
		weatherName: "Rain",
		start: "  It started to rain!",
		end: "  The rain stopped.",
		upkeep: "  (Rain continues to fall.)",
	},
	hail: {
		weatherName: "Hail",
		start: "  It started to hail!",
		end: "  The hail stopped.",
		upkeep: "  (The hail is crashing down.)",
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
		start: "  An electric current ran across the battlefield!",
		end: "  The electricity disappeared from the battlefield.",
		block: "  [POKEMON] is protected by the Electric Terrain!",
	},
	grassyterrain: {
		start: "  Grass grew to cover the battlefield!",
		end: "  The grass disappeared from the battlefield.",
		heal: "  [POKEMON]'s HP was restored.",
	},
	mistyterrain: {
		start: "  Mist swirled around the battlefield!",
		end: "  The mist disappeared from the battlefield.",
		block: "  [POKEMON] surrounds itself with a protective mist!",
	},
	psychicterrain: {
		start: "  The battlefield got weird!",
		end: "  The weirdness disappeared from the battlefield!",
		block: "  [POKEMON] is protected by the Psychic Terrain!",
	},

	// field effects
	gravity: {
		start: "  Gravity intensified!",
		end: "  Gravity returned to normal!",
		cant: "[POKEMON] can't use [MOVE] because of gravity!",
		activate: "[POKEMON] fell from the sky due to the gravity!",
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

	// misc
	crash: {
		damage: "  [POKEMON] kept going and crashed!",
	},
};
