export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	statusmod: {
		effectType: 'Rule',
		name: 'Status Mod',
		desc: "Displays Dragonblight as a volatile",
		onSwitchIn(pokemon) {
			if (pokemon.status === 'dragonblight') {
				this.add('-start', pokemon, 'dragonblight', '[silent]');
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.status === 'dragonblight') {
				this.add('-start', target, 'dragonblight', '[silent]');
			}
		},
		/* onCureStatus(pokemon, source, effect) {
			const cured = effect?.status || pokemon.statusState?.prevStatus;
			if (cured === 'dragonblight') {
				this.add('-end', pokemon, 'dragonblight', '[silent]');
			}
		}, */
	},
	megadatamod: {
		effectType: 'Rule',
		name: 'Mega Data Mod',
		desc: 'Gives data on stats, Ability and types when a Pokémon Mega Evolves or undergoes Ultra Burst.',
		onSwitchIn(pokemon) {
			if (pokemon.species.forme.startsWith('Mega') || pokemon.species.forme.startsWith('Ultra')) {
				this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			}
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
			const species = pokemon.species;
			let buf = `<span class="col pokemonnamecol" style="white-space: nowrap">${species.name}</span> `;
			buf += `<span class="col typecol">`;
			buf += `<img src="https://${Config.routes.client}/sprites/types/${species.types[0]}.png" alt="${species.types[0]}" height="14" width="32">`;
			if (species.types[1]) {
				buf += `<img src="https://${Config.routes.client}/sprites/types/${species.types[1]}.png" alt="${species.types[1]}" height="14" width="32">`;
			}
			buf += `</span> `;
			buf += `<span style="float: left ; min-height: 26px"><span class="col abilitycol">${species.abilities[0]}</span><span class="col abilitycol"></span></span>`;
			const stats = [];
			let stat: StatID;
			for (stat in species.baseStats) {
				const statNames: { [k in StatID]: string } = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };
				stats.push(`<span class="col statcol"><em>${statNames[stat]}</em><br>${species.baseStats[stat]}</span>`);
			}
			buf += `<span style="float: left ; min-height: 26px">${stats.join(' ')}</span>`;
			buf += `</span>`;
			this.add(`raw|<ul class="utilichart"><li class="result">${buf}</li><li style="clear: both"></li></ul>`);
		},
	},
	spriteviewer: {
		effectType: 'ValidatorRule',
		name: 'Sprite Viewer',
		desc: "Displays a fakemon's sprite in chat when it is switched in for the first time",
		onBegin() {
			this.add('rule', 'Sprite Viewer: Displays sprites in chat');
		},
		onSwitchIn(pokemon) {
			if (!this.effectState[pokemon.species.id]) {
				this.add('-message', `${pokemon.species.name}'s Sprite:`);
				this.add(`raw|<img src="https://raw.githubusercontent.com/scoopapa/DH2/refs/heads/main/data/mods/monsterhunter/sprites/front/${pokemon.species.id}.png" height="96" width="96">`);
				this.effectState[pokemon.species.id] = true;
			}
		},
	},
};
