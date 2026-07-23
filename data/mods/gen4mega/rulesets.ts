export const Rulesets: import('../../../sim/dex-formats').ModdedFormatDataTable = {
	modernmegaspeedmod: {
		effectType: 'Rule',
		name: 'Modern Mega Speed Mod',
		desc: "A Mega Evolution's new Speed and priority modifiers apply on the turn it evolves.",
		onAfterMega(pokemon) {
			// The base engine performs this re-order only in Gen 7. Reinsert the
			// pending move after formeChange so Gen 4 action order sees the Mega's
			// Speed and acquired priority ability.
			for (const [i, queuedAction] of this.queue.list.entries()) {
				if (queuedAction.pokemon === pokemon && queuedAction.choice === 'move') {
					this.queue.list.splice(i, 1);
					queuedAction.mega = 'done';
					this.queue.insertChoice(queuedAction, true);
					break;
				}
			}
		},
	},
};
