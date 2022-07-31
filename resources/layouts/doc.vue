<template>
	<div>
		<Header :dark="false" />
		<!-- <Pagehero :hero="hero" /> -->
		<div class="uk-section form-bg">
			<div class="uk-container">
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-5@m">
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
							<div
								class="mt-10 text-base text-gray-500 uppercase mb-2"
							>
								<!-- Reference -->
							</div>
							<ul>
								<li v-for="link in apilinks" :key="link.title">
									<nuxt-link
										class="text-gray-600 text-lg block mb-2"
										:to="link.url"
										>{{ link.title }}</nuxt-link
									>
								</li>
							</ul>
						</div>
					</div>
					<div class="uk-width-4-5@m">
						<nuxt />
					</div>
				</div>
			</div>
		</div>

		<Footer :dark="true" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
// import Pagehero from '~/components/page/Pagehero.vue'

export default {
	components: {
		Header,
		Footer,
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
				{
					title: 'Introduction',
					url: '/docs',
				},
				{
					title: 'Using UI',
					url: '/docs/using-ui',
				},
				{
					title: 'Using API',
					url: '/docs/using-api',
				},
				{
					title: 'gethtml',
					url: '/docs/get-html',
				},
				{
					title: 'Reference',
					url: '/docs/style-ref',
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
.form-bg {
	background: linear-gradient(to bottom, #fff 30%, #f2f2f2 30%);
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
