// Thank goodness for this, no need to manually update each time anymore.
import {ssbSets} from '../../data/mods/gen9ssb/random-teams';
import {Utils} from '../../lib';
import {FS} from '../../lib/fs';
import {RoomSections} from '../chat-commands/room-settings';
const dex = Dex.mod('gen9ssb');
const STAT_FORMAT = {hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
// Similar to User.usergroups, but is a custom group from a custom csv file
// You will need to get a copy from the main server when you update, or introduce some sort of hard coded change.
const usergroups: {[userid: string]: string} = {};
const usergroupData = FS('config/usergroups-main.csv').readIfExistsSync().split('\n');
for (const row of usergroupData) {
	if (!toID(row)) continue;
	const cells = row.split(',');
	usergroups[toID(cells[0])] = cells[1].trim() || ' ';
}
function getPosition(name: string): string {
	// Special checks first
	const id = toID(name);
	const ssbContribs: string[] = ['ausma', 'blitz', 'hizo', 'violet'];
	if (id === 'artemis') {
		return `Server Automatic Moderation`;
	}
	if (ssbContribs.includes(id)) return `Super Staff Bros Contributor`;
	// Override + -> public RO for retired staff.
	const retiredStaff: string[] = [
		'kennedy', 'billo', 'breadstycks', 'chloe', 'clerica', 'coolcodename', 'corthius',
		'dawnofartemis', 'frostyicelad', 'ganjafin', 'inthehills', 'j0rdy004', 'kolohe',
		'peary', 'phoopes', 'pissog', 'returntomonkey', 'skies', 'swiffix'];
	if (retiredStaff.includes(id)) return `Retired Staff`;
	let group = usergroups[id] || ' ';
	if (id === 'artemis') group = '@';
	const sectionid = Users.globalAuth.sectionLeaders.get(id);
	let section = '';
	if (sectionid && group === '§') {
		section = RoomSections.sectionNames[sectionid];
		return `${Utils.escapeHTML(section.split(' ').map((x: string) => x[0].toUpperCase() + x.substr(1)).join(' '))} Section Leader`;
	}
	const symbolToGroup: {[group: string]: string} = {
		' ': `Retired Staff`,
		'+': `Public Room Owner`,
		'%': `Global Driver`,
		'@': 'Global Moderator',
		'&': 'Global Administrator',
	};
	if (!symbolToGroup[group]) throw new Error(`Unable to find group ${group} in supported groups for user ${name}.`);
	return symbolToGroup[group];
}
function canMegaEvo(species: string, item: string | string[]): string {
	// Meanwhile, these pokemon can mega evolve though strange conditions not easily detected.
	// Its best to hardcode this, even though id rather avoid that.
	const forceMega: {[species: string]: string} = {
		'rayquaza': 'rayquaza-mega',
		'cinderace': 'cinderace-gmax',
	};
	if (toID(species) in forceMega) {
		return forceMega[toID(species)];
	} else {
		if (!Array.isArray(item)) item = [item];
		for (const i of item) {
			const itemObj = dex.items.get(i);
			if (toID(species) === toID(itemObj.megaEvolves) && itemObj.megaStone) {
				return itemObj.megaStone.toLowerCase();
			}
		}
	}
	return ``;
}
function speciesToImageUrl(
	species: string, item: string | string[] | undefined,
	shiny: boolean, anim: boolean
): string {
	// Just the URL
	// These don't have models yet, use the BW sprites in all cases
	const forceBW = [
		'fluttermane', 'sinistchamasterpiece', 'chiyu', 'dachsbun', 'ironjugulis', 'ceruledge', 'qwilfishhisui', 'pichuspikyeared', 'flamigo', 'cinderace', 'archaludon', 'tatsugiri', 'kingambit', 'hemogoblin', 'ogerpon', 'clodsire',
	];
	// Hardcoded speical cases, avoid using usually.
	const override: {[species: string]: string} = {
		'Alcremie-Lemon-Cream': 'alcremie-lemoncream',
		'Alcremie-Ruby-Swirl': 'alcremie-rubyswirl',
		'Alcremie-Mint-Cream': 'alcremie-mintcream',
		'Flygon': 'flygon',
		'Ralts': 'ralts',
	};
	const s = shiny ? `-shiny` : '';
	const base = anim && !forceBW.includes(toID(species)) ? `ani` : `bw`;
	const type = anim && !forceBW.includes(toID(species)) ? `.gif` : `.png`;
	const imageBase = `//play.pokemonshowdown.com/sprites/${base}${s}/`;
	let isMega = item ? canMegaEvo(species, item) : '';
	if (isMega) isMega = isMega.slice(isMega.indexOf('-'));
	let spriteId = '';
	if (override[species]) {
		spriteId = override[species];
	} else {
		spriteId = dex.species.get(species + isMega).spriteid;
	}
	return `${imageBase}${spriteId}${type}`;
}
function genItemHTML(item: string | string[]): string {
	// All of the HTML because a set can have mutliple possible items
	const zTable: {[type: string]: string} = {
		bug: 'buginium_z',
		dark: 'darkinium_z',
		dragon: 'dragonium_z',
		electric: 'electrium_z',
		fairy: 'fairium_z',
		fighting: 'fightinium_z',
		fire: 'firium_z',
		flying: 'flyinium_z',
		ghost: 'ghostium_z',
		grass: 'grassium_z',
		ground: 'groundium_z',
		ice: 'icium_z',
		normal: 'normalium_z',
		poison: 'poisonium_z',
		psychic: 'psychium_z',
		rock: 'rockium_z',
		steel: 'steelium_z',
		water: 'waterium_z',
		'': 'normalium_z',
	};
	if (!Array.isArray(item)) {
		item = [item];
	}
	item = item.slice();
	let html = ``;
	for (const i of item) {
		if (!i) {
			html = ``;
			continue;
		}
		let sprite = i;
		const spriteid = toID(sprite);
		if (spriteid === 'leek') sprite = 'stick';
		if (spriteid === 'lilligantiumz') sprite = 'waterium_z';
		if (spriteid === 'irpatuziniumz') sprite = 'fairium_z';
		if (spriteid === 'pearyumz') sprite = 'steelium_z';
		if (spriteid === 'rainiumz') sprite = 'primarium_z';
		if (!Dex.items.get(sprite).exists && dex.items.get(sprite).zMove) {
			const move = dex.items.get(sprite).zMove;
			if (move === true) throw new Error(`Unexpected true for ${sprite}.`);
			sprite = zTable[toID(dex.moves.get(move).type)];
		}
		let url = `/dex/media/sprites/xyitems/${sprite = sprite.toLowerCase().replace(/ /g, '_').replace(/'/g, '')}.png`;
		let width;
		let height;
		if (spriteid === 'boosterenergy') {
			url = `/articles/images/sprites/booster_energy.png`;
			width = height = 32;
		}
		if (spriteid === 'covertcloak') {
			url = `/articles/images/sprites/covert_cloak.png`;
			width = height = 32;
		}
		if (spriteid === 'clearamulet') {
			url = `/articles/images/sprites/clear_amulet.png`;
			width = height = 32;
		}
		if (spriteid === 'griseouscore') {
			url = `/articles/images/sprites/griseous_core.png`;
			width = height = 32;
		}
		if (spriteid === 'mirrorherb') {
			url = `/articles/images/sprites/mirror_herb.png`;
			width = height = 32;
		}
		if (spriteid === 'loadeddice') {
			url = `/articles/images/sprites/loaded_dice.png`;
			width = height = 32;
		}
		if (spriteid === 'flygonite') {
			url = `//play.pokemonshowdown.com/sprites/itemicons/dream-ball.png`;
		}
		html += `<img src="${url}"${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''} alt="${i}"/> `;
	}
	return html;
}
function parseNature(nature: string | string[] | undefined) {
	// too many options to cleanly parse, do it here.
	if (!nature) return `Serious Nature`;
	if (Array.isArray(nature)) return nature.map(n => `${n} Nature`).join(' / ');
	return `${nature} Nature`;
}
// innates are stored in each condition if applicable
function getClassName(name: string): string {
	name = toID(name);
	while (!isNaN(parseInt(name.charAt(0)))) {
		name = name.slice(1);
	}
	return name;
}
function genSetHeader(name: string): string {
	// Generates the header for each set
	return `<div class="fighterInfo hidden" id="${getClassName(name)}">\n\t<h3 class="header">${Utils.escapeHTML(name)} - ${getPosition(name)}</h3>\n`;
}
function genSetBody(name: string): string {
	// Generates the body of a set and all of its alts
	const setAlts: string[] = [];
	const userid = toID(name);
	for (const key in ssbSets) {
		if (toID(key.split('-')[0]) === userid) setAlts.push(key);
	}
	let html = ``;
	for (const setID of setAlts) {
		const set = ssbSets[setID];
		html += `\t<div class="bar">\n`;
		html += `\t\t<img src="${speciesToImageUrl(set.species, set.item, set.shiny === true, true)}" alt="${set.species}" /> ${genItemHTML(set.item)}\n`;
		html += `\t\t<ul>\n\t\t\t<li><strong>${set.species}</strong>`;
		const itemsList = (Array.isArray(set.item) ? set.item : [set.item]).slice()
			.filter(i => !!i).map(i => {
				if (!Dex.items.get(i).exists) return `<em>${i}</em>`;
				return i;
			});
		if (itemsList.length) html += ` @ ${itemsList.join(' / ')}`;
		html += `</li>\n`;

		const abilities = (Array.isArray(set.ability) ? set.ability : [set.ability]).slice().map(a => {
			if (!Dex.abilities.get(a).exists) return `<em>${a}</em>`;
			return a;
		});
		html += `\t\t\t<li>Ability: ${abilities.join(' / ')}`;
		const canMega = canMegaEvo(set.species, set.item);
		let mega: Species | null = null;
		if (canMega) {
			mega = dex.species.get(canMega);
			if (!mega) throw new Error(`Unable to get mega for pokemon that can mega evolve (set: ${name}, mega: ${canMega})`);
			if (toID(mega.abilities[0]) !== toID(set.ability)) {
				if (!Dex.abilities.get(mega.abilities[0]).exists) {
					html += ` &gt;&gt; <em>${mega.abilities[0]}</em>`;
				} else {
					html += ` &gt;&gt; ${mega.abilities[0]}`;
				}
			}
		}
		html += `</li>\n`;
		const teraTypes = (Array.isArray(set.teraType) ? set.teraType : set.teraType ? [set.teraType] : [])
			.slice().map(type => Dex.types.getByID(toID(type)).name);
		if (teraTypes.length) {
			html += `<li>Tera Type: ${Array.from(new Set(teraTypes)).join(' / ')}</li>\n`;
		}
		if (set.species !== 'Fennekin') {
			html += `\t\t\t<li>EVs: `;
			const DEFAULT_EVS: {[ev in StatID]: number} = {hp: 82, atk: 82, def: 82, spa: 82, spd: 82, spe: 82};
			const evs = set.evs || DEFAULT_EVS;
			let ev: StatID;
			for (ev in evs) {
				html += `${evs[ev]} ${STAT_FORMAT[ev]} / `;
			}
			// cut off last /
			html = html.slice(0, html.length - 3);
			html += `</li>\n`;
			html += `\t\t\t<li>${parseNature(set.nature)}</li>\n`;
			if (set.ivs) {
				html += `\t\t\t<li>IVs: `;
				let iv: StatID;
				for (iv in set.ivs) {
					html += `${set.ivs[iv]} ${STAT_FORMAT[iv]} / `;
				}
				// cut off last /
				html = html.slice(0, html.length - 3);
				html += `</li>\n`;
			}
		}
		// Moves
		const movepool = set.moves.slice().concat(set.signatureMove);
		// Z move check
		let zMoveBase: Item | null = null;
		const itemArr = (Array.isArray(set.item) ? set.item : [set.item]).slice();
		for (const i of itemArr) {
			const itemObj = dex.items.get(i);
			if (!Dex.items.get(i).exists && itemObj.zMoveFrom) {
				zMoveBase = itemObj;
				break;
			}
		}
		for (const m of movepool) {
			let move;
			if (typeof m === 'string') {
				if (!Dex.moves.get(m).exists) {
					move = `<em>${m}</em>`;
				} else {
					move = m;
				}
				if (zMoveBase && m === zMoveBase.zMoveFrom) {
					move += ` &gt;&gt; <em>${zMoveBase.zMove}</em>`;
				}
			} else {
				move = m.map(v => {
					if (!Dex.moves.get(v).exists) return `<em>${v}</em>`;
					return v;
				}).join(' / ');
			}
			html += `\t\t\t<li>- ${move}</li>\n`;
		}
		html += `\t\t</ul>\n\t</div>\n`;
	}
	return html;
}
function genSetDescriptions(name: string): string {
	// Generates the set's descriptions which appear under the set body(s).
	const setAlts: string[] = [];
	const userid = toID(name);
	for (const key in ssbSets) {
		if (toID(key.split('-')[0]) === userid) setAlts.push(key);
	}
	let baseStatHtml = ``;
	let itemHtml = ``;
	let abilityHtml = ``;
	let moveHtml = ``;
	let innateHtml = ``;
	let customZ: Item | null = null;
	const cache: {[key: string]: string[]} = {
		items: [],
		moves: [],
		abilities: [],
	};
	for (const alt of setAlts) {
		const set = ssbSets[alt];

		// base stats
		let speciesid = set.species;
		if (toID(alt) === 'kennedy') speciesid = 'cinderacegmax';
		if (toID(alt) === 'arya') speciesid = 'trapinch';
		const species = dex.species.get(speciesid);
		const baseFormatSpecies = Dex.species.get(species.name);
		if (Object.values(species.baseStats).join() !== Object.values(baseFormatSpecies.baseStats).join()) {
			baseStatHtml += `\t<dl>\n\t\t<dt>Custom Base Stats - ${species.name}</dt>\n`;
			baseStatHtml += `\t\t<dd>`;
			let statID: StatID;
			const changes: {[k in StatID]: number} = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			for (statID in species.baseStats) {
				baseStatHtml += `${species.baseStats[statID]} ${STAT_FORMAT[statID]}`;
				if (statID !== 'spe') {
					baseStatHtml += ` / `;
				}
				changes[statID] = species.baseStats[statID] - baseFormatSpecies.baseStats[statID];
			}
			baseStatHtml += `</dd>\n\t\t<dd><small>(`;
			for (statID in changes) {
				if (!changes[statID]) delete changes[statID];
			}
			for (statID in changes) {
				const change = changes[statID];
				if (change === 0) continue;
				if (change > 0) {
					baseStatHtml += `<span class="statup">+${change} ${STAT_FORMAT[statID]}</span>`;
				} else {
					baseStatHtml += `<span class="statdown">${change} ${STAT_FORMAT[statID]}</span>`;
				}
				if (Object.keys(changes)[Object.keys(changes).length - 1] !== statID) baseStatHtml += `, `;
			}
			baseStatHtml += `)</small></dd>\n\t</dl>\n`;
		}

		// item
		const items = (Array.isArray(set.item) ? set.item : [set.item]).slice();
		for (const i of items) {
			if (Dex.items.get(i).exists || !i) continue; // Not custom
			if (cache.items.includes(toID(i))) continue; // Already got this description
			cache.items.push(toID(i));
			const itemResult = itemDesc(dex.items.get(i));
			itemHtml += itemResult[0];
			if (itemResult[1]) {
				if (customZ) throw new Error(`Duplicate unqiue custom Z-Crystals found on set (${name}).`);
				customZ = itemResult[1];
			}
		}
		// ability
		const abilities = (Array.isArray(set.ability) ? set.ability : [set.ability]).slice();
		for (const a of abilities) {
			if (Dex.abilities.get(a).exists && !['mountaineer'].includes(toID(a))) continue; // Not custom
			if (cache.abilities.includes(toID(a))) continue;
			cache.abilities.push(toID(a));
			abilityHtml += abilityDesc(dex.abilities.get(a));
		}
		// moves
		const move = dex.moves.get(set.signatureMove);
		if (!Dex.moves.get(set.signatureMove).exists && !cache.moves.includes(toID(set.signatureMove))) {
			// Is custom
			cache.moves.push(toID(set.signatureMove));
			moveHtml += sigMoveDesc(move);
		}
	}
	// innate
	let condition = dex.conditions.get(toID(name));
	if (!condition || !condition.exists) condition = dex.conditions.get(toID(name) + 'user');
	if (!condition || !condition.exists) throw new Error(`Unable to find condition for ${name}.`);
	// @ts-ignore Custom condition
	if (condition.innateName) {
		// @ts-ignore Custom condition
		innateHtml += `\t<dl>\n\t\t<dt>Innate Ability - ${condition.innateName}</dt>\n`;
		let desc = condition.desc;
		let shortDesc = condition.shortDesc;
		if (Dex.abilities.get((condition as any).innateName).exists) {
			desc = Dex.abilities.get((condition as any).innateName).desc;
			shortDesc = Dex.abilities.get((condition as any).innateName).shortDesc;
		}
		// @ts-ignore Custom condition
		if (!desc && !shortDesc) console.log(condition.innateName + " needs desc/shortDesc. (Innate)");
		innateHtml += `\t\t<dd>${desc || shortDesc || 'No description provided.'}</dd>\n\t</dl>\n`;
	}
	// custom z
	if (customZ && typeof customZ.zMove === 'string') {
		moveHtml += sigMoveDesc(dex.moves.get(customZ.zMove));
	}
	// relevant extra move info & combine result
	return (baseStatHtml + itemHtml + abilityHtml + innateHtml + moveHtml + genDetails(name) + `</div>\n`);
}
function itemDesc(item: Item): [string, Item | null] {
	let html = ``;
	let customZCrystal: Item | null = null;
	const type = item.megaStone ? `Mega Stone` : (item.zMove ? `Z Crystal` : `Item`);
	if (!item.desc && !item.shortDesc) console.log(item.name + " needs desc/shortDesc. (Item)");
	html += `\t<dl>\n\t\t<dt>Custom ${type}</dt>\n\t\t<dd>${item.desc || item.shortDesc || `No description yet!`}</dd>\n\t</dl>\n`;
	if (item.zMove && typeof item.zMove === 'string') customZCrystal = item;
	return [html, customZCrystal];
}
function abilityDesc(ability: Ability): string {
	let html = `\t<dl>\n\t\t<dt>Custom Ability - ${ability.name}</dt>\n`;
	if (!ability.desc && !ability.shortDesc) {
		console.log(ability.name + " needs desc/shortDesc. (Ability)");
	}
	html += `\t\t<dd>${ability.desc || ability.shortDesc || `No description yet!`}</dd>\n\t</dl>\n`;
	return html;
}
function sigMoveDesc(move: Move, header?: string): string {
	if (!header) header = `Signature Move`;
	let html = `\t<dl>\n\t\t<dt>${header} - ${move.name}</dt>\n`;
	const type = move.type === '???' ? 'question' : toID(move.type);
	html += `\t\t<dd><span class="type ${type}">${move.type.toUpperCase()}</span> <span class="type ${toID(move.category)}">${move.category.toUpperCase()}</span>\n`;
	html += `\t\t`;
	if (move.category !== 'Status') html += `<strong>Base Power:</strong> ${move.basePower} `;
	html += `<strong>Accuracy:</strong> ${move.accuracy === true ? '-' : move.accuracy + '%'} `;
	html += `<strong>PP:</strong> ${move.pp}`;
	if (!move.noPPBoosts) html += ` (max: ${move.pp * 8 / 5})`;
	html += `</dd>\n`;
	if (!move.desc && !move.shortDesc) {
		console.log(move.name + " needs desc/shortDesc. (Move)");
	}
	html += `\t\t<dd>${move.desc || move.shortDesc || 'No description provided.'}</dd>\n\t</dl>\n`;
	return html;
}
function genDetails(name: string): string {
	let move: Move | null = null;
	let header = ``;
	switch (toID(name)) {
	case 'kennedy':
		move = dex.moves.get('anfieldatmosphere');
		header = `Custom Terrain`;
		break;
	}
	if (!move) return ``;
	return sigMoveDesc(move, header);
}
function genSetCSS(name: string): string {
	// Generates the appropriate CSS statement for this set.
	const set = ssbSets[name];
	if (!set) throw new Error(`Set not found for ${name}.`);
	// .xthetap {background-image: url(//play.pokemonshowdown.com/sprites/bw-shiny/arcanine.png);}
	return `\t.${getClassName(name)} {background-image: url(${speciesToImageUrl(set.species, set.item, set.shiny === true, false)});}\n`;
}
function genRosterHTML(): string {
	// Generates all the buttons at once.
	// 14 x whatever rows
	// top row, 12
	// center the bottom row
	// image position override
	const imagePositions: {[pos: string]: string[]} = {
		supertall: ['kalalokki', 'kennedy'],
		tall: ['aelita', 'arcueid', 'arya', 'breadstycks', 'elly', 'lasen',
			'maroon', 'mex', 'notater517', 'penquin', 'rainshaft', 'siegfried', 'solaroslunaris',
			'struchni', 'thejesucristoosama', 'violet', 'warriorgallade', 'xprienzo', 'yveltalnl'],
		short: ['frostyicelad', 'partman', 'rumia', 'spoo', 'ut', 'venous', 'waves', 'hasteinky'],
		supershort: ['appletunalamode', 'arsenal'],
		shiftLeft: ['arsenal', 'coolcodename', 'blitz', 'easyonthehills', 'eva', 'goroyagami',
			'havi', 'ken', 'kry', 'pokemonvortex', 'r8', 'rainshaft', 'solaroslunaris', 'spoo'],
		shiftRight: ['aethernum', 'alexander489', 'breadstycks', 'hasteinky', 'keys', 'lasen',
			'mex', 'scotteh', 'steorra', 'waves', 'xprienzo', 'thejesucristoosama', 'appletunalamode'],
	};
	let html = `<h3 class="align-center">Choose your Fighter!</h3>\n\t<div class="roster">\n`;
	// Get an array of all set names we need a button for, alts NOT included.
	const pool = Object.keys(ssbSets).filter(s => !ssbSets[s].skip);
	let slotsInRow = 0;
	// Counter controlled so we can see the index
	for (let i = 0; i < pool.length; i++) {
		if (slotsInRow === 0) {
			// Start of a row
			html += `\t<div class="row">\n\t\t`;
			if (i === 0) {
				// First row
				// html += `\t\t<span class="cell"><button class="button blank"></button></span>\n`;
				slotsInRow++;
			} else if (i + 13 > pool.length) {
				// Last row, and there aren't 13 sets left, fill in blanks.
				// For an odd remianing amount, have extra blanks to the right (end)
				let difference = Math.floor((13 - ((pool.length - 1) - i)) / 2);
				for (difference; difference > 0; difference--) {
					// html += `\t\t<span class="cell"><button class="button blank"></button></span>\n`;
					slotsInRow++;
				}
			}
		}
		// Add next set
		html += `<span class="cell"><button class="button ${getClassName(pool[i])}`;
		for (const key in imagePositions) {
			// Image positioning
			if (imagePositions[key].includes(toID(pool[i]))) html += ` ${key}`;
		}
		html += `"><div class="nameTag">${pool[i]}</div></button></span>`;
		slotsInRow++;
		// End of set pool, fill EVERYTHING else in this row with blanks
		if (i + 1 === pool.length) {
			while (slotsInRow < 13) {
				// html += `\t\t<span class="cell"><button class="button blank"></button></span>\n`;
				slotsInRow++;
			}
		}
		if (slotsInRow === 12 && i < 13) {
			// first row ends
			// html += `\t\t<span class="cell"><button class="button blank"></button></span>\n`;
			slotsInRow++;
		}
		// End of row, cap it off for the next row/end of roster
		if (slotsInRow === 13) {
			// Next row
			html += `\n\t</div>\n`;
			slotsInRow = 0;
		}
	}
	html += `</div>`;
	return html;
}


export const commands: Chat.ChatCommands = {
	genarticle(target, room, user) {
		this.checkCan('lockdown');
		let css = ``;
		const roster = genRosterHTML();
		let data = ``;
		// Skip alts, they are added as appropriate
		const pool = Object.keys(ssbSets).filter(s => !ssbSets[s].skip);
		for (const set of pool) {
			css += genSetCSS(set);
			data += genSetHeader(set);
			data += genSetBody(set);
			data += genSetDescriptions(set);
		}
		data = data.replace(/\u00ED/g, '&iacute;');
		data = data.replace(/\u00F6/g, '&ouml;');
		data = data.replace(/Pok[eé]/g, 'Pok&eacute;');
		FS('logs/ssb_article').mkdirIfNonexistentSync();
		FS('logs/ssb_article/css.txt').writeSync(css);
		FS('logs/ssb_article/roster.txt').writeSync(roster);
		FS('logs/ssb_article/roster-details.txt').writeSync(data);
		return this.sendReply('Done, check logs/ssb_article/*');
	},
};
