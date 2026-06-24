'use strict';

// Smoke + behavior coverage for this fork's custom formats and mods.
//
// The fork adds custom formats (data/mods/* + the surfnWOB section in
// config/formats.ts) on top of upstream. Nothing upstream tests them, so a
// rebase onto smogon/pokemon-showdown can silently break a clause reference,
// a tier, or an engine seam and we'd only find out in battle. This file is the
// net: a broad cheap check across every custom format, plus targeted behavior
// tests that pin the seams two in-flight refactors are about to move.

const assert = require('./../../assert');
const common = require('./../../common');

const { Dex } = require('./../../../dist/sim');

// Loaded at module scope, not in a before() hook: mocha collects this describe
// body — including the per-format it()s generated below — before any hook runs,
// so the format list has to exist now.
Dex.includeFormats();
const CUSTOM_SECTIONS = ['surfnWOB Customs', 'Yak Attack'];
const customFormats = Dex.formats.all().filter(f => CUSTOM_SECTIONS.includes(f.section));

describe('Fork customs', () => {
	it('the fork exposes custom formats', () => {
		assert(customFormats.length > 0, `expected formats in: ${CUSTOM_SECTIONS.join(', ')}`);
	});

	// Broad net: every custom format must build its ruleTable (catches a
	// renamed/removed clause or a dangling banlist reference) and load mod data.
	describe('every custom format builds', () => {
		for (const format of customFormats) {
			it(`${format.name} builds its ruleTable and loads mod data`, () => {
				Dex.formats.getRuleTable(format); // throws if a rule/ban reference is missing
				const dex = Dex.mod(format.mod);
				assert(dex.species.all().length > 0, `${format.mod} loaded no species`);
			});
		}
	});

	// --- Targeted behavior: pins the seams the refactors will move. ---

	it('gen3tera: a Pokemon can Terastallize (guards the bonustypemod seam)', () => {
		const battle = common.createBattle({ formatid: 'gen3tera' }, [
			[{ species: 'Aerodactyl', ability: 'rockhead', moves: ['rockslide', 'earthquake'], teraType: 'Rock' }],
			[{ species: 'Snorlax', ability: 'immunity', moves: ['bodyslam'], teraType: 'Normal' }],
		]);
		battle.makeChoices('move rockslide terastallize', 'auto');
		assert.equal(battle.p1.active[0].terastallized, 'Rock');
	});

	it('PSS category split: gen3pss keeps per-move, gen4nopss forces by type', () => {
		// gen3pss inherits gen4's per-move physical/special split.
		assert.equal(Dex.mod('gen3pss').moves.get('waterfall').category, 'Physical');
		assert.equal(Dex.mod('gen3pss').moves.get('crunch').category, 'Physical');
		// gen4nopss reassigns category by TYPE (the classic gen1-3 split).
		assert.equal(Dex.mod('gen4nopss').moves.get('waterfall').category, 'Special');
		assert.equal(Dex.mod('gen4nopss').moves.get('crunch').category, 'Special');
		assert.equal(Dex.mod('gen4nopss').moves.get('earthquake').category, 'Physical');
	});

	it('gen3su: SU/IU/ZU tiers resolve and the ZU reclassification is enforced', () => {
		// Mod-relative: reads tiers off whichever mod the format declares (gen3subzu),
		// so this survives the SU/IU/ZU reclassification living in a dedicated mod.
		const su = Dex.formats.get('gen3su', true);
		const dex = Dex.mod(su.mod);
		// Ivysaur + Grovyle were bumped SU -> ZU; ZU is banned from [Gen 3] SU, so the
		// reclassification removes them from the format. Parasect stays SU, Butterfree IU.
		assert.equal(dex.species.get('ivysaur').tier, 'ZU');
		assert.equal(dex.species.get('grovyle').tier, 'ZU');
		assert.equal(dex.species.get('parasect').tier, 'SU');
		assert.equal(dex.species.get('butterfree').tier, 'IU');

		// Behavioral consequence of the reclassification: a now-ZU Ivysaur is illegal in SU...
		const { TeamValidator } = require('./../../../dist/sim/team-validator');
		const ivyErrors = TeamValidator.get('gen3su').validateTeam([
			{ species: 'Ivysaur', ability: 'Overgrow', moves: ['sludgebomb', 'gigadrain', 'leechseed', 'sleeppowder'], evs: { hp: 4 }, level: 100 },
		]);
		assert(ivyErrors && ivyErrors.some(e => /ZU/.test(e)), `expected now-ZU Ivysaur banned from SU, got: ${JSON.stringify(ivyErrors)}`);

		// ...while an all-SU team is legal (Ivysaur swapped for the SU-tier Weepinbell).
		assert.legalTeam([
			{ species: 'Weepinbell', ability: 'Chlorophyll', moves: ['sludgebomb', 'gigadrain', 'sleeppowder', 'growth'], evs: { hp: 4 }, level: 100 },
			{ species: 'Parasect', ability: 'Effect Spore', moves: ['spore', 'gigadrain', 'bodyslam', 'swordsdance'], evs: { hp: 4 }, level: 100 },
			{ species: 'Sunflora', ability: 'Chlorophyll', moves: ['gigadrain', 'sludgebomb', 'growth', 'return'], evs: { hp: 4 }, level: 100 },
			{ species: 'Nosepass', ability: 'Sturdy', moves: ['rockslide', 'thunderbolt', 'thunderwave', 'explosion'], evs: { hp: 4 }, level: 100 },
			{ species: 'Delibird', ability: 'Hustle', moves: ['icebeam', 'aerialace', 'quickattack', 'rapidspin'], evs: { hp: 4 }, level: 100 },
			{ species: 'Spinda', ability: 'Own Tempo', moves: ['return', 'psychic', 'shadowball', 'wish'], evs: { hp: 4 }, level: 100 },
		], 'gen3su');
	});

	it('gen3uubl: [Gen 3] UUBL is ladderable and enforces its OU ban (guards the searchShow flip)', () => {
		// [Gen 3] UUBL lives in the upstream "Past Generations" block, NOT the
		// surfnWOB Customs section the broad net above covers. We deliberately
		// unhid it (dropped `searchShow: false`) to put it on the ladder; a rebase
		// re-pulling the upstream block would silently re-hide it, so pin it here.
		const uubl = Dex.formats.get('gen3uubl', true);
		assert(uubl.searchShow !== false, '[Gen 3] UUBL must stay ladderable (searchShow !== false)');
		Dex.formats.getRuleTable(uubl); // throws if a ruleset/banlist reference breaks

		// Behavioral: the format bans the OU tag...
		const { TeamValidator } = require('./../../../dist/sim/team-validator');
		const ouErrors = TeamValidator.get('gen3uubl').validateTeam([
			{ species: 'Tyranitar', ability: 'Sand Stream', moves: ['rockslide', 'earthquake', 'crunch', 'dragondance'], evs: { hp: 4 }, level: 100 },
		]);
		assert(ouErrors && ouErrors.some(e => /OU/.test(e)), `expected OU-tagged Tyranitar banned from UUBL, got: ${JSON.stringify(ouErrors)}`);

		// ...while an all-UUBL team is legal.
		assert.legalTeam([
			{ species: 'Slowbro', ability: 'Own Tempo', moves: ['surf', 'psychic', 'calmmind', 'rest'], evs: { hp: 4 }, level: 100 },
			{ species: 'Steelix', ability: 'Sturdy', moves: ['earthquake', 'rockslide', 'explosion', 'roar'], evs: { hp: 4 }, level: 100 },
			{ species: 'Blaziken', ability: 'Blaze', moves: ['flamethrower', 'skyuppercut', 'rockslide', 'swordsdance'], evs: { hp: 4 }, level: 100 },
			{ species: 'Kingdra', ability: 'Swift Swim', moves: ['surf', 'icebeam', 'hiddenpowergrass', 'raindance'], evs: { hp: 4 }, level: 100 },
			{ species: 'Venusaur', ability: 'Overgrow', moves: ['sludgebomb', 'gigadrain', 'sleeppowder', 'leechseed'], evs: { hp: 4 }, level: 100 },
			{ species: 'Hariyama', ability: 'Thick Fat', moves: ['brickbreak', 'rockslide', 'knockoff', 'bodyslam'], evs: { hp: 4 }, level: 100 },
		], 'gen3uubl');
	});

	it('gen3adv200: the ADV 200 ladder lives in gen3adv200, leaving gen3rs upstream-pristine', () => {
		// The custom UU/LC formats re-tier off the isolated gen3adv200 mod...
		assert.equal(Dex.formats.get('gen3adv200uu', true).mod, 'gen3adv200');
		assert.equal(Dex.formats.get('gen3adv200lc', true).mod, 'gen3adv200');
		// ...while the two upstream base formats stay on upstream gen3rs.
		assert.equal(Dex.formats.get('gen3adv200', true).mod, 'gen3rs');
		assert.equal(Dex.formats.get('gen3adv200doubles', true).mod, 'gen3rs');

		// The ADV 200 ladder collapses to exactly 23 OU — the species the UU
		// banlist's "OU" target removes, leaving the UU pool legal.
		const adv = Dex.mod('gen3adv200');
		const ou = adv.species.all().filter(s => s.tier === 'OU' && !s.isNonstandard);
		assert.equal(ou.length, 23, `expected 23 ADV 200 OU mons, got ${ou.length}`);
		assert.equal(adv.species.get('alakazam').tier, 'OU');
		assert.equal(adv.species.get('machamp').tier, 'UU');

		// Boundary guard: the re-tiering must NOT leak back into upstream gen3rs,
		// which carries the standard RS ladder (Alakazam is not OU there). This
		// is the seam the Tier 3 isolation was built to keep clean.
		assert.notEqual(Dex.mod('gen3rs').species.get('alakazam').tier, 'OU');
	});

	it('gen3adv200: ADV 200 UU allows the UU pool but bans OU (guards the OU banlist)', () => {
		// An all-UU team is legal...
		assert.legalTeam([
			{ species: 'Machamp', ability: 'Guts', moves: ['crosschop', 'earthquake', 'rockslide', 'bulkup'], evs: { hp: 4 }, level: 100 },
			{ species: 'Weezing', ability: 'Levitate', moves: ['sludgebomb', 'willowisp', 'explosion', 'flamethrower'], evs: { hp: 4 }, level: 100 },
			{ species: 'Blaziken', ability: 'Blaze', moves: ['fireblast', 'skyuppercut', 'rockslide', 'earthquake'], evs: { hp: 4 }, level: 100 },
			{ species: 'Donphan', ability: 'Sturdy', moves: ['earthquake', 'rapidspin', 'roar', 'protect'], evs: { hp: 4 }, level: 100 },
			{ species: 'Crobat', ability: 'Inner Focus', moves: ['aerialace', 'sludgebomb', 'shadowball', 'toxic'], evs: { hp: 4 }, level: 100 },
			{ species: 'Hariyama', ability: 'Guts', moves: ['crosschop', 'knockoff', 'brickbreak', 'bellydrum'], evs: { hp: 4 }, level: 100 },
		], 'gen3adv200uu');

		// ...but an OU Pokemon (banlist 'OU') is rejected.
		const { TeamValidator } = require('./../../../dist/sim/team-validator');
		const errors = TeamValidator.get('gen3adv200uu').validateTeam([
			{ species: 'Alakazam', ability: 'Synchronize', moves: ['psychic', 'calmmind', 'firepunch', 'recover'], evs: { hp: 4 }, level: 100 },
		]);
		assert(errors && errors.length > 0, 'expected Alakazam (OU) to be banned from ADV 200 UU');
	});

	it('gen3adv200: Light Ball is banned in ADV 200 UU', () => {
		// Machamp is a legal UU mon (see test above), so Light Ball is the only
		// violation here — proves the item ban, not an incidental tier ban.
		const { TeamValidator } = require('./../../../dist/sim/team-validator');
		const errors = TeamValidator.get('gen3adv200uu').validateTeam([
			{ species: 'Machamp', ability: 'Guts', item: 'Light Ball', moves: ['crosschop', 'earthquake', 'rockslide', 'bulkup'], evs: { hp: 4 }, level: 100 },
		]);
		assert(errors && errors.some(e => /Light Ball/.test(e)), `expected Light Ball banned from ADV 200 UU, got: ${JSON.stringify(errors)}`);
	});
	// gen3mega backports Gen 6 Mega Evolution onto a gen: 3 engine. From Gen 5 on,
	// gaining an ability mid-battle fires its switch-in effect; mainline does this via
	// formeChange -> setAbility, but that Start is gated `gen > 3` (off here), so the mod
	// re-fires it at the runMegaEvo site. Trace/Skill Swap intentionally stay inert (the
	// Gen 3 quirk). These pin that seam against rebase.
	it('gen3mega: Mega Evolution fires the new ability onStart (Charizard-Y -> Drought)', () => {
		const battle = common.createBattle({ formatid: 'gen3megas' }, [
			[{ species: 'Charizard', ability: 'blaze', item: 'charizarditey', moves: ['flamethrower'] }],
			[{ species: 'Snorlax', ability: 'thickfat', moves: ['tackle'] }],
		]);
		assert.equal(battle.field.weather, '', 'no weather before mega');
		battle.makeChoices('move flamethrower mega', 'move tackle');
		assert.equal(battle.p1.active[0].ability, 'drought');
		assert.equal(battle.field.weather, 'sunnyday', 'sun set on mega evolution');
	});

	it('gen3mega: Mega Evolution fires Intimidate when base ability differs (Manectric)', () => {
		const battle = common.createBattle({ formatid: 'gen3megas' }, [
			[{ species: 'Manectric', ability: 'static', item: 'manectite', moves: ['thunderbolt'] }],
			[{ species: 'Snorlax', ability: 'thickfat', moves: ['tackle'] }],
		]);
		assert.equal(battle.p2.active[0].boosts.atk, 0, 'no Atk drop before mega (base is Static)');
		battle.makeChoices('move thunderbolt mega', 'move tackle');
		assert.equal(battle.p1.active[0].ability, 'intimidate');
		assert.equal(battle.p2.active[0].boosts.atk, -1, 'Intimidate drops foe Atk on mega evolution');
	});

	it('gen3mega: Primal Reversion weather still fires on switch-in (Groudon-Primal)', () => {
		// Regression guard: Primal rides the orb onSwitchIn on the gen-4 old-system switch
		// path, which already re-fires the ability Start. The Mega fix must not disturb it.
		const battle = common.createBattle({ formatid: 'gen3megasubers' }, [
			[{ species: 'Groudon', ability: 'drought', item: 'redorb', moves: ['earthquake'] }],
			[{ species: 'Snorlax', ability: 'thickfat', moves: ['tackle'] }],
		]);
		assert.equal(battle.p1.active[0].species.name, 'Groudon-Primal');
		assert.equal(battle.p1.active[0].ability, 'desolateland');
		assert.equal(battle.field.weather, 'desolateland', 'Desolate Land set on Primal Reversion');
	});

	it('gen3mega: Mega Kangaskhan and Mega Medicham are Uber-banned from [Gen 3] Megas but legal in Megas Ubers', () => {
		// Both Megas are tiered Uber in gen3mega/formats-data.ts. The validator swaps in the
		// stone-induced Mega forme (team-validator `tierSpecies`), so [Gen 3] Megas' `banlist: ['Uber']`
		// catches them while [Gen 3] Megas Ubers (no Uber ban) keeps them legal. Guards the tier flip.
		const dex = Dex.mod('gen3mega');
		assert.equal(dex.species.get('kangaskhanmega').tier, 'Uber');
		assert.equal(dex.species.get('medichammega').tier, 'Uber');

		const { TeamValidator } = require('./../../../dist/sim/team-validator');
		const khanErrors = TeamValidator.get('gen3megas').validateTeam([
			{ species: 'Kangaskhan', ability: 'Early Bird', item: 'kangaskhanite', moves: ['return', 'earthquake', 'shadowball', 'rest'], evs: { hp: 4 }, level: 100 },
		]);
		assert(khanErrors && khanErrors.some(e => /Uber/.test(e)), `expected Mega Kangaskhan Uber-banned from [Gen 3] Megas, got: ${JSON.stringify(khanErrors)}`);

		const medichamErrors = TeamValidator.get('gen3megas').validateTeam([
			{ species: 'Medicham', ability: 'Pure Power', item: 'medichamite', moves: ['brickbreak', 'shadowball', 'calmmind', 'rest'], evs: { hp: 4 }, level: 100 },
		]);
		assert(medichamErrors && medichamErrors.some(e => /Uber/.test(e)), `expected Mega Medicham Uber-banned from [Gen 3] Megas, got: ${JSON.stringify(medichamErrors)}`);

		// Both stay legal in [Gen 3] Megas Ubers (Ubers unbanned).
		assert.legalTeam([
			{ species: 'Kangaskhan', ability: 'Early Bird', item: 'kangaskhanite', moves: ['return', 'earthquake', 'shadowball', 'rest'], evs: { hp: 4 }, level: 100 },
			{ species: 'Medicham', ability: 'Pure Power', item: 'medichamite', moves: ['brickbreak', 'shadowball', 'calmmind', 'rest'], evs: { hp: 4 }, level: 100 },
		], 'gen3megasubers');
	});

	it('gen3mega: a Rayquaza team loads in the forked-worker condition where global.toID is undefined', () => {
		// Production regression (2026-06-22): canMegaEvo runs for EVERY Pokemon at construction.
		// For any base Rayquaza (otherFormes[0] = Rayquaza-Mega, isMega + requiredMove "Dragon
		// Ascent"), the override reaches `toID(altForme.requiredMove)` regardless of the set's
		// moves. The battle sim runs in a forked worker subprocess where `global.toID` is undefined,
		// so a bare `toID` threw `ReferenceError: toID is not defined`, crashing the battle on team
		// load — and the crash report carried both players' inputLog (full teams) into the lobby.
		// The fix scopes it to `this.dex.toID`. Reproduce the worker by removing global.toID so the
		// bare-global form would throw here; this.dex.toID must not.
		const savedToID = global.toID;
		try {
			delete global.toID;
			const battle = common.createBattle({ formatid: 'gen3megasubers' }, [
				// Crashing real-world shape: a base Rayquaza WITHOUT Dragon Ascent still triggers the toID call.
				[{ species: 'Rayquaza', ability: 'airlock', item: 'leftovers', moves: ['rest'] }],
				[{ species: 'Snorlax', ability: 'thickfat', moves: ['tackle'] }],
			]);
			assert.equal(battle.p1.active[0].species.name, 'Rayquaza', 'Rayquaza loaded with no toID ReferenceError');
			// A Rayquaza that DOES carry Dragon Ascent must still mega-evolve through the requiredMove branch.
			const ascent = common.createBattle({ formatid: 'gen3megasubers' }, [
				[{ species: 'Rayquaza', ability: 'airlock', item: 'leftovers', moves: ['dragonascent'] }],
				[{ species: 'Snorlax', ability: 'thickfat', moves: ['tackle'] }],
			]);
			assert.equal(ascent.p1.active[0].canMegaEvo, 'Rayquaza-Mega', 'requiredMove branch still resolves the Mega forme');
		} finally {
			global.toID = savedToID;
		}
	});

	it('gen3mega: -ate abilities retype Normal moves AND re-derive Gen 3 category by type', () => {
		// Regression (2026-06-23): gen3's useMoveInner override replaced base
		// battle-actions and never fired the ModifyType event base fires (battle-actions.ts:430/438).
		// Ability `onModifyType` handlers therefore never ran, so EVERY -ate ability re-legalized
		// for [Gen 3] Megas was inert — the move stayed Normal, and the 1.2x boost (gated on the
		// same handler's `move.typeChangerBoosted`) never applied either. Decisive proof of the
		// retype: a Normal move into a Ghost. Normal is IMMUNE vs Ghost (0 damage); Flying (Aerilate)
		// and Ice (Refrigerate) are both NEUTRAL vs Ghost, so a working -ate lands a hit. If the
		// Ghost takes 0, ModifyType never fired and the ability is dead again.
		//
		// Second axis: Gen 3 derives Physical/Special from a move's TYPE, so the retype must drag
		// the category with it. Double-Edge is Normal (Physical); Refrigerate makes it Ice, which in
		// Gen 3 is a SPECIAL type, so it must become Special; Aerilate's Flying stays Physical.
		for (const [mon, item, ability, type, category] of [
			['Salamence', 'salamencite', 'aerilate', 'Flying', 'Physical'],
			['Glalie', 'glalitite', 'refrigerate', 'Ice', 'Special'],
			['Feraligatr', 'feraligite', 'dragonize', 'Dragon', 'Special'],
		]) {
			const battle = common.createBattle({ formatid: 'gen3megas' }, [
				[{ species: mon, item, moves: ['doubleedge'] }],
				[{ species: 'Dusclops', ability: 'pressure', moves: ['nightshade'] }],
			]);
			battle.makeChoices('move doubleedge mega', 'auto');
			const attacker = battle.p1.active[0];
			const ghost = battle.p2.active[0];
			assert.equal(attacker.ability, ability, `${mon} should have ${ability} after mega evolving`);
			assert.equal(attacker.lastMoveUsed.type, type,
				`${ability} should retype Double-Edge to ${type} (got ${attacker.lastMoveUsed.type})`);
			assert.equal(attacker.lastMoveUsed.category, category,
				`Gen 3 derives category from type: ${type} Double-Edge must be ${category} ` +
				`(got ${attacker.lastMoveUsed.category})`);
			assert(ghost.hp < ghost.maxhp,
				`${ability} must retype Double-Edge off Normal so it hits the Ghost; 0 damage means ` +
				`ModifyType never fired (Dusclops ${ghost.hp}/${ghost.maxhp})`);
		}
	});

	it('gen3mega: Beat Up stays typeless/Special so per-participant base-Atk substitution fires', () => {
		// Regression (2026-06-24, replay gen3megas-544 t7): the type->category recompute added to
		// gen3 useMoveInner (so -ate abilities reclassify their retyped moves) ran for EVERY
		// non-Status move, including typeless (???) ones. Beat Up retypes itself to ??? + Special on
		// purpose so its base-stat substitution rides the special pipeline (onModifySpA -> each
		// participant's base Atk, onFoeModifySpD -> the target's base Def). ??? is not a "special
		// type", so the recompute forced Beat Up to Physical -> the SpA/SpD handlers never fired ->
		// it collapsed to the USER's own Atk vs the target's own Def at a flat BP 10 (a uniform
		// ~15/hit). The fix skips ??? in the recompute. Guard both axes:
		//   (1) the active move stays ??? / Special, and
		//   (2) damage tracks each PARTICIPANT's base Attack (not the lead's), so two party members
		//       with wildly different base Atk land wildly different per-hit damage.
		const battle = common.createBattle({ formatid: 'gen3megas' }, [
			[
				{ species: 'Slaking', moves: ['beatup'] }, // base Atk 160 -> hit 1
				{ species: 'Chansey', moves: ['softboiled'] }, // base Atk 5 -> hit 2
			],
			[{ species: 'Blissey', moves: ['softboiled'] }], // base Def 10, bulky enough to survive
		]);
		battle.makeChoices('move beatup', 'move softboiled');
		const attacker = battle.p1.active[0];
		assert.equal(attacker.lastMoveUsed.type, '???',
			`Beat Up must stay typeless (got ${attacker.lastMoveUsed.type})`);
		assert.equal(attacker.lastMoveUsed.category, 'Special',
			`Beat Up must stay Special so its onModifySpA/onFoeModifySpD substitution fires ` +
			`(got ${attacker.lastMoveUsed.category} — the ??? recompute regression)`);
		// Per-hit damage straight from the protocol (attacker is faster, so these precede any heal).
		// battle.log carries two views of each hit: the exact-HP view (`X/651`) and the observer
		// percentage view (`X/100`). Keep only the exact view (max denominator) or the percentage
		// rows corrupt the running HP diff.
		const parsed = battle.log
			.filter(l => l.startsWith('|-damage|p2a: '))
			.map(l => l.split('|')[3].split('/').map(Number)); // [currentHP, maxHP]
		const maxhp = Math.max(...parsed.map(p => p[1]));
		const hp = parsed.filter(p => p[1] === maxhp).map(p => p[0]); // exact-view HP after each hit
		assert(hp.length >= 2,
			`Beat Up should hit once per eligible party member (got ${hp.length} hit(s))`);
		const slakingHit = maxhp - hp[0]; // participant base Atk 160
		const chanseyHit = hp[0] - hp[1]; // participant base Atk 5
		assert(slakingHit > chanseyHit,
			`Beat Up must use each participant's base Attack: Slaking (160) must out-hit Chansey (5), ` +
			`got Slaking ${slakingHit} vs Chansey ${chanseyHit} — equal damage means it used the ` +
			`user's own Attack (the regression)`);
	});
});
