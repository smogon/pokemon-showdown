export const Items: {[k: string]: ModdedItemData} = {
	// Brookeee
	ramen: {
		name: "Ramen",
		spritenum: 22,
		fling: {
			basePower: 10,
		},
		onAfterSetStatusPriority: -1,
		onAfterSetStatus(status, pokemon) {
			pokemon.eatItem();
		},
		onUpdate(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion'] || pokemon.hp <= pokemon.maxhp < 4 || (pokemon.maxhp <= pokemon.maxhp < 2 && pokemon.hasAbility('gluttony'))) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({spe: 1});
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
			pokemon.addVolatile('focusenergy');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fairy' || move.type === 'Flying' || move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		gen: 8,
		desc: "Raises Speed and critical hit ratio by 1 stage if at 25% of HP or when it cures status or halves damage taken from a Fairy/Flying/Psychic-type attack.",
	},

	// Horrific17
	horrifiumz: {
		name: "Horrifium Z",
		spritenum: 632,
		onTakeItem: false,
		zMove: "Final Trick",
		zMoveFrom: "Meteor Charge",
		itemUser: ["Arcanine"],
		gen: 8,
		desc: "If held by an Arcanine with Meteor Charge, it can use Final Trick.",
	},
};
