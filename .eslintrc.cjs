module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'plugin:storybook/recommended'],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'@typescript-eslint/no-explicit-any': 'off',
		'no-extra-boolean-cast': 'off',
		'prefer-const': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-inferrable-types': 'off'
	}
};
