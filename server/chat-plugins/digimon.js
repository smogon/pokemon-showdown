/**
 * Digimon Plugin for Digimon Showdown
 * Programmed by AlfaStorm & Ashely the Pikachu
 * With contributions from mathfreak231 & fliegenfuerst
 **/

'use strict';

exports.commands = {
	fieldguide: 'digiprofile',
	digiprofile: function (target, room, user) {
		if (!this.runBroadcast()) return;
		target = target.toLowerCase();
		let mod = Dex.mod('digimon');
		if (!target) return this.parse(`/digipediahelp`);
		if (!mod.dataSearch(target, ['Pokedex'], true)) return this.errorReply(`That digimon does not exist.`);
		let newTargets = mod.dataSearch(target);
		let digimon = mod.getTemplate(newTargets[0].name);
		let firstcolor = 0;
		let secondcolor = 0;
		let thirdcolor = 0;
		let color = digimon.color;
		switch (color) {
		case 'Red':
			firstcolor = '#A60B0B';
			secondcolor = '#E24242';
			thirdcolor = '#EC8484';
			break;
		case 'Blue':
			firstcolor = '#0B0BA6';
			secondcolor = '#6464FF';
			thirdcolor = '#94DBEE';
			break;
		case 'Yellow':
			firstcolor = '#A68C21';
			secondcolor = '#FFD733';
			thirdcolor = '#FFFF99';
			break;
		case 'Green':
			firstcolor = '#0B7A0B';
			secondcolor = '#11BB11';
			thirdcolor = '#64D364';
			break;
		case 'Black':
			firstcolor = '#2C2C2C';
			secondcolor = '#858585';
			thirdcolor = '#BBBBBB';
			break;
		case 'Brown':
			firstcolor = '#704214';
			secondcolor = '#A52A2A';
			thirdcolor = '#CC9966';
			break;
		case 'Purple':
			firstcolor = '#682A68';
			secondcolor = '#A040A0';
			thirdcolor = '#C183C1';
			break;
		case 'Gray':
			firstcolor = '#787887';
			secondcolor = '#B8B8D0';
			thirdcolor = '#D1D1E0';
			break;
		case 'White':
			firstcolor = '#929292';
			secondcolor = '#E3CED0';
			thirdcolor = '#FFFFFF';
			break;
		case 'Pink':
			firstcolor = '#9B6470';
			secondcolor = '#EE99AC';
			thirdcolor = '#F4BDC9';
			break;
		}
		switch (digimon.species) {
		case 'MeicrackmonViciousMode':
			digimon.species = 'Meicrackmon [Vicious Mode]';
			break;
		case 'CherubimonEvil':
			digimon.species = 'Cherubimon [Evil]';
			break;
		case 'CherubimonGood':
			digimon.species = 'Cherubimon [Good]';
			break;
		case 'MetalGreymonVaccine':
			digimon.species = 'MetalGreymon [Vaccine]';
			break;
		case 'MetalGreymonVirus':
			digimon.species = 'MetalGreymon [Virus]';
			break;
		}
		let display = `<div><center><table style="width: 480px; background-color: ${firstcolor}; border-color: ${thirdcolor};" border="2"><tbody><tr><td style="width: 159px; text-align: center;"><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor};" border="1"><tbody><tr><td style="width: 462px;"><span style="color: #333333;"><strong>Digimon Field Guide</strong></span></td>`;
		display += `</tr></tbody></table><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor}; margin-left: auto; margin-right: auto;" border="1"><tbody><tr><td style="width: 198px;"><span style="font-size: small; color: #333333;"><strong>${digimon.stage}</strong></span></td><td style="width: 131px;"><span style="font-size: small; color: #333333;"><strong>Stats</strong></span>`;
		display += `</td></tr><tr><td style="width: 198px;"><p><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimonani/${target}.gif" title="${target}" width="56" height="56"></strong></p><p><strong><span style="color: #333333;">${digimon.species} </span></strong></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;">`;
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

		let weaknesses = [];
		let resistances = [];
		let immunities = [];
		for (let type in mod.data.TypeChart) {
			let notImmune = mod.getImmunity(type, digimon);
			if (notImmune) {
				let typeMod = mod.getEffectiveness(type, digimon);
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
	digipedia: function (target, room, user, connection, cmd) {
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
					let first = 0;
					let second = 0;
					switch (template.id) {
					case 'meicrackmonviciousmode':
						first = 'Meicrackmon';
						second = '[Vicious Mode]';
						break;
					case 'cherubimonevil':
						first = 'Cherubimon';
						second = '[Evil]';
						break;
					case 'cherubimongood':
						first = 'Cherubimon';
						second = '[Good]';
						break;
					case 'metalgreymonvaccine':
						first = 'MetalGreymon';
						second = '[Vaccine]';
						break;
					case 'metalgreymonvirus':
						first = 'MetalGreymon';
						second = '[Virus]';
						break;
					}
					let type1 = 0;
					switch (template.types[0]) {
					case 'Flame':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516538866860043/Flame_Mini.png';
						break;
					case 'Aqua':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516531518570514/Aqua_Mini.png';
						break;
					case 'Air':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516530251890691/Air.png';
						break;
					case 'Nature':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516544126517268/Nature_Mini.png';
						break;
					case 'Holy':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516540829794304/Holy_Mini.png';
						break;
					case 'Evil':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516535398039562/Evil_Mini.png';
						break;
					case 'Battle':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516533489631233/Battle_Mini.png';
						break;
					case 'Mech':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516542780145666/Mech_Mini.png';
						break;
					case 'Filth':
						type1 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516536895406100/Filth_Mini.png';
						break;
					}
					let type2 = 0;
					switch (template.types[1]) {
					case 'Flame':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516538866860043/Flame_Mini.png';
						break;
					case 'Aqua':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516531518570514/Aqua_Mini.png';
						break;
					case 'Air':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516530251890691/Air.png';
						break;
					case 'Nature':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516544126517268/Nature_Mini.png';
						break;
					case 'Holy':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516540829794304/Holy_Mini.png';
						break;
					case 'Evil':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516535398039562/Evil_Mini.png';
						break;
					case 'Battle':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516533489631233/Battle_Mini.png';
						break;
					case 'Mech':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516542780145666/Mech_Mini.png';
						break;
					case 'Filth':
						type2 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516536895406100/Filth_Mini.png';
						break;
					}
					let type3 = 0;
					switch (template.types[2]) {
					case 'Flame':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516538866860043/Flame_Mini.png';
						break;
					case 'Aqua':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516531518570514/Aqua_Mini.png';
						break;
					case 'Air':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516530251890691/Air.png';
						break;
					case 'Nature':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516544126517268/Nature_Mini.png';
						break;
					case 'Holy':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516540829794304/Holy_Mini.png';
						break;
					case 'Evil':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516535398039562/Evil_Mini.png';
						break;
					case 'Battle':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516533489631233/Battle_Mini.png';
						break;
					case 'Mech':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516542780145666/Mech_Mini.png';
						break;
					case 'Filth':
						type3 = 'https://cdn.discordapp.com/attachments/357714356915666954/476516536895406100/Filth_Mini.png';
						break;
					}
					let ability = template.abilities[0];
					switch (ability) {
					case 'Vaccine':
						ability = 'https://cdn.discordapp.com/attachments/357714356915666954/476520365506428928/Vaccine.png';
						break;
					case 'Virus':
						ability = 'https://cdn.discordapp.com/attachments/357714356915666954/476520361719103488/Virus.png';
						break;
					case 'Data':
						ability = 'https://cdn.discordapp.com/attachments/357714356915666954/476520363598282754/Data.png';
						break;
					}
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
			let firstcolor = 0;
			let secondcolor = 0;
			let thirdcolor = 0;
			let color = digimon.color;
			switch (color) {
			case 'Red':
				firstcolor = '#A60B0B';
				secondcolor = '#E24242';
				thirdcolor = '#EC8484';
				break;
			case 'Blue':
				firstcolor = '#0B0BA6';
				secondcolor = '#6464FF';
				thirdcolor = '#94DBEE';
				break;
			case 'Yellow':
				firstcolor = '#A68C21';
				secondcolor = '#FFD733';
				thirdcolor = '#FFFF99';
				break;
			case 'Green':
				firstcolor = '#0B7A0B';
				secondcolor = '#11BB11';
				thirdcolor = '#64D364';
				break;
			case 'Black':
				firstcolor = '#2C2C2C';
				secondcolor = '#858585';
				thirdcolor = '#BBBBBB';
				break;
			case 'Brown':
				firstcolor = '#704214';
				secondcolor = '#A52A2A';
				thirdcolor = '#CC9966';
				break;
			case 'Purple':
				firstcolor = '#682A68';
				secondcolor = '#A040A0';
				thirdcolor = '#C183C1';
				break;
			case 'Gray':
				firstcolor = '#787887';
				secondcolor = '#B8B8D0';
				thirdcolor = '#D1D1E0';
				break;
			case 'White':
				firstcolor = '#929292';
				secondcolor = '#E3CED0';
				thirdcolor = '#FFFFFF';
				break;
			case 'Pink':
				firstcolor = '#9B6470';
				secondcolor = '#EE99AC';
				thirdcolor = '#F4BDC9';
				break;
			}
			switch (digimon.species) {
			case 'MeicrackmonViciousMode':
				digimon.species = 'Meicrackmon [Vicious Mode]';
				break;
			case 'CherubimonEvil':
				digimon.species = 'Cherubimon [Evil]';
				break;
			case 'CherubimonGood':
				digimon.species = 'Cherubimon [Good]';
				break;
			case 'MetalGreymonVaccine':
				digimon.species = 'MetalGreymon [Vaccine]';
				break;
			case 'MetalGreymonVirus':
				digimon.species = 'MetalGreymon [Virus]';
				break;
			}
			menu += `<div><center><table style="width: 480px; background-color: ${firstcolor}; border-color: ${thirdcolor};" border="2"><tbody><tr><td style="width: 159px; text-align: center;"><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor};" border="1"><tbody><tr><td style="width: 462px;"><span style="color: #333333;"><strong>Digimon Field Guide</strong></span></td>`;
			menu += `</tr></tbody></table><table style="width: 468px; background-color: #ffffff; border-color: ${secondcolor}; margin-left: auto; margin-right: auto;" border="1"><tbody><tr><td style="width: 198px;"><span style="font-size: small; color: #333333;"><strong>${digimon.stage}</strong></span></td><td style="width: 131px;"><span style="font-size: small; color: #333333;"><strong>Stats</strong></span>`;
			menu += `</td></tr><tr><td style="width: 198px;"><p><strong><img src="https://play.pokemonshowdown.com/sprites/digimon/sprites/digimonani/${target}.gif" title="${target}" width="56" height="56"></strong></p><p><strong><span style="color: #333333;">${digimon.species} </span></strong></p><hr style="border-top: 1px solid ${secondcolor}; background: transparent;"><p style="text-align: left;">`;
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

			let weaknesses = [];
			let resistances = [];
			let immunities = [];
			for (let type in mod.data.TypeChart) {
				let notImmune = mod.getImmunity(type, digimon);
				if (notImmune) {
					let typeMod = mod.getEffectiveness(type, digimon);
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
	dsprite: function (target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		if (!toId(target)) return this.sendReply('/digisprite [Digimon] - Allows you to view the sprite of a Digimon Showdown digimon');
		target = target.toLowerCase().split(',');
		let alt = '';
		let type = toId(target[1]);
		let sprite = target[0].trim();
		let url;
		if (type === 'back') {
			url = 'http://play.pokemonshowdown.com/sprites/digimon/sprites/digimonani-back/';
		} else {
			url = 'http://play.pokemonshowdown.com/sprites/digimon/sprites/digimonani/';
		}

		let mod = Dex.mod('digimon');
		if (mod.data.Pokedex[toId(sprite)]) {
			sprite = mod.data.Pokedex[toId(sprite)].species.toLowerCase();
		} else {
			return this.sendReply("There isn't any Digimon called '" + sprite + "'...");
		}

		let self = this;
		require('request').get(url + sprite + alt + '.gif').on('error', function () {
			self.sendReply('The sprite for ' + sprite + alt + ' is unavailable.');
		}).on('response', function (response) {
			if (response.statusCode === 404) return self.sendReply('The sprite for ' + sprite + alt + ' is currently unavailable.');
			self.sendReply('|html|<img src = "' + url + sprite + alt + '.gif">');
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