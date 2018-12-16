'use strict';

/** replace all fx */
function replaceAll(haystack, needle, replace) {
	return haystack.split(needle).join(replace);
}

/** standardize string format */
function reformat(s) {
	s = s.toLowerCase();
	s = replaceAll(s, "-(", "-1*(");
	s = replaceAll(s, ")(", ")*(");
	s = replaceAll(s, " ", "");
	s = replaceAll(s, "-", "+-");
	s = replaceAll(s, "--", "+");
	s = replaceAll(s, "++", "+");
	s = replaceAll(s, "(+", "(");
	let i;
	for (i = 0; i < 10; i++) {
		s = replaceAll(s, i + "(", i + "*" + "(");
	}
	while (s.charAt(0) === "+") s = s.substr(1);
	return s;
}

/** determine if char should be added to side */
function isParseable(n, minus) {
	return (!isNaN(n) || (n === "-" && !minus) || n === ".");
}

/** general fx to get two terms of any fx (multiply, add, etc) */
function getSide(haystack, middle, direction, minus) {
	let i = middle + direction;
	let term = "";
	let limit = (direction === -1) ? 0 : haystack.length; // set the stopping point, when you have gone too far
	while (i * direction <= limit) { // while the current position is >= 0, or <= upper limit
		if (isParseable(haystack[i], minus)) {
			if (direction === 1) term = term + haystack[i];
			else term = haystack[i] + term;
			i += direction;
		} else { return term; }
	}
	return term;
}

/** fx to generically map a symbol to a function for parsing */
function allocFx(eq, symbol, alloc, minus) {
	minus = (typeof minus !== 'undefined'); // sometimes we want to capture minus signs, sometimes not
	if (eq.includes(symbol)) {
		let middleIndex = eq.indexOf(symbol);
		let left = getSide(eq, middleIndex, -1, minus);
		let right = getSide(eq, middleIndex, 1, false);
		eq = replaceAll(eq, left + symbol + right, alloc(left, right));
	}
	return eq;
}

/** main recursive fx + PEMDAS */
function solveStr(eq) {
	firstNest:
	while (eq.includes("(")) { // while the string has any parentheses
		let first = eq.indexOf("("); // first get the earliest open parentheses
		let last = first + 1; // start searching at the character after
		let layer = 1; // we might run into more parentheses, so this integer will keep track
		while (layer !== 0) { // loop this until we've found the close parenthesis
			if (eq[last] === ")") { // if we run into a close parenthesis, then subtract one from "layer"
				layer--;
				if (layer === 0) break; // if it is the corresponding closing parenthesis for our outermost open parenthesis, then we can deal with this expression
			} else if (eq[last] === "(") { // if we see an open parenthesis, add one to "layer"
				layer++;
			}
			last++; // increment the character we're looking at
			if (last > eq.length) break firstNest;
		}
		let nested = eq.substr(first + 1, last - first - 1); // get the expression between the parentheses
		if (last + 1 <= eq.length) { // if there is exponentiation, change to a different symbol
			if (eq[last + 1] === "^") {
				eq = eq.substr(0, last + 1) + "&" + eq.substr((last + 1) + 1);
			}
		}
		let solvedStr = solveStr(nested);
		let preStr = "(" + nested + ")";
		eq = eq.replace(preStr, solvedStr); // replace parenthetical with value
	}
	while (eq.includes("^")) {
		eq = allocFx(eq, "^", (l, r) => Math.pow(parseFloat(l), parseFloat(r)), false);
	}
	while (eq.includes("&")) {
		eq = allocFx(eq, "&", (l, r) => Math.pow(parseFloat(l), parseFloat(r))); // account for things like (-3)^2
	}
	while (eq.includes("*") || eq.includes("/")) {
		let multiply = true;
		if (eq.indexOf("*") < eq.indexOf("/")) {
			multiply = (eq.includes("*"));
		} else {
			multiply = !(eq.includes("/"));
		}
		if (multiply) {
			eq = allocFx(eq, "*", (l, r) => parseFloat(l) * parseFloat(r));
		} else {
			eq = allocFx(eq, "/", (l, r) => parseFloat(l) / parseFloat(r));
		}
	}
	while (eq.includes("+")) {
		eq = allocFx(eq, "+", (l, r) => parseFloat(l) + parseFloat(r));
	}
	return eq;
}

exports.commands = {
	calculate: function (target, room, user) {
		let result = solveStr(reformat(target));
		if (!target) return this.parse('/help calculate');
		if (!this.runBroadcast()) return;
		let validation_regex = /^(?!.*([*/+\-.]{2}|\.\d+\.+|^[*/]))[\d+()^*\-/. ]+$/gm;
		if (validation_regex.test(target) === false) {
			return this.errorReply("Invalid arithmetical question");
		} else {
			return this.sendReplyBox(`Result: ${result}`);
		}
	},
	calculatehelp: [
		`/calculate [arithmetical question] - Calculates an arithmetical question.`,
	],
};

