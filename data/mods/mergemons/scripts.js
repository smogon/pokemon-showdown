'use strict';

/**@type {ModdedBattleScriptsData} */
exports.BattleScripts = {
	init() {
		let learnsets = Object.assign({}, this.data.Learnsets);
		let dex = [];
		for (let i in this.data.Pokedex) {
			if (this.data.Pokedex[i].num <= 0 || this.data.FormatsData[i].isUnreleased) continue;
			if (this.data.Pokedex[i].evos) continue;
			if (!this.data.FormatsData[i].tier || !learnsets[i]) continue;
			if (this.data.FormatsData[i].tier === 'Illegal') continue;
			dex.push(i);
		}
		for (let i = 0; i < dex.length; i++) {
			let pokemon = dex[i];
			while (this.data.Pokedex[pokemon].prevo) {
				pokemon = this.data.Pokedex[pokemon].prevo;
			}
			let target = dex[(i === 0 ? dex.length - 1 : i - 1)];
			while (this.data.Pokedex[pokemon].num === this.data.Pokedex[target].num) {
				target = dex[dex.indexOf(target) - 1];
			}
			let merge = false;
			do {
				let learnset = learnsets[target].learnset;
				for (let move in learnset) {
					if (move === 'shellsmash') continue;
					let source = learnset[move][0].charAt(0) + 'L0';
					if (!(move in learnsets[pokemon].learnset)) this.modData('Learnsets', pokemon).learnset[move] = [source];
				}
				if (this.data.Pokedex[target].prevo) {
					target = this.data.Pokedex[target].prevo;
				} else if (!merge) {
					merge = true;
					target = dex[(i === dex.length - 1 ? 0 : i + 1)];
					while (this.data.Pokedex[pokemon].num === this.data.Pokedex[target].num) {
						target = dex[dex.indexOf(target) + 1];
					}
				} else {
					target = '';
				}
			} while (target && learnsets[target]);
		}
	},
};
