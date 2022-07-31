module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
	// add your custom config here
	// https://stylelint.io/user-guide/configuration
	rules: {
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'extends',
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'mixin',
					'include',
					'if',
					'function',
					'return',
					'use',
					'debug',
				],
			},
		],
	},
}
