import { Utils } from '../../lib';

type Operator = '^' | 'negative' | '%' | '/' | '*' | '+' | '-' | '(';
interface Operators {
	precedence: number;
	associativity: "Left" | "Right";
}

const OPERATORS: { [k in Operator]: Operators } = {
	"^": {
		precedence: 5,
		associativity: "Right",
	},
	"negative": {
		precedence: 4,
		associativity: "Right",
	},
	"%": {
		precedence: 3,
		associativity: "Left",
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
	"(": {
		precedence: 1,
		associativity: "Right",
	},
};

const BASE_PREFIXES: { [base: number]: string } = {
	2: "0b",
	8: "0o",
	10: "",
	16: "0x",
};

function parseMathematicalExpression(infix: string) {
	// Shunting-yard Algorithm -- https://en.wikipedia.org/wiki/Shunting-yard_algorithm
	const outputQueue: string[] = [];
	const operatorStack: Operator[] = [];
	infix = infix.replace(/\s+/g, "");
	const infixArray = infix.split(/([+\-*/%^()])/).filter(token => token);
	let isExprExpected = true;
	for (const token of infixArray) {
		if (isExprExpected && "+-".includes(token)) {
			if (token === '-') operatorStack.push('negative');
		} else if ("^%*/+-".includes(token)) {
			if (isExprExpected) throw new SyntaxError(`Got "${token}" where an expression should be`);
			const op = OPERATORS[token as Operator];
			let prevToken = operatorStack[operatorStack.length - 1] || '(';
			let prevOp = OPERATORS[prevToken];
			while (op.associativity === "Left" ? op.precedence <= prevOp.precedence : op.precedence < prevOp.precedence) {
				outputQueue.push(operatorStack.pop()!);
				prevToken = operatorStack[operatorStack.length - 1] || '(';
				prevOp = OPERATORS[prevToken];
			}
			operatorStack.push(token as Operator);
			isExprExpected = true;
		} else if (token === "(") {
			if (!isExprExpected) throw new SyntaxError(`Got "(" where an operator should be`);
			operatorStack.push(token as Operator);
			isExprExpected = true;
		} else if (token === ")") {
			if (isExprExpected) throw new SyntaxError(`Got ")" where an expression should be`);
			while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
				outputQueue.push(operatorStack.pop()!);
			}
			operatorStack.pop();
			isExprExpected = false;
		} else {
			if (!isExprExpected) throw new SyntaxError(`Got "${token}" where an operator should be`);
			outputQueue.push(token);
			isExprExpected = false;
		}
	}
	if (isExprExpected) throw new SyntaxError(`Input ended where an expression should be`);
	while (operatorStack.length > 0) {
		const token = operatorStack.pop()!;
		if (token === '(') continue;
		outputQueue.push(token);
	}
	return outputQueue;
}

function solveRPN(rpn: string[]): [number, number] {
	let base = 10;
	const resultStack: number[] = [];
	for (let token of rpn) {
		if (token === 'negative') {
			if (!resultStack.length) throw new SyntaxError(`Unknown syntax error`);
			resultStack.push(-resultStack.pop()!);
		} else if (!"^%*/+-".includes(token)) {
			if (token.endsWith('h')) {
				// Convert h suffix for hexadecimal to 0x prefix
				token = `0x${token.slice(0, -1)}`;
			} else if (token.endsWith('o')) {
				// Convert o suffix for octal to 0o prefix
				token = `0o${token.slice(0, -1)}`;
			} else if (token.endsWith('b')) {
				// Convert b suffix for binary to 0b prefix
				token = `0b${token.slice(0, -1)}`;
			}
			if (token.startsWith('0x')) base = 16;
			if (token.startsWith('0b')) base = 2;
			if (token.startsWith('0o')) base = 8;
			let num = Number(token);
			if (isNaN(num) && token.toUpperCase() in Math) {
				// @ts-expect-error Math consts should be safe
				num = Math[token.toUpperCase()];
			}
			if (isNaN(num) && token !== 'NaN') {
				throw new SyntaxError(`Unrecognized token ${token}`);
			}
			resultStack.push(num);
		} else {
			if (resultStack.length < 2) throw new SyntaxError(`Unknown syntax error`);
			const a = resultStack.pop()!;
			const b = resultStack.pop()!;
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
			case "%":
				resultStack.push(b % a);
				break;
			case "^":
				resultStack.push(b ** a);
				break;
			}
		}
	}
	if (resultStack.length !== 1) throw new SyntaxError(`Unknown syntax error`);
	return [resultStack.pop()!, base];
}

export const commands: Chat.ChatCommands = {
	math: "calculate",
	calculate(target, room, user) {
		if (!target) return this.parse('/help calculate');

		let base = 0;
		const baseMatchResult = (/\b(?:in|to)\s+([a-zA-Z]+)\b/).exec(target);
		if (baseMatchResult) {
			switch (toID(baseMatchResult[1])) {
			case 'decimal': case 'dec': base = 10; break;
			case 'hexadecimal': case 'hex': base = 16; break;
			case 'octal': case 'oct': base = 8; break;
			case 'binary': case 'bin': base = 2; break;
			default:
				return this.errorReply(`Unrecognized base "${baseMatchResult[1]}". Valid options are binary or bin, octal or oct, decimal or dec, and hexadecimal or hex.`);
			}
		}
		const expression = target.replace(/\b(in|to)\s+([a-zA-Z]+)\b/g, '').trim();

		if (!this.runBroadcast()) return;
		try {
			const [result, inferredBase] = solveRPN(parseMathematicalExpression(expression));
			if (!base) base = inferredBase;
			let baseResult = '';
			if (Number.isFinite(result) && base !== 10) {
				baseResult = `${BASE_PREFIXES[base]}${result.toString(base).toUpperCase()}`;
				if (baseResult === expression) baseResult = '';
			}
			let resultStr = '';
			const resultTruncated = parseFloat(result.toPrecision(15));
			let resultDisplay = resultTruncated.toString();
			if (resultTruncated > 10 ** 15) {
				resultDisplay = resultTruncated.toExponential();
			}
			if (baseResult) {
				resultStr = `<strong>${baseResult}</strong> = ${resultDisplay}`;
			} else {
				resultStr = `<strong>${resultDisplay}</strong>`;
			}
			this.sendReplyBox(`${expression}<br />= ${resultStr}`);
		} catch (e: any) {
			this.sendReplyBox(
				Utils.html`${expression}<br />= <span class="message-error"><strong>Invalid input:</strong> ${e.message}</span>`
			);
		}
	},
	calculatehelp: [
		`/calculate [arithmetic question] - Calculates an arithmetical question. Supports PEMDAS (Parenthesis, Exponents, Multiplication, Division, Addition and Subtraction), pi and e.`,
		`/calculate [arithmetic question] in [base] - Returns the result in a specific base. [base] can be bin, oct, dec or hex.`,
	],
};
