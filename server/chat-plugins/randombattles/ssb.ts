import {SSBSet, ssbSets} from "../../../data/mods/gen9ssb/random-teams";
import {Utils} from "../../../lib";
import {formatNature, STAT_NAMES} from ".";

function generateSSBSet(set: SSBSet, dex: ModdedDex, baseDex: ModdedDex) {
	if (set.skip) {
		const baseSet = toID(Object.values(ssbSets[set.skip]).join());
		const skipSet = toID(Object.values(set).join()).slice(0, -toID(set.skip).length);
		if (baseSet === skipSet) return ``;
	}
	let buf = ``;
	buf += `<details><summary>Set</summary>`;
	buf += `<ul style="list-style-type:none;"><li>${set.species}${set.gender !== '' ? ` (${set.gender})` : ``}`;
	buf += `${set.item ? ' @ ' : ''}${Array.isArray(set.item) ? set.item.map(x => dex.items.get(x).name).join(' / ') : dex.items.get(set.item).name}</li>`;
	buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(x => dex.abilities.get(x).name).join(' / ') : dex.abilities.get(set.ability).name}</li>`;
	if (set.teraType) {
		buf += `<li>Tera Type: ${Array.isArray(set.teraType) ? set.teraType.map(x => dex.types.get(x).name).join(' / ') : set.teraType === 'Any' ? 'Any' : dex.types.get(set.teraType).name}</li>`;
	}
	if (set.shiny) buf += `<li>Shiny: ${typeof set.shiny === 'number' ? `1 in ${set.shiny} chance` : `Yes`}</li>`;
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
		buf += `<li>${Array.isArray(set.nature) ? set.nature.map(x => formatNature(x)).join(" / ") : formatNature(set.nature)} Nature</li>`;
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
			Gen: String(sigMove.gen || 9),
		};

		if (sigMove.isNonstandard === "Past" && dex.gen >= 8) details["&#10007; Past Gens Only"] = "";
		if (sigMove.secondary || sigMove.secondaries || sigMove.hasSheerForce) details["&#10003; Boosted by Sheer Force"] = "";
		if (sigMove.flags['contact'] && dex.gen >= 3) details["&#10003; Contact"] = "";
		if (sigMove.flags['sound'] && dex.gen >= 3) details["&#10003; Sound"] = "";
		if (sigMove.flags['bullet'] && dex.gen >= 6) details["&#10003; Bullet"] = "";
		if (sigMove.flags['pulse'] && dex.gen >= 6) details["&#10003; Pulse"] = "";
		if (!sigMove.flags['protect'] && sigMove.target !== 'self') details["&#10003; Bypasses Protect"] = "";
		if (sigMove.flags['bypasssub']) details["&#10003; Bypasses Substitutes"] = "";
		if (sigMove.flags['defrost']) details["&#10003; Thaws user"] = "";
		if (sigMove.flags['bite'] && dex.gen >= 6) details["&#10003; Bite"] = "";
		if (sigMove.flags['punch'] && dex.gen >= 4) details["&#10003; Punch"] = "";
		if (sigMove.flags['powder'] && dex.gen >= 6) details["&#10003; Powder"] = "";
		if (sigMove.flags['reflectable'] && dex.gen >= 3) details["&#10003; Bounceable"] = "";
		if (sigMove.flags['charge']) details["&#10003; Two-turn move"] = "";
		if (sigMove.flags['recharge']) details["&#10003; Has recharge turn"] = "";
		if (sigMove.flags['gravity'] && dex.gen >= 4) details["&#10007; Suppressed by Gravity"] = "";
		if (sigMove.flags['dance'] && dex.gen >= 7) details["&#10003; Dance move"] = "";
		if (sigMove.flags['slicing'] && dex.gen >= 9) details["&#10003; Slicing move"] = "";
		if (sigMove.flags['wind'] && dex.gen >= 9) details["&#10003; Wind move"] = "";

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
			Gen: String(sigAbil.gen || 9) || 'CAP',
		};
		if (sigAbil.flags['cantsuppress']) details["&#10003; Not affected by Gastro Acid"] = "";
		if (sigAbil.flags['breakable']) details["&#10003; Ignored by Mold Breaker"] = "";
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
	// Special casing for users whose usernames are already existing, i.e. dhelmise
	let effect = dex.conditions.get(name + 'user');
	let longDesc = ``;
	const baseAbility = baseDex.deepClone(baseDex.abilities.get('noability'));
	if (effect.exists && (effect as any).innateName && (effect.desc || effect.shortDesc)) {
		baseAbility.name = (effect as any).innateName;
		if (!effect.desc && !effect.shortDesc) {
			baseAbility.desc = baseAbility.shortDesc = "This innate does not have a description.";
		}
		if (effect.desc) baseAbility.desc = effect.desc;
		if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
		buf += `<hr />Innate Ability:<br />${Chat.getDataAbilityHTML(baseAbility)}`;
		if (effect.desc && effect.shortDesc && effect.desc !== effect.shortDesc) {
			longDesc = effect.desc;
		}
	} else {
		effect = dex.deepClone(dex.conditions.get(name));
		if (!effect.desc && !effect.shortDesc) {
			effect.desc = effect.shortDesc = "This innate does not have a description.";
		}
		if (effect.exists && (effect as any).innateName) {
			baseAbility.name = (effect as any).innateName;
			if (effect.desc) baseAbility.desc = effect.desc;
			if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
			buf += `<hr />Innate Ability:<br />${Chat.getDataAbilityHTML(baseAbility)}`;
			if (effect.desc && effect.shortDesc && effect.desc !== effect.shortDesc) {
				longDesc = effect.desc;
			}
		}
	}
	if (buf) {
		const details: {[k: string]: string} = {Gen: '9'};
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
	const dex = Dex.forFormat('gen9superstaffbrosultimate');
	if (!Object.keys(ssbSets).map(toID).includes(toID(target))) {
		return {e: `Error: ${target.trim()} doesn't have a [Gen 9] Super Staff Bros Ultimate set.`};
	}
	let name = '';
	for (const member in ssbSets) {
		if (toID(member) === toID(target)) name = member;
	}
	let buf = '';
	const sets: string[] = [];
	for (const set in ssbSets) {
		if (!set.startsWith(name)) continue;
		if (!ssbSets[set].skip && set !== name) continue;
		sets.push(set);
	}
	for (const setName of sets) {
		const set = ssbSets[setName];
		const mutatedSpecies = dex.species.get(set.species);
		if (!set.skip) {
			buf += Utils.html`<h1><psicon pokemon="${mutatedSpecies.id}">${setName}</h1>`;
		} else {
			buf += `<details><summary><psicon pokemon="${set.species}"><strong>${setName.split('-').slice(1).join('-') + ' forme'}</strong></summary>`;
		}
		buf += generateSSBSet(set, dex, baseDex);
		const item = dex.items.get(set.item as string);
		if (!set.skip || set.signatureMove !== ssbSets[set.skip].signatureMove) {
			const sigMove = baseDex.moves.get(set.signatureMove).exists && !Array.isArray(set.item) &&
				typeof item.zMove === 'string' ?
				dex.moves.get(item.zMove) : dex.moves.get(set.signatureMove);
			buf += generateSSBMoveInfo(sigMove, dex);
		}
		buf += generateSSBItemInfo(set, dex, baseDex);
		buf += generateSSBAbilityInfo(set, dex, baseDex);
		buf += generateSSBInnateInfo(setName, dex, baseDex);
		buf += generateSSBPokemonInfo(set.species, dex, baseDex);
		if (!Array.isArray(set.item) && item.megaStone) {
			buf += generateSSBPokemonInfo(item.megaStone, dex, baseDex);
		// keys and Kennedy have an itemless forme change
		} else if (['Rayquaza'].includes(set.species)) {
			buf += generateSSBPokemonInfo(`${set.species}-Mega`, dex, baseDex);
		} else if (['Cinderace'].includes(set.species)) {
			buf += generateSSBPokemonInfo(`${set.species}-Gmax`, dex, baseDex);
		}
		if (set.skip) buf += `</details>`;
	}
	return buf;
}


export const disabledSets = Chat.oldPlugins.ssb?.disabledSets || [];

function enforceDisabledSets() {
	for (const process of Rooms.PM.processes) {
		process.getProcess().send(`EVAL\n\nConfig.disabledssbsets = ${JSON.stringify(disabledSets)}`);
	}
}

enforceDisabledSets();

export const commands: Chat.ChatCommands = {
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
	enablessbset: 'disablessbset',
	disablessbset(target, room, user, connection, cmd) {
		this.checkCan('rangeban');
		target = toID(target);
		if (!Object.keys(ssbSets).map(toID).includes(target as ID)) {
			throw new Chat.ErrorMessage(`${target} has no SSB set.`);
		}
		const disableIdx = disabledSets.indexOf(target);
		if (cmd.startsWith('enable')) {
			if (disableIdx < 0) {
				throw new Chat.ErrorMessage(`${target}'s set is not disabled.`);
			}
			disabledSets.splice(disableIdx, 1);
			this.privateGlobalModAction(`${user.name} enabled ${target}'s SSB set.`);
		} else {
			if (disableIdx > -1) {
				throw new Chat.ErrorMessage(`That set is already disabled.`);
			}
			disabledSets.push(target);
			this.privateGlobalModAction(`${user.name} disabled the SSB set for ${target}`);
		}
		enforceDisabledSets();
	},
};
