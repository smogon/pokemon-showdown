/**
 * Teams
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Will be documented in TEAMS.md
 *
 * @license MIT
 */

import {Dex, toID} from './dex';
import type {PRNG, PRNGSeed} from './prng';

export interface PokemonSet {
	/**
	 * Nickname. Should be identical to its base species if not specified
	 * by the player, e.g. "Minior".
	 */
	name: string;
	/**
	 * Species name (including forme if applicable), e.g. "Minior-Red".
	 * This should always be converted to an id before use.
	 */
	species: string;
	/**
	 * This can be an id, e.g. "whiteherb" or a full name, e.g. "White Herb".
	 * This should always be converted to an id before use.
	 */
	item: string;
	/**
	 * This can be an id, e.g. "shieldsdown" or a full name,
	 * e.g. "Shields Down".
	 * This should always be converted to an id before use.
	 */
	ability: string;
	/**
	 * Each move can be an id, e.g. "shellsmash" or a full name,
	 * e.g. "Shell Smash"
	 * These should always be converted to ids before use.
	 */
	moves: string[];
	/**
	 * This can be an id, e.g. "adamant" or a full name, e.g. "Adamant".
	 * This should always be converted to an id before use.
	 */
	nature: string;
	gender: string;
	/**
	 * Effort Values, used in stat calculation.
	 * These must be between 0 and 255, inclusive.
	 * 
	 * Also used to store AVs for Let's Go
	 */
	evs: StatsTable;
	/**
	 * Individual Values, used in stat calculation.
	 * These must be between 0 and 31, inclusive.
	 *
	 * These are also used as DVs, or determinant values, in Gens
	 * 1 and 2, which are represented as even numbers from 0 to 30.
	 *
	 * In Gen 2-6, these must match the Hidden Power type.
	 *
	 * In Gen 7+, Bottle Caps means these can either match the
	 * Hidden Power type or 31.
	 */
	ivs: StatsTable;
	/**
	 * This is usually between 1 and 100, inclusive,
	 * but the simulator supports levels up to 9999 for testing purposes.
	 */
	level: number;
	/**
	 * While having no direct competitive effect, certain Pokemon cannot
	 * be legally obtained as shiny, either as a whole or with certain
	 * event-only abilities or moves.
	 */
	shiny?: boolean;
	/**
	 * This is technically "Friendship", but the community calls this
	 * "Happiness".
	 *
	 * It's used to calculate the power of the moves Return and Frustration.
	 * This value must be between 0 and 255, inclusive.
	 */
	happiness?: number;
	/**
	 * The pokeball this Pokemon is in. Like shininess, this property
	 * has no direct competitive effects, but has implications for
	 * event legality. For example, any Rayquaza that knows V-Create
	 * must be sent out from a Cherish Ball.
	 *
	 * TODO: actually support this in the validator, switching animations,
	 * and the teambuilder.
	 */
	pokeball?: string;
	/**
	 * Hidden Power type. Optional in older gens, but used in Gen 7+
	 * because `ivs` contain post-Battle-Cap values.
	 */
	hpType?: string;
	gigantamax?: boolean;
}

export const Teams = new class {
	pack(team: PokemonSet[] | null): string {
		if (!team) return '';

		function getIv(ivs: StatsTable, s: keyof StatsTable): string {
			return ivs[s] === 31 || ivs[s] === undefined ? '' : ivs[s].toString();
		}

		let buf = '';
		for (const set of team) {
			if (buf) buf += ']';

			// name
			buf += (set.name || set.species);

			// species
			const id = toID(set.species || set.name);
			buf += '|' + (toID(set.name || set.species) === id ? '' : id);

			// item
			buf += '|' + toID(set.item);

			// ability
			buf += '|' + toID(set.ability);

			// moves
			buf += '|' + set.moves.map(toID).join(',');

			// nature
			buf += '|' + (set.nature || '');

			// evs
			let evs = '|';
			if (set.evs) {
				evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
			}
			if (evs === '|,,,,,') {
				buf += '|';
			} else {
				buf += evs;
			}

			// gender
			if (set.gender) {
				buf += '|' + set.gender;
			} else {
				buf += '|';
			}

			// ivs
			let ivs = '|';
			if (set.ivs) {
				ivs = '|' + getIv(set.ivs, 'hp') + ',' + getIv(set.ivs, 'atk') + ',' + getIv(set.ivs, 'def') +
					',' + getIv(set.ivs, 'spa') + ',' + getIv(set.ivs, 'spd') + ',' + getIv(set.ivs, 'spe');
			}
			if (ivs === '|,,,,,') {
				buf += '|';
			} else {
				buf += ivs;
			}

			// shiny
			if (set.shiny) {
				buf += '|S';
			} else {
				buf += '|';
			}

			// level
			if (set.level && set.level !== 100) {
				buf += '|' + set.level;
			} else {
				buf += '|';
			}

			// happiness
			if (set.happiness !== undefined && set.happiness !== 255) {
				buf += '|' + set.happiness;
			} else {
				buf += '|';
			}

			if (set.pokeball || set.hpType || set.gigantamax) {
				buf += ',' + (set.hpType || '');
				buf += ',' + toID(set.pokeball || '');
				buf += ',' + (set.gigantamax ? 'G' : '');
			}
		}

		return buf;
	}

	fastUnpack(buf: string): PokemonSet[] | null {
		if (!buf) return null;
		if (typeof buf !== 'string') return buf;
		if (buf.startsWith('[') && buf.endsWith(']')) {
			buf = this.pack(JSON.parse(buf));
		}

		const team = [];
		let i = 0;
		let j = 0;

		// limit to 24
		for (let count = 0; count < 24; count++) {
			const set: PokemonSet = {} as PokemonSet;
			team.push(set);

			// name
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.name = buf.substring(i, j);
			i = j + 1;

			// species
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.species = buf.substring(i, j) || set.name;
			i = j + 1;

			// item
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.item = buf.substring(i, j);
			i = j + 1;

			// ability
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			const ability = buf.substring(i, j);
			const species = Dex.species.get(set.species);
			set.ability = ['', '0', '1', 'H', 'S'].includes(ability) ?
				species.abilities[ability as '0' || '0'] || (ability === '' ? '' : '!!!ERROR!!!') :
				ability;
			i = j + 1;

			// moves
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.moves = buf.substring(i, j).split(',', 24).filter(x => x);
			i = j + 1;

			// nature
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.nature = buf.substring(i, j);
			i = j + 1;

			// evs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const evs = buf.substring(i, j).split(',', 6);
				set.evs = {
					hp: Number(evs[0]) || 0,
					atk: Number(evs[1]) || 0,
					def: Number(evs[2]) || 0,
					spa: Number(evs[3]) || 0,
					spd: Number(evs[4]) || 0,
					spe: Number(evs[5]) || 0,
				};
			}
			i = j + 1;

			// gender
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;

			// ivs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const ivs = buf.substring(i, j).split(',', 6);
				set.ivs = {
					hp: ivs[0] === '' ? 31 : Number(ivs[0]) || 0,
					atk: ivs[1] === '' ? 31 : Number(ivs[1]) || 0,
					def: ivs[2] === '' ? 31 : Number(ivs[2]) || 0,
					spa: ivs[3] === '' ? 31 : Number(ivs[3]) || 0,
					spd: ivs[4] === '' ? 31 : Number(ivs[4]) || 0,
					spe: ivs[5] === '' ? 31 : Number(ivs[5]) || 0,
				};
			}
			i = j + 1;

			// shiny
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.shiny = true;
			i = j + 1;

			// level
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.level = parseInt(buf.substring(i, j));
			i = j + 1;

			// happiness
			j = buf.indexOf(']', i);
			let misc;
			if (j < 0) {
				if (i < buf.length) misc = buf.substring(i).split(',', 4);
			} else {
				if (i !== j) misc = buf.substring(i, j).split(',', 4);
			}
			if (misc) {
				set.happiness = (misc[0] ? Number(misc[0]) : 255);
				set.hpType = misc[1] || '';
				set.pokeball = toID(misc[2] || '');
				set.gigantamax = !!misc[3];
			}
			if (j < 0) break;
			i = j + 1;
		}

		return team;
	}

	/**
	 * Exports a team in human-readable PS export format
	 */
	export(team: PokemonSet[], nicknames?: string[], hideStats?: boolean) {
		let output = '';
		for (const [i, mon] of team.entries()) {
			const species = Dex.species.get(mon.species);
			const nickname = nicknames?.[i];
			output += nickname && nickname !== species.baseSpecies ? `${nickname} (${species.name})` : species.name;
			output += mon.item ? ` @ ${Dex.items.get(mon.item).name}\n` : `\n`;
			output += `Ability: ${Dex.abilities.get(mon.ability).name}\n`;
			if (typeof mon.happiness === 'number' && mon.happiness !== 255) output += `Happiness: ${mon.happiness}\n`;
			if (mon.gigantamax) output += `Gigantamax: Yes\n`;
			if (!hideStats) {
				const evs = [];
				let stat: StatID;
				for (stat in mon.evs) {
					if (mon.evs[stat]) evs.push(`${mon.evs[stat]} ${Dex.stats.shortNames[stat]}`);
				}
				if (evs.length) output += `EVs: ${evs.join(' / ')}\n`;
				if (mon.nature) output += `${Dex.natures.get(mon.nature).name} Nature\n`;
				const ivs = [];
				for (stat in mon.ivs) {
					if (mon.ivs[stat] !== 31) ivs.push(`${mon.ivs[stat]} ${Dex.stats.shortNames[stat]}`);
				}
				if (ivs.length) output += `IVs: ${ivs.join(' / ')}\n`;
			}
			output += mon.moves.map(move => `- ${Dex.moves.get(move).name}\n`).join('');
			output += '\n';
		}
		return output;
	}

	getGenerator(format: Format | string, seed: PRNG | PRNGSeed | null = null) {
		const TeamGenerator = require(Dex.forFormat(format).dataDir + '/random-teams').default;
		return new TeamGenerator(format, seed);
	}

	generate(format: Format | string, options: PlayerOptions | null = null): PokemonSet[] {
		return this.getGenerator(format, options?.seed).getTeam(options);
	}
};

export default Teams;
