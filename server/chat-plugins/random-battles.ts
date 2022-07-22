/**
 * Random Battles chat-plugin
 * Written by Kris with inspiration from sirDonovan and The Immortal
 *
 * Set probability code written by Annika
 */

import {FS, Utils} from '../../lib';
import {SSBSet, ssbSets} from '../../data/mods/ssb/random-teams';


interface SetCriteria {
	moves: {mustHave: Move[], mustNotHave: Move[]};
	ability: {mustHave?: Ability, mustNotHave: Ability[]};
	item: {mustHave?: Item, mustNotHave: Item[]};
	nature: {mustHave?: Nature, mustNotHave: Nature[]};
}


function getHTMLCriteriaDescription(criteria: SetCriteria) {
	const format = (list: {name: string}[]) => list.map(m => Utils.html`<strong>${m.name}</strong>`);
	const parts = [];

	const {moves, ability, item, nature} = criteria;

	if (moves.mustHave.length) {
		parts.push(`had the move${Chat.plural(moves.mustHave.length)} ${Chat.toListString(format(moves.mustHave))}`);
	}
	if (moves.mustNotHave.length) {
		parts.push(`did not have the move${Chat.plural(moves.mustNotHave.length)} ${Chat.toListString(format(moves.mustNotHave), 'or')}`);
	}

	if (ability.mustHave) {
		parts.push(Utils.html`had the ability <strong>${ability.mustHave.name}</strong>`);
	}
	if (ability.mustNotHave.length) {
		parts.push(`did not have the ${Chat.plural(ability.mustNotHave.length, 'abilities', 'ability')} ${Chat.toListString(format(ability.mustNotHave), 'or')}`);
	}

	if (item.mustHave) {
		parts.push(Utils.html`had the item <strong>${item.mustHave.name}</strong>`);
	}
	if (item.mustNotHave.length) {
		parts.push(`did not have the item${Chat.plural(item.mustNotHave.length)} ${Chat.toListString(format(item.mustNotHave), 'or')}`);
	}

	if (nature.mustHave) {
		parts.push(Utils.html`had the nature <strong>${nature.mustHave.name}</strong>`);
	}
	if (nature.mustNotHave.length) {
		parts.push(`did not have the nature${Chat.plural(nature.mustNotHave.length)} ${Chat.toListString(format(nature.mustNotHave), 'or')}`);
	}

	return Chat.toListString(parts, 'and');
}

function setProbability(
	species: Species,
	format: Format,
	criteria: SetCriteria,
	rounds = 700
): {rounds: number, matches: number} {
	const results = {rounds, matches: 0};
	const generator = Teams.getGenerator(format);

	for (let i = 0; i < rounds; i++) {
		const set = generator.randomSet(
			species,
			{},
			false,
			format.gameType !== 'singles',
			format.ruleTable?.has('dynamaxclause')
		);

		if (criteria.item.mustHave && set.item !== criteria.item.mustHave.name) continue;
		if (criteria.item.mustNotHave.some(item => item.name === set.item)) continue;

		if (criteria.ability.mustHave && set.ability !== criteria.ability.mustHave.name) continue;
		if (criteria.ability.mustNotHave.some(ability => ability.name === set.ability)) continue;

		if (criteria.nature.mustHave && set.nature !== criteria.nature.mustHave.name) continue;
		if (criteria.nature.mustNotHave.some(nature => nature.name === set.nature)) continue;

		const setHasMove = (move: Move) => {
			const id = move.id === 'hiddenpower' ? `${move.id}${toID(move.type)}` : move.id;
			return set.moves.includes(id);
		};
		if (!criteria.moves.mustHave.every(setHasMove)) continue;
		if (criteria.moves.mustNotHave.some(setHasMove)) continue;

		results.matches++;
	}

	return results;
}

const GEN_NAMES: {[k: string]: string} = {
	gen1: '[Gen 1]', gen2: '[Gen 2]', gen3: '[Gen 3]', gen4: '[Gen 4]', gen5: '[Gen 5]', gen6: '[Gen 6]', gen7: '[Gen 7]',
};

const STAT_NAMES: {[k: string]: string} = {
	hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe",
};

const TIERS: {[k: string]: string} = {
	uber: "Uber", ubers: "Uber",
	ou: "OU", uu: "UU", ru: "RU", nu: "NU", pu: "PU",
	mono: "Mono", monotype: "Mono", lc: "LC", littlecup: "LC",
};

function formatAbility(ability: Ability | string) {
	ability = Dex.abilities.get(ability);
	return `<a href="https://${Config.routes.dex}/abilities/${ability.id}" target="_blank" class="subtle" style="white-space:nowrap">${ability.name}</a>`;
}
function formatNature(n: string) {
	const nature = Dex.natures.get(n);
	return nature.name;
}

function formatMove(move: Move | string) {
	move = Dex.moves.get(move);
	return `<a href="https://${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}

function formatItem(item: Item | string) {
	if (typeof item === 'string' && item === "No Item") {
		return `No Item`;
	} else {
		item = Dex.items.get(item);
		return `<a href="https://${Config.routes.dex}/items/${item.id}" target="_blank" class="subtle" style="white-space:nowrap">${item.name}</a>`;
	}
}

function getRBYMoves(species: string | Species) {
	species = Dex.mod(`gen1`).species.get(species);
	let buf = ``;
	if (species.randomBattleMoves) {
		buf += `<details><summary>Randomized moves</summary>`;
		buf += species.randomBattleMoves.map(formatMove).sort().join(", ");
		buf += `</details>`;
	}
	if (species.comboMoves) {
		buf += `<details><summary>Combo moves</summary>`;
		buf += species.comboMoves.map(formatMove).sort().join(", ");
		buf += `</details>`;
	}
	if (species.exclusiveMoves) {
		buf += `<details><summary>Exclusive moves</summary>`;
		buf += species.exclusiveMoves.map(formatMove).sort().join(", ");
		buf += `</details>`;
	}
	if (species.essentialMove) {
		buf += `<details><summary>Essential move</summary>`;
		buf += formatMove(species.essentialMove);
		buf += `</details>`;
	}
	if (
		!species.randomBattleMoves && !species.comboMoves &&
		!species.exclusiveMoves && !species.essentialMove
	) {
		return false;
	}
	return buf;
}

function getLetsGoMoves(species: string | Species) {
	species = Dex.species.get(species);
	const isLetsGoLegal = (
		(species.num <= 151 || ['Meltan', 'Melmetal'].includes(species.name)) &&
		(!species.forme || ['Alola', 'Mega', 'Mega-X', 'Mega-Y', 'Starter'].includes(species.forme))
	);
	if (!isLetsGoLegal) return false;
	if (!species.randomBattleMoves?.length) return false;
	return species.randomBattleMoves.map(formatMove).sort().join(`, `);
}

function battleFactorySets(species: string | Species, tier: string | null, gen = 'gen7', isBSS = false) {
	species = Dex.species.get(species);
	if (typeof species.battleOnly === 'string') {
		species = Dex.species.get(species.battleOnly);
	}
	gen = toID(gen);
	const genNum = parseInt(gen[3]);
	if (isNaN(genNum) || genNum < 6 || (isBSS && genNum < 7)) return null;
	const statsFile = JSON.parse(
		FS(`data${gen === 'gen8' ? '/' : `/mods/${gen}`}/${isBSS ? `bss-` : ``}factory-sets.json`).readIfExistsSync() ||
		"{}"
	);
	if (!Object.keys(statsFile).length) return null;
	let buf = ``;
	if (!isBSS) {
		if (!tier) return {e: `Please provide a valid tier.`};
		if (!(toID(tier) in TIERS)) return {e: `That tier isn't supported.`};
		if (['Mono', 'LC'].includes(TIERS[toID(tier)]) && genNum < 7) {
			return {e: `${TIERS[toID(tier)]} is not included in [Gen ${genNum}] Battle Factory.`};
		}
		const t = statsFile[TIERS[toID(tier)]];
		if (!(species.id in t)) {
			const formatName = Dex.formats.get(`${gen}battlefactory`).name;
			return {e: `${species.name} doesn't have any sets in ${TIERS[toID(tier)]} for ${formatName}.`};
		}
		const setObj = t[species.id];
		buf += `<span style="color:#999999;">Sets for ${species.name} in${genNum === 8 ? `` : ` ${GEN_NAMES[gen]}`} ${TIERS[toID(tier)]}:</span><br />`;
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
					evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
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
					ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
				}
				buf += `${ivs.join(" / ")}</li>`;
			}
			for (const moveid of set.moves) {
				buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
			}
			buf += `</ul></details>`;
		}
	} else {
		const format = Dex.formats.get(`${gen}bssfactory`);
		if (!(species.id in statsFile)) return {e: `${species.name} doesn't have any sets in ${format.name}.`};
		const setObj = statsFile[species.id];
		buf += `<span style="color:#999999;">Sets for ${species.name} in ${format.name}:</span><br />`;
		for (const [i, set] of setObj.sets.entries()) {
			buf += `<details><summary>Set ${i + 1}</summary>`;
			buf += `<ul style="list-style-type:none;padding-left:0;">`;
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
					evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
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
					ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
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

function CAP1v1Sets(species: string | Species) {
	species = Dex.species.get(species);
	const statsFile = JSON.parse(
		FS(`data/cap-1v1-sets.json`).readIfExistsSync() ||
		"{}"
	);
	if (!Object.keys(statsFile).length) return null;
	if (species.isNonstandard !== "CAP") {
		return {
			e: `[Gen 8] CAP 1v1 only allows Pok\u00e9mon created by the Create-A-Pok\u00e9mon Project.`,
			parse: `/cap`,
		};
	}
	if (species.isNonstandard === "CAP" && !(species.name in statsFile)) {
		return {e: `${species.name} doesn't have any sets in [Gen 8] CAP 1v1.`};
	}
	let buf = `<span style="color:#999999;">Sets for ${species.name} in [Gen 8] CAP 1v1:</span><br />`;
	for (const [i, set] of statsFile[species.name].entries()) {
		buf += `<details><summary>Set ${i + 1}</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${set.species || species.name}${set.gender ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(formatItem).join(" / ") : formatItem(set.item)}</li>`;
		buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(formatAbility).join(" / ") : formatAbility(set.ability)}</li>`;
		if (set.level && set.level < 100) buf += `<li>Level: ${set.level}</li>`;
		if (set.shiny) buf += `<li>Shiny: Yes</li>`;
		if (set.happiness) buf += `<li>Happiness: ${set.happiness}</li>`;
		if (set.evs) {
			buf += `<li>EVs: `;
			const evs: string[] = [];
			let ev: string;
			for (ev in set.evs) {
				if (set.evs[ev] === 0) continue;
				evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
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
				ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
			}
			buf += `${ivs.join(" / ")}</li>`;
		}
		for (const moveid of set.moves) {
			buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
		}
		buf += `</ul></details>`;
	}
	return buf;
}

function generateSSBSet(set: SSBSet, dex: ModdedDex, baseDex: ModdedDex) {
	if (set.skip) {
		const baseSet = toID(Object.values(ssbSets[set.skip]).join());
		const skipSet = toID(Object.values(set).join()).slice(0, -toID(set.skip).length);
		if (baseSet === skipSet) return ``;
	}
	let buf = ``;
	buf += `<details><summary>Set</summary>`;
	buf += `<ul style="list-style-type:none;"><li>${set.species}${set.gender !== '' ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(x => dex.items.get(x).name).join(' / ') : dex.items.get(set.item).name}</li>`;
	buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(x => dex.abilities.get(x).name).join(' / ') : dex.abilities.get(set.ability).name}</li>`;
	if (set.shiny) buf += `<li>Shiny: ${typeof set.shiny === 'number' ? `Sometimes` : `Yes`}</li>`;
	if (set.evs) {
		const evs: string[] = [];
		let ev: StatID;
		for (ev in set.evs) {
			if (set.evs[ev] === 0) continue;
			evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
		}
		buf += `<li>EVs: ${evs.join(" / ")}</li>`;
	}
	if (set.nature) {
		buf += `<li>${Array.isArray(set.nature) ? set.nature.join(" / ") : formatNature(set.nature)} Nature</li>`;
	}
	if (set.ivs) {
		const ivs: string[] = [];
		let iv: StatID;
		for (iv in set.ivs) {
			if (set.ivs[iv] === 31) continue;
			ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
		}
		buf += `<li>IVs: ${ivs.join(" / ")}</li>`;
	}
	for (const moveid of set.moves) {
		buf += `<li>- ${Array.isArray(moveid) ? moveid.map(x => dex.moves.get(x).name).join(" / ") : dex.moves.get(moveid).name}</li>`;
	}
	const italicize = !baseDex.moves.get(set.signatureMove).exists;
	buf += `<li>- ${italicize ? `<i>` : ``}${dex.moves.get(set.signatureMove).name}${italicize ? `</i>` : ``}</li>`;
	buf += `</ul>`;
	buf += `</details>`;
	return buf;
}

function generateSSBMoveInfo(sigMove: Move, dex: ModdedDex) {
	let buf = ``;
	if (sigMove.shortDesc || sigMove.desc) {
		buf += `<hr />`;
		buf += Chat.getDataMoveHTML(sigMove);
		const details: {[k: string]: string} = {
			Priority: String(sigMove.priority),
			Gen: String(sigMove.gen) || 'CAP',
		};

		if (sigMove.isNonstandard === "Past" && dex.gen >= 8) details["&#10007; Past Gens Only"] = "";
		if (sigMove.secondary || sigMove.secondaries) details["&#10003; Secondary effect"] = "";
		if (sigMove.flags['contact']) details["&#10003; Contact"] = "";
		if (sigMove.flags['sound']) details["&#10003; Sound"] = "";
		if (sigMove.flags['bullet']) details["&#10003; Bullet"] = "";
		if (sigMove.flags['pulse']) details["&#10003; Pulse"] = "";
		if (!sigMove.flags['protect'] && !/(ally|self)/i.test(sigMove.target)) details["&#10003; Bypasses Protect"] = "";
		if (sigMove.flags['bypasssub']) details["&#10003; Bypasses Substitutes"] = "";
		if (sigMove.flags['defrost']) details["&#10003; Thaws user"] = "";
		if (sigMove.flags['bite']) details["&#10003; Bite"] = "";
		if (sigMove.flags['punch']) details["&#10003; Punch"] = "";
		if (sigMove.flags['powder']) details["&#10003; Powder"] = "";
		if (sigMove.flags['reflectable']) details["&#10003; Bounceable"] = "";
		if (sigMove.flags['charge']) details["&#10003; Two-turn move"] = "";
		if (sigMove.flags['recharge']) details["&#10003; Has recharge turn"] = "";
		if (sigMove.flags['gravity']) details["&#10007; Suppressed by Gravity"] = "";
		if (sigMove.flags['dance']) details["&#10003; Dance move"] = "";

		if (sigMove.zMove?.basePower) {
			details["Z-Power"] = String(sigMove.zMove.basePower);
		} else if (sigMove.zMove?.effect) {
			const zEffects: {[k: string]: string} = {
				clearnegativeboost: "Restores negative stat stages to 0",
				crit2: "Crit ratio +2",
				heal: "Restores HP 100%",
				curse: "Restores HP 100% if user is Ghost type, otherwise Attack +1",
				redirect: "Redirects opposing attacks to user",
				healreplacement: "Restores replacement's HP 100%",
			};
			details["Z-Effect"] = zEffects[sigMove.zMove.effect];
		} else if (sigMove.zMove?.boost) {
			details["Z-Effect"] = "";
			const boost = sigMove.zMove.boost;
			for (const h in boost) {
				details["Z-Effect"] += ` ${Dex.stats.mediumNames[h as 'atk']} +${boost[h as 'atk']}`;
			}
		} else if (sigMove.isZ && typeof sigMove.isZ === 'string') {
			details["&#10003; Z-Move"] = "";
			const zCrystal = dex.items.get(sigMove.isZ);
			details["Z-Crystal"] = zCrystal.name;
			if (zCrystal.itemUser) {
				details["User"] = zCrystal.itemUser.join(", ");
				details["Required Move"] = dex.items.get(sigMove.isZ).zMoveFrom!;
			}
		} else {
			details["Z-Effect"] = "None";
		}

		const targetTypes: {[k: string]: string} = {
			normal: "One Adjacent Pok\u00e9mon",
			self: "User",
			adjacentAlly: "One Ally",
			adjacentAllyOrSelf: "User or Ally",
			adjacentFoe: "One Adjacent Opposing Pok\u00e9mon",
			allAdjacentFoes: "All Adjacent Opponents",
			foeSide: "Opposing Side",
			allySide: "User's Side",
			allyTeam: "User's Side",
			allAdjacent: "All Adjacent Pok\u00e9mon",
			any: "Any Pok\u00e9mon",
			all: "All Pok\u00e9mon",
			scripted: "Chosen Automatically",
			randomNormal: "Random Adjacent Opposing Pok\u00e9mon",
			allies: "User and Allies",
		};
		details["Target"] = targetTypes[sigMove.target] || "Unknown";
		if (sigMove.isNonstandard === 'Unobtainable') {
			details[`Unobtainable in Gen ${dex.gen}`] = "";
		}
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
		if (sigMove.desc && sigMove.desc !== sigMove.shortDesc) {
			buf += `<details><summary><strong>In-Depth Description</strong></summary>${sigMove.desc}</details>`;
		}
	}
	return buf;
}

function generateSSBItemInfo(set: SSBSet, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	if (!Array.isArray(set.item)) {
		const baseItem = baseDex.items.get(set.item);
		const sigItem = dex.items.get(set.item);
		if (!baseItem.exists || (baseItem.desc || baseItem.shortDesc) !== (sigItem.desc || sigItem.shortDesc)) {
			buf += `<hr />`;
			buf += Chat.getDataItemHTML(sigItem);
			const details: {[k: string]: string} = {
				Gen: String(sigItem.gen),
			};

			if (dex.gen >= 4) {
				if (sigItem.fling) {
					details["Fling Base Power"] = String(sigItem.fling.basePower);
					if (sigItem.fling.status) details["Fling Effect"] = sigItem.fling.status;
					if (sigItem.fling.volatileStatus) details["Fling Effect"] = sigItem.fling.volatileStatus;
					if (sigItem.isBerry) details["Fling Effect"] = "Activates the Berry's effect on the target.";
					if (sigItem.id === 'whiteherb') details["Fling Effect"] = "Restores the target's negative stat stages to 0.";
					if (sigItem.id === 'mentalherb') {
						const flingEffect = "Removes the effects of Attract, Disable, Encore, Heal Block, Taunt, and Torment from the target.";
						details["Fling Effect"] = flingEffect;
					}
				} else {
					details["Fling"] = "This item cannot be used with Fling.";
				}
			}
			if (sigItem.naturalGift && dex.gen >= 3) {
				details["Natural Gift Type"] = sigItem.naturalGift.type;
				details["Natural Gift Base Power"] = String(sigItem.naturalGift.basePower);
			}
			if (sigItem.isNonstandard && sigItem.isNonstandard !== "Custom") {
				details[`Unobtainable in Gen ${dex.gen}`] = "";
			}
			buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
				value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
			)).join("&nbsp;|&ThickSpace;")}</font>`;
		}
	}
	return buf;
}

function generateSSBAbilityInfo(set: SSBSet, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	if (!Array.isArray(set.ability) && !baseDex.abilities.get(set.ability).exists) {
		const sigAbil = Dex.deepClone(dex.abilities.get(set.ability));
		if (!sigAbil.desc && !sigAbil.shortDesc) {
			sigAbil.desc = `This ability doesn't have a description. Try contacting the SSB dev team.`;
		}
		buf += `<hr />`;
		buf += Chat.getDataAbilityHTML(sigAbil);
		const details: {[k: string]: string} = {
			Gen: String(sigAbil.gen) || 'CAP',
		};
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
		if (sigAbil.desc && sigAbil.shortDesc && sigAbil.desc !== sigAbil.shortDesc) {
			buf += `<details><summary><strong>In-Depth Description</strong></summary>${sigAbil.desc}</details>`;
		}
	}
	return buf;
}

function generateSSBPokemonInfo(species: string, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	const origSpecies = baseDex.species.get(species);
	const newSpecies = dex.species.get(species);
	if (
		newSpecies.types.join('/') !== origSpecies.types.join('/') ||
		Object.values(newSpecies.abilities).join('/') !== Object.values(origSpecies.abilities).join('/') ||
		Object.values(newSpecies.baseStats).join('/') !== Object.values(origSpecies.baseStats).join('/')
	) {
		buf += `<hr />`;
		buf += Chat.getDataPokemonHTML(newSpecies, dex.gen, 'SSB');
		let weighthit = 20;
		if (newSpecies.weighthg >= 2000) {
			weighthit = 120;
		} else if (newSpecies.weighthg >= 1000) {
			weighthit = 100;
		} else if (newSpecies.weighthg >= 500) {
			weighthit = 80;
		} else if (newSpecies.weighthg >= 250) {
			weighthit = 60;
		} else if (newSpecies.weighthg >= 100) {
			weighthit = 40;
		}
		const details: {[k: string]: string} = {
			"Dex#": String(newSpecies.num),
			Gen: String(newSpecies.gen) || 'CAP',
			Height: `${newSpecies.heightm} m`,
		};
		details["Weight"] = `${newSpecies.weighthg / 10} kg <em>(${weighthit} BP)</em>`;
		if (newSpecies.color && dex.gen >= 5) details["Dex Colour"] = newSpecies.color;
		if (newSpecies.eggGroups && dex.gen >= 2) details["Egg Group(s)"] = newSpecies.eggGroups.join(", ");
		const evos: string[] = [];
		for (const evoName of newSpecies.evos) {
			const evo = dex.species.get(evoName);
			if (evo.gen <= dex.gen) {
				const condition = evo.evoCondition ? ` ${evo.evoCondition}` : ``;
				switch (evo.evoType) {
				case 'levelExtra':
					evos.push(`${evo.name} (level-up${condition})`);
					break;
				case 'levelFriendship':
					evos.push(`${evo.name} (level-up with high Friendship${condition})`);
					break;
				case 'levelHold':
					evos.push(`${evo.name} (level-up holding ${evo.evoItem}${condition})`);
					break;
				case 'useItem':
					evos.push(`${evo.name} (${evo.evoItem})`);
					break;
				case 'levelMove':
					evos.push(`${evo.name} (level-up with ${evo.evoMove}${condition})`);
					break;
				case 'other':
					evos.push(`${evo.name} (${evo.evoCondition})`);
					break;
				case 'trade':
					evos.push(`${evo.name} (trade${evo.evoItem ? ` holding ${evo.evoItem}` : condition})`);
					break;
				default:
					evos.push(`${evo.name} (${evo.evoLevel}${condition})`);
				}
			}
		}
		if (!evos.length) {
			details[`<font color="#686868">Does Not Evolve</font>`] = "";
		} else {
			details["Evolution"] = evos.join(", ");
		}
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
	}
	return buf;
}

function generateSSBInnateInfo(name: string, dex: ModdedDex, baseDex: ModdedDex) {
	let buf = ``;
	// Special casing for users whose usernames are already existing, i.e. Perish Song
	let effect = dex.conditions.get(name + 'user');
	let longDesc = ``;
	const baseAbility = Dex.deepClone(baseDex.abilities.get('noability'));
	// @ts-ignore hack to record the name of the innate abilities without using name
	if (effect.exists && effect.innateName && (effect.desc || effect.shortDesc)) {
		// @ts-ignore hack
		baseAbility.name = effect.innateName;
		if (effect.desc) baseAbility.desc = effect.desc;
		if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
		buf += `<hr />Innate Ability:<br />${Chat.getDataAbilityHTML(baseAbility)}`;
		if (effect.desc && effect.shortDesc && effect.desc !== effect.shortDesc) {
			longDesc = effect.desc;
		}
	} else {
		effect = dex.conditions.get(name);
		// @ts-ignore hack
		if (effect.exists && effect.innateName && (effect.desc || effect.shortDesc)) {
			// @ts-ignore hack
			baseAbility.name = effect.innateName;
			if (effect.desc) baseAbility.desc = effect.desc;
			if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
			buf += `<hr />Innate Ability:<br />${Chat.getDataAbilityHTML(baseAbility)}`;
			if (effect.desc && effect.shortDesc && effect.desc !== effect.shortDesc) {
				longDesc = effect.desc;
			}
		}
	}
	if (buf) {
		const details: {[k: string]: string} = {Gen: '8'};
		buf += `<font size="1">${Object.entries(details).map(([detail, value]) => (
			value === '' ? detail : `<font color="#686868">${detail}:</font> ${value}`
		)).join("&nbsp;|&ThickSpace;")}</font>`;
	}
	if (longDesc) {
		buf += `<details><summary><strong>In-Depth Description</strong></summary>${longDesc}</details>`;
	}
	return buf;
}

function SSBSets(target: string) {
	const baseDex = Dex;
	const dex = Dex.forFormat('gen8superstaffbros4');
	if (!Object.keys(ssbSets).map(toID).includes(toID(target))) {
		return {e: `Error: ${target.trim()} doesn't have a [Gen 8] Super Staff Bros 4 set.`};
	}
	let displayName = '';
	const names = [];
	for (const member in ssbSets) {
		if (toID(member).startsWith(toID(target))) names.push(member);
		if (toID(member) === toID(target)) displayName = member;
	}
	let buf = '';
	for (const name of names) {
		if (buf) buf += `<hr>`;
		const set = ssbSets[name];
		const mutatedSpecies = dex.species.get(set.species);
		if (!set.skip) {
			buf += Utils.html`<h1><psicon pokemon="${mutatedSpecies.id}">${displayName === 'yuki' ? name : displayName}</h1>`;
		} else {
			buf += `<details><summary><psicon pokemon="${set.species}"><strong>${name.split('-').slice(1).join('-') + ' forme'}</strong></summary>`;
		}
		buf += generateSSBSet(set, dex, baseDex);
		const item = dex.items.get(set.item as string);
		if (!set.skip || set.signatureMove !== ssbSets[set.skip].signatureMove) {
			const sigMove = baseDex.moves.get(set.signatureMove).exists && !Array.isArray(set.item) &&
				typeof item.zMove === 'string' ?
				dex.moves.get(item.zMove) : dex.moves.get(set.signatureMove);
			buf += generateSSBMoveInfo(sigMove, dex);
			if (sigMove.id === 'blackbird') buf += generateSSBMoveInfo(dex.moves.get('gaelstrom'), dex);
		}
		buf += generateSSBItemInfo(set, dex, baseDex);
		buf += generateSSBAbilityInfo(set, dex, baseDex);
		buf += generateSSBInnateInfo(name, dex, baseDex);
		buf += generateSSBPokemonInfo(set.species, dex, baseDex);
		if (!Array.isArray(set.item) && item.megaStone) {
			buf += generateSSBPokemonInfo(item.megaStone, dex, baseDex);
		// Psynergy, Struchni, and Raj.shoot have itemless Mega Evolutions
		} else if (['Aggron', 'Rayquaza'].includes(set.species)) {
			buf += generateSSBPokemonInfo(`${set.species}-Mega`, dex, baseDex);
		} else if (set.species === 'Charizard') {
			buf += generateSSBPokemonInfo('Charizard-Mega-X', dex, baseDex);
		}
		if (set.skip) buf += `</details>`;
	}
	return buf;
}

export const commands: Chat.ChatCommands = {
	randbats: 'randombattles',
	randombattles(target, room, user) {
		if (!this.runBroadcast()) return;
		if (room?.battle?.format.includes('nodmax')) return this.parse(`/randombattlenodmax ${target}`);
		if (room?.battle?.format.includes('doubles')) return this.parse(`/randomdoublesbattle ${target}`);

		const args = target.split(',');
		if (!args[0]) return this.parse(`/help randombattles`);

		const {dex} = this.splitFormat(target, true);
		const isLetsGo = (dex.currentMod === 'gen7letsgo');

		const species = dex.species.get(args[0]);
		if (!species.exists) {
			return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' does not exist.`);
		}
		const extraFormatModifier = isLetsGo ? 'letsgo' : (dex.currentMod === 'gen8bdsp' ? 'bdsp' : '');
		let formatName = dex.formats.get(`gen${dex.gen}${extraFormatModifier}randombattle`).name;

		const movesets = [];
		if (dex.gen === 1) {
			const rbyMoves = getRBYMoves(species);
			if (!rbyMoves) {
				return this.errorReply(`Error: ${species.name} has no Random Battle data in ${GEN_NAMES[toID(args[1])]}`);
			}
			movesets.push(`<span style="color:#999999;">Moves for ${species.name} in ${formatName}:</span><br />${rbyMoves}`);
		} else if (isLetsGo) {
			formatName = `[Gen 7 Let's Go] Random Battle`;
			const lgpeMoves = getLetsGoMoves(species);
			if (!lgpeMoves) {
				return this.errorReply(`Error: ${species.name} has no Random Battle data in [Gen 7 Let's Go]`);
			}
			movesets.push(`<span style="color:#999999;">Moves for ${species.name} in ${formatName}:</span><br />${lgpeMoves}`);
		} else {
			const setsToCheck = [species];
			if (dex.gen > 7) setsToCheck.push(dex.species.get(`${args[0]}gmax`));
			if (species.otherFormes) setsToCheck.push(...species.otherFormes.map(pkmn => dex.species.get(pkmn)));

			for (const pokemon of setsToCheck) {
				if (!pokemon.randomBattleMoves || pokemon.isNonstandard === 'Future') continue;
				const randomMoves = pokemon.randomBattleMoves.slice();
				const m = randomMoves.sort().map(formatMove);
				movesets.push(
					`<details${!movesets.length ? ' open' : ''}>` +
					`<summary><span style="color:#999999;">Moves for ${pokemon.name} in ${formatName}:<span style="color:#999999;"></summary>` +
					`${m.join(`, `)}</details>`
				);
			}
		}

		if (!movesets.length) {
			return this.errorReply(`Error: ${species.name} has no Random Battle data in ${formatName}`);
		}
		this.sendReplyBox(movesets.join('<hr />'));
	},
	randombattleshelp: [
		`/randombattles OR /randbats [pokemon], [gen] - Displays a Pok\u00e9mon's Random Battle Moves. Defaults to Gen 8. If used in a battle, defaults to the gen of that battle.`,
	],

	randdubs: 'randomdoublesbattle',
	randomdoublesbattle(target, room, user) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!args[0]) return this.parse(`/help randomdoublesbattle`);

		const {dex} = this.splitFormat(target, true);
		if (dex.gen < 4) return this.parse(`/help randomdoublesbattle`);

		const species = dex.species.get(args[0]);
		const formatName = dex.gen > 6 ? dex.formats.get(`gen${dex.gen}randomdoublesbattle`).name : dex.gen === 6 ?
			'[Gen 6] Random Doubles Battle' : dex.gen === 5 ?
				'[Gen 5] Random Doubles Battle' : '[Gen 4] Random Doubles Battle';
		if (!species.exists) {
			return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' does not exist.`);
		}

		const setsToCheck = [species];
		if (dex.gen > 7) setsToCheck.push(dex.species.get(`${args[0]}gmax`));
		if (species.otherFormes) setsToCheck.push(...species.otherFormes.map(pkmn => dex.species.get(pkmn)));

		const movesets = [];
		for (const pokemon of setsToCheck) {
			if (!pokemon.randomDoubleBattleMoves) continue;
			const moves: string[] = [...pokemon.randomDoubleBattleMoves];
			const m = moves.sort().map(formatMove);
			movesets.push(`<span style="color:#999999;">Doubles moves for ${pokemon.name} in ${formatName}:</span><br />${m.join(`, `)}`);
		}
		this.sendReplyBox(movesets.join('<hr />'));
	},
	randomdoublesbattlehelp: [
		`/randomdoublesbattle OR /randdubs [pokemon], [gen] - Displays a Pok\u00e9mon's Random Doubles Battle Moves. Supports Gens 4-8. Defaults to Gen 8. If used in a battle, defaults to that gen.`,
	],

	randsnodmax: 'randombattlenodmax',
	randombattlenodmax(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse(`/help randombattlenodmax`);

		const dex = Dex.forFormat('gen8randombattlenodmax');
		let species = dex.species.get(target);

		if (!species.exists) {
			throw new Chat.ErrorMessage(`Error: Pok\u00e9mon '${target.trim()}' does not exist.`);
		}

		let randomMoves = species.randomBattleNoDynamaxMoves || species.randomBattleMoves;
		if (!randomMoves) {
			const gmaxSpecies = dex.species.get(`${target}gmax`);
			if (!gmaxSpecies.exists || !gmaxSpecies.randomBattleMoves) {
				return this.errorReply(`Error: No move data found for ${species.name} in [Gen 8] Random Battle (No Dmax).`);
			}
			species = gmaxSpecies;
			randomMoves = gmaxSpecies.randomBattleNoDynamaxMoves || gmaxSpecies.randomBattleMoves;
		}

		const m = [...randomMoves].sort().map(formatMove);
		this.sendReplyBox(`<span style="color:#999999;">Moves for ${species.name} in [Gen 8] Random Battle (No Dmax):</span><br />${m.join(`, `)}`);
	},
	randombattlenodmaxhelp: [
		`/randombattlenodmax OR /randsnodmax [pokemon] - Displays a Pok\u00e9mon's Random Battle (No Dmax) moves.`,
	],

	bssfactory: 'battlefactory',
	battlefactory(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		const isBSS = cmd === 'bssfactory';
		if (isBSS) {
			const args = target.split(',');
			if (!args[0]) return this.parse(`/help battlefactory`);
			const species = Dex.species.get(args[0]);
			if (!species.exists) {
				return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' not found.`);
			}
			let mod = 'gen8';
			// There is only [Gen 7] BSS Factory right now
			if (args[1] && toID(args[1]) in Dex.dexes && Dex.dexes[toID(args[1])].gen === 7) mod = toID(args[1]);
			const bssSets = battleFactorySets(species, null, mod, true);
			if (!bssSets) return this.parse(`/help battlefactory`);
			if (typeof bssSets !== 'string') {
				return this.errorReply(`Error: ${bssSets.e}`);
			}
			return this.sendReplyBox(bssSets);
		} else {
			const args = target.split(',');
			if (!args[0]) return this.parse(`/help battlefactory`);
			const species = Dex.species.get(args[0]);
			if (!species.exists) {
				return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' not found.`);
			}
			let tier = '';
			if (args[1] && toID(args[1]) in TIERS) {
				tier = TIERS[toID(args[1])];
			} else {
				tier = 'ou';
			}
			const mod = args[2] || 'gen7';
			let bfSets;
			if (species.name === 'Necrozma-Ultra') {
				bfSets = battleFactorySets(Dex.species.get('necrozma-dawnwings'), tier, mod);
				if (typeof bfSets === 'string') {
					bfSets += battleFactorySets(Dex.species.get('necrozma-duskmane'), tier, mod);
				}
			} else if (species.name === 'Zygarde-Complete') {
				bfSets = battleFactorySets(Dex.species.get('zygarde'), tier, mod);
				if (typeof bfSets === 'string') {
					bfSets += battleFactorySets(Dex.species.get('zygarde-10'), tier, mod);
				}
			} else {
				bfSets = battleFactorySets(species, tier, mod);
			}
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

	cap1v1(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse(`/help cap1v1`);
		const species = Dex.species.get(target);
		if (!species.exists) return this.errorReply(`Error: Pok\u00e9mon '${target.trim()}' not found.`);
		const cap1v1Set = CAP1v1Sets(species);
		if (!cap1v1Set) return this.parse(`/help cap1v1`);
		if (typeof cap1v1Set !== 'string') {
			this.errorReply(`Error: ${cap1v1Set.e}`);
			if (cap1v1Set.parse) this.parse(cap1v1Set.parse);
			return;
		}
		return this.sendReplyBox(cap1v1Set);
	},
	cap1v1help: [
		`/cap1v1 [pokemon] - Displays a Pok\u00e9mon's CAP 1v1 sets.`,
	],

	ssb(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse(`/help ssb`);
		const set = SSBSets(target);
		if (typeof set !== 'string') {
			throw new Chat.ErrorMessage(set.e);
		}
		return this.sendReplyBox(set);
	},
	ssbhelp: [
		`/ssb [staff member] - Displays a staff member's Super Staff Bros. set and custom features.`,
	],

	setodds: 'randombattlesetprobabilities',
	randbatsodds: 'randombattlesetprobabilities',
	randbatsprobabilities: 'randombattlesetprobabilities',
	randombattlesetprobabilities(target, room, user) {
		// Restricted to global staff and randbats room staff
		const randbatsRoom = Rooms.get('randombattles');
		if (randbatsRoom) {
			if (!user.can('lock')) this.checkCan('mute', null, randbatsRoom);
		} else {
			this.checkCan('lock');
		}

		if (!target) return this.parse(`/help randombattlesetprobabilities`);
		this.runBroadcast();

		const args = target.split(',');
		if (args.length < 2) return this.parse(`/help randombattlesetprobabilities`);

		// Optional format
		let format = Dex.formats.get('gen8randombattle');
		let formatOrSpecies = args.shift();
		const possibleFormat = Dex.formats.get(formatOrSpecies);
		if (possibleFormat.exists) {
			if (!possibleFormat.team) {
				throw new Chat.ErrorMessage(`${possibleFormat.name} does not have randomly-generated teams.`);
			}
			format = possibleFormat;
			formatOrSpecies = args.shift();
		}
		const dex = Dex.forFormat(format);

		// Species
		const species = dex.species.get(formatOrSpecies);
		if (!species.exists) {
			throw new Chat.ErrorMessage(`Species ${species.name} does not exist in the specified format.`);
		}
		if (!species.randomBattleMoves && !species.randomDoubleBattleMoves && !species.randomBattleNoDynamaxMoves) {
			const modMessage = dex.currentMod === 'base' ? format.name : dex.currentMod;
			throw new Chat.ErrorMessage(`${species.name} does not have random battle moves in ${modMessage}.`);
		}

		// Criteria
		const criteria: SetCriteria = {
			moves: {mustHave: [], mustNotHave: []},
			item: {mustNotHave: []},
			ability: {mustNotHave: []},
			nature: {mustNotHave: []},
		};

		if (args.length < 1) {
			this.errorReply(`You must specify at least one condition.`);
			return this.parse(`/help randombattlesetprobabilities`);
		}

		for (const arg of args) {
			let [key, value] = arg.split('=');
			key = toID(key);
			if (!value || !key) {
				this.errorReply(`Invalid condition format: ${arg}`);
				return this.parse(`/help randombattlesetprobabilities`);
			}

			switch (key) {
			case 'moves':
				for (const rawMove of value.split('&')) {
					const move = dex.moves.get(rawMove);
					if (!move.exists) {
						throw new Chat.ErrorMessage(`"${rawMove}" is not a move in the specified format.`);
					}

					const isNegation = rawMove.trim().startsWith('!');
					if (isNegation) {
						criteria.moves.mustNotHave.push(move);
					} else {
						criteria.moves.mustHave.push(move);
					}
				}
				break;
			case 'item':
				const item = dex.items.get(value);
				if (!item.exists) {
					throw new Chat.ErrorMessage(`"${value}" is not an item in the specified format.`);
				}

				const itemNegation = value.trim().startsWith('!');
				if (itemNegation) {
					criteria.item.mustNotHave.push(item);
				} else {
					if (criteria.item.mustHave) {
						throw new Chat.ErrorMessage(`Impossible situation: two items (${criteria.item.mustHave.name} and ${item.name}) are required.`);
					}
					criteria.item.mustHave = item;
				}
				break;
			case 'ability':
				const ability = dex.abilities.get(value);
				if (!ability.exists) {
					throw new Chat.ErrorMessage(`"${value}" is not an ability in the specified format.`);
				}

				const abilityNegation = value.trim().startsWith('!');
				if (abilityNegation) {
					criteria.ability.mustNotHave.push(ability);
				} else {
					if (criteria.ability.mustHave) {
						throw new Chat.ErrorMessage(`Impossible situation: two abilities (${criteria.ability.mustHave.name} and ${ability.name}) are required.`);
					}
					criteria.ability.mustHave = ability;
				}
				break;
			case 'nature':
				const nature = dex.natures.get(value);
				if (!nature.exists) {
					throw new Chat.ErrorMessage(`"${value}" is not a nature in the specified format.`);
				}

				const natureNegation = value.trim().startsWith('!');
				if (natureNegation) {
					criteria.nature.mustNotHave.push(nature);
				} else {
					if (criteria.nature.mustHave) {
						throw new Chat.ErrorMessage(`Impossible situation: two natures (${criteria.nature.mustHave.name} and ${nature.name}) are required.`);
					}
					criteria.nature.mustHave = nature;
				}
				break;
			default:
				throw new Chat.ErrorMessage(`Invalid criterion: ${key}`);
			}
		}

		const results = setProbability(species, format, criteria);
		const percentage = Math.round((results.matches / results.rounds) * 100);
		return this.sendReplyBox(
			Utils.html`Generated ${results.rounds} sets for <strong>${species.name}</strong> in ${format.name}:<br />` +
			`Approximately <strong>${percentage}%</strong> (${results.matches} sets) ${getHTMLCriteriaDescription(criteria)}.`
		);
	},
	randombattlesetprobabilitieshelp() {
		return this.sendReplyBox(
			`<code>/randombattlesetprobabilities [optional format], [species], [conditions]</code>: Gives the probability of a set matching the conditions appearing for the given species.<br />` +
			`<code>[conditions]</code> is a comma-separated list of conditions of the form <code>[component]=[matching value]</code>, where <code>[component]</code> can be any of the following: ` +
			`<ul>` +
			`<li><code>moves</code>: matches all generated sets that contain every move specified. <code>[matching value]</code> should be a list of moves separated with <code>&amp;</code>.` +
			`<li><code>item</code>: matches all generated sets that have the specified item. <code>[matching value]</code> should be an item name.` +
			`<li><code>ability</code>: matches all generated sets with the specified ability. <code>[matching value]</code> should be an ability name.` +
			`<li><code>nature</code>: matches all generated sets with the specified nature. <code>[matching value]</code> should be a nature name.` +
			`</ul>` +
			`The given probability is for a set that matches EVERY provided condition. ` +
			`Conditions can be negated by prefixing the <code>[matching value]</code> with <code>!</code>.<br />` +
			`Requires: % @ # & (globally or in the Random Battles room)`
		);
	},
};
