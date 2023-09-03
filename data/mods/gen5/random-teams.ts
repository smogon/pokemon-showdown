import RandomGen6Teams from '../gen6/random-teams';
import {Utils} from '../../../lib';
import {toID} from '../../../sim/dex';
import {PRNG} from '../../../sim';
import type {MoveCounter, OldRandomBattleSpecies} from '../gen8/random-teams';

// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'aquajet', 'bounce', 'chatter', 'clearsmog', 'dragontail', 'eruption', 'explosion', 'fakeout', 'flamecharge',
	'iceshard', 'icywind', 'incinerate', 'machpunch', 'pluck', 'pursuit', 'quickattack', 'reversal', 'selfdestruct',
	'skydrop', 'snarl', 'suckerpunch', 'uturn', 'vacuumwave', 'voltswitch', 'waterspout',
];

export class RandomGen5Teams extends RandomGen6Teams {
	randomData: {[species: string]: OldRandomBattleSpecies} = require('./random-data.json');

	constructor(format: string | Format, prng: PRNG | PRNGSeed | null) {
		super(format, prng);
		this.noStab = NO_STAB;

		this.moveEnforcementCheckers = {
			lead: (movePool, moves, abilities, types, counter) => (
				movePool.includes('stealthrock') &&
				!!counter.get('Status') &&
				!counter.setupType &&
				!counter.get('speedsetup') &&
				!moves.has('substitute')
			),
			Dark: (movePool, moves, abilities, types, counter) => !counter.get('Dark'),
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric') || movePool.includes('thunder'),
			Fighting: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Fighting') &&
				(species.baseStats.atk >= 90 || abilities.has('Pure Power') || !!counter.setupType || !counter.get('Status'))
			),
			Fire: (movePool, moves, abilities, types, counter) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter) => (
				!counter.get('Flying') && (types.has('Normal') || abilities.has('Serene Grace'))
			),
			Ghost: (movePool, moves, abilities, types, counter) => !types.has('Dark') && !counter.get('Ghost'),
			Grass: movePool => (['hornleech', 'seedflare', 'woodhammer'].some(m => movePool.includes(m))),
			Ground: (movePool, moves, abilities, types, counter) => (
				!counter.get('Ground') && !moves.has('rest') && !moves.has('sleeptalk')
			),
			Ice: (movePool, moves, abilities, types, counter) => !counter.get('Ice'),
			Normal: (movePool, moves, abilities, types, counter, species) => (
				movePool.includes('return') && species.baseStats.atk > 80
			),
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter) => !counter.get('Steel') && abilities.has('Technician'),
			Water: (movePool, moves, abilities, types, counter) => (
				!counter.get('Water') || (abilities.has('Adaptability') && movePool.includes('waterfall'))
			),
			Contrary: (movePool, moves, abilities, types, counter, species, teamDetails) => (
				!counter.get('contrary') && species.name !== 'Shuckle'
			),
			Guts: (movePool, moves, abilities, types) => types.has('Normal') && movePool.includes('facade'),
			'Slow Start': movePool => movePool.includes('substitute'),
		};
	}

	shouldCullMove(
		move: Move,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
	): {cull: boolean, isSetup?: boolean} {
		const hasRestTalk = moves.has('rest') && moves.has('sleeptalk');
		switch (move.id) {
		// Not very useful without their supporting moves
		case 'endeavor':
			return {cull: !isLead};
		case 'focuspunch':
			return {cull: !moves.has('substitute') || counter.damagingMoves.size < 2 || moves.has('swordsdance')};
		case 'lightscreen':
			if (movePool.length > 1) {
				const screen = movePool.indexOf('reflect');
				if (screen >= 0) this.fastPop(movePool, screen);
			}
			return {cull: !moves.has('reflect')};
		case 'reflect':
			if (movePool.length > 1) {
				const screen = movePool.indexOf('lightscreen');
				if (screen >= 0) this.fastPop(movePool, screen);
			}
			return {cull: !moves.has('lightscreen')};
		case 'rest':
			return {cull: movePool.includes('sleeptalk')};
		case 'sleeptalk':
			if (movePool.length > 1) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			return {cull: !moves.has('rest')};
		case 'storedpower':
			return {cull: !counter.setupType && !moves.has('cosmicpower')};
		case 'weatherball':
			return {cull: !moves.has('sunnyday')};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			return {cull: (counter.setupType !== 'Physical' || counter.get('physicalsetup') > 1 || (
				counter.get('Physical') + counter.get('physicalpool') < 2 &&
				!hasRestTalk
			)), isSetup: true};
		case 'calmmind': case 'nastyplot': case 'tailglow':
			return {cull: (counter.setupType !== 'Special' || counter.get('specialsetup') > 1 || (
				counter.get('Special') + counter.get('specialpool') < 2 &&
				!hasRestTalk
			)), isSetup: true};
		case 'growth': case 'shellsmash': case 'workup':
			const moveTotal = counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool');
			return {
				cull: (
					counter.setupType !== 'Mixed' ||
					counter.get('mixedsetup') > 1 ||
					moveTotal < 2 ||
					(move.id === 'growth' && !moves.has('sunnyday'))
				),
				isSetup: true,
			};
		case 'agility': case 'autotomize': case 'rockpolish':
			return {
				cull: (
					(counter.damagingMoves.size < 2 && !counter.setupType) ||
					hasRestTalk
				),
				isSetup: !counter.setupType,
			};

		// Bad after setup
		case 'bulletpunch':
			return {cull: !!counter.get('speedsetup')};
		case 'circlethrow': case 'dragontail':
			return {cull: moves.has('substitute') || (!!counter.setupType && !moves.has('rest') && !moves.has('sleeptalk'))};
		case 'fakeout': case 'healingwish':
			return {cull: !!counter.setupType || !!counter.get('recovery') || moves.has('substitute')};
		case 'haze': case 'magiccoat': case 'pursuit': case 'spikes':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('rest') || moves.has('trickroom')};
		case 'iceshard':
			return {cull: moves.has('shellsmash')};
		case 'leechseed': case 'roar': case 'whirlwind':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('dragontail')};
		case 'nightshade': case 'seismictoss': case 'superfang':
			return {cull: !!counter.setupType || counter.damagingMoves.size > 1};
		case 'protect':
			return {cull: (
				moves.has('rest') ||
				(counter.setupType && !abilities.has('Speed Boost') && !moves.has('wish')) ||
				moves.has('lightscreen') && moves.has('reflect')
			)};
		case 'rapidspin':
			return {cull: moves.has('shellsmash') || (!!counter.setupType && counter.get('Status') >= 2)};
		case 'stealthrock':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('rest') || !!teamDetails.stealthRock};
		case 'switcheroo': case 'trick':
			return {cull: (
				counter.get('Physical') + counter.get('Special') < 3 ||
				['fakeout', 'rapidspin', 'suckerpunch'].some(m => moves.has(m))
			)};
		case 'toxic':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('trickroom')};
		case 'toxicspikes':
			return {cull: !!counter.setupType || !!teamDetails.toxicSpikes};
		case 'trickroom':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				counter.damagingMoves.size < 2 ||
				moves.has('lightscreen') || moves.has('reflect')
			)};
		case 'uturn':
			// Infernape doesn't want mixed sets with U-turn
			const infernapeCase = species.id === 'infernape' && !!counter.get('Special');
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || infernapeCase};
		case 'voltswitch':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				['magnetrise', 'uturn'].some(m => moves.has(m))
			)};

		// Ineffective having both
		// Attacks:
		case 'bugbite':
			return {cull: moves.has('uturn')};
		case 'crunch':
			return {cull: !types.has('Dark') && moves.has('suckerpunch')};
		case 'dragonpulse': case 'spacialrend':
			return {cull: moves.has('dracometeor') || moves.has('outrage')};
		case 'thunderbolt':
			return {cull: moves.has('wildcharge')};
		case 'drainpunch': case 'focusblast':
			return {cull: moves.has('closecombat') || moves.has('lowkick')};
		case 'blueflare': case 'flareblitz': case 'fierydance': case 'flamethrower': case 'lavaplume':
			return {cull: ['fireblast', 'overheat', 'vcreate'].some(m => moves.has(m))};
		case 'bravebird': case 'pluck':
			return {cull: moves.has('acrobatics') || moves.has('hurricane')};
		case 'acrobatics':
			return {cull: !counter.setupType && moves.has('hurricane')};
		case 'hurricane':
			return {cull: !!counter.setupType && moves.has('acrobatics')};
		case 'gigadrain':
			return {cull: (!counter.setupType && moves.has('leafstorm')) ||
				['petaldance', 'powerwhip'].some(m => moves.has(m))};
		case 'solarbeam':
			return {cull: (!abilities.has('Drought') && !moves.has('sunnyday')) || moves.has('gigadrain')};
		case 'leafstorm':
			return {cull: !!counter.setupType && (moves.has('gigadrain') || moves.has('seedbomb'))};
		case 'seedbomb':
			return {cull: !counter.setupType && (moves.has('leafstorm'))};
		case 'bonemerang': case 'earthpower':
			return {cull: moves.has('earthquake')};
		case 'extremespeed': case 'headsmash':
			return {cull: moves.has('roost')};
		case 'facade':
			return {cull: moves.has('suckerpunch') && !types.has('Normal')};
		case 'hydropump':
			return {cull: moves.has('waterfall') && !!counter.setupType};
		case 'judgment':
			return {cull: counter.setupType !== 'Special' && counter.get('stab') > 1};
		case 'return':
			return {cull: moves.has('doubleedge')};
		case 'rockblast':
			return {cull: moves.has('stoneedge')};
		case 'poisonjab':
			return {cull: moves.has('gunkshot')};
		case 'psychic':
			return {cull: moves.has('psyshock')};
		case 'scald': case 'surf':
			return {cull: moves.has('hydropump') || moves.has('waterfall')};
		case 'shadowball':
			// mono-Psychic types with Calm Mind shouldn't have Shadow Ball as their only coverage
			// Chimecho is exempt since Shadow Ball is its only coverage move
			return {cull: types.has('Psychic') && types.size < 2 && counter.get('Special') < 3 &&
				moves.has('calmmind') && species.id !== 'chimecho'};
		case 'waterfall':
			return {cull: moves.has('hydropump') && !counter.setupType && !moves.has('raindance') && !teamDetails.rain};
		case 'waterspout':
			return {cull: !!counter.get('Status')};

		// Status:
		case 'encore': case 'icepunch': case 'raindance': case 'suckerpunch':
			return {cull: moves.has('thunderwave') || hasRestTalk};
		case 'glare': case 'headbutt':
			return {cull: moves.has('bodyslam')};
		case 'healbell':
			return {cull: !!counter.get('speedsetup') || moves.has('magiccoat')};
		case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
			// Prevent Roost + Protect on Gliscor
			const gliscorCase = species.id === 'gliscor' && moves.has('protect');
			return {cull: ['leechseed', 'rest', 'wish'].some(m => moves.has(m)) || gliscorCase};
		case 'substitute':
			return {cull: (
				(moves.has('doubleedge') && !abilities.has('rockhead')) ||
				['pursuit', 'rest', 'superpower', 'uturn', 'voltswitch'].some(m => moves.has(m)) ||
				// Sceptile wants Swords Dance
				(moves.has('acrobatics') && moves.has('earthquake')) ||
				movePool.includes('shiftgear')
			)};
		case 'thunderwave':
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				hasRestTalk ||
				moves.has('discharge') || moves.has('trickroom')
			)};
		case 'willowisp':
			return {cull: moves.has('lavaplume') || moves.has('scald') && !types.has('Ghost')};
		}

		return {cull: false};
	}

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species
	): boolean {
		switch (ability) {
		case 'Anger Point': case 'Gluttony': case 'Moody': case 'Sand Veil': case 'Snow Cloak': case 'Steadfast':
			return true;
		case 'Analytic': case 'Download': case 'Hyper Cutter':
			return species.nfe;
		case 'Chlorophyll': case 'Solar Power':
			return (abilities.has('Harvest') || (!moves.has('sunnyday') && !teamDetails.sun));
		case 'Compound Eyes': case 'No Guard':
			return !counter.get('inaccurate');
		case 'Contrary': case 'Iron Fist': case 'Skill Link':
			return !counter.get(toID(ability));
		case 'Defiant': case 'Moxie':
			return !counter.get('Physical');
		case 'Flash Fire':
			return abilities.has('Drought');
		case 'Guts':
			return (species.id === 'heracross');
		case 'Hydration': case 'Rain Dish': case 'Swift Swim':
			return (!moves.has('raindance') && !teamDetails.rain);
		case 'Hustle':
			return counter.get('Physical') < 2;
		case 'Ice Body':
			return !teamDetails.hail;
		case 'Immunity':
			return abilities.has('Toxic Boost');
		case 'Intimidate':
			return moves.has('rest') || species.id === 'staraptor';
		case 'Lightning Rod':
			return species.types.includes('Ground');
		case 'Limber':
			return species.types.includes('Electric');
		case 'Mold Breaker':
			return (
				abilities.has('Adaptability') ||
				moves.has('rest') && moves.has('sleeptalk') ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Poison Heal':
			return (abilities.has('Technician') && !!counter.get('technician'));
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure': case 'Synchronize':
			return (counter.get('Status') < 2 || abilities.has('Trace'));
		case 'Reckless': case 'Rock Head':
			return (!counter.get('recoil') || abilities.has('Sap Sipper'));
		case 'Regenerator':
			return abilities.has('Magic Guard');
		case 'Sand Force': case 'Sand Rush':
			return !teamDetails.sand;
		case 'Serene Grace':
			return (!counter.get('serenegrace') || species.id === 'blissey');
		case 'Sheer Force':
			return (!counter.get('sheerforce') || abilities.has('Guts'));
		case 'Sturdy':
			return (!!counter.get('recoil') && !counter.get('recovery'));
		case 'Swarm':
			return !counter.get('Bug');
		case 'Technician':
			return (!counter.get('technician') || moves.has('tailslap'));
		case 'Tinted Lens':
			return (abilities.has('Insomnia') || abilities.has('Magic Guard') || moves.has('protect'));
		case 'Unaware':
			return (!!counter.setupType || abilities.has('Magic Guard'));
		case 'Unburden':
			return species.baseStats.spe > 100 && !moves.has('acrobatics');
		case 'Water Absorb':
			return (abilities.has('Drizzle') || abilities.has('Unaware') || abilities.has('Volt Absorb'));
		}

		return false;
	}


	getAbility(
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
	): string {
		const abilityData = Array.from(abilities).map(a => this.dex.abilities.get(a));
		Utils.sortBy(abilityData, abil => -abil.rating);

		if (abilityData.length <= 1) return abilityData[0].name;

		// Hard-code abilities here
		if (abilities.has('Guts') && moves.has('facade') && (!abilities.has('Quick Feet') || !counter.setupType)) return 'Guts';
		if (abilities.has('Prankster') && counter.get('Status') > 1) return 'Prankster';
		if (abilities.has('Quick Feet') && moves.has('facade')) return 'Quick Feet';
		if (abilities.has('Swift Swim') && moves.has('raindance')) return 'Swift Swim';
		if (species.name === 'Altaria') return 'Natural Cure';
		// Mandibuzz doesn't want Weak Armor
		if (species.name === 'Mandibuzz') return this.sample(['Big Pecks', 'Overcoat']);

		let abilityAllowed: Ability[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilityData) {
			if (ability.rating >= 1 && !this.shouldCullAbility(
				ability.name, types, moves, abilities, counter, movePool, teamDetails, species
			)) {
				abilityAllowed.push(ability);
			}
		}

		// If all abilities are rejected, re-allow all abilities
		if (!abilityAllowed.length) {
			for (const ability of abilityData) {
				if (ability.rating > 0) abilityAllowed.push(ability);
			}
			if (!abilityAllowed.length) abilityAllowed = abilityData;
		}

		if (abilityAllowed.length === 1) return abilityAllowed[0].name;
		// Sort abilities by rating with an element of randomness
		// All three abilities can be chosen
		if (abilityAllowed[2] && abilityAllowed[0].rating - 0.5 <= abilityAllowed[2].rating) {
			if (abilityAllowed[1].rating <= abilityAllowed[2].rating) {
				if (this.randomChance(1, 2)) [abilityAllowed[1], abilityAllowed[2]] = [abilityAllowed[2], abilityAllowed[1]];
			} else {
				if (this.randomChance(1, 3)) [abilityAllowed[1], abilityAllowed[2]] = [abilityAllowed[2], abilityAllowed[1]];
			}
			if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
				if (this.randomChance(2, 3)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			} else {
				if (this.randomChance(1, 2)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			}
		} else {
			// Third ability cannot be chosen
			if (abilityAllowed[0].rating <= abilityAllowed[1].rating) {
				if (this.randomChance(1, 2)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			} else if (abilityAllowed[0].rating - 0.5 <= abilityAllowed[1].rating) {
				if (this.randomChance(1, 3)) [abilityAllowed[0], abilityAllowed[1]] = [abilityAllowed[1], abilityAllowed[0]];
			}
		}

		// After sorting, choose the first ability
		return abilityAllowed[0].name;
	}

	getHighPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean
	): string | undefined {
		if (species.requiredItem) return species.requiredItem;
		if (species.requiredItems) return this.sample(species.requiredItems);

		if (species.name === 'Marowak') return 'Thick Club';
		if (species.name === 'Farfetch\u2019d') return 'Stick';
		if (species.name === 'Latias' || species.name === 'Latios') return 'Soul Dew';
		if (species.name === 'Pikachu') return 'Light Ball';
		if (species.name === 'Shedinja' || species.name === 'Smeargle') return 'Focus Sash';
		if (species.name === 'Unown') return 'Choice Specs';
		if (species.name === 'Wobbuffet' && moves.has('destinybond') && this.randomChance(1, 2)) return 'Custap Berry';
		if (ability === 'Imposter') return 'Choice Scarf';
		if (moves.has('switcheroo') || moves.has('trick')) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter.get('priority')) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (species.nfe) return 'Eviolite';
		if (moves.has('shellsmash')) return 'White Herb';
		if (ability === 'Harvest' || moves.has('bellydrum')) return 'Sitrus Berry';
		if ((ability === 'Magic Guard' || ability === 'Sheer Force') && counter.damagingMoves.size > 1) return 'Life Orb';
		if (
			ability === 'Poison Heal' ||
			ability === 'Toxic Boost' ||
			(ability === 'Quick Feet' && moves.has('facade'))
		) {
			return 'Toxic Orb';
		}
		if (moves.has('psychoshift')) return 'Flame Orb';
		if (moves.has('rest') && !moves.has('sleeptalk') && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			return 'Chesto Berry';
		}
		if (ability === 'Guts' && moves.has('facade')) {
			return (types.has('Fire') || moves.has('uturn') || moves.has('voltswitch')) ? 'Toxic Orb' : 'Flame Orb';
		}
		if (moves.has('raindance')) return (ability === 'Forecast') ? 'Damp Rock' : 'Life Orb';
		if (moves.has('sunnyday')) return (ability === 'Forecast' || ability === 'Flower Gift') ? 'Heat Rock' : 'Life Orb';
		if (moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (moves.has('acrobatics')) return 'Flying Gem';
		if (ability === 'Unburden') return moves.has('fakeout') ? 'Normal Gem' : `${species.types[0]} Gem`;
	}

	getLowPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
	): string | undefined {
		if (
			ability === 'Speed Boost' &&
			!moves.has('substitute') &&
			counter.get('Physical') + counter.get('Special') > 2
		) {
			return 'Life Orb';
		}
		if (
			counter.get('Physical') >= 4 &&
			['dragontail', 'fakeout', 'flamecharge'].every(m => !moves.has(m)) &&
			!moves.has('suckerpunch') &&
			(!moves.has('rapidspin') || this.dex.getEffectiveness('Rock', species) < 1)
		) {
			return (
				(species.baseStats.atk >= 100 || abilities.has('Huge Power')) &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!counter.get('priority') &&
				this.randomChance(2, 3)
			) ? 'Choice Scarf' : 'Choice Band';
		}
		if (counter.get('Special') >= 4 || (counter.get('Special') >= 3 && moves.has('uturn'))) {
			return (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				!moves.has('uturn') &&
				(ability === 'Download' || this.randomChance(2, 3))
			) ? 'Choice Scarf' : 'Choice Specs';
		}

		if (counter.setupType && moves.has('outrage')) return 'Lum Berry';
		if (this.dex.getEffectiveness('Ground', species) >= 2 && ability !== 'Levitate') return 'Air Balloon';
		if (counter.get('Dark') >= 3) return 'Black Glasses';
		if (species.name === 'Palkia' && (moves.has('dracometeor') || moves.has('spacialrend'))) {
			return 'Lustrous Orb';
		}
		if (
			types.has('Poison') ||
			['bodyslam', 'dragontail', 'protect', 'scald', 'sleeptalk', 'substitute'].some(m => moves.has(m))
		) {
			return 'Leftovers';
		}
		if (counter.damagingMoves.size >= 4 && ability !== 'Sturdy') {
			return moves.has('uturn') ? 'Expert Belt' : 'Life Orb';
		}
		if (
			isLead &&
			counter.get('hazards') &&
			!counter.get('recovery') &&
			ability !== 'Regenerator' &&
			species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 275
		) {
			return ability === 'Sturdy' ? 'Custap Berry' : 'Focus Sash';
		}
		if (moves.has('voltswitch') && species.baseStats.spe <= 90) {
			return 'Leftovers';
		}
		if (
			counter.damagingMoves.size >= 3 &&
			species.baseStats.spe >= 40 &&
			species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 275 &&
			ability !== 'Sturdy' &&
			!moves.has('rapidspin') && !moves.has('uturn')
		) {
			return 'Life Orb';
		}
	}

	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		let forme = species.name;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}

		const data = this.randomData[species.id];

		const movePool = (data.moves || Object.keys(this.dex.species.getLearnset(species.id)!)).slice();
		const rejectedPool = [];
		const moves = new Set<string>();
		let ability = '';

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs: SparseStatsTable = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		const types = new Set(species.types);
		const abilities = new Set(Object.values(species.abilities));
		if (species.unreleasedHidden) abilities.delete(species.abilities.H);

		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		let counter: MoveCounter;
		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;

		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.size < this.maxMoveCount && movePool.length) {
				const moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}

			while (moves.size < this.maxMoveCount && rejectedPool.length) {
				const moveid = this.sampleNoReplace(rejectedPool);
				if (moveid.startsWith('hiddenpower')) {
					if (hasHiddenPower) {
						continue;
					}
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}

			counter = this.queryMoves(moves, species.types, abilities, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);

				let {cull, isSetup} = this.shouldCullMove(
					move, types, moves, abilities, counter, movePool,
					teamDetails, species, isLead
				);

				// This move doesn't satisfy our setup requirements:
				if (
					(move.category === 'Physical' && counter.setupType === 'Special') ||
					(move.category === 'Special' && counter.setupType === 'Physical')
				) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter.get(species.types[0]) + (counter.get(species.types[1]) || 0);
					if (!types.has(move.type) || stabs > 1 || counter.get(move.category) < 2) cull = true;
				}
				if (
					!isSetup &&
					counter.setupType &&
					counter.setupType !== 'Mixed' &&
					move.category !== counter.setupType &&
					counter.get(counter.setupType) < 2 &&
					(move.category !== 'Status' || !move.flags.heal) &&
					moveid !== 'sleeptalk' && (
						move.category !== 'Status' || (
							counter.get(counter.setupType) + counter.get('Status') > 3 &&
							counter.get('physicalsetup') + counter.get('specialsetup') < 2
						)
					)
				) {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					cull = true;
				}

				if (
					counter.setupType === 'Special' &&
					moveid === 'hiddenpower' &&
					species.types.length > 1 &&
					counter.get('Special') <= 2 &&
					!types.has(move.type) &&
					!counter.get('Physical') &&
					counter.get('specialpool')
				) {
					// Hidden Power isn't good enough
					cull = true;
				}

				const runEnforcementChecker = (checkerName: string) => {
					if (!this.moveEnforcementCheckers[checkerName]) return false;
					return this.moveEnforcementCheckers[checkerName](
						movePool, moves, abilities, types, counter, species as Species, teamDetails
					);
				};
				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				if (
					!cull &&
					!['judgment', 'lightscreen', 'quiverdance', 'reflect', 'sleeptalk'].includes(moveid) &&
					!isSetup && !move.weather && !move.damage && (move.category !== 'Status' || !move.flags.heal) && (
						move.category === 'Status' ||
						!types.has(move.type) ||
						move.basePower && move.basePower < 40 && !move.multihit
					) && (counter.get('physicalsetup') + counter.get('specialsetup') < 2 && (
						!counter.setupType ||
						counter.setupType === 'Mixed' ||
						(move.category !== counter.setupType && move.category !== 'Status') ||
						counter.get(counter.setupType) + counter.get('Status') > 3
					))
				) {
					if (
						(
							!counter.get('stab') &&
							!counter.get('damage') && (
								species.types.length > 1 ||
								(species.types[0] !== 'Normal' && species.types[0] !== 'Psychic') ||
								!moves.has('icebeam') ||
								species.baseStats.spa >= species.baseStats.spd
							)
						) || (
							!counter.get('recovery') &&
							!counter.setupType &&
							['healingwish', 'trick', 'trickroom'].every(m => !moves.has(m)) &&
							!abilities.has('Poison Heal') &&
							(counter.get('Status') || (species.nfe && !!counter.get('Status'))) &&
							(['recover', 'roost', 'slackoff', 'softboiled'].some(m => movePool.includes(m)))
						) || (
							(movePool.includes('moonlight') && types.size < 2 && !moves.has('trickroom')) ||
							movePool.includes('darkvoid') ||
							movePool.includes('milkdrink') ||
							movePool.includes('quiverdance') ||
							(species.requiredMove && movePool.includes(toID(species.requiredMove)))
						) || (
							isLead && runEnforcementChecker('lead')
						)
					) {
						cull = true;
					} else {
						for (const type of types) {
							if (runEnforcementChecker(type)) {
								cull = true;
							}
						}
						for (const abil of abilities) {
							if (runEnforcementChecker(abil)) {
								cull = true;
							}
						}
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && cull) {
					const sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							cull = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				const isHP = moveid.startsWith('hiddenpower');
				if (
					cull &&
					(movePool.length - availableHP || availableHP && (isHP || !hasHiddenPower))
				) {
					if (
						move.category !== 'Status' && !move.damage && !move.flags.charge &&
						(!isHP || !availableHP)
					) rejectedPool.push(moveid);
					moves.delete(moveid);
					if (isHP) hasHiddenPower = false;
					break;
				}
				if (cull && rejectedPool.length) {
					moves.delete(moveid);
					if (moveid.startsWith('hiddenpower')) hasHiddenPower = false;
					break;
				}
			}
		} while (moves.size < this.maxMoveCount && (movePool.length || rejectedPool.length));

		if (hasHiddenPower) {
			let hpType;
			for (const move of moves) {
				if (move.startsWith('hiddenpower')) hpType = move.substr(11);
			}
			if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
			const HPivs = this.dex.types.get(hpType).HPivs;
			let iv: StatID;
			for (iv in HPivs) {
				ivs[iv] = HPivs[iv];
			}
		}

		ability = this.getAbility(types, moves, abilities, counter, movePool, teamDetails, species);

		let item = this.getHighPriorityItem(ability, types, moves, counter, teamDetails, species, isLead);
		if (item === undefined) {
			item = this.getLowPriorityItem(ability, types, moves, abilities, counter, teamDetails, species, isLead);
		}
		if (item === undefined) item = 'Leftovers';
		if (item === 'Leftovers' && types.has('Poison')) {
			item = 'Black Sludge';
		}

		const level = this.adjustLevel || data.level || (species.nfe ? 90 : 80);

		// Prepare optimal HP
		const srWeakness = this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(
				Math.floor(
					2 * species.baseStats.hp + (ivs.hp || 31) + Math.floor(evs.hp / 4) + 100
				) * level / 100 + 10
			);
			if (moves.has('bellydrum') && item === 'Sitrus Berry') {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('transform')) {
			evs.atk = 0;
			ivs.atk = hasHiddenPower ? (ivs.atk || 31) - 28 : 0;
		}

		if (['gyroball', 'metalburst', 'trickroom'].some(m => moves.has(m))) {
			evs.spe = 0;
			ivs.spe = hasHiddenPower ? (ivs.spe || 31) - 28 : 0;
		}

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			moves: Array.from(moves),
			ability,
			evs,
			ivs,
			item,
			level,
		};
	}

	randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.seed;
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		const baseFormes: {[k: string]: number} = {};
		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const typeWeaknesses: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, Object.keys(this.randomData));
		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			const currentSpeciesPool: Species[] = [];
			for (const poke of pokemonPool) {
				const species = this.dex.species.get(poke);
				if (species.baseSpecies === baseSpecies) currentSpeciesPool.push(species);
			}
			const species = this.sample(currentSpeciesPool);
			if (!species.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Illusion shouldn't be in the last slot
			if (species.name === 'Zoroark' && pokemon.length > 4) continue;

			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;
			const tier = species.tier;

			// Limit two Pokemon per tier
			if (this.gen === 5 && !isMonotype && !this.forceMonotype && tierCount[tier] >= 2 * limitFactor) continue;

			const set = this.randomSet(species, teamDetails, pokemon.length === 0);

			const types = species.types;
			let typeCombo = types.slice().sort().join();

			if (!isMonotype && !this.forceMonotype) {
				// Limit two of any type
				let skip = false;
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit three weak to any type
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0) {
						if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
						if (typeWeaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Limit one of any type combination
				if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
					// Drought, Drizzle and Sand Stream don't count towards the type combo limit
					typeCombo = set.ability;
					if (typeCombo in typeComboCount) continue;
				} else {
					if (typeComboCount[typeCombo] >= 1 * limitFactor) continue;
				}
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === this.maxTeamSize) {
				// Set Zoroark's level to be the same as the last Pokemon
				const illusion = teamDetails.illusion;
				if (illusion) pokemon[illusion - 1].level = pokemon[this.maxTeamSize - 1].level;
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment tier counter
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

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
			}

			// Team details
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails.hail = 1;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails.illusion = pokemon.length;
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}
}

export default RandomGen5Teams;
