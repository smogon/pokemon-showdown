'use strict';

exports.BattleScripts = {
	init: function () {
		let learnsets = Object.assign({}, this.data.Learnsets);
		let dex = [];
		for (let i in this.data.Pokedex) {
			if (this.data.Pokedex[i].num <= 0) continue;
			if (this.data.Pokedex[i].evos) continue;
			if (!learnsets[i]) continue;
			if (this.data.FormatsData[i].isUnreleased) continue;
			if (this.data.FormatsData[i].tier && this.data.FormatsData[i].tier === 'Illegal') continue;
			dex.push(i);
		}
		for (let i = 0; i < dex.length; i++) {
			let pokemon = dex[i];
			let p1 = dex[(i === 0 ? dex.length - 1 : i - 1)];
			let p2 = dex[(i === dex.length - 1 ? 0 : i + 1)];
			this.modData('Learnsets', pokemon).learnset = Object.assign({}, learnsets[p1].learnset, learnsets[p2].learnset, learnsets[pokemon].learnset);
			if (this.data.Pokedex[pokemon].prevo) {
				this.modData('Learnsets', this.data.Pokedex[pokemon].prevo).learnset = this.modData('Learnsets', pokemon).learnset;
			}
		}
	},
};
