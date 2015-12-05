/**
 * CIDR checker
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file controls support for checking to see if an IP matches a
 * CIDR range.
 *
 * @license MIT license
 */

'use strict';

let ipToLong = exports.ipToLong = function (ip) {
	let numIp = 0;
	let parts = ip.split('.');
	for (let i = 0, len = parts.length; i < len; i++) {
		numIp *= 256;
		numIp += Number(parts[i]);
	}
	return numIp;
};

let getPattern = exports.getPattern = function (cidr) {
	if (!cidr) return null;
	let index = cidr.indexOf('/');
	if (index > 0) {
		let subnet = ipToLong(cidr.substr(0, index));
		let bits = parseInt(cidr.substr(index + 1), 10);
		let mask = -1 << (32 - bits);
		return [subnet & mask, mask];
	}
	return [ipToLong(cidr), -1];
};

/**
 * Returns a checker function for the passed CIDR range or array of
 * ranges. The checker function returns boolean whether or not its
 * passed IP is in the range.
 */
let checker = exports.checker = function (cidr) {
	if (!cidr || !cidr.length) {
		return function () {
			return false;
		};
	}

	let patterns;
	if (Array.isArray(cidr)) {
		patterns = cidr.map(getPattern).filter(function (x) {
			return x;
		});
	} else {
		patterns = [getPattern(cidr)];
	}

	return function (ip) {
		let longip = ipToLong(ip);
		for (let i = 0; i < patterns.length; ++i) {
			let pattern = patterns[i];
			if ((longip & pattern[1]) === pattern[0]) {
				return true;
			}
		}
		return false;
	};
};

exports.check = function (cidr, ip) {
	return checker(cidr)(ip);
};
