/**
 * Pet Mods chat-plugin
 * Lets users fetch assorted data from Pet Mods,
 * like Random Battle sets including items.
 * @author Snaq-PS
 * @author iforgetwhyimhere
 */

import { FS } from '../../lib';
import { toID } from "../../sim/dex-data";

interface Tandem {
	species: string;
	items: string[];
	abilities: string[];
	gender?: string;
	teraTypes: string[];
	forcedMoves: string[];
	moves: string[];
	nature?: string;
}

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
	return custom ? `<button name="send" value="/dt ${ability.name}, ${format.mod}"\
		style="display: inline; padding: 0; border: 0; font: inherit;\
		font-style: italic; cursor: pointer; background: transparent;\
		color: currentColor; -webkit-appearance: none;">${ability.name}</i></button>` :
		`<a href="https://${Config.routes.dex}/abilities/${ability.id}" target="_blank" class="subtle" style="white-space:nowrap">${ability.name}</a>`;
}

function formatItem(item: Item | string, format: Format) {
	const dex = Dex.forFormat(format);
	const parentDex = Dex.forFormat(dex.parentMod);
	item = dex.items.get(item);
	const id = toID(item.name);
	const custom = (dex.data.Items[id] as any) !== (parentDex.data.Items[id] as any);
	return custom ? `<button name="send" value="/dt ${item.name}, ${format.mod}"\
		style="display: inline; padding: 0; border: 0; font: inherit;\
		font-style: italic; cursor: pointer; background: transparent;\
		color: currentColor; -webkit-appearance: none;">${item.name}</i></button>` :
		`<a href="https://${Config.routes.dex}/items/${item.id}" target="_blank" class="subtle" style="white-space:nowrap">${item.name}</a>`;
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
	chatbats: 'petmodrandbats',
	pmotm: 'petmodrandbats',
	pmlc: 'petmodrandbats',
	petmodrandbats(target, room, user, connection, cmd) {
		if (!target || cmd === 'petmodrandbats') return this.parse(`/help petmodrandbats`);
		const format = Dex.formats.get(Dex.getAlias(cmd as ID) || cmd);
		if (!format) return this.errorReply(`No format ${cmd} was found.`);
		if (format.id === 'gen9randomtandem') return this.parse(`/help tandems`);

		if (!this.runBroadcast()) return;

		const dex = Dex.forFormat(format);
		const searchResults = dex.dataSearch(target, ['Pokedex']);

		if (!searchResults?.length) {
			throw new Chat.ErrorMessage(`No Pok\u00e9mon named '${target}' was found in ${format}. (Check your spelling?)`);
		}

		let inexactMsg = '';
		if (searchResults[0].isInexact) {
			inexactMsg = `No Pok\u00e9mon named '${target}' was found in ${format}. Searching for '${searchResults[0].name}' instead.`;
		}
		const species = dex.species.get(searchResults[0].name);
		const movesets = [];
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
				if (set.role) buf += `<details class="details"><summary>${set.role}</summary>`;
				if (dex.gen === 9 && set.teraTypes) {
					buf += `<b>Tera Type${Chat.plural(set.teraTypes)}</b>: ${set.teraTypes.join(', ')}<br/>`;
				}
				buf += `<b>Moves</b>: ${set.movepool.sort().map((move: any) => formatMove(move, format)).join(', ')}<br/>`;
				if (set.abilities) {
					buf += `<b>Abilit${Chat.plural(set.abilities, 'ies', 'y')}</b>: ${set.abilities.sort().map((abil: any) => formatAbility(abil, format)).join(', ')}<br>`;
				}
				if (set.items) {
					buf += `<b>Item${Chat.plural(set.items, 's', '')}</b>: ${set.items.sort().map((item: any) => formatItem(item, format)).join(', ')}`;
				}
				buf += '</details>';
			}
			movesets.push(buf);
		}

		if (!movesets.length) {
			this.sendReply(inexactMsg);
			throw new Chat.ErrorMessage(`Error: ${species.name} has no data in ${format.name}`);
		}
		const buf = movesets.join('<hr/>');
		this.sendReply(inexactMsg);
		this.sendReplyBox(buf);
	},
	petmodrandbatshelp: [
		`/pmotm [pokemon] - Shows sets of a Pokemon in the Pet Mod of the Month.`,
		`/pmlc [pokemon] - Shows sets of a Pokemon in the Pet Mod Leader's Choice`,
		`/chatbats [pokemon] - Shows sets of a Pokemon in [Gen 9] Chatbats.`,
	],
	tandems(target, room, user, connection, cmd) {
		if (!target) return this.parse(`/help tandems`);
		if (!this.runBroadcast()) return;

		const tandemData: { [species: string]: Tandem[] } = JSON.parse(
			FS(`data/mods/gen9randomtandem/tandems.json`)
				.readIfExistsSync()
		);

		const searchResults = Dex.dataSearch(target, ['Pokedex']);

		if (!searchResults?.length) {
			throw new Chat.ErrorMessage(`No Pok\u00e9mon named '${target}' was found. (Check your spelling?)`);
		}

		let inexactMsg = '';
		if (searchResults[0].isInexact) {
			inexactMsg = `No Pok\u00e9mon named '${target}' was found. Searching for '${searchResults[0].name}' instead.`;
		}

		const pokemon = Dex.species.get(searchResults[0].name).id;
		const tandems = tandemData[pokemon];

		if (!tandems) {
			throw new Chat.ErrorMessage(`${pokemon} is not a Head.`);
		};

		let buf = `<span class="gray">Tandems for ${Dex.species.get(pokemon).name}:</span><br/>`;

		for (const tandem of tandems) {
			buf += `<details class="details"><summary>${Dex.species.get(tandem.species).name}</summary>`;
			buf += `<b>Abilit${Chat.plural(tandem.abilities, 'ies', 'y')}</b>: ${
				tandem.abilities
					.map(ability => Dex.abilities.get(ability).name)
					.sort()
					.join(', ')
			}<br/>`;
			buf += `<b>Item${Chat.plural(tandem.items, 's', '')}</b>: ${
				tandem.items
					.map(item => Dex.items.get(item).name)
					.sort()
					.join(', ')}<br/>`;
			buf += `<b>Tera Type${Chat.plural(tandem.teraTypes)}</b>: ${tandem.teraTypes.join(', ')}<br/>`;
			if (tandem.nature) buf += `<b>Nature</b>: ${tandem.nature}<br/>`;
			// set has >4 moves, specify which are always present
			if (tandem.moves.length > 2) {
				buf += `<b>Forced Moves</b>: ${
					tandem.forcedMoves
						.map(move => Dex.moves.get(move).name)
						.sort()
						.join(', ')}<br/>`;
				buf += `<b>Moves</b>: ${
					tandem.moves
						.map(move => Dex.moves.get(move).name)
						.sort()
						.join(', ')}<br/>`;
			} else {
				buf += `<b>Moves</b>: ${
					[...tandem.forcedMoves, ...tandem.moves]
						.map(move => Dex.moves.get(move).name)
						.sort()
						.join(', ')}<br/>`;
			}
			buf += '</details>';
			buf += '<hr/>';
		}
		this.sendReply(inexactMsg);
		this.sendReplyBox(buf);
	},
	tandemshelp: [
		`/tandems [pokemon] - Show the possible Tandems of a Head Pokemon in [Gen 9] Random Tandem.`,
		`!tandems [pokemon] - Shows everyone that information. Requires: + % @ ~`,
	],
};
