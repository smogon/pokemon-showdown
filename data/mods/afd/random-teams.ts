import { Utils } from '../../../lib';
import RandomTeams from '../../random-battles/gen9/teams';

export interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	wantsTeraCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
}
export interface BattleFactorySpecies {
	sets: BattleFactorySet[];
	weight: number;
}
interface BattleFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string[];
	nature: string[];
	moves: string[][];
	teraType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
	shiny?: boolean;
	level?: number;
}
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;
	basePowerMoves: Set<Move>;

	constructor() {
		super();
		this.damagingMoves = new Set();
		this.basePowerMoves = new Set();
	}
}
// Moves that switch the user out
const PIVOT_MOVES = [
	'chillyreception', 'flipturn', 'partingshot', 'shedtail', 'teleport', 'uturn', 'voltswitch',
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = [
	'Zacian', 'Zamazenta',
];

const DEFENSIVE_TERA_BLAST_USERS = [
	'alcremie', 'bellossom', 'comfey', 'fezandipiti', 'florges',
];

export class RandomAFDTeams extends RandomTeams {
	override shouldCullAbility(
		ability: string,
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): boolean {
		switch (ability) {
		// Abilities which are primarily useful for certain moves or with team support
		case 'Chlorophyll': case 'Solar Power':
			return !teamDetails.sun;
		case 'Defiant':
			return (species.id === 'thundurus' && !!counter.get('Status'));
		case 'Hydration': case 'Swift Swim':
			return !teamDetails.rain;
		case 'Iron Fist': case 'Skill Link':
			return !counter.get(toID(ability));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Prankster':
			return !counter.get('Status');
		case 'Sand Force': case 'Sand Rush': case 'It\'s Excadrillin\' Time!':
			return !teamDetails.sand;
		case 'Slush Rush':
			return !teamDetails.snow;
		case 'Swarm':
			return !counter.get('Bug');
		case 'Torrent':
			return (!counter.get('Water') && !moves.has('flipturn'));
		}

		return false;
	}

	override getAbility(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		if (abilities.length <= 1) return abilities[0];

		// Hard-code abilities here
		if (species.id === 'drifblim') return moves.has('defog') ? 'Aftermath' : 'Unburden';
		if (abilities.includes('Flash Fire') && this.dex.getEffectiveness('Fire', teraType) >= 1) return 'Flash Fire';
		if ((species.id === 'thundurus' || species.id === 'tornadus') && !counter.get('Physical')) return 'Prankster';
		if (species.id === 'toucannon' && counter.get('skilllink')) return 'Skill Link';
		if (abilities.includes('Slush Rush') && moves.has('snowscape')) return 'Slush Rush';
		if (species.id === 'golduck' && teamDetails.rain) return 'Swift Swim';

		const abilityAllowed: string[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilities) {
			if (!this.shouldCullAbility(
				ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role
			)) {
				abilityAllowed.push(ability);
			}
		}

		// Pick a random allowed ability
		if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);

		// If all abilities are rejected, prioritize weather abilities over non-weather abilities
		if (!abilityAllowed.length) {
			const weatherAbilities = abilities.filter(
				a => ['Chlorophyll', 'Hydration', 'Sand Force', 'Sand Rush', 'Slush Rush', 'Solar Power', 'Swift Swim'].includes(a)
			);
			if (weatherAbilities.length) return this.sample(weatherAbilities);
		}

		// Pick a random ability
		return this.sample(abilities);
	}

	override getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	) {
		if (role === 'Fast Bulky Setup' && (ability === 'Quark Drive' || ability === 'Protosynthesis')) {
			return 'Booster Energy';
		}
		if (species.id === 'lokix') {
			return (role === 'Fast Attacker') ? 'Silver Powder' : 'Life Orb';
		}
		if (species.requiredItems && species.baseSpecies !== 'Magearna') {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === 'Arceus') {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (species.id === 'pikachu') return 'Light Ball';
		if (role === 'AV Pivot') return 'Assault Vest';
		if (species.id === 'regieleki') return 'Magnet';
		if (types.includes('Normal') && moves.has('doubleedge') && moves.has('fakeout')) return 'Silk Scarf';
		if (
			species.id === 'froslass' || moves.has('populationbomb') ||
			(ability === 'Hustle' && counter.get('setup') && !isDoubles && this.randomChance(1, 2))
		) return 'Wide Lens';
		if (species.id === 'smeargle') return 'Focus Sash';
		if (moves.has('clangoroussoul') || (species.id === 'toxtricity' && moves.has('shiftgear'))) return 'Throat Spray';
		if (
			(species.baseSpecies === 'Magearna' && role === 'Tera Blast user') ||
			((species.id === 'calyrexice' || species.id === 'necrozmaduskmane') && isDoubles)
		) return 'Weakness Policy';
		if (['dragonenergy', 'lastrespects', 'waterspout'].some(m => moves.has(m))) return 'Choice Scarf';
		if (
			!isDoubles && (ability === 'Imposter' || (species.id === 'magnezone' && role === 'Fast Attacker'))
		) return 'Choice Scarf';
		if (species.id === 'rampardos' && (role === 'Fast Attacker' || isDoubles)) return 'Choice Scarf';
		if (species.id === 'palkia' && counter.get('Status')) return 'Lustrous Orb';
		if (
			moves.has('courtchange') ||
			!isDoubles && (species.id === 'luvdisc' || (species.id === 'terapagos' && !moves.has('rest')))
		) return 'Hoots';
		if (['Cheek Pouch', 'Cud Chew', 'Harvest', 'Ripen'].some(m => ability === m)) {
			return 'Sitrus Berry';
		}
		if (moves.has('bellydrum') || moves.has('filletaway')) return 'Ward Tag';
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				role !== 'Wallbreaker' && role !== 'Doubles Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (counter.get('Status') && (species.name === 'Latias' || species.name === 'Latios')) return 'Soul Dew';
		if (species.id === 'scyther' && !isDoubles) return (isLead && !moves.has('uturn')) ? 'Eviolite' : 'Hoots';
		if (ability === 'Poison Heal' || ability === 'Quick Feet') return 'Toxic Orb';
		if (species.nfe) return 'Eviolite';
		if ((ability === 'Guts' || moves.has('facade')) && !moves.has('sleeptalk')) {
			return (types.includes('Fire') || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' || (ability === 'Sheer Force' && counter.get('sheerforce'))) return 'Life Orb';
		if (ability === 'Anger Shell') return this.sample(['Expert Belt', 'Lum Berry', 'Scope Lens', 'Sitrus Berry']);
		if (moves.has('dragondance') && isDoubles) return 'Clear Amulet';
		if (counter.get('skilllink') && ability !== 'Skill Link' && species.id !== 'breloom') return 'Loaded Dice';
		if (ability === 'Unburden') {
			return (moves.has('closecombat') || moves.has('leafstorm')) ? 'White Herb' : 'Sitrus Berry';
		}
		if (moves.has('shellsmash') && ability !== 'Weak Armor') return 'White Herb';
		if (moves.has('meteorbeam') || (moves.has('electroshot') && !teamDetails.rain)) return 'Power Herb';
		if (moves.has('acrobatics') && ability !== 'Protosynthesis') return '';
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (ability === 'Gluttony') return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
		if (species.id === 'giratina' && !isDoubles && moves.has('rest') && !moves.has('sleeptalk')) return 'Leftovers';
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin'
		) {
			return 'Chesto Berry';
		}
		if (
			species.id !== 'yanmega' &&
			this.dex.getEffectiveness('Rock', species) >= 2 && (!types.includes('Flying') || !isDoubles)
		) return 'Hoots';
	}

	override getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const lifeOrbReqs = ['flamecharge', 'nuzzle', 'rapidspin'].every(m => !moves.has(m));

		if (
			species.id !== 'jirachi' && (counter.get('Physical') >= moves.size) &&
			['dragontail', 'fakeout', 'firstimpression', 'flamecharge', 'rapidspin', 'trailblaze'].every(m => !moves.has(m))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				(species.baseStats.atk >= 100 || ability === 'Huge Power' || ability === 'Pure Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			(counter.get('Special') >= moves.size) ||
			(counter.get('Special') >= moves.size - 1 && ['flipturn', 'uturn'].some(m => moves.has(m)))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && ability !== 'Tinted Lens' && !moves.has('uturn') && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('speedsetup') && !counter.get('physicalsetup') && role === 'Bulky Setup') return 'Weakness Policy';
		if (
			!counter.get('Status') &&
			!['Fast Attacker', 'Wallbreaker', 'Tera Blast user'].includes(role)
		) {
			return 'Assault Vest';
		}
		if (species.id === 'golem') return (counter.get('speedsetup')) ? 'Weakness Policy' : 'Custap Berry';
		if (moves.has('substitute')) return 'Leftovers';
		if (
			moves.has('stickyweb') && isLead &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) <= 235
		) return 'Focus Sash';
		if (this.dex.getEffectiveness('Rock', species) >= 1) return 'Hoots';
		if (
			(moves.has('chillyreception') || (
				role === 'Fast Support' &&
				[...PIVOT_MOVES, 'defog', 'mortalspin', 'rapidspin'].some(m => moves.has(m)) &&
				!types.includes('Flying') && ability !== 'Levitate'
			))
		) return 'Hoots';

		// Low Priority
		if (moves.has('dragondance') && role === 'Bulky Setup') return 'Weakness Policy';
		if (
			ability === 'Rough Skin' || (
				ability === 'Regenerator' && (role === 'Bulky Support' || role === 'Bulky Attacker') &&
				(species.baseStats.hp + species.baseStats.def) >= 180 && this.randomChance(1, 2)
			) || (
				ability !== 'Regenerator' && !counter.get('setup') && counter.get('recovery') &&
				this.dex.getEffectiveness('Fighting', species) < 1 &&
				(species.baseStats.hp + species.baseStats.def) > 200 && this.randomChance(1, 2)
			)
		) return 'Rocky Helmet';
		if (role === 'Bulky Support') return 'Onika Burger';
		if (moves.has('outrage') && counter.get('setup')) return 'Lum Berry';
		if (moves.has('protect') && ability !== 'Speed Boost') return 'Leftovers';
		if (
			role === 'Fast Support' && isLead && !counter.get('recovery') && !counter.get('recoil') &&
			(counter.get('hazards') || counter.get('setup')) &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) < 258
		) return 'Focus Sash';
		if (
			!counter.get('setup') && ability !== 'Levitate' && this.dex.getEffectiveness('Ground', species) >= 2
		) return 'Air Balloon';
		if (['Bulky Attacker', 'Bulky Setup'].some(m => role === (m))) return 'Leftovers';
		if (species.id === 'pawmot' && moves.has('nuzzle')) return 'Leppa Berry';
		if (role === 'Fast Support' || role === 'Fast Bulky Setup') {
			return (
				counter.get('Physical') + counter.get('Special') > counter.get('Status') && lifeOrbReqs
			) ? 'Life Orb' : 'Leftovers';
		}
		if (role === 'Tera Blast user' && DEFENSIVE_TERA_BLAST_USERS.includes(species.id)) return 'Leftovers';
		if (
			lifeOrbReqs && ['Fast Attacker', 'Setup Sweeper', 'Tera Blast user', 'Wallbreaker'].some(m => role === (m))
		) return 'Life Orb';
		return 'Leftovers';
	}

	override getLevel(species: Species): number {
		if (this.adjustLevel) return this.adjustLevel;
		const file = this.randomAFDSets[species.id] || this.randomSets[species.id];
		if (file["level"]) return file["level"];
		// Default to tier-based levelling
		const tier = species.tier;
		const tierScale: Partial<Record<Species['tier'], number>> = {
			Uber: 76,
			OU: 80,
			UUBL: 81,
			UU: 82,
			RUBL: 83,
			RU: 84,
			NUBL: 85,
			NU: 86,
			PUBL: 87,
			PU: 88, "(PU)": 88, NFE: 88,
		};
		return tierScale[tier] || 80;
	}

	override getForme(species: Species): string {
		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			return species.battleOnly;
		}
		if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));

		// Consolidate mostly-cosmetic formes, at least for the purposes of Random Battles
		if (['Dudunsparce', 'Maushold', 'Polteageist', 'Sinistcha', 'Zarude'].includes(species.baseSpecies)) {
			return this.sample([species.name].concat(species.otherFormes!));
		}
		if (species.baseSpecies === 'Basculin') return 'Basculin' + this.sample(['', '-Blue-Striped']);
		if (species.baseSpecies === 'Magearna') return 'Magearna' + this.sample(['', '-Original']);
		if (species.baseSpecies === 'Pikachu') {
			return 'Pikachu' + this.sample(
				['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner', '-World']
			);
		}
		return species.name;
	}

	randomAFDSet(
		s: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		const species = this.dex.species.get(s);
		const forme = this.getForme(species);
		if (!this.randomAFDSets[species.id]) return this.randomSet(species, teamDetails, isLead, isDoubles);
		const sets = this.randomAFDSets[species.id]["sets"];
		const possibleSets: RandomTeamsTypes.RandomSetData[] = [];

		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Fast Bulky Setup on lead Paradox Pokemon, since it generates Booster Energy.
			const abilities = set.abilities!;
			if (
				isLead && (abilities.includes('Protosynthesis') || abilities.includes('Quark Drive')) &&
				set.role === 'Fast Bulky Setup'
			) continue;
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
				continue;
			}
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const teraTypes = set.teraTypes!;
		let teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = species.types;
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
		const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get ability
		ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		if (item === undefined) {
			item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
		}

		// Get level
		const level = this.getLevel(species);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || item === 'Heavy-Duty Boots' || item === 'Hoots';
		let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		// Crash damage move users want an odd HP to survive two misses
		if (['axekick', 'highjumpkick', 'jumpkick', 'supercellslam'].some(m => moves.has(m))) srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if ((moves.has('substitute') && ['Sitrus Berry'].includes(item)) || species.id === 'minior') {
				// Two Substitutes should activate Sitrus Berry. Two switch-ins to Stealth Rock should activate Shields Down on Minior.
				if (hp % 4 === 0) break;
			} else if (
				(moves.has('bellydrum') || moves.has('filletaway') || moves.has('shedtail')) &&
				(item === 'Sitrus Berry' || ability === 'Gluttony')
			) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('endeavor')) {
				// Luvdisc should be able to Substitute down to very low HP
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins in singles
				if (isDoubles) break;
				if (srWeakness <= 0 || ability === 'Regenerator' || ['Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm') return false;
			// Physical Tera Blast
			if (
				move.id === 'terablast' && (species.id === 'porygon2' || ['Contrary', 'Defiant'].includes(ability) ||
					moves.has('shiftgear') || species.baseStats.atk > species.baseStats.spa)
			) return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});
		if (
			noAttackStatMoves && !moves.has('transform') && this.format.mod !== 'partnersincrime' &&
			!ruleTable.has('forceofthefallenmod')
		) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// Enforce Tera Type after all set generation is done to prevent infinite generation
		if (this.forceTeraType) teraType = this.forceTeraType;

		// shuffle moves to add more randomness to camomons
		const shuffledMoves = Array.from(moves);
		this.prng.shuffle(shuffledMoves);
		let name = species.baseSpecies;
		if (name === "Bruxish") name = "Brux";
		return {
			name,
			species: forme,
			speciesId: species.id,
			gender: species.baseSpecies === 'Greninja' ? 'M' : (species.gender || (this.random(2) ? 'F' : 'M')),
			shiny: this.randomChance(1, 1024),
			level,
			moves: shuffledMoves,
			ability,
			evs,
			ivs,
			item,
			teraType,
			role,
		};
	}

	/**
	 * Checks if the new species is compatible with the other mons currently on the team.
	 */
	override getPokemonCompatibility(
		species: Species,
		pokemon: RandomTeamsTypes.RandomSet[]
	): boolean {
		const webSetters = [
			'ariados', 'smeargle', 'masquerain', 'kricketune', 'leavanny', 'galvantula', 'vikavolt', 'ribombee', 'araquanid', 'spidops',
		];
		const screenSetters = ['meowstic', 'grimmsnarl', 'ninetalesalola', 'abomasnow'];

		const sunSetters = ['ninetales', 'torkoal', 'groudon', 'koraidon'];

		const incompatiblePokemon = [
			// These Pokemon with support roles are considered too similar to each other.
			['blissey', 'chansey'],
			['illumise', 'volbeat'],

			// These combinations are prevented to avoid double webs or screens.
			[webSetters, webSetters],
			[screenSetters, screenSetters],

			// These Pokemon are incompatible because the presence of one actively harms the other.
			// Prevent Dry Skin + sun setting ability
			['toxicroak', sunSetters],
		];

		const incompatibilityList = incompatiblePokemon;
		for (const pair of incompatibilityList) {
			const monsArrayA = (Array.isArray(pair[0])) ? pair[0] : [pair[0]];
			const monsArrayB = (Array.isArray(pair[1])) ? pair[1] : [pair[1]];
			if (monsArrayB.includes(species.id)) {
				if (pokemon.some(m => monsArrayA.includes(m.speciesId!))) return false;
			}
			if (monsArrayA.includes(species.id)) {
				if (pokemon.some(m => monsArrayB.includes(m.speciesId!))) return false;
			}
		}

		return true;
	}

	randomAFDSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');

	override randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// PotD stuff
		const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};
		let numMaxLevelPokemon = 0;

		const pokemonList = Object.keys(this.randomSets);
		const afdList = Object.keys(this.randomAFDSets);
		const zaMegaList = Object.keys(this.randomAFDSets).filter(x => (
			this.dex.species.get(x).isMega && this.dex.species.get(x).gen === 9
		));
		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool('', pokemon, false, pokemonList);
		const [afdPool, baseAfdPool] = this.getPokemonPool('', pokemon, false, afdList);
		const [zaMegaPool, zaBaseMegaPool] = this.getPokemonPool('', pokemon, false, zaMegaList);

		let leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			let baseSpecies, species;
			if (pokemon.length === 0) {
				baseSpecies = this.sampleNoReplace(zaBaseMegaPool);
				species = this.dex.species.get(this.sample(zaMegaPool[baseSpecies]));
			} else if (this.randomChance(1, 5)) {
				baseSpecies = this.sampleNoReplace(baseAfdPool);
				species = this.dex.species.get(this.sample(afdPool[baseSpecies]));
			} else {
				baseSpecies = this.sampleNoReplace(baseSpeciesPool);
				species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			}
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if (['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id) && teamDetails.teraBlast) continue;

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);
			const weakToScald = (
				this.dex.getEffectiveness('Water', species) > 0 ||
				(this.dex.getEffectiveness('Water', species) > -2 && types.includes('Steel'))
			);
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			let skip = false;

			// Limit two of any type
			for (const typeName of types) {
				if (typeCount[typeName] >= 2 * limitFactor) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Limit three weak to any type, and one double weak to any type
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
					if (typeWeaknesses[typeName] >= 3 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
					if (typeDoubleWeaknesses[typeName] >= limitFactor) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			// Count Dry Skin/Fluffy as Fire weaknesses
			if (
				this.dex.getEffectiveness('Fire', species) === 0 &&
				Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
			) {
				if (!typeWeaknesses['Fire']) typeWeaknesses['Fire'] = 0;
				if (typeWeaknesses['Fire'] >= 3 * limitFactor) continue;
			}

			// Limit four weak to Freeze-Dry
			if (weakToFreezeDry) {
				if (!typeWeaknesses['Freeze-Dry']) typeWeaknesses['Freeze-Dry'] = 0;
				if (typeWeaknesses['Freeze-Dry'] >= 4 * limitFactor) continue;
			}
			if (weakToScald) {
				if (!typeWeaknesses['Scald']) typeWeaknesses['Scald'] = 0;
				if (typeWeaknesses['Scald'] >= 4 * limitFactor) continue;
			}

			// Limit one level 100 Pokemon
			if (!this.adjustLevel && (this.getLevel(species) === 100) && numMaxLevelPokemon >= limitFactor) {
				continue;
			}

			// Check compatibility with team
			if (!this.getPokemonCompatibility(species, pokemon)) continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			let set: RandomTeamsTypes.RandomSet;

			if (leadsRemaining) {
				if (NO_LEAD_POKEMON.includes(species.baseSpecies)) {
					if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
					set = this.randomAFDSet(species, teamDetails, false);
					pokemon.push(set);
				} else {
					set = this.randomAFDSet(species, teamDetails, true);
					pokemon.unshift(set);
					leadsRemaining--;
				}
			} else {
				set = this.randomAFDSet(species, teamDetails, false);
				pokemon.push(set);
			}

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment weakness counter
			for (const typeName of this.dex.types.names()) {
				// it's weak to the type
				if (this.dex.getEffectiveness(typeName, species) > 0) {
					typeWeaknesses[typeName]++;
				}
				if (this.dex.getEffectiveness(typeName, species) > 1) {
					typeDoubleWeaknesses[typeName]++;
				}
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire']++;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry']++;
			if (weakToScald) typeWeaknesses['Scald']++;

			// Increment level 100 counter
			if (set.level === 100) numMaxLevelPokemon++;

			// Track what the team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.ability === 'Orichalcum Pulse' || set.moves.includes('sunnyday')) {
				teamDetails.sun = 1;
			}
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user' || ['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id)) {
				teamDetails.teraBlast = 1;
			}
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}
}

export default RandomAFDTeams;
