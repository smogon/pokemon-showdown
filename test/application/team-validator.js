'use strict';

describe('Team Validator features', function () {
	describe('TeamValidator', function () {
		it('should reject non-existent Pokemon', function (done) {
			let packedTeam = "|nonexistentPokemon|eviolite||thunderbolt|||||||";
			TeamValidator('customgame').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done();
				return done(new Error("Non-existent Pokemon accepted"));
			});
		});

		it('should reject non-existent items', function (done) {
			let packedTeam = "|pikachu|nonexistentItem||thunderbolt|||||||";
			TeamValidator('customgame').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done();
				return done(new Error("Non-existent item accepted"));
			});
		});

		it('should reject non-existent abilities', function (done) {
			let packedTeam = "|pikachu|eviolite|nonexistentAbility|thunderbolt|||||||";
			TeamValidator('customgame').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done();
				return done(new Error("Non-existent ability accepted"));
			});
		});

		it('should reject non-existent moves', function (done) {
			let packedTeam = "|pikachu|eviolite||nonexistentMove|||||||";
			TeamValidator('customgame').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done();
				return done(new Error("Non-existent move accepted"));
			});
		});

		it('should accept legal movesets', function (done) {
			let packedTeam = "|pikachu|||agility,protect,thunder,thunderbolt|||||||";
			TeamValidator('anythinggoes').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '1') return done();
				return done(new Error("Legal moveset rejected"));
			});
		});

		it('should reject illegal movesets', function (done) {
			let packedTeam = "|pikachu|||blastburn,frenzyplant,hydrocannon,dragonascent|||||||";
			TeamValidator('anythinggoes').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done();
				return done(new Error("Illegal moveset accepted"));
			});
		});

		it('should accept both ability types for Mega Evolutions', function (done) {
			// base forme ability
			let packedTeam = "|gyaradosmega|gyaradosite|intimidate|dragondance,crunch,waterfall,icefang|||||||";
			TeamValidator('anythinggoes').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done(new Error("Mega Evolution base forme ability rejected"));
			});

			// mega forme ability
			packedTeam = "|gyaradosmega|gyaradosite|moldbreaker|dragondance,crunch,waterfall,icefang|||||||";
			TeamValidator('anythinggoes').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '1') return done();
				return done(new Error("Mega Evolution mega forme ability rejected"));
			});
		});

		it('should reject newer Pokemon in older gens', function (done) {
			let packedTeam = "|pichu|||thunderbolt|||||||";
			TeamValidator('gen1ou').prepTeam(packedTeam).then(result => {
				if (result.charAt(0) === '0') return done();
				return done(new Error("Newer Pokemon accepted in older gen"));
			});
		});
	});
});
