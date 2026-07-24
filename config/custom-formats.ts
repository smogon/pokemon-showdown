// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
//
// This file holds THIS FORK's formats. mergeFormatLists (sim/dex-formats.ts:561)
// merges it into config/formats.ts's list at load, which keeps config/formats.ts
// near-pristine: upstream touches that file ~330 times a year, so carrying our
// formats inline made every sync conflict across ~600 lines instead of ~15.
//
// The five section headers below are ALSO declared, bodyless, in
// config/formats.ts. That duplication is deliberate and load-bearing:
// mergeFormatLists keys sections by name and appends into the existing bucket,
// so the copy over there is what pins each section's position and column. With
// it, the merged list is byte-identical to having everything inline; without it,
// the section relocates to the END of the list and renders in a trailing column.
//
// This file MUST exist at build time. If it is missing the loader silently skips
// the merge (dex-formats.ts:640-649) and then drops the bodyless headers (:657):
// 333 formats instead of 382, with no error and no log line. It is un-gitignored
// on purpose (.gitignore) and test/sim/misc/fork-customs.js asserts every section
// is non-empty so that failure is loud.

export const Formats: import('../sim/dex-formats').FormatList = [

	{
		section: "Gen 3 Megas",
		column: 1,
	},
	{
		name: "[Gen 3] Megas",
		desc: "Gen 3 OU with Mega Evolution and Primal Reversion (no Fairy type, no Mega Rayquaza, no Mega Charizard Y).",
		mod: 'gen3mega',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Uber', 'Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
		// Ability-based complex bans, enforced on the resolved (Mega) forme. The team
		// validator rewrites a stone-holder's set ability back to its base ability
		// (No Guard -> Static, Parental Bond -> Scrappy) before banlist matching, so a
		// plain 'No Guard + Dynamic Punch' / 'Parental Bond + ...' banlist entry can't
		// see the Mega ability. Check tierSpecies.abilities (the in-battle forme) instead.
		onValidateSet(set) {
			const { tierSpecies } = this.getValidationSpecies(set);
			const megaAbilities = Object.values(tierSpecies.abilities);
			const moves = set.moves || [];
			const problems = [];

			// No Guard makes the 50%-accuracy, always-confuse Dynamic Punch a guaranteed
			// hit. No Guard is only obtainable here on Mega formes (Pidgeot-Mega, Raichu-Mega-Y).
			if (megaAbilities.includes('No Guard') &&
				moves.some(move => this.dex.toID(move) === 'dynamicpunch')) {
				problems.push(`${set.name || set.species} can't combine No Guard (from ${tierSpecies.name}) with Dynamic Punch.`);
			}

			// Parental Bond (Kangaskhan-Mega only) strikes twice; fixed-damage moves deal
			// their full fixed amount on BOTH hits (the engine returns before the damage
			// reducer runs), e.g. Seismic Toss for 200 guaranteed per turn.
			if (megaAbilities.includes('Parental Bond')) {
				const fixedDamageMove = moves.find(move => {
					const dmg = this.dex.moves.get(move).damage;
					return typeof dmg === 'number' || dmg === 'level';
				});
				if (fixedDamageMove) {
					problems.push(`${set.name || set.species} can't combine Parental Bond (from ${tierSpecies.name}) with the fixed-damage move ${this.dex.moves.get(fixedDamageMove).name}.`);
				}
			}

			return problems;
		},
	},
	{
		name: "[Gen 3] Mega Random Battle",
		desc: "Randomized Gen 3 teams with exactly one Mega Evolution or Primal Reversion per side.",
		mod: 'gen3mega',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['Standard', 'Freeze Clause Mod'],
	},
	{
		name: "[Gen 3] Megas Ubers",
		desc: "Gen 3 Megas with Ubers unbanned. Only AG-tier Megas (Mega Salamence) stay banned.",
		mod: 'gen3mega',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['AG', 'Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
	},
	{
		name: "[Gen 3] Megas UU",
		desc: "Gen 3 Megas below OU. Usage-based tiering: everything under 4.52% ladder usage is UU. OU is banned &mdash; including Mega Alakazam and any Mega whose base form is OU (e.g. Mega Swampert, Mega Skarmory, Mega Gyarados).",
		mod: 'gen3mega',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Uber', 'OU', 'UUBL', 'Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
		// Same ability-based complex bans as [Gen 3] Megas: the affected Megas
		// (Pidgeot/Raichu-Y = No Guard, Kangaskhan = Parental Bond) are UU-legal here,
		// so the bans must carry over. See the [Gen 3] Megas comment above for the
		// tierSpecies/validation rationale.
		onValidateSet(set) {
			const { tierSpecies } = this.getValidationSpecies(set);
			const megaAbilities = Object.values(tierSpecies.abilities);
			const moves = set.moves || [];
			const problems = [];

			if (megaAbilities.includes('No Guard') &&
				moves.some(move => this.dex.toID(move) === 'dynamicpunch')) {
				problems.push(`${set.name || set.species} can't combine No Guard (from ${tierSpecies.name}) with Dynamic Punch.`);
			}

			if (megaAbilities.includes('Parental Bond')) {
				const fixedDamageMove = moves.find(move => {
					const dmg = this.dex.moves.get(move).damage;
					return typeof dmg === 'number' || dmg === 'level';
				});
				if (fixedDamageMove) {
					problems.push(`${set.name || set.species} can't combine Parental Bond (from ${tierSpecies.name}) with the fixed-damage move ${this.dex.moves.get(fixedDamageMove).name}.`);
				}
			}

			return problems;
		},
	},
	{
		name: "[Gen 3] Megas Doubles",
		desc: "Gen 3 Megas in the Gen 3 Doubles OU ruleset.",
		mod: 'gen3mega',
		gameType: 'doubles',
		ruleset: ['Standard', '!Switch Priority Clause Mod'],
		banlist: ['Uber', 'Quick Claw', 'Soul Dew', 'Explosion', 'Self-Destruct', 'Swagger'],
		unbanlist: ['Wobbuffet', 'Wynaut'],
	},
	{
		name: "[Gen 3] Megas Ubers Doubles",
		desc: "Gen 3 Megas Doubles with Ubers unbanned. Only AG-tier Megas stay banned. Explosion and Self-Destruct are legal.",
		mod: 'gen3mega',
		gameType: 'doubles',
		ruleset: ['Standard', '!Switch Priority Clause Mod'],
		banlist: ['AG', 'Quick Claw', 'Soul Dew', 'Swagger'],
		unbanlist: ['Wobbuffet', 'Wynaut'],
	},
	{
		name: "[Gen 3] Megas AG",
		desc: "Gen 3 Megas with all Mega tiers legal.",
		mod: 'gen3mega',
		ruleset: ['Standard AG'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] Megas AG Doubles",
		desc: "Gen 3 Megas Anything Goes in doubles.",
		mod: 'gen3mega',
		gameType: 'doubles',
		ruleset: ['Standard AG'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	// surfnWOB Customs
	///////////////////////////////////////////////////////////////////

	{
		section: "surfnWOB Customs",
		column: 1,
	},
	{
		name: "[Gen 3] Ubers Doubles",
		desc: "Gen 3 Doubles with Ubers unbanned. Explosion and Self-Destruct are legal.",
		mod: 'gen3',
		gameType: 'doubles',
		ruleset: ['Standard', '!Switch Priority Clause Mod'],
		banlist: ['Quick Claw', 'Soul Dew', 'Swagger'],
	},
	// [Gen 3] UUBL Classic 26 — preserves the UUBL metagame as it stood in 2026, before
	// Raikou and Registeel were raised to OU by tiering decision on 2026-07-08. Both are
	// kept legal here via unbanlist. ("26" leaves room to preserve other UUBL eras later.)
	{
		name: "[Gen 3] UUBL Classic 26",
		desc: "Gen 3 UUBL as it stood in 2026, before Raikou and Registeel were raised to OU on July 8, 2026. Both remain legal here, preserving that era's UUBL metagame.",
		mod: 'gen3',
		ruleset: ['[Gen 3] OU', '!Accuracy Trap Clause'],
		banlist: [
			'OU', 'Smeargle + Ingrain', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Flail', 'Reversal',
			'Baton Pass + Speed Boost', 'Baton Pass + Agility', 'Baton Pass + Dragon Dance', 'Baton Pass + Salac Berry',
		],
		unbanlist: ['Soundproof', 'Sand Veil', 'Regice', 'Raikou', 'Registeel', 'Porygon2', 'Quick Claw'],
	},
	{
		name: "[Gen 3] Tera",
		desc: "Gen 3 OU with Terastallization (no Fairy type). Once per battle, per player.",
		mod: 'gen3tera',
		ruleset: ['Standard', 'Bonus Type Mod', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Uber', 'Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
	},
	{
		name: "[Gen 3] PSS",
		desc: "Gen 3 OU with the Gen 4 Physical/Special split.",
		mod: 'gen3pss',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Uber', 'Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
	},
	{
		name: "[Gen 3] PSS Ubers",
		desc: "Gen 3 Ubers with the Gen 4 Physical/Special split.",
		mod: 'gen3pss',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
	},
	{
		name: "[Gen 3] ADV 200 UU",
		desc: `ADV 200 below the top tier &mdash; the 23 OU Pok&eacute;mon are banned, leaving the UU pool legal.`,
		mod: 'gen3adv200',
		ruleset: ['Standard', 'One Boost Passer Clause'],
		banlist: ['Uber', 'OU', 'Light Ball', 'Swagger'],
	},
	{
		name: "[Gen 3] ADV 200 LC",
		desc: `ADV 200 Little Cup &mdash; level 5, first-stage Pok&eacute;mon only, from the Ruby/Sapphire dex.`,
		mod: 'gen3adv200',
		ruleset: ['Standard', 'Little Cup', 'One Boost Passer Clause'],
		banlist: ['Meditite', 'Wynaut', 'Deep Sea Tooth', 'Swagger'],
	},
	{
		name: "[Gen 3] Tier Shift",
		desc: "Gen 3 OU with Tier Shift: OU is legal but unboosted; lower-tier Pokémon get stat boosts excluding HP (UUBL and OU-by-technicality +5, UU/RUBL +10, RU/NUBL +15, NU/PUBL +20, PU/ZUBL +30, ZU +35, SU/LC/NFE +40).",
		mod: 'gen3',
		ruleset: ['Standard', 'Tier Shift Mod', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Uber', 'Smeargle + Ingrain', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
	},
	{
		name: "[Gen 4] No PSS",
		desc: "Gen 4 OU but move categories are determined by type, like in Gen 3.",
		mod: 'gen4nopss',
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Baton Pass Stat Trap Clause', 'Freeze Clause Mod', 'Sleep Moves Clause', '!Sleep Clause Mod'],
		banlist: ['AG', 'Uber', 'Arena Trap', 'Quick Claw', 'Soul Dew', 'Swagger'],
	},
	{
		name: "[Gen 3] Bad n Boosted",
		desc: "Gen 3 Ubers where all base stats at or below 70 are doubled.",
		mod: 'gen3',
		ruleset: ['Standard', "Bad 'n Boosted Mod", 'Deoxys Camouflage Clause Mod', 'One Baton Pass Clause'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers', 'Baton Pass'],
	},
	{
		name: "[Gen 3] Ubers UU",
		desc: "ADV Ubers without the dominant threats. Everything ranked above C on the ADV Ubers Viability Rankings is treated as &quot;Ubers&quot; and banned; C rank and below (and unranked) is legal.",
		mod: 'gen3',
		ruleset: ['[Gen 3] Ubers'],
		banlist: [
			// S
			'Kyogre', 'Groudon', 'Latios', 'Deoxys-Attack',
			// A+
			'Snorlax', 'Blissey', 'Latias', 'Mewtwo',
			// A
			'Metagross', 'Forretress', 'Ho-Oh', 'Lugia',
			// A-
			'Heracross', 'Deoxys-Defense', 'Rayquaza', 'Skarmory',
			// B+
			'Jirachi', 'Gengar', 'Magneton', 'Wobbuffet', 'Omastar', 'Mew',
			// B
			'Dusclops', 'Umbreon', 'Deoxys-Speed', 'Exeggutor', 'Qwilfish', 'Salamence',
			'Aerodactyl', 'Smeargle', 'Ninjask', 'Celebi', 'Dugtrio', 'Tyranitar', 'Slaking',
			// B-
			'Victreebel', 'Kabutops', 'Cloyster', 'Shedinja',
		],
	},
	{
		name: "[Gen 3] SU",
		desc: "Sub-Zero Used &mdash; the tier below ADV ZU. Pokemon ranked B or higher on the ZU viability rankings are banned.",
		mod: 'gen3subzu',
		ruleset: ['Standard', 'Sleep Moves Clause', 'Baton Pass Stat Trap Clause'],
		banlist: [
			'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'NU', 'PUBL', 'PU', 'ZUBL', 'ZU',
			'Wartortle', 'Clamperl', 'Magby',
			'Swagger', 'Baton Pass + Substitute',
		],
	},
	{
		name: "[Gen 3] IU",
		desc: "Incredibly Used &mdash; the tier below ADV SU. Only the lowest-ranked SU Pokemon are legal.",
		mod: 'gen3subzu',
		ruleset: ['Standard', 'Sleep Moves Clause', 'Baton Pass Stat Trap Clause'],
		banlist: [
			'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'NU', 'PUBL', 'PU', 'ZUBL', 'ZU', 'SU',
			'Wartortle', 'Clamperl', 'Magby',
			'Swagger', 'Baton Pass + Substitute',
		],
	},
	{
		name: "[Gen 3] NFE",
		desc: "Not Fully Evolved &mdash; only Pok&eacute;mon that can still evolve are allowed. Uses the ADV NU pool; the strongest NFEs (Chansey, Kadabra, Scyther, etc.) plus Deep Sea Tooth and Light Ball are banned.",
		mod: 'gen3',
		ruleset: ['[Gen 3] NU', 'Not Fully Evolved'],
		banlist: ['Chansey', 'Diglett', 'Dragonair', 'Haunter', 'Kadabra', 'Scyther', 'Vigoroth', 'Wynaut', 'Deep Sea Tooth', 'Light Ball'],
	},
	{
		name: "[Gen 3] Anything Goes",
		mod: 'gen3',
		ruleset: ['Standard AG'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] Almost Any Ability",
		desc: "Pok&eacute;mon have access to almost any ability.",
		mod: 'gen3',
		ruleset: ['Standard', '!Obtainable Abilities', 'Ability Clause = 1', 'One Boost Passer Clause', 'Speed Pass Clause'],
		banlist: [
			'Slaking',
			'Arena Trap', 'Huge Power', 'Magnet Pull', 'Pure Power', 'Shadow Tag', 'Speed Boost', 'Wonder Guard',
			'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web',
		],
	},
	{
		name: "[Gen 3] STABmons",
		desc: "Pok&eacute;mon can use any move of a type they (or a previous evolution) share, in addition to the moves they normally learn.",
		mod: 'gen3',
		ruleset: ['[Gen 3] OU', 'STABmons Move Legality'],
		restricted: ['Acupressure', 'Belly Drum', 'Extreme Speed', 'Lovely Kiss', 'Spore'],
	},
	{
		name: "[Gen 3] Monotype",
		desc: "All Pok&eacute;mon on a team must share a type.",
		mod: 'gen3',
		ruleset: ['Standard', 'Same Type Clause'],
		banlist: [
			'Uber',
			'Suicune', 'Jirachi', // OU in gen3 but too strong for Monotype (Water / Steel + Psychic)
			'Shadow Tag',
			'Focus Band', 'King\'s Rock', 'Quick Claw',
			'Baton Pass',
		],
	},
	{
		name: "[Gen 3] Balanced Hackmons",
		desc: "Anything directly hackable onto a set (EVs, IVs, ability, item, and move) and usable in local battles is allowed.",
		mod: 'gen3',
		ruleset: [
			'OHKO Clause', 'Evasion Clause', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod',
			'Endless Battle Clause', 'Hackmons Forme Legality',
		],
		banlist: [
			'Deoxys-Attack', 'Shedinja', 'Slaking',
			'Arena Trap', 'Huge Power', 'Liquid Ooze', 'Magnet Pull', 'Pure Power', 'Shadow Tag', 'Wonder Guard',
			'Baton Pass', 'Belly Drum', 'Imprison', 'Sleep Talk', 'Substitute', 'Tail Glow',
			'King\'s Rock',
		],
	},
	{
		name: "[Gen 3] Pure Tradebacks",
		desc: "Every Gen 1-3 Pok&eacute;mon can use any ability or move it gains in a later generation, as long as that ability/move already existed in Gen 3. Programmatically complete &mdash; no curation. Blaziken is Ubers (Speed Boost).",
		mod: 'gen3puretradebacks',
		ruleset: ['[Gen 3] OU'],
	},

	// Yak Attack
	///////////////////////////////////////////////////////////////////

	{
		section: "Yak Attack",
		column: 1,
	},
	{
		name: "[Gen 1] RBY Plus",
		desc: "RBY with an expanded roster &mdash; later-generation Pok&eacute;mon retyped to the 15 Gen 1 types, on the original RBY engine. Uber-tiered Pok&eacute;mon are banned.",
		mod: 'gen1rbyplus',
		ruleset: ['Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 3] ADV Plus",
		mod: 'gen3advplus',
		ruleset: ['Standard', 'Freeze Clause Mod'],
		banlist: ['Uber', 'Sand Veil', 'Soundproof', 'Assist', 'Baton Pass', 'Smeargle + Ingrain', 'Drizzle', 'Drought', 'Starf Berry', 'Speed Boost + Blaziken', 'Soul Dew'],
	},
	{
		name: "[Gen 3] FRLG Indigo OU",
		mod: 'gen3frlgindigo',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Uber', 'Sand Veil'],
	},
	{
		name: "[Gen 3] FRLG Ubers",
		mod: 'gen3frlg',
		ruleset: ['Standard', 'Deoxys Camouflage Clause Mod', 'One Boost Passer Clause', 'Freeze Clause Mod'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] Hoennification OU",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'Freeze Clause Mod'],
		banlist: ['Uber', 'Soul Dew', 'Soundproof', 'Assist', 'Baton Pass', 'Smeargle + Ingrain', 'Starf Berry', 'Speed Boost + Blaziken', 'Drizzle', 'Drought'],
	},
	{
		name: "[Gen 3] Hoennification Ubers",
		mod: 'gen3hoennification',
		ruleset: ['Standard', 'Deoxys Camouflage Clause Mod', 'One Boost Passer Clause', 'Freeze Clause Mod'],
		banlist: ['Wobbuffet + Leftovers', 'Wynaut + Leftovers'],
	},
	{
		name: "[Gen 3] OU Sample Team Randbats",
		team: 'random',
		mod: 'gen3strb',
		ruleset: ['Standard', 'Freeze Clause Mod'],
	},
	{
		name: "[Gen 3] Tradebacks",
		mod: 'gen3tradebacks',
		ruleset: ['Standard', 'Freeze Clause Mod'],
		banlist: ['Uber', 'Sand Veil', 'Assist', 'Baton Pass + Tail Glow', 'Baton Pass + Agility', 'Baton Pass + Calm Mind', 'Baton Pass + Swords Dance', 'Baton Pass + Dragon Dance', 'Smeargle + Ingrain', 'Drought', 'Drizzle'],
	},
	{
		name: "[Gen 3] Tradebacks Experimental",
		mod: 'gen3tradebacks',
		ruleset: ['Standard', 'Freeze Clause Mod'],
		banlist: ['Uber', 'Sand Veil', 'Assist', 'Baton Pass + Tail Glow', 'Baton Pass + Agility', 'Baton Pass + Calm Mind', 'Baton Pass + Swords Dance', 'Baton Pass + Dragon Dance', 'Smeargle + Ingrain'],
	},
	{
		name: "[Gen 3] Shadow Colosseum",
		mod: 'gen3shadowcolosseum',
		gameType: 'doubles',
		desc: `<b>[Gen 3] Shadow Colosseum</b>: A Gen 3 Orre Colosseum (Gen 3 VGC) metagame that adds Shadow Pokemon and moves to the game.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3774822/">Shadow Colosseum on the Smogon Forums</a>`,
		],
		itemClauseDefault: true,
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Stadium Sleep Clause', 'Freeze Clause Mod', 'Max Team Size = 6', 'VGC Timer',
			'Nickname Clause', 'Endless Battle Clause', 'Cancel Mod', 'Picked Team Size = 4', 'Exact HP Mod', 'Open Team Sheets',
			'Shadow Mechanic',
		],
		banlist: ['Soul Dew', 'Deoxys-Defense', 'Deoxys-Attack', 'Deoxys-Speed', 'Restricted Legendary', 'Mythical'],
		unbanlist: ['Latios', 'Latias', 'Wobbuffet', 'Wynaut'],
		bestOfDefault: true,
		onBegin() {
			this.add('rule', 'Self-KO Clause: If your last Pok\u00e9mon faints to a self-KO move or effect, you will lose the battle');
		},
	},

	// Archie Madness
	///////////////////////////////////////////////////////////////////

	{
		section: "Archie Madness",
		column: 1,
	},
	{
		name: "[Gen 3] ZangOuSe",
		desc: `A curated ADV singles format with a slim Pok&eacute;mon pool. Zangoose sits in its own ZangOuSe tier; everything else is OU or NFE.`,
		mod: 'gen3zangouse',
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod', 'Speed Pass Clause'],
		banlist: ['Sand Veil', 'Soundproof', 'King\'s Rock', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger'],
	},
	{
		name: "[Gen 3] Megas CAP",
		desc: "Gen 3 OU with the CAP Mega Evolution and Primal Reversion roster (no Fairy type, no Mega Rayquaza).",
		mod: 'gen3megascap',
		searchShow: true,
		rated: true,
		ruleset: ['Standard', 'One Boost Passer Clause', 'Accuracy Trap Clause', 'Freeze Clause Mod'],
		banlist: ['Uber', 'Soundproof + Baton Pass', 'Smeargle + Ingrain', 'Sand Veil + Sand Stream', 'Assist', 'Baton Pass + Block', 'Baton Pass + Mean Look', 'Baton Pass + Spider Web', 'Swagger', 'Quick Claw', 'Confuse Ray', 'Teeter Dance', 'Dynamic Punch', 'Sand-Attack', 'Focus Band', 'Flash', 'Mud Slap', 'Smokescreen', 'Kinesis', 'Agility + Baton Pass', 'Speed Boost + Baton Pass', 'Dragon Dance + Baton Pass', 'Silver Wind + Baton Pass', 'Ancientpower + Baton Pass'],
	},
	{
		name: "[Gen 3] Megas CAP Random Battle",
		desc: "Randomized Gen 3 teams built from the CAP Mega roster, with exactly one CAP Mega Evolution per side.",
		mod: 'gen3megascap',
		team: 'random',
		bestOfDefault: true,
		ruleset: ['Standard', 'Freeze Clause Mod'],
	},
	// Other
	///////////////////////////////////////////////////////////////////

	{
		section: "Other",
		column: 1,
	},
	// [Gen 1] 7U ("Seven Used") &mdash; the RBY tier below ZU. Built on gen1 PU, the roster is
	// wiped (-All Pokemon) and rebuilt as the LC tier plus a curated set of NFEs, minus the banned
	// LC Pok&eacute;mon, so only early-stage/unevolved mons at their highest legal evolution play.
	// The roster is pinned to the Smogon 7U hub's official legality list (49 mons), which the
	// hub's original challenge code no longer matches: Bellsprout/Caterpie are LC mons the list
	// bans, Metapod is dropped (whole Caterpie line is out), and Tentacool is added.
	{
		name: "[Gen 1] 7U",
		desc: "RBY 7U &mdash; the tier below ZU. Only the 7U legality list plays: early-stage/unevolved Pok&eacute;mon (the LC tier plus a curated set of NFEs &mdash; Charmeleon, Ivysaur, Golbat, Hitmonchan, Tentacool&hellip;), minus the banned LC mons. Confuse Ray is banned.",
		mod: 'gen1',
		ruleset: ['[Gen 1] PU'],
		// Confuse Ray (in the hub's challenge code) is intentionally omitted: it is already
		// banned by the inherited [Gen 1] UU ruleset, and repeating it here throws a
		// "rule already exists" error on load. It stays banned all the same.
		banlist: [
			'All Pokemon',
			'Abra', 'Bellsprout', 'Caterpie', 'Diglett', 'Dratini', 'Drowzee', 'Exeggcute', 'Gastly',
			'Horsea', 'Omanyte', 'Pikachu', 'Poliwag', 'Ponyta', 'Sandshrew', 'Seel', 'Slowpoke', 'Staryu',
		],
		unbanlist: [
			'LC',
			'Beedrill', 'Charmeleon', 'Clefairy', 'Ditto', 'Farfetch\'d', 'Gloom', 'Golbat', 'Hitmonchan',
			'Ivysaur', 'Kakuna', 'Nidorina', 'Nidorino', 'Pidgeotto', 'Tentacool',
		],
	},
	// [Gen 1] 10U ("Ten Used") &mdash; a meme tier at the bottom of RBY's descending
	// "Used" ladder (7U, 8U, 9U, 10U). Built on gen1 PU with the roster wiped
	// (-All Pokemon) and rebuilt to just the six weakest Pok&eacute;mon in the game.
	// Unlike 7U there is no pinned Smogon legality list, so the pool is set explicitly.
	{
		name: "[Gen 1] 10U",
		desc: "RBY 10U &mdash; the bottom of the &lsquo;Used&rsquo; ladder. Only six Pok&eacute;mon are legal: Caterpie, Metapod, Weedle, Kakuna, Magikarp, and Ditto.",
		mod: 'gen1',
		ruleset: ['[Gen 1] PU'],
		banlist: ['All Pokemon'],
		unbanlist: ['Caterpie', 'Metapod', 'Weedle', 'Kakuna', 'Magikarp', 'Ditto'],
	},
	// [Gen 1] SU ("Sub-Zero Used") &mdash; Smogon's RBY tier below ZU. Built on [Gen 1] ZU with
	// its strongest Pok&eacute;mon banned out, matching the Smogon SU challenge code
	// (gen1zu @@@ -&lt;19 mons&gt;, -Flash, -Sand Attack, -Smokescreen). None of the 19 are already
	// tier-banned by ZU (they are all ZU-legal), so no bans are redundant.
	{
		name: "[Gen 1] SU",
		desc: "RBY SU (Sub-Zero Used) &mdash; the Smogon tier below ZU: [Gen 1] ZU minus its strongest Pok&eacute;mon (Butterfree, Dragonair, Machamp, Muk, Nidoqueen, Vileplume, Weezing, Wigglytuff&hellip;). Flash, Sand Attack, and Smokescreen are banned.",
		mod: 'gen1',
		ruleset: ['[Gen 1] ZU'],
		banlist: [
			'Butterfree', 'Dragonair', 'Drowzee', 'Flareon', 'Kingler', 'Machamp', 'Muk', 'Nidoqueen',
			'Omanyte', 'Onix', 'Parasect', 'Pinsir', 'Poliwag', 'Sandslash', 'Slowpoke', 'Tentacool',
			'Vileplume', 'Weezing', 'Wigglytuff',
			'Flash', 'Sand Attack', 'Smokescreen',
		],
	},
	// [Gen 1] STABmons &mdash; RBY OU where every Pok&eacute;mon can also use any move of a type it
	// (or a prevo) shares. Sleep moves except Sleep Powder (Hypnosis, Lovely Kiss, Sing, Spore) and
	// partial-trapping moves except Fire Spin (Bind, Clamp, Wrap) stay restricted to their natural
	// learners; Mew and Mewtwo are already Uber-banned via the [Gen 1] OU base.
	{
		name: "[Gen 1] STABmons",
		desc: "RBY STABmons &mdash; Pok&eacute;mon can use any move of a type they (or a previous evolution) share, on top of their normal movepool. Sleep and partial-trapping moves are limited to their natural learners.",
		mod: 'gen1',
		ruleset: ['[Gen 1] OU', 'STABmons Move Legality'],
		restricted: ['Bind', 'Clamp', 'Hypnosis', 'Lovely Kiss', 'Sing', 'Spore', 'Wrap'],
	},
	// [Gen 2] Spaceworld '97 &mdash; GSC mechanics on the 1997 Gold/Silver demo dex (pret/pokegold-spaceworld):
	// beta stats/typings, the demo's unfinished type chart, beta evolution chains, the 1997 move table, cut
	// 'mon added as new species, and the beta-only moves. Ladderable alongside the other oddball tiers here.
	{
		name: "[Gen 2] Spaceworld '97",
		desc: `GSC mechanics running on the 1997 Gold/Silver Spaceworld demo dex, transcribed from the <a href="https://github.com/pret/pokegold-spaceworld">pret/pokegold-spaceworld</a> disassembly: beta base stats and typings, the demo's unfinished type chart (Steel and Dark are incomplete), beta evolution chains, the 1997 move table (types, power, accuracy and PP), and the beta-only moves. Cut 'mon designs (placeholder art stats) are added as new species and wired into their beta evolutions. Learnsets are level-up + TM/HM only &mdash; there are no egg moves &mdash; but Gen 1 Time Capsule tradeforwards are allowed. The roster is limited to the demo's own dex, so GSC 'mon absent from the 1997 build are unavailable.`,
		mod: 'gen2sw97',
		ruleset: ['Standard'],
		banlist: ['Uber', 'Mean Look + Baton Pass', 'Spider Web + Baton Pass'],
	},
	{
		name: "[Gen 4] Megas",
		desc: "Gen 4 OU with Mega Evolution and Primal Reversion (no Fairy type, no Mega Rayquaza).",
		mod: 'gen4mega',
		ruleset: ['[Gen 4] OU', 'Mega Rayquaza Clause', 'Modern Mega Speed Mod'],
		// The validator resets a stone-holder to its base ability before ban
		// matching, so inspect the resolved Mega forme for ability combinations.
		onValidateSet(set) {
			const { tierSpecies } = this.getValidationSpecies(set);
			const megaAbilities = Object.values(tierSpecies.abilities);
			const moves = set.moves || [];
			const problems = [];

			if (megaAbilities.includes('No Guard') &&
				moves.some(move => this.dex.toID(move) === 'dynamicpunch')) {
				problems.push(
					`${set.name || set.species} can't combine No Guard (from ${tierSpecies.name}) with Dynamic Punch.`
				);
			}

			if (megaAbilities.includes('Parental Bond')) {
				const fixedDamageMove = moves.find(move => {
					const damage = this.dex.moves.get(move).damage;
					return typeof damage === 'number' || damage === 'level';
				});
				if (fixedDamageMove) {
					problems.push(
						`${set.name || set.species} can't combine Parental Bond (from ${tierSpecies.name}) ` +
						`with the fixed-damage move ${this.dex.moves.get(fixedDamageMove).name}.`
					);
				}
			}

			return problems;
		},
	},
	{
		name: "[Gen 5] Dream World OU",
		desc: "BW1 OU with all Hidden Abilities and event Pok&eacute;mon assumed released.",
		mod: 'gen5dw',
		searchShow: true,
		ruleset: ['Standard', '+Unreleased'],
		banlist: [
			'Soul Dew', 'Drizzle ++ Swift Swim',
			'Arceus', 'Blaziken', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Giratina', 'Giratina-Origin',
			'Groudon', 'Ho-Oh', 'Kyogre', 'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Zekrom',
		],
	},
	{
		name: "[Gen 8] National Dex AG",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672423/">National Dex AG</a>`,
		],
		mod: 'gen8',
		ruleset: ['Standard AG', 'NatDex Mod'],
	},
];
