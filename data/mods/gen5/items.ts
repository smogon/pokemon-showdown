export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	aguavberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Dragon",
		},
	},
	apicotberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Ground",
		},
	},
	aspearberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Ice",
		},
	},
	babiriberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Steel",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	belueberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Electric",
		},
	},
	blukberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Fire",
		},
	},
	buggem: {
		inherit: true,
		isNonstandard: null,
	},
	chartiberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Rock",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	cheriberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Fire",
		},
	},
	chestoberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Water",
		},
	},
	chilanberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Normal",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Normal' && !(target.volatiles['substitute'] && !move.flags['bypasssub'])) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	chopleberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Fighting",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	cobaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Flying",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	colburberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Dark",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	cornnberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Bug",
		},
	},
	custapberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Ghost",
		},
	},
	darkgem: {
		inherit: true,
		isNonstandard: null,
	},
	dragongem: {
		inherit: true,
		isNonstandard: null,
	},
	durinberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Water",
		},
	},
	electricgem: {
		inherit: true,
		isNonstandard: null,
	},
	enigmaberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Bug",
		},
	},
	fightinggem: {
		inherit: true,
		isNonstandard: null,
	},
	figyberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Bug",
		},
	},
	firegem: {
		inherit: true,
		isNonstandard: null,
	},
	flyinggem: {
		inherit: true,
		isNonstandard: null,
	},
	ganlonberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Ice",
		},
	},
	ghostgem: {
		inherit: true,
		isNonstandard: null,
	},
	grassgem: {
		inherit: true,
		isNonstandard: null,
	},
	grepaberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Flying",
		},
	},
	groundgem: {
		inherit: true,
		isNonstandard: null,
	},
	habanberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Dragon",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	hondewberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Ground",
		},
	},
	iapapaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Dark",
		},
	},
	icegem: {
		inherit: true,
		isNonstandard: null,
	},
	jabocaberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Dragon",
		},
	},
	kasibberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Ghost",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	kebiaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Poison",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	kelpsyberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Fighting",
		},
	},
	lansatberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Flying",
		},
	},
	leppaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Fighting",
		},
	},
	liechiberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Grass",
		},
	},
	lumberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Flying",
		},
	},
	mail: {
		inherit: true,
		isNonstandard: null,
	},
	magoberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Ghost",
		},
	},
	magostberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Rock",
		},
	},
	micleberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Rock",
		},
	},
	nanabberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Water",
		},
	},
	nomelberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Dragon",
		},
	},
	occaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Fire",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	oranberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Poison",
		},
	},
	pamtreberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Steel",
		},
	},
	passhoberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Water",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	payapaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Psychic",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	pechaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Electric",
		},
	},
	persimberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Ground",
		},
	},
	petayaberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Poison",
		},
	},
	pinapberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Grass",
		},
	},
	poisongem: {
		inherit: true,
		isNonstandard: null,
	},
	pomegberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Ice",
		},
	},
	psychicgem: {
		inherit: true,
		isNonstandard: null,
	},
	qualotberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Poison",
		},
	},
	rabutaberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Ghost",
		},
	},
	rawstberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Grass",
		},
	},
	razzberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Steel",
		},
	},
	rindoberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Grass",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	rockgem: {
		inherit: true,
		isNonstandard: null,
	},
	rowapberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Dark",
		},
	},
	salacberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting",
		},
	},
	shucaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Ground",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	sitrusberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Psychic",
		},
	},
	spelonberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Dark",
		},
	},
	starfberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Psychic",
		},
	},
	steelgem: {
		inherit: true,
		isNonstandard: null,
	},
	tamatoberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Psychic",
		},
	},
	tangaberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Bug",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	wacanberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Electric",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
	watergem: {
		inherit: true,
		isNonstandard: null,
	},
	watmelberry: {
		inherit: true,
		naturalGift: {
			basePower: 80,
			type: "Fire",
		},
	},
	wepearberry: {
		inherit: true,
		naturalGift: {
			basePower: 70,
			type: "Electric",
		},
	},
	wikiberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Rock",
		},
	},
	yacheberry: {
		inherit: true,
		naturalGift: {
			basePower: 60,
			type: "Ice",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'];
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
	},
};
