import { type SSBSet, ssbSets } from "../../../data/mods/gen9ssb/random-teams";
import { formatNature, STAT_NAMES } from ".";

class SSBSetHTML extends Chat.JSX.Component<{ set: SSBSet, dex: ModdedDex, baseDex: ModdedDex }> {
	render() {
		const { set, dex, baseDex } = this.props;
		if (set.skip) {
			const baseSet = toID(Object.values(ssbSets[set.skip]).join());
			const skipSet = toID(Object.values(set).join()).slice(0, -toID(set.skip).length);
			if (baseSet === skipSet) return null;
		}
		const sigMove = baseDex.moves.get(set.signatureMove);
		return <details><summary>Set</summary>
			<ul style={{ listStyleType: 'none' }}>
				<li>
					{set.species}{set.gender && <> ({set.gender})</>}
					{set.item && ' @ '}
					{Array.isArray(set.item) ? set.item.map(x => dex.items.get(x).name).join(' / ') :
					set.item && dex.items.get(set.item).name}
				</li>
				<li>Ability: {Array.isArray(set.ability) ?
					set.ability.map(x => dex.abilities.get(x).name).join(' / ') : dex.abilities.get(set.ability).name}</li>
				{set.teraType &&
					<li>Tera Type: {Array.isArray(set.teraType) ?
						set.teraType.map(x => dex.types.get(x).name).join(' / ') :
						set.teraType === 'Any' ? 'Any' : dex.types.get(set.teraType).name}</li>}
				{set.shiny &&
					<li>Shiny: {typeof set.shiny === 'number' ? `1 in ${set.shiny} chance` : `Yes`}</li>}
				{set.evs && <li>EVs: {Object.entries(set.evs).filter(v => !!v[1]).map(([statid, ev], idx, arr) => (
					<>{ev} {STAT_NAMES[statid]}{idx !== arr.length - 1 && ' / '}</>
				))}</li>}
				{set.nature && <li>{Array.isArray(set.nature) ?
					set.nature.map(formatNature).join(" / ") : formatNature(set.nature)} Nature</li>}
				{set.ivs && <li>IVs: {Object.entries(set.ivs).filter(v => v[1] !== 31).map(([statid, iv], idx, arr) => (
					<>{iv} {STAT_NAMES[statid]}{idx !== arr.length - 1 && ' / '}</>
				))}</li>}
				{set.moves.map(moveid => (
					<li>- {Array.isArray(moveid) ? moveid.map(x => dex.moves.get(x).name).join(" / ") : dex.moves.get(moveid).name}</li>)
				)}
				<li>- {!sigMove.exists ? <i>{sigMove.name}</i> : sigMove.name}</li>
			</ul>
		</details>;
	}
}

class SSBMoveHTML extends Chat.JSX.Component<{ sigMove: Move, dex: ModdedDex }> {
	render() {
		const { sigMove, dex } = this.props;
		const details: { [k: string]: string } = {
			Priority: String(sigMove.priority),
			Gen: String(sigMove.gen || 9),
		};

		if (sigMove.isNonstandard === "Past" && dex.gen >= 8) details["Past Gens Only"] = "x";
		if (sigMove.secondary || sigMove.secondaries || sigMove.hasSheerForce) details["Boosted by Sheer Force"] = "";
		if (sigMove.flags['contact'] && dex.gen >= 3) details["Contact"] = "";
		if (sigMove.flags['sound'] && dex.gen >= 3) details["Sound"] = "";
		if (sigMove.flags['bullet'] && dex.gen >= 6) details["Bullet"] = "";
		if (sigMove.flags['pulse'] && dex.gen >= 6) details["Pulse"] = "";
		if (!sigMove.flags['protect'] && sigMove.target !== 'self') details["Bypasses Protect"] = "";
		if (sigMove.flags['bypasssub']) details["Bypasses Substitutes"] = "";
		if (sigMove.flags['defrost']) details["Thaws user"] = "";
		if (sigMove.flags['bite'] && dex.gen >= 6) details["Bite"] = "";
		if (sigMove.flags['punch'] && dex.gen >= 4) details["Punch"] = "";
		if (sigMove.flags['powder'] && dex.gen >= 6) details["Powder"] = "";
		if (sigMove.flags['reflectable'] && dex.gen >= 3) details["Bounceable"] = "";
		if (sigMove.flags['charge']) details["Two-turn move"] = "";
		if (sigMove.flags['recharge']) details["Has recharge turn"] = "";
		if (sigMove.flags['gravity'] && dex.gen >= 4) details["Suppressed by Gravity"] = "x";
		if (sigMove.flags['dance'] && dex.gen >= 7) details["Dance move"] = "";
		if (sigMove.flags['slicing'] && dex.gen >= 9) details["Slicing move"] = "";
		if (sigMove.flags['wind'] && dex.gen >= 9) details["Wind move"] = "";

		if (sigMove.zMove?.basePower) {
			details["Z-Power"] = String(sigMove.zMove.basePower);
		} else if (sigMove.zMove?.effect) {
			const zEffects: { [k: string]: string } = {
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
			let statid: BoostID;
			for (statid in boost) {
				details["Z-Effect"] += ` ${Dex.stats.mediumNames[statid as StatID]} +${boost[statid]}`;
			}
		} else if (sigMove.isZ && typeof sigMove.isZ === 'string') {
			details["Z-Move"] = "";
			const zCrystal = dex.items.get(sigMove.isZ);
			details["Z-Crystal"] = zCrystal.name;
			if (zCrystal.itemUser) {
				details["User"] = zCrystal.itemUser.join(", ");
				details["Required Move"] = dex.items.get(sigMove.isZ).zMoveFrom!;
			}
		} else {
			details["Z-Effect"] = "None";
		}

		const targetTypes: { [k: string]: string } = {
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
		if (sigMove.shortDesc || sigMove.desc) {
			return <><hr />
				<span dangerouslySetInnerHTML={{ __html: Chat.getDataMoveHTML(sigMove) }}></span>
				<font size="1">{Object.entries(details).map(([detail, value], idx, arr) => {
					const lastEntry = idx === arr.length - 1;
					if (!value) return <>&#10003; {detail}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
					if (value === 'x') return <>&#10007; {detail}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
					return <><font color="#686868">{detail}:</font> {value}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
				})}</font>
				{(sigMove.desc && sigMove.desc !== sigMove.shortDesc) &&
					<details><summary><strong>In-Depth Description</strong></summary>{sigMove.desc}</details>}
			</>;
		}
	}
}

class SSBItemHTML extends Chat.JSX.Component<{ set: SSBSet, dex: ModdedDex, baseDex: ModdedDex }> {
	render() {
		const { set, dex, baseDex } = this.props;
		if (!Array.isArray(set.item)) {
			const baseItem = baseDex.items.get(set.item);
			const sigItem = dex.items.get(set.item);
			const details: { [k: string]: string } = {
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
			if (!baseItem.exists || (baseItem.desc || baseItem.shortDesc) !== (sigItem.desc || sigItem.shortDesc)) {
				return <><hr />
					<span dangerouslySetInnerHTML={{ __html: Chat.getDataItemHTML(sigItem) }}></span>
					<font size="1">{Object.entries(details).map(([detail, value], idx, arr) => {
						const lastEntry = idx === arr.length - 1;
						if (value === '') return <>{detail}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
						return <><font color="#686868">{detail}:</font> {value}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
					})}</font>
				</>;
			}
		}
		return <></>;
	}
}

class SSBAbilityHTML extends Chat.JSX.Component<{ set: SSBSet, dex: ModdedDex, baseDex: ModdedDex }> {
	render() {
		const { set, dex, baseDex } = this.props;
		const customMegaAbilities = ['Sableye', 'Ampharos'];
		if (!Array.isArray(set.ability) &&
			(customMegaAbilities.includes(set.species) || !baseDex.abilities.get(set.ability).exists)) {
			let sigAbil = baseDex.deepClone(dex.abilities.get(set.ability));
			if (customMegaAbilities.includes(set.species)) {
				const megaAbil = dex.species.get(`${set.species}-Mega`).abilities[0];
				sigAbil = baseDex.deepClone(dex.abilities.get(megaAbil));
			}
			if (!sigAbil.desc && !sigAbil.shortDesc) {
				sigAbil.desc = `This ability doesn't have a description. Try contacting the SSB dev team.`;
			}
			const details: { [k: string]: string } = {
				Gen: String(sigAbil.gen || 9) || 'CAP',
			};
			if (sigAbil.flags['cantsuppress']) details["Not affected by Gastro Acid"] = "";
			if (sigAbil.flags['breakable']) details["Ignored by Mold Breaker"] = "";
			return <><hr />
				<span dangerouslySetInnerHTML={{ __html: Chat.getDataAbilityHTML(sigAbil) }}></span>
				<font size="1">{Object.entries(details).map(([detail, value], idx, arr) => {
					const lastEntry = idx === arr.length - 1;
					if (value === '') return <>{detail}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
					return <><font color="#686868">${detail}:</font> {value}{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}</>;
				})}</font>
				{(sigAbil.desc && sigAbil.shortDesc && sigAbil.desc !== sigAbil.shortDesc) &&
					<details><summary><strong>In-Depth Description</strong></summary>{sigAbil.desc}</details>}
			</>;
		}
		return <></>;
	}
}

class SSBPokemonHTML extends Chat.JSX.Component<{ species: string, dex: ModdedDex, baseDex: ModdedDex }> {
	render() {
		const { species, dex, baseDex } = this.props;
		const origSpecies = baseDex.species.get(species);
		const newSpecies = dex.species.get(species);
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
		const details: { [k: string]: string } = {
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
		if (
			newSpecies.types.join('/') !== origSpecies.types.join('/') ||
			Object.values(newSpecies.abilities).join('/') !== Object.values(origSpecies.abilities).join('/') ||
			Object.values(newSpecies.baseStats).join('/') !== Object.values(origSpecies.baseStats).join('/')
		) {
			return <><hr />
				<span dangerouslySetInnerHTML={{ __html: Chat.getDataPokemonHTML(newSpecies, dex.gen, 'SSB') }}></span>
				<font size="1">{Object.entries(details).map(([detail, value], idx, arr) => {
					const lastEntry = idx === arr.length - 1;
					if (detail.includes('<font')) {
						return <>
							<span dangerouslySetInnerHTML={{ __html: detail }}></span>
							{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}
						</>;
					}
					return <>
						<font color="#686868">{detail}:</font> {}
						{value.includes('<em>') ? <span dangerouslySetInnerHTML={{ __html: value }}></span> : value}
						{!lastEntry && <>&nbsp;|&#8287;&#8202;</>}
					</>;
				})}</font>
			</>;
		}
	}
}

class SSBInnateHTML extends Chat.JSX.Component<{ name: string, dex: ModdedDex, baseDex: ModdedDex }> {
	render() {
		const { name, dex, baseDex } = this.props;
		// Special casing for users whose usernames are already existing conditions/etc, i.e. dhelmise
		let effect = dex.conditions.get(name + 'user');
		if (!effect.exists) effect = dex.conditions.get(name);
		const longDesc = ``;
		const baseAbility = baseDex.deepClone(baseDex.abilities.get('noability'));
		// @ts-expect-error
		if (effect.innateName) {
			// @ts-expect-error
			baseAbility.name = effect.innateName;
			if (!effect.desc && !effect.shortDesc) {
				baseAbility.desc = baseAbility.shortDesc = "This innate does not have a description.";
			}
			if (effect.desc) baseAbility.desc = effect.desc;
			if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
			return <><hr />
				Innate Ability:<br />
				<span dangerouslySetInnerHTML={{ __html: Chat.getDataAbilityHTML(baseAbility) }}></span>
				<font size="1"><font color="#686868">Gen:</font> 9</font>
				{longDesc && <details><summary><strong>In-Depth Description</strong></summary>{longDesc}</details>}
			</>;
		}
		return <></>;
	}
}

class SSBSetsHTML extends Chat.JSX.Component<{ target: string }> {
	render() {
		const target = this.props.target;
		const targetID = toID(target);
		const baseDex = Dex;
		const dex = Dex.forFormat('gen9superstaffbrosultimate');
		if (!Object.keys(ssbSets).map(toID).includes(targetID)) {
			throw new Chat.ErrorMessage(`Error: ${target.trim()} doesn't have a [Gen 9] Super Staff Bros Ultimate set.`);
		}
		let name = '';
		for (const member in ssbSets) {
			if (toID(member) === targetID) name = member;
		}
		const sets: string[] = [];
		for (const set in ssbSets) {
			if (!set.startsWith(name)) continue;
			if (!ssbSets[set].skip && set !== name) continue;
			sets.push(set);
		}
		return sets.map(setName => {
			const set = ssbSets[setName];
			const mutatedSpecies = dex.species.get(set.species);
			const item = dex.items.get(set.item as string);
			const sigMove = baseDex.moves.get(set.signatureMove).exists && !Array.isArray(set.item) &&
				typeof item.zMove === 'string' ?
				dex.moves.get(item.zMove) : dex.moves.get(set.signatureMove);
			return <>{!set.skip ? <h1><psicon pokemon={mutatedSpecies.id} />{setName}</h1> :
				<span dangerouslySetInnerHTML={{ __html: `<details><summary><psicon pokemon="${set.species}" /><strong>` +
					`${`${setName.split('-').slice(1).join('-')} forme`}</strong></summary>` }}
				></span>}
			<SSBSetHTML set={set} dex={dex} baseDex={baseDex} />
			{(!set.skip || set.signatureMove !== ssbSets[set.skip].signatureMove) && <SSBMoveHTML sigMove={sigMove} dex={dex} />}
			<SSBItemHTML set={set} dex={dex} baseDex={baseDex} />
			<SSBAbilityHTML set={set} dex={dex} baseDex={baseDex} />
			<SSBInnateHTML name={setName} dex={dex} baseDex={baseDex} />
			<SSBPokemonHTML species={set.species} dex={dex} baseDex={baseDex} />
			{(!Array.isArray(set.item) && item.megaStone) && <SSBPokemonHTML
				species={Object.values(item.megaStone)[0]} dex={dex} baseDex={baseDex}
			/>}
			{/* keys and Kennedy have an itemless forme change */}
			{['Rayquaza'].includes(set.species) && <SSBPokemonHTML species={`${set.species}-Mega`} dex={dex} baseDex={baseDex} />}
			{['Cinderace'].includes(set.species) && <SSBPokemonHTML species={`${set.species}-Gmax`} dex={dex} baseDex={baseDex} />}
			{set.skip && <span dangerouslySetInnerHTML={{ __html: `</details>` }}></span>}</>;
		});
	}
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
		return this.sendReplyBox(<SSBSetsHTML target={target} />);
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
