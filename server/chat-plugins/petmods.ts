/**
 * Pet Mods chat-plugin
 * Currently contains a mirror of /randbats
 * Will be used for other Pet Mods room purposes, too
 */

import { FS } from '../../lib';

function formatMove(move: Move | string) {
	move = Dex.moves.get(move);
	return `<a href="https://${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}

function getSets(species: string | Species, format: string | Format = 'gen9randombattle'): {
	level: number,
	sets: any[],
} | null {
	const dex = Dex.forFormat(format);
	format = Dex.formats.get(format);
	species = dex.species.get(species);
	const folderName = format.mod;
	const setsFile = JSON.parse(
		FS(`data/random-battles/${folderName}/random-sets.json`)
			.readIfExistsSync() || '{}'
	);
	const data = setsFile[species.id];
	if (!data?.sets?.length) return null;
	return data;
}

export const commands: Chat.ChatCommands = {
	chatbats(target, room, user, connection, cmd) {
		if (!this.runBroadcast()) return;
		const battle = room?.battle;

		const args = target.split(',');
		if (!args[0]) return this.parse(`/help chatbats`);

		const { dex } = this.splitFormat(target, true);

		const searchResults = dex.dataSearch(args[0], ['Pokedex']);

		if (!searchResults?.length) {
			throw new Chat.ErrorMessage(`No Pok\u00e9mon named '${args[0]}' was found${Dex.gen > dex.gen ? ` in Gen ${dex.gen}` : ""}. (Check your spelling?)`);
		}

		let inexactMsg = '';
		if (searchResults[0].isInexact) {
			inexactMsg = `No Pok\u00e9mon named '${args[0]}' was found${Dex.gen > dex.gen ? ` in Gen ${dex.gen}` : ""}. Searching for '${searchResults[0].name}' instead.`;
		}
		const species = dex.species.get(searchResults[0].name);
		const formatName = `gen9chatbats`;
		const format = dex.formats.get(formatName);

		const movesets = [];
		let setCount = 0;
		const setsToCheck = [species];
		if (species.otherFormes) setsToCheck.push(...species.otherFormes.map(pkmn => dex.species.get(pkmn)));
		for (const pokemon of setsToCheck) {
			const data = getSets(pokemon, format.id);
			if (!data) continue;
			const sets = data.sets;
			const level = data.level;
			let buf = `<span class="gray">Moves for ${pokemon.name} in ${format.name}:</span><br/>`;
			buf += `<b>Level</b>: ${level}`;
			for (const set of sets) {
				buf += `<details class="details"><summary>${set.role}</summary>`;
				if (dex.gen === 9) {
					buf += `<b>Tera Type${Chat.plural(set.teraTypes)}</b>: ${set.teraTypes.join(', ')}<br/>`;
				} else if (([2, 3, 4, 5, 6, 7].includes(dex.gen)) && set.preferredTypes) {
					buf += `<b>Preferred Type${Chat.plural(set.preferredTypes)}</b>: ${set.preferredTypes.join(', ')}<br/>`;
				}
				buf += `<b>Moves</b>: ${set.movepool.sort().map(formatMove).join(', ')}<br/>`;
				if (set.abilities) {
					buf += `<b>Abilit${Chat.plural(set.abilities, 'ies', 'y')}</b>: ${set.abilities.sort().join(', ')}`;
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
	chatbatshelp: [
		`/chatbats [pokemon] - Displays a Pok\u00e9mon's ChatBats Moves.`,
	],
};
