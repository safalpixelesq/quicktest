'use strict'

const resolve = require('path').resolve

module.exports = {
	dev: process.env.NODE_ENV === 'development',
	srcDir: resolve(__dirname, '..', 'resources'),
	components: true,
	telemetry: false,
	loading: { color: '#ef413f' },
	css: ['@/assets/scss/app.scss'],
	plugins: [
		'~/plugins/vgtag.js',
		'~/plugins/vee-validate.js',
		'~plugins/vuedraggable.js',
		'~/plugins/vue-modal.js',
		{ src: '~/plugins/quill.js', ssr: false },
		{ src: '~plugins/uikit.js', ssr: false },
		{ src: '~/plugins/vue-upload.js', ssr: false },
		{ src: '~/plugins/font-picker.js', ssr: false },
		{ src: '~/plugins/vue-good-table', ssr: false },
	],
	buildModules: [
		'@nuxtjs/eslint-module',
		'@nuxtjs/stylelint-module',
		'@nuxt/image',
		'@nuxtjs/google-fonts',
	],
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/auth',
		'@nuxt/content',
		'vue-swatches/nuxt',
		'nuxt-clipboard2',
		['@nuxtjs/dotenv', { path: resolve(__dirname, '..') }],
	],

	image: {
		domains: ['https://assets.uiaas.io/'],
	},
	build: {
		transpile: ['vee-validate'],
	},
	head: {
		title: 'Pixelesq | UI as a Service' || '',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'twitter:card',
				name: 'twitter:card',
				content: 'Pixelesq | UI as a Service',
			},
			{ hid: 'twitter:site', name: 'twitter:site', content: '@pixelesq' },
			{
				hid: 'twitter:creator',
				name: 'twitter:creator',
				content: '@pixelesq',
			},
			{
				hid: 'twitter:title',
				name: 'twitter:title',
				content: 'Pixelesq | UI as a Service',
			},
			{
				hid: 'twitter:description',
				name: 'twitter:description',
				content:
					'Pixelesq enables developers, marketers, and entrepreneurs to create scalable, SEO-optimized and performant User Interfaces.',
			},
			{
				hid: 'twitter:image',
				name: 'twitter:image',
				content: 'https://assets.uiaas.io/web/home-social.jpg',
			},
			{
				hid: 'og:image',
				name: 'og:image',
				content: 'https://assets.uiaas.io/web/home-social.jpg',
			},
			{
				hid: 'description',
				name: 'description',
				content:
					'Pixelesq enables developers, marketers, and entrepreneurs to create scalable, SEO-optimized and performant User Interfaces.' ||
					'',
			},
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},
	render: {
		fallback: false,
	},
	router: {
		linkActiveClass: 'is-active',
		linkExactActiveClass: 'is-exact-active',
	},
	axios: {
		baseURL: process.env.API_URL || 'https://api.uiaas.io',
	},
	auth: {
		strategies: {
			local: {
				endpoints: {
					login: {
						url: '/api/auth/login',
						method: 'post',
						propertyName: 'token',
					},
					user: {
						url: '/api/auth/me',
						method: 'get',
						propertyName: false,
					},
					logout: false,
				},
				tokenRequired: true,
				tokenType: 'Bearer',
				autoFetchUser: true,
			},
		},
	},
	cookies: {
		necessary: [
			{
				name: 'Default Cookies',
				description: 'Used for cookie control.',
				cookies: [
					'cookie_control_consent',
					'cookie_control_enabled_cookies',
				],
			},
		],
		optional: [
			{
				name: 'Google Analitycs',
				description: 'Google GTM is...',
				src: 'https://www.googletagmanager.com/gtag/js?id=<API-KEY>',
				async: true,
				cookies: ['_ga', '_gat', '_gid'],
				accepted: () => {
					window.dataLayer = window.dataLayer || []
					window.dataLayer.push({
						'gtm.start': new Date().getTime(),
						event: 'gtm.js',
					})
				},
				declined: () => {},
			},
		],
	},
	googleFonts: {
		families: {
			// Inter: ['300', '400'],
			Poppins: ['400', '500', '600', '700'],
			Calistoga: ['400'],
		},
	},
}
