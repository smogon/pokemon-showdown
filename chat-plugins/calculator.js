'use strict';

function isNumeric(str) {
	return !isNaN(parseFloat(str)) && isFinite(str);
}

function parseMathematicalExpression(infix) {
	// Shunnting-yard Algorithm -- https://en.wikipedia.org/wiki/Shunting-yard_algorithm
	let outputQueue = [];
	let operatorStack = [];
	let operators = {
		"^": {
			precedence: 4,
			associativity: "Right",
		},
		"/": {
			precedence: 3,
			associativity: "Left",
		},
		"*": {
			precedence: 3,
			associativity: "Left",
		},
		"+": {
			precedence: 2,
			associativity: "Left",
		},
		"-": {
			precedence: 2,
			associativity: "Left",
		},
	};
	infix = infix.replace(/\s+/g, "");
	infix = infix.split(/([+\-*/^()])/);
	infix = infix.filter(token => token);
	let i;
	for (i = 0; i < infix.length; i++) {
		let token = infix[i];
		if (isNumeric(token) === true) {
			outputQueue.push(token);
		} else if ("^*/+-".indexOf(token) !== -1) {
			let o1 = token;
			let o2 = operatorStack[operatorStack.length - 1];
			while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
				outputQueue.push(operatorStack.pop());
				o2 = operatorStack[operatorStack.length - 1];
			}
			operatorStack.push(o1);
		} else if (token === "(") {
			operatorStack.push(token);
		} else if (token === ")") {
			while (operatorStack[operatorStack.length - 1] !== "(") {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.pop();
		}
	}
	while (operatorStack.length > 0) {
		outputQueue.push(operatorStack.pop());
	}
	return outputQueue;
}

function solveRPN(rpn) {
	let resultStack = [];
	let i;
	for (i = 0; i < rpn.length; i++) {
		if (isNumeric(rpn[i]) === true) {
			resultStack.push(rpn[i]);
		} else {
			let a = resultStack.pop();
			let b = resultStack.pop();
			if (rpn[i] === "+") {
				resultStack.push(parseInt(a) + parseInt(b));
			} else if (rpn[i] === "-") {
				resultStack.push(parseInt(b) - parseInt(a));
			} else if (rpn[i] === "*") {
				resultStack.push(parseInt(a) * parseInt(b));
			} else if (rpn[i] === "/") {
				resultStack.push(parseInt(b) / parseInt(a));
			} else if (rpn[i] === "^") {
				resultStack.push(Math.pow(parseInt(b), parseInt(a)));
			}
		}
	}
	return resultStack.pop();
}

exports.commands = {
	calculate: function (target, room, user) {
		if (!target) return this.parse('/help calculate');
		if (!this.runBroadcast()) return;
		let result = solveRPN(parseMathematicalExpression(target));
		let validation_regex = /^(?!.*([\^*/+\-.]{2}|\.\d+\.+|^[*/]))[\d+()^*\-/. ]+$/gm;
		if (validation_regex.test(target) === false) {
			return this.errorReply("Invalid arithmetical question");
		} else {
			return this.sendReplyBox(`Result: ${result}`);
		}
	},
	calculatehelp: [
		`/calculate [arithmetical question] - Calculates an arithmetical question. Supoorts only PEMDAS (Parenthesis, Exponents, Multiplication, Addition, Subtraction).`,
	],
};
