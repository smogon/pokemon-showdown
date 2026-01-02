export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	supertypemovesrule: {
		effectType: 'Rule',
		name: 'Super Type Moves Rule',
		desc: 'Prevents pokemon from using Crystal or Feral moves unless they have a matching type.',
		onBeforeMove(pokemon, target, move) {
			move = {
				...this.dex.moves.get(move),
				hit: move.hit,
			};
			if (move.type === "Crystal" && !pokemon.hasType("Crystal")) return false;
			if (move.type === "Feral" && !pokemon.hasType("Feral")) return false;
		},
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.moves.get(moveSlot.id);
				if ((move.type === "Crystal" && !pokemon.hasType("Crystal")) || (move.type === "Feral" && !pokemon.hasType("Feral"))) {
					pokemon.disableMove(moveSlot.id, false);
				}
			}
		},
	},
	spriteviewer: {
		effectType: 'ValidatorRule',
		name: 'Sprite Viewer',
		desc: "Displays a fakemon's sprite in chat when it is switched in for the first time",
		onBegin() {
			this.add('rule', 'Sprite Viewer: Displays sprites in chat');
		},
		onSwitchIn(pokemon) {
			if (!this.effectState[pokemon.species.id]) {
				this.add('-message', `${pokemon.species.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/scootopia/sprites/front/${pokemon.species.id}.png" height="96" width="96">`);
				this.effectState[pokemon.species.id] = true;
			}
		},
	},
};
