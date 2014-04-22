exports.BattleScripts = {
	init: function () {
		for (var i in this.data.Learnsets) {
			for (var m in this.data.Learnsets[i].learnset) {
				this.modData('Learnsets', i).learnset[m] = ["6M"];
			}
		}
		var self = this;
		var abilityList = Object.keys(this.data.Abilities).sort().filter(function (i) {return !self.data.Abilities[i].isNonstandard});
		for (var i in this.data.Pokedex) {
			var template = this.getTemplate(i);
			var newAbilities = {};
			for (var a in template.abilities) {
				var abilityIndex = abilityList.indexOf(toId(template.abilities[a]));
				newAbilities[a] = this.data.Abilities[abilityList[abilityIndex + 1] || abilityList[0]].name;
			}
			this.modData('Pokedex', i).abilities = newAbilities;
		}
	}
};
