exports.BattleScripts = {
	init: function () {
		for (var i in this.data.Items) {
			if (this.data.Items[i].megaStone) {
				this.modData('Items', i).onTakeItem = function (item, source) {
					if (source.canMegaEvo || item.megaEvolves === source.baseTemplate.baseSpecies) return false;
					return true;
				};
			}
		}
	}
};
