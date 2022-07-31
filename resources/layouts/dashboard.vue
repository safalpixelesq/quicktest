<template>
	<div class="">
		<Header
			:dark="false"
			:hero-bg-styles="'background: #fff'"
			:user="loggedInUser"
		/>
		<div class="lightbg" uk-height-viewport="expand: true">
			<!-- <header class="">
				<div id="dashboard" class="uk-container"></div>
			</header> -->
			<div class="uk-container">
				<div class="uk-grid uk-margin-top" data-uk-grid>
					<div class="uk-width-1-5@m">
						<div class="menu-left">
							<ul class="uk-tab uk-tab-left">
								<li v-for="(link, index) in links" :key="index">
									<nuxt-link
										class="nav-link uk-text-large uk-text-light"
										:to="link.url"
									>
										{{ link.label }}
									</nuxt-link>
								</li>
							</ul>
						</div>
					</div>
					<div class="uk-width-4-5@m"><nuxt /></div>
				</div>
			</div>
		</div>
		<Footer :dark="true" :minimal="true" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
	components: {
		// Navbar,
		Header,
		Footer,
	},
	middleware: 'auth',
	data() {
		return {
			links: [
				{
					label: 'Projects',
					url: '/projects',
				},
				{
					label: 'Account',
					url: '/account',
				},
			],
		}
	},
	computed: {
		...mapGetters(['isAuthenticated', 'loggedInUser']),
	},
}
</script>
<style scoped>
#settings {
	padding: 0;
}
.nav-link {
	/* padding-left: 0 !important; */
	padding: 0 !important;
	margin-bottom: 10px;
}

.nav-link.is-exact-active {
	color: var(--pw-primary) !important;
	font-weight: 500;
}
.menu-left {
	margin-top: 82px;
}
</style>
