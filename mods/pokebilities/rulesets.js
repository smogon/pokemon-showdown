'use strict';

exports.BattleFormats = {
	batonpassclause: {
		effectType: 'ValidatorRule',
		name: 'Baton Pass Clause',
		banlist: ["Baton Pass > 1"],
		onStart: function () {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Spe and other stats simultaneously');
		},
		onValidateSet: function (set, format, setHas) {
			if (!('batonpass' in setHas)) return;

			// check if Speed is boosted
			let speedBoosted = false;
			let nonSpeedBoosted = false;
			if (toId(set.item) === 'eeviumz') {
				speedBoosted = true;
				nonSpeedBoosted = true;
			}
			let item = this.getItem(set.item);
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.boosts && move.boosts.spe > 0) {
					speedBoosted = true;
				}
				if (move.boosts && (move.boosts.atk > 0 || move.boosts.def > 0 || move.boosts.spa > 0 || move.boosts.spd > 0)) {
					nonSpeedBoosted = true;
				}
				if (item.zMove && move.type === item.zMoveType) {
					if (move.zMoveBoost && move.zMoveBoost.spe > 0) {
						speedBoosted = true;
					}
					if (move.zMoveBoost && (move.zMoveBoost.atk > 0 || move.zMoveBoost.def > 0 || move.zMoveBoost.spa > 0 || move.zMoveBoost.spd > 0)) {
						nonSpeedBoosted = true;
					}
				}
			}

			let boostSpeed = ['flamecharge', 'geomancy', 'motordrive', 'rattled', 'speedboost', 'steadfast', 'weakarmor', 'blazikenite', 'salacberry'];
			let abilities = Object.values(this.getTemplate(set.species).abilities).map(toId);
			if (!speedBoosted) {
				for (let i = 0; i < boostSpeed.length; i++) {
					if (boostSpeed[i] in setHas || abilities.includes(boostSpeed[i])) {
						speedBoosted = true;
						break;
					}
				}
			}
			if (!speedBoosted) {
				return;
			}

			// check if non-Speed boosted
			let boostNonSpeed = ['acupressure', 'starfberry', 'curse', 'poweruppunch', 'rage', 'rototiller', 'fellstinger', 'bellydrum', 'download', 'justified', 'moxie', 'sapsipper', 'defiant', 'angerpoint', 'cellbattery', 'liechiberry', 'snowball', 'weaknesspolicy', 'diamondstorm', 'flowershield', 'skullbash', 'stockpile', 'cottonguard', 'ganlonberry', 'keeberry', 'chargebeam', 'fierydance', 'geomancy', 'lightningrod', 'stormdrain', 'competitive', 'absorbbulb', 'petayaberry', 'charge', 'apicotberry', 'luminousmoss', 'marangaberry'];
			if (!nonSpeedBoosted) {
				for (let i = 0; i < boostNonSpeed.length; i++) {
					if (boostNonSpeed[i] in setHas || abilities.includes(boostNonSpeed[i])) {
						nonSpeedBoosted = true;
						break;
					}
				}
			}
			if (!nonSpeedBoosted) return;

			return [(set.name || set.species) + " can Baton Pass both Speed and a different stat, which is banned by Baton Pass Clause."];
		},
	},
};
