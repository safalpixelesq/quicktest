<template>
	<div>
		<Header :dark="false" />
		<!-- <Pagehero :hero="hero" /> -->

		<div
			class="uk-section form-bg uk-position-relative uk-overflow-hidden"
			uk-height-viewport="expand: true"
		>
			<Splitbg></Splitbg>
			<div class="uk-container">
				<div class="hero uk-text-center uk-flex uk-flex-center">
					<div class="uk-width-1-2@m">
						<h1
							class="uk-h1 uk-text-bold uk-margin-medium-top uk-margin-small-bottom"
						>
							Documentation
						</h1>
						<div class="uk-text-large uk-margin-large-bottom">
							The UI as a Service (UIaaS), available at
							api.uiaas.io is a read-only API for delivering UI
							from Pixelesq to apps, websites and other media.
						</div>
					</div>
				</div>
				<div
					class="uk-flex uk-flex-center uk-margin-bottom uk-margin-top uk-position-relative"
				>
					<div class="uk-width-4-5@m">
						<div class="uk-grid">
							<div
								v-for="(link, index) in links"
								:key="index"
								class="uk-width-1-3@s uk-margin-medium-bottom"
							>
								<nuxt-link
									:to="link.url"
									class="uk-card uk-card-hover uk-card-default uk-border-radius uk-padding uk-display-block uk-link-toggle"
									:class="'uk-border-' + link.theme"
								>
									<h3 class="uk-text-bold">
										{{ link.title }}
									</h3>
									<!-- Lorem ipsum dolor sit amet consectetur
									adipisicing elit. Delectus, harum! -->
									<div class="uk-margin-top">Read Doc</div>
								</nuxt-link>
							</div>
						</div>
					</div>
				</div>
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-5@m uk-hidden">
						<div class="links">
							<!-- <ul class="mobile">
							<li v-for="link in links" :key="link.title">
								<nuxt-link
									class="text-gray-600 text-xl block mb-2 bg-gray-500 py-4 -ml-5 pl-5 -mr-5 inline-block"
									:to="link.url"
									>{{ link.title }}
								</nuxt-link>
							</li>
						</ul> -->
							<ul>
								<li v-for="link in links" :key="link.title">
									<nuxt-link class="" :to="link.url">{{
										link.title
									}}</nuxt-link>
									<ul class="">
										<li
											v-for="link2 in link.links"
											:key="link2.title"
										>
											<nuxt-link
												class=""
												:to="link2.url"
												>{{ link2.title }}</nuxt-link
											>
										</li>
									</ul>
								</li>
							</ul>
							<div class="">
								<!-- Reference -->
							</div>
							<ul>
								<li v-for="link in apilinks" :key="link.title">
									<nuxt-link class="" :to="link.url">{{
										link.title
									}}</nuxt-link>
								</li>
							</ul>
						</div>
					</div>
					<div class="uk-width-4-5@m uk-hidden">
						<nuxt />
					</div>
				</div>
			</div>
		</div>

		<Footer :dark="true"></Footer>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Splitbg from '~/components/misc/Splitbg.vue'

// import Pagehero from '~/components/page/Pagehero.vue'

export default {
	components: {
		Header,
		Footer,
		Splitbg,
		// Pagehero
	},
	data() {
		return {
			notification: {
				message: '',
				type: '',
			},
			hero: {
				title: 'Docs & Concepts',
				description:
					'A guide to quickly get up and running with Pixelesq',
				align: 'center',
			},
			links: [
				// {
				// 	title: 'Introduction',
				// 	url: '/docs',
				// },
				{
					title: 'Get Started',
					url: '/docs/get-started',
					theme: 'secondary',
				},
				{
					title: 'Using UI',
					url: '/docs/using-ui',
					theme: 'primary',
				},
				{
					title: 'Using API',
					url: '/docs/using-api',
					theme: 'primary',
				},
				{
					title: 'gethtml',
					url: '/docs/get-html',
					theme: 'tertiary',
				},
				{
					title: 'Reference',
					url: '/docs/style-ref',
					theme: 'tertiary',
				},
			],
			apilinks: [
				// {
				// 	title: 'Introduction',
				// 	url: '/docs/api/introduction'
				// },
				// {
				// 	title: 'Authentication',
				// 	url: '/docs/api/authentication'
				// },
				// {
				// 	title: 'gethtml API',
				// 	url: '/docs/api/get-html'
				// },
				// {
				// 	title: 'Style Config',
				// 	url: '/docs/api/style-config'
				// }
			],
		}
	},
	computed: {
		...mapGetters(['isAuthenticated', 'loggedInUser']),
	},
}
</script>

<style lang="scss" scoped>
.uk-card {
	border-radius: 8px;
	box-shadow: 0 4px 13px rgba(0, 0, 0, 0.15);
}
.form-bg {
	// background: linear-gradient(to bottom, #fff 30%, #f2f2f2 30%);
}

.uk-border-primary {
	border-bottom: 5px solid var(--pw-primary);
}

.uk-border-secondary {
	border-bottom: 5px solid var(--pw-secondary);
}

.uk-border-tertiary {
	border-bottom: 5px solid var(--pw-tertiary);
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

.links {
	box-shadow: 0 4px 13px rgba(0, 0, 0, 0.15);
	border-radius: 10px;
	overflow: hidden;
	ul {
		padding: 0;
		margin: 0;

		li {
			list-style-type: none;
			a {
				padding: 15px 20px;
				display: block;
				font-size: 18px;
				// color: var(--pw-primary);
				font-weight: medium;
				&:hover {
					background-color: var(--pw-primary);
					color: #fff;
					text-decoration: none;
				}
			}
			a.is-exact-active {
				background-color: var(--pw-primary);
				color: #fff;
			}
		}
	}
}

// .links {
// 	.mobile {
// 		a {
// 			display: none;
// 		}
// 		a.is-exact-active,
// 		a.is-active {
// 			display: block;
// 		}
// 	}
// }
</style>
