exports.BattleFormats = {
	pokemon: {
		inherit: true,
		effectType: 'Banlist',
		onValidateSet: function (set) {
			var template = this.getTemplate(set.species);
			var item = this.getItem(set.item);
			if (item && item.id === 'griseousorb' && template.num !== 487) {
				return ['Griseous Orb can only be held by Giratina in Generation 4.'];
			}
		}
	}
};

