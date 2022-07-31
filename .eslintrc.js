module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	extends: [
		'@nuxtjs',
		'plugin:prettier/recommended',
		'plugin:nuxt/recommended',
		'plugin:cypress/recommended',
	],
	plugins: [],
	// add your custom rules here
	rules: {
		'no-console': 'off',
		'vue/no-v-html': 'off',
	},
	globals: {
		use: false,
	},
}
