export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	spellbookmagazine: {
		name: "Spellbook Magazine",
		shortDesc: "Lets the user pick up and cast spells.",
		onTakeItem(item, pokemon, source, move) {
			return false;
		},
		onResidual(pokemon) {
			if (pokemon.volatiles['spellbookmagazine']) return;
			const rand = this.random(4);
			const spells = [
				"Shadow Leap", "Fire BaIl", "Blast Jump", "Overheal", "Bat Swarm", "Pumpkin MIRV", "Stealth",
				"MONOCULUS!", "Skeleton Horde", "Ball O' Lightning", "Meteor Shower", "Minify",
			].map(x => ({ move: x, id: this.toID(x), pp: 1, maxpp: 1, target: "normal", disabled: false, used: false }));
			if (rand === 0) {
				const randSpell = this.sample(spells);
				pokemon.moveSlots.push(randSpell);
				pokemon.addVolatile("spellbookmagazine");
			}
		},
		condition: {
			onResidual(pokemon) {
				if (!pokemon.lastMoveUsed) {
					return false;
				}
				const spells = [
					'Shadow Leap', 'FirebaIl', 'Blast Jump', 'Overheal', 'Bat Swarm', 'Pumpkin MIRV', 'Stealth',
					'MONOCULUS!', 'Skeleton Horde', 'Ball O\' Lightning', 'Meteor Shower', 'Minify',
				];
				if (!spells.includes(pokemon.lastMoveUsed.name) || pokemon.lastMoveUsed.pp !== 0) return;
				pokemon.moveSlots.pop();
				pokemon.removeVolatile("spellbookmagazine");
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Spell', '[silent]');
			},
		},
	},
};
