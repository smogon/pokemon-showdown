'use strict';

const fs = require('fs');
const path = require('path');

function loadTests(desc, dir) {
	let contents = fs.readdirSync(path.join(__dirname, dir));
	describe(desc, function () {
		for (let i = 0; i < contents.length; i++) {
			if (contents[i].substr(-3) === '.js') require('./' + path.join(dir, contents[i].substr(0, contents[i].length - 3)));
		}
	});
}

loadTests('Abilities', 'abilities');
loadTests('Moves', 'moves');
loadTests('Items', 'items');
loadTests('Miscellanous', 'misc');
