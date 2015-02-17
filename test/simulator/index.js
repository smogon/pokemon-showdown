var fs = require('fs');
var path = require('path');

function loadTests (desc, dir) {
	var contents = fs.readdirSync(path.join(__dirname, dir));
	describe(desc, function () {
		for (var i = 0; i < contents.length; i++) {
			if (contents[i].substr(-3) === '.js') require('./' + path.join(dir, contents[i]));
		}
	});
}

loadTests('Abilities', 'abilities');
loadTests('Moves', 'moves');
loadTests('Items', 'items');
loadTests('Miscellanous', 'misc');
