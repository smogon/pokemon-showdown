'use strict';

exports.BattleFormats = {
	pokemon: {
		inherit: true,
		onValidateSet: function (set) {
			let template = this.getTemplate(set.species);
			if (template.num === 473 && set.moves.sort().join(',') === 'Amnesia,Fury Attack,Ice Shard,Tackle') { // Mamoswine
				return 'Mamoswine cannot get the combination of Amnesia, Fury Attack, Ice Shard and Tackle in Generation 5.';
			}
		}
	}
};
