// Note: These are the rules that formats use

import type { Learnset } from "../../../sim/dex-species";

// The list of formats is stored in config/formats.js
export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {

	// Rulesets
	///////////////////////////////////////////////////////////////////
	noeffectivenessmod: {
		inherit: true,
        effectType: 'Rule',
        name: 'No Effectiveness Mod',
        desc: "All damaging moves are normal effective.",
        onNegateImmunity: false,
        onBegin() {
            this.add('rule', 'No Effectiveness Mod: All damaging moves are normal effective!');
        },
        onEffectivenessPriority: 1,
        onEffectiveness(typeMod, target, type, move) {
            if (move && move.category === 'Status') return;
            if (move && !this.dex.getImmunity(move, type)) return 0;
            return 0;
        },
    },
	
	
};
