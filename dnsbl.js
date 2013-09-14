var dns = require('dns');

var blocklists = ['sbl.spamhaus.org', 'rbl.efnetrbl.org'];

var dnsblCache = {};

exports.query = function queryDnsbl(ip, callback) {
	if (ip in dnsblCache) {
		callback(dnsblCache[ip]);
		return;
	}
	var reversedIpDot = ip.split('.').reverse().join('.')+'.';
	queryDnsblLoop(ip, callback, reversedIpDot, 0);
}

function queryDnsblLoop(ip, callback, reversedIpDot, index) {
	if (index >= blocklists.length) {
		// not in any blocklist
		callback(dnsblCache[ip] = false);
		return;
	}
	var blocklist = blocklists[index];
	dns.resolve4(reversedIpDot+blocklist, function(err, addresses) {
		if (!err) {
			// blocked
			callback(dnsblCache[ip] = blocklist);
		} else {
			// not blocked, try next blocklist
			queryDnsblLoop(ip, callback, reversedIpDot, index+1);
		}
	});
}
