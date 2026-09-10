// Note: These are the rules that formats use

import type { Learnset } from "../../../sim/dex-species";

// The list of formats is stored in config/formats.js
export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {

	// Rulesets
	///////////////////////////////////////////////////////////////////
	supereffectivemod: {
		inherit: true,
        effectType: 'Rule',
        name: 'Super Effective Mod',
        desc: "All damaging moves are super effective.",
        onNegateImmunity: false,
        onBegin() {
            this.add('rule', 'Super Effective Mod: All damaging moves are super effective!');
        },
        onEffectivenessPriority: 1,
        onEffectiveness(typeMod, target, type, move) {
            if (move && move.category === 'Status') return;
            if (move && !this.dex.getImmunity(move, type)) return 1;
            return 1;
        },
    },
	
	
};
