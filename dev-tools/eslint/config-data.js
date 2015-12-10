'use strict';

module.exports = {
	"extends": "./config-es6.js",
	"rules": {
		"comma-dangle": [2, "never"],
		"comma-spacing": [2, {"before": false, "after": false}],
		"no-restricted-syntax": [2,
			"ReturnStatement", "LabeledStatement", "BreakStatement", "ContinueStatement",
			"IfStatement", "SwitchStatement",
			"WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement",
			"FunctionDeclaration", "VariableDeclaration",
			"FunctionExpression",
			"UpdateExpression",
			"BinaryExpression", "LogicalExpression",
			"ConditionalExpression", "CallExpression", "NewExpression", "SequenceExpression"
		]
	}
};
