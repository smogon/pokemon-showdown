/**
 * Digimon Plugin for Digimon Showdown
 * Programmed by AlfaStorm & Ashely the Pikachu
 * With contributions from mathfreak231, fliegenfuerst & Slayer95
 **/

'use strict';

const https = require('https');

const colorTable = {
	Red: ['#A60B0B', '#E24242', '#EC8484'],
	Blue: ['#0B0BA6', '#6464FF', '#94DBEE'],
	Yellow: ['#A68C21', '#FFD733', '#FFFF99'],
	Green: ['#0B7A0B', '#11BB11', '#64D364'],
	Black: ['#2C2C2C', '#858585', '#BBBBBB'],
	Brown: ['#704214', '#A52A2A', '#CC9966'],
	Purple: ['#682A68', '#A040A0', '#C183C1'],
	Gray: ['#787887', '#B8B8D0', '#D1D1E0'],
	White: ['#929292', '#E3CED0', '#FFFFFF'],
	Pink: ['#9B6470', '#EE99AC', '#F4BDC9'],
};

function getSpecies(digimon) {
	switch (digimon.species) {
	case 'MeicrackmonViciousMode':
		return 'Meicrackmon [Vicious Mode]';
	case 'CherubimonEvil':
		return 'Cherubimon [Evil]';
	case 'CherubimonGood':
		return 'Cherubimon [Good]';
	case 'MetalGreymonVaccine':
		return 'MetalGreymon [Vaccine]';
	case 'MetalGreymonVirus':
		return 'MetalGreymon [Virus]';
	default:
		return digimon.species;
	}
}

function getTypeChart(digimon) {
	const dex = Dex.mod('digimon');
	let weaknesses = [];
	let resistances = [];
	let immunities = [];
	for (let type in dex.data.TypeChart) {
		let notImmune = dex.getImmunity(type, digimon);
		if (notImmune) {
			let typeMod = dex.getEffectiveness(type, digimon);
			switch (typeMod) {
			case 1:
				weaknesses.push(type);
				break;
			case 2:
				weaknesses.push("<b>" + type + "</b>");
				break;
			case 3:
				weaknesses.push("<b><i>" + type + "</i></b>");
				break;
			case -1:
				resistances.push(type);
				break;
			case -2:
				resistances.push("<b>" + type + "</b>");
				break;
			case -3:
				resistances.push("<b><i>" + type + "</i></b>");
				break;
			}
		} else {
			immunities.push(type);
		}
	}

	return {weaknesses, resistances, immunities};
}

function getTypeImgSrc(type) {
	switch (type) {
	case 'Flame':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516538866860043/Flame_Mini.png';
	case 'Aqua':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516531518570514/Aqua_Mini.png';
	case 'Air':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516530251890691/Air.png';
	case 'Nature':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516544126517268/Nature_Mini.png';
	case 'Holy':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516540829794304/Holy_Mini.png';
	case 'Evil':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516535398039562/Evil_Mini.png';
	case 'Battle':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516533489631233/Battle_Mini.png';
	case 'Mech':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516542780145666/Mech_Mini.png';
	case 'Filth':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476516536895406100/Filth_Mini.png';
	default:
		return '';
	}
}

function getAbilityImgSrc(ability) {
	switch (ability) {
	case 'Vaccine':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476520365506428928/Vaccine.png';
	case 'Virus':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476520361719103488/Virus.png';
	case 'Data':
		return 'https://cdn.discordapp.com/attachments/357714356915666954/476520363598282754/Data.png';
	default:
		return '';
	}
}

exports.commands = {
	fieldguide: 'digiprofile',
	digiprofile(target, room, user) {
		if (!this.runBroadcast()) return;
		target = target.toLowerCase();
		let mod = Dex.mod('digimon');
		if (!target) return this.parse(`/digipediahelp`);
		if (!mod.dataSearch(target, ['Pokedex'], true)) return this.errorReply(`That digimon does not exist.`);
		let newTargets = mod.dataSearch(target);
		let digimon = mod.getTemplate(newTargets[0].name);
		let color = digimon.color;
		let [firstcolor, secondcolor, thirdcolor] = colorTable[color];
		let display = `<div><center><table style="width: 480px; background-color: ${firstcolor}; border-color: ${thirdcolor};" border="2"><tbody><tr><td style="width: 159px; text-align: center;"><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor};" border="1"><tbody><tr><td style="width: 462px;"><span style="color: #333333;"><strong>Digimon Field Guide</strong></span></td>`;
		display += `</tr></tbody></table><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor}; margin-left: auto; margin-right: auto;" border="1"><tbody><tr><td style="width: 198px;"><span style="font-size: small; color: #333333;"><strong>${digimon.stage}</strong></span></td><td style="width: 131px;"><span style="font-size: small; color: #333333;"><strong>Stats</strong></span>`;
		display += `</td></tr><tr><td style="width: 198px;"><p><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimonani/${target}.gif" title="${target}" width="56" height="56"></strong></p><p><strong><span style="color: #333333;">${getSpecies(digimon)} </span></strong></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;">`;
		display += `<span style="color: #333333;"><strong><span style="font-size: small;">Type: </span></strong><span style="font-size: small;">${digimon.types.join(', ')}</span></span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;"><span style="color: #333333;"><strong><span style="font-size: small;">Ability:</span></strong><span style="font-size: small;"> ${digimon.abilities[0]}</span>`;
		let templates = mod.getTemplate(target);
		templates = mod.getTemplate(templates.baseSpecies);
		let sigmove = Object.keys(templates.learnset);
		sigmove = sigmove.map(id => mod.getMove(id).name);
		sigmove = sigmove[sigmove.length - 2];
		display += `</span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;"><span style="color: #333333;"><strong><span style="font-size: small;">Signature: </span></strong><span style="font-size: small;">${sigmove}</span></span></p></td><td style="text-align: left; width: 131px;"><p style="text-align: center;"><span style="color: #ff0000;"><strong>`;
		display += `<span style="font-size: small;">HP</span></strong>:</span><span style="font-size: small;"><span style="font-size: small;"><span style="color: #ff0000;"> ${digimon.baseStats.hp}</span><br><span style="color: #f08030;"><strong><span style="font-size: small;">ATK</span></strong>: ${digimon.baseStats.atk}</span><br><span style="color: #f8d030;"><strong>DEF</strong></span><span style="font-size: small;"><span style="color: #f8d030;">: ${digimon.baseStats.def}</span>`;
		display += `<br><span style="color: #6890f0;"><strong>SPA</strong></span><span style="font-size: small;"><span style="color: #6890f0;">: ${digimon.baseStats.spa}</span><br><span style="color: #78c850;"><strong>SPD</strong></span><span style="font-size: small;"><span style="color: #78c850;">: ${digimon.baseStats.spd}</span><br><span style="color: #f85888;"><strong>SPE</strong></span><span style="font-size: small;"><span style="color: #f85888;">: ${digimon.baseStats.spe}</span>`;
		display += `<br><br></span></span></span></span></span></span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p><span style="color: #333333;"><strong style="font-size: small;">Height</strong><span style="font-size: small;">: ${digimon.heightm} m</span></span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><span style="font-size: small; color: #333333;">`;
		display += `<span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><strong><span style="font-size: small;"><span style="font-size: small;">Weight:</span></span></strong><span style="font-size: small;"> ${digimon.weightkg} kg</span></span></span></span></span></span></span></span>`;
		display += `<hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><span style="font-size: small; color: #333333;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><strong><span style="font-size: small;">Color:</span></strong><span style="font-size: small;"> ${digimon.color}</span>`;

		let {weaknesses, immunities, resistances} = getTypeChart(digimon);

		display += `</span></span></span></span></span></span></span></td></tr></tbody></table><table style="height: 207px; background-color: #ffffff; border-color: ${secondcolor}; margin-left: auto; margin-right: auto;" border="1" width="466"><tbody><tr><td style="width: 456px;"><span style="color: #333333; font-size: small;"><strong>Type Interactions</strong></span><hr style="border-top: 1px solid ${secondcolor}; background: transparent;">`;
		display += `<span style="color: #333333; font-size: small;"><strong>Weaknesses<br></strong>${(weaknesses.join(', ') || '<font color=#999999>None</font>')}<strong><br>Resistances<br></strong>${(resistances.join(', ') || '<font color=#999999>None</font>')}<strong><br>Immunities<br></strong>${(immunities.join(', ') || '<font color=#999999>None</font>')}</span></td></tr><tr><td style="text-align: center; width: 456px;"><span style="color: #333333; font-size: small;"><strong><strong><strong><strong>Move Pool</strong></strong></strong></strong></span>`;
		let template = mod.getTemplate(target);
		template = mod.getTemplate(template.baseSpecies);
		let move = Object.keys(template.learnset);
		move = move.map(id => mod.getMove(id).name);
		let movestring = 0;
		movestring = move.join(', ');
		display += `<hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><span style="color: #333333; font-size: small;">${movestring}</span></td></tr></tbody></table></td></tr></tbody></table></center></div>`;

		return this.sendReplyBox(display);
	},
	digiprofilehelp: ['/digipedia [digimon] - Gives information on the digimon selected.'],

	digisearchdisplay: 'digipedia',
	digisearch: 'digipedia',
	digimonsearch: 'digipedia',
	searchchange: 'digipedia',
	digipedia(target, room, user, connection, cmd) {
		let mod = Dex.mod('digimon');
		/*
		/digimonsearch Section:value, Section:value
		/digisearchdisplay digimon
		*/
		if (cmd !== 'digisearchdisplay') user.lastDigiSearch = target;
		let change = !!target || cmd === 'searchchange';
		let choices = {
			alphabetical: 'abcdefghijklmnopqrstuvwxyz'.split(''),
			stage: ['Fresh', 'In-Training', 'Rookie', 'Champion', 'Ultimate', 'Mega'],
			type: ['Flame', 'Aqua', 'Air', 'Nature', 'Holy', 'Evil', 'Battle', 'Mech', 'Filth'],
			color: ['Red', 'Blue', 'Yellow', 'Green', 'Black', 'Brown', 'Purple', 'Gray', 'White', 'Pink'],
			ability: ['Vaccine', 'Virus', 'Data'],
		};
		let menu = `<div class="infobox"><center><strong>Digimon Search</strong></center><br/>`;
		if (cmd !== 'digisearchdisplay') {
			target = target.split(',').map(x => {
				return x.trim();
			});
			for (let type in choices) {
				menu += `<div><summary>${type.substring(0, 1).toUpperCase() + type.substring(1)}</summary>`;
				for (let i = 0; i < choices[type].length; i++) {
					let newTarget = false;
					if (target.indexOf(type + ':' + choices[type][i]) > -1) {
						newTarget = target.slice(0);
						newTarget.splice(newTarget.indexOf(type + ':' + choices[type][i]), 1).join(',');
					}
					menu += `<button class="button" name="send" value="${newTarget ? `/searchchange ${newTarget}" style="background: #4286f4"` : `/searchchange ${target.join(',')}${change ? `,` : ``}${type}:${choices[type][i]}"`}>${choices[type][i]}</button>`;
				}
				menu += `</div>`;
			}
			if (toId(target.join(''))) {
				// Show found digimon
				let reqs = {alphabetical: '', stage: '', type: '', color: '', ability: ''};
				let invalidSearch = false;
				target.map(y => {
					if (invalidSearch) return y;
					y = y.split(':');
					if (choices[y[0]] && choices[y[0]].includes(y[1])) {
						if (reqs[y[0]]) {
							invalidSearch = true;
							return y.join(':');
						}
						reqs[y[0]] = y[1];
					}
					return y.join(':');
				});
				if (invalidSearch) {
					menu += `No digimon were found. (Your search was invalid)</div>`;
					return user.sendTo(room, `${change ? `|uhtmlchange|cs${user.userid}|` : `|uhtml|cs${user.userid}|`}${menu}`);
				}
				menu += `<center><div style='max-height: 300px; overflow-y: scroll;'>`;
				let foundDigimon = 0;
				for (const digimon in mod.data.Pokedex) {
					let template = mod.getTemplate(digimon);
					if (template.num > -2000 || template.num < -3000) continue;
					if (reqs.alphabetical && !template.id.startsWith(reqs.alphabetical)) continue;
					if (reqs.stage && reqs.stage !== template.stage) continue;
					if (reqs.type && !template.types.includes(reqs.type)) continue;
					if (reqs.color && reqs.color !== template.color) continue;
					if (reqs.ability && reqs.ability !== template.abilities[0]) continue;
					// Valid
					foundDigimon++;
					let digiParts = getSpecies(template).split(' ', 2);
					let first = digiParts[0];
					let second = (digiParts.length >= 2 ? digiParts[1] : '');

					let typeImages = template.types.map(getTypeImgSrc);
					let type1 = typeImages[0];
					let type2 = typeImages.length >= 2 ? typeImages[1] : '';
					let type3 = typeImages.length >= 3 ? typeImages[2] : '';

					let ability = getAbilityImgSrc(template.abilities[0]);

					if (!template.types[1]) {
						menu += `<button class="button" name="send" value="/digisearchdisplay ${template.id}"><table style="width: 135px; background-color: #011f55; border-color: #008dc5; float: left;" border="2"><tbody><tr>`;
						menu += `<td style="width: 135px; text-align: center;"><table style="width: 123px; background-color: #ffffff; border-color: #011f55; float: left;" border="1"><tbody><tr style="height: 17px;">`;
						menu += `<td style="height: 17px; text-align: center;"><strong><img style="float: left;" src="${type1}">`;
						menu += `<img style="float: right;" src="${ability}"><br></strong></td></tr><tr style="height: 98px;">`;
						menu += `<td style="width: 122px; height: 98px;"><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimon/${template.id}.png"><br><span style="font-size: xx-small;">${template.name}<br></span></strong></td></tr></tbody></table></td></tr></tbody></table> `;
					} else if (!template.types[2] && (template.id === 'meicrackmonviciousmode' || template.id === 'cherubimonevil' || template.id === 'cherubimongood')) {
						menu += `<button class="button" name="send" value="/digisearchdisplay ${template.id}"><table style="width: 135px; background-color: #011f55; border-color: #008dc5; float: left;" border="2"><tbody><tr>`;
						menu += `<td style="width: 135px; text-align: center;"><table style="width: 123px; background-color: #ffffff; border-color: #011f55; float: left;" border="1"><tbody><tr style="height: 17px;">`;
						menu += `<td style="height: 17px; text-align: center;"><strong><img style="float: left;" src="${type1}"><img style="float: left;" src="${type2}">`;
						menu += `<img style="float: right;" src="${ability}"><br></strong></td></tr><tr style="height: 98px;">`;
						menu += `<td style="width: 122px; height: 98px;"><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimon/${template.id}.png"><br><span style="font-size: xx-small;">${first}<br>${second}<br></span></strong></td></tr></tbody></table></td></tr></tbody></table> `;
					} else if (!template.types[2]) {
						menu += `<button class="button" name="send" value="/digisearchdisplay ${template.id}"><table style="width: 135px; background-color: #011f55; border-color: #008dc5; float: left;" border="2"><tbody><tr>`;
						menu += `<td style="width: 135px; text-align: center;"><table style="width: 123px; background-color: #ffffff; border-color: #011f55; float: left;" border="1"><tbody><tr style="height: 17px;">`;
						menu += `<td style="height: 17px; text-align: center;"><strong><img style="float: left;" src="${type1}"><img style="float: left;" src="${type2}">`;
						menu += `<img style="float: right;" src="${ability}"><br></strong></td></tr><tr style="height: 98px;">`;
						menu += `<td style="width: 122px; height: 98px;"><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimon/${template.id}.png"><br><span style="font-size: xx-small;">${template.name}<br></span></strong></td></tr></tbody></table></td></tr></tbody></table> `;
					} else if (template.id === 'metalgreymonvaccine' || template.id === 'metalgreymonvirus') {
						menu += `<button class="button" name="send" value="/digisearchdisplay ${template.id}"><table style="width: 135px; background-color: #011f55; border-color: #008dc5; float: left;" border="2"><tbody><tr>`;
						menu += `<td style="width: 135px; text-align: center;"><table style="width: 123px; background-color: #ffffff; border-color: #011f55; float: left;" border="1"><tbody><tr style="height: 17px;">`;
						menu += `<td style="height: 17px; text-align: center;"><strong><img style="float: left;" src="${type1}"><img style="float: left;" src="${type2}">`;
						menu += `<img style="float: left;" src="${type3}"><img style="float: right;" src="${ability}"><br></strong></td></tr><tr style="height: 98px;">`;
						menu += `<td style="width: 122px; height: 98px;"><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimon/${template.id}.png"><br><span style="font-size: xx-small;">${first}<br>${second}<br></span></strong></td></tr></tbody></table></td></tr></tbody></table> `;
					} else {
						menu += `<button class="button" name="send" value="/digisearchdisplay ${template.id}"><table style="width: 135px; background-color: #011f55; border-color: #008dc5; float: left;" border="2"><tbody><tr>`;
						menu += `<td style="width: 135px; text-align: center;"><table style="width: 123px; background-color: #ffffff; border-color: #011f55; float: left;" border="1"><tbody><tr style="height: 17px;">`;
						menu += `<td style="height: 17px; text-align: center;"><strong><img style="float: left;" src="${type1}"><img style="float: left;" src="${type2}">`;
						menu += `<img style="float: left;" src="${type3}"><img style="float: right;" src="${ability}"><br></strong></td></tr><tr style="height: 98px;">`;
						menu += `<td style="width: 122px; height: 98px;"><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimon/${template.id}.png"><br><span style="font-size: xx-small;">${template.name}<br></span></strong></td></tr></tbody></table></td></tr></tbody></table> `;
					}
				}
				if (!foundDigimon) menu += `No digimon were found.`;
				menu += `</div></div></center>`;
			}
		} else {
			menu += `<button class="button" name="send" value="${user.lastDigiSearch ? `/digipedia ${user.lastDigiSearch}` : `/digipedia`}">Back</button><br/>`;
			let digimons = mod.dataSearch(target);
			if (!digimons) {
				menu += `The digimon "${toId(target)}" does not exist.</div>`;
				return user.sendTo(room, `${change ? `|uhtmlchange|cs${user.userid}|` : `|uhtml|cs${user.userid}|`}${menu}`);
			}
			let newTargets = mod.dataSearch(target);
			let digimon = mod.getTemplate(newTargets[0].name);
			let color = digimon.color;
			let [firstcolor, secondcolor, thirdcolor] = colorTable[color];
			menu += `<div><center><table style="width: 480px; background-color: ${firstcolor}; border-color: ${thirdcolor};" border="2"><tbody><tr><td style="width: 159px; text-align: center;"><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor};" border="1"><tbody><tr><td style="width: 462px;"><span style="color: #333333;"><strong>Digimon Field Guide</strong></span></td>`;
			menu += `</tr></tbody></table><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor}; margin-left: auto; margin-right: auto;" border="1"><tbody><tr><td style="width: 198px;"><span style="font-size: small; color: #333333;"><strong>${digimon.stage}</strong></span></td><td style="width: 131px;"><span style="font-size: small; color: #333333;"><strong>Stats</strong></span>`;
			menu += `</td></tr><tr><td style="width: 198px;"><p><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimonani/${target}.gif" title="${target}" width="56" height="56"></strong></p><p><strong><span style="color: #333333;">${getSpecies(digimon)} </span></strong></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;">`;
			menu += `<span style="color: #333333;"><strong><span style="font-size: small;">Type: </span></strong><span style="font-size: small;">${digimon.types.join(', ')}</span></span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;"><span style="color: #333333;"><strong><span style="font-size: small;">Ability:</span></strong><span style="font-size: small;"> ${digimon.abilities[0]}</span>`;
			let templates = mod.getTemplate(target);
			templates = mod.getTemplate(templates.baseSpecies);
			let sigmove = Object.keys(templates.learnset);
			sigmove = sigmove.map(id => mod.getMove(id).name);
			sigmove = sigmove[sigmove.length - 2];
			menu += `</span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;"><span style="color: #333333;"><strong><span style="font-size: small;">Signature: </span></strong><span style="font-size: small;">${sigmove}</span></span></p></td><td style="text-align: left; width: 131px;"><p style="text-align: center;"><span style="color: #ff0000;"><strong>`;
			menu += `<span style="font-size: small;">HP</span></strong>:</span><span style="font-size: small;"><span style="font-size: small;"><span style="color: #ff0000;"> ${digimon.baseStats.hp}</span><br><span style="color: #f08030;"><strong><span style="font-size: small;">ATK</span></strong>: ${digimon.baseStats.atk}</span><br><span style="color: #f8d030;"><strong>DEF</strong></span><span style="font-size: small;"><span style="color: #f8d030;">: ${digimon.baseStats.def}</span>`;
			menu += `<br><span style="color: #6890f0;"><strong>SPA</strong></span><span style="font-size: small;"><span style="color: #6890f0;">: ${digimon.baseStats.spa}</span><br><span style="color: #78c850;"><strong>SPD</strong></span><span style="font-size: small;"><span style="color: #78c850;">: ${digimon.baseStats.spd}</span><br><span style="color: #f85888;"><strong>SPE</strong></span><span style="font-size: small;"><span style="color: #f85888;">: ${digimon.baseStats.spe}</span>`;
			menu += `<br><br></span></span></span></span></span></span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p><span style="color: #333333;"><strong style="font-size: small;">Height</strong><span style="font-size: small;">: ${digimon.heightm} m</span></span></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><span style="font-size: small; color: #333333;">`;
			menu += `<span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><strong><span style="font-size: small;"><span style="font-size: small;">Weight:</span></span></strong><span style="font-size: small;"> ${digimon.weightkg} kg</span></span></span></span></span></span></span></span>`;
			menu += `<hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><span style="font-size: small; color: #333333;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><span style="font-size: small;"><strong><span style="font-size: small;">Color:</span></strong><span style="font-size: small;"> ${digimon.color}</span>`;

			let {weaknesses, immunities, resistances} = getTypeChart(digimon);

			menu += `</span></span></span></span></span></span></span></td></tr></tbody></table><table style="height: 207px; background-color: #ffffff; border-color: ${secondcolor}; margin-left: auto; margin-right: auto;" border="1" width="466"><tbody><tr><td style="width: 456px;"><span style="color: #333333; font-size: small;"><strong>Type Interactions</strong></span><hr style="border-top: 1px solid ${secondcolor}; background: transparent;">`;
			menu += `<span style="color: #333333; font-size: small;"><strong>Weaknesses<br></strong>${(weaknesses.join(', ') || '<font color=#999999>None</font>')}<strong><br>Resistances<br></strong>${(resistances.join(', ') || '<font color=#999999>None</font>')}<strong><br>Immunities<br></strong>${(immunities.join(', ') || '<font color=#999999>None</font>')}</span></td></tr><tr><td style="text-align: center; width: 456px;"><span style="color: #333333; font-size: small;"><strong><strong><strong><strong>Move Pool</strong></strong></strong></strong></span>`;
			let template = mod.getTemplate(target);
			template = mod.getTemplate(template.baseSpecies);
			let move = Object.keys(template.learnset);
			move = move.map(id => mod.getMove(id).name);
			let movestring = 0;
			movestring = move.join(', ');
			menu += `<hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><span style="color: #333333; font-size: small;">${movestring}</span></td></tr></tbody></table></td></tr></tbody></table></center></div>`;
		}
		return user.sendTo(room, `${change ? `|uhtmlchange|cs${user.userid}|` : `|uhtml|cs${user.userid}|`}${menu}`);
	},
	digipediahelp: ['/digimonsearch - sends a display to search for a list of digimon.'],

	'!dsprite': true,
	digisprite: 'dsprite',
	digimonsprite: 'dsprite',
	dsprite(target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;
		if (!toId(target)) return this.sendReply('/digisprite [Digimon] - Allows you to view the sprite of a Digimon Showdown digimon');
		target = target.toLowerCase().split(',');
		let alt = '';
		let type = toId(target[1]);
		let sprite = target[0].trim();

		let mod = Dex.mod('digimon');
		if (mod.data.Pokedex[toId(sprite)]) {
			sprite = mod.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			return this.sendReply("There isn't any Digimon called '" + sprite + "'...");
		}

		let spritesFolder = type === 'back' ? '/sprites/digimon/sprites/digimonani-back/' : '/sprites/digimon/sprites/digimonani/';
		const reqOpts = {
			hostname: 'play.pokemonshowdown.com',
			path: `${spritesFolder}${sprite}${alt}.gif`,
			method: 'HEAD',
		};

		return new Promise((resolve, reject) => {
			https.request(reqOpts, res => {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					return resolve(null);
				}
				return reject(new Error(`HTTP ${res.statusCode}`));
			}).setTimeout(5000).on('error', reject).end();
		}).then(() => {
			if (!this.runBroadcast()) return;
			this.sendReply(Chat.html`|raw|<img src="//play.pokemonshowdown.com${spritesFolder}${sprite}${alt}.gif">`);
			if (room) room.update();
		}, () => {
			if (!this.runBroadcast()) return;
			this.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
			if (room) room.update();
		});
	},
	digispritehelp: ['/digisprite [Digimon] - Allows you to view the sprite of a Digimon Showdown digimon.'],

	digihelp: ['These are the commands for the Digimon Showdown chat-plugin:',
		'/digiprofile [digimon] - Gives information on the digimon selected.',
		'/digipedia - Shows a list of all selected digimon.',
		'/digisprite [digimon] - Allows you to view the sprite of a Digimon Showdown digimon.',
		'/digihelp - Shows the digimon help commands.'],
};
