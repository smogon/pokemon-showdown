export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	deoxyscamouflageclausemod: {
		inherit: true,
		name: 'Deoxys Camouflage Clause',
		onBegin() {
			const deoxys = ['Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed'];
			for (const forme of deoxys) {
				const species = this.dex.species.get(forme);
				if (!this.ruleTable.isBannedSpecies(species)) {
					this.add('rule', 'Deoxys Camouflage Clause: Reveals the Deoxys forme when it is sent in battle.');
					break;
				}
			}
		},
	},
};
