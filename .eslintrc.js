module.exports = {
	root: true,

	env: {
		node: true,
	},

	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
	],

	parserOptions: {
		ecmaVersion: 2020,
	},

	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		'no-control-regex': 'off',
		indent: 'off',
		'vue/script-indent': [
			'error',
			'tab',
			{
				baseIndent: 1,
				switchCase: 1,
			},
		],
	},
};
