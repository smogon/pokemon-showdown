'use strict';

const path = require('path');
const browserRequire = require('../browser-require');

Object.assign(exports, (function () {
	const cajaPath = path.resolve(__dirname, 'html-css-sanitizer-bundle.js');
	const sandbox = browserRequire(cajaPath, function (fileContents) {
		// Support data: URIs
		return fileContents.replace(/ALLOWED_URI_SCHEMES\s*=\s*\/\^\(\?\:([^\/\$\)]+)\)\$\/i/g, 'ALLOWED_URI_SCHEMES = /^(?:$1|data)$/i');
	});

	return {html: sandbox.html, html4: sandbox.html4};
})());
