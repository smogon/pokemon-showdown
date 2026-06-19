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
		const battle = common.createBattle({ formatid: 'gen3megaubers' }, [
			[{ species: 'Groudon', ability: 'drought', item: 'redorb', moves: ['earthquake'] }],
			[{ species: 'Snorlax', ability: 'thickfat', moves: ['tackle'] }],
		]);
		assert.equal(battle.p1.active[0].species.name, 'Groudon-Primal');
		assert.equal(battle.p1.active[0].ability, 'desolateland');
		assert.equal(battle.field.weather, 'desolateland', 'Desolate Land set on Primal Reversion');
	});
});
