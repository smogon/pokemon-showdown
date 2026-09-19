/**
 * Tests for Set Up Position placeholder teams (tools/analysis-setup.ts; docs/analysis/plan.md Phase 4).
 * Fork-owned: the analysis tool isn't part of upstream.
 */
'use strict';

const assert = require('assert').strict;
const { getPlaceholderTeams, getPlaceholderLevel, getPlaceholderSpeciesList } = require('../../../dist/tools/analysis-setup');
const { createAnalysisBattle, getAnalysisSnapshot, replayAnalysisRecords } = require('../../../dist/tools/analysis-state');
const { Dex } = require('../../../dist/sim');

const SEED = 'sodium,00000000000000000000000000000001';

/** The formats the tool offers (client analysis-model.ts FORMATS), plus a plain doubles format. */
const FORMATS = ['gen9ou', 'gen9doublesou', 'gen9championsvgc2026regmb', 'gen9fnafsingles'];

/** Starts a setup position the way the client does: placeholder teams, Team Preview in default order. */
function setupBattle(formatid) {
	const teams = getPlaceholderTeams(formatid);
	const picks = Array.from({ length: teams.count }, (_, i) => i + 1).join(', ');
	const output = [];
	const battle = createAnalysisBattle(
		{ format: formatid, team1: teams.team1, team2: teams.team2, seed: SEED }, output
	);
	replayAnalysisRecords(battle, [{ seed: SEED, inputLog: [`>p1 team ${picks}`, `>p2 team ${picks}`] }]);
	battle.sendUpdates();
	return { teams, battle, output: output.join('\n') };
}

describe('Analysis Set Up Position', () => {
	describe('placeholder teams', () => {
		it('gives each side one placeholder per active slot', () => {
			assert.equal(getPlaceholderTeams('gen9ou').count, 1);
			assert.equal(getPlaceholderTeams('gen9doublesou').count, 2);
			assert.equal(getPlaceholderTeams('gen9championsvgc2026regmb').count, 2);
			assert.equal(getPlaceholderTeams('gen9fnafsingles').count, 1);
		});

		it('picks the first species the format does not ban', () => {
			// no per-format table: a FNAF format bans every vanilla Pokémon, so it lands on a FNAF one
			assert.deepEqual(getPlaceholderTeams('gen9ou').species, ['Bulbasaur']);
			assert.deepEqual(getPlaceholderTeams('gen9fnafsingles').species, ['Freddy Fazbear']);
			const champions = getPlaceholderTeams('gen9championsvgc2026regmb');
			const ruleTable = Dex.formats.getRuleTable(Dex.formats.get('gen9championsvgc2026regmb'));
			for (const name of champions.species) {
				assert.ok(!ruleTable.isBannedSpecies(Dex.species.get(name)), name);
			}
		});

		it('gives each active slot a different species, so the renderer can tell them apart', () => {
			// two identical entries on a side collapse into one, and only half the field is drawn
			for (const formatid of ['gen9doublesou', 'gen9championsvgc2026regmb']) {
				const { species, count } = getPlaceholderTeams(formatid);
				assert.equal(species.length, count, formatid);
				assert.equal(new Set(species).size, count, `${formatid}: ${species.join(', ')}`);
			}
			assert.deepEqual(getPlaceholderTeams('gen9doublesou').species, ['Bulbasaur', 'Ivysaur']);
		});

		it('repeats the last species when the format has fewer legal ones than slots', () => {
			const dex = Dex.forFormat(Dex.formats.get('gen9fnafsingles')).includeData();
			const ruleTable = Dex.formats.getRuleTable(Dex.formats.get('gen9fnafsingles'));
			const many = getPlaceholderSpeciesList(dex, ruleTable, 10_000);
			assert.ok(many.length === 10_000 && many[9999] === many[many.length - 1]);
		});

		it('applies the level the validator would have, since a setup team never reaches it', () => {
			assert.equal(getPlaceholderTeams('gen9ou').level, 100);
			// Champions VGC is Flat Rules, i.e. Adjust Level Down = 50
			assert.equal(getPlaceholderTeams('gen9championsvgc2026regmb').level, 50);
			assert.equal(getPlaceholderLevel(Dex.formats.getRuleTable(Dex.formats.get('gen9ou'))), 100);
		});

		it('rejects an unknown format', () => {
			assert.throws(() => getPlaceholderTeams('notaformat'), /Unknown format/);
		});
	});

	describe('starting the position', () => {
		it('reaches turn 1 with every placeholder active, in every offered format', () => {
			for (const formatid of FORMATS) {
				const { teams, battle } = setupBattle(formatid);
				assert.equal(battle.turn, 1, formatid);
				assert.equal(battle.requestState, 'move', formatid);
				for (const side of battle.sides) {
					assert.equal(side.active.length, teams.count, formatid);
					assert.equal(side.active.filter(pokemon => pokemon && !pokemon.fainted).length, teams.count, formatid);
					assert.equal(side.pokemon.length, teams.count, formatid);
				}
			}
		});

		it('starts a team too small for the format, because a sandbox team is never validated', () => {
			// Champions VGC is "bring 6, pick 4"; side.pickedTeamSize() clamps to what the team has
			const { battle } = setupBattle('gen9championsvgc2026regmb');
			assert.equal(battle.ruleTable.minTeamSize, 6);
			assert.equal(battle.ruleTable.pickedTeamSize, 4);
			assert.equal(battle.sides[0].pokemon.length, 2);
		});

		it('leaves the placeholder with no moves, so it can only Struggle', () => {
			// `Teams.pack` writes an empty move list as an empty field, which unpacks to [''] — enough to
			// get past the Pokemon constructor's "has no moves" throw, and skipped when it builds moveSlots
			const { battle } = setupBattle('gen9ou');
			const pokemon = battle.sides[0].active[0];
			assert.equal(pokemon.moveSlots.length, 0);
			assert.deepEqual(pokemon.getMoveRequestData().moves.map(move => move.id), ['struggle']);
		});

		it('consumes no RNG beyond the turn itself, so lines stay replayable', () => {
			// a set without an explicit gender would make the Pokemon constructor roll one
			for (const formatid of FORMATS) {
				const first = setupBattle(formatid);
				const second = setupBattle(formatid);
				assert.deepEqual(second.battle.prng.getSeed(), first.battle.prng.getSeed(), formatid);
				for (const pokemon of first.battle.getAllPokemon()) {
					assert.ok(['M', 'F', ''].includes(pokemon.gender), `${formatid}: ${pokemon.gender}`);
				}
			}
		});

		it('exposes the placeholders through the snapshot the edit forms read', () => {
			const { battle } = setupBattle('gen9doublesou');
			const snapshot = getAnalysisSnapshot(battle);
			for (const side of snapshot.sides) {
				assert.equal(side.pokemon.length, 2);
				assert.deepEqual(side.pokemon.map(pokemon => pokemon.set.species), ['Bulbasaur', 'Ivysaur']);
				for (const pokemon of side.pokemon) {
					assert.ok(!pokemon.set.moves.some(move => move));
				}
				assert.deepEqual(side.active, [0, 1]);
			}
		});
	});
});
