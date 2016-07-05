'use strict';

exports.BattleFormats = {
	batonpassclause: {
		effectType: 'Banlist',
		name: 'Baton Pass Clause',
		onStart: function () {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Spe and other stats simultaneously');
		},
		onValidateTeam: function (team, format) {
			let BPcount = 0;
			for (let i = 0; i < team.length; i++) {
				if (team[i].moves.indexOf('Baton Pass') >= 0) {
					BPcount++;
				}
				if (BPcount > 1) {
					return [(team[i].name || team[i].species) + " has Baton Pass, but you are limited to one Baton Pass user by Baton Pass Clause."];
				}
			}
		},
		onValidateSet: function (set, format, setHas) {
			if (!('batonpass' in setHas)) return;

			// check if Speed is boosted
			let speedBoosted = false;
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.boosts && move.boosts.spe > 0) {
					speedBoosted = true;
					break;
				}
			}
			let boostSpeed = ['duskball', 'flamecharge', 'geomancy', 'motordrive', 'rattled', 'speedboost', 'steadfast', 'weakarmor', 'salacberry'];
			if (!speedBoosted) {
				for (let i = 0; i < boostSpeed.length; i++) {
					if (boostSpeed[i] in setHas) {
						speedBoosted = true;
						break;
					}
				}
			}
			if (!speedBoosted) return;

			// check if non-Speed boosted
			let nonSpeedBoosted = false;
			for (let i = 0; i < set.moves.length; i++) {
				let move = this.getMove(set.moves[i]);
				if (move.boosts && (move.boosts.atk > 0 || move.boosts.def > 0 || move.boosts.spa > 0 || move.boosts.spd > 0)) {
					nonSpeedBoosted = true;
					break;
				}
			}
			let boostNonSpeed = ['acupressure', 'starfberry', 'curse', 'metalclaw', 'meteormash', 'poweruppunch', 'rage', 'rototiller', 'fellstinger', 'bellydrum', 'download', 'justified', 'moxie', 'sapsipper', 'defiant', 'angerpoint', 'cellbattery', 'liechiberry', 'snowball', 'weaknesspolicy', 'diamondstorm', 'flowershield', 'skullbash', 'steelwing', 'stockpile', 'cottonguard', 'ganlonberry', 'keeberry', 'chargebeam', 'fierydance', 'geomancy', 'lightningrod', 'stormdrain', 'competitive', 'absorbbulb', 'petayaberry', 'charge', 'apicotberry', 'luminousmoss', 'marangaberry'];
			if (!nonSpeedBoosted) {
				for (let i = 0; i < boostNonSpeed.length; i++) {
					if (boostNonSpeed[i] in setHas) {
						nonSpeedBoosted = true;
						break;
					}
				}
			}
			if (!nonSpeedBoosted) return;

			return [(set.name || set.species) + " can Baton Pass both Speed and a different stat, which is banned by Baton Pass Clause."];
		},
	}
};
