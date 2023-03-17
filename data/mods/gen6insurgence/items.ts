export const Items: {[k: string]: ModdedItemData} = {
	// Insurgence items
	poliwrathite: {
		inherit: true,
		isNonstandard: null,
	},
	marowite: {
		inherit: true,
		isNonstandard: null,
	},
	eevite: {
		inherit: true,
		isNonstandard: null,
	},
	meganiumite: {
		inherit: true,
		isNonstandard: null,
	},
	typhlosionite: {
		inherit: true,
		isNonstandard: null,
	},
	feraligatite: {
		inherit: true,
		isNonstandard: null,
	},
	sudowoodite: {
		inherit: true,
		isNonstandard: null,
	},
	politoedite: {
		inherit: true,
		isNonstandard: null,
	},
	sunflorite: {
		inherit: true,
		isNonstandard: null,
	},
	etigirafarigite: {
		inherit: true,
		isNonstandard: null,
	},
	steelixitefire: {
		inherit: true,
		isNonstandard: null,
	},
	macargonite: {
		inherit: true,
		isNonstandard: null,
	},
	donphanite: {
		inherit: true,
		isNonstandard: null,
	},
	miltankite: {
		inherit: true,
		isNonstandard: null,
	},
	shiftrite: {
		inherit: true,
		isNonstandard: null,
	},
	flygonite: {
		inherit: true,
		isNonstandard: null,
	},
	cacturnite: {
		inherit: true,
		isNonstandard: null,
	},
	crawdite: {
		inherit: true,
		isNonstandard: null,
	},
	milotite: {
		inherit: true,
		isNonstandard: null,
	},
	jirachite: {
		inherit: true,
		isNonstandard: null,
	},
	chatotite: {
		inherit: true,
		isNonstandard: null,
	},
	spiritombite: {
		inherit: true,
		isNonstandard: null,
	},
	froslassite: {
		inherit: true,
		isNonstandard: null,
	},
	zebstrikite: {
		inherit: true,
		isNonstandard: null,
	},
	zoronite: {
		inherit: true,
		isNonstandard: null,
	},
	gothitite: {
		inherit: true,
		isNonstandard: null,
	},
	reuniclite: {
		inherit: true,
		isNonstandard: null,
	},
	cryogonite: {
		inherit: true,
		isNonstandard: null,
	},
	haxorite: {
		inherit: true,
		isNonstandard: null,
	},
	stunfiskite: {
		inherit: true,
		isNonstandard: null,
	},
	bisharpite: {
		inherit: true,
		isNonstandard: null,
	},
	hydreigonite: {
		inherit: true,
		isNonstandard: null,
	},
	deltavenusaurite: {
		inherit: true,
		isNonstandard: null,
	},
	deltacharizardite: {
		inherit: true,
		isNonstandard: null,
	},
	deltablastoisinite: {
		inherit: true,
		isNonstandard: null,
	},
	deltabisharpite: {
		inherit: true,
		isNonstandard: null,
	},
	deltagardevoirite: {
		inherit: true,
		isNonstandard: null,
	},
	deltagalladite: {
		inherit: true,
		isNonstandard: null,
	},
	deltasunflorite: {
		inherit: true,
		isNonstandard: null,
	},
	deltascizorite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaglalitite: {
		inherit: true,
		isNonstandard: null,
	},
	deltafroslassite: {
		inherit: true,
		isNonstandard: null,
	},
	deltatyphlosionite: {
		inherit: true,
		isNonstandard: null,
	},
	deltapidgeotite: {
		inherit: true,
		isNonstandard: null,
	},
	deltaetigirafarigite: {
		inherit: true,
		isNonstandard: null,
	},
	deltasablenite: {
		inherit: true,
		isNonstandard: null,
	},
	deltamawilite: {
		inherit: true,
		isNonstandard: null,
	},
	deltamedichamite: {
		inherit: true,
		isNonstandard: null,
	},
	deltacameruptite: {
		inherit: true,
		isNonstandard: null,
	},
	deltamilotite: {
		inherit: true,
		isNonstandard: null,
	},
	deltametagrossitespider: {
		inherit: true,
		isNonstandard: null,
	},
	deltametagrossiteruin: {
		inherit: true,
		isNonstandard: null,
	},
	crystalfragment: {
		inherit: true,
		isNonstandard: null,
	},
	deltalopunnite: {
		inherit: true,
		isNonstandard: null,
	},
	deltalucarionite: {
		inherit: true,
		isNonstandard: null,
	},
	crystalpiece: {
		inherit: true,
		isNonstandard: null,
	},
	flygonarmor: {
		inherit: true,
		isNonstandard: null,
	},
	leavannyarmor: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwoarmor: {
		inherit: true,
		isNonstandard: null,
	},
	tyranitararmor: {
		inherit: true,
		isNonstandard: null,
	},
	volcaronadeltaarmor: {
		inherit: true,
		isNonstandard: null,
	},
	zekromarmor: {
		inherit: true,
		isNonstandard: null,
	},
	darkrock: {
		inherit: true,
		isNonstandard: null,
	},
	trickrock: {
		inherit: true,
		isNonstandard: null,
	},
	dragonfang: {
		inherit: true,
		desc: "If held by a Clamperl-Delta, its Attack is doubled. Dragon attacks have 1.2x power.",
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.species.name === 'Clamperl-Delta') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Clamperl-Delta"],
	},
	dragonscale: {
		inherit: true,
		desc: "If held by a Clamperl-Delta, its Defense is doubled",
		onModifyDefPriority: 1,
		onModifyDef(def, pokemon) {
			if (pokemon.species.name === 'Clamperl-Delta') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Clamperl-Delta"],
	},
	aguavberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	belueberry: {
		inherit: true,
		isNonstandard: null,
	},
	cornnberry: {
		inherit: true,
		isNonstandard: null,
	},
	durinberry: {
		inherit: true,
		isNonstandard: null,
	},
	fastball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	figyberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	heavyball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	iapapaberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	jabocaberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / 8, source, target, null, true);
				}
			}
		},
	},
	levelball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lifeorb: {
		inherit: true,
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !move.ohko) {
				this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
			}
		},
	},
	loveball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lureball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	machobrace: {
		inherit: true,
		isNonstandard: null,
	},
	magoberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
	},
	magostberry: {
		inherit: true,
		isNonstandard: null,
	},
	moonball: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	nanabberry: {
		inherit: true,
		isNonstandard: null,
	},
	nomelberry: {
		inherit: true,
		isNonstandard: null,
	},
	oldamber: {
		inherit: true,
		isNonstandard: null,
	},
	pamtreberry: {
		inherit: true,
		isNonstandard: null,
	},
	rabutaberry: {
		inherit: true,
		isNonstandard: null,
	},
	razzberry: {
		inherit: true,
		isNonstandard: null,
	},
	rockyhelmet: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['contact']) {
				this.damage(source.baseMaxhp / 6, source, target, null, true);
			}
		},
	},
	rowapberry: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / 8, source, target, null, true);
				}
			}
		},
	},
	spelonberry: {
		inherit: true,
		isNonstandard: null,
	},
	souldew: {
		inherit: true,
		onBasePower() {},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.num === 380 || pokemon.baseSpecies.num === 381) {
				return this.chainModify(1.5);
			}
		},
	},
	watmelberry: {
		inherit: true,
		isNonstandard: null,
	},
	wepearberry: {
		inherit: true,
		isNonstandard: null,
	},
	wikiberry: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 8);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
	},
};