'use strict';

module.exports = {
	"extends": "./config-base.js",
	"env": {
		"browser": true,
		"es6": false
	},
	"rules": {
		"quote-props": [2, "as-needed", {"keywords": true, "unnecessary": false}]
	}
};
