<template>
	<footer
		v-if="!minimal"
		class="uk-section-muted uk-section-small uk-padding-remove-vertical"
	>
		<div class="uk-container">
			<div
				v-if="!minimal"
				class="uk-margin-small-bottom uk-margin-large-top"
			>
				<div
					class="uk-flex uk-flex-wrap uk-flex-center uk-text-center uk-flex-between uk-flex-middle"
				>
					<div
						class="uk-flex uk-flex-center uk-text-center"
						style="margin-left: 10px"
					>
						<Logo :colors="colors" :size="18"></Logo>
						<img
							:src="'/logotext-light.svg'"
							class=""
							style="height: 28px; margin-left: 12px"
							alt=""
						/>
					</div>
					<div
						class="uk-flex uk-flex-center uk-flex-wrap uk-margin-top"
					>
						<div
							v-for="(link, index2) in links"
							:key="index2"
							class="uk-display-inline-block uk-margin-left uk-margin-right"
						>
							<nuxt-link
								v-if="!link.external"
								:to="link.url"
								class="uk-button-text"
								>{{ link.label }}</nuxt-link
							>
							<a
								v-if="link.external"
								class="uk-button-text"
								target="_blank"
								rel="no-refferer"
								:href="link.url"
								>{{ link.label }}</a
							>
						</div>
					</div>
					<div class="uk-visible@m">
						<div class="uk-text-medium">
							<a
								v-for="(item, index) in social"
								:key="index + 'social'"
								target="_blank"
								class="uk-text-primary uk-icon-button"
								:class="index !== 0 ? 'uk-margin-left' : ''"
								rel="noopener"
								:data-uk-icon="item.icon"
								:href="item.url"
							></a>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-hidden@m">
				<div class="uk-flex-center uk-flex-right@m">
					<div class="uk-text-center">
						<a
							v-for="(item, index) in social"
							:key="index + 'social'"
							target="_blank"
							class="uk-text-primary uk-icon-button"
							:class="index !== 0 ? 'uk-margin-small-left' : ''"
							rel="noopener"
							:data-uk-icon="item.icon"
							:href="item.url"
						></a>
					</div>
				</div>
			</div>
			<!-- <div
					v-if="!minimal"
					:class="
						'grid grid-cols-2 my-5 sm:mt-0 sm:grid-cols-none sm:flex flex-wrap' +
						minimalLinks.length +
						' lg:grid-cols-5 gap-2'
					"
				>
					<a
						v-for="link in minimalLinks"
						:key="link.label"
						:href="link.url"
						class="
							text-gray-700 text-base
							hover:text-gray-800
							mr-6
							inline-block
						"
						>{{ link.label }}</a
					>
				</div> -->
			<!-- <hr v-if="!minimal" /> -->
		</div>
		<div class="copyright">
			<div class="uk-flex uk-flex-center">
				<div class="uk-text-small">
					&copy; 2022 Copyright | All rights reserved
				</div>
				<!-- <div class="uk-visible@m">
					<div class="uk-text-medium uk-text-large">
						Follow us on Twitter
						<a
							target="_blank"
							class="uk-text-primary uk-text-bold"
							rel="noopener"
							href="https://twitter.com/pixelesq"
							>@pixelesq</a
						>
					</div>
				</div> -->
			</div>
		</div>
	</footer>
</template>

<script>
// import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Logo from '~/components/Logo.vue'

export default {
	name: 'Footer',
	components: {
		// ValidationObserver,
		// ValidationProvider,
		Logo,
	},
	props: {
		transparent: {
			type: Boolean,
			default() {
				return false
			},
		},
		dark: {
			type: Boolean,
			required: true,
		},
		minimal: {
			type: Boolean,
			required: false,
			default() {
				return false
			},
		},
	},
	data() {
		return {
			mobileMenuOpen: false,
			fname: '',
			lname: '',
			apiurl: process.env.API_URL,
			colors: [
				{ color: '#FDC53F' },
				{ color: '#4777ED' },
				{ color: '#FB4D4A' },
				{ color: '#FB4D4A' },
				{ color: '#FDC53F' },
			],
			links: [
				{
					label: 'Modules',
					url: '/modules',
				},
				// {
				// 	label: 'Pricing',
				// 	url: '/pricing'
				// },
				// {
				// 	label: 'Early Access',
				// 	url: '/early-access'
				// },
				{
					label: 'FAQs',
					url: '/faq',
				},
				{
					label: 'Docs',
					url: '/docs',
				},
				{
					label: 'Terms & Conditions',
					url: '/legal/terms',
				},
				{
					label: 'Privacy Policy',
					url: '/legal/privacy-policy',
				},
			],
			footerLinks: [
				{
					title: '',
					links: [
						{
							label: 'Modules',
							url: '/modules',
						},
						// {
						// 	label: 'Pricing',
						// 	url: '/pricing'
						// },
						// {
						// 	label: 'Early Access',
						// 	url: '/early-access'
						// },
						{
							label: 'FAQs',
							url: '/faq',
						},
						{
							label: 'Docs',
							url: '/docs',
						},
						// {
						// 	label: 'Signup for Free',
						// 	url: '/signup'
						// }
					],
				},
				// {
				// 	title: '',
				// 	links: [
				// 		// {
				// 		// 	label: 'Documentation',
				// 		// 	url: '/docs/get-started'
				// 		// },
				// 		// {
				// 		// 	label: 'Guides',
				// 		// 	url: '/guides'
				// 		// },
				// 		// {
				// 		// 	label: 'System Status',
				// 		// 	url: 'https://staging.uiaas.io',
				// 		// 	external: true
				// 		// },
				// 		// {
				// 		// 	label: 'Logo',
				// 		// 	url: '/thelogo'
				// 		// }
				// 		// {
				// 		// 	label: 'FAQs',
				// 		// 	url: '/faq'
				// 		// }
				// 	]
				// },
				{
					title: '',
					links: [
						// {
						// 	label: 'About',
						// 	url: '/company/about'
						// },
						// {
						// 	label: 'Logo',
						// 	url: '/thelogo',
						// },
						{
							label: 'Terms & Conditions',
							url: '/legal/terms',
						},
						{
							label: 'Privacy Policy',
							url: '/legal/privacy-policy',
						},
						// {
						// 	label: 'Sitemap',
						// 	url: '/sitemap.xml',
						// 	external: true
						// }
					],
				},
			],
			email: '',
			notification: {
				message: '',
				type: '',
			},
			social: [
				{
					name: 'Linkedin',
					icon: 'linkedin',
					url: 'https://www.linkedin.com/company/pixelesq-uiaas/',
				},
				{
					name: 'Email',
					icon: 'mail',
					url: 'mailto:hello@pixelesq.com',
				},
				{
					name: 'Twitter',
					icon: 'twitter',
					url: 'https://twitter.com/pixelesq',
				},
			],
			minimalLinks: [
				{
					label: 'Documentation',
					url: '/docs/get-started',
				},
				{
					label: 'Guides',
					url: '/guides',
				},
				{
					label: 'System Status',
					url:
						process.env.NODE_ENV === 'production'
							? 'https://api.uiaas.io'
							: 'https://staging.uiaas.io',
					external: true,
				},
				{
					label: 'FAQs',
					url: '/faq',
				},
			],
		}
	},
	methods: {},
}
</script>
<style lang="scss" scoped>
.splitbg {
	background: linear-gradient(to bottom, #fff 50%, #f2f2f2 50%);
}
.trigsbg {
	// background: url('/svgs/trigs-bg.svg') no-repeat, #fff;
	background-color: #fff;
	background-size: 90%;
	background-position: center;
	padding: 80px 30px;
	border-radius: 20px;
	box-shadow: 0 4px 13px rgba(0, 0, 0, 0.15);
	overflow: hidden;
}

.tleft {
	position: absolute;
	width: 200px;
	height: 200px;
	top: 0;
	left: 0;
	background-image: url('/svgs/trigs-left.svg');
	background-size: contain;
	background-repeat: no-repeat;
}

.tright {
	position: absolute;
	width: 200px;
	height: 200px;
	right: 5px;
	bottom: -30px;
	background-image: url('/svgs/trigs-right.svg');
	background-size: contain;
	background-repeat: no-repeat;
}

.uk-button-text {
	font-weight: medium;
	transition: 0.3s ease-out;
	&:hover {
		text-decoration: none;
		color: var(--pw-primary) !important;
	}
}

.uk-input {
	height: 50px !important;
	border-radius: 4px !important;
	padding: 0 20px !important;
}

.uk-icon-button {
	border: 1px solid var(--pw-primary) !important;
	border-radius: 4px !important;
	width: 42px !important;
	height: 42px !important;
	&:hover {
		background-color: #ef413f !important;
		color: #fff !important;
	}
}

.error-space {
	margin-bottom: 35px !important;
}

.uk-button.uk-button-primary {
	line-height: 50px;
}
.error-msg {
	position: absolute;
	// left: -5px;
	top: 50px;
	color: var(--pw-primary);
	left: 0;
	font-size: 12px;
	font-weight: medium;
}

.copyright {
	background: #222;
	padding: 15px;
	margin-top: 20px;
	text-align: center;
	color: #ccc;
}
.cookieControl__Bar {
	background: #222 !important;
	// @apply rounded shadow bg-black tracking-wide font-sans;
	// h3 {
	// 	@apply font-semibold;
	// }
	// button {
	// 	padding-top: 0 !important;
	// 	padding-bottom: 0 !important;
	// 	border: 2px solid transparent !important;
	// 	border-color: #888 !important;
	// 	@apply h-10 pt-0 pb-0 font-medium border-2 border-secondary-900;
	// }
	// button:first-child {
	// 	@apply bg-transparent text-white border-gray-200;
	// }
	// button:last-child {
	// 	border-color: #005493 !important;
	// 	@apply bg-blue-400 text-white;
	// 	&:hover {
	// 		border-color: #aaa !important;
	// 		@apply bg-primary-light;
	// 	}
	// }
}
</style>
