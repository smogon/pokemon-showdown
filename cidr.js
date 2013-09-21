/**
 * CIDR checker
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file controls support for checking to see if an IP matches a
 * CIDR range.
 *
 * @license MIT license
 */

var ipToLong = exports.ipToLong = function(ip) {
	var numIp = 0;
	var parts = ip.split('.');
	for (var i=0, len=parts.length; i<len; i++) {
		numIp *= 256;
		numIp += Number(parts[i]);
	}
	return numIp;
};

var getPattern = exports.getPattern = function(cidr) {
	if (!cidr) return null;
	var index = cidr.indexOf('/');
	if (index > 0) {
		var subnet = ipToLong(cidr.substr(0, index));
		var bits = parseInt(cidr.substr(index+1), 10);
		var mask = -1 << (32 - bits);
		return [subnet & mask, mask];
	}
	return [ipToLong(cidr), -1];
};

/**
 * Returns a checker function for the passed CIDR range or array of
 * ranges. The checker function returns boolean whether or not its
 * passed IP is in the range.
 */
var checker = exports.checker = function(cidr) {
	if (!cidr || !cidr.length) return function() {
		return false;
	};

	var patterns;
	if (Array.isArray(cidr)) {
		patterns = cidr.map(getPattern).filter(function(x) {
			return x;
		});
	} else {
		patterns = [getPattern(cidr)];
	}

	return function(ip) {
		var longip = ipToLong(ip);
		for (var i = 0; i < patterns.length; ++i) {
			var pattern = patterns[i];
			if ((longip & pattern[1]) === pattern[0]) {
				return true;
			}
		}
		return false;
	};
};

var check = exports.check = function(cidr, ip) {
	return checker(cidr)(ip);
};
