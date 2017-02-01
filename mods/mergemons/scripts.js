'use strict';

exports.BattleScripts = {
	init: function () {
		let dex = [];
		for (let i in this.data.Pokedex) {
			if (this.data.Pokedex[i].num <= 0) continue;
			if (this.data.Pokedex[i].evos) continue;
			if (!this.data.Learnsets[i]) continue;
			if (this.data.FormatsData[i].isUnreleased) continue;
			if (this.data.FormatsData[i].tier && this.data.FormatsData[i].tier === 'Illegal') continue;
			dex.push(i);
		}
		for (let i = 0; i < dex.length; i++) {
			let p1 = dex[(i === 0 ? dex.length - 1 : i - 1)];
			let p2 = dex[(i === dex.length - 1 ? 0 : i + 1)];
			this.modData('Learnsets', dex[i]).learnset = Object.assign({}, this.modData('Learnsets', p1).learnset, this.modData('Learnsets', p2).learnset, this.modData('Learnsets', dex[i]).learnset);
		}
	},
};
