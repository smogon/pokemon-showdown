exports.BattleScripts = {
	init: function () {
		var battleFormeIDs = {'Mega':1, 'Mega-X':1, 'Mega-Y':1};
		// due to a happy coincidence, no other Pokémon having HP as its min xor max stat changes forme in-battle
		var battleAltFormes = [];
		for (var i in this.data.Pokedex) {
			var dexEntry = this.data.Pokedex[i];
			if (dexEntry.forme in battleFormeIDs) {
				// should be processed after their base forme is
				battleAltFormes.push(i);
				continue;
			}
			var maxValue = dexEntry.baseStats[Object.max(dexEntry.baseStats)];
			var minValue = dexEntry.baseStats[Object.min(dexEntry.baseStats)];

			if (maxValue === minValue) continue;

			var modStats = {};
			for (var statID in dexEntry.baseStats) {
				if (dexEntry.baseStats[statID] === maxValue) {
					modStats[statID] = minValue;
				} else if (dexEntry.baseStats[statID] === minValue) {
					modStats[statID] = maxValue;
				} else {
					modStats[statID] = dexEntry.baseStats[statID];
				}
			}
			this.modData('Pokedex', i).baseStats = modStats;
		}
		// megas inherit the swapped HP from the base forme and ignore it for their own swap
		for (var i = 0, len = battleAltFormes.length; i < len; i++) {
			var dexEntry = this.data.Pokedex[battleAltFormes[i]];
			var swappableStats = Object.reject(dexEntry.baseStats, 'hp');

			var maxValue = swappableStats[Object.max(swappableStats)];
			var minValue = swappableStats[Object.min(swappableStats)];

			if (maxValue === minValue) continue;

			var modStats = {'hp': this.data.Pokedex[toId(dexEntry.baseSpecies)].baseStats['hp']};
			for (var statID in swappableStats) {
				if (swappableStats[statID] === maxValue) {
					modStats[statID] = minValue;
				} else if (swappableStats[statID] === minValue) {
					modStats[statID] = maxValue;
				} else {
					modStats[statID] = swappableStats[statID];
				}
			}
			this.modData('Pokedex', battleAltFormes[i]).baseStats = modStats;
		}
	}
};
