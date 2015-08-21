exports.BattleFormats = {
	standard: {
		effectType: 'Banlist',
		inherit: true,
		onValidateSet: function (set) {
			// limit one of each move in Standard
			var template = this.getTemplate(set.species);
			var item = this.getItem(set.item);
			if (item && item.id === 'griseousorb' && template.num !== 487) {
				return ['Griseous Orb can only be held by Giratina in Generation 4.'];
			}
		}
	}
};

