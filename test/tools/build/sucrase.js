/**
 * Quick test to ensure the sucrase build script always works (for downstream devs)
 * @author mia-pi-git
 */
'use strict';
const {execSync: exec} = require('child_process');
const common = require('../../common');

(common.hasModule('sucrase') ? describe : describe.skip)("The Sucrase build script", () => {
	it("Should compile successfully (slow)", () => {
		// we explicitly are not testing the stuff from build tools
		// as the replace step in the build is asynchronous and we want to wait for
		// the entire thing to end
		exec('node build');
	});
});
