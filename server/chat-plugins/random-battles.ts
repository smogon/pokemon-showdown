/**
 * Random Battles chat-plugin
 * Written by Kris with inspiration from sirDonovan and The Immortal
 */

import {FS} from "../../lib/fs";

const GEN_NAMES: {[k: string]: string} = {
	gen1: '[Gen 1]', gen2: '[Gen 2]', gen3: '[Gen 3]', gen4: '[Gen 4]', gen5: '[Gen 5]', gen6: '[Gen 6]', gen7: '[Gen 7]',
};

const TIERS: {[k: string]: string} = {
	uber: "Uber", ubers: "Uber",
	ou: "OU", uu: "UU", ru: "RU", nu: "NU", pu: "PU",
	mono: "Mono", monotype: "Mono", lc: "LC", littlecup: "LC",
};

function formatAbility(ability: Ability | string) {
	ability = Dex.getAbility(ability);
	return `<a href="https://${Config.routes.dex}/abilities/${ability.id}" target="_blank" class="subtle" style="white-space:nowrap">${ability.name}</a>`;
}
function formatNature(n: string) {
	const nature = Dex.getNature(n);
	return nature.name;
}

function formatMove(move: Move | string) {
	move = Dex.getMove(move);
	return `<a href="https://${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}

function formatItem(item: Item | string) {
	if (typeof item === 'string' && item === "No Item") {
		return `No Item`;
	} else {
		item = Dex.getItem(item);
		return `<a href="https://${Config.routes.dex}/items/${item.id}" target="_blank" class="subtle" style="white-space:nowrap">${item.name}</a>`;
	}
}

function trimmedItemsArray(items: string[]) {
	const data: string[] = [];
	for (const item of items) {
		if (data.includes(toID(item) === "" ? "No Item" : item)) continue;
		if (toID(item) === "") {
			data.push("No Item");
		} else {
			data.push(item);
		}
	}
	return data.sort();
}

function trimmedMovesArray(moves: string[]) {
	const data: string[] = [];
	for (const move of moves) {
		if (data.includes(move)) continue;
		data.push(move);
	}
	return data.sort();
}

function getRBYMoves(template: string | Template) {
	template = Dex.mod(`gen1`).getTemplate(template);
	let buf = ``;
	if (template.randomBattleMoves) {
		buf += `<details><summary>Randomized moves</summary>`;
		buf += template.randomBattleMoves.map(formatMove).join(", ");
		buf += `</details>`;
	}
	if (template.comboMoves) {
		buf += `<details><summary>Combo moves</summary>`;
		buf += template.comboMoves.map(formatMove).join(", ");
		buf += `</details>`;
	}
	if (template.exclusiveMoves) {
		buf += `<details><summary>Exclusive moves</summary>`;
		buf += template.exclusiveMoves.map(formatMove).join(", ");
		buf += `</details>`;
	}
	if (template.essentialMove) {
		buf += `<details><summary>Essential move</summary>`;
		buf += formatMove(template.essentialMove);
		buf += `</details>`;
	}
	if (
		!template.randomBattleMoves && !template.comboMoves &&
		!template.exclusiveMoves && !template.essentialMove
	) {
		return false;
	}
	return buf;
}

function getGSCMoves(template: string | Template) {
	template = Dex.mod('gen2').getTemplate(template);
	let buf = ``;
	if (!template.randomSets || !template.randomSets.length) return false;
	for (const [i, set] of template.randomSets.entries()) {
		buf += `<details><summary>Set ${i + 1}</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${template.species}`;
		if (set.item) {
			const items = trimmedItemsArray(set.item).map(formatItem).join(" / ");
			buf += ` @ ${items}`;
		}
		buf += `</li>`;
		if (set.baseMove1) buf += `<li>- ${formatMove(set.baseMove1)}</li>`;
		if (set.baseMove2) buf += `<li>- ${formatMove(set.baseMove2)}</li>`;
		if (set.baseMove3) buf += `<li>- ${formatMove(set.baseMove3)}</li>`;
		if (set.baseMove4) buf += `<li>- ${formatMove(set.baseMove4)}</li>`;
		if (set.fillerMoves1) buf += `<li>- ${trimmedMovesArray(set.fillerMoves1).map(formatMove).join(" / ")}</li>`;
		if (set.fillerMoves2) buf += `<li>- ${trimmedMovesArray(set.fillerMoves2).map(formatMove).join(" / ")}</li>`;
		if (set.fillerMoves3) buf += `<li>- ${trimmedMovesArray(set.fillerMoves3).map(formatMove).join(" / ")}</li>`;
		if (set.fillerMoves4) buf += `<li>- ${trimmedMovesArray(set.fillerMoves4).map(formatMove).join(" / ")}</li>`;
		buf += `</ul></details>`;
	}
	return buf;
}

function getLetsGoMoves(template: string | Template) {
	template = Dex.getTemplate(template);
	const isLetsGoLegal = (
		(template.num <= 151 || ['Meltan', 'Melmetal'].includes(template.name)) &&
		(!template.forme || ['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(template.forme))
	);
	if (!isLetsGoLegal) return false;
	if (!template.randomBattleMoves || !template.randomBattleMoves.length) return false;
	return template.randomBattleMoves.map(formatMove).join(`, `);
}

function battleFactorySets(template: string | Template, tier: string | null, gen = 'gen7', isBSS = false) {
	template = Dex.getTemplate(template);
	if (template.battleOnly) template = Dex.getTemplate(Dex.getOutOfBattleSpecies(template));
	gen = toID(gen);
	const genNum = parseInt(gen[3]);
	if (isNaN(genNum) || genNum < 6 || (isBSS && genNum < 7)) return false;
	const statsFile = JSON.parse(
		FS(`data${gen === 'gen8' ? '/' : `/mods/${gen}`}/${isBSS ? `bss-` : ``}factory-sets.json`).readIfExistsSync() ||
		"{}"
	);
	if (!Object.keys(statsFile).length) return false;
	let buf = ``;
	const statNames: {[k: string]: string} = {
		hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe",
	};
	if (!isBSS) {
		if (!tier) return {e: `Please provide a valid tier.`};
		if (!(toID(tier) in TIERS)) return {e: `That tier isn't supported.`};
		const t = statsFile[TIERS[toID(tier)]];
		if (!(template.speciesid in t)) {
			const formatName = Dex.getFormat(`${gen}battlefactory`).name;
			return {e: `${template.species} doesn't have any sets in ${TIERS[toID(tier)]} for ${formatName}.`};
		}
		const setObj = t[template.speciesid];
		buf += `<span style="color:#999999;">Sets for ${template.species} in${genNum === 8 ? `` : ` ${GEN_NAMES[gen]}`} ${TIERS[toID(tier)]}:</span><br />`;
		for (const [i, set] of setObj.sets.entries()) {
			buf += `<details><summary>Set ${i + 1}</summary>`;
			buf += `<ul style="list-style-type:none;">`;
			buf += `<li>${set.species}${set.gender ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(formatItem).join(" / ") : formatItem(set.item)}</li>`;
			buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(formatAbility).join(" / ") : formatAbility(set.ability)}</li>`;
			if (TIERS[toID(tier)] === "LC" && !set.level) buf += `<li>Level: 5</li>`;
			if (set.level && set.level < 100) buf += `<li>Level: ${set.level}</li>`;
			if (set.shiny) buf += `<li>Shiny: Yes</li>`;
			if (set.happiness) buf += `<li>Happiness: ${set.happiness}</li>`;
			if (set.evs) {
				buf += `<li>EVs: `;
				const evs: string[] = [];
				let ev: string;
				for (ev in set.evs) {
					if (set.evs[ev] === 0) continue;
					evs.push(`${set.evs[ev]} ${statNames[ev]}`);
				}
				buf += `${evs.join(" / ")}</li>`;
			}
			buf += `<li>${Array.isArray(set.nature) ? set.nature.map(formatNature).join(" / ") : formatNature(set.nature)} Nature</li>`;
			if (set.ivs) {
				buf += `<li>IVs: `;
				const ivs: string[] = [];
				let iv: string;
				for (iv in set.ivs) {
					if (set.ivs[iv] === 31) continue;
					ivs.push(`${set.ivs[iv]} ${statNames[iv]}`);
				}
				buf += `${ivs.join(" / ")}</li>`;
			}
			for (const moveid of set.moves) {
				buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
			}
			buf += `</ul></details>`;
		}
	} else {
		const format = Dex.getFormat(`${gen}bssfactory`);
		if (!(template.speciesid in statsFile)) return {e: `${template.species} doesn't have any sets in ${format.name}.`};
		const setObj = statsFile[template.speciesid];
		buf += `<span style="color:#999999;">Sets for ${template.species} in ${format.name}:</span><br />`;
		for (const [i, set] of setObj.sets.entries()) {
			buf += `<details><summary>Set ${i + 1}</summary>`;
			buf += `<ul style="list-style-type:none;">`;
			buf += `<li>${set.species}${set.gender ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(formatItem).join(" / ") : formatItem(set.item)}</li>`;
			buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(formatAbility).join(" / ") : formatAbility(set.ability)}</li>`;
			if (!set.level) buf += `<li>Level: 50</li>`;
			if (set.level && set.level < 50) buf += `<li>Level: ${set.level}</li>`;
			if (set.shiny) buf += `<li>Shiny: Yes</li>`;
			if (set.happiness) buf += `<li>Happiness: ${set.happiness}</li>`;
			if (set.evs) {
				buf += `<li>EVs: `;
				const evs: string[] = [];
				let ev: string;
				for (ev in set.evs) {
					if (set.evs[ev] === 0) continue;
					evs.push(`${set.evs[ev]} ${statNames[ev]}`);
				}
				buf += `${evs.join(" / ")}</li>`;
			}
			buf += `<li>${Array.isArray(set.nature) ? set.nature.map(formatNature).join(" / ") : formatNature(set.nature)} Nature</li>`;
			if (set.ivs) {
				buf += `<li>IVs: `;
				const ivs: string[] = [];
				let iv: string;
				for (iv in set.ivs) {
					if (set.ivs[iv] === 31) continue;
					ivs.push(`${set.ivs[iv]} ${statNames[iv]}`);
				}
				buf += `${ivs.join(" / ")}</li>`;
			}
			for (const moveid of set.moves) {
				buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
			}
			buf += `</ul></details>`;
		}
	}
	return buf;
}

export const commands: ChatCommands = {
	'!randombattles': true,
	randbats: 'randombattles',
	randombattles(target, room, user) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!args[0]) return this.parse(`/help randombattles`);
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.getFormat(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		const template = dex.getTemplate(args[0]);
		if (!template.exists) {
			return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' does not exist.`);
		}
		let formatName = dex.getFormat(`gen${dex.gen}randombattle`).name;
		if (toID(args[1]) === 'gen1') {
			const rbyMoves = getRBYMoves(template);
			if (!rbyMoves) {
				return this.errorReply(`Error: ${template.species} has no Random Battle data in ${GEN_NAMES[toID(args[1])]}`);
			}
			return this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}:</span><br />${rbyMoves}`);
		}
		if (toID(args[1]) === 'gen2') {
			const gscMoves = getGSCMoves(template);
			if (!gscMoves) {
				return this.errorReply(`Error: ${template.species} has no Random Battle data in ${GEN_NAMES[toID(args[1])]}`);
			}
			return this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}:</span><br />${gscMoves}`);
		}
		if (toID(args[1]) === 'letsgo') {
			formatName = `[Gen 7 Let's Go] Random Battle`;
			const lgpeMoves = getLetsGoMoves(template);
			if (!lgpeMoves) {
				return this.errorReply(`Error: ${template.species} has no Random Battle data in [Gen 7 Let's Go]`);
			}
			return this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}:</span><br />${lgpeMoves}`);
		}
		if (!template.randomBattleMoves) {
			return this.errorReply(`Error: No moves data found for ${template.species}${`gen${dex.gen}` in GEN_NAMES ? ` in ${GEN_NAMES[`gen${dex.gen}`]}` : ``}.`);
		}
		const moves: string[] = [];
		// Done because template.randomBattleMoves is readonly
		for (const move of template.randomBattleMoves) {
			moves.push(move);
		}
		const m = moves.sort().map(formatMove);
		this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}:</span><br />${m.join(`, `)}`);
	},
	randombattleshelp: [
		`/randombattles OR /randbats [pokemon], [gen] - Displays a Pok\u00e9mon's Random Battle Moves. Defaults to Gen 8. If used in a battle, defaults to the gen of that battle.`,
	],

	'!randomdoublesbattle': true,
	randdubs: 'randomdoublesbattle',
	randomdoublesbattle(target, room, user) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!args[0]) return this.parse(`/help randomdoublesbattle`);
		let dex = Dex;
		if (args[1] && toID(args[1]) in Dex.dexes) {
			dex = Dex.dexes[toID(args[1])];
		} else if (room?.battle) {
			const format = Dex.getFormat(room.battle.format);
			dex = Dex.mod(format.mod);
		}
		if (parseInt(toID(args[1])[3]) < 4) {
			if (room?.battle) {
				dex = Dex.mod('gen8');
			} else {
				return this.parse(`/help randomdoublesbattle`);
			}
		}
		const template = dex.getTemplate(args[0]);
		const formatName = dex.gen > 6 ? dex.getFormat(`gen${dex.gen}randomdoublesbattle`).name : dex.gen === 6 ?
			'[Gen 6] Random Doubles Battle' : dex.gen === 5 ?
				'[Gen 5] Random Doubles Battle' : '[Gen 4] Random Doubles Battle';
		if (!template.exists) {
			return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' does not exist.`);
		}
		if (!template.randomDoubleBattleMoves) {
			return this.errorReply(`Error: No doubles moves data found for ${template.species}${`gen${dex.gen}` in GEN_NAMES ? ` in ${GEN_NAMES[`gen${dex.gen}`]}` : ``}.`);
		}
		const moves: string[] = [];
		// Done because template.randomDoubleBattleMoves is readonly
		for (const move of template.randomDoubleBattleMoves) {
			moves.push(move);
		}
		const m = moves.sort().map(formatMove);
		this.sendReplyBox(`<span style="color:#999999;">Doubles moves for ${template.species} in ${formatName}:</span><br />${m.join(`, `)}`);
	},
	randomdoublesbattlehelp: [
		`/randomdoublesbattle OR /randdubs [pokemon], [gen] - Displays a Pok\u00e9mon's Random Doubles Battle Moves. Supports Gens 4-8. Defaults to Gen 8. If used in a battle, defaults to that gen.`,
	],

	'!battlefactory': true,
	bssfactory: 'battlefactory',
	battlefactory(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		let isBSS = false;
		if (cmd === 'bssfactory') isBSS = true;
		if (isBSS) {
			const args = target.split(',');
			if (!args[0]) return this.parse(`/help battlefactory`);
			const template = Dex.getTemplate(args[0]);
			if (!template.exists) {
				return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' not found.`);
			}
			let mod = 'gen7';
			// There is only [Gen 7] BSS Factory right now
			if (args[1] && toID(args[1]) in Dex.dexes && Dex.dexes[toID(args[1])].gen === 7) mod = toID(args[1]);
			const bssSets = battleFactorySets(template, null, mod, true);
			if (!bssSets) return this.parse(`/help battlefactory`);
			if (typeof bssSets !== 'string') {
				return this.errorReply(`Error: ${bssSets.e}`);
			}
			return this.sendReplyBox(bssSets);
		} else {
			const args = target.split(',');
			if (!args[0]) return this.parse(`/help battlefactory`);
			const template = Dex.getTemplate(args[0]);
			if (!template.exists) {
				return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' not found.`);
			}
			let tier = '';
			if (args[1] && toID(args[1]) in TIERS) {
				tier = TIERS[toID(args[1])];
			} else {
				tier = 'ou';
			}
			const mod = args[2] || 'gen7';
			const bfSets = battleFactorySets(template, tier, mod);
			if (!bfSets) return this.parse(`/help battlefactory`);
			if (typeof bfSets !== 'string') {
				return this.errorReply(`Error: ${bfSets.e}`);
			}
			return this.sendReplyBox(bfSets);
		}
	},
	battlefactoryhelp: [
		`/battlefactory [pokemon], [tier], [gen] - Displays a Pok\u00e9mon's Battle Factory sets. Supports Gens 6-7. Defaults to Gen 7. If no tier is provided, defaults to OU.`,
		`- Supported tiers: OU, Ubers, UU, RU, NU, PU, Monotype (Gen 7 only), LC (Gen 7 only)`,
		`/bssfactory [pokemon], [gen] - Displays a Pok\u00e9mon's BSS Factory sets. Supports Gen 7. Defaults to Gen 7.`,
	],
};
