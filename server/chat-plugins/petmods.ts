/**
 * Pet Mods chat-plugin
 * Lets users fetch assorted data from Pet Mods,
 * like Random Battle sets including items.
 * @author Snaq-PS
 * @author iforgetwhyimhere
 */

import { FS } from '../../lib';

/* interface Entries {
	redName: string;
	greenName?: string;
	redEntry: string;
	greenEntry?: string;
} */

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
	const id = Dex.toID(ability.name);
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
	const id = Dex.toID(item.name);
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
			buf += `<b>Level</b>: ${level}<br/>`;
			for (const set of sets) {
				if (set.role) buf += `<details class="details"><summary>${set.role}</summary>`;
				if (dex.gen === 9 && set.teraTypes) {
					buf += `<b>Tera Type${Chat.plural(set.teraTypes)}</b>: ${set.teraTypes.join(', ')}<br/>`;
				}
				buf += `<b>Moves</b>: ${set.movepool.sort().map((move: any) => formatMove(move, format)).join(', ')}<br/>`;
				if (set.abilities) {
					buf += `<b>Abilit${Chat.plural(set.abilities, 'ies', 'y')}</b>: ${set.abilities.sort().map((abil: any) => formatAbility(abil, format)).join(', ')}<br/>`;
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
	/* dexentry(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help dexentry');

		const dex = Dex.forFormat('gen9randombattle');
		const dexEntry: { [species: string]: Entries } = require('./../../data/mods/gen9randomtandem/entries.json');

		const pokemon = dex.species.get(target);
		const entry = dexEntry[pokemon.id];

		if (!pokemon.exists || !entry) return this.parse('/help dexentry');
		if (!this.runBroadcast()) return;

		let buf = `<span class="gray">Flavor for ${pokemon.name}:</span><br/>`;
		// we COULD guard against nonexistence but that should never happen anyway
		buf += `<b>${entry.redName} Red:</b> ${entry.redEntry}`;
		if (entry.greenName && entry.greenEntry) {
			buf += `<br/><b>${entry.greenName} Green:</b> ${entry.greenEntry}`;
		}

		this.sendReplyBox(buf);
	},
	dexentryhelp: [
		`/dexentry [pokemon] - Show the Dex flavor for the [pokemon] in [FILL].`,
		`!dexentry [pokemon] - Shows everyone that information. Requires: + % @ ~`,
	], */
};
