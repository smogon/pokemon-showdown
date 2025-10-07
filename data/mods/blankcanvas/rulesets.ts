export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
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
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/blankcanvas/sprites/front/${pokemon.species.id}.png" height="96" width="96">`);
				this.effectState[pokemon.species.id] = true;
			}
		},
	},
};
