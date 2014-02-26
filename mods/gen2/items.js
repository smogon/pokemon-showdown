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
	leppaberry: {
		inherit: true,
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
	}
};
