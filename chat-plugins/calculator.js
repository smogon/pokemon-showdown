'use strict';

let isNumeric = (str) => !isNaN(parseFloat(str));

function parseMathematicalExpression(infix) {
	// Shunting-yard Algorithm -- https://en.wikipedia.org/wiki/Shunting-yard_algorithm
	const OUTPUT_QUEUE = [];
	const OPERATOR_STACK = [];
	const OPERATORS = {
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
	for (const token of infix) {
		if ("^*/+-".includes(token)) {
			let op = OPERATORS[token];
			let prevToken = OPERATOR_STACK[OPERATOR_STACK.length - 1];
			let prevOp = OPERATORS[prevToken];
			while ("^*/+-".includes(prevToken) && (
				op.associativity === "Left" ? op.precedence <= prevOp.precedence : op.precedence < prevOp.precedence
			)) {
				OUTPUT_QUEUE.push(OPERATOR_STACK.pop());
				prevToken = OPERATOR_STACK[OPERATOR_STACK.length - 1];
				prevOp = OPERATORS[prevToken];
			}
			OPERATOR_STACK.push(token);
		} else if (token === "(") {
			OPERATOR_STACK.push(token);
		} else if (token === ")") {
			while (OPERATOR_STACK[OPERATOR_STACK.length - 1] !== "(") {
				OUTPUT_QUEUE.push(OPERATOR_STACK.pop());
			}
			OPERATOR_STACK.pop();
		} else {
			OUTPUT_QUEUE.push(token);
		}
	}
	while (OPERATOR_STACK.length > 0) {
		OUTPUT_QUEUE.push(OPERATOR_STACK.pop());
	}
	return OUTPUT_QUEUE;
}

function solveRPN(rpn) {
	let resultStack = [];
	for (const token of rpn) {
		if (isNumeric(token) === true) {
			resultStack.push(Number(token));
		} else {
			let a = resultStack.pop();
			let b = resultStack.pop();
			switch (token) {
			case "+":
				resultStack.push(a + b);
				break;
			case "-":
				resultStack.push(b - a);
				break;
			case "*":
				resultStack.push(a * b);
				break;
			case "/":
				resultStack.push(b / a);
				break;
			case "^":
				resultStack.push(b ** a);
				break;
			}
		}
	}
	return resultStack.pop();
}

exports.commands = {
	math: "calculate",
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
