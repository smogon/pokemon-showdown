interface Tandem {
	species: string;
	items: string[];
	abilities: string[];
	gender?: string;
	teraTypes: string[];
	forcedMoves: string[];
	moves: string[];
	nature?: string;
}

const tandems: { [speciesid: string]: Tandem[] } = require('./tandems.json');

function buildTandemSet(this: Battle, tandem: Tandem): PokemonSet {
	const move1 = this.sample(tandem.moves);
	const move2 = this.sample(tandem.moves.filter(move => move !== move1));
	const moves = [...tandem.forcedMoves, move1, move2];

	return {
		name: tandem.species,
		species: tandem.species,
		item: this.sample(tandem.items),
		ability: this.sample(tandem.abilities),
		gender: tandem.gender || this.sample(['M', 'F']),
		nature: tandem.nature || 'Serious',
		moves,
		evs: { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		level: 100,
		shiny: true,
		teraType: this.sample(tandem.teraTypes),
		happiness: 255,
		hpType: '',
		pokeball: '',
		gigantamax: false,
		dynamaxLevel: 10,
	};
}

function getBaseSpeciesId(this: Battle, speciesName: string): ID {
	const dex = this.dex.species.get(speciesName);
	return dex.baseSpecies ? this.toID(dex.baseSpecies) : dex.id;
}

export const Scripts: ModdedBattleScriptsData = {
	gen: 9,
	start(this: Battle) {
		for (const side of this.sides) {
			for (const pokemon of side.pokemon) {
				let baseSpecies = this.toID(pokemon.species.name);
				// hardcode
				if (baseSpecies === 'keldeoresolute') baseSpecies = 'keldeo' as ID;
				if (baseSpecies === 'dudunsparcethreesegment') baseSpecies = 'dudunsparce' as ID;
				if (!tandems[baseSpecies] || pokemon.m.tandem) continue;

				const noTandem = new Set(side.pokemon.map(p => p.baseSpecies.id));

				const availableTands = tandems[baseSpecies].filter(
					t => !noTandem.has(getBaseSpeciesId.call(this, t.species))
				);
				if (!availableTands.length) continue;

				const unbuiltTandem1 = this.sample(availableTands);
				noTandem.add(getBaseSpeciesId.call(this, unbuiltTandem1.species));

				const remainingTands = availableTands.filter(t => t !== unbuiltTandem1);

				const tandem1 = side.addPokemon(buildTandemSet.call(this, unbuiltTandem1));
				if (tandem1) tandem1.m.tandem = true;


				if (remainingTands.length) {
					const tandem2Possible = remainingTands.filter(
						t => !noTandem.has(getBaseSpeciesId.call(this, t.species))
					);
					const unbuiltTandem2 = this.sample(tandem2Possible.length ? tandem2Possible : remainingTands);

					const tandem2 = side.addPokemon(buildTandemSet.call(this, unbuiltTandem2));
					if (tandem2) tandem2.m.tandem = true;
				}
			}
		}
		// Deserialized games should use restart()
		if (this.deserialized) return;
		// need all players to start
		if (!this.sides.every(side => !!side)) throw new Error(`Missing sides: ${this.sides}`);
		if (this.started) throw new Error(`Battle already started`);
		const format = this.format;
		this.started = true;

		this.sides[1].foe = this.sides[0];
		this.sides[0].foe = this.sides[1];

		this.add('gen', this.gen);
		this.add('tier', format.name);

		if (this.rated) {
			if (this.rated === 'Rated battle') this.rated = true;
			this.add('rated', typeof this.rated === 'string' ? this.rated : '');
		}

		format.onBegin?.call(this);
		for (const rule of this.ruleTable.keys()) {
			if ('+*-!'.includes(rule.charAt(0))) continue;
			const subFormat = this.dex.formats.get(rule);
			subFormat.onBegin?.call(this);
		}

		if (this.sides.some(side => !side.pokemon[0])) {
			throw new Error('Battle not started: A player has an empty team.');
		}

		if (this.debugMode) {
			this.checkEVBalance();
		}

		if (format.customRules) {
			const plural = format.customRules.length === 1 ? '' : 's';
			const open = format.customRules.length <= 5 ? ' open' : '';
			this.add(`raw|<div class="infobox"><details class="readmore"${open}><summary><strong>${format.customRules.length} custom rule${plural}:</strong></summary> ${format.customRules.join(', ')}</details></div>`);
		}

		this.runPickTeam();
		this.queue.addChoice({ choice: 'start' });
		this.midTurn = true;

		if (!this.requestState) this.turnLoop();
	}
};
