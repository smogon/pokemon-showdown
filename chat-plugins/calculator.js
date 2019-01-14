'use strict';

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

let isNumeric = (str) => !isNaN(parseFloat(str));

function parseMathematicalExpression(infix) {
	// Shunting-yard Algorithm -- https://en.wikipedia.org/wiki/Shunting-yard_algorithm
	let outputQueue = [];
	let operatorStack = [];
	infix = infix.replace(/\s+/g, "");
	infix = infix.split(/([+\-*/^()])/);
	infix = infix.filter(token => token);
	for (const token of infix) {
		if ("^*/+-".includes(token)) {
			let op = OPERATORS[token];
			let prevToken = operatorStack[operatorStack.length - 1];
			let prevOp = OPERATORS[prevToken];
			while ("^*/+-".includes(prevToken) && (
				op.associativity === "Left" ? op.precedence <= prevOp.precedence : op.precedence < prevOp.precedence
			)) {
				outputQueue.push(operatorStack.pop());
				prevToken = operatorStack[operatorStack.length - 1];
				prevOp = OPERATORS[prevToken];
			}
			operatorStack.push(token);
		} else if (token === "(") {
			operatorStack.push(token);
		} else if (token === ")") {
			while (operatorStack[operatorStack.length - 1] !== "(") {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.pop();
		} else {
			outputQueue.push(token);
		}
	}
	while (operatorStack.length > 0) {
		outputQueue.push(operatorStack.pop());
	}
	return outputQueue;
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
