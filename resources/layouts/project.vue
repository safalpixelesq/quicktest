<template>
	<div class="">
		<Header
			:dark="false"
			:hero-bg-styles="'background: #fff'"
			:user="loggedInUser"
		/>
		<div class="lightbg" uk-height-viewport="expand: true">
			<div class="uk-container">
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-5@m">
						<div class="menu-left" data-uk-sticky="offset:100">
							<div class="uk-margin-medium-bottom">
								<nuxt-link
									class="nav-link uk-text-light uk-text-large"
									to="/projects"
								>
									&#171; Projects
								</nuxt-link>
							</div>
							<ul class="uk-tab uk-tab-left">
								<li v-for="(link, index) in links" :key="index">
									<nuxt-link
										class="nav-link uk-text-large uk-text-light"
										:to="`/projects/${
											project && project.slug
										}${link.url}`"
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
import { mapGetters, mapState } from 'vuex'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
	name: 'Project',
	components: {
		Header,
		Footer,
	},
	middleware: 'auth',
	data() {
		return {
			links: [
				{
					label: 'Overview',
					url: '/',
				},
				{
					label: 'Pages',
					url: '/pages',
				},
				{
					label: 'Templates',
					url: '/templates',
				},
				{
					label: 'Collections',
					url: '/collections',
				},
				{
					label: 'Partials',
					url: '/partials',
				},
				{
					label: 'Themes',
					url: '/themes',
				},
				{
					label: 'Team',
					url: '/team',
				},
				{
					label: 'Settings',
					url: '/settings',
				},
			],
		}
	},
	computed: {
		...mapGetters(['loggedInUser']),
		...mapState({
			project: (state) => state.projects.project,
		}),
	},
}
</script>

<style scoped>
.nav-link.is-exact-active {
	color: var(--pw-primary) !important;
	font-weight: 500;
}
</style>
