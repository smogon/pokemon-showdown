import RandomTeams from '../../random-teams';

export interface SSBSet {
	species: string;
	ability: string | string[];
	item: string | string[];
	gender: GenderName;
	moves: (string | string[])[];
	signatureMove: string;
	evs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	ivs?: {hp?: number, atk?: number, def?: number, spa?: number, spd?: number, spe?: number};
	nature?: string | string[];
	shiny?: number | boolean;
	level?: number;
	happiness?: number;
	skip?: string;
}
interface SSBSets {[k: string]: SSBSet}

export const ssbSets: SSBSets = {
	'A Resident No-Life': {
		species: 'Mawile', ability: 'Slow Burn', item: 'Mawilite', gender: 'M',
		moves: ['Thunder Punch', 'Ice Punch', 'Double Iron Bash'],
		signatureMove: 'Rising Surge',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Brookeee: {
		species: 'Primeape', ability: 'Aggression', item: 'Ramen', gender: 'F',
		moves: ['Ice Punch', 'Stomping Tantrum', 'Endure'],
		signatureMove: 'Masochism',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	'El Capitan': {
		species: 'Zygarde-10%', ability: 'Iron Will', item: 'Assault Helmet', gender: 'M',
		moves: ['No Retreat', 'Thousand Arrows', 'Flare Blitz'],
		signatureMove: 'Tenacious Rush',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Jolly',
	},
	flufi: {
		species: 'Pikachu-Libre', ability: 'Hero Morale', item: 'Light Ball', gender: 'M',
		moves: ['Wild Charge', 'Darkest Lariat', 'Extreme Speed'],
		signatureMove: 'Cranberry Cutter',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	Genwunner: {
		species: 'Alakazam', ability: 'Best Gen', item: '', gender: 'N',
		moves: ['Amnesia', 'Hyper Beam', 'Blizzard'],
		signatureMove: 'Psychic Bind',
		evs: {def: 4, spa: 252, spe: 252}, ivs: {atk: 0}, nature: 'Serious',
	},
	Horrific17: {
		species: 'Arcanine', ability: 'Fair Fight', item: 'Horrifium Z', gender: 'M',
		moves: ['Morning Sun', 'Solar Blade', 'Extreme Speed'],
		signatureMove: 'Meteor Charge',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
	'Kaiser Dragon': {
		species: 'Rayquaza-Mega', ability: 'Elemental Shift', item: 'Leftovers', gender: 'N',
		moves: ['Protect', 'Refresh', 'Recover'],
		signatureMove: 'Ultima',
		evs: {hp: 252, def: 4, spd: 252}, ivs: {atk: 0}, nature: 'Calm', shiny: true,
	},
	LandoriumZ: {
		species: 'Crobat', ability: 'Retaliation', item: 'Bright Powder', gender: 'M',
		moves: ['Fusion Bolt', 'Earthquake', 'Dragon Ascent'],
		signatureMove: 'Cross Dance',
		evs: {hp: 252, atk: 252, def: 4}, nature: 'Adamant',
	},
	Mayie: {
		species: 'Lanturn', ability: 'Final Prayer', item: 'Leftovers', gender: 'F',
		moves: ['Parting Shot', 'Thunder Wave', 'Scald'],
		signatureMove: 'Sacred Penance',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0}, nature: 'Bold',
	},
	Minimind: {
		species: 'Clefable', ability: 'Unaware', item: 'Leftovers', gender: 'F',
		moves: ['Calm Mind', 'Draining Kiss', 'Soft-Boiled'],
		signatureMove: 'Mega Metronome',
		evs: {hp: 252, def: 252, spa: 4}, nature: 'Bold',
	},
	Nina: {
		species: 'Chansey', ability: 'Sticky Hold', item: 'Eviolite', gender: 'F',
		moves: ['Teleport', 'Aromatherapy', 'Wish'],
		signatureMove: 'Psychic Shield',
		evs: {hp: 252, def: 252, spd: 4}, ivs: {atk: 0}, nature: 'Bold', shiny: true,
	},
	Omega: {
		species: 'Aegislash', ability: 'Burn Heal', item: 'Flame Orb', gender: 'N',
		moves: ['Teleport', 'Protect', 'Wish'],
		signatureMove: 'Wave Cannon',
		evs: {hp: 252, def: 4, spd: 252}, ivs: {atk: 0}, nature: 'Calm',
	},
	SunDraco: {
		species: 'Silvally', ability: 'Oblivious', item: 'Life Orb', gender: 'M',
		moves: ['Dragon Claw', 'Shadow Claw', 'Fire Punch'],
		signatureMove: 'Ein Sol',
		evs: {hp: 4, atk: 252, spe: 252}, nature: 'Adamant',
	},
	Tonberry: {
		species: 'Marshadow', ability: 'Vindictive', item: 'Life Orb', gender: 'N',
		moves: ['Thousand Arrows', 'Glacial Lance', 'Close Combat'],
		signatureMove: 'Karma',
		evs: {atk: 252, spd: 4, spe: 252}, nature: 'Jolly',
	},
};

export class RandomStaffBrosTeams extends RandomTeams {
	randomStaffBrosTeam(options: {inBattle?: boolean} = {}) {
		this.enforceNoDirectCustomBanlistChanges();

		const team: PokemonSet[] = [];
		const debug: string[] = []; // Set this to a list of SSB sets to override the normal pool for debugging.
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const monotype = ruleTable.has('sametypeclause') ? this.sample([...this.dex.types.names()]) : false;
		let pool = debug.length ? debug : Object.keys(ssbSets);
		if (monotype && !debug.length) {
			pool = pool.filter(x => this.dex.species.get(ssbSets[x].species).types.includes(monotype));
		}
		const typePool: {[k: string]: number} = {};
		let depth = 0;
		while (pool.length && team.length < this.maxTeamSize) {
			if (depth >= 200) throw new Error(`Infinite loop in Super Staff Bros team generation.`);
			depth++;
			const name = this.sampleNoReplace(pool);
			const ssbSet: SSBSet = this.dex.deepClone(ssbSets[name]);
			if (ssbSet.skip) continue;

			// Enforce typing limits
			if (!(debug.length || monotype)) { // Type limits are ignored when debugging or for monotype variations.
				const species = this.dex.species.get(ssbSet.species);
				if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

				const weaknesses = [];
				for (const type of this.dex.types.names()) {
					const typeMod = this.dex.getEffectiveness(type, species.types);
					if (typeMod > 0) weaknesses.push(type);
				}
				let rejected = false;
				for (const type of weaknesses) {
					if (typePool[type] === undefined) typePool[type] = 0;
					if (typePool[type] >= 3) {
						// Reject
						rejected = true;
						break;
					}
				}
				if (ssbSet.ability === 'Wonder Guard') {
					if (!typePool['wonderguard']) {
						typePool['wonderguard'] = 1;
					} else {
						rejected = true;
					}
				}
				if (rejected) continue;
				// Update type counts
				for (const type of weaknesses) {
					typePool[type]++;
				}
			}

			const set: PokemonSet = {
				name: name,
				species: ssbSet.species,
				item: Array.isArray(ssbSet.item) ? this.sampleNoReplace(ssbSet.item) : ssbSet.item,
				ability: Array.isArray(ssbSet.ability) ? this.sampleNoReplace(ssbSet.ability) : ssbSet.ability,
				moves: [],
				nature: ssbSet.nature ? Array.isArray(ssbSet.nature) ? this.sampleNoReplace(ssbSet.nature) : ssbSet.nature : 'Serious',
				gender: ssbSet.gender || this.sample(['M', 'F', 'N']),
				evs: ssbSet.evs ? {...{hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, ...ssbSet.evs} :
				{hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84},
				ivs: {...{hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, ...ssbSet.ivs},
				level: this.adjustLevel || ssbSet.level || 100,
				happiness: typeof ssbSet.happiness === 'number' ? ssbSet.happiness : 255,
				shiny: typeof ssbSet.shiny === 'number' ? this.randomChance(1, ssbSet.shiny) : !!ssbSet.shiny,
			};
			while (set.moves.length < 3 && ssbSet.moves.length > 0) {
				let move = this.sampleNoReplace(ssbSet.moves);
				if (Array.isArray(move)) move = this.sampleNoReplace(move);
				set.moves.push(move);
			}
			set.moves.push(ssbSet.signatureMove);

			// Any set specific tweaks occur here.
			if (set.name === 'Marshmallon' && !set.moves.includes('Head Charge')) set.moves[this.random(3)] = 'Head Charge';

			team.push(set);

			// Team specific tweaks occur here
			// Swap last and second to last sets if last set has Illusion
			if (team.length === this.maxTeamSize && set.ability === 'Illusion') {
				team[this.maxTeamSize - 1] = team[this.maxTeamSize - 2];
				team[this.maxTeamSize - 2] = set;
			}
		}
		return team;
	}
}

export default RandomStaffBrosTeams;
