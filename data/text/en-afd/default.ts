export const DefaultText: { [id: IDEntry]: DefaultText } = {
	default: {
		// April Fool's 2019
		// April Fool's 2025: tone down the most common text
		// (I think the jokes work best as a surprise, when most of the
		// text is the same as before.)

		// startBattle: "[TRAINER] and [TRAINER] commence battle!",
		// winBattle: "**[TRAINER]** is victorious!",
		// tieBattle: "The feud between [TRAINER] and [TRAINER] remains unresolved!",

		// pokemon: "[NICKNAME]",
		// opposingPokemon: "a villainous [NICKNAME]",
		// team: "your faithful alliance",
		// opposingTeam: "the forces of evil",
		// party: "our blessed allies",
		// opposingParty: "the barbarous opposition",

		// turn: "== Phase [NUMBER] ==",
		// switchIn: "[TRAINER] would have us contend with [FULLNAME]!",
		// switchInOwn: "[FULLNAME]! Honor demands your presence!",
		// switchOut: "[TRAINER] has other plans for [NICKNAME]!",
		// switchOutOwn: "[NICKNAME], the time for retreat is upon us!",
		// drag: "[FULLNAME] was unprepared to join us!",
		// faint: "[POKEMON]'s service has concluded.",
		// swap: "[POKEMON] and [TARGET] switched places!",
		// swapCenter: "[POKEMON] moved to the center!",

		// zEffect: "  [POKEMON] isn't holding back anymore!",
		// move: "[POKEMON] unleashes **[MOVE]**!",
		// abilityActivation: "  [[POKEMON]'s [ABILITY]]",

		mega: "  [POKEMON]'s [ITEM] glows!",
		megaNoItem: "  [POKEMON]'s lack of Mega Stone glows!",
		megaGen6: "  [POKEMON]'s [ITEM] glows!",
		transformMega: "[POKEMON] thinks it's a big deal!",
		primal: "[POKEMON]'s reversion! It got nostalgic about the old days!",
		zPower: "  [POKEMON] is about to stop holding back!",
		zBroken: "  [POKEMON]'s shields are failing!",
		terastallize: "  [POKEMON] is cosplaying as [TYPE]-type!",

		// in case the different default messages didn't make it obvious, the difference
		// is that the `cant` message REPLACES "Pokemon used Move!", while the `fail`
		// message happens AFTER "Pokemon used Move!"
		cant: "[POKEMON] can't use [MOVE]!",
		cantNoMove: "[POKEMON] can't move!",
		fail: "  Things did not go as planned!",

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
		damagePercentage: "  ([POKEMON] lost [PERCENTAGE]% of its health!)",
		damageFromPokemon: "  [POKEMON] is hurt by [SOURCE]'s [ITEM]!", // Jaboca/Rowap Berry
		damageFromItem: "  [POKEMON] is hurt by its [ITEM]!", // Sticky Barb
		damageFromPartialTrapping: "  [POKEMON] is hurt by [MOVE]!",
		heal: "  [POKEMON] restored its HP.",
		healFromZEffect: "  [POKEMON] restored its HP using its Z-Power!",
		healFromEffect: "  [POKEMON] restored HP using its [EFFECT]!",

		boost: "  [POKEMON]'s [STAT] increased!",
		boost2: "  [POKEMON]'s [STAT] increased twice!",
		boost3: "  [POKEMON]'s [STAT] increased a lot!",
		boost0: "  [POKEMON]'s [STAT] won't go any higher!",
		boostFromItem: "  The [ITEM] raised [POKEMON]'s [STAT]!",
		boost2FromItem: "  The [ITEM] raised [POKEMON]'s [STAT] twice!",
		boost3FromItem: "  The [ITEM] raised [POKEMON]'s [STAT] a lot!",
		boostFromZEffect: "  [POKEMON] boosted its [STAT] using its Z-Power!",
		boost2FromZEffect: "  [POKEMON] boosted its [STAT] twice using its Z-Power!",
		boost3FromZEffect: "  [POKEMON] boosted its [STAT] a lot using its Z-Power!",
		boostMultipleFromZEffect: "  [POKEMON] boosted its stats using its Z-Power!",

		unboost: "  [POKEMON]'s [STAT] was lowered!",
		unboost2: "  [POKEMON]'s [STAT] was lowered twice!",
		unboost3: "  [POKEMON]'s [STAT] was lowered a lot!",
		unboost0: "  [POKEMON]'s [STAT] won't go any lower!",
		unboostFromItem: "  The [ITEM] lowered [POKEMON]'s [STAT]!",
		unboost2FromItem: "  The [ITEM] lowered [POKEMON]'s [STAT] twice!",
		unboost3FromItem: "  The [ITEM] lowered [POKEMON]'s [STAT] a lot!",

		swapBoost: "  [POKEMON] switched stat changes with its target!",
		swapOffensiveBoost: "  [POKEMON] switched all changes to its Strength and Intelligence with its target!",
		swapDefensiveBoost: "  [POKEMON] switched all changes to its Armor and Resistance with its target!",
		copyBoost: "  [POKEMON] copied [TARGET]'s stat changes!",
		clearBoost: "  [POKEMON]'s stat changes were removed!",
		clearBoostFromZEffect: "  [POKEMON] returned its decreased stats to normal using its Z-Power!",
		invertBoost: "  [POKEMON]'s stat changes were inverted!",
		clearAllBoost: "  All stat changes were eliminated!",

		superEffective: "  It hit its enemy's weakness!",
		superEffectiveSpread: "  It hit [POKEMON]'s weakness!",
		resisted: "  It was resisted...",
		resistedSpread: "  [POKEMON] resisted the attack.",
		crit: "  A lucky hit! Remember to buy crit insurance!",
		critSpread: "  A lucky hit on [POKEMON]! How dare you!",
		immune: "  [POKEMON] is immune to such dastardly tricks!",
		immuneNoPokemon: "  The foe was immune!", // old gens
		immuneOHKO: "  [POKEMON] is unaffected!",
		miss: "  [POKEMON] avoided the attack!",
		missNoPokemon: "  [SOURCE]'s attack missed!", // old gens

		center: "  Automatic center!",
		noTarget: "  But there was no target...", // gen 5 and earlier
		ohko: "  It's a one-hit KO!",
		combine: "  The two moves have become one! It's a combined move!",
		hitCount: "  Hit [NUMBER] [INFLECT:NUMBER:s=time:p=times]!",
	},
	dynamax: {
		// April Fool's 2020
		start: "  ([POKEMON]'s Tinymax!)",
		end: "  ([POKEMON] returned to normal!)",
		block: "  The move was blocked by the power of Tinymax!",
		fail: "  [POKEMON] shook its head. It seems like it can't use this move...",
	},

	// stats
	hp: {
		statName: "Constitution",
		statShortName: "HP",
	},
	atk: {
		statName: "Strength",
		statShortName: "Atk",
	},
	def: {
		statName: "Armor",
		statShortName: "Def",
	},
	spa: {
		statName: "Intelligence",
		statShortName: "SpA",
	},
	spd: {
		statName: "Resistance",
		statShortName: "SpD",
	},
	spe: {
		statName: "Agility",
		statShortName: "Spe",
	},
	accuracy: {
		statName: "accuracy",
	},
	evasion: {
		statName: "evasiveness",
	},
	spc: {
		statName: "Intelligence",
		statShortName: "Spc",
	},
	stats: {
		statName: "stats",
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
		heal: "  [SOURCE] will find its attacker's health restored!",
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
		fail: "  [POKEMON]'s [STAT] [INFLECT:STAT:s=was:p=were] not lowered!",
	},
	struggle: {
		activate: "  [POKEMON] has no moves left!",
	},
	trapped: {
		start: "  [POKEMON] can no longer escape!",
	},
};
