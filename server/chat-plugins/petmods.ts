/**
 * Pet Mods chat-plugin
 * Currently contains a mirror of /randbats
 * Will be used for other Pet Mods room purposes, too
 */

import { FS } from '../../lib';
import { toID } from "../../sim/dex-data";

function formatMove(move: Move | string, format: Format) {
	const dex = Dex.forFormat(format);
	const parentDex = Dex.forFormat(dex.parentMod);
	move = dex.moves.get(move);
	const id = move.id;
	const custom = (dex.data.Moves[id] as any) !== (parentDex.data.Moves[id] as any);
	return custom ? `<button name="send" value="/dt ${move.name}, ${format.name}"\
		style="display: inline; padding: 0; border: 0; font: inherit; font-style: italic; cursor: pointer;\
		background: transparent; color: currentColor; -webkit-appearance: none;">${move.name}</i></button>` :
		`<a href="https://${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}

function formatAbility(ability: Ability | string, format: Format) {
	const dex = Dex.forFormat(format);
	const parentDex = Dex.forFormat(dex.parentMod);
	ability = dex.abilities.get(ability);
	const id = toID(ability.name);
	const custom = (dex.data.Abilities[id] as any) !== (parentDex.data.Abilities[id] as any);
	return custom ? `<button name="send" value="/dt ${ability.name}, ${format.name}"\
		style="display: inline; padding: 0; border: 0; font: inherit;\
		font-style: italic; cursor: pointer; background: transparent;\
		color: currentColor; -webkit-appearance: none;">${ability.name}</i></button>` :
		`<a href="https://${Config.routes.dex}/moves/${ability.id}" target="_blank" class="subtle" style="white-space:nowrap">${ability.name}</a>`;
}

function getSets(species: string | Species, format: Format | string): {
	level: number,
	sets: any[],
} | null {
	const dex = Dex.forFormat(format);
	const dexFormat = Dex.formats.get(format);
	species = dex.species.get(species);
	const folderName = dexFormat.mod;
	const setsFile = JSON.parse(
		FS(`data/random-battles/${folderName}/random-sets.json`)
			.readIfExistsSync() || '{}'
	);
	const data = setsFile[species.id];
	if (!data?.sets?.length) return null;
	return data;
}

export const commands: Chat.ChatCommands = {
	// Filter on Data Preview for Pet Mods and format.team for random battles
	...Object.fromEntries(
		Dex.formats
			.all()
			.filter(format =>
				format.exists && format.team !== undefined && format.ruleset.includes('Data Preview') &&
				format.id.startsWith(`gen${Dex.gen}`))
			.map(format => {
				const alias = format.id.slice(`gen${Dex.gen}`.length);
				return [alias, format.id];
			})
	),
	...Object.fromEntries(
		Dex.formats
			.all()
			.filter(format => format.exists && format.team !== undefined && format.ruleset.includes('Data Preview'))
			.map(format => [
				format.id,
				function (this: Chat.CommandContext, target, room, user, connection, cmd) {
					// Reuse code from /randbats
					if (!this.runBroadcast()) return;
					const args = target.split(',');
					if (!args[0]) return this.parse(`/help ${format.id}`);

					const dex = Dex.forFormat(`${format}`);

					const searchResults = dex.dataSearch(args[0], ['Pokedex']);

					if (!searchResults?.length) {
						throw new Chat.ErrorMessage(`No Pok\u00e9mon named '${args[0]}' was found in ${format}. (Check your spelling?)`);
					}

					let inexactMsg = '';
					if (searchResults[0].isInexact) {
						inexactMsg = `No Pok\u00e9mon named '${args[0]}' was found in ${format}. Searching for '${searchResults[0].name}' instead.`;
					}
					const species = dex.species.get(searchResults[0].name);
					const movesets = [];
					let setCount = 0;
					const setsToCheck = [species];
					if (species.otherFormes) setsToCheck.push(...species.otherFormes.map(pkmn => dex.species.get(pkmn)));
					for (const pokemon of setsToCheck) {
						const data = getSets(pokemon, format);
						if (!data) continue;
						const sets = data.sets;
						const level = data.level;
						let buf = `<span class="gray">Moves for ${pokemon.name} in ${format.name}:</span><br/>`;
						buf += `<b>Level</b>: ${level}`;
						for (const set of sets) {
							buf += `<details class="details"><summary>${set.role}</summary>`;
							if (dex.gen === 9 && set.teraTypes) {
								buf += `<b>Tera Type${Chat.plural(set.teraTypes)}</b>: ${set.teraTypes.join(', ')}<br/>`;
							} else if (([2, 3, 4, 5, 6, 7].includes(dex.gen)) && set.preferredTypes) {
								buf += `<b>Preferred Type${Chat.plural(set.preferredTypes)}</b>: ${set.preferredTypes.join(', ')}<br/>`;
							}
							buf += `<b>Moves</b>: ${set.movepool.sort().map((move: any) => formatMove(move, format)).join(', ')}<br/>`;
							if (set.abilities) {
								buf += `<b>Abilit${Chat.plural(set.abilities, 'ies', 'y')}</b>: ${set.abilities.sort().map((abil: any) => formatAbility(abil, format)).join(', ')}`;
							}
							buf += '</details>';
							setCount++;
						}
						movesets.push(buf);
					}

					if (!movesets.length) {
						this.sendReply(inexactMsg);
						throw new Chat.ErrorMessage(`Error: ${species.name} has no data in ${format.name}`);
					}
					let buf = movesets.join('<hr/>');
					if (setCount <= 2) {
						buf = buf.replace(/<details>/g, '<details open>');
					}
					this.sendReply(inexactMsg);
					this.sendReplyBox(buf);
				},
			])
	),
	...Object.fromEntries(
		Dex.formats
			.all()
			.filter(format => format.exists && format.team !== undefined && format.ruleset.includes('Data Preview'))
			.map(format => [
				format.id + 'help',
				function (this: Chat.CommandContext, target, room, user, connection, cmd) {
					this.sendReply(`/${format.id} [pokemon] - Displays a Pok\u00e9mon's ${format.name} Moves.`);
				},
			])
	),
};
