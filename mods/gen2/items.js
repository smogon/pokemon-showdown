exports.BattleItems = {
	amuletcoin: {
		id: "amuletcoin",
		name: "Amulet Coin",
		num: -1,
		gen: 2,
		desc: "Doubles the amount of money received in trainer battles."
	},
	berry: {
		id: "berry",
		name: "Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) pokemon.eatItem();
		},
		onEat: function(pokemon) {
			this.heal(10);
		},
		num: -2,
		gen: 2,
		desc: "Restores 10 HP when the holder of this item is at 50% HP or less. One-time use."
	},
	berserkgene: {
		id: "berserkgene",
		name: "Berserk Gene",
		onUpdate: function(pokemon) {
			this.boost({atk: 2});
			pokemon.addVolatile('confuse');
			pokemon.setItem('');
		},
		gen: 2,
		desc: "Raises attack by 2 when holder is switched in.  Confuses holder.  Single use."
	},
	bitterberry: {
		id: "bitterberry",
		name: "Bitter Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.volatiles['confusion']) pokemon.eatItem();
		},
		onEat: function(pokemon) {
			this.removeVolatile('confusion');
		},
		gen: 2,
		desc: "Holder is cured if it is confused. Single use."
	},
	burntberry: {
		id: "burntberry",
		name: "Burnt Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.status === 'brn') pokemon.eatItem();
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'brn') pokemon.cureStatus();
		},
		gen: 2,
		desc: "Holder is cured if it is burned. Single use."
	},
	dragonscale: {
		id: "dragonscale",
		name: "Dragon Scale",
		num: -3,
		gen: 2,
		desc: "Evolves Seadra into Kingdra. Raises power of Dragon-type moves by 10%."
	},
	goldberry: {
		id: "goldberry",
		name: "Gold Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.hp <= pokemon.maxhp/2) pokemon.eatItem();
		},
		onEat: function(pokemon) {
			this.heal(30);
		},
		gen: 2,
		desc: "Restores 30 HP when the holder of this item is at 50% HP or less. One-time use."
	},
	iceberry: {
		id: "iceberry",
		name: "Ice Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.status === 'frz') pokemon.eatItem();
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'frz') pokemon.cureStatus();
		},
		gen: 2,
		desc: "Holder is cured if it is frozen. Single use."
	},
	metalpowder: {
		inherit: true,
		onModifyDef: function(def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return def * 1.5;
			}
		},
		onModifySpD: function(def, pokemon) {
			if (pokemon.template.species === 'Ditto') {
				return def * 1.5;
			}
		}
	},
	mintberry: {
		id: "mintberry",
		name: "Mint Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.status === 'slp') pokemon.eatItem();
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'slp') pokemon.cureStatus();
		},
		gen: 2,
		desc: "Holder wakes up if it is asleep. Single use."
	},
	miracleberry: {
		id: "miracleberry",
		name: "Miracle Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		gen: 2,
		desc: "Holder cures itself if it is confused or has a major status problem. Single use."
	},
	mysteryberry: {
		id: "mysteryberry",
		name: "Mystery Berry",
		isBerry: true,
		onUpdate: function(pokemon) {
			var move = pokemon.getMoveData(pokemon.lastMove);
			if (move && move.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].move = move;
				pokemon.eatItem();
			}
		},
		onEat: function(pokemon) {
			var move;
			if (pokemon.volatiles['leppaberry']) {
				move = pokemon.volatiles['leppaberry'].move;
				pokemon.removeVolatile('leppaberry');
			} else {
				var pp = 99;
				for (var i in pokemon.moveset) {
					if (pokemon.moveset[i].pp < pp) {
						move = pokemon.moveset[i];
						pp = move.pp;
					}
				}
			}
			move.pp += 5;
			if (move.pp > move.maxpp) move.pp = move.maxpp;
			this.add("-message",pokemon.name+" restored "+move.move+"'s PP using its Leppa Berry! (placeholder)");
		},
		gen: 2,
		desc: "Restores 5PP to the first of the holder's moves to reach 0PP. Single use."
	},
	przcureberry: {
		id: "przcureberry",
		name: "PrzcureBerry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.status === 'par') pokemon.eatItem();
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'par') pokemon.cureStatus();
		},
		gen: 2,
		desc: "Holder cures itself if it is paralyzed. Single use."
	},
	psncureberry: {
		id: "psncureberry",
		name: "PsncureBerry",
		isBerry: true,
		onUpdate: function(pokemon) {
			if (pokemon.status === 'psn') pokemon.eatItem();
		},
		onEat: function(pokemon) {
			if (pokemon.status === 'psn') pokemon.cureStatus();
		},
		gen: 2,
		desc: "Holder is cured if it is poisoned. Single use."
	}
};
