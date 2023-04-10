export const AbilitiesText: {[k: string]: AbilityText} = {
	noability: {
		name: "No Ability",
		shortDesc: "Does nothing.",
	},
	adaptability: {
		name: "Adaptability",
		desc: "This Pokemon's moves that match one of its types have a same-type attack bonus (STAB) of 2 instead of 1.5.",
		shortDesc: "This Pokemon's same-type attack bonus (STAB) is 2 instead of 1.5.",
	},
	aerilate: {
		name: "Aerilate",
		desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.2x power.",
		gen6: {
			desc: "This Pokemon's Normal-type moves become Flying-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
			shortDesc: "This Pokemon's Normal-type moves become Flying type and have 1.3x power.",
		},
	},
	aftermath: {
		name: "Aftermath",
		desc: "If this Pokemon is knocked out with a contact move, that move's user loses 1/4 of its maximum HP, rounded down. If any active Pokemon has the Damp Ability, this effect is prevented.",
		shortDesc: "If this Pokemon is KOed with a contact move, that move's user loses 1/4 its max HP.",

		damage: "  [POKEMON] was hurt!",
	},
	airlock: {
		name: "Air Lock",
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",

		start: "  The effects of the weather disappeared.",
	},
	analytic: {
		name: "Analytic",
		desc: "The power of this Pokemon's move is multiplied by 1.3 if it is the last to move in a turn. Does not affect Doom Desire and Future Sight.",
		shortDesc: "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.",
	},
	angerpoint: {
		name: "Anger Point",
		desc: "If this Pokemon, but not its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
		shortDesc: "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.",
		gen4: {
			desc: "If this Pokemon, or its substitute, is struck by a critical hit, its Attack is raised by 12 stages.",
			shortDesc: "If this Pokemon or its substitute takes a critical hit, its Attack is raised 12 stages.",
		},

		boost: "  [POKEMON] maxed its Attack!",
	},
	angershell: {
		name: "Anger Shell",
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage from an attack bringing it to 1/2 or less of its maximum HP, its Attack, Special Attack, and Speed are raised by 1 stage, and its Defense and Special Defense are lowered by 1 stage. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability.",
		shortDesc: "At 1/2 or less of this Pokemon's max HP: +1 Atk, Sp. Atk, Spe, and -1 Def, Sp. Def.",
	},
	anticipation: {
		name: "Anticipation",
		desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective against this Pokemon, or an OHKO move. This effect considers any move that deals direct damage as an attacking move of its respective type, Hidden Power counts as its determined type, and Judgment, Multi-Attack, Natural Gift, Revelation Dance, Techno Blast, and Weather Ball are considered Normal-type moves.",
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.",
		gen6: {
			desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective against this Pokemon, or an OHKO move. This effect considers any move that deals direct damage as an attacking move of its respective type, Hidden Power counts as its determined type, and Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		},
		gen5: {
			desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective against this Pokemon, or an OHKO move. This effect considers any move that deals direct damage as an attacking move of its respective type, and Hidden Power, Judgment, Natural Gift, Techno Blast, and Weather Ball are considered Normal-type moves.",
		},
		gen4: {
			desc: "On switch-in, this Pokemon is alerted if any opposing Pokemon has an attack that is super effective against this Pokemon, or an OHKO move that this Pokemon is not immune to and if its level is less than or equal to the opposing Pokemon's level. This effect does not consider Counter, Dragon Rage, Metal Burst, Mirror Coat, Night Shade, Psywave, or Seismic Toss as attacking moves, and Hidden Power, Judgment, Natural Gift, and Weather Ball are considered Normal-type moves. This effect considers any changes to the effectiveness of attacks against this Pokemon due to the effects of Gravity or the Normalize or Scrappy Abilities.",
		},

		activate: "  [POKEMON] shuddered!",
	},
	arenatrap: {
		name: "Arena Trap",
		desc: "Prevents opposing Pokemon from choosing to switch out unless they are airborne, are holding a Shed Shell, or are a Ghost type.",
		shortDesc: "Prevents opposing Pokemon from choosing to switch out unless they are airborne.",
		gen6: {
			desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are airborne, are holding a Shed Shell, or are a Ghost type.",
		},
		gen5: {
			desc: "Prevents adjacent opposing Pokemon from choosing to switch out unless they are airborne or holding a Shed Shell.",
		},
		gen4: {
			desc: "Prevents opposing Pokemon from choosing to switch out unless they are airborne or holding a Shed Shell.",
		},
		gen3: {
			desc: "Prevents opposing Pokemon from choosing to switch out unless they are airborne.",
		},
	},
	armortail: {
		name: "Armor Tail",
		desc: "Priority moves used by opposing Pokemon targeting this Pokemon or its allies are prevented from having an effect.",
		shortDesc: "This Pokemon and its allies are protected from opposing priority moves.",

		block: "#damp",
	},
	aromaveil: {
		name: "Aroma Veil",
		desc: "This Pokemon and its allies cannot become affected by Attract, Disable, Encore, Heal Block, Taunt, or Torment.",
		shortDesc: "Protects user/allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.",

		block: "  [POKEMON] is protected by an aromatic veil!",
	},
	asone: {
		name: "As One",
		shortDesc: "See 'As One (Glastrier)' and 'As One (Spectrier)'.",

		start: "  [POKEMON] has two Abilities!",
	},
	asoneglastrier: {
		name: "As One (Glastrier)",
		shortDesc: "Combination of the Unnerve and Chilling Neigh Abilities.",
	},
	asonespectrier: {
		name: "As One (Spectrier)",
		shortDesc: "Combination of the Unnerve and Grim Neigh Abilities.",
	},
	aurabreak: {
		name: "Aura Break",
		desc: "While this Pokemon is active, the effects of the Dark Aura and Fairy Aura Abilities are reversed, multiplying the power of Dark- and Fairy-type moves, respectively, by 3/4 instead of 1.33.",
		shortDesc: "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.75x.",

		start: "  [POKEMON] reversed all other Pok\u00E9mon's auras!",
	},
	baddreams: {
		name: "Bad Dreams",
		desc: "Causes opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
		shortDesc: "Causes sleeping foes to lose 1/8 of their max HP at the end of each turn.",
		gen6: {
			desc: "Causes adjacent opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
			shortDesc: "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.",
		},
		gen4: {
			desc: "Causes opposing Pokemon to lose 1/8 of their maximum HP, rounded down, at the end of each turn if they are asleep.",
			shortDesc: "Causes sleeping foes to lose 1/8 of their max HP at the end of each turn.",
		},

		damage: "  [POKEMON] is tormented!",
	},
	ballfetch: {
		name: "Ball Fetch",
		shortDesc: "No competitive use.",
	},
	battery: {
		name: "Battery",
		shortDesc: "This Pokemon's allies have the power of their special attacks multiplied by 1.3.",
	},
	battlearmor: {
		name: "Battle Armor",
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
	},
	battlebond: {
		name: "Battle Bond",
		desc: "If this Pokemon is a Greninja, its Attack, Special Attack, and Speed are raised by 1 stage if it attacks and knocks out another Pokemon. This effect can only happen once per battle.",
		shortDesc: "After KOing a Pokemon: raises Attack, Sp. Atk, Speed by 1 stage. Once per battle.",
		gen8: {
			desc: "If this Pokemon is a Greninja, it transforms into Ash-Greninja if it attacks and knocks out another Pokemon. If this Pokemon is an Ash-Greninja, its Water Shuriken has 20 power and always hits three times.",
			shortDesc: "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.",
		},
		activate: "  [POKEMON] became fully charged due to its bond with its Trainer!",
		transform: "[POKEMON] became Ash-Greninja!",
	},
	beadsofruin: {
		name: "Beads of Ruin",
		shortDesc: "Active Pokemon without this Ability have their Special Defense multiplied by 0.75.",

		start: "  [POKEMON]'s Beads of Ruin weakened the Sp. Def of all surrounding Pokémon!",
	},
	beastboost: {
		name: "Beast Boost",
		desc: "This Pokemon's highest stat is raised by 1 stage if it attacks and knocks out another Pokemon. Stat stage changes are not considered. If multiple stats are tied, Attack, Defense, Special Attack, Special Defense, and Speed are prioritized in that order.",
		shortDesc: "This Pokemon's highest stat is raised by 1 if it attacks and KOes another Pokemon.",
	},
	berserk: {
		name: "Berserk",
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage from an attack bringing it to 1/2 or less of its maximum HP, its Special Attack is raised by 1 stage. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 when it reaches 1/2 or less of its max HP.",
	},
	bigpecks: {
		name: "Big Pecks",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Defense stat stage.",
	},
	blaze: {
		name: "Blaze",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Fire-type attack.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Fire attacks.",
		gen4: {
			desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Fire-type attacks have their power multiplied by 1.5.",
			shortDesc: "At 1/3 or less of its max HP, this Pokemon's Fire-type attacks have 1.5x power.",
		},
	},
	bulletproof: {
		name: "Bulletproof",
		shortDesc: "This Pokemon is immune to bullet moves.",
	},
	cheekpouch: {
		name: "Cheek Pouch",
		desc: "If this Pokemon eats a held Berry, it restores 1/3 of its maximum HP, rounded down, in addition to the Berry's effect. This effect can also activate after the effects of Bug Bite, Fling, Pluck, Stuff Cheeks, and Teatime if the eaten Berry had an effect on this Pokemon.",
		shortDesc: "If this Pokemon eats a Berry, it restores 1/3 of its max HP after the Berry's effect.",
		gen7: {
			desc: "If this Pokemon eats a held Berry, it restores 1/3 of its maximum HP, rounded down, in addition to the Berry's effect. This effect can also activate after the effects of Bug Bite, Fling, and Pluck if the eaten Berry has an effect on this Pokemon.",
		},
	},
	chillingneigh: {
		name: "Chilling Neigh",
		desc: "This Pokemon's Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 1 stage if it attacks and KOes another Pokemon.",
	},
	chlorophyll: {
		name: "Chlorophyll",
		desc: "If Sunny Day is active, this Pokemon's Speed is doubled. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		gen7: {
			desc: "If Sunny Day is active, this Pokemon's Speed is doubled.",
		},
	},
	clearbody: {
		name: "Clear Body",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
	},
	cloudnine: {
		name: "Cloud Nine",
		shortDesc: "While this Pokemon is active, the effects of weather conditions are disabled.",

		start: "#airlock",
	},
	colorchange: {
		name: "Color Change",
		desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability.",
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.",
		gen4: {
			desc: "This Pokemon's type changes to match the type of the last move that hit it, unless that type is already one of its types. This effect applies after each hit from a multi-hit move. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
	},
	comatose: {
		name: "Comatose",
		desc: "This Pokemon is considered to be asleep and cannot become affected by a non-volatile status condition or Yawn.",
		shortDesc: "This Pokemon cannot be statused, and is considered to be asleep.",

		start: "  [POKEMON] is drowsing!",
	},
	commander: {
		name: "Commander",
		desc: "If this Pokemon is a Tatsugiri and a Dondozo is an active ally, this Pokemon goes into the Dondozo's mouth. The Dondozo has its Attack, Special Attack, Speed, Defense, and Special Defense raised by 2 stages. During the effect, the Dondozo cannot be switched out, this Pokemon cannot select an action, and attacks targeted at this Pokemon will be avoided but it will still take indirect damage. If this Pokemon faints during the effect, a Pokemon can be switched in as a replacement but the Dondozo remains unable to be switched out. If the Dondozo faints during the effect, this Pokemon regains the ability to select an action.",
		shortDesc: "If ally is Dondozo: this Pokemon cannot act or be hit, +2 to all Dondozo's stats.",

		activate: "  [POKEMON] was swallowed by [TARGET] and became [TARGET]'s commander!",
	},
	competitive: {
		name: "Competitive",
		desc: "This Pokemon's Special Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 2 for each of its stats that is lowered by a foe.",
	},
	compoundeyes: {
		name: "Compound Eyes",
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.3.",
	},
	contrary: {
		name: "Contrary",
		shortDesc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.",
		gen7: {
			desc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa. This Ability does not affect stat stage increases received from Z-Power effects that happen before a Z-Move is used.",
		},
		gen6: {
			desc: "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.",
		},
	},
	corrosion: {
		name: "Corrosion",
		shortDesc: "This Pokemon can poison or badly poison a Pokemon regardless of its typing.",
	},
	costar: {
		name: "Costar",
		shortDesc: "On switch-in, this Pokemon copies all of its ally's stat stage changes.",
	},
	cottondown: {
		name: "Cotton Down",
		desc: "When this Pokemon is hit by an attack, the Speed of all other Pokemon on the field is lowered by 1 stage.",
		shortDesc: "If this Pokemon is hit, it lowers the Speed of all other Pokemon on the field 1 stage.",
	},
	cudchew: {
		name: "Cud Chew",
		shortDesc: "If this Pokemon eats a Berry, it will eat that Berry again at the end of the next turn.",
	},
	curiousmedicine: {
		name: "Curious Medicine",
		shortDesc: "On switch-in, this Pokemon's allies have their stat stages reset to 0.",
	},
	cursedbody: {
		name: "Cursed Body",
		desc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled unless one of the attacker's moves is already disabled.",
		shortDesc: "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled.",
	},
	cutecharm: {
		name: "Cute Charm",
		desc: "There is a 30% chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender.",
		shortDesc: "30% chance of infatuating Pokemon of the opposite gender if they make contact.",
		gen4: {
			desc: "There is a 30% chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
		gen3: {
			desc: "There is a 1/3 chance a Pokemon making contact with this Pokemon will become infatuated if it is of the opposite gender. This effect does not happen if this Pokemon did not lose HP from the attack.",
			shortDesc: "1/3 chance of infatuating Pokemon of the opposite gender if they make contact.",
		},
	},
	damp: {
		name: "Damp",
		desc: "While this Pokemon is active, Explosion, Mind Blown, Misty Explosion, Self-Destruct, and the Aftermath Ability are prevented from having an effect.",
		shortDesc: "Prevents Explosion/Mind Blown/Misty Explosion/Self-Destruct/Aftermath while active.",
		gen7: {
			desc: "While this Pokemon is active, Explosion, Mind Blown, Self-Destruct, and the Aftermath Ability are prevented from having an effect.",
			shortDesc: "Prevents Explosion/Mind Blown/Self-Destruct/Aftermath while this Pokemon is active.",
		},
		gen6: {
			desc: "While this Pokemon is active, Explosion, Self-Destruct, and the Aftermath Ability are prevented from having an effect.",
			shortDesc: "Prevents Explosion/Self-Destruct/Aftermath while this Pokemon is active.",
		},
		gen3: {
			desc: "While this Pokemon is active, Explosion and Self-Destruct are prevented from having an effect.",
			shortDesc: "Prevents Explosion and Self-Destruct while this Pokemon is active.",
		},

		block: "  [SOURCE] cannot use [MOVE]!",
	},
	dancer: {
		name: "Dancer",
		desc: "After another Pokemon uses a dance move, this Pokemon uses the same move. The copied move is subject to all effects that can prevent a move from being executed. A move used through this Ability cannot be copied again by other Pokemon with this Ability.",
		shortDesc: "After another Pokemon uses a dance move, this Pokemon uses the same move.",
	},
	darkaura: {
		name: "Dark Aura",
		desc: "While this Pokemon is active, the power of Dark-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, a Dark move used by any Pokemon has 1.33x power.",

		start: "  [POKEMON] is radiating a dark aura!",
	},
	dauntlessshield: {
		name: "Dauntless Shield",
		shortDesc: "On switch-in, this Pokemon's Defense is raised by 1 stage. Once per battle.",
		gen8: {
			shortDesc: "On switch-in, this Pokemon's Defense is raised by 1 stage.",
		},
	},
	dazzling: {
		name: "Dazzling",
		desc: "Priority moves used by opposing Pokemon targeting this Pokemon or its allies are prevented from having an effect.",
		shortDesc: "This Pokemon and its allies are protected from opposing priority moves.",

		block: "#damp",
	},
	defeatist: {
		name: "Defeatist",
		desc: "While this Pokemon has 1/2 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.",
	},
	defiant: {
		name: "Defiant",
		desc: "This Pokemon's Attack is raised by 2 stages for each of its stat stages that is lowered by an opposing Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe.",
	},
	deltastream: {
		name: "Delta Stream",
		desc: "On switch-in, the weather becomes Delta Stream, which removes the weaknesses of the Flying type from Flying-type Pokemon. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Desolate Land or Primordial Sea Abilities.",
		shortDesc: "On switch-in, strong winds begin until this Ability is not active in battle.",
	},
	desolateland: {
		name: "Desolate Land",
		desc: "On switch-in, the weather becomes Desolate Land, which includes all the effects of Sunny Day and prevents damaging Water-type moves from executing. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Delta Stream or Primordial Sea Abilities.",
		shortDesc: "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.",
	},
	disguise: {
		name: "Disguise",
		desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken, it changes to Busted Form, and it loses 1/8 of its max HP. Confusion damage also breaks the disguise.",
		shortDesc: "(Mimikyu only) The first hit it takes is blocked, and it takes 1/8 HP damage instead.",
		gen7: {
			desc: "If this Pokemon is a Mimikyu, the first hit it takes in battle deals 0 neutral damage. Its disguise is then broken and it changes to Busted Form. Confusion damage also breaks the disguise.",
			shortDesc: "(Mimikyu only) First hit deals 0 damage, breaks disguise.",
		},

		block: "  Its disguise served it as a decoy!",
		transform: "[POKEMON]'s disguise was busted!",
	},
	download: {
		name: "Download",
		desc: "On switch-in, this Pokemon's Attack or Special Attack is raised by 1 stage based on the weaker combined defensive stat of all opposing Pokemon. Attack is raised if their Defense is lower, and Special Attack is raised if their Special Defense is the same or lower.",
		shortDesc: "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.",
	},
	dragonsmaw: {
		name: "Dragon's Maw",
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Dragon-type attack.",
	},
	drizzle: {
		name: "Drizzle",
		shortDesc: "On switch-in, this Pokemon summons Rain Dance.",
	},
	drought: {
		name: "Drought",
		shortDesc: "On switch-in, this Pokemon summons Sunny Day.",
	},
	dryskin: {
		name: "Dry Skin",
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day. The weather effects are prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.",
		gen7: {
			desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move. The power of Fire-type moves is multiplied by 1.25 when used on this Pokemon. At the end of each turn, this Pokemon restores 1/8 of its maximum HP, rounded down, if the weather is Rain Dance, and loses 1/8 of its maximum HP, rounded down, if the weather is Sunny Day.",
		},

		damage: "  ([POKEMON] was hurt by its Dry Skin.)",
	},
	earlybird: {
		name: "Early Bird",
		shortDesc: "This Pokemon's sleep counter drops by 2 instead of 1.",
	},
	eartheater: {
		name: "Earth Eater",
		desc: "This Pokemon is immune to Ground-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Ground-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Ground moves; Ground immunity.",
	},
	effectspore: {
		name: "Effect Spore",
		desc: "30% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "30% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		gen4: {
			desc: "30% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
		gen3: {
			desc: "10% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep. This effect does not happen if this Pokemon did not lose HP from the attack.",
			shortDesc: "10% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		},
	},
	electricsurge: {
		name: "Electric Surge",
		shortDesc: "On switch-in, this Pokemon summons Electric Terrain.",
	},
	electromorphosis: {
		name: "Electromorphosis",
		shortDesc: "This Pokemon gains the Charge effect when it takes a hit from an attack.",

		start: "  Being hit by [MOVE] charged [POKEMON] with power!",
	},
	emergencyexit: {
		name: "Emergency Exit",
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it immediately switches out to a chosen ally. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, and confusion damage.",
		shortDesc: "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
	},
	fairyaura: {
		name: "Fairy Aura",
		desc: "While this Pokemon is active, the power of Fairy-type moves used by active Pokemon is multiplied by 1.33.",
		shortDesc: "While this Pokemon is active, a Fairy move used by any Pokemon has 1.33x power.",

		start: "  [POKEMON] is radiating a fairy aura!",
	},
	filter: {
		name: "Filter",
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
	},
	flamebody: {
		name: "Flame Body",
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be burned.",
		gen4: {
			desc: "30% chance a Pokemon making contact with this Pokemon will be burned. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
		gen3: {
			desc: "1/3 chance a Pokemon making contact with this Pokemon will be burned. This effect does not happen if this Pokemon did not lose HP from the attack.",
			shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be burned.",
		},
	},
	flareboost: {
		name: "Flare Boost",
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is burned, its special attacks have 1.5x power.",
	},
	flashfire: {
		name: "Flash Fire",
		desc: "This Pokemon is immune to Fire-type moves. The first time it is hit by a Fire-type move, its offensive stat is multiplied by 1.5 while using a Fire-type attack as long as it remains active and has this Ability. If this Pokemon is frozen, it cannot be defrosted by Fire-type attacks.",
		shortDesc: "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.",
		gen4: {
			desc: "This Pokemon is immune to Fire-type moves, as long as it is not frozen. The first time it is hit by a Fire-type move, damage from its Fire-type attacks will be multiplied by 1.5 as long as it remains active and has this Ability.",
		},
		gen3: {
			desc: "This Pokemon is immune to Fire-type moves, as long as it is not frozen. The first time it is hit by a Fire-type move, damage from its Fire-type attacks will be multiplied by 1.5 as long as it remains active and has this Ability. If this Pokemon has a non-volatile status condition, is a Fire type, or has a substitute, Will-O-Wisp will not activate this Ability.",
		},

		start: "  The power of [POKEMON]'s Fire-type moves rose!",
	},
	flowergift: {
		name: "Flower Gift",
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5. These effects are prevented if the Pokemon is holding a Utility Umbrella.",
		shortDesc: "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.",
		gen7: {
			desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and the Attack and Special Defense of it and its allies are multiplied by 1.5.",
		},
		gen4: {
			desc: "If Sunny Day is active, the Attack and Special Defense of this Pokemon and its allies are multiplied by 1.5.",
			shortDesc: "If Sunny Day is active, Attack and Sp. Def of this Pokemon and its allies are 1.5x.",
		},
	},
	flowerveil: {
		name: "Flower Veil",
		desc: "Grass-type Pokemon on this Pokemon's side cannot have their stat stages lowered by other Pokemon or have a non-volatile status condition inflicted on them by other Pokemon.",
		shortDesc: "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.",

		block: "  [POKEMON] surrounded itself with a veil of petals!",
	},
	fluffy: {
		name: "Fluffy",
		desc: "This Pokemon receives 1/2 damage from contact moves, but double damage from Fire moves.",
		shortDesc: "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves.",
	},
	forecast: {
		name: "Forecast",
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm. This effect is prevented if this Pokemon is holding a Utility Umbrella and the weather is Rain Dance or Sunny Day.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm.",
		gen7: {
			desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		},
	},
	forewarn: {
		name: "Forewarn",
		desc: "On switch-in, this Pokemon is alerted to the move with the highest power, at random, known by an opposing Pokemon. This effect considers OHKO moves to have 150 power, Counter, Mirror Coat, and Metal Burst to have 120 power, every other attacking move with an unspecified power to have 80 power, and non-damaging moves to have 1 power.",
		shortDesc: "On switch-in, this Pokemon is alerted to the foes' move with the highest power.",
		gen4: {
			desc: "On switch-in, this Pokemon is alerted to the move with the highest power, at random, known by an opposing Pokemon. This effect considers OHKO moves to have 150 power, Counter, Mirror Coat, and Metal Burst to have 120 power, and every other attacking move with an unspecified power to have 80 power.",
		},

		activate: "  [TARGET]'s [MOVE] was revealed!",
		activateNoTarget: "  [POKEMON]'s Forewarn alerted it to [MOVE]!",
	},
	friendguard: {
		name: "Friend Guard",
		shortDesc: "This Pokemon's allies receive 3/4 damage from other Pokemon's attacks.",
	},
	frisk: {
		name: "Frisk",
		shortDesc: "On switch-in, this Pokemon identifies the held items of all opposing Pokemon.",
		gen5: {
			shortDesc: "On switch-in, this Pokemon identifies the held item of a random opposing Pokemon.",
		},

		activate: "  [POKEMON] frisked [TARGET] and found its [ITEM]!",
		activateNoTarget: "  [POKEMON] frisked its target and found one [ITEM]!",
	},
	fullmetalbody: {
		name: "Full Metal Body",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
	},
	furcoat: {
		name: "Fur Coat",
		shortDesc: "This Pokemon's Defense is doubled.",
	},
	galewings: {
		name: "Gale Wings",
		shortDesc: "If this Pokemon is at full HP, its Flying-type moves have their priority increased by 1.",
		gen6: {
			shortDesc: "This Pokemon's Flying-type moves have their priority increased by 1.",
		},
	},
	galvanize: {
		name: "Galvanize",
		desc: "This Pokemon's Normal-type moves become Electric-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Electric type and have 1.2x power.",
	},
	gluttony: {
		name: "Gluttony",
		desc: "When this Pokemon is holding a Berry that usually activates with 1/4 or less of its maximum HP, it is eaten at 1/2 or less of its maximum HP instead.",
		shortDesc: "This Pokemon eats Berries at 1/2 max HP or less instead of their usual 1/4 max HP.",
	},
	goodasgold: {
		name: "Good as Gold",
		shortDesc: "This Pokemon is immune to Status moves.",
	},
	gooey: {
		name: "Gooey",
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
	},
	gorillatactics: {
		name: "Gorilla Tactics",
		desc: "This Pokemon's Attack is multiplied by 1.5, but it can only select the first move it executes. These effects are prevented while this Pokemon is Dynamaxed.",
		shortDesc: "This Pokemon's Attack is 1.5x, but it can only select the first move it executes.",
	},
	grasspelt: {
		name: "Grass Pelt",
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5.",
	},
	grassysurge: {
		name: "Grassy Surge",
		shortDesc: "On switch-in, this Pokemon summons Grassy Terrain.",
	},
	grimneigh: {
		name: "Grim Neigh",
		desc: "This Pokemon's Special Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Sp. Atk is raised by 1 stage if it attacks and KOes another Pokemon.",
	},
	guarddog: {
		name: "Guard Dog",
		desc: "This Pokemon is immune to the effect of the Intimidate Ability and raises its Attack by 1 stage instead. This Pokemon cannot be forced to switch out by another Pokemon's attack or item.",
		shortDesc: "Immune to Intimidate. Intimidated: +1 Attack. Cannot be forced to switch out.",
	},
	gulpmissile: {
		name: "Gulp Missile",
		desc: "If this Pokemon is a Cramorant, it changes forme when it hits a target with Surf or uses the first turn of Dive successfully. It becomes Gulping Form with an Arrokuda in its mouth if it has more than 1/2 of its maximum HP remaining, or Gorging Form with a Pikachu in its mouth if it has 1/2 or less of its maximum HP remaining. If Cramorant gets hit in Gulping or Gorging Form, it spits the Arrokuda or Pikachu at its attacker, even if it has no HP remaining. The projectile deals damage equal to 1/4 of the target's maximum HP, rounded down; this damage is blocked by the Magic Guard Ability but not by a substitute. An Arrokuda also lowers the target's Defense by 1 stage, and a Pikachu paralyzes the target. Cramorant will return to normal if it spits out a projectile, switches out, or Dynamaxes.",
		shortDesc: "When hit after Surf/Dive, attacker takes 1/4 max HP and -1 Defense or paralysis.",
	},
	guts: {
		name: "Guts",
		desc: "If this Pokemon has a non-volatile status condition, its Attack is multiplied by 1.5. This Pokemon's physical attacks ignore the burn effect of halving damage.",
		shortDesc: "If this Pokemon is statused, its Attack is 1.5x; ignores burn halving physical damage.",
	},
	hadronengine: {
		name: "Hadron Engine",
		shortDesc: "On switch-in, summons Electric Terrain. During Electric Terrain, Sp. Atk is 1.3333x.",

		start: "  [POKEMON] turned the ground into Electric Terrain, energizing its futuristic engine!",
		activate: "  [POKEMON] used the Electric Terrain to energize its futuristic engine!",
	},
	harvest: {
		name: "Harvest",
		desc: "If the last item this Pokemon used is a Berry, there is a 50% chance it gets restored at the end of each turn. If Sunny Day is active, this chance is 100%.",
		shortDesc: "If last item used is a Berry, 50% chance to restore it each end of turn. 100% in Sun.",

		addItem: "  [POKEMON] harvested one [ITEM]!",
	},
	healer: {
		name: "Healer",
		desc: "30% chance this Pokemon's ally has its non-volatile status condition cured at the end of each turn.",
		shortDesc: "30% chance this Pokemon's ally has its status cured at the end of each turn.",
		gen6: {
			desc: "30% chance each of this Pokemon's adjacent allies has its non-volatile status condition cured at the end of each turn.",
			shortDesc: "30% chance each adjacent ally has its status cured at the end of each turn.",
		},
	},
	heatproof: {
		name: "Heatproof",
		desc: "The power of Fire-type attacks against this Pokemon is halved. This Pokemon takes half of the usual burn damage, rounded down.",
		shortDesc: "The power of Fire-type attacks against this Pokemon is halved; burn damage halved.",
	},
	heavymetal: {
		name: "Heavy Metal",
		desc: "This Pokemon's weight is doubled. This effect is calculated after the effect of Autotomize, and before the effect of Float Stone.",
		shortDesc: "This Pokemon's weight is doubled.",
	},
	honeygather: {
		name: "Honey Gather",
		shortDesc: "No competitive use.",
	},
	hugepower: {
		name: "Huge Power",
		shortDesc: "This Pokemon's Attack is doubled.",
	},
	hungerswitch: {
		name: "Hunger Switch",
		desc: "If this Pokemon is a Morpeko, it changes formes between its Full Belly Mode and Hangry Mode at the end of each turn.",
		shortDesc: "If Morpeko, it changes between Full Belly and Hangry Mode at the end of each turn.",
	},
	hustle: {
		name: "Hustle",
		desc: "This Pokemon's Attack is multiplied by 1.5 and the accuracy of its physical attacks is multiplied by 0.8.",
		shortDesc: "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.",
	},
	hydration: {
		name: "Hydration",
		desc: "This Pokemon has its non-volatile status condition cured at the end of each turn if Rain Dance is active. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "This Pokemon has its status cured at the end of each turn if Rain Dance is active.",
		gen7: {
			desc: "This Pokemon has its non-volatile status condition cured at the end of each turn if Rain Dance is active.",
		},
	},
	hypercutter: {
		name: "Hyper Cutter",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.",
	},
	icebody: {
		name: "Ice Body",
		desc: "If Snow is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Snow is active, this Pokemon heals 1/16 of its max HP each turn.",
		gen8: {
			desc: "If Hail is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail.",
			shortDesc: "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.",
		},
	},
	iceface: {
		name: "Ice Face",
		desc: "If this Pokemon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Snow begins or when Eiscue switches in while Snow is active. Confusion damage also breaks the ice face.",
		shortDesc: "If Eiscue, the first physical hit it takes deals 0 damage. Effect is restored in Snow.",
		gen8: {
			desc: "If this Pokemon is an Eiscue, the first physical hit it takes in battle deals 0 neutral damage. Its ice face is then broken and it changes forme to Noice Face. Eiscue regains its Ice Face forme when Hail begins or when Eiscue switches in while Hail is active. Confusion damage also breaks the ice face.",
			shortDesc: "If Eiscue, the first physical hit it takes deals 0 damage. This effect is restored in Hail.",
		},
	},
	icescales: {
		name: "Ice Scales",
		shortDesc: "This Pokemon receives 1/2 damage from special attacks.",
	},
	illuminate: {
		name: "Illuminate",
		shortDesc: "No competitive use.",
	},
	illusion: {
		name: "Illusion",
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon.",
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage.",

		end: "  [POKEMON]'s illusion wore off!",
	},
	immunity: {
		name: "Immunity",
		shortDesc: "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.",
	},
	imposter: {
		name: "Imposter",
		desc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it. If there is no Pokemon at that position, this Pokemon does not Transform.",
		shortDesc: "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.",
	},
	infiltrator: {
		name: "Infiltrator",
		desc: "This Pokemon's moves ignore substitutes and the opposing side's Reflect, Light Screen, Safeguard, Mist, and Aurora Veil.",
		shortDesc: "Moves ignore substitutes and foe's Reflect/Light Screen/Safeguard/Mist/Aurora Veil.",
		gen6: {
			desc: "This Pokemon's moves ignore substitutes and the opposing side's Reflect, Light Screen, Safeguard, and Mist.",
			shortDesc: "Moves ignore substitutes and the foe's Reflect, Light Screen, Safeguard, and Mist.",
		},
		gen5: {
			desc: "This Pokemon's moves ignore the opposing side's Reflect, Light Screen, Safeguard, and Mist.",
			shortDesc: "This Pokemon's moves ignore the foe's Reflect, Light Screen, Safeguard, and Mist.",
		},
	},
	innardsout: {
		name: "Innards Out",
		desc: "If this Pokemon is knocked out with a move, that move's user loses HP equal to the amount of damage inflicted on this Pokemon.",
		shortDesc: "If this Pokemon is KOed with a move, that move's user loses an equal amount of HP.",

		damage: "#aftermath",
	},
	innerfocus: {
		name: "Inner Focus",
		desc: "This Pokemon cannot be made to flinch. This Pokemon is immune to the effect of the Intimidate Ability.",
		shortDesc: "This Pokemon cannot be made to flinch. Immune to Intimidate.",
		gen7: {
			desc: "This Pokemon cannot be made to flinch.",
			shortDesc: "This Pokemon cannot be made to flinch.",
		},
	},
	insomnia: {
		name: "Insomnia",
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
	},
	intimidate: {
		name: "Intimidate",
		desc: "On switch-in, this Pokemon lowers the Attack of opposing Pokemon by 1 stage. Pokemon with the Inner Focus, Oblivious, Own Tempo, or Scrappy Abilities and Pokemon behind a substitute are immune.",
		shortDesc: "On switch-in, this Pokemon lowers the Attack of opponents by 1 stage.",
		gen7: {
			desc: "On switch-in, this Pokemon lowers the Attack of opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		},
		gen6: {
			desc: "On switch-in, this Pokemon lowers the Attack of adjacent opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
			shortDesc: "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.",
		},
		gen4: {
			desc: "On switch-in, this Pokemon lowers the Attack of opposing Pokemon by 1 stage. Pokemon behind a substitute are immune. If U-turn breaks an opposing substitute and this Pokemon switches in as the replacement, the Pokemon that had the substitute is still immune to this Ability.",
			shortDesc: "On switch-in, this Pokemon lowers the Attack of opponents by 1 stage.",
		},
		gen3: {
			desc: "On switch-in, this Pokemon lowers the Attack of opposing Pokemon by 1 stage. Pokemon behind a substitute are immune.",
		},
	},
	intrepidsword: {
		name: "Intrepid Sword",
		shortDesc: "On switch-in, this Pokemon's Attack is raised by 1 stage. Once per battle.",
		gen8: {
			shortDesc: "On switch-in, this Pokemon's Attack is raised by 1 stage.",
		},
	},
	ironbarbs: {
		name: "Iron Barbs",
		desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",

		damage: "#roughskin",
	},
	ironfist: {
		name: "Iron Fist",
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.2.",
		shortDesc: "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.",
	},
	justified: {
		name: "Justified",
		shortDesc: "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.",
	},
	keeneye: {
		name: "Keen Eye",
		desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage.",
		shortDesc: "This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
		gen5: {
			desc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.",
			shortDesc: "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.",
		},
	},
	klutz: {
		name: "Klutz",
		desc: "This Pokemon's held item has no effect. This Pokemon cannot use Fling successfully. Macho Brace, Power Anklet, Power Band, Power Belt, Power Bracer, Power Lens, and Power Weight still have their effects.",
		shortDesc: "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.",
	},
	leafguard: {
		name: "Leaf Guard",
		desc: "If Sunny Day is active, this Pokemon cannot become affected by a non-volatile status condition or Yawn, and Rest will fail for it. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.",
		gen7: {
			desc: "If Sunny Day is active, this Pokemon cannot become affected by a non-volatile status condition or Yawn, and Rest will fail for it.",
		},
		gen4: {
			desc: "If Sunny Day is active, this Pokemon cannot become affected by a non-volatile status condition or Yawn, but can use Rest normally.",
			shortDesc: "If Sunny Day is active, this Pokemon cannot be statused, but Rest works normally.",
		},
	},
	levitate: {
		name: "Levitate",
		desc: "This Pokemon is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability. The effects of Gravity, Ingrain, Smack Down, Thousand Arrows, and Iron Ball nullify the immunity. Thousand Arrows can hit this Pokemon as if it did not have this Ability.",
		shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.",
		gen5: {
			desc: "This Pokemon is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, and the Arena Trap Ability. The effects of Gravity, Ingrain, Smack Down, and Iron Ball nullify the immunity.",
		},
		gen4: {
			desc: "This Pokemon is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, and the Arena Trap Ability. The effects of Gravity, Ingrain, and Iron Ball nullify the immunity.",
			shortDesc: "This Pokemon is immune to Ground; Gravity/Ingrain/Iron Ball nullify it.",
		},
		gen3: {
			desc: "This Pokemon is immune to Ground-type attacks and the effects of Spikes and the Arena Trap Ability.",
			shortDesc: "This Pokemon is immune to Ground.",
		},
	},
	libero: {
		name: "Libero",
		desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type. This effect can only happen once per switch-in, and only if this Pokemon is not Terastallized.",
		shortDesc: "This Pokemon's type changes to the type of the move it is using. Once per switch-in.",
		gen8: {
			desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type.",
			shortDesc: "This Pokemon's type changes to match the type of the move it is about to use.",
		},
	},
	lightmetal: {
		name: "Light Metal",
		desc: "This Pokemon's weight is halved, rounded down to a tenth of a kilogram. This effect is calculated after the effect of Autotomize, and before the effect of Float Stone. A Pokemon's weight will not drop below 0.1 kg.",
		shortDesc: "This Pokemon's weight is halved.",
	},
	lightningrod: {
		name: "Lightning Rod",
		desc: "This Pokemon is immune to Electric-type moves and raises its Special Attack by 1 stage when hit by an Electric-type move. If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move. If multiple Pokemon could redirect with this Ability, it goes to the one with the highest Speed, or in the case of a tie to the one that has had this Ability active longer.",
		shortDesc: "This Pokemon draws Electric moves to itself to raise Sp. Atk by 1; Electric immunity.",
		gen4: {
			desc: "If this Pokemon is not the target of a single-target Electric-type move used by another Pokemon, this Pokemon redirects that move to itself.",
			shortDesc: "This Pokemon draws single-target Electric moves to itself.",
		},
		gen3: {
			desc: "If this Pokemon is not the target of a single-target Electric-type move used by an opposing Pokemon, this Pokemon redirects that move to itself. This effect considers Hidden Power a Normal-type move.",
			shortDesc: "This Pokemon draws single-target Electric moves used by opponents to itself.",
		},

		activate: "  [POKEMON] took the attack!",
	},
	limber: {
		name: "Limber",
		shortDesc: "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.",
	},
	lingeringaroma: {
		name: "Lingering Aroma",
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Lingering Aroma. Does not affect Pokemon with the As One, Battle Bond, Comatose, Commander, Disguise, Gulp Missile, Hadron Engine, Ice Face, Lingering Aroma, Multitype, Orichalcum Pulse, Power Construct, Protosynthesis, Quark Drive, RKS System, Schooling, Shields Down, Stance Change, Zen Mode, or Zero to Hero Abilities.",
		shortDesc: "Making contact with this Pokemon has the attacker's Ability become Lingering Aroma.",

		changeAbility: "  A lingering aroma clings to [TARGET]!",
	},
	liquidooze: {
		name: "Liquid Ooze",
		shortDesc: "This Pokemon damages those draining HP from it for as much as they would heal.",
		gen4: {
			desc: "This Pokemon damages those draining HP from it for as much as they would heal. This effect does not consider Dream Eater.",
		},

		damage: "  [POKEMON] sucked up the liquid ooze!",
	},
	liquidvoice: {
		name: "Liquid Voice",
		desc: "This Pokemon's sound-based moves become Water-type moves. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Water type.",
	},
	longreach: {
		name: "Long Reach",
		shortDesc: "This Pokemon's attacks do not make contact with the target.",
	},
	magicbounce: {
		name: "Magic Bounce",
		desc: "This Pokemon is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user. Moves reflected in this way are unable to be reflected again by this or Magic Coat's effect. Spikes, Stealth Rock, Sticky Web, and Toxic Spikes can only be reflected once per side, by the leftmost Pokemon under this or Magic Coat's effect. The Lightning Rod and Storm Drain Abilities redirect their respective moves before this Ability takes effect.",
		shortDesc: "This Pokemon blocks certain Status moves and bounces them back to the user.",
		gen5: {
			desc: "This Pokemon is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user. Moves reflected in this way are unable to be reflected again by this or Magic Coat's effect. Spikes, Stealth Rock, and Toxic Spikes can only be reflected once per side, by the leftmost Pokemon under this or Magic Coat's effect. The Lightning Rod and Storm Drain Abilities redirect their respective moves before this Ability takes effect.",
		},

		move: "#magiccoat",
	},
	magicguard: {
		name: "Magic Guard",
		desc: "This Pokemon can only be damaged by direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage.",
		shortDesc: "This Pokemon can only be damaged by direct attacks.",
		gen4: {
			desc: "This Pokemon can only be damaged by direct attacks. Curse and Substitute on use, Belly Drum, Pain Split, Struggle recoil, and confusion damage are considered direct damage. This Pokemon cannot be prevented from moving because of paralysis, and is unaffected by Toxic Spikes on switch-in.",
			shortDesc: "This Pokemon can only be damaged by direct attacks, and can't be fully paralyzed.",
		},
	},
	magician: {
		name: "Magician",
		desc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack. Does not affect Doom Desire and Future Sight.",
		shortDesc: "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack.",
	},
	magmaarmor: {
		name: "Magma Armor",
		shortDesc: "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.",
	},
	magnetpull: {
		name: "Magnet Pull",
		desc: "Prevents opposing Steel-type Pokemon from choosing to switch out, unless they are holding a Shed Shell or are a Ghost type.",
		shortDesc: "Prevents opposing Steel-type Pokemon from choosing to switch out.",
		gen6: {
			desc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out, unless they are holding a Shed Shell or are a Ghost type.",
			shortDesc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out.",
		},
		gen5: {
			desc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out, unless they are holding a Shed Shell.",
			shortDesc: "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out.",
		},
		gen4: {
			desc: "Prevents opposing Steel-type Pokemon from choosing to switch out, unless they are holding a Shed Shell.",
			shortDesc: "Prevents opposing Steel-type Pokemon from choosing to switch out.",
		},
		gen3: {
			desc: "Prevents Steel-type Pokemon from choosing to switch out, other than this Pokemon.",
			shortDesc: "Prevents Steel-type Pokemon from choosing to switch out, other than this Pokemon.",
		},
	},
	marvelscale: {
		name: "Marvel Scale",
		shortDesc: "If this Pokemon has a non-volatile status condition, its Defense is multiplied by 1.5.",
	},
	megalauncher: {
		name: "Mega Launcher",
		desc: "This Pokemon's pulse moves have their power multiplied by 1.5. Heal Pulse restores 3/4 of a target's maximum HP, rounded half down.",
		shortDesc: "This Pokemon's pulse moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.",
	},
	merciless: {
		name: "Merciless",
		shortDesc: "This Pokemon's attacks are critical hits if the target is poisoned.",
	},
	mimicry: {
		name: "Mimicry",
		desc: "This Pokemon's types change to match the active Terrain when this Pokemon acquires this Ability, or whenever a Terrain begins. Electric type during Electric Terrain, Grass type during Grassy Terrain, Fairy type during Misty Terrain, and Psychic type during Psychic Terrain. If this Ability is acquired without an active Terrain, or a Terrain ends, this Pokemon's types become the original types for its species.",
		shortDesc: "This Pokemon's types change to match the Terrain. Type reverts when Terrain ends.",

		activate: "  [POKEMON] returned to its original type!",
	},
	minus: {
		name: "Minus",
		desc: "If an active ally has this Ability or the Plus Ability, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Plus Ability, this Pokemon's Sp. Atk is 1.5x.",
		gen4: {
			desc: "If an active ally has the Plus Ability, this Pokemon's Special Attack is multiplied by 1.5.",
			shortDesc: "If an active ally has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.",
		},
		gen3: {
			desc: "If an active Pokemon has the Plus Ability, this Pokemon's Special Attack is multiplied by 1.5.",
			shortDesc: "If an active Pokemon has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.",
		},
	},
	mirrorarmor: {
		name: "Mirror Armor",
		desc: "When one of this Pokemon's stat stages would be lowered by another Pokemon, that Pokemon's stat stage is lowered instead. This effect does not happen if this Pokemon's stat stage was already -6. If the other Pokemon has a substitute, neither Pokemon has its stat stage lowered.",
		shortDesc: "If this Pokemon's stat stages would be lowered, the attacker's are lowered instead.",
	},
	mistysurge: {
		name: "Misty Surge",
		shortDesc: "On switch-in, this Pokemon summons Misty Terrain.",
	},
	moldbreaker: {
		name: "Mold Breaker",
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		gen7: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen6: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen5: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Battle Armor, Big Pecks, Clear Body, Contrary, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Friend Guard, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen4: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightning Rod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, and Wonder Guard. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move. The Attack modifier from an ally's Flower Gift Ability is not negated.",
		},

		start: "  [POKEMON] breaks the mold!",
	},
	moody: {
		name: "Moody",
		desc: "This Pokemon has a random stat, other than accuracy or evasiveness, raised by 2 stages and another stat lowered by 1 stage at the end of each turn.",
		shortDesc: "Boosts a random stat (except accuracy/evasion) +2 and another stat -1 every turn.",
		gen7: {
			desc: "This Pokemon has a random stat raised by 2 stages and another stat lowered by 1 stage at the end of each turn.",
			shortDesc: "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.",
		},
	},
	motordrive: {
		name: "Motor Drive",
		desc: "This Pokemon is immune to Electric-type moves and raises its Speed by 1 stage when hit by an Electric-type move.",
		shortDesc: "This Pokemon's Speed is raised 1 stage if hit by an Electric move; Electric immunity.",
	},
	moxie: {
		name: "Moxie",
		desc: "This Pokemon's Attack is raised by 1 stage if it attacks and knocks out another Pokemon.",
		shortDesc: "This Pokemon's Attack is raised by 1 stage if it attacks and KOes another Pokemon.",
	},
	multiscale: {
		name: "Multiscale",
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
	},
	multitype: {
		name: "Multitype",
		shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate.",
		gen7: {
			shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal.",
		},
		gen6: {
			shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate.",
		},
		gen4: {
			shortDesc: "If this Pokemon is an Arceus, its type changes to match its held Plate. This Pokemon cannot lose its held item due to another Pokemon's attack.",
		},
	},
	mummy: {
		name: "Mummy",
		desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect Pokemon with the As One, Battle Bond, Comatose, Commander, Disguise, Gulp Missile, Hadron Engine, Ice Face, Multitype, Mummy, Orichalcum Pulse, Power Construct, Protosynthesis, Quark Drive, RKS System, Schooling, Shields Down, Stance Change, Zen Mode, or Zero to Hero Abilities.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy.",
		gen8: {
			desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect Pokemon with the As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Mummy, Power Construct, RKS System, Schooling, Shields Down, Stance Change, or Zen Mode Abilities.",
		},
		gen7: {
			desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect Pokemon with the Battle Bond, Comatose, Disguise, Multitype, Mummy, Power Construct, RKS System, Schooling, Shields Down, Stance Change, or Zen Mode Abilities.",
		},
		gen6: {
			desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect Pokemon with the Multitype, Mummy, or Stance Change Abilities.",
		},
		gen5: {
			desc: "Pokemon making contact with this Pokemon have their Ability changed to Mummy. Does not affect Pokemon with the Multitype or Mummy Abilities.",
		},

		changeAbility: "  [TARGET]'s Ability became Mummy!",
	},
	myceliummight: {
		name: "Mycelium Might",
		desc: "This Pokemon's Status moves ignore certain Abilities of other Pokemon, and go last among Pokemon using the same or greater priority moves.",
		shortDesc: "This Pokemon's Status moves go last in their priority bracket and ignore Abilities.",
	},
	naturalcure: {
		name: "Natural Cure",
		shortDesc: "This Pokemon has its non-volatile status condition cured when it switches out.",

		activate: "  ([POKEMON] is cured by its Natural Cure!)",
	},
	neuroforce: {
		name: "Neuroforce",
		desc: "This Pokemon's attacks that are super effective against the target have their damage multiplied by 1.25.",
		shortDesc: "This Pokemon's attacks that are super effective against the target do 1.25x damage.",
	},
	neutralizinggas: {
		name: "Neutralizing Gas",
		desc: "While this Pokemon is active, Abilities have no effect. This Ability activates before hazards and other Abilities take effect. Does not affect the As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, or Zen Mode Abilities.",
		shortDesc: "While this Pokemon is active, Abilities have no effect.",

		start: "  Neutralizing gas filled the area!",
		end: "  The effects of the neutralizing gas wore off!",
	},
	noguard: {
		name: "No Guard",
		shortDesc: "Every move used by or against this Pokemon will always hit.",
	},
	normalize: {
		name: "Normalize",
		desc: "This Pokemon's moves are changed to be Normal type and have their power multiplied by 1.2. This effect comes before other effects that change a move's type.",
		shortDesc: "This Pokemon's moves are changed to be Normal type and have 1.2x power.",
		gen6: {
			desc: "This Pokemon's moves are changed to be Normal type. This effect comes before other effects that change a move's type.",
			shortDesc: "This Pokemon's moves are changed to be Normal type.",
		},
		gen4: {
			desc: "This Pokemon's moves are changed to be Normal type. This effect comes after other effects that change a move's type, except Struggle.",
		},
	},
	oblivious: {
		name: "Oblivious",
		desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while infatuated or taunted cures it. This Pokemon is immune to the effect of the Intimidate Ability.",
		shortDesc: "This Pokemon cannot be infatuated or taunted. Immune to Intimidate.",
		gen7: {
			desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while infatuated or taunted cures it.",
			shortDesc: "This Pokemon cannot be infatuated or taunted.",
		},
		gen5: {
			desc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
			shortDesc: "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.",
		},
	},
	opportunist: {
		name: "Opportunist",
		shortDesc: "When an opposing Pokemon has a stat stage raised, this Pokemon copies the effect.",
	},
	orichalcumpulse: {
		name: "Orichalcum Pulse",
		shortDesc: "On switch-in, summons Sunny Day. During Sunny Day, Attack is 1.3333x.",

		start: "  [POKEMON] turned the sunlight harsh, sending its ancient pulse into a frenzy!",
		activate: "  [POKEMON] basked in the sunlight, sending its ancient pulse into a frenzy!",
	},
	overcoat: {
		name: "Overcoat",
		desc: "This Pokemon is immune to powder moves, damage from Sandstorm, and the effects of Rage Powder and the Effect Spore Ability.",
		shortDesc: "This Pokemon is immune to powder moves, Sandstorm damage, and Effect Spore.",
		gen8: {
			desc: "This Pokemon is immune to powder moves, damage from Sandstorm or Hail, and the effects of Rage Powder and the Effect Spore Ability.",
			shortDesc: "This Pokemon is immune to powder moves, Sandstorm or Hail damage, Effect Spore.",
		},
		gen5: {
			desc: "This Pokemon is immune to damage from Sandstorm or Hail.",
			shortDesc: "This Pokemon is immune to damage from Sandstorm or Hail.",
		},
	},
	overgrow: {
		name: "Overgrow",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Grass-type attack.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Grass attacks.",
		gen4: {
			desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Grass-type attacks have their power multiplied by 1.5.",
			shortDesc: "At 1/3 or less of its max HP, this Pokemon's Grass-type attacks have 1.5x power.",
		},
	},
	owntempo: {
		name: "Own Tempo",
		desc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it. This Pokemon is immune to the effect of the Intimidate Ability.",
		shortDesc: "This Pokemon cannot be confused. Immune to Intimidate.",
		gen7: {
			desc: "This Pokemon cannot be confused. Gaining this Ability while confused cures it.",
			shortDesc: "This Pokemon cannot be confused.",
		},
	},
	parentalbond: {
		name: "Parental Bond",
		desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage quartered. Does not affect Doom Desire, Dragon Darts, Dynamax Cannon, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, any multi-hit move, any move that has multiple targets, or any two-turn move.",
		shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage quartered.",
		gen8: {
			desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage quartered. Does not affect Doom Desire, Dragon Darts, Dynamax Cannon, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, any multi-hit move, any move that has multiple targets, any two-turn move, or any Max Move.",
		},
		gen7: {
			desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage quartered. Does not affect Doom Desire, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, any multi-hit move, any move that has multiple targets, any two-turn move, or any Z-Move.",
		},
		gen6: {
			desc: "This Pokemon's damaging moves become multi-hit moves that hit twice. The second hit has its damage halved. Does not affect Doom Desire, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, any multi-hit move, any move that has multiple targets, or any two-turn move.",
			shortDesc: "This Pokemon's damaging moves hit twice. The second hit has its damage halved.",
		},
	},
	pastelveil: {
		name: "Pastel Veil",
		desc: "This Pokemon and its allies cannot be poisoned. Gaining this Ability while this Pokemon or its ally is poisoned cures them. If this Ability is being ignored during an effect that causes poison, this Pokemon is cured immediately but its ally is not.",
		shortDesc: "This Pokemon and its allies cannot be poisoned. On switch-in, cures poisoned allies.",
	},
	perishbody: {
		name: "Perish Body",
		desc: "Making contact with this Pokemon starts the Perish Song effect for it and the attacker. This effect does not happen for this Pokemon if the attacker already has a perish count.",
		shortDesc: "Making contact with this Pokemon starts the Perish Song effect for it and the attacker.",

		start: "  Both Pok\u00E9mon will faint in three turns!",
	},
	pickpocket: {
		name: "Pickpocket",
		desc: "If this Pokemon has no item and is hit by a contact move, it steals the attacker's item. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability.",
		shortDesc: "If this Pokemon has no item and is hit by a contact move, it steals the attacker's item.",
	},
	pickup: {
		name: "Pickup",
		shortDesc: "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.",
		gen4: {
			desc: "No competitive use.",
			shortDesc: "No competitive use.",
		},

		addItem: "#recycle",
	},
	pixilate: {
		name: "Pixilate",
		desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.2x power.",
		gen6: {
			desc: "This Pokemon's Normal-type moves become Fairy-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
			shortDesc: "This Pokemon's Normal-type moves become Fairy type and have 1.3x power.",
		},
	},
	plus: {
		name: "Plus",
		desc: "If an active ally has this Ability or the Minus Ability, this Pokemon's Special Attack is multiplied by 1.5.",
		shortDesc: "If an active ally has this Ability or the Minus Ability, this Pokemon's Sp. Atk is 1.5x.",
		gen4: {
			desc: "If an active ally has the Minus Ability, this Pokemon's Special Attack is multiplied by 1.5.",
			shortDesc: "If an active ally has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.",
		},
		gen3: {
			desc: "If an active Pokemon has the Minus Ability, this Pokemon's Special Attack is multiplied by 1.5.",
			shortDesc: "If an active Pokemon has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.",
		},
	},
	poisonheal: {
		name: "Poison Heal",
		desc: "If this Pokemon is poisoned, it restores 1/8 of its maximum HP, rounded down, at the end of each turn instead of losing HP.",
		shortDesc: "This Pokemon is healed by 1/8 of its max HP each turn when poisoned; no HP loss.",
	},
	poisonpoint: {
		name: "Poison Point",
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be poisoned.",
		gen4: {
			desc: "30% chance a Pokemon making contact with this Pokemon will be poisoned. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
		gen3: {
			desc: "1/3 chance a Pokemon making contact with this Pokemon will be poisoned. This effect does not happen if this Pokemon did not lose HP from the attack.",
			shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be poisoned.",
		},
	},
	poisontouch: {
		name: "Poison Touch",
		desc: "This Pokemon's contact moves have a 30% chance of poisoning. This effect comes after a move's inherent secondary effect chance.",
		shortDesc: "This Pokemon's contact moves have a 30% chance of poisoning.",
	},
	powerconstruct: {
		name: "Power Construct",
		desc: "If this Pokemon is a Zygarde in its 10% or 50% Forme, it changes to Complete Forme when it has 1/2 or less of its maximum HP at the end of the turn.",
		shortDesc: "If Zygarde 10%/50%, changes to Complete if at 1/2 max HP or less at end of turn.",

		activate: "  You sense the presence of many!",
		transform: "[POKEMON] transformed into its Complete Forme!",
	},
	powerofalchemy: {
		name: "Power of Alchemy",
		desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are As One, Battle Bond, Comatose, Commander, Disguise, Flower Gift, Forecast, Gulp Missile, Hadron Engine, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Orichalcum Pulse, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, Zen Mode, and Zero to Hero.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		gen8: {
			desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		},
		gen7: {
			desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		},

		changeAbility: "#receiver",
	},
	powerspot: {
		name: "Power Spot",
		desc: "This Pokemon's allies have the power of their moves multiplied by 1.3. This affects Doom Desire and Future Sight, even if the user is not on the field.",
		shortDesc: "This Pokemon's allies have the power of their moves multiplied by 1.3.",
	},
	prankster: {
		name: "Prankster",
		desc: "This Pokemon's non-damaging moves have their priority increased by 1. Opposing Dark-type Pokemon are immune to these moves, and any move called by these moves, if the resulting user of the move has this Ability.",
		shortDesc: "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.",
		gen6: {
			desc: "This Pokemon's non-damaging moves have their priority increased by 1.",
			shortDesc: "This Pokemon's non-damaging moves have their priority increased by 1.",
		},
	},
	pressure: {
		name: "Pressure",
		desc: "If this Pokemon is the target of an opposing Pokemon's move, that move loses one additional PP. Imprison, Snatch, and Tera Blast also lose one additional PP when used by an opposing Pokemon, but Sticky Web does not.",
		shortDesc: "If this Pokemon is the target of a foe's move, that move loses one additional PP.",
		gen8: {
			desc: "If this Pokemon is the target of an opposing Pokemon's move, that move loses one additional PP. Imprison and Snatch also lose one additional PP when used by an opposing Pokemon, but Sticky Web does not.",
		},
		gen5: {
			desc: "If this Pokemon is the target of an opposing Pokemon's move, that move loses one additional PP. Imprison and Snatch also lose one additional PP when used by an opposing Pokemon.",
		},
		gen4: {
			desc: "If this Pokemon is the target of another Pokemon's move, that move loses one additional PP.",
			shortDesc: "If this Pokemon is the target of a move, that move loses one additional PP.",
		},

		start: "  [POKEMON] is exerting its pressure!",
	},
	primordialsea: {
		name: "Primordial Sea",
		desc: "On switch-in, the weather becomes Primordial Sea, which includes all the effects of Rain Dance and prevents damaging Fire-type moves from executing. This weather remains in effect until this Ability is no longer active for any Pokemon, or the weather is changed by the Delta Stream or Desolate Land Abilities.",
		shortDesc: "On switch-in, heavy rain begins until this Ability is not active in battle.",
	},
	prismarmor: {
		name: "Prism Armor",
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
	},
	propellertail: {
		name: "Propeller Tail",
		shortDesc: "This Pokemon's moves cannot be redirected to a different target by any effect.",
	},
	protean: {
		name: "Protean",
		desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type. This effect can only happen once per switch-in, and only if this Pokemon is not Terastallized.",
		shortDesc: "This Pokemon's type changes to the type of the move it is using. Once per switch-in.",
		gen8: {
			desc: "This Pokemon's type changes to match the type of the move it is about to use. This effect comes after all effects that change a move's type.",
			shortDesc: "This Pokemon's type changes to match the type of the move it is about to use.",
		},
	},
	protosynthesis: {
		name: "Protosynthesis",
		desc: "If Sunny Day is active or this Pokemon uses a held Booster Energy, this Pokemon's highest stat is multiplied by 1.3, or by 1.5 if the highest stat is Speed. Stat stage changes are considered at the time this Ability activates. If multiple stats are tied, Attack, Defense, Special Attack, Special Defense, and Speed are prioritized in that order. If this effect was started by Sunny Day, a held Booster Energy will not activate and the effect ends when Sunny Day is no longer active. If this effect was started by a held Booster Energy, it ends when this Pokemon is no longer active.",
		shortDesc: "Sunny Day active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",

		activate: "  The harsh sunlight activated [POKEMON]'s Protosynthesis!",
		activateFromItem: "  [POKEMON] used its Booster Energy to activate Protosynthesis!",
		start: "  [POKEMON]'s [STAT] was heightened!",
		end: "  The effects of [POKEMON]'s Protosynthesis wore off!",
	},
	psychicsurge: {
		name: "Psychic Surge",
		shortDesc: "On switch-in, this Pokemon summons Psychic Terrain.",
	},
	punkrock: {
		name: "Punk Rock",
		desc: "This Pokemon's sound-based moves have their power multiplied by 1.3. This Pokemon takes halved damage from sound-based moves.",
		shortDesc: "This Pokemon receives 1/2 damage from sound moves. Its own have 1.3x power.",
	},
	purepower: {
		name: "Pure Power",
		shortDesc: "This Pokemon's Attack is doubled.",
	},
	purifyingsalt: {
		name: "Purifying Salt",
		desc: "This Pokemon cannot become affected by a non-volatile status condition or Yawn. If a Pokemon uses a Ghost-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Ghost damage to this Pokemon dealt with a halved offensive stat; can't be statused.",
	},
	quarkdrive: {
		name: "Quark Drive",
		desc: "If Electric Terrain is active or this Pokemon uses a held Booster Energy, this Pokemon's highest stat is multiplied by 1.3, or by 1.5 if the highest stat is Speed. Stat stage changes are considered at the time this Ability activates. If multiple stats are tied, Attack, Defense, Special Attack, Special Defense, and Speed are prioritized in that order. If this effect was started by Electric Terrain, a held Booster Energy will not activate and the effect ends when Electric Terrain is no longer active. If this effect was started by a held Booster Energy, it ends when this Pokemon is no longer active.",
		shortDesc: "Electric Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.",

		activate: "  The Electric Terrain activated [POKEMON]'s Quark Drive!",
		activateFromItem: "  [POKEMON] used its Booster Energy to activate its Quark Drive!",
		start: "  [POKEMON]'s [STAT] was heightened!",
		end: "  The effects of [POKEMON]'s Quark Drive wore off!",
	},
	queenlymajesty: {
		name: "Queenly Majesty",
		desc: "Priority moves used by opposing Pokemon targeting this Pokemon or its allies are prevented from having an effect.",
		shortDesc: "This Pokemon and its allies are protected from opposing priority moves.",

		block: "#damp",
	},
	quickdraw: {
		name: "Quick Draw",
		shortDesc: "This Pokemon has a 30% chance to move first in its priority bracket with attacking moves.",

		activate: "  Quick Draw made [POKEMON] move faster!",
	},
	quickfeet: {
		name: "Quick Feet",
		desc: "If this Pokemon has a non-volatile status condition, its Speed is multiplied by 1.5. This Pokemon ignores the paralysis effect of halving Speed.",
		shortDesc: "If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.",
		gen6: {
			desc: "If this Pokemon has a non-volatile status condition, its Speed is multiplied by 1.5. This Pokemon ignores the paralysis effect of quartering Speed.",
		},
	},
	raindish: {
		name: "Rain Dish",
		desc: "If Rain Dance is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Rain Dance is active, this Pokemon heals 1/16 of its max HP each turn.",
		gen7: {
			desc: "If Rain Dance is active, this Pokemon restores 1/16 of its maximum HP, rounded down, at the end of each turn.",
		},
	},
	rattled: {
		name: "Rattled",
		desc: "This Pokemon's Speed is raised by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack, or if an opposing Pokemon affected this Pokemon with the Intimidate Ability.",
		shortDesc: "Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack, or Intimidated.",
		gen7: {
			desc: "This Pokemon's Speed is raised by 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
			shortDesc: "This Pokemon's Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.",
		},
	},
	receiver: {
		name: "Receiver",
		desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are As One, Battle Bond, Comatose, Commander, Disguise, Flower Gift, Forecast, Gulp Missile, Hadron Engine, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Orichalcum Pulse, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, Zen Mode, and Zero to Hero.",
		shortDesc: "This Pokemon copies the Ability of an ally that faints.",
		gen8: {
			desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		},
		gen7: {
			desc: "This Pokemon copies the Ability of an ally that faints. Abilities that cannot be copied are Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard, and Zen Mode.",
		},

		changeAbility: "  [SOURCE]'s [ABILITY] was taken over!",
	},
	reckless: {
		name: "Reckless",
		desc: "This Pokemon's attacks with recoil or crash damage have their power multiplied by 1.2. Does not affect Struggle.",
		shortDesc: "This Pokemon's attacks with recoil or crash damage have 1.2x power; not Struggle.",
	},
	refrigerate: {
		name: "Refrigerate",
		desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.2x power.",
		gen6: {
			desc: "This Pokemon's Normal-type moves become Ice-type moves and have their power multiplied by 1.3. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
			shortDesc: "This Pokemon's Normal-type moves become Ice type and have 1.3x power.",
		},
	},
	regenerator: {
		name: "Regenerator",
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.",
	},
	ripen: {
		name: "Ripen",
		desc: "When this Pokemon eats certain Berries, the effects are doubled. Berries that restore HP or PP have the amount doubled, Berries that raise stat stages have the amount doubled, Berries that halve damage taken quarter it instead, and a Jaboca Berry or Rowap Berry has the attacker lose 1/4 of its maximum HP, rounded down.",
		shortDesc: "When this Pokemon eats certain Berries, the effects are doubled.",
	},
	rivalry: {
		name: "Rivalry",
		desc: "This Pokemon's attacks have their power multiplied by 1.25 against targets of the same gender or multiplied by 0.75 against targets of the opposite gender. There is no modifier if either this Pokemon or the target is genderless.",
		shortDesc: "This Pokemon's attacks do 1.25x on same gender targets; 0.75x on opposite gender.",
	},
	rkssystem: {
		name: "RKS System",
		shortDesc: "If this Pokemon is a Silvally, its type changes to match its held Memory.",
	},
	rockhead: {
		name: "Rock Head",
		desc: "This Pokemon does not take recoil damage, except Struggle. Does not affect Life Orb damage or crash damage.",
		shortDesc: "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.",
		gen3: {
			desc: "This Pokemon does not take recoil damage, except Struggle. Does not affect crash damage.",
			shortDesc: "This Pokemon does not take recoil damage besides Struggle and crash damage.",
		},
	},
	rockypayload: {
		name: "Rocky Payload",
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Rock-type attack.",
	},
	roughskin: {
		name: "Rough Skin",
		desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down.",
		shortDesc: "Pokemon making contact with this Pokemon lose 1/8 of their max HP.",
		gen4: {
			desc: "Pokemon making contact with this Pokemon lose 1/8 of their maximum HP, rounded down. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
		gen3: {
			desc: "Pokemon making contact with this Pokemon lose 1/16 of their maximum HP, rounded down. This effect does not happen if this Pokemon did not lose HP from the attack.",
			shortDesc: "Pokemon making contact with this Pokemon lose 1/16 of their max HP.",
		},

		damage: "  [POKEMON] was hurt!",
	},
	runaway: {
		name: "Run Away",
		shortDesc: "No competitive use.",
	},
	sandforce: {
		name: "Sand Force",
		desc: "If Sandstorm is active, this Pokemon's Ground-, Rock-, and Steel-type attacks have their power multiplied by 1.3. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.",
	},
	sandrush: {
		name: "Sand Rush",
		desc: "If Sandstorm is active, this Pokemon's Speed is doubled. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.",
	},
	sandspit: {
		name: "Sand Spit",
		shortDesc: "When this Pokemon is hit by an attack, the effect of Sandstorm begins.",
		gen8: {
			desc: "When this Pokemon is hit by an attack, the effect of Sandstorm begins. This effect comes after the effects of Max and G-Max Moves.",
		},
	},
	sandstream: {
		name: "Sand Stream",
		shortDesc: "On switch-in, this Pokemon summons Sandstorm.",
	},
	sandveil: {
		name: "Sand Veil",
		desc: "If Sandstorm is active, the accuracy of moves used against this Pokemon is multiplied by 0.8. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "If Sandstorm is active, this Pokemon's evasiveness is 1.25x; immunity to Sandstorm.",
	},
	sapsipper: {
		name: "Sap Sipper",
		desc: "This Pokemon is immune to Grass-type moves and raises its Attack by 1 stage when hit by a Grass-type move.",
		shortDesc: "This Pokemon's Attack is raised 1 stage if hit by a Grass move; Grass immunity.",
	},
	schooling: {
		name: "Schooling",
		desc: "On switch-in, if this Pokemon is a Wishiwashi that is level 20 or above and has more than 1/4 of its maximum HP left, it changes to School Form. If it is in School Form and its HP drops to 1/4 of its maximum HP or less, it changes to Solo Form at the end of the turn. If it is in Solo Form and its HP is greater than 1/4 its maximum HP at the end of the turn, it changes to School Form.",
		shortDesc: "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.",

		transform: "[POKEMON] formed a school!",
		transformEnd: "[POKEMON] stopped schooling!",
	},
	scrappy: {
		name: "Scrappy",
		desc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves. This Pokemon is immune to the effect of the Intimidate Ability.",
		shortDesc: "Fighting, Normal moves hit Ghost. Immune to Intimidate.",
		gen7: {
			desc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
			shortDesc: "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.",
		},
	},
	screencleaner: {
		name: "Screen Cleaner",
		shortDesc: "On switch-in, the effects of Aurora Veil, Light Screen, and Reflect end for both sides.",
	},
	seedsower: {
		name: "Seed Sower",
		shortDesc: "When this Pokemon is hit by an attack, the effect of Grassy Terrain begins.",
	},
	serenegrace: {
		name: "Serene Grace",
		desc: "This Pokemon's moves have their secondary effect chance doubled. This effect stacks with the Rainbow effect, except for secondary effects that cause the target to flinch.",
		shortDesc: "This Pokemon's moves have their secondary effect chance doubled.",
		gen4: {
			desc: "This Pokemon's moves have their secondary effect chance doubled.",
		},
	},
	shadowshield: {
		name: "Shadow Shield",
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
	},
	shadowtag: {
		name: "Shadow Tag",
		desc: "Prevents opposing Pokemon from choosing to switch out, unless they are holding a Shed Shell, are a Ghost type, or also have this Ability.",
		shortDesc: "Prevents foes from choosing to switch unless they also have this Ability.",
		gen6: {
			desc: "Prevents adjacent opposing Pokemon from choosing to switch out, unless they are holding a Shed Shell, are a Ghost type, or also have this Ability.",
			shortDesc: "Prevents adjacent foes from choosing to switch unless they also have this Ability.",
		},
		gen5: {
			desc: "Prevents adjacent opposing Pokemon from choosing to switch out, unless they are holding a Shed Shell or also have this Ability.",
		},
		gen4: {
			desc: "Prevents opposing Pokemon from choosing to switch out, unless they are holding a Shed Shell or also have this Ability.",
			shortDesc: "Prevents foes from choosing to switch unless they also have this Ability.",
		},
		gen3: {
			desc: "Prevents opposing Pokemon from choosing to switch out.",
			shortDesc: "Prevents opposing Pokemon from choosing to switch out.",
		},
	},
	sharpness: {
		name: "Sharpness",
		shortDesc: "This Pokemon's slicing moves have their power multiplied by 1.5.",
	},
	shedskin: {
		name: "Shed Skin",
		desc: "This Pokemon has a 33% chance to have its non-volatile status condition cured at the end of each turn.",
		shortDesc: "This Pokemon has a 33% chance to have its status cured at the end of each turn.",
	},
	sheerforce: {
		name: "Sheer Force",
		desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed. If a secondary effect was removed, it also removes the user's Life Orb recoil and Shell Bell recovery, and prevents the target's Anger Shell, Berserk, Color Change, Emergency Exit, Pickpocket, Wimp Out, Red Card, Eject Button, Kee Berry, and Maranga Berry from activating.",
		shortDesc: "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.",
		gen8: {
			desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed. If a secondary effect was removed, it also removes the user's Life Orb recoil and Shell Bell recovery, and prevents the target's Berserk, Color Change, Emergency Exit, Pickpocket, Wimp Out, Red Card, Eject Button, Kee Berry, and Maranga Berry from activating.",
		},
		gen6: {
			desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed. If a secondary effect was removed, it also removes the user's Life Orb recoil and Shell Bell recovery, and prevents the target's Color Change, Pickpocket, Red Card, Eject Button, Kee Berry, and Maranga Berry from activating.",
		},
		gen5: {
			desc: "This Pokemon's attacks with secondary effects have their power multiplied by 1.3, but the secondary effects are removed. If a secondary effect was removed, it also removes the user's Life Orb recoil and Shell Bell recovery, and prevents the target's Color Change, Pickpocket, Red Card, and Eject Button from activating.",
		},
	},
	shellarmor: {
		name: "Shell Armor",
		shortDesc: "This Pokemon cannot be struck by a critical hit.",
	},
	shielddust: {
		name: "Shield Dust",
		shortDesc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack.",
	},
	shieldsdown: {
		name: "Shields Down",
		desc: "If this Pokemon is a Minior, it changes to its Core forme if it has 1/2 or less of its maximum HP, and changes to Meteor Form if it has more than 1/2 its maximum HP. This check is done on switch-in and at the end of each turn. While in its Meteor Form, it cannot become affected by a non-volatile status condition or Yawn.",
		shortDesc: "If Minior, switch-in/end of turn it changes to Core at 1/2 max HP or less, else Meteor.",

		transform: "Shields Down deactivated!\n([POKEMON] shielded itself.)",
		transformEnd: "Shields Down activated!\n([POKEMON] stopped shielding itself.)",
	},
	simple: {
		name: "Simple",
		shortDesc: "When one of this Pokemon's stat stages is raised or lowered, the amount is doubled.",
		gen7: {
			desc: "When one of this Pokemon's stat stages is raised or lowered, the amount is doubled. This Ability does not affect stat stage increases received from Z-Power effects that happen before a Status Z-Move is used.",
		},
		gen6: {
			desc: "When one of this Pokemon's stat stages is raised or lowered, the amount is doubled.",
		},
		gen4: {
			desc: "This Pokemon's stat stages are considered doubled during stat calculations. A stat stage cannot be considered more than 6 or less than -6.",
			shortDesc: "This Pokemon's stat stages are considered doubled during stat calculations.",
		},
	},
	skilllink: {
		name: "Skill Link",
		desc: "This Pokemon's multi-hit attacks always hit the maximum number of times. Triple Kick and Triple Axel do not check accuracy for the second and third hits.",
		shortDesc: "This Pokemon's multi-hit attacks always hit the maximum number of times.",
		gen7: {
			desc: "This Pokemon's multi-hit attacks always hit the maximum number of times. Triple Kick does not check accuracy for the second and third hits.",
		},
		gen4: {
			desc: "This Pokemon's multi-hit attacks always hit the maximum number of times. Does not affect Triple Kick.",
		},
	},
	slowstart: {
		name: "Slow Start",
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.",
		gen7: {
			desc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns. During the effect, if this Pokemon uses a generic Z-Move based on a special move, its Special Attack is halved during damage calculation.",
		},
		gen6: {
			desc: "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.",
		},

		start: "  [POKEMON] can't get it going!",
		end: "  [POKEMON] finally got its act together!",
	},
	slushrush: {
		name: "Slush Rush",
		shortDesc: "If Snow is active, this Pokemon's Speed is doubled.",
		gen8: {
			shortDesc: "If Hail is active, this Pokemon's Speed is doubled.",
		},
	},
	sniper: {
		name: "Sniper",
		shortDesc: "If this Pokemon strikes with a critical hit, the damage is multiplied by 1.5.",
	},
	snowcloak: {
		name: "Snow Cloak",
		desc: "If Snow is active, the accuracy of moves used against this Pokemon is multiplied by 0.8.",
		shortDesc: "If Snow is active, this Pokemon's evasiveness is 1.25x.",
		gen8: {
			desc: "If Hail is active, the accuracy of moves used against this Pokemon is multiplied by 0.8. This Pokemon takes no damage from Hail.",
			shortDesc: "If Hail is active, this Pokemon's evasiveness is 1.25x; immunity to Hail.",
		},
	},
	snowwarning: {
		name: "Snow Warning",
		shortDesc: "On switch-in, this Pokemon summons Snow.",
		gen8: {
			shortDesc: "On switch-in, this Pokemon summons Hail.",
		},
	},
	solarpower: {
		name: "Solar Power",
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn. These effects are prevented if the Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.",
		gen7: {
			desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and it loses 1/8 of its maximum HP, rounded down, at the end of each turn.",
		},
	},
	solidrock: {
		name: "Solid Rock",
		shortDesc: "This Pokemon receives 3/4 damage from supereffective attacks.",
	},
	soulheart: {
		name: "Soul-Heart",
		shortDesc: "This Pokemon's Special Attack is raised by 1 stage when another Pokemon faints.",
	},
	soundproof: {
		name: "Soundproof",
		shortDesc: "This Pokemon is immune to sound-based moves, unless it used the move.",
		gen7: {
			shortDesc: "This Pokemon is immune to sound-based moves, including Heal Bell.",
		},
		gen5: {
			shortDesc: "This Pokemon is immune to sound-based moves, except Heal Bell.",
		},
		gen4: {
			shortDesc: "This Pokemon is immune to sound-based moves, including Heal Bell.",
		},
	},
	speedboost: {
		name: "Speed Boost",
		desc: "This Pokemon's Speed is raised by 1 stage at the end of each full turn it has been on the field.",
		shortDesc: "This Pokemon's Speed is raised 1 stage at the end of each full turn on the field.",
	},
	stakeout: {
		name: "Stakeout",
		shortDesc: "This Pokemon's offensive stat is doubled against a target that switched in this turn.",
	},
	stall: {
		name: "Stall",
		shortDesc: "This Pokemon moves last among Pokemon using the same or greater priority moves.",
	},
	stalwart: {
		name: "Stalwart",
		shortDesc: "This Pokemon's moves cannot be redirected to a different target by any effect.",
	},
	stamina: {
		name: "Stamina",
		shortDesc: "This Pokemon's Defense is raised by 1 stage after it is damaged by a move.",
	},
	stancechange: {
		name: "Stance Change",
		desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before using an attacking move, and changes to Shield Forme before using King's Shield.",
		shortDesc: "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.",
		gen6: {
			desc: "If this Pokemon is an Aegislash, it changes to Blade Forme before attempting to use an attacking move, and changes to Shield Forme before attempting to use King's Shield.",
		},

		transform: "Changed to Blade Forme!",
		transformEnd: "Changed to Shield Forme!",
	},
	static: {
		name: "Static",
		shortDesc: "30% chance a Pokemon making contact with this Pokemon will be paralyzed.",
		gen4: {
			desc: "30% chance a Pokemon making contact with this Pokemon will be paralyzed. This effect does not happen if this Pokemon did not lose HP from the attack.",
		},
		gen3: {
			desc: "1/3 chance a Pokemon making contact with this Pokemon will be paralyzed. This effect does not happen if this Pokemon did not lose HP from the attack.",
			shortDesc: "1/3 chance a Pokemon making contact with this Pokemon will be paralyzed.",
		},
	},
	steadfast: {
		name: "Steadfast",
		shortDesc: "If this Pokemon flinches, its Speed is raised by 1 stage.",
	},
	steamengine: {
		name: "Steam Engine",
		desc: "This Pokemon's Speed is raised by 6 stages after it is damaged by a Fire- or Water-type move.",
		shortDesc: "This Pokemon's Speed is raised by 6 stages after it is damaged by Fire/Water moves.",
	},
	steelworker: {
		name: "Steelworker",
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using a Steel-type attack.",
	},
	steelyspirit: {
		name: "Steely Spirit",
		desc: "This Pokemon and its allies' Steel-type moves have their power multiplied by 1.5. This affects Doom Desire even if the user is not on the field.",
		shortDesc: "This Pokemon and its allies' Steel-type moves have their power multiplied by 1.5.",
	},
	stench: {
		name: "Stench",
		desc: "This Pokemon's attacks without a chance to make the target flinch gain a 10% chance to make the target flinch.",
		shortDesc: "This Pokemon's attacks without a chance to flinch gain a 10% chance to flinch.",
		gen4: {
			desc: "No competitive use.",
			shortDesc: "No competitive use.",
		},
	},
	stickyhold: {
		name: "Sticky Hold",
		desc: "This Pokemon cannot lose its held item due to another Pokemon's Ability or attack, unless the attack knocks out this Pokemon. A Sticky Barb will be transferred to other Pokemon regardless of this Ability.",
		shortDesc: "This Pokemon cannot lose its held item due to another Pokemon's Ability or attack.",
		gen4: {
			desc: "This Pokemon cannot lose its held item due to another Pokemon's attack, even if the attack knocks out this Pokemon. A Sticky Barb will be transferred to other Pokemon regardless of this Ability.",
		},

		block: "  [POKEMON]'s item cannot be removed!",
	},
	stormdrain: {
		name: "Storm Drain",
		desc: "This Pokemon is immune to Water-type moves and raises its Special Attack by 1 stage when hit by a Water-type move. If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself if it is within the range of that move. If multiple Pokemon could redirect with this Ability, it goes to the one with the highest Speed, or in the case of a tie to the one that has had this Ability active longer.",
		shortDesc: "This Pokemon draws Water moves to itself to raise Sp. Atk by 1; Water immunity.",
		gen4: {
			desc: "If this Pokemon is not the target of a single-target Water-type move used by another Pokemon, this Pokemon redirects that move to itself.",
			shortDesc: "This Pokemon draws single-target Water moves to itself.",
		},

		activate: "#lightningrod",
	},
	strongjaw: {
		name: "Strong Jaw",
		desc: "This Pokemon's bite-based attacks have their power multiplied by 1.5.",
		shortDesc: "This Pokemon's bite-based attacks have 1.5x power. Bug Bite is not boosted.",
	},
	sturdy: {
		name: "Sturdy",
		desc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. OHKO moves fail when used against this Pokemon.",
		shortDesc: "If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.",
		gen4: {
			desc: "OHKO moves fail when used against this Pokemon.",
			shortDesc: "OHKO moves fail when used against this Pokemon.",
		},

		activate: "  [POKEMON] endured the hit!",
	},
	suctioncups: {
		name: "Suction Cups",
		shortDesc: "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.",

		block: "  [POKEMON] is anchored in place with its suction cups!",
	},
	superluck: {
		name: "Super Luck",
		shortDesc: "This Pokemon's critical hit ratio is raised by 1 stage.",
	},
	supremeoverlord: {
		name: "Supreme Overlord",
		desc: "This Pokemon's moves have their power multiplied by 1+(X*0.1), where X is the total number of times any Pokemon has fainted on the user's side when this Ability became active, and X cannot be greater than 5.",
		shortDesc: "This Pokemon's moves have 10% more power for each fainted ally, up to 5 allies.",

		activate: "  [POKEMON] gained strength from the fallen!",
	},
	surgesurfer: {
		name: "Surge Surfer",
		shortDesc: "If Electric Terrain is active, this Pokemon's Speed is doubled.",
	},
	swarm: {
		name: "Swarm",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Bug-type attack.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Bug attacks.",
		gen4: {
			desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Bug-type attacks have their power multiplied by 1.5.",
			shortDesc: "At 1/3 or less of its max HP, this Pokemon's Bug-type attacks have 1.5x power.",
		},
	},
	sweetveil: {
		name: "Sweet Veil",
		desc: "This Pokemon and its allies cannot fall asleep, but those already asleep do not wake up immediately. This Pokemon and its allies cannot use Rest successfully or become affected by Yawn, and those previously affected will not fall asleep.",
		shortDesc: "This Pokemon and its allies cannot fall asleep; those already asleep do not wake up.",

		block: "  [POKEMON] can't fall asleep due to a veil of sweetness!",
	},
	swiftswim: {
		name: "Swift Swim",
		desc: "If Rain Dance is active, this Pokemon's Speed is doubled. This effect is prevented if this Pokemon is holding a Utility Umbrella.",
		shortDesc: "If Rain Dance is active, this Pokemon's Speed is doubled.",
		gen7: {
			desc: "If Rain Dance is active, this Pokemon's Speed is doubled.",
		},
	},
	swordofruin: {
		name: "Sword of Ruin",
		shortDesc: "Active Pokemon without this Ability have their Defense multiplied by 0.75.",

		start: "  [POKEMON]'s Sword of Ruin weakened the Defense of all surrounding Pokémon!",
	},
	symbiosis: {
		name: "Symbiosis",
		desc: "If an ally uses its item, this Pokemon gives its item to that ally immediately. Does not activate if the ally's item was stolen or knocked off, or if the ally used an Eject Button or Eject Pack.",
		shortDesc: "If an ally uses its item, this Pokemon gives its item to that ally immediately.",
		gen7: {
			desc: "If an ally uses its item, this Pokemon gives its item to that ally immediately. Does not activate if the ally's item was stolen or knocked off, or if the ally used an Eject Button.",
		},
		gen6: {
			desc: "If an ally uses its item, this Pokemon gives its item to that ally immediately. Does not activate if the ally's item was stolen or knocked off.",
		},

		activate: "  [POKEMON] shared its [ITEM] with [TARGET]!",
	},
	synchronize: {
		name: "Synchronize",
		desc: "If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon, that Pokemon receives the same non-volatile status condition.",
		shortDesc: "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.",
		gen4: {
			desc: "If another Pokemon burns, paralyzes, or poisons this Pokemon, that Pokemon receives the same non-volatile status condition. If another Pokemon badly poisons this Pokemon, that Pokemon becomes poisoned.",
		},
	},
	tabletsofruin: {
		name: "Tablets of Ruin",
		shortDesc: "Active Pokemon without this Ability have their Attack multiplied by 0.75.",

		start: "  [POKEMON]'s Tablets of Ruin weakened the Attack of all surrounding Pokémon!",
	},
	tangledfeet: {
		name: "Tangled Feet",
		shortDesc: "This Pokemon's evasiveness is doubled as long as it is confused.",
	},
	tanglinghair: {
		name: "Tangling Hair",
		shortDesc: "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.",
	},
	technician: {
		name: "Technician",
		desc: "This Pokemon's moves of 60 power or less have their power multiplied by 1.5, including Struggle. This effect comes after a move's effect changes its own power.",
		shortDesc: "This Pokemon's moves of 60 power or less have 1.5x power, including Struggle.",
		gen4: {
			desc: "This Pokemon's moves of 60 power or less have their power multiplied by 1.5, except Struggle. This effect comes after a move's effect changes its own power, as well as the effects of Charge and Helping Hand.",
			shortDesc: "This Pokemon's moves of 60 power or less have 1.5x power, except Struggle.",
		},
	},
	telepathy: {
		name: "Telepathy",
		shortDesc: "This Pokemon does not take damage from attacks made by its allies.",

		block: "  [POKEMON] can't be hit by attacks from its ally Pok\u00E9mon!",
	},
	teravolt: {
		name: "Teravolt",
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		gen7: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen6: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen5: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Battle Armor, Big Pecks, Clear Body, Contrary, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Friend Guard, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},

		start: "  [POKEMON] is radiating a bursting aura!",
	},
	thermalexchange: {
		name: "Thermal Exchange",
		desc: "This Pokemon's Attack is raised 1 stage after it is damaged by a Fire-type move. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Attack is raised by 1 when damaged by Fire moves; can't be burned.",
	},
	thickfat: {
		name: "Thick Fat",
		desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon.",
		shortDesc: "Fire-/Ice-type moves against this Pokemon deal damage with a halved offensive stat.",
		gen4: {
			desc: "The power of Fire- and Ice-type attacks against this Pokemon is halved.",
			shortDesc: "The power of Fire- and Ice-type attacks against this Pokemon is halved.",
		},
		gen3: {
			desc: "If a Pokemon uses a Fire- or Ice-type attack against this Pokemon, that Pokemon's Special Attack is halved when calculating the damage to this Pokemon.",
			shortDesc: "Fire-/Ice-type moves against this Pokemon deal damage with a halved Sp. Atk stat.",
		},
	},
	tintedlens: {
		name: "Tinted Lens",
		shortDesc: "This Pokemon's attacks that are not very effective on a target deal double damage.",
	},
	torrent: {
		name: "Torrent",
		desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its offensive stat is multiplied by 1.5 while using a Water-type attack.",
		shortDesc: "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Water attacks.",
		gen4: {
			desc: "When this Pokemon has 1/3 or less of its maximum HP, rounded down, its Water-type attacks have their power multiplied by 1.5.",
			shortDesc: "At 1/3 or less of its max HP, this Pokemon's Water-type attacks have 1.5x power.",
		},
	},
	toughclaws: {
		name: "Tough Claws",
		shortDesc: "This Pokemon's contact moves have their power multiplied by 1.3.",
	},
	toxicboost: {
		name: "Toxic Boost",
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 1.5.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 1.5x power.",
	},
	toxicdebris: {
		name: "Toxic Debris",
		shortDesc: "If this Pokemon is hit by a physical attack, Toxic Spikes are set on the opposing side.",
	},
	trace: {
		name: "Trace",
		desc: "On switch-in, this Pokemon copies a random opposing Pokemon's Ability. Abilities that cannot be copied are As One, Battle Bond, Comatose, Commander, Disguise, Flower Gift, Forecast, Gulp Missile, Hadron Engine, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Orichalcum Pulse, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Zen Mode, and Zero to Hero. If no opposing Pokemon has an Ability that can be copied, this Ability will activate as soon as one does.",
		shortDesc: "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.",
		gen8: {
			desc: "On switch-in, this Pokemon copies a random opposing Pokemon's Ability. Abilities that cannot be copied are As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, and Zen Mode. If no opposing Pokemon has an Ability that can be copied, this Ability will activate as soon as one does.",
		},
		gen7: {
			desc: "On switch-in, this Pokemon copies a random opposing Pokemon's Ability. Abilities that cannot be copied are Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, and Zen Mode. If no opposing Pokemon has an Ability that can be copied, this Ability will activate as soon as one does.",
		},
		gen6: {
			desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, and Zen Mode. If no opposing Pokemon has an Ability that can be copied, this Ability will activate as soon as one does.",
		},
		gen5: {
			desc: "On switch-in, this Pokemon copies a random adjacent opposing Pokemon's Ability. Abilities that cannot be copied are Flower Gift, Forecast, Illusion, Imposter, Multitype, Trace, and Zen Mode. If no opposing Pokemon has an Ability that can be copied, this Ability will activate as soon as one does.",
		},
		gen4: {
			desc: "On switch-in, this Pokemon copies a random opposing Pokemon's Ability. Abilities that cannot be copied are Forecast, Multitype, and Trace. If no opposing Pokemon has an Ability that can be copied, this Ability will activate as soon as one does.",
		},
		gen3: {
			desc: "On switch-in, this Pokemon copies a random opposing Pokemon's Ability.",
		},

		changeAbility: "  [POKEMON] traced [SOURCE]'s [ABILITY]!",
	},
	transistor: {
		name: "Transistor",
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using an Electric-type attack.",
	},
	triage: {
		name: "Triage",
		shortDesc: "This Pokemon's healing moves have their priority increased by 3.",
	},
	truant: {
		name: "Truant",
		shortDesc: "This Pokemon skips every other turn instead of using a move.",
		gen3: {
			desc: "This Pokemon skips every other turn instead of using a move. If this Pokemon replaces a Pokemon that fainted during end-of-turn effects, its first turn will be skipped.",
		},

		cant: "[POKEMON] is loafing around!",
	},
	turboblaze: {
		name: "Turboblaze",
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		gen7: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen6: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},
		gen5: {
			desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Battle Armor, Big Pecks, Clear Body, Contrary, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Friend Guard, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
		},

		start: "  [POKEMON] is radiating a blazing aura!",
	},
	unaware: {
		name: "Unaware",
		desc: "This Pokemon ignores other Pokemon's Attack, Special Attack, and accuracy stat stages when taking damage, and ignores other Pokemon's Defense, Special Defense, and evasiveness stat stages when dealing damage.",
		shortDesc: "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.",
	},
	unburden: {
		name: "Unburden",
		desc: "If this Pokemon loses its held item for any reason, its Speed is doubled as long as it remains active, has this Ability, and is not holding an item.",
		shortDesc: "Speed is doubled on held item loss; boost is lost if it switches, gets new item/Ability.",
	},
	unnerve: {
		name: "Unnerve",
		desc: "While this Pokemon is active, it prevents opposing Pokemon from using their Berries. This Ability activates before hazards and other Abilities take effect.",
		shortDesc: "While this Pokemon is active, it prevents opposing Pokemon from using their Berries.",

		start: "  [TEAM] is too nervous to eat Berries!",
	},
	unseenfist: {
		name: "Unseen Fist",
		shortDesc: "This Pokemon's contact moves ignore the target's protection, except Max Guard.",
	},
	vesselofruin: {
		name: "Vessel of Ruin",
		shortDesc: "Active Pokemon without this Ability have their Special Attack multiplied by 0.75.",

		start: "  [POKEMON]'s Vessel of Ruin weakened the Sp. Atk of all surrounding Pokémon!",
	},
	victorystar: {
		name: "Victory Star",
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 1.1.",
	},
	vitalspirit: {
		name: "Vital Spirit",
		shortDesc: "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.",
	},
	voltabsorb: {
		name: "Volt Absorb",
		desc: "This Pokemon is immune to Electric-type moves and restores 1/4 of its maximum HP, rounded down, when hit by an Electric-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.",
		gen3: {
			desc: "This Pokemon is immune to damaging Electric-type moves and restores 1/4 of its maximum HP, rounded down, when hit by one.",
			shortDesc: "This Pokemon heals 1/4 its max HP when hit by a damaging Electric move; immunity.",
		},
	},
	wanderingspirit: {
		name: "Wandering Spirit",
		desc: "Pokemon making contact with this Pokemon have their Ability swapped with this one. Does not affect Pokemon with the As One, Battle Bond, Comatose, Commander, Disguise, Gulp Missile, Hadron Engine, Hunger Switch, Ice Face, Illusion, Multitype, Neutralizing Gas, Orichalcum Pulse, Power Construct, Protosynthesis, Quark Drive, RKS System, Schooling, Shields Down, Stance Change, Wonder Guard, Zen Mode, or Zero to Hero Abilities.",
		shortDesc: "Pokemon making contact with this Pokemon have their Ability swapped with this one.",
		gen8: {
			desc: "Pokemon making contact with this Pokemon have their Ability swapped with this one. Does not affect Pokemon with the As One, Battle Bond, Comatose, Disguise, Gulp Missile, Hunger Switch, Ice Face, Illusion, Multitype, Neutralizing Gas, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Wonder Guard, or Zen Mode Abilities.",
		},

		activate: "#skillswap",
	},
	waterabsorb: {
		name: "Water Absorb",
		desc: "This Pokemon is immune to Water-type moves and restores 1/4 of its maximum HP, rounded down, when hit by a Water-type move.",
		shortDesc: "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.",
	},
	waterbubble: {
		name: "Water Bubble",
		desc: "This Pokemon's offensive stat is doubled while using a Water-type attack. If a Pokemon uses a Fire-type attack against this Pokemon, that Pokemon's offensive stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
	},
	watercompaction: {
		name: "Water Compaction",
		shortDesc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move.",
	},
	waterveil: {
		name: "Water Veil",
		shortDesc: "This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
	},
	weakarmor: {
		name: "Weak Armor",
		desc: "If a physical attack hits this Pokemon, its Defense is lowered by 1 stage and its Speed is raised by 2 stages.",
		shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 2.",
		gen6: {
			desc: "If a physical attack hits this Pokemon, its Defense is lowered by 1 stage and its Speed is raised by 1 stage.",
			shortDesc: "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 1.",
		},
	},
	wellbakedbody: {
		name: "Well-Baked Body",
		desc: "This Pokemon is immune to Fire-type moves and raises its Defense by 2 stages when hit by a Fire-type move.",
		shortDesc: "This Pokemon's Defense is raised 2 stages if hit by a Fire move; Fire immunity.",
	},
	whitesmoke: {
		name: "White Smoke",
		shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
	},
	wimpout: {
		name: "Wimp Out",
		desc: "When this Pokemon has more than 1/2 its maximum HP and takes damage bringing it to 1/2 or less of its maximum HP, it immediately switches out to a chosen ally. This effect applies after all hits from a multi-hit move. This effect is prevented if the move had a secondary effect removed by the Sheer Force Ability. This effect applies to both direct and indirect damage, except Curse and Substitute on use, Belly Drum, Pain Split, and confusion damage.",
		shortDesc: "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.",
	},
	windpower: {
		name: "Wind Power",
		desc: "This Pokemon gains the Charge effect when it takes a hit from a wind move or when Tailwind begins on this Pokemon's side.",
		shortDesc: "This Pokemon gains the Charge effect when hit by a wind move or Tailwind begins.",

		start: "#electromorphosis",
	},
	windrider: {
		name: "Wind Rider",
		desc: "This Pokemon is immune to wind moves and raises its Attack by 1 stage when hit by a wind move or when Tailwind begins on this Pokemon's side.",
		shortDesc: "Attack raised by 1 if hit by a wind move or Tailwind begins. Wind move immunity.",
	},
	wonderguard: {
		name: "Wonder Guard",
		shortDesc: "This Pokemon can only be damaged by supereffective moves and indirect damage.",
		gen4: {
			shortDesc: "This Pokemon is only damaged by Fire Fang, supereffective moves, indirect damage.",
		},
		gen3: {
			shortDesc: "This Pokemon is only damaged by supereffective moves and indirect damage.",
		},
	},
	wonderskin: {
		name: "Wonder Skin",
		desc: "Non-damaging moves that check accuracy have their accuracy changed to 50% when used against this Pokemon. This effect comes before other effects that modify accuracy.",
		shortDesc: "Status moves with accuracy checks are 50% accurate when used on this Pokemon.",
	},
	zenmode: {
		name: "Zen Mode",
		desc: "If this Pokemon is a Darmanitan or Galarian Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode.",
		shortDesc: "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.",
		gen7: {
			desc: "If this Pokemon is a Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode.",
		},
		gen6: {
			desc: "If this Pokemon is a Darmanitan, it changes to Zen Mode if it has 1/2 or less of its maximum HP at the end of a turn. If Darmanitan's HP is above 1/2 of its maximum HP at the end of a turn, it changes back to Standard Mode. If Darmanitan loses this Ability while in Zen Mode, it reverts to Standard Mode immediately.",
		},

		transform: "Zen Mode triggered!",
		transformEnd: "Zen Mode ended!",
	},
	zerotohero: {
		name: "Zero to Hero",
		shortDesc: "If this Pokemon is a Palafin in Zero Form, switching out has it change to Hero Form.",

		activate: "  [POKEMON] underwent a heroic transformation!",
	},

	// CAP
	mountaineer: {
		name: "Mountaineer",
		shortDesc: "On switch-in, this Pokemon avoids all Rock-type attacks and Stealth Rock.",
	},
	rebound: {
		name: "Rebound",
		desc: "On switch-in, this Pokemon blocks certain status moves and instead uses the move against the original user.",
		shortDesc: "On switch-in, blocks certain status moves and bounces them back to the user.",

		move: "#magiccoat",
	},
	persistent: {
		name: "Persistent",
		desc: "The duration of Gravity, Heal Block, Magic Room, Safeguard, Tailwind, Trick Room, and Wonder Room is increased by 2 turns if the effect is started by this Pokemon.",
		shortDesc: "When used, Gravity/Heal Block/Safeguard/Tailwind/Room effects last 2 more turns.",

		activate: "  [POKEMON] extends [MOVE] by 2 turns!",
	},
};
