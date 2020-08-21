import Dex from './dex';

/**
 * Guaranteed to be filled out
 */
interface PokemonSet {
	/** Defaults to species name (not including forme), like in games */
	name: string;
	species: string;
	/** Defaults to no item */
	item: string;
	/** Defaults to no ability (error in Gen 3+) */
	ability: string;
	moves: string[];
	/** Defaults to no nature (error in Gen 3+) */
	nature: NatureName;
	/** Defaults to random legal gender, NOT subject to gender ratios */
	gender: string;
	/** Defaults to flat 252's (200's/0's in Let's Go) (error in gen 3+) */
	evs: StatsTable;
	/** Defaults to whatever makes sense - flat 31's unless you have Gyro Ball etc */
	ivs: StatsTable;
	/** Defaults as you'd expect (100 normally, 50 in VGC-likes, 5 in LC) */
	level: number;
	/** Defaults to no (error if shiny event) */
	shiny?: boolean;
	/** Defaults to 255 unless you have Frustration, in which case 0 */
	happiness?: number;
	/** Defaults to event required ball, otherwise Poké Ball */
	pokeball?: string;
	/** Defaults to the type of your Hidden Power in Moves, otherwise Dark */
	hpType?: string;
	/** Defaults to no (can only be yes for certain Pokemon) */
	gigantamax?: boolean;
}

export const Teams = new class {
	packTeam(team: PokemonSet[] | null): string {
		if (!team) return '';

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
			const getIv = (ivs: StatsTable, s: keyof StatsTable): string => {
				return ivs[s] === 31 || ivs[s] === undefined ? '' : ivs[s].toString();
			};
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
				buf += ',' + set.hpType;
				buf += ',' + toID(set.pokeball);
				buf += ',' + (set.gigantamax ? 'G' : '');
			}
		}

		return buf;
	}

	fastUnpackTeam(buf: string): PokemonSet[] | null {
		if (!buf) return null;
		if (typeof buf !== 'string') return buf;
		if (buf.charAt(0) === '[' && buf.charAt(buf.length - 1) === ']') {
			buf = this.packTeam(JSON.parse(buf));
		}

		const team = [];
		let i = 0;
		let j = 0;

		// limit to 24
		for (let count = 0; count < 24; count++) {
			// tslint:disable-next-line:no-object-literal-type-assertion
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
			const species = Dex.getSpecies(set.species);
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
				set.hpType = misc[1];
				set.pokeball = misc[2];
				set.gigantamax = !!misc[3];
			}
			if (j < 0) break;
			i = j + 1;
		}

		return team;
	}
	static unpackTeam(buf: string) {
		if (!buf) return [];

		let team: PokemonSet[] = [];

		for (const setBuf of buf.split(`]`)) {
			const parts = setBuf.split(`|`);
			if (parts.length < 11) continue;
			// tslint:disable-next-line:no-object-literal-type-assertion
			let set: PokemonSet = {species: '', moves: []} as PokemonSet;
			team.push(set);

			// name
			set.name = parts[0];

			// species
			set.species = Dex.getSpecies(parts[1]).name || set.name;

			// item
			set.item = Dex.getItem(parts[2]).name;

			// ability
			const species = Dex.getSpecies(set.species);
			set.ability = parts[3] === '-' ?
				'' :
				(species.baseSpecies === 'Zygarde' && parts[3] === 'H') ?
				'Power Construct' :
				['', '0', '1', 'H', 'S'].includes(parts[3]) ?
				species.abilities[parts[3] as '0' || '0'] || (parts[3] === '' ? '' : '!!!ERROR!!!') :
				Dex.getAbility(parts[3]).name;

			// moves
			set.moves = parts[4].split(',').map(moveid =>
				Dex.getMove(moveid).name
			);

			// nature
			set.nature = parts[5] as NatureName;
			if (set.nature as any === 'undefined') set.nature = undefined;

			// evs
			if (parts[6]) {
				if (parts[6].length > 5) {
					const evs = parts[6].split(',');
					set.evs = {
						hp: Number(evs[0]) || 0,
						atk: Number(evs[1]) || 0,
						def: Number(evs[2]) || 0,
						spa: Number(evs[3]) || 0,
						spd: Number(evs[4]) || 0,
						spe: Number(evs[5]) || 0,
					};
				} else if (parts[6] === '0') {
					set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
				}
			}

			// gender
			if (parts[7]) set.gender = parts[7];

			// ivs
			if (parts[8]) {
				const ivs = parts[8].split(',');
				set.ivs = {
					hp: ivs[0] === '' ? 31 : Number(ivs[0]),
					atk: ivs[1] === '' ? 31 : Number(ivs[1]),
					def: ivs[2] === '' ? 31 : Number(ivs[2]),
					spa: ivs[3] === '' ? 31 : Number(ivs[3]),
					spd: ivs[4] === '' ? 31 : Number(ivs[4]),
					spe: ivs[5] === '' ? 31 : Number(ivs[5]),
				};
			}

			// shiny
			if (parts[9]) set.shiny = true;

			// level
			if (parts[10]) set.level = parseInt(parts[9], 10);

			// happiness
			if (parts[11]) {
				let misc = parts[11].split(',', 4);
				set.happiness = (misc[0] ? Number(misc[0]) : undefined);
				set.hpType = misc[1];
				set.pokeball = misc[2];
				set.gigantamax = !!misc[3];
			}
		}

		return team;
	}

	/**
	 * (Exports end with two spaces so linebreaks are preserved in Markdown;
	 * I assume mostly for Reddit.)
	 */
	exportSet(set: PokemonSet) {
		let text = '';

		// core
		if (set.name && set.name !== set.species) {
			text += `${set.name} (${set.species})`;
		} else {
			text += `${set.species}`;
		}
		if (set.gender === 'M') text += ` (M)`;
		if (set.gender === 'F') text += ` (F)`;
		if (set.item) {
			text += ` @ ${set.item}`;
		}
		text += `  \n`;
		if (set.ability) {
			text += `Ability: ${set.ability}  \n`;
		}
		if (set.moves) {
			for (let move of set.moves) {
				if (move.substr(0, 13) === 'Hidden Power ') {
					const hpType = move.slice(13);
					move = move.slice(0, 13);
					move = `${move}[${hpType}]`;
				}
				if (move) {
					text += `- ${move}  \n`;
				}
			}
		}

		// stats
		let first = true;
		if (set.evs) {
			for (const stat of Dex.statNames) {
				if (!set.evs[stat]) continue;
				if (first) {
					text += `EVs: `;
					first = false;
				} else {
					text += ` / `;
				}
				text += `${set.evs[stat]} ${BattleStatNames[stat]}`;
			}
		}
		if (!first) {
			text += `  \n`;
		}
		if (set.nature) {
			text += `${set.nature} Nature  \n`;
		}
		first = true;
		if (set.ivs) {
			for (const stat of Dex.statNames) {
				if (set.ivs[stat] === undefined || isNaN(set.ivs[stat]) || set.ivs[stat] === 31) continue;
				if (first) {
					text += `IVs: `;
					first = false;
				} else {
					text += ` / `;
				}
				text += `${set.ivs[stat]} ${BattleStatNames[stat]}`;
			}
		}
		if (!first) {
			text += `  \n`;
		}

		// details
		if (set.level && set.level !== 100) {
			text += `Level: ${set.level}  \n`;
		}
		if (set.shiny) {
			text += `Shiny: Yes  \n`;
		}
		if (typeof set.happiness === 'number' && set.happiness !== 255 && !isNaN(set.happiness)) {
			text += `Happiness: ${set.happiness}  \n`;
		}
		if (set.gigantamax) {
			text += `Gigantamax: Yes  \n`;
		}

		text += `\n`;
		return text;
	}
	exportTeam(sets: PokemonSet[]) {
		let text = '';
		for (const set of sets) {
			// core
			text += this.exportSet(set);
		}
		return text;
	}
	splitPrefix(buffer: string, delimiter: string, prefixOffset = 0): [string, string] {
		const delimIndex = buffer.indexOf(delimiter);
		if (delimIndex < 0) return ['', buffer];
		return [buffer.slice(prefixOffset, delimIndex), buffer.slice(delimIndex + delimiter.length)];
	}
	splitLast(buffer: string, delimiter: string): [string, string] {
		const delimIndex = buffer.lastIndexOf(delimiter);
		if (delimIndex < 0) return [buffer, ''];
		return [buffer.slice(0, delimIndex), buffer.slice(delimIndex + delimiter.length)];
	}
	parseExportedTeamLine(line: string, isFirstLine: boolean, set: PokemonSet) {
		if (isFirstLine) {
			let item;
			[line, item] = line.split(' @ ');
			if (item) {
				set.item = item;
				if (toID(set.item) === 'noitem') set.item = '';
			}
			if (line.endsWith(' (M)')) {
				set.gender = 'M';
				line = line.slice(0, -4);
			}
			if (line.endsWith(' (F)')) {
				set.gender = 'F';
				line = line.slice(0, -4);
			}
			let parenIndex = line.lastIndexOf(' (');
			if (line.charAt(line.length - 1) === ')' && parenIndex !== -1) {
				set.species = Dex.getSpecies(line.slice(parenIndex + 2, -1)).name;
				set.name = line.slice(0, parenIndex);
			} else {
				set.species = Dex.getSpecies(line).name;
				set.name = '';
			}
		} else if (line.startsWith('Trait: ')) {
			line = line.slice(7);
			set.ability = line;
		} else if (line.startsWith('Ability: ')) {
			line = line.slice(9);
			set.ability = line;
		} else if (line === 'Shiny: Yes') {
			set.shiny = true;
		} else if (line.startsWith('Level: ')) {
			line = line.slice(7);
			set.level = +line;
		} else if (line.startsWith('Happiness: ')) {
			line = line.slice(11);
			set.happiness = +line;
		} else if (line.startsWith('Pokeball: ')) {
			line = line.slice(10);
			set.pokeball = line;
		} else if (line.startsWith('Hidden Power: ')) {
			line = line.slice(14);
			set.hpType = line;
		} else if (line === 'Gigantamax: Yes') {
			set.gigantamax = true;
		} else if (line.startsWith('EVs: ')) {
			line = line.slice(5);
			let evLines = line.split('/');
			set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			for (let evLine of evLines) {
				evLine = evLine.trim();
				let spaceIndex = evLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				let statid = BattleStatIDs[evLine.slice(spaceIndex + 1)];
				if (!statid) continue;
				let statval = parseInt(evLine.slice(0, spaceIndex), 10);
				set.evs[statid] = statval;
			}
		} else if (line.startsWith('IVs: ')) {
			line = line.slice(5);
			let ivLines = line.split(' / ');
			set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			for (let ivLine of ivLines) {
				ivLine = ivLine.trim();
				let spaceIndex = ivLine.indexOf(' ');
				if (spaceIndex === -1) continue;
				let statid = BattleStatIDs[ivLine.slice(spaceIndex + 1)];
				if (!statid) continue;
				let statval = parseInt(ivLine.slice(0, spaceIndex), 10);
				if (isNaN(statval)) statval = 31;
				set.ivs[statid] = statval;
			}
		} else if (line.match(/^[A-Za-z]+ (N|n)ature/)) {
			let natureIndex = line.indexOf(' Nature');
			if (natureIndex === -1) natureIndex = line.indexOf(' nature');
			if (natureIndex === -1) return;
			line = line.substr(0, natureIndex);
			if (line !== 'undefined') set.nature = line as NatureName;
		} else if (line.charAt(0) === '-' || line.charAt(0) === '~') {
			line = line.slice(line.charAt(1) === ' ' ? 2 : 1);
			if (line.startsWith('Hidden Power [')) {
				const hpType = line.slice(14, -1) as TypeName;
				line = 'Hidden Power ' + hpType;
				if (!set.ivs && window.BattleTypeChart && window.BattleTypeChart[hpType]) {
					set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
					const hpIVs = Dex.getType(hpType).HPivs || {};
					for (let stat in hpIVs) {
						set.ivs[stat as StatName] = hpIVs[stat as StatName]!;
					}
				}
			}
			if (line === 'Frustration' && set.happiness === undefined) {
				set.happiness = 0;
			}
			set.moves.push(line);
		}
	}
	importTeam(buffer: string): PokemonSet[] {
		const lines = buffer.split("\n");

		const sets: PokemonSet[] = [];
		let curSet: PokemonSet | null = null;

		while (lines.length && !lines[0]) lines.shift();
		while (lines.length && !lines[lines.length - 1]) lines.pop();

		if (lines.length === 1 && lines[0].includes('|')) {
			return this.unpackTeam(lines[0]);
		}
		for (let line of lines) {
			line = line.trim();
			if (line === '' || line === '---') {
				curSet = null;
			} else if (line.startsWith('===')) {
				// team backup format; ignore
			} else if (line.includes('|')) {
				// packed format
				const team = PS.teams.unpackLine(line);
				if (!team) continue;
				return this.unpackTeam(team.packedTeam);
			} else if (!curSet) {
				curSet = {
					name: '', species: '', gender: '',
					moves: [],
				};
				sets.push(curSet);
				this.parseExportedTeamLine(line, true, curSet);
			} else {
				this.parseExportedTeamLine(line, false, curSet);
			}
		}
		return sets;
	}

	packedTeamNames(buf: string) {
		if (!buf) return [];

		const team = [];
		let i = 0;

		while (true) {
			const name = buf.slice(i, buf.indexOf('|', i));
			i = buf.indexOf('|', i) + 1;

			team.push(buf.slice(i, buf.indexOf('|', i)) || name);

			for (let k = 0; k < 9; k++) {
				i = buf.indexOf('|', i) + 1;
			}

			i = buf.indexOf(']', i) + 1;

			if (i < 1) break;
		}

		return team;
	}
};
