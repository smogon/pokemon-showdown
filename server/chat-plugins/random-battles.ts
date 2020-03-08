function formatMove(move: Move | string) {
	move = Dex.getMove(move);
	return `<a href="${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}

function formatItem(item: Item | string) {
	item = Dex.getItem(item);
	return `<a href="${Config.routes.dex}/items/${item.id}" target="_blank" class="subtle" style="white-space:nowrap">${item.name}</a>`;
}

function trimmedItemsArray(items: readonly ID[]) {
	const data: string[] = [];
	for (const item of items) {
		if (data.includes(item)) continue;
		data.push(item);
	}
	return data;
}

function trimmedMovesArray(moves: readonly ID[]) {
	const data: string[] = [];
	for (const move of moves) {
		if (data.includes(move)) continue;
		data.push(move);
	}
	return data;
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
	// Only check for randomSet1 because if it doesn't have one,
	// it doesn't have any sets
	let buf = ``;
	if (template.randomSet1) {
		const set = template.randomSet1;
		const items = trimmedItemsArray(set.item).map(formatItem).join(" / ");
		buf += `<details><summary>Set 1</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${template.species} @ ${items}</ul>`;
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
	if (template.randomSet2) {
		const set = template.randomSet2;
		const items = trimmedItemsArray(set.item).map(formatItem).join(" / ");
		buf += `<details><summary>Set 2</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${template.species} @ ${items}</ul>`;
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
	if (template.randomSet3) {
		const set = template.randomSet3;
		const items = trimmedItemsArray(set.item).map(formatItem).join(" / ");
		buf += `<details><summary>Set 3</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${template.species} @ ${items}</ul>`;
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
	if (template.randomSet4) {
		const set = template.randomSet4;
		const items = trimmedItemsArray(set.item).map(formatItem).join(" / ");
		buf += `<details><summary>Set 4</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${template.species} @ ${items}</ul>`;
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
	if (template.randomSet5) {
		const set = template.randomSet5;
		const items = trimmedItemsArray(set.item).map(formatItem).join(" / ");
		buf += `<details><summary>Set 5</summary>`;
		buf += `<ul style="list-style-type:none;">`;
		buf += `<li>${template.species} @ ${items}</ul>`;
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
	if (!template.randomSet1) return false;
	return buf;
}

export const commands: ChatCommands = {
	'!randombattles': true,
	'randbats': 'randombattles',
	randombattles(target, room, user) {
		if (!this.runBroadcast()) return;
		const args = target.split(',');
		if (!args[0]) return this.parse(`/help randombattles`);
		let dex = Dex;
		if (['gen2'].includes(toID(args[1]))) return;
		if (args[1] && toID(args[1]) in Dex.dexes) dex = Dex.dexes[toID(args[1])];
		const genNames: {[k: string]: string} = {
			gen1: 'RBY', gen2: 'GSC', gen3: 'ADV', gen4: 'GSC', gen5: 'B2W2', gen6: 'ORAS', gen7: 'USUM',
		};
		const template = dex.getTemplate(args[0]);
		if (!template.exists) {
			return this.errorReply(`Error: Pok\u00e9mon '${args[0].trim()}' does not exist.`);
		}
		const formatName = dex.getFormat(`gen${dex.gen}randombattle`).name;
		if (toID(args[1]) === 'gen1') {
			const rbyMoves = getRBYMoves(template);
			if (!rbyMoves) {
				return this.errorReply(`${template.species} has no Random Battle data in ${genNames[toID(args[1])]}`);
			}
			return this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}</span>:<br />${rbyMoves}`);
		}
		if (toID(args[1]) === 'gen2') {
			const gscMoves = getGSCMoves(template);
			console.log(gscMoves);
			if (!gscMoves) {
				return this.errorReply(`${template.species} has no Random Battle data in ${genNames[toID(args[1])]}`);
			}
			return this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}</span>:<br />${gscMoves}`);
		}
		if (!template.randomBattleMoves) {
			return this.errorReply(`Error: No moves data found for ${template.species}${`gen${dex.gen}` in genNames ? ` in ${genNames[`gen${dex.gen}`]}` : ``}.`);
		}
		const moves = template.randomBattleMoves.map(formatMove);
		this.sendReplyBox(`<span style="color:#999999;">Moves for ${template.species} in ${formatName}</span>:<br />${moves.join(`, `)}`);
	},
};
