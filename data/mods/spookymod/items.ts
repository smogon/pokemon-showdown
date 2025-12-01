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
			const shadowleap: typeof pokemon.moveSlots[0] = {
				move: "Shadow Leap",
				id: this.toID("shadowleap"),
				pp: 2,
				maxpp: 2,
				target: "normal",
				disabled: false,
				used: false,
			};
			const firebail: typeof pokemon.moveSlots[0] = {
				move: "FirebaIl",
				id: this.toID("firebail"),
				pp: 2,
				maxpp: 2,
				target: "normal",
				disabled: false,
				used: false,
			};
			const blastjump: typeof pokemon.moveSlots[0] = {
				move: "Blast Jump",
				id: this.toID("blastjump"),
				pp: 2,
				maxpp: 2,
				target: "normal",
				disabled: false,
				used: false,
			};
			const overheal: typeof pokemon.moveSlots[0] = {
				move: "Overheal",
				id: this.toID("overheal"),
				pp: 1,
				maxpp: 1,
				target: "self",
				disabled: false,
				used: false,
			};
			const batswarm: typeof pokemon.moveSlots[0] = {
				move: "Bat Swarm",
				id: this.toID("batswarm"),
				pp: 2,
				maxpp: 2,
				target: "normal",
				disabled: false,
				used: false,
			};
			const pumpkinmirv: typeof pokemon.moveSlots[0] = {
				move: "Pumpkin MIRV",
				id: this.toID("pumpkinmirv"),
				pp: 1,
				maxpp: 1,
				target: "normal",
				disabled: false,
				used: false,
			};
			const stealth: typeof pokemon.moveSlots[0] = {
				move: "Stealth",
				id: this.toID("stealth"),
				pp: 1,
				maxpp: 1,
				target: "self",
				disabled: false,
				used: false,
			};
			const monoculus: typeof pokemon.moveSlots[0] = {
				move: "MONOCULUS!",
				id: this.toID("monoculus"),
				pp: 1,
				maxpp: 1,
				target: "normal",
				disabled: false,
				used: false,
			};
			const skeletonhorde: typeof pokemon.moveSlots[0] = {
				move: "Skeleton Horde",
				id: this.toID("skeletonhorde"),
				pp: 1,
				maxpp: 1,
				target: "normal",
				disabled: false,
				used: false,
			};
			const ballolightning: typeof pokemon.moveSlots[0] = {
				move: "Ball O' Lightning",
				id: this.toID("ballolightning"),
				pp: 1,
				maxpp: 1,
				target: "normal",
				disabled: false,
				used: false,
			};
			const meteorshower: typeof pokemon.moveSlots[0] = {
				move: "Meteor Shower",
				id: this.toID("meteorshower"),
				pp: 1,
				maxpp: 1,
				target: "normal",
				disabled: false,
				used: false,
			};
			const minify: typeof pokemon.moveSlots[0] = {
				move: "Minify",
				id: this.toID("minify"),
				pp: 1,
				maxpp: 1,
				target: "self",
				disabled: false,
				used: false,
			};
			const spells = [
				shadowleap, firebail, blastjump, overheal, batswarm, pumpkinmirv, stealth,
				monoculus, skeletonhorde, ballolightning, meteorshower, minify,
			];
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
