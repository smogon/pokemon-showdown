import { PRNG } from '../../../sim/prng';
import { Pokemon } from '../../../sim/pokemon';
import { Teams } from '../../../sim/teams';

export const Scripts: ModdedBattleScriptsData = {
	start() {
		// Choose a random format
		this.gen = this.random(1, 10);
		const format = Dex.formats.get(`gen${this.gen}randombattle@@@${(this.format.customRules || []).join(',')}`);
		this.dex = Dex.forFormat(format);
		this.ruleTable = this.dex.formats.getRuleTable(format);
		this.teamGenerator = Teams.getGenerator(format);

		this.actions.battle = this;
		this.actions.dex = this.dex;
		if (this.actions.dex.data.Scripts.actions) Object.assign(this.actions, this.actions.dex.data.Scripts.actions);
		if (format.actions) Object.assign(this.actions, format.actions);

		for (const i in this.dex.data.Scripts) {
			const entry = this.dex.data.Scripts[i];
			if (typeof entry === 'function') (this as any)[i] = entry;
		}

		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			if (subFormat.exists) {
				const hasEventHandler = Object.keys(subFormat).some(
					// skip event handlers that are handled elsewhere
					val => val.startsWith('on') && ![
						'onBegin', 'onTeamPreview', 'onBattleStart', 'onValidateRule', 'onValidateTeam', 'onChangeSet', 'onValidateSet',
					].includes(val)
				);
				if (hasEventHandler) this.field.addPseudoWeather(rule);
			}
		}

		// Generate teams using the format
		for (const side of this.sides) {
			this.teamGenerator.setSeed(PRNG.generateSeed());

			const team = this.teamGenerator.getTeam();
			side.team = team;
			side.pokemon = [];
			for (let i = 0; i < team.length && i < 24; i++) {
				side.pokemon.push(new Pokemon(team[i], side));
				side.pokemon[i].position = i;
			}
			side.dynamaxUsed = this.gen !== 8;
		}

		// Everything below is copied from sim/battle.ts

		// Deserialized games should use restart()
		if (this.deserialized) return;
		// need all players to start
		if (!this.sides.every(side => !!side)) throw new Error(`Missing sides: ${this.sides}`);

		if (this.started) throw new Error(`Battle already started`);

		this.started = true;
		if (this.gameType === 'multi') {
			this.sides[1].foe = this.sides[2]!;
			this.sides[0].foe = this.sides[3]!;
			this.sides[2]!.foe = this.sides[1];
			this.sides[3]!.foe = this.sides[0];
			this.sides[1].allySide = this.sides[3]!;
			this.sides[0].allySide = this.sides[2]!;
			this.sides[2]!.allySide = this.sides[0];
			this.sides[3]!.allySide = this.sides[1];
			// sync side conditions
			this.sides[2]!.sideConditions = this.sides[0].sideConditions;
			this.sides[3]!.sideConditions = this.sides[1].sideConditions;
		} else {
			this.sides[1].foe = this.sides[0];
			this.sides[0].foe = this.sides[1];
			if (this.sides.length > 2) { // ffa
				this.sides[2]!.foe = this.sides[3]!;
				this.sides[3]!.foe = this.sides[2]!;
			}
		}

		for (const side of this.sides) {
			this.add('teamsize', side.id, side.pokemon.length);
		}

		this.add('gen', this.gen);

		this.add('tier', format.name);
		if (this.rated) {
			if (this.rated === 'Rated battle') this.rated = true;
			this.add('rated', typeof this.rated === 'string' ? this.rated : '');
		}

		if (format.onBegin) format.onBegin.call(this);
		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			if (subFormat.onBegin) subFormat.onBegin.call(this);
		}

		if (this.sides.some(side => !side.pokemon[0])) {
			throw new Error('Battle not started: A player has an empty team.');
		}

		if (this.debugMode) {
			this.checkEVBalance();
		}

		if (format.onTeamPreview) format.onTeamPreview.call(this);
		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			if (subFormat.onTeamPreview) subFormat.onTeamPreview.call(this);
		}

		this.queue.addChoice({ choice: 'start' });
		this.midTurn = true;
		if (!this.requestState) this.turnLoop();
	},
};
